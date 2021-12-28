<script setup>
import Subnav from '../components/Subnav.vue'
import Visits from '../components/Visits.vue'
import Card from '../components/Card.vue'
import Stat from '../components/Stat.vue'
import PseudoTable from '../components/PseudoTable.vue'

import SvgMap from '../components/svgMap.vue'

const twoPlaces = v => v.toFixed(2);
const twoPlacesMinZero = v => Math.max(0, v.toFixed(2));

import {queryCounts, queryLoadTimes} from '../store/query-utils';
import { useStore } from 'vuex';
import { ref } from 'vue';
const store = useStore();

const countries = ref({
  AF: { visitors: 587 },
  AL: { visitors: 4583 },
  DZ: { visitors: 4293 }
});

const loading = ref(true);

async function getCountryData() {
  let result = await queryCounts(store, 'country_code', 999);

  console.log('result', result);

  let newCountries = {};

  result.forEach(row => {
    newCountries[row.country_code] = {
      visitors: row['count(*)']
    };
  });

  console.log('newCountries', newCountries)

  countries.value = newCountries;
  loading.value = false;
}

getCountryData()
</script>

<template>
  <div class="container mt-5">

    <Subnav />

    <div class="row">
      <div class="col-md-12">
        <Card>

          <div class="row">
            <Stat title="Visitors" />
            <Stat title="Total Pageviews" />
            <Stat title="Bounce Rate" />
            <Stat title="Session Length" />
          </div>

          <Visits />

        </Card>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-md-6">
        <div class="card min-357">
          <div class="card-body">
            <h5 class="card-title float-left" style="margin-bottom: -37px;">Sources</h5>

            <ul class="nav nav-tabs float-right">
              <li class="nav-item ms-auto">
                <a class="nav-link active" data-bs-toggle="tab" href="#referrers"><span class="d-none d-sm-inline">Referrers</span><span class="d-inline d-sm-none">All</span></a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-bs-toggle="tab" href="#medium">Medium</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-bs-toggle="tab" href="#source">Source</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-bs-toggle="tab" href="#campaign">Campaign</a>
              </li>
            </ul>


            <div class="tab-content mt-5">
              <div class="tab-pane fade active show" id="referrers">
                <small class="text-muted w-495 d-inline-block">Source</small>
                <small class="text-muted w-495 d-inline-block text-right">Visitors</small>

                <PseudoTable column="referer_host" :favicons="true" :links="true" defaultText="Direct / None" />
              </div>

              <div class="tab-pane fade show" id="medium">
                <small class="text-muted w-495 d-inline-block">Source</small>
                <small class="text-muted w-495 d-inline-block text-right">Visitors</small>

                <PseudoTable column="utm_medium" />
              </div>

              <div class="tab-pane fade show" id="source">
                <small class="text-muted w-495 d-inline-block">Source</small>
                <small class="text-muted w-495 d-inline-block text-right">Visitors</small>

                <PseudoTable column="utm_source" />
              </div>

              <div class="tab-pane fade show" id="campaign">
                <small class="text-muted w-495 d-inline-block">Source</small>
                <small class="text-muted w-495 d-inline-block text-right">Visitors</small>

                <PseudoTable column="utm_campaign" />
              </div>
            </div>

          </div>
        </div>
      </div>

      <div class="col-md-6 mt-3 mt-sm-0">
        <div class="card min-357">
          <div class="card-body">
            <h5 class="card-title float-left" style="margin-bottom: -37px;">Pages</h5>

            <ul class="nav nav-tabs float-right">
              <li class="nav-item ms-auto">
                <a class="nav-link active" data-bs-toggle="tab" href="#pages">Top Pages</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-bs-toggle="tab" href="#loadtimes">Load Times</a>
              </li>
            </ul>

            <div class="tab-content mt-5">
              <div class="tab-pane fade show active" id="pages">
                <small class="text-muted w-495 d-inline-block">Page URL</small>
                <small class="text-muted w-495 d-inline-block text-right">Visitors</small>

                <PseudoTable column="pathname" :links="true" defaultText="None" />
              </div>

              <div class="tab-pane fade show" id="loadtimes">
                <small class="text-muted w-495 d-inline-block">Page URL</small>
                <small class="text-muted w-495 d-inline-block text-right">Avg. Load Time</small>

                <PseudoTable column="pathname" valueColumn="AvgLoadTime" :loadTimes="true" :formatter="twoPlacesMinZero" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-md-6">
        <Card title="Countries">
          <SvgMap :countries="countries" />
        </Card>
      </div>

      <div class="col-md-6 mt-3 mt-sm-0">

        <Card>
          <h5 class="card-title float-left" style="margin-bottom: -37px;">Users</h5>
          <ul class="nav nav-tabs float-right">
            <li class="nav-item ms-auto">
              <a class="nav-link active" data-bs-toggle="tab" href="#size"><span class="d-none d-sm-inline">Device </span>Type</a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-none d-sm-inline-block" data-bs-toggle="tab" href="#new">Returning</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-bs-toggle="tab" href="#browser">Browser</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-bs-toggle="tab" href="#language">Lang<span class="d-none d-sm-inline">uage</span></a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-bs-toggle="tab" href="#os">OS</a>
            </li>
          </ul>

          <div class="tab-content mt-5">
            <div class="tab-pane fade show active" id="size">
              <small class="text-muted w-495 d-inline-block">Device Type</small>
              <small class="text-muted w-495 d-inline-block text-right">Visitors</small>

              <PseudoTable column="device_type" />

              <hr>

              <PseudoTable column="bot" />
            </div>

            <div class="tab-pane fade" id="new">
              <small class="text-muted w-495 d-inline-block">New vs. Returning</small>
              <small class="text-muted w-495 d-inline-block text-right">Visitors</small>

              <PseudoTable column="is_new" />
            </div>

            <div class="tab-pane fade" id="browser">
              <small class="text-muted w-495 d-inline-block">Browser</small>
              <small class="text-muted w-495 d-inline-block text-right">Visitors</small>

              <PseudoTable column="browser" />
            </div>

            <div class="tab-pane fade" id="language">
              <small class="text-muted w-495 d-inline-block">Language</small>
              <small class="text-muted w-495 d-inline-block text-right">Visitors</small>

              <PseudoTable column="lang" />
            </div>

            <div class="tab-pane fade" id="os">
              <small class="text-muted w-495 d-inline-block">OS</small>
              <small class="text-muted w-495 d-inline-block text-right">Visitors</small>

              <PseudoTable column="os" />
            </div>
          </div>

        </Card>

      </div>
    </div>

    <div class="row mb-5">
      <div class="col-md-12 mt-3 rawdata d-none">
        <div class="card">
          <div class="card-body">
            <code><pre>Loading..</pre></code>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>