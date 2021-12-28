<script setup>
import {queryCounts, queryLoadTimes} from '../store/query-utils';
import { useStore } from 'vuex';
import { ref } from 'vue';
const store = useStore();

const { column, favicons, links, limit, defaultText, valueColumn, loadTimes, formatter } = defineProps({
  column: String,
  favicons: Boolean,
  links: Boolean,
  limit: Number,
  defaultText: String,
  valueColumn: String,
  loadTimes: Boolean,
  formatter: Function,
});

const rows = ref([]);
const maxValue = ref(0);
const loading = ref(true);

async function getReferrers() {
  let result = loadTimes ? await queryLoadTimes(store) : await queryCounts(store, column, limit || 10);

  // console.log('result', column, result);

  rows.value = result;
  // console.log(result);
  maxValue.value = result[0][valueColumn || 'count(*)'];
  loading.value = false;
}


getReferrers();
</script>

<template>
  <div class="mt-2 pseudotable">

    <div class="spinner-border spinme" role="status" v-if="loading"></div>

    <div class="mb-1" v-for="row in rows" v-else>
      <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" :style="`width: ${ (row[valueColumn || 'count(*)'] / maxValue ) * 85 }%`">&nbsp;

        <span v-if="!row[column]">{{ defaultText || 'None' }}</span>

        <img v-if="row[column] && favicons" :src="`https://logo.clearbit.com/${ row[column] }`" onerror="this.onerror=null; this.src='default.png';">&nbsp;

        <a
            v-if="row[column] && links" class="d-inline-block text-truncate"
            :href="`http://${ row[column] }`"
            target="_blank"
        >
          {{ row[column] }}
        </a>

        <span v-if="row[column] && !links">{{ row[column] }}</span>

      </div>
      <span class="float-right text-right pt-1">{{ formatter ? formatter(row[valueColumn || "count(*)"]) : row[valueColumn || "count(*)"] }}</span>
    </div>

  </div>
</template>