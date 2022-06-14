<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useStore } from 'vuex';
import { query, whereClauseComponents } from "../store/query-utils";
import { mapGetters } from "../store/map-state";
import Popper from "vue3-popper";
const store = useStore();

const props = defineProps({
  title: String,
  tooltip: String,
  underline: Boolean,
  muted: { type: Boolean, default: true },
});

const prior = ref('0');
const statRaw = ref('0');
const { host, path, os, device, is_bot, is_new, browser, language, referrer, utm_source, utm_medium, utm_campaign, country, event, range, start, summary } = mapGetters();

// Visitors: SELECT count(DISTINCT ip) from visits
// Pageviews: SELECT count(*) from VISITS whereclause
// Bounce Rate: onePageVisits / visitorCount -- SELECT count(DISTINCT ip) from visits where is_new = 1 / visitorCount
// Max session lengths for all users: SELECT ip, max(session_length) as MaxValue from visits GROUP BY ip
// Avg. Session Length: SELECT AVG(x.MaxValue) FROM (SELECT ip, max(session_length) as MaxValue from visits GROUP BY ip) x

function percentFormatter(float) {
  return `${ parseFloat( (float * 100).toFixed(2) ).toLocaleString() }%`;
}

function localify(n) {
  if (n == parseInt(n)) n = parseInt(n);
  if (typeof n === 'number') n = n.toLocaleString();
  return n;
}

function fmtMSS(s) { return(s-(s%=60))/60+('m ')+parseInt(s)+'s' }

let percentChange = computed(() => {
  let change = (statRaw.value - prior.value) / prior.value;
  // console.log('percentChange', prior.value, statRaw.value, change);
  if (!prior.value) return 0;
  return change;
});

function isNeg(val) {
  if (props.title === 'Bounce Rate') return percentChange.value > 0;

  return percentChange.value < 0;
}

async function getValue() {
  if (!store.state.host) return;

  const whereClause = whereClauseComponents(store);

  if (props.title === 'Visitors') {
    const sql = `SELECT count(DISTINCT ip) from visits${whereClause}`;
    let result = await query(sql);

    statRaw.value = result[0]['count(DISTINCT ip)'];

  } else if (props.title === 'Total Pageviews') {
    const sql = `SELECT count(*) from VISITS${whereClause}`;
    let result = await query(sql);

    statRaw.value = result[0]['count(*)'];

  } else if (props.title === 'Bounce Rate') {
    let sql = `SELECT count(DISTINCT ip) from visits${whereClause}`;
    let result = await query(sql);
    let visitorCount = result[0]['count(DISTINCT ip)'];

    sql = `SELECT count(DISTINCT ip) from visits${whereClause} AND is_new = 1`;
    result = await query(sql);
    let onePageVisits = result[0]['count(DISTINCT ip)'];

    statRaw.value = visitorCount === 0 ? 0 : (onePageVisits / visitorCount);

  } else if (props.title === 'Session Length') {
    const sql = `SELECT AVG(x.MaxValue) FROM (SELECT ip, max(session_length) as MaxValue from visits${whereClause} GROUP BY ip) x`;
    let result = await query(sql);

    statRaw.value = result[0]['AVG(x.MaxValue)'];
  }

  getPriorValue();
}

async function getPriorValue(comparison) {
  if (!store.state.host) return;

  const whereClause = whereClauseComponents(store, 0, 1);

  if (props.title === 'Visitors') {
    const sql = `SELECT count(DISTINCT ip) from visits${whereClause}`;
    let result = await query(sql);

    prior.value = result[0]['count(DISTINCT ip)'];

  } else if (props.title === 'Total Pageviews') {
    const sql = `SELECT count(*) from VISITS${whereClause}`;
    let result = await query(sql);

    prior.value = result[0]['count(*)'];

  } else if (props.title === 'Bounce Rate') {
    let sql = `SELECT count(DISTINCT ip) from visits${whereClause}`;
    let result = await query(sql);
    let visitorCount = result[0]['count(DISTINCT ip)'];

    sql = `SELECT count(DISTINCT ip) from visits${whereClause} AND is_new = 1`;
    result = await query(sql);
    let onePageVisits = result[0]['count(DISTINCT ip)'];

    prior.value = visitorCount === 0 ? 0 : (onePageVisits / visitorCount);

  } else if (props.title === 'Session Length') {
    const sql = `SELECT AVG(x.MaxValue) FROM (SELECT ip, max(session_length) as MaxValue from visits${whereClause} GROUP BY ip) x`;
    let result = await query(sql);

    prior.value = result[0]['AVG(x.MaxValue)'];
  }
}

const stat = computed(() => {
  console.log('range', range);
  if (props.title === 'Visitors') {
    return statRaw.value;

  } else if (props.title === 'Total Pageviews') {
    return statRaw.value;

  } else if (props.title === 'Bounce Rate') {
    return statRaw.value ? percentFormatter(statRaw.value) : 0;

  } else if (props.title === 'Session Length') {
    return fmtMSS(statRaw.value) || 0;
  }
})

onMounted(getValue);
watch(host, getValue);
watch(path, getValue);
watch(range, getValue);
// watch(summary, getValue);

watch(os, getValue);
watch(device, getValue);
watch(is_bot, getValue);
watch(is_new, getValue);
watch(browser, getValue);
watch(language, getValue);
watch(referrer, getValue);
watch(utm_source, getValue);
watch(utm_medium, getValue);
watch(utm_campaign, getValue);
watch(country, getValue);
watch(event, getValue);

// watch(statRaw, () => getValue(1))
</script>

<template>
  <div class="col-6 col-md-3" :class="{ cp: underline, selected: !muted && !underline }">

    <h6 class="card-subtitle mb-2" :class="{ 'text-muted': muted, 'text-decoration-underline': underline, 'link-color': underline }">
      <Popper v-if="tooltip" :class="{ 'text-decoration-underline': underline }" hover :content="tooltip" placement="bottom">
        {{ title }}
      </Popper>
      <span v-else>{{ title }}</span>
    </h6>

    <h4 class="card-title mb-1">{{ localify(stat) }}</h4>
    <span class="badge rounded-pill" v-show="percentChange" :class="{ 'bg-danger': isNeg(percentChange), 'bg-success': !isNeg(percentChange) }">{{ (percentChange > 0 ? '+':'') + percentFormatter(percentChange) }}</span>
  </div>
</template>

<style scoped>
body.dark .link-color { color: #4c9be8 !important; }
.link-color { color: #3459e6 !important; }
.cp { cursor: pointer; user-select: none; }

/*.selected { border-radius: 0.2rem; padding-top: 0.9rem; margin-top: -0.9rem; }*/
/*.selected { color: #fff !important; background-color: #3459e6; }*/
/*.selected h6 { color: #fff }*/
/*body.dark .selected { color: #fff; background-color: #4c9be8bb; }*/

body.dark .badge { padding: 0.35em 0.65em 0.3em }
</style>