<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex';
import { query, whereClauseComponents } from "../store/query-utils";
import AreaChart from '../vue-morris/components/area-chart.vue'
const store = useStore();

import { mapGetters } from '../store/map-state'
let { start, end } = mapGetters();
const lineData = ref([]);
const loading = ref(true);

const hourly = computed(() => Math.floor(start.value / 10000) === Math.floor(end.value / 10000));
const xkey = computed(() => hourly.value ? 'hour' : 'date');

const dateFormat = (x) => hourly.value ? new Date(x).toString() : new Date(x).toLocaleString().split(',')[0]

async function fetchData() {
  const whereClause = whereClauseComponents(store);
  let whereClauseLast = whereClause.split(' ').pop().replace(`'`, '').replace(`'`, '');
  // console.log('whereClause', whereClause, whereClauseLast);

  const sql = hourly.value ? `SELECT hour, count(*) FROM visits${whereClause} GROUP BY hour ORDER BY hour ASC;`
                     : `SELECT date, count(*) FROM visits${whereClause} GROUP BY date ORDER BY date ASC;`;
  // console.log(sql);

  let result = await query(sql);
  result.forEach(row => {
    if (hourly.value) row.hour = new Date(whereClauseLast).setHours(row.hour);
    row.value = row['count(*)'];
    delete row['count(*)'];
  });
  // console.log('visits fetchData', result);
  lineData.value = result;
  loading.value = false;

}

fetchData();

</script>

<template>
  <div id="visits">
    <div class="spinner-border spinme" role="status" v-if="loading"></div>
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