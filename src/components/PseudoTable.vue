<script setup>
import { queryCounts } from '../store/query-utils';
import { useStore } from 'vuex';
import { ref } from 'vue';
const store = useStore();

const referrers = ref([]);
const maxValue = ref(0);

async function getReferrers() {
  let result = await queryCounts(store, 'referer_host');
  referrers.value = result;
  console.log(result);
  maxValue.value = result[0]['count(*)'];
}

getReferrers();


</script>

<template>
  <div class="mt-2 pseudotable">

    <div class="mb-1" v-for="referrer in referrers">
      <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" :style="`width: ${ (referrer['count(*)'] / maxValue ) * 85 }%`">&nbsp;

        <span v-if="!referrer['referer_host']">{{ 'Direct / None' }}</span>
        <img v-if="referrer['referer_host']" :src="`https://logo.clearbit.com/${ referrer['referer_host'] }`" onerror="this.onerror=null; this.src='default.png';">&nbsp;
        <a v-if="referrer['referer_host']" class="d-inline-block text-truncate" :href="`http://${ referrer['referer_host'] }`" target="_blank">{{ referrer['referer_host'] }}</a>

      </div>
      <span class="float-right text-right pt-1">{{ referrer["count(*)"] }}</span>
    </div>


<!--    <div class="mb-1">-->
<!--      <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" style="width: 51.85%">&nbsp;<img src="https://logo.clearbit.com/www.meetingroom365.com" onerror="this.onerror=null; this.src='default.png';">&nbsp;<a class="d-inline-block text-truncate" href="http://www.meetingroom365.com" target="_blank">www.meetingroom365.com</a></div>-->
<!--      <span class="float-right text-right pt-1">61</span>-->
<!--    </div>-->
<!--    <div class="mb-1">-->
<!--      <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" style="width: 16.15%">&nbsp;<img src="https://logo.clearbit.com/medium.com" onerror="this.onerror=null; this.src='default.png';">&nbsp;<a class="d-inline-block text-truncate" href="http://medium.com" target="_blank">medium.com</a></div>-->
<!--      <span class="float-right text-right pt-1">19</span>-->
<!--    </div>-->
<!--    <div class="mb-1">-->
<!--      <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" style="width: 2.55%">&nbsp;<img src="https://logo.clearbit.com/baidu.com" onerror="this.onerror=null; this.src='default.png';">&nbsp;<a class="d-inline-block text-truncate" href="http://baidu.com" target="_blank">baidu.com</a></div>-->
<!--      <span class="float-right text-right pt-1">3</span>-->
<!--    </div>-->
<!--    <div class="mb-1">-->
<!--      <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" style="width: 2.55%">&nbsp;<img src="https://logo.clearbit.com/www.reddit.com" onerror="this.onerror=null; this.src='default.png';">&nbsp;<a class="d-inline-block text-truncate" href="http://www.reddit.com" target="_blank">www.reddit.com</a></div>-->
<!--      <span class="float-right text-right pt-1">3</span>-->
<!--    </div>-->
<!--    <div class="mb-1">-->
<!--      <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" style="width: 1.7%">&nbsp;<img src="https://logo.clearbit.com/www.google.es" onerror="this.onerror=null; this.src='default.png';">&nbsp;<a class="d-inline-block text-truncate" href="http://www.google.es" target="_blank">www.google.es</a></div>-->
<!--      <span class="float-right text-right pt-1">2</span>-->
<!--    </div>-->
<!--    <div class="mb-1">-->
<!--      <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" style="width: 0.85%">&nbsp;<img src="https://logo.clearbit.com/www.google.com" onerror="this.onerror=null; this.src='default.png';">&nbsp;<a class="d-inline-block text-truncate" href="http://www.google.com" target="_blank">www.google.com</a></div>-->
<!--      <span class="float-right text-right pt-1">1</span>-->
<!--    </div>-->
<!--    <div class="mb-1">-->
<!--      <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" style="width: 0.85%">&nbsp;<img src="https://logo.clearbit.com/www.benq.com" onerror="this.onerror=null; this.src='default.png';">&nbsp;<a class="d-inline-block text-truncate" href="http://www.benq.com" target="_blank">www.benq.com</a></div>-->
<!--      <span class="float-right text-right pt-1">1</span>-->
<!--    </div>-->
<!--    <div class="mb-1">-->
<!--      <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" style="width: 0.85%">&nbsp;<img src="https://logo.clearbit.com/blog.meetingroom365.com" onerror="this.onerror=null; this.src='default.png';">&nbsp;<a class="d-inline-block text-truncate" href="http://blog.meetingroom365.com" target="_blank">blog.meetingroom365.com</a></div>-->
<!--      <span class="float-right text-right pt-1">1</span>-->
<!--    </div>-->
<!--    <div class="mb-1">-->
<!--      <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" style="width: 0.85%">&nbsp;<img src="https://logo.clearbit.com/dhelic98.github.io" onerror="this.onerror=null; this.src='default.png';">&nbsp;<a class="d-inline-block text-truncate" href="http://dhelic98.github.io" target="_blank">dhelic98.github.io</a></div>-->
<!--      <span class="float-right text-right pt-1">1</span>-->
<!--    </div>-->

  </div>
</template>