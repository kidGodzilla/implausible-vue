<script setup>
import {queryCounts, queryLoadTimes} from '../store/query-utils';
import { mapGetters } from '../store/map-state';
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
const store = useStore();

const { column, favicons, links, limit, defaultText, valueColumn, loadTimes, valueFormatter, keyFormatter } = defineProps({
  column: String,
  favicons: Boolean,
  links: Boolean,
  limit: Number,
  defaultText: String,
  valueColumn: String,
  loadTimes: Boolean,
  valueFormatter: Function,
  keyFormatter: Function,
});

const { host, range } = mapGetters();

const rows = ref([]);
const maxValue = ref(0);
const loading = ref(true);

async function getData() {
  let result = loadTimes ? await queryLoadTimes(store) : await queryCounts(store, column, limit || 10);

  // console.log('result', column, result);

  rows.value = result;
  // console.log(result);
  maxValue.value = result[0][valueColumn || 'count(*)'];
  loading.value = false;
}


onMounted(getData);
watch(host, getData);
watch(range, getData);
</script>

<template>
  <div class="mt-2 pseudotable">

    <div class="spinner-border spinme" role="status" v-if="loading"></div>

    <div class="mb-1" v-for="row in rows" v-else>
      <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" :style="`width: ${ (row[valueColumn || 'count(*)'] / maxValue ) * 85 }%`">&nbsp;

        <span v-if="!row[column]">{{ defaultText || 'None' }}</span>

        <div v-if="favicons" style="display:inline-block">
          <img v-if="row[column] && favicons" :src="`https://logo.clearbit.com/${ row[column] }`" onerror="this.onerror=null; this.src='default.png';">&nbsp;
        </div>

        <div v-if="links" style="display:inline-block">
          <a
              v-if="row[column] && links" class="d-inline-block text-truncate"
              :href="`http://${ row[column] }`"
              target="_blank"
          >
            {{ row[column] }}
          </a>
        </div>

        <span v-if="row[column] && !links">{{ keyFormatter ? keyFormatter(row[column]) : row[column] }}</span>

      </div>
      <span class="float-right text-right pt-1">{{ valueFormatter ? valueFormatter(row[valueColumn || "count(*)"]) : row[valueColumn || "count(*)"] }}</span>
    </div>

  </div>
</template>