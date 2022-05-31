<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex';
import { query, whereClauseComponents, isoDate } from "../store/query-utils";
import AreaChart from '../vue-morris/components/area-chart.vue'
const store = useStore();

import { mapGetters } from '../store/map-state'
let { start, end, host, range, summary } = mapGetters();
const lineData = ref([]);
const loading = ref(true);

const hourly = computed(() => range.value < 2);
const xkey = computed(() => !!hourly.value ? 'hour' : 'date');

const dateFormat = (x) => !!hourly.value ? new Date(x).toLocaleString() : new Date(x).toLocaleDateString();

async function fetchData() {
  if (!host.value) {
    return loading.value = false;
  }

  if (range.value.length === 7 || range.value > 1000) {
    let data = [];

    let summary_value = JSON.parse(JSON.stringify(summary.value));
    let { pageviewsTimeseries } = summary_value;

    if (!pageviewsTimeseries) return;

    Object.keys(pageviewsTimeseries).forEach(key => {
      data.push({ date: key, value: pageviewsTimeseries[key] });
    });

    lineData.value = data;
    loading.value = false;

    return;
  }

  const whereClause = whereClauseComponents(store);
  let whereClauseLast = whereClause.split(' ').pop().replace(`'`, '').replace(`'`, '');
  let count = 'count(*)' || 'count(DISTINCT ip)';
  let token = hourly.value ? 'hour' : 'date';

  const sql = `SELECT ${ token }, ${ count } FROM visits${whereClause} GROUP BY ${ token } ORDER BY ${ token } ASC;`;
  // console.log(sql);

  let result = await query(sql);

  result.forEach(row => {
    if (!!hourly.value) row.hour = + new Date(`${ whereClauseLast }T${ row.hour < 10 ? '0':'' }${ row.hour }:00:00Z`);
    row.value = row['count(*)'];
    delete row['count(*)'];
  });
  // console.log('visits fetchData', result);
  lineData.value = result;
  loading.value = false;

  // Fetch "current visitors" and update store
  const live_visitors = `SELECT hour, count(*) FROM visits${ whereClauseComponents(store, 1) } AND date = '${ isoDate() }' GROUP BY hour`;
  const live_result = await query(live_visitors);
  const last_result = live_result.pop();
  // console.log('live_visitors', live_visitors, live_result, last_result);
  let live_visitor_count = 0;
  if (last_result) live_visitor_count = last_result['count(*)'];
  store.commit('setLiveVisitors', live_visitor_count);
}

onMounted(fetchData);
watch(host, fetchData);
watch(range, fetchData);
watch(summary, fetchData);
</script>

<template>
  <div id="visits">
    <div class="spinner-border spinme" role="status" v-if="loading"></div>
    <div v-else-if="!lineData.length">No data for selected period</div>
    <area-chart
        v-else
        id="line" :data="lineData" :xkey="xkey" ykey="value" resize="true"
        labels='[ "Visits" ]' line-color="#2847b7" fill-opacity="0.16"
        line-width="4" :dateFormat="dateFormat"
        grid="true" grid-text-weight="bold">
    </area-chart>
  </div>
</template>

<style scoped>
  #visits {
    height: 300px;
    margin-bottom: 30px;
  }
</style>