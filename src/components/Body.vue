<script setup>
import Subnav from '../components/Subnav.vue'
import Visits from '../components/Visits.vue'
import Card from '../components/Card.vue'
import Stat from '../components/Stat.vue'
import PseudoTable from '../components/PseudoTable.vue'
import SvgMap from '../components/svgMap.vue'
import Popper from "vue3-popper";

// Formatters
const twoPlaces = v => v.toFixed(2);
const twoPlacesMinZero = v => typeof v === 'number' ? Math.max(0, v.toFixed(2)) : v;
const capitalizeFirstLetter = s => (s || '').charAt(0).toUpperCase() + (s || '').slice(1);
const botFormatter = v => v ? 'Headless Browsers' : 'Normal Users';
const isNewFormatter = v => v ? 'New' : 'Returning';

const languageLookup = str => {
  let langLookup = {"aa":"Afar","ab":"Abkhazian","ae":"Avestan","af":"Afrikaans","ak":"Akan","am":"Amharic","an":"Aragonese","ar":"Arabic","as":"Assamese","av":"Avaric","ay":"Aymara","az":"Azerbaijani","ba":"Bashkir","be":"Belarusian","bg":"Bulgarian","bh":"Bihari languages","bi":"Bislama","bm":"Bambara","bn":"Bengali","bo":"Tibetan","br":"Breton","bs":"Bosnian","ca":"Catalan; Valencian","ce":"Chechen","ch":"Chamorro","co":"Corsican","cr":"Cree","cs":"Czech","cu":"Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic","cv":"Chuvash","cy":"Welsh","da":"Danish","de":"German","dv":"Divehi; Dhivehi; Maldivian","dz":"Dzongkha","ee":"Ewe","el":"Greek, Modern (1453-)","en":"English","eo":"Esperanto","es":"Spanish; Castilian","et":"Estonian","eu":"Basque","fa":"Persian","ff":"Fulah","fi":"Finnish","fj":"Fijian","fo":"Faroese","fr":"French","fy":"Western Frisian","ga":"Irish","gd":"Gaelic; Scomttish Gaelic","gl":"Galician","gn":"Guarani","gu":"Gujarati","gv":"Manx","ha":"Hausa","he":"Hebrew","hi":"Hindi","ho":"Hiri Motu","hr":"Croatian","ht":"Haitian; Haitian Creole","hu":"Hungarian","hy":"Armenian","hz":"Herero","ia":"Interlingua (International Auxiliary Language Association)","id":"Indonesian","ie":"Interlingue; Occidental","ig":"Igbo","ii":"Sichuan Yi; Nuosu","ik":"Inupiaq","io":"Ido","is":"Icelandic","it":"Italian","iu":"Inuktitut","ja":"Japanese","jv":"Javanese","ka":"Georgian","kg":"Kongo","ki":"Kikuyu; Gikuyu","kj":"Kuanyama; Kwanyama","kk":"Kazakh","kl":"Kalaallisut; Greenlandic","km":"Central Khmer","kn":"Kannada","ko":"Korean","kr":"Kanuri","ks":"Kashmiri","ku":"Kurdish","kv":"Komi","kw":"Cornish","ky":"Kirghiz; Kyrgyz","la":"Latin","lb":"Luxembourgish; Letzeburgesch","lg":"Ganda","li":"Limburgan; Limburger; Limburgish","ln":"Lingala","lo":"Lao","lt":"Lithuanian","lu":"Luba-Katanga","lv":"Latvian","mg":"Malagasy","mh":"Marshallese","mi":"Maori","mk":"Macedonian","ml":"Malayalam","mn":"Mongolian","mr":"Marathi","ms":"Malay","mt":"Maltese","my":"Burmese","na":"Nauru","nb":"Bokmål, Norwegian; Norwegian Bokmål","nd":"Ndebele, North; North Ndebele","ne":"Nepali","ng":"Ndonga","nl":"Dutch; Flemish","nn":"Norwegian Nynorsk; Nynorsk, Norwegian","no":"Norwegian","nr":"Ndebele, South; South Ndebele","nv":"Navajo; Navaho","ny":"Chichewa; Chewa; Nyanja","oc":"Occitan (post 1500)","oj":"Ojibwa","om":"Oromo","or":"Oriya","os":"Ossetian; Ossetic","pa":"Panjabi; Punjabi","pi":"Pali","pl":"Polish","ps":"Pushto; Pashto","pt":"Portuguese","qu":"Quechua","rm":"Romansh","rn":"Rundi","ro":"Romanian; Moldavian; Moldovan","ru":"Russian","rw":"Kinyarwanda","sa":"Sanskrit","sc":"Sardinian","sd":"Sindhi","se":"Northern Sami","sg":"Sango","si":"Sinhala; Sinhalese","sk":"Slovak","sl":"Slovenian","sm":"Samoan","sn":"Shona","so":"Somali","sq":"Albanian","sr":"Serbian","ss":"Swati","st":"Sotho, Southern","su":"Sundanese","sv":"Swedish","sw":"Swahili","ta":"Tamil","te":"Telugu","tg":"Tajik","th":"Thai","ti":"Tigrinya","tk":"Turkmen","tl":"Tagalog","tn":"Tswana","to":"Tonga (Tonga Islands)","tr":"Turkish","ts":"Tsonga","tt":"Tatar","tw":"Twi","ty":"Tahitian","ug":"Uighur; Uyghur","uk":"Ukrainian","ur":"Urdu","uz":"Uzbek","ve":"Venda","vi":"Vietnamese","vo":"Volapük","wa":"Walloon","wo":"Wolof","xh":"Xhosa","yi":"Yiddish","yo":"Yoruba","za":"Zhuang; Chuang","zh":"Chinese","zu":"Zulu"};
  let s = str;
  try { s = s.toLowerCase().split('-')[0] } catch(e){}
  try { s = langLookup[s] } catch(e){}
  if (!s || s == 'undefined') s = 'Unknown';
  return s + ' (' + str + ')';
}

function countryCodeToName(code) {
  const data = {"AD": "Andorra","AE": "United Arab Emirates","AF": "Afghanistan","AG": "Antigua and Barbuda","AI": "Anguilla","AL": "Albania","AM": "Armenia","AO": "Angola","AQ": "Antarctica","AR": "Argentina","AS": "American Samoa","AT": "Austria","AU": "Australia","AW": "Aruba","AX": "\u00c5land Islands","AZ": "Azerbaijan","BA": "Bosnia and Herzegovina","BB": "Barbados","BD": "Bangladesh","BE": "Belgium","BF": "Burkina Faso","BG": "Bulgaria","BH": "Bahrain","BI": "Burundi","BJ": "Benin","BL": "Saint Barthélemy","BM": "Bermuda","BN": "Brunei Darussalam","BO": "Bolivia, Plurinational State of","BQ": "Caribbean Netherlands","BR": "Brazil","BS": "Bahamas","BT": "Bhutan","BV": "Bouvet Island","BW": "Botswana","BY": "Belarus","BZ": "Belize","CA": "Canada","CC": "Cocos (Keeling) Islands","CD": "Congo, the Democratic Republic of the","CF": "Central African Republic","CG": "Republic of the Congo","CH": "Switzerland","CI": "C\u00f4te d'Ivoire","CK": "Cook Islands","CL": "Chile","CM": "Cameroon","CN": "China (People's Republic of China)","CO": "Colombia","CR": "Costa Rica","CU": "Cuba","CV": "Cape Verde","CW": "Cura\u00e7ao","CX": "Christmas Island","CY": "Cyprus","CZ": "Czech Republic","DE": "Germany","DJ": "Djibouti","DK": "Denmark","DM": "Dominica","DO": "Dominican Republic","DZ": "Algeria","EC": "Ecuador","EE": "Estonia","EG": "Egypt","EH": "Western Sahara","ER": "Eritrea","ES": "Spain","ET": "Ethiopia","EU": "Europe","FI": "Finland","FJ": "Fiji","FK": "Falkland Islands (Malvinas)","FM": "Micronesia, Federated States of","FO": "Faroe Islands","FR": "France","GA": "Gabon","GB-ENG": "England","GB-NIR": "Northern Ireland","GB-SCT": "Scotland","GB-WLS": "Wales","GB": "United Kingdom","GD": "Grenada","GE": "Georgia","GF": "French Guiana","GG": "Guernsey","GH": "Ghana","GI": "Gibraltar","GL": "Greenland","GM": "Gambia","GN": "Guinea","GP": "Guadeloupe","GQ": "Equatorial Guinea","GR": "Greece","GS": "South Georgia and the South Sandwich Islands","GT": "Guatemala","GU": "Guam","GW": "Guinea-Bissau","GY": "Guyana","HK": "Hong Kong","HM": "Heard Island and McDonald Islands","HN": "Honduras","HR": "Croatia","HT": "Haiti","HU": "Hungary","ID": "Indonesia","IE": "Ireland","IL": "Israel","IM": "Isle of Man","IN": "India","IO": "British Indian Ocean Territory","IQ": "Iraq","IR": "Iran, Islamic Republic of","IS": "Iceland","IT": "Italy","JE": "Jersey","JM": "Jamaica","JO": "Jordan","JP": "Japan","KE": "Kenya","KG": "Kyrgyzstan","KH": "Cambodia","KI": "Kiribati","KM": "Comoros","KN": "Saint Kitts and Nevis","KP": "Korea, Democratic People's Republic of","KR": "Korea, Republic of","KW": "Kuwait","KY": "Cayman Islands","KZ": "Kazakhstan","LA": "Laos (Lao People's Democratic Republic)","LB": "Lebanon","LC": "Saint Lucia","LI": "Liechtenstein","LK": "Sri Lanka","LR": "Liberia","LS": "Lesotho","LT": "Lithuania","LU": "Luxembourg","LV": "Latvia","LY": "Libya","MA": "Morocco","MC": "Monaco","MD": "Moldova, Republic of","ME": "Montenegro","MF": "Saint Martin","MG": "Madagascar","MH": "Marshall Islands","MK": "North Macedonia","ML": "Mali","MM": "Myanmar","MN": "Mongolia","MO": "Macao","MP": "Northern Mariana Islands","MQ": "Martinique","MR": "Mauritania","MS": "Montserrat","MT": "Malta","MU": "Mauritius","MV": "Maldives","MW": "Malawi","MX": "Mexico","MY": "Malaysia","MZ": "Mozambique","NA": "Namibia","NC": "New Caledonia","NE": "Niger","NF": "Norfolk Island","NG": "Nigeria","NI": "Nicaragua","NL": "Netherlands","NO": "Norway","NP": "Nepal","NR": "Nauru","NU": "Niue","NZ": "New Zealand","OM": "Oman","PA": "Panama","PE": "Peru","PF": "French Polynesia","PG": "Papua New Guinea","PH": "Philippines","PK": "Pakistan","PL": "Poland","PM": "Saint Pierre and Miquelon","PN": "Pitcairn","PR": "Puerto Rico","PS": "Palestine","PT": "Portugal","PW": "Palau","PY": "Paraguay","QA": "Qatar","RE": "Réunion","RO": "Romania","RS": "Serbia","RU": "Russian Federation","RW": "Rwanda","SA": "Saudi Arabia","SB": "Solomon Islands","SC": "Seychelles","SD": "Sudan","SE": "Sweden","SG": "Singapore","SH": "Saint Helena, Ascension and Tristan da Cunha","SI": "Slovenia","SJ": "Svalbard and Jan Mayen Islands","SK": "Slovakia","SL": "Sierra Leone","SM": "San Marino","SN": "Senegal","SO": "Somalia","SR": "Suriname","SS": "South Sudan","ST": "Sao Tome and Principe","SV": "El Salvador","SX": "Sint Maarten (Dutch part)","SY": "Syrian Arab Republic","SZ": "Swaziland","TC": "Turks and Caicos Islands","TD": "Chad","TF": "French Southern Territories","TG": "Togo","TH": "Thailand","TJ": "Tajikistan","TK": "Tokelau","TL": "Timor-Leste","TM": "Turkmenistan","TN": "Tunisia","TO": "Tonga","TR": "Turkey","TT": "Trinidad and Tobago","TV": "Tuvalu","TW": "Taiwan (Republic of China)","TZ": "Tanzania, United Republic of","UA": "Ukraine","UG": "Uganda","UM": "US Minor Outlying Islands","US": "United States","UY": "Uruguay","UZ": "Uzbekistan","VA": "Holy See (Vatican City State)","VC": "Saint Vincent and the Grenadines","VE": "Venezuela, Bolivarian Republic of","VG": "Virgin Islands, British","VI": "Virgin Islands, U.S.","VN": "Vietnam","VU": "Vanuatu","WF": "Wallis and Futuna Islands","WS": "Samoa","XK": "Kosovo","YE": "Yemen","YT": "Mayotte","ZA": "South Africa","ZM": "Zambia","ZW": "Zimbabwe"}
  return data[(code || '').toUpperCase()] || code;
}

import { queryCounts, querySummary } from '../store/query-utils';
import { mapGetters } from '../store/map-state';
import { useStore } from 'vuex';
import { onMounted, ref, watch, computed } from 'vue';
const store = useStore();

const countries = ref({});

const { range, host, path, os, device, is_bot, is_new, browser, language, referrer, utm_source, utm_medium, utm_campaign, country, region, city, event, dark, summary, showVisitors, embed } = mapGetters();

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
  // console.log('clicked on', country);
  store.commit('setCountry', country);
}

function periodicRefresh() {
  clearInterval(window._latest_refresh_timer)
  window._latest_refresh_timer = setInterval(() => {
    if (range.value == 1) {
      location.reload(true);
    }
  }, 5 * 60 * 1000);
}
periodicRefresh();

onMounted(getCountryData);
watch(host, getCountryData);
watch(path, getCountryData);
watch(range, getCountryData);
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
watch(region, getCountryData);
watch(city, getCountryData);
watch(event, getCountryData);

watch(range, periodicRefresh)
</script>

<template>
  <div :class="{ container: !embed, 'mt-5': !embed }">

    <Subnav />

    <div class="row">
      <div class="col-md-12">
        <Card>

          <div class="row p-1 pt-2">
            <Stat title="Visitors" tooltip="Unique Visitors in Time Period" :muted="false" :underline="!showVisitors" @click="store.commit('setShowVisitors', true)" />
            <Stat title="Total Pageviews" :muted="false" :underline="showVisitors" @click="store.commit('setShowVisitors', false)" />
            <Stat title="Bounce Rate" tooltip="One-page Visits / Visitor Count" />
            <Stat title="Session Length" tooltip="Average Session Length" />
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
                <a class="nav-link" data-bs-toggle="tab" href="#campaign">Campaign</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-bs-toggle="tab" href="#term">Term</a>
              </li>
            </ul>


            <div class="tab-content mt-5">
              <div class="tab-pane fade active show" id="referrers">
                <small class="text-muted w-495 d-inline-block">
                  <Popper hover content="Referrer Domain">
                    Source
                  </Popper>
                </small>
                <small class="text-muted w-495 d-inline-block text-right">{{ visitorsString }}</small>

                <PseudoTable column="referer_host" setter="setReferrer" :favicons="true" :links="true" defaultText="Direct / None" />
              </div>

              <div class="tab-pane fade show" id="referrer_urls">
                <small class="text-muted w-495 d-inline-block">
                  <Popper hover content="Full Referrer URL">
                    Source
                  </Popper>
                </small>
                <small class="text-muted w-495 d-inline-block text-right">{{ visitorsString }}</small>

                <PseudoTable column="referer_url" :favicons="true" :links="true" defaultText="Direct / None" />
              </div>

              <div class="tab-pane fade show" id="medium">
                <small class="text-muted w-495 d-inline-block">
                  <Popper hover content="Marketing Channel: Social, Organic, Paid, Email, Affiliate, etc.">
                      Utm_medium
                  </Popper>
                </small>
                <small class="text-muted w-495 d-inline-block text-right">{{ visitorsString }}</small>

                <PseudoTable column="utm_medium" :limit="5" setter="setUtm_medium" />

                <small class="text-muted w-495 d-inline-block">
                  <Popper hover content="Site within channel.">
                    Utm_source
                  </Popper>
                </small>
                <small class="text-muted w-495 d-inline-block text-right">{{ visitorsString }}</small>

                <PseudoTable column="utm_source" :limit="5" setter="setUtm_source" />
              </div>

              <div class="tab-pane fade show" id="campaign">
                <small class="text-muted w-495 d-inline-block">
                  <Popper hover content="Name to describe your marketing campaign">
                    Utm_campaign
                  </Popper>
                </small>
                <small class="text-muted w-495 d-inline-block text-right">{{ visitorsString }}</small>

                <PseudoTable column="utm_campaign" :limit="5" setter="setUtm_campaign" />

                <small class="text-muted w-495 d-inline-block">
                  <Popper hover content="Used to differentiate links within a single campaign">
                    Utm_content
                  </Popper>
                </small>
                <small class="text-muted w-495 d-inline-block text-right">{{ visitorsString }}</small>

                <PseudoTable column="utm_content" :limit="5" setter="setUtm_content" />
              </div>

              <div class="tab-pane fade show" id="term">
                <small class="text-muted w-495 d-inline-block">
                  <Popper hover content="Optional, often used to track search terms in paid marketing campaigns">
                    Utm_term
                  </Popper>
                </small>
                <small class="text-muted w-495 d-inline-block text-right">{{ visitorsString }}</small>

                <PseudoTable column="utm_term" setter="setUtm_term" />
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
              <li class="nav-item">
                <a class="nav-link" data-bs-toggle="tab" href="#entrypages">Entry <span class="d-none d-sm-inline"> Pages</span></a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-bs-toggle="tab" href="#exitpages">Exit <span class="d-none d-sm-inline"> Pages</span></a>
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

              <div class="tab-pane fade show" id="entrypages">
                <small class="text-muted w-495 d-inline-block">Page URL</small>
                <small class="text-muted w-495 d-inline-block text-right">Entries</small>

                <PseudoTable column="pathname" valueColumn="EntrypageCount" setter="setPath" defaultText="None" />
              </div>

              <div class="tab-pane fade show" id="exitpages">
                <small class="text-muted w-495 d-inline-block">Page URL</small>
                <small class="text-muted w-495 d-inline-block text-right">Exits</small>

                <PseudoTable column="pathname" valueColumn="ExitPagecount" setter="setPath" defaultText="None" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-md-6">
        <Card>
          <h5 class="card-title float-left tweaked">Locations</h5>
          <ul class="nav nav-tabs float-right">
            <li class="nav-item ms-auto">
              <a class="nav-link active" data-bs-toggle="tab" href="#map">Map</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-bs-toggle="tab" href="#countries">Countries</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-bs-toggle="tab" href="#regions">Regions</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-bs-toggle="tab" href="#cities">Cities</a>
            </li>
          </ul>

          <div class="tab-content mt-5">
            <div class="tab-pane fade show active" id="map">
              <SvgMap :countries="countries" :dark="dark" :showVisitors="showVisitors" @clicked="countryClicked" />
            </div>
            <div class="tab-pane fade" id="countries">
              <small class="text-muted w-495 d-inline-block">Country</small>
              <small class="text-muted w-495 d-inline-block text-right">{{ visitorsString }}</small>

              <PseudoTable column="country_code" setter="setCountry" :showFlags="true" :keyFormatter="countryCodeToName" />
            </div>
            <div class="tab-pane fade" id="regions">
              <small class="text-muted w-495 d-inline-block">Region</small>
              <small class="text-muted w-495 d-inline-block text-right">{{ visitorsString }}</small>

              <PseudoTable column="region" setter="setRegion" :keyFormatter="capitalizeFirstLetter" />
            </div>
            <div class="tab-pane fade" id="cities">
              <small class="text-muted w-495 d-inline-block">City</small>
              <small class="text-muted w-495 d-inline-block text-right">{{ visitorsString }}</small>

              <PseudoTable column="city" setter="setCity" :keyFormatter="capitalizeFirstLetter" />
            </div>
          </div>
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

    <div class="row mt-3">
      <div class="col-md-12">
        <Card>
          <h5 class="card-title float-left tweaked">
            <Popper hover content="Custom events (Javascript)">
              Events
            </Popper>
          </h5>

          <div class="mt-5">
            <small class="text-muted w-495 d-inline-block">Event Name</small>
            <small class="text-muted w-495 d-inline-block text-right float-right">{{ visitorsString === 'Visitors' ? 'Events from Unique Visitors' : 'Event Count' }}</small>

            <PseudoTable column="event" setter="setEvent" :keyFormatter="capitalizeFirstLetter" />
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