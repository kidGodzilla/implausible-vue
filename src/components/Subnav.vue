<script setup>
import { mapGetters } from '../store/map-state'
import { useStore } from 'vuex'

const { host, domains, range, rangeString, liveVisitors } = mapGetters();
const store = useStore();

function setRange(v) {
  store.commit('setRange', v);
}

const capitalizeFirstLetter = s => s.charAt(0).toUpperCase() + s.slice(1);

function addCustomDomain() {
  var p = prompt('Enter domain name');

  if (p) {
    p = p.toLowerCase().trim().replace('www.', '');
    if (p) window.history.pushState('', '', `?host=${ p }&range=${ range.value }`);

    // Commit updates to Vuex
    if (p && !(domains.value || []).includes(p)) {
      let domains_clone = domains.value;
      if (!Array.isArray(domains_clone)) domains_clone = [];
      if (!domains_clone.includes(p)) domains_clone.push(p);

      localStorage.setItem('__analytics_hosts', JSON.stringify(domains_clone));
      store.commit('setDomains', domains_clone);
    }

    if (p) setHost(p);
  }
}

function setHost(domain) {
  window.history.pushState('', '', `?host=${ domain }&range=${ range.value }`);
  store.commit('setHost', domain);
}

</script>

<template>
  <div class="row">
    <div class="col-6">
      <ul class="nav nav-pills mb-1 d-inline-block">
        <li class="nav-item dropdown ms-auto">
          <a class="nav-link dropdown-toggle cp" data-bs-toggle="dropdown" role="button">
            <h5 class="d-inline pt-2 mb-0 name">{{ capitalizeFirstLetter(host) || 'Select a Domain' }}</h5>
          </a>

          <div class="dropdown-menu websites left">
            <a v-for="domain in domains" class="dropdown-item cp" @click="setHost(domain)">{{ capitalizeFirstLetter(domain) }}</a>
            <a class="dropdown-item cp" @click="addCustomDomain">Add Domain</a>
          </div>
        </li>
      </ul>

      <span class="text-success d-none d-md-inline-block dot">·</span>
      <span class="current-visitors d-none d-md-inline-block">&nbsp; {{ liveVisitors ? `${ liveVisitors } current visitor${ liveVisitors==1? '' : 's' }` : 'No current visitors' }}</span>
    </div>

    <div class="col-6">
      <ul class="nav nav-pills mb-1">
        <li class="nav-item dropdown ms-auto">
          <a class="nav-link dropdown-toggle right cp" data-bs-toggle="dropdown" role="button">{{ rangeString }}</a>
          <div class="dropdown-menu right">
            <a class="dropdown-item cp" @click="setRange(1)">Latest</a>
            <a class="dropdown-item cp" @click="setRange(-1)">Yesterday</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item cp" @click="setRange(7)">Last 7 Days</a>
            <a class="dropdown-item cp" @click="setRange(30)">Last 30 Days</a>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>