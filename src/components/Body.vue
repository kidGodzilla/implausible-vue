<script setup>
import Subnav from '../components/Subnav.vue'
import Visits from '../components/Visits.vue'
import Card from '../components/Card.vue'
import Stat from '../components/Stat.vue'
import PseudoTable from '../components/PseudoTable.vue'
import SvgMap from '../components/svgMap.vue'

// Formatters
const twoPlaces = v => v.toFixed(2);
const twoPlacesMinZero = v => Math.max(0, v.toFixed(2));
const capitalizeFirstLetter = s => (s || '').charAt(0).toUpperCase() + (s || '').slice(1);
const isNewFormatter = v => v ? 'New' : 'Returning';
const botFormatter = v => v ? 'Headless Browsers' : 'Normal Users';

const languageLookup = str => {
  let langLookup = {"aa":"Afar","ab":"Abkhazian","ae":"Avestan","af":"Afrikaans","ak":"Akan","am":"Amharic","an":"Aragonese","ar":"Arabic","as":"Assamese","av":"Avaric","ay":"Aymara","az":"Azerbaijani","ba":"Bashkir","be":"Belarusian","bg":"Bulgarian","bh":"Bihari languages","bi":"Bislama","bm":"Bambara","bn":"Bengali","bo":"Tibetan","br":"Breton","bs":"Bosnian","ca":"Catalan; Valencian","ce":"Chechen","ch":"Chamorro","co":"Corsican","cr":"Cree","cs":"Czech","cu":"Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic","cv":"Chuvash","cy":"Welsh","da":"Danish","de":"German","dv":"Divehi; Dhivehi; Maldivian","dz":"Dzongkha","ee":"Ewe","el":"Greek, Modern (1453-)","en":"English","eo":"Esperanto","es":"Spanish; Castilian","et":"Estonian","eu":"Basque","fa":"Persian","ff":"Fulah","fi":"Finnish","fj":"Fijian","fo":"Faroese","fr":"French","fy":"Western Frisian","ga":"Irish","gd":"Gaelic; Scomttish Gaelic","gl":"Galician","gn":"Guarani","gu":"Gujarati","gv":"Manx","ha":"Hausa","he":"Hebrew","hi":"Hindi","ho":"Hiri Motu","hr":"Croatian","ht":"Haitian; Haitian Creole","hu":"Hungarian","hy":"Armenian","hz":"Herero","ia":"Interlingua (International Auxiliary Language Association)","id":"Indonesian","ie":"Interlingue; Occidental","ig":"Igbo","ii":"Sichuan Yi; Nuosu","ik":"Inupiaq","io":"Ido","is":"Icelandic","it":"Italian","iu":"Inuktitut","ja":"Japanese","jv":"Javanese","ka":"Georgian","kg":"Kongo","ki":"Kikuyu; Gikuyu","kj":"Kuanyama; Kwanyama","kk":"Kazakh","kl":"Kalaallisut; Greenlandic","km":"Central Khmer","kn":"Kannada","ko":"Korean","kr":"Kanuri","ks":"Kashmiri","ku":"Kurdish","kv":"Komi","kw":"Cornish","ky":"Kirghiz; Kyrgyz","la":"Latin","lb":"Luxembourgish; Letzeburgesch","lg":"Ganda","li":"Limburgan; Limburger; Limburgish","ln":"Lingala","lo":"Lao","lt":"Lithuanian","lu":"Luba-Katanga","lv":"Latvian","mg":"Malagasy","mh":"Marshallese","mi":"Maori","mk":"Macedonian","ml":"Malayalam","mn":"Mongolian","mr":"Marathi","ms":"Malay","mt":"Maltese","my":"Burmese","na":"Nauru","nb":"Bokmål, Norwegian; Norwegian Bokmål","nd":"Ndebele, North; North Ndebele","ne":"Nepali","ng":"Ndonga","nl":"Dutch; Flemish","nn":"Norwegian Nynorsk; Nynorsk, Norwegian","no":"Norwegian","nr":"Ndebele, South; South Ndebele","nv":"Navajo; Navaho","ny":"Chichewa; Chewa; Nyanja","oc":"Occitan (post 1500)","oj":"Ojibwa","om":"Oromo","or":"Oriya","os":"Ossetian; Ossetic","pa":"Panjabi; Punjabi","pi":"Pali","pl":"Polish","ps":"Pushto; Pashto","pt":"Portuguese","qu":"Quechua","rm":"Romansh","rn":"Rundi","ro":"Romanian; Moldavian; Moldovan","ru":"Russian","rw":"Kinyarwanda","sa":"Sanskrit","sc":"Sardinian","sd":"Sindhi","se":"Northern Sami","sg":"Sango","si":"Sinhala; Sinhalese","sk":"Slovak","sl":"Slovenian","sm":"Samoan","sn":"Shona","so":"Somali","sq":"Albanian","sr":"Serbian","ss":"Swati","st":"Sotho, Southern","su":"Sundanese","sv":"Swedish","sw":"Swahili","ta":"Tamil","te":"Telugu","tg":"Tajik","th":"Thai","ti":"Tigrinya","tk":"Turkmen","tl":"Tagalog","tn":"Tswana","to":"Tonga (Tonga Islands)","tr":"Turkish","ts":"Tsonga","tt":"Tatar","tw":"Twi","ty":"Tahitian","ug":"Uighur; Uyghur","uk":"Ukrainian","ur":"Urdu","uz":"Uzbek","ve":"Venda","vi":"Vietnamese","vo":"Volapük","wa":"Walloon","wo":"Wolof","xh":"Xhosa","yi":"Yiddish","yo":"Yoruba","za":"Zhuang; Chuang","zh":"Chinese","zu":"Zulu"};
  let s = str;
  try { s = s.toLowerCase().split('-')[0] } catch(e){}
  try { s = langLookup[s] } catch(e){}
  if (!s || s == 'undefined') s = 'Unknown';
  return s + ' (' + str + ')';
}

import { queryCounts, querySummary } from '../store/query-utils';
import { mapGetters } from '../store/map-state';
import { useStore } from 'vuex';
import { onMounted, ref, watch, computed } from 'vue';
const store = useStore();

const countries = ref({});

const { range, host, path, os, device, is_bot, is_new, browser, language, referrer, utm_source, utm_medium, utm_campaign, country, dark, summary, showVisitors } = mapGetters();

const visitorsString = computed(() => {
  return showVisitors.value ? 'Visitors' : 'Pageviews';
});

async function getCountryData() {
  // if (range.value.length === 7 || range.value > 1000) {
  //   let summary_value = JSON.parse(JSON.stringify(summary.value));
  //   let countries_value = showVisitors.value ? summary_value.country_code__visitors : summary_value.country_code;
  //
  //   if (countries_value) {
  //     let newCountries = {};
  //
  //     Object.keys(countries_value).forEach(key => {
  //       if (showVisitors.value) newCountries[key] = { visitors: countries_value[key] }
  //       else newCountries[key] = { pageviews: countries_value[key] }
  //     });
  //
  //     countries.value = newCountries;
  //   }
  //
  //   return;
  // }

  let result = await queryCounts(store, 'country_code', 999);

  let newCountries = {};

  result.forEach(row => {
    if (showVisitors.value) newCountries[row.country_code] = { visitors: row['count(DISTINCT ip)'] };
    else newCountries[row.country_code] = { pageviews: row['count(*)'] };
  });

  countries.value = newCountries;
}

function getSummaryData() {
  if (typeof range.value === 'string' && range.value.length === 7) querySummary(store, range.value);
  else if (range.value > 1000 && range.value < 3000) querySummary(store, range.value);
}

function countryClicked(country) {
  console.log('clicked on', country);
  store.commit('setCountry', country);
}

onMounted(getCountryData);
// onMounted(getSummaryData);
watch(host, getCountryData);
// watch(host, getSummaryData);
watch(path, getCountryData);
// watch(path, getSummaryData);
watch(range, getCountryData);
// watch(range, getSummaryData);
// watch(summary, getCountryData);
watch(showVisitors, getCountryData);
watch(os, getCountryData);
watch(device, getCountryData);
watch(is_bot, getCountryData);
watch(is_new, getCountryData);
watch(browser, getCountryData);
watch(language, getCountryData);
watch(referrer, getCountryData);
watch(utm_source, getCountryData);
watch(utm_medium, getCountryData);
watch(utm_campaign, getCountryData);
watch(country, getCountryData);
// rm later
// watch(os, getSummaryData);
// watch(device, getSummaryData);
// watch(is_bot, getSummaryData);
// watch(is_new, getSummaryData);
// watch(browser, getSummaryData);
// watch(language, getSummaryData);
// watch(referrer, getSummaryData);
// watch(utm_source, getSummaryData);
// watch(utm_medium, getSummaryData);
// watch(utm_campaign, getSummaryData);
// watch(country, getSummaryData);
</script>

<template>
  <div class="container mt-5">

    <Subnav />

    <div class="row">
      <div class="col-md-12">
        <Card>

          <div class="row p-1 pt-2">
            <Stat title="Visitors" :muted="false" :underline="!showVisitors" @click="store.commit('setShowVisitors', true)" />
            <Stat title="Total Pageviews" :muted="false" :underline="showVisitors" @click="store.commit('setShowVisitors', false)" />
            <Stat title="Bounce Rate" />
            <Stat title="Session Length" />
          </div>

          <Visits />

        </Card>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-md-6">
        <div class="card min-357" :class="{ 'bg-dark': dark }">
          <div class="card-body">
            <h5 class="card-title float-left tweaked">Sources</h5>

            <ul class="nav nav-tabs float-right">
              <li class="nav-item ms-auto">
                <a class="nav-link active" data-bs-toggle="tab" href="#referrers"><span class="d-none d-sm-inline">Referrers</span><span class="d-inline d-sm-none">All</span></a>
              </li>
              <li class="nav-item ms-auto">
                <a class="nav-link" data-bs-toggle="tab" href="#referrer_urls">URLs</a>
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
                <small class="text-muted w-495 d-inline-block text-right">{{ visitorsString }}</small>

                <PseudoTable column="referer_host" setter="setReferrer" :favicons="true" :links="true" defaultText="Direct / None" />
              </div>

              <div class="tab-pane fade show" id="referrer_urls">
                <small class="text-muted w-495 d-inline-block">Source</small>
                <small class="text-muted w-495 d-inline-block text-right">{{ visitorsString }}</small>

                <PseudoTable column="referer_url" :favicons="true" :links="true" defaultText="Direct / None" />
              </div>

              <div class="tab-pane fade show" id="medium">
                <small class="text-muted w-495 d-inline-block">Source</small>
                <small class="text-muted w-495 d-inline-block text-right">{{ visitorsString }}</small>

                <PseudoTable column="utm_medium"  setter="setUtm_medium" />
              </div>

              <div class="tab-pane fade show" id="source">
                <small class="text-muted w-495 d-inline-block">Source</small>
                <small class="text-muted w-495 d-inline-block text-right">{{ visitorsString }}</small>

                <PseudoTable column="utm_source" setter="setUtm_source" />
              </div>

              <div class="tab-pane fade show" id="campaign">
                <small class="text-muted w-495 d-inline-block">Source</small>
                <small class="text-muted w-495 d-inline-block text-right">{{ visitorsString }}</small>

                <PseudoTable column="utm_campaign" setter="setUtm_campaign" />
              </div>
            </div>

          </div>
        </div>
      </div>

      <div class="col-md-6 mt-3 mt-sm-0">
        <div class="card min-357" :class="{ 'bg-dark': dark }">
          <div class="card-body">
            <h5 class="card-title float-left tweaked">Pages</h5>

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
                <small class="text-muted w-495 d-inline-block text-right">{{ visitorsString }}</small>

                <PseudoTable column="pathname" setter="setPath" defaultText="None" />
              </div>

              <div class="tab-pane fade show" id="loadtimes">
                <small class="text-muted w-495 d-inline-block">Page URL</small>
                <small class="text-muted w-495 d-inline-block text-right">Avg. Load Time</small>

                <PseudoTable column="pathname" valueColumn="AvgLoadTime" setter="setPath" :loadTimes="true" :valueFormatter="twoPlacesMinZero" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-md-6">
        <Card title="Countries">
          <SvgMap :countries="countries" :dark="dark" :showVisitors="showVisitors" @clicked="countryClicked" />
        </Card>
      </div>

      <div class="col-md-6 mt-3 mt-sm-0">

        <Card>
          <h5 class="card-title float-left tweaked">Users</h5>
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
              <small class="text-muted w-495 d-inline-block text-right">{{ visitorsString }}</small>

              <PseudoTable column="device_type" setter="setDevice" :iconify="true" :keyFormatter="capitalizeFirstLetter" />

              <hr>

              <PseudoTable column="bot" setter="setIs_bot" :iconify="true" defaultText="Normal Users" :keyFormatter="botFormatter" />
            </div>

            <div class="tab-pane fade" id="new">
              <small class="text-muted w-495 d-inline-block">New vs. Returning</small>
              <small class="text-muted w-495 d-inline-block text-right">{{ visitorsString }}</small>

              <PseudoTable column="is_new" setter="setIs_new"  :iconify="true" defaultText="Returning" :keyFormatter="isNewFormatter" />
            </div>

            <div class="tab-pane fade" id="browser">
              <small class="text-muted w-495 d-inline-block">Browser</small>
              <small class="text-muted w-495 d-inline-block text-right">{{ visitorsString }}</small>

              <PseudoTable column="browser" setter="setBrowser" :browserIcons="true" />
            </div>

            <div class="tab-pane fade" id="language">
              <small class="text-muted w-495 d-inline-block">Language</small>
              <small class="text-muted w-495 d-inline-block text-right">{{ visitorsString }}</small>

              <PseudoTable column="lang"  setter="setLanguage" :keyFormatter="languageLookup" />
            </div>

            <div class="tab-pane fade" id="os">
              <small class="text-muted w-495 d-inline-block">OS</small>
              <small class="text-muted w-495 d-inline-block text-right">{{ visitorsString }}</small>

              <PseudoTable column="os"  setter="setOs" :osIcons="true" />
            </div>
          </div>

        </Card>

      </div>
    </div>

  </div>
</template>

<style scoped>
.card-title.float-left.tweaked {
  margin-bottom: -35px;
  position: relative;
  top: -6px;
}
.nav.nav-tabs.float-right {
  position: relative;
}
</style>