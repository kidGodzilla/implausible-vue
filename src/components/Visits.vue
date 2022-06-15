<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex';
import { query, whereClauseComponents, isoDate } from "../store/query-utils";
import AreaChart from '../vue-morris/components/area-chart.vue'
import Popper from "vue3-popper";
const store = useStore();

import { mapGetters } from '../store/map-state'
let { start, end, host, path, os, device, is_bot, is_new, browser, language, referrer, utm_source, utm_medium, utm_campaign, country, event, range, summary, showVisitors } = mapGetters();
const lineData = ref([]);
const loading = ref(true);
const roughEdge = ref(false);

const chartDate = ref(null);

const hourly = computed(() => range.value < 2);
const xkey = computed(() => !!hourly.value ? 'hour' : 'date');

const dateFormat = (x) => !!hourly.value ? new Date(x).toLocaleString() : `${ new Date(x).toLocaleString(navigator.language || 'en-us', { weekday: 'long' }) },\n${ new Date(x).toLocaleDateString() }`;
// ${ new Date(x).toLocaleString(navigator.language || 'en-us', { weekday: 'long' }) }

const labelFormat = (x, i) => !!hourly.value ? (new Date(x).toLocaleString().split(',')[1] || new Date(x).toLocaleString().split(' ')[1] || new Date(x).toLocaleString()) : `${ new Date(x).toLocaleString(navigator.language || 'en-us', { weekday: 'long' }) },\n${ new Date(x).toLocaleDateString() }`;

const xLabel = ref('day');

async function fetchData() {
  if (!host.value) {
    return loading.value = false;
  }

  if (range.value > 1000) xLabel.value = 'month';
  else xLabel.value = hourly.value ? 'hour' : 'day';

  // if (range.value.length === 7 || range.value > 1000) {
  //   let data = [];
  //
  //   let summary_value = JSON.parse(JSON.stringify(summary.value));
  //   let { pageviewsTimeseries, visitorsTimeseries } = summary_value;
  //
  //   if (!pageviewsTimeseries || !pageviewsTimeseries) return;
  //
  //   Object.keys(showVisitors.value ?visitorsTimeseries : pageviewsTimeseries).forEach(key => {
  //     data.push({ date: key, value: (showVisitors.value ?visitorsTimeseries : pageviewsTimeseries)[key] });
  //   });
  //
  //   lineData.value = data;
  //   loading.value = false;
  //
  //   return;
  // }

  const whereClause = whereClauseComponents(store);
  let whereClauseLast = whereClause.split(' ').pop().replace(`'`, '').replace(`'`, '');
  let count = showVisitors.value ? 'count(DISTINCT ip)' : 'count(*)';
  let token = hourly.value ? 'hour' : 'date';

  const sql = `SELECT ${ token }, ${ count } FROM visits${whereClause} GROUP BY ${ token } ORDER BY ${ token } ASC;`;
  // console.log(sql);

  let result = await query(sql);

  result.forEach(row => {
    if (!!hourly.value) row.hour = + new Date(`${ whereClauseLast }T${ row.hour < 10 ? '0':'' }${ row.hour }:00:00Z`);
    row.value = row['count(DISTINCT ip)'] || row['count(*)'];
    delete row['count(DISTINCT ip)'];
    delete row['count(*)'];
  });
  // console.log('visits fetchData', result);

  if (result.filter(x => x.date == new Date().toISOString().split('T')[0]).length || range.value == 1) roughEdge.value = true;
  else roughEdge.value = false;

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

function hoverCallback (index, options, content, row) {
  if (row.date) chartDate.value = row.date;
  return(content);
}

function setRange(v, show) {
  store.commit('setRange', v);
}

function chartClick() {
  // console.log('chart clicked', chartDate.value);

  // Navigate to date if in range
  if (chartDate.value) {
    let diff = new Date() - new Date(chartDate.value);
    let r = Math.floor(diff / 86400000) * -1;
    if (r > -33 && r < 2) setRange(r);
  }
}

function chartClickOut() {
  if (range.value === 1 || range.value < 0) {
    setRange(7);
  }
  // else if (range.value === 7) {
  //   setRange(30);
  // }
}

onMounted(fetchData);
watch(host, fetchData);
watch(path, fetchData);
watch(range, fetchData);
// watch(summary, fetchData);
watch(showVisitors, fetchData);
watch(os, fetchData);
watch(device, fetchData);
watch(is_bot, fetchData);
watch(is_new, fetchData);
watch(browser, fetchData);
watch(language, fetchData);
watch(referrer, fetchData);
watch(utm_source, fetchData);
watch(utm_medium, fetchData);
watch(utm_campaign, fetchData);
watch(country, fetchData);
watch(event, fetchData);
</script>

<template>
  <div id="visits">
    <div class="spinner-border spinme" role="status" v-if="loading"></div>
    <div v-else-if="!lineData.length">No data for selected period</div>
    <area-chart
        v-else
        id="line" :data="lineData" :xkey="xkey" ykey="value" resize="true"
        :labels='showVisitors ? `[ "Visitors" ]` : `[ "Pageviews" ]`' line-color="#2847b7" fill-opacity="0.16"
        line-width="4" :dateFormat="dateFormat" :smooth="false" xLabelAngle="45"
        removed data-xLabelFormat="labelFormat" data-xLabels="xLabel"
        :hoverCallback="hoverCallback" @click="chartClick" @dblclick="chartClickOut"
        grid="true" grid-text-weight="bold">
    </area-chart>
<!--    <Popper class="top-right" v-if="roughEdge" hover content="Incomplete data for final time period in chart" placement="left">-->
<!--      <i class="bi bi-exclamation-triangle-fill"></i>-->
<!--    </Popper>-->
<!--    <div class="top-right" v-show="roughEdge">-->
<!--      <i class="bi bi-exclamation-triangle-fill"></i>&nbsp;-->
<!--      Incomplete datapoint-->
<!--    </div>-->
    <div class="edge" v-show="roughEdge"></div>
  </div>
</template>

<style scoped>
  #visits {
    height: 300px;
    margin-bottom: 30px;
    position: relative;
  }
  .top-right {
    position: absolute;
    font-size: 1.75rem;
    color: #da292e;
    right: 1rem;
    z-index: 9;
    top: 0;
  }
  /*div.top-right {*/
  /*  transform: rotate(-90deg);*/
  /*  opacity: 0.7;*/
  /*  font-size:1rem;*/
  /*  right: -4.5rem;*/
  /*  top: 6.5rem;*/
  /*}*/
  body.dark .top-right {
    /*right: -3.5rem;*/
    color: #fff;
  }

  .edge {
    pointer-events: none;
    position: absolute;
    bottom: 30px;
    right: 0;
    top: 0;
    width: 120px;
    background: linear-gradient(270deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 25%, rgba(255,255,255,0) 100%);
  }
  body.dark .edge {
    /*background: linear-gradient(270deg, rgba(32,55,76,1) 0%, rgba(32,55,76,1) 25%, rgba(32,55,76,0) 100%);*/
    background: linear-gradient(270deg, rgba(var(--bs-dark-rgb), var(--bs-bg-opacity)) 0%, rgba(var(--bs-dark-rgb), var(--bs-bg-opacity)) 25%, rgba(var(--bs-dark-rgb), 0) 100%);
  }
</style>
<style>
svg circle:last-of-type {
  fill: transparent;
  stroke: transparent;
}
</style>