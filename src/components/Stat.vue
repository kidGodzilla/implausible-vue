<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex';
import { query, whereClauseComponents } from "../store/query-utils";
const store = useStore();

const props = defineProps({
  title: String,
})

let stat = ref('-');

// Visitors: SELECT count(DISTINCT ip) from visits
// Pageviews: SELECT count(*) from VISITS whereclause
// Bounce Rate: onePageVisits / visitorCount -- SELECT count(DISTINCT ip) from visits where is_new = 1 / visitorCount
// Max session lengths for all users: SELECT ip, max(session_length) as MaxValue from visits GROUP BY ip
// Avg. Session Length: SELECT AVG(x.MaxValue) FROM (SELECT ip, max(session_length) as MaxValue from visits GROUP BY ip) x

function percentFormatter(float) {
  return `${(float * 100).toFixed(2)}%`;
}

function fmtMSS(s) { return(s-(s%=60))/60+('m ')+parseInt(s) }

async function getValue() {
  const whereClause = whereClauseComponents(store);
  console.log('whereClause', whereClause);

  if (props.title === 'Visitors') {
    const sql = `SELECT count(DISTINCT ip) from visits${whereClause}`;
    console.log(sql);

    let result = await query(sql);
    console.log(result, result[0]['count(DISTINCT ip)']);
    stat.value = result[0]['count(DISTINCT ip)'];

  } else if (props.title === 'Total Pageviews') {
    const sql = `SELECT count(*) from VISITS${whereClause}`;
    console.log(sql);

    let result = await query(sql);
    console.log(result, result[0]['count(*)']);

    stat.value = result[0]['count(*)'];

  } else if (props.title === 'Bounce Rate') {
    let sql = `SELECT count(DISTINCT ip) from visits${whereClause}`;
    console.log(sql);

    let result = await query(sql);
    console.log(result, result[0]['count(DISTINCT ip)']);

    let visitorCount = result[0]['count(DISTINCT ip)'];

    sql = `SELECT count(DISTINCT ip) from visits${whereClause} AND is_new = 1`;
    console.log(sql);

    result = await query(sql);
    console.log(result, result[0]['count(DISTINCT ip)']);

    let onePageVisits = result[0]['count(DISTINCT ip)'];

    console.log('onePageVisits / visitorCount', onePageVisits / visitorCount, onePageVisits, visitorCount)

    stat.value = visitorCount === 0 ? 0 : percentFormatter(onePageVisits / visitorCount);


  } else if (props.title === 'Session Length') {
    const sql = `SELECT AVG(x.MaxValue) FROM (SELECT ip, max(session_length) as MaxValue from visits${whereClause} GROUP BY ip) x`;
    console.log(sql);

    let result = await query(sql);
    console.log(result, result[0]['AVG(x.MaxValue)']);

    stat.value = fmtMSS(result[0]['AVG(x.MaxValue)']) || 0;

  }
}

getValue();



</script>

<template>
  <div class="col-6 col-md-3">
    <h6 class="card-subtitle mb-2 text-muted">{{ title }}</h6>
    <h4 class="card-title">{{ stat }}</h4>
  </div>
</template>