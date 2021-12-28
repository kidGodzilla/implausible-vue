<script setup>
import { queryCounts } from '../store/query-utils';
import { useStore } from 'vuex';
import { ref } from 'vue';
const store = useStore();

const { column, favicons, links, limit } = defineProps({
  column: String,
  favicons: Boolean,
  links: Boolean,
  limit: Number,
})

const referrers = ref([]);
const maxValue = ref(0);
const loading = ref(true);

async function getReferrers() {
  let result = await queryCounts(store, column, limit || 10);
  referrers.value = result;
  // console.log(result);
  maxValue.value = result[0]['count(*)'];
  loading.value = false;
}

getReferrers();
</script>

<template>
  <div class="mt-2 pseudotable">

    <div class="spinner-border spinme" role="status" v-if="loading"></div>

    <div class="mb-1" v-for="referrer in referrers" v-else>
      <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" :style="`width: ${ (referrer['count(*)'] / maxValue ) * 85 }%`">&nbsp;

        <span v-if="!referrer[column]">{{ 'Direct / None' }}</span>

        <img v-if="referrer[column] && favicons" :src="`https://logo.clearbit.com/${ referrer[column] }`" onerror="this.onerror=null; this.src='default.png';">&nbsp;

        <a
            v-if="referrer[column] && links" class="d-inline-block text-truncate"
            :href="`http://${ referrer['referer_host'] }`"
            target="_blank"
        >
          {{ referrer[column] }}
        </a>

        <span v-if="referrer[column] && !links">{{ referrer[column] }}</span>

      </div>
      <span class="float-right text-right pt-1">{{ referrer["count(*)"] }}</span>
    </div>

  </div>
</template>