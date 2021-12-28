<script setup>
import { queryCounts } from '../store/query-utils';
import { useStore } from 'vuex';
import { ref } from 'vue';
const store = useStore();

defineProps({
})

const referrers = ref([]);
const maxValue = ref(0);
const loading = ref(true);

async function getReferrers() {
  let result = await queryCounts(store, 'referer_host');
  referrers.value = result;
  console.log(result);
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

        <span v-if="!referrer['referer_host']">{{ 'Direct / None' }}</span>
        <img v-if="referrer['referer_host']" :src="`https://logo.clearbit.com/${ referrer['referer_host'] }`" onerror="this.onerror=null; this.src='default.png';">&nbsp;
        <a v-if="referrer['referer_host']" class="d-inline-block text-truncate" :href="`http://${ referrer['referer_host'] }`" target="_blank">{{ referrer['referer_host'] }}</a>

      </div>
      <span class="float-right text-right pt-1">{{ referrer["count(*)"] }}</span>
    </div>

  </div>
</template>