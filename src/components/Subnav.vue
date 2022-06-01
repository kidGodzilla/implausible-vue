<script setup>
import { mapGetters } from '../store/map-state'
import Datepicker from 'vuejs3-datepicker';
import { useStore } from 'vuex'
import { ref, computed } from 'vue'

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

const { host, domains, range, rangeString, liveVisitors } = mapGetters();
const store = useStore();

function setRange(v, show) {
  store.commit('setRange', v);
  if (!show) showPicker.value = false;
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

  // document.querySelector('.vuejs3-datepicker__value').click();
}

function handleChangedMonth(payload) {
  console.log('handleChangedMonth', payload)
  // let { timestamp } = payload;
  // let D = new Date(timestamp);
  // let M = D.getMonth()+1;
  // setRange(`${ D.getFullYear() }-${ M < 10 ? '0':'' }${ M }`);
}
function handleChangedYear(payload) {
  console.log('handleChangedYear', payload)
  // let { year } = payload;
  // setRange(year);
}
function handleChangedDay(payload) {
  console.log('handleChangedDay', payload);

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
      <span class="current-visitors d-none d-md-inline-block">&nbsp;{{ liveVisitors ? `${ liveVisitors } current visitor${ liveVisitors==1? '' : 's' }` : 'No current visitors' }}</span>
    </div>

    <div class="col-6">
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
        <datepicker v-if="showPicker" name="datepick" :value="picked" :disabled-dates="minimumView == 'day' ? disabledDates : null" :initial-view="startingView" :minimum-view="minimumView" :maximum-view="maximumView" @input="handleChangedDay" @changedMonth="handleChangedMonth" @changedYear="handleChangedYear"></datepicker>
      </ul>
    </div>
  </div>
</template>

<style>
.vuejs3-datepicker {
  /*opacity: 0.1;*/
  z-index: 9999999;
  min-width: 300px;
  /*position: absolute;*/
  /*right: 0;*/
  /*top: -50px;*/
  /*position:relative;*/
  /*left: -120px;*/
  /*margin-right: -120px;*/
  /*margin-left: 1rem;*/
}
.vuejs3-datepicker__value {
  width: 300px;
}
.vuejs3-datepicker__icon { display: none !important }
.vuejs3-datepicker__value { padding: 8px 10px !important; }
body.dark .vuejs3-datepicker__value { background: rgb(32,55,76); }
body.dark .vuejs3-datepicker__calendar-actionarea { background: rgb(32,55,76) }
</style>