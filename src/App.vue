<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

import Footer from './components/Footer.vue';
import Header from './components/Header.vue';
import Modal from './components/Modal.vue';
import Body from './components/Body.vue';

const store = useStore();

import { query, queryDomains, queryCounts } from './store/query-utils';

// Previously, we queried available domains (unique hosts) from SQL -- encryption makes this messy.
// queryDomains(store);

function handleQueryParams() {
// Try to get the key and list of hosts from localStorage
  let _key = localStorage.getItem('__analytics_encryption_key');
  let _pkey = localStorage.getItem('__analytics_public_key');
  let _hosts = localStorage.getItem('__analytics_hosts');
  if (_hosts) try { _hosts = JSON.parse(_hosts) } catch(e){}
  if (!Array.isArray(_hosts)) _hosts = null;

  let queryParams = {};
  location.search.slice(1).split('&').map(s => s.split('=')).forEach(a => queryParams[a[0]] = a[1]);

  async function fetchKeypair() {
    let url = '/keypair';
    if (location.hostname === 'localhost') url = 'https://analytics.servers.do/keypair';
    let response = await fetch(url);
    let json = await response.json();
    let { public_key, private_key } = json;

    localStorage.setItem('__analytics_encryption_key', private_key);
    localStorage.setItem('__analytics_public_key', public_key);
    store.commit('setPublicKey', public_key);
    store.commit('setKey', private_key);
  }

  if (queryParams.key) {
    try { queryParams.key = decodeURIComponent(queryParams.key) } catch(e){}
    localStorage.setItem('__analytics_encryption_key', queryParams.key);
    store.commit('setKey', queryParams.key);
  } else if (_key) {
    store.commit('setKey', _key);
  }
  if (queryParams.pkey) {
    try { queryParams.pkey = decodeURIComponent(queryParams.pkey) } catch(e){}
    localStorage.setItem('__analytics_public_key', queryParams.pkey);
    store.commit('setPublicKey', queryParams.pkey);
  } else if (_pkey) {
    store.commit('setPublicKey', _pkey);
  } else {
    fetchKeypair()
  }

  if (queryParams.host) {
    if (!_hosts || !Array.isArray(_hosts)) _hosts = [];
    if (!_hosts.includes(queryParams.host)) _hosts.push(queryParams.host);

    localStorage.setItem('__analytics_hosts', JSON.stringify(_hosts));
  }

  if (_hosts) {
    _hosts.sort((a, b) => a.localeCompare(b));
    store.commit('setDomains', _hosts);
    if (!queryParams.host) queryParams.host = _hosts[0];
  }

  if (!queryParams.range) queryParams.range = 7;

  store.commit('setPath', queryParams.path || '');
  store.commit('setHost', queryParams.host || '');
  store.commit('setRange', queryParams.range);

  store.commit('setOs', queryParams.os || '');
  store.commit('setDevice', queryParams.device || '');
  store.commit('setIs_bot', queryParams.is_bot || '');
  store.commit('setIs_new', queryParams.is_new || '');
  store.commit('setBrowser', queryParams.browser || '');
  store.commit('setLanguage', queryParams.language || '');
  store.commit('setReferrer', queryParams.referrer || '');
  store.commit('setUtm_source', queryParams.utm_source || '');
  store.commit('setUtm_medium', queryParams.utm_medium || '');
  store.commit('setUtm_campaign', queryParams.utm_campaign || '');
  store.commit('setEvent', queryParams.event || '');
}

handleQueryParams();

addEventListener('popstate', event => {
  console.log("onpopstate location: " + document.location);
  handleQueryParams();
});
</script>

<template>
  <Header />
  <Body />
  <Footer />
  <Modal />
</template>

<style>
:root {
  --popper-theme-background-color: #111;
  --popper-theme-background-color-hover: #111;
  --popper-theme-text-color: #ffffff;
  --popper-theme-border-width: 0px;
  --popper-theme-border-style: solid;
  --popper-theme-border-radius: 3px;
  --popper-theme-padding: 10px;
  --popper-theme-box-shadow: 0 6px 12px -6px rgba(0, 0, 0, 0.25);
}
.popper {
  font-size: 14px;
}

.svgMap-map-wrapper { background: transparent }
.text-right { text-align: right !important }
.min-357 { min-height: 357px; height: 100% }
.bg-grey:hover { background: #2847b714 }
.bg-grey { background: #2847b729 }
body.dark .bg-grey:hover { background: rgba(255, 255, 255, 0.15) }
body.dark .bg-grey { background: rgba(255, 255, 255, 0.075) }
.w-495 { width: 49.5% !important }
.float-right { float: right }
.cursor-help { cursor: help }
.cp { cursor: pointer }

.nav-tabs { font-size: 12px }
body:not(.dark) { background-color: #fafafa }
.nav-tabs .nav-link { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important }
.spinme { display:block; margin: 0 auto; position: relative; top: 125px }
.dropdown-menu.right.show { z-index: 99999 !important; transform: translate3d(-50px, 42px, 0px) !important }
.dropdown-menu.left.show { z-index: 99999 !important; transform: translate3d(25px, 42px, 0px) !important }
.dot { margin-left: 16px; margin-right: 4px; transform-origin: center center; transform: scale(4) translateY(-0.85px) }
.card { box-shadow: 0 1px 3px 0 rgba(0,0,0,.04),0 1px 2px 0 rgba(0,0,0,.02); border: 1px solid rgba(0,0,0,.05) }
.shaded img { max-height: 18px; max-width: 18px; margin-top: -4px; margin-left: -3px }
.pseudotable > div { background: #00000007; padding-right: 6px }
.pseudotable>div:hover { background: #00000010 }
body.dark .pseudotable>div:hover { background: #ffffff10 }
.shaded a { margin-bottom: -5px; max-width: 65vw }
body:not(.dark) .shaded a { color: #000; }
body.dark .shaded a { color: #ebebeb; }
#sankeyChart { height: 500px; width: 100%; }
.nav-pills { margin-top: -6px }
.shaded { padding-left: 3px }

.nav.nav-pills.mb-1 {
  position: relative;
  top: 1px;
}
.nav-link.dropdown-toggle {
  padding-right: 0;
  padding-left: 0;
}
.form-switch .form-check-input { position: relative; top: 1px; }
.nudge {
  border-radius: 3px !important;
  padding-right: 1rem !important;
  padding-left: 1rem !important;
  position: relative;
  top: 2px;
}

body.dark .svgMap-country { stroke: #ffffff33 }
body.dark .svgMap-tooltip-content, body.dark .svgMap-tooltip-title {
  color: #222 !important; text-transform: capitalize;
}

@media screen and (max-width: 1200px) {
  .w-495 { width: 49% !important }
}
@media screen and (max-width: 768px) {
  .nav-pills { margin-top: -8px }
  .nav-tabs .nav-link { padding: .5rem .5rem }
}
</style>
