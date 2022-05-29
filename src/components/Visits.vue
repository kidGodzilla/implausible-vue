<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex';
import { query, whereClauseComponents, isoDate } from "../store/query-utils";
import AreaChart from '../vue-morris/components/area-chart.vue'
const store = useStore();

import { mapGetters } from '../store/map-state'
let { start, end, host, range } = mapGetters();
const lineData = ref([]);
const loading = ref(true);

const hourly = computed(() => Math.floor(start.value / 10000) === Math.floor(end.value / 10000));
const xkey = computed(() => hourly.value ? 'hour' : 'date');

const dateFormat = (x) => hourly.value ? new Date(x).toString() : new Date(x).toLocaleString().split(',')[0]

async function fetchData() {
  if (!host.value) {
    return loading.value = false;
  }

  const whereClause = whereClauseComponents(store);
  let whereClauseLast = whereClause.split(' ').pop().replace(`'`, '').replace(`'`, '');
  // console.log('whereClause', whereClause, whereClauseLast);

  const sql = hourly.value ? `SELECT hour, count(*) FROM visits${whereClause} GROUP BY hour ORDER BY hour ASC;`
                     : `SELECT date, count(*) FROM visits${whereClause} GROUP BY date ORDER BY date ASC;`;
  // console.log(sql);

  let result = await query(sql);

  result.forEach(row => {
    if (hourly.value) row.hour = + new Date(`${ whereClauseLast } ${ row.hour }:00:00 UTC`);
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