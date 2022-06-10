<script setup>
import { onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex';
import { query, whereClauseComponents } from "../store/query-utils";
import { mapGetters } from "../store/map-state";
const store = useStore();

const props = defineProps({
  title: String,
  underline: Boolean,
  muted: { type: Boolean, default: true },
});

let stat = ref('-');
const { host, path, os, device, is_bot, is_new, browser, language, referrer, utm_source, utm_medium, utm_campaign, country, range, summary } = mapGetters();

// Visitors: SELECT count(DISTINCT ip) from visits
// Pageviews: SELECT count(*) from VISITS whereclause
// Bounce Rate: onePageVisits / visitorCount -- SELECT count(DISTINCT ip) from visits where is_new = 1 / visitorCount
// Max session lengths for all users: SELECT ip, max(session_length) as MaxValue from visits GROUP BY ip
// Avg. Session Length: SELECT AVG(x.MaxValue) FROM (SELECT ip, max(session_length) as MaxValue from visits GROUP BY ip) x

function percentFormatter(float) {
  return `${(float * 100).toFixed(2)}%`;
}

function localify(n) {
  if (n == parseInt(n)) n = parseInt(n);
  if (typeof n === 'number') n = n.toLocaleString();
  return n;
}

function fmtMSS(s) { return(s-(s%=60))/60+('m ')+parseInt(s) }

async function getValue() {
  if (!store.state.host) return;

  // if (range.value.length === 7 || range.value > 1000) {
  //
  //   if (props.title === 'Visitors') {
  //     stat.value = summary.value.visitors;
  //
  //   } else if (props.title === 'Total Pageviews') {
  //     stat.value = summary.value.pageviews;
  //
  //   } else if (props.title === 'Bounce Rate') {
  //     stat.value = percentFormatter(summary.value.onePageVisits / summary.value.visitors);
  //
  //   } else if (props.title === 'Session Length') {
  //     stat.value = fmtMSS(summary.value.sessionLength);
  //   }
  //
  //   return;
  // }

  const whereClause = whereClauseComponents(store);

  if (props.title === 'Visitors') {
    const sql = `SELECT count(DISTINCT ip) from visits${whereClause}`;
    let result = await query(sql);
    stat.value = result[0]['count(DISTINCT ip)'];

  } else if (props.title === 'Total Pageviews') {
    const sql = `SELECT count(*) from VISITS${whereClause}`;
    let result = await query(sql);
    stat.value = result[0]['count(*)'];

  } else if (props.title === 'Bounce Rate') {
    let sql = `SELECT count(DISTINCT ip) from visits${whereClause}`;
    let result = await query(sql);
    let visitorCount = result[0]['count(DISTINCT ip)'];

    sql = `SELECT count(DISTINCT ip) from visits${whereClause} AND is_new = 1`;
    result = await query(sql);
    let onePageVisits = result[0]['count(DISTINCT ip)'];

    stat.value = visitorCount === 0 ? 0 : percentFormatter(onePageVisits / visitorCount);

  } else if (props.title === 'Session Length') {
    const sql = `SELECT AVG(x.MaxValue) FROM (SELECT ip, max(session_length) as MaxValue from visits${whereClause} GROUP BY ip) x`;
    let result = await query(sql);
    stat.value = fmtMSS(result[0]['AVG(x.MaxValue)']) || 0;
  }
}

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
</script>

<template>
  <div class="col-6 col-md-3" :class="{ cp: underline, selected: !muted && !underline }">
    <h6 class="card-subtitle mb-2" :class="{ 'text-muted': muted, 'text-decoration-underline': underline, 'link-color': underline }">{{ title }}</h6>
    <h4 class="card-title">{{ localify(stat) }}</h4>
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
</style>