<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

import Footer from './components/Footer.vue';
import Header from './components/Header.vue';
import Modal from './components/Modal.vue';
import Body from './components/Body.vue';

const store = useStore();

import { query, queryDomains, queryCounts } from './store/query-utils';

queryDomains(store);
// queryCounts(store, 'pathname');

let queryParams = {};
location.search.slice(1).split('&').map(s => s.split('=')).forEach(a => queryParams[a[0]] = a[1]);
store.commit('setHost', queryParams.host || 'analytics.serv.rs');

store.commit('setRange', queryParams.range);





</script>

<template>
  <Header />
  <Body />
  <Footer />
  <Modal />
</template>

<style>
.svgMap-map-wrapper { background: transparent }
.text-right { text-align: right !important }
.min-357 { min-height: 357px; height: 100% }
.bg-grey:hover { background: #2847b714 }
.bg-grey { background: #2847b729 }
.w-495 { width: 49.5% !important }
.float-right { float: right }
.cursor-help { cursor: help }
.cp { cursor: pointer }

.nav-tabs { font-size: 12px }
body { background-color: #fafafa }
.nav-tabs .nav-link { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important }
.spinme { display:block; margin: 0 auto; position: relative; top: 125px }
.dropdown-menu.right.show { z-index: 99999 !important; transform: translate3d(-50px, 42px, 0px) !important }
.dropdown-menu.left.show { z-index: 99999 !important; transform: translate3d(25px, 42px, 0px) !important }
.dot { margin-left: 16px; margin-right: 4px; transform-origin: center center; transform: scale(4) translateY(-0.85px) }
.card { box-shadow: 0 1px 3px 0 rgba(0,0,0,.04),0 1px 2px 0 rgba(0,0,0,.02); border: 1px solid rgba(0,0,0,.05) }
.shaded img { max-height: 18px; max-width: 18px; margin-top: -5px }
.pseudotable > div { background: #00000007; padding-right: 6px }
.shaded a { color: #000; margin-bottom: -5px; max-width: 65vw }
#sankeyChart { height: 500px; width: 100%; }
.nav-pills { margin-top: -6px }
.shaded { padding-left: 3px }

@media screen and (max-width: 1200px) {
  .w-495 { width: 49% !important }
}
@media screen and (max-width: 768px) {
  .nav-pills { margin-top: -8px }
  .nav-tabs .nav-link { padding: .5rem .5rem }
}
</style>
