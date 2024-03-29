<script setup>
import { mapGetters } from '../store/map-state'
import Datepicker from 'vuejs3-datepicker';
import { useStore } from 'vuex'
import { ref, computed, watch } from 'vue'

const picked = ref(new Date());
const showPicker = ref(false);
const startingView = ref('month');
const minimumView = ref('month');
const maximumView = ref('month');

const disabledDates = {
  to: new Date(new Date().setDate((new Date()).getDate() - 32)), // Disable all dates up to specific date
  from: new Date(), // Disable all dates after specific date

  preventDisableDateSelection: true,
}

const { host, path, os, device, is_bot, is_new, browser, language, referrer, utm_source, utm_medium, utm_campaign, country, region, city, domains, event, range, rangeString, liveVisitors, dark, embed } = mapGetters();
const store = useStore();

const filterable = ref({ path, os, device, is_bot, is_new, browser, language, referrer, utm_source, utm_medium, utm_campaign, country, region, city, event });
const filterKeys = 'path, os, device, is_bot, is_new, browser, language, referrer, utm_source, utm_medium, utm_campaign, country, region, city, event'.split(', ')
const filters = ref([]);

const search = computed(() => location.search);

function computeActiveFilters() {
  filters.value = [];
  filterKeys.forEach(key => {
    if (filterable.value[key] !== '') {
      if (!filters.value.includes(key)) filters.value.push(key);
    }
  });
}
watch(os, computeActiveFilters);
watch(path, computeActiveFilters);
watch(device, computeActiveFilters);
watch(is_bot, computeActiveFilters);
watch(is_new, computeActiveFilters);
watch(browser, computeActiveFilters);
watch(language, computeActiveFilters);
watch(referrer, computeActiveFilters);
watch(utm_source, computeActiveFilters);
watch(utm_medium, computeActiveFilters);
watch(utm_campaign, computeActiveFilters);
watch(country, computeActiveFilters);
watch(region, computeActiveFilters);
watch(city, computeActiveFilters);
watch(event, computeActiveFilters);
computeActiveFilters();


function setRange(v, show) {
  store.commit('setRange', v);
  if (!show) showPicker.value = false;
}

const capitalizeFirstLetter = s => s.charAt(0).toUpperCase() + s.slice(1);

function addCustomDomain() {
  var p = prompt('Enter domain name');

  if (p) {
    p = p.toLowerCase().trim().replace('www.', '').replace('https://', '').replace('http://', '');
    if (p && p.includes('/')) p = p.split('/')[0];
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

function triggerPicker(range) {
  if (range === 'month') {
    startingView.value = 'month';
    minimumView.value = 'month';
    maximumView.value = 'month';
    store.commit('setRangeString', 'Custom month:');

  } else if (range === 'year') {
    startingView.value = 'year';
    minimumView.value = 'year';
    maximumView.value = 'year';
    store.commit('setRangeString', 'Custom year:');

  } else if (range === 'day') {
    startingView.value = 'day';
    minimumView.value = 'day';
    maximumView.value = 'day';
    store.commit('setRangeString', 'Custom day:');
  }

  document.querySelector('.dropdown-menu.right.show').classList.remove('show')
  showPicker.value = true;

  setTimeout(() => {
    document.querySelector('.vuejs3-datepicker__value').click();
  }, 123);
}

function handleChangedYear(payload) {
  // console.log('handleChangedYear', payload);
  let { year, timestamp } = payload;
  if (year) setRange(year);
}

function handleChangedDay(payload) {
  // console.log('handleChangedDay', payload);
  if (startingView.value === 'year') {
    let D = new Date(payload);
    let year = D.getFullYear();
    setRange(year);

  } else if (startingView.value === 'month') {
    let D = new Date(payload);
    let M = D.getMonth()+1;
    setRange(`${ D.getFullYear() }-${ M < 10 ? '0':'' }${ M }`);

  } else if (startingView.value === 'day') {
    picked.value = new Date(payload);
    let diff = new Date() - new Date(payload);
    let r = Math.floor(diff / 86400000) * -1;
    setRange(r);
  }
}

function removeFilter(setter) {
  store.commit(setter, '');
}
function filterKeyToSetter(s) {
  return 'set' + s[0].toUpperCase() + s.substring(1);
}
</script>

<template>
  <div class="row">
    <div class="col-12 mb-3" v-show="!embed" v-if="filters.length">
      <button type="button" v-for="filter in filters" class="btn mr-5 mb-1" :class="{ 'btn-dark': dark, 'btn-secondary': !dark }" @click="removeFilter(filterKeyToSetter(filter))">
        <strong>{{ capitalizeFirstLetter(filter) }}</strong> = &nbsp;<code>{{ filterable[filter] }}</code> &nbsp; <a>&#x2715;</a>
      </button>
    </div>
    <div class="col-6" v-show="!embed">
      <ul class="nav nav-pills mb-1 d-inline-block">
        <li class="nav-item dropdown ms-auto">
          <a class="nav-link dropdown-toggle cp" data-bs-toggle="dropdown" role="button">
            <img class="favicon" v-if="host" :src="`https://logo.clearbit.com/${ host }`" onerror="this.src='default.png';">
            <h5 class="d-inline pt-2 mb-0 name">{{ capitalizeFirstLetter(host) || 'Select a Domain' }}</h5>
          </a>

          <div class="dropdown-menu websites left">
            <a v-for="domain in domains" class="dropdown-item cp" @click="setHost(domain)">{{ capitalizeFirstLetter(domain) }}</a>
            <a class="dropdown-item cp" @click="addCustomDomain">Add Domain</a>
          </div>
        </li>
      </ul>

      <span class="text-success d-none d-md-inline-block dot">·</span>
      <span class="current-visitors d-none d-md-inline-block">&nbsp;{{ liveVisitors ? `${ liveVisitors } current visitor${ liveVisitors==1? '' : 's' }` : 'No current visitors' }}</span>
    </div>

    <div class="col-6" v-show="!embed">
      <ul class="nav nav-pills mb-1">
        <li class="nav-item dropdown ms-auto">
          <a class="nav-link right cp" :class="{ 'dropdown-toggle': !showPicker }" data-bs-toggle="dropdown" role="button">{{ rangeString }}</a>
          <div class="dropdown-menu right">
            <a class="dropdown-item cp" @click="setRange(1)">Latest</a>
            <a class="dropdown-item cp" @click="setRange(-1)">Yesterday</a>
            <a class="dropdown-item cp" @click="triggerPicker('day');">Custom Day</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item cp" @click="setRange(7)">Last 7 Days</a>
            <a class="dropdown-item cp" @click="setRange(14)">1 week ago</a>
            <a class="dropdown-item cp" @click="setRange(21)">2 weeks ago</a>
            <a class="dropdown-item cp" @click="setRange(28)">3 weeks ago</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item cp" @click="setRange(30)">Last 30 Days</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item cp" @click="triggerPicker('month');">Custom Month</a>
            <a class="dropdown-item cp" @click="triggerPicker('year');">Custom Year</a>
          </div>
        </li>
        <datepicker v-if="showPicker" name="datepick" :value="picked" :disabled-dates="minimumView == 'day' ? disabledDates : null" :initial-view="startingView" :minimum-view="minimumView" :maximum-view="maximumView" @input="handleChangedDay" @changed-year="handleChangedYear"></datepicker>
      </ul>
    </div>
  </div>
</template>

<style>
.mr-5 { margin-right: 5px }

.vuejs3-datepicker {
  z-index: 9999999;
  min-width: 300px;
}
.vuejs3-datepicker__value { width: 300px; }
.vuejs3-datepicker__icon { display: none !important }
.vuejs3-datepicker__value { padding: 8px 10px !important; }
body.dark .vuejs3-datepicker__value { background: rgb(32,55,76); }
body.dark .vuejs3-datepicker__calendar-actionarea { background: rgb(32,55,76) }

body.dark .vuejs3-datepicker__calendar-actionarea .prev:not(.disabled),
body.dark .vuejs3-datepicker__calendar-actionarea .next:not(.disabled) { background: #ffffff66; }

.favicon { height: 32px; margin-top: -7px; margin-right: 10px; border-radius: 2px; }
</style>