<script setup>
import { queryCounts, queryEntryExitPages, queryLoadTimes, returnDecryptor } from '../store/query-utils';
import { ref, onMounted, watch, computed } from 'vue';
import { mapGetters } from '../store/map-state';
import { useStore } from 'vuex';
const store = useStore();

const { column, iconify, favicons, browserIcons, osIcons, showFlags, addCountries, links, setter, linkPrefix, limit, defaultText, valueColumn, loadTimes, valueFormatter, keyFormatter } = defineProps({
  column: String,
  iconify: Boolean,
  favicons: Boolean,
  browserIcons: Boolean,
  osIcons: Boolean,
  showFlags: Boolean,
  addCountries: Boolean,
  links: Boolean,
  setter: String,
  linkPrefix: String,
  limit: Number,
  defaultText: String,
  valueColumn: String,
  loadTimes: Boolean,
  valueFormatter: Function,
  keyFormatter: Function,
});

const { host, path, os, device, is_bot, is_new, browser, language, referrer, utm_source, utm_medium, utm_campaign, country, region, city, event, range, summary, showVisitors } = mapGetters();
const watcherBundle = { host, path, os, device, is_bot, is_new, browser, language, referrer, utm_source, utm_medium, utm_campaign, country, region, city, event };

const valueColumnActual = computed(() => {
  return valueColumn || (showVisitors.value ? 'count(DISTINCT ip)' : 'count(*)');
});

const rows = ref([]);
const maxValue = ref(0);
const loading = ref(true);

async function getData() {
  // if column is entrypages or ExitPagecount
  let result = [];
  loading.value = true;
  if (valueColumn === 'AvgLoadTime') result = await queryLoadTimes(store);
  else if (valueColumn === 'EntrypageCount') result = await queryEntryExitPages(store, column, valueColumn, limit || 100);
  else if (valueColumn === 'ExitPagecount') result = await queryEntryExitPages(store, column, valueColumn, limit || 100);
  else result = await queryCounts(store, column, limit || 100);

  // console.log('result', column, valueColumnActual.value, result);

  let filtered = result.filter(x => !x[column]);

  // Combine all null / falsey rows
  if (filtered.length > 1) {
    let total = filtered.map(x => x[valueColumnActual.value]).reduce((p, c) => p += c);
    let new_result = result.filter(x => x[column]);
    let newObj = {};
    newObj[column] = null;
    newObj[valueColumnActual.value] = total;
    new_result.unshift(newObj);
    result = new_result;
  }

  result.sort((b, a) => a[valueColumnActual.value] - b[valueColumnActual.value]);

  rows.value = result;
  try{ maxValue.value = result[0][valueColumnActual.value]; } catch(e) { maxValue.value = 0 }
  loading.value = false;
}

function localify(n) {
  if (n == parseInt(n)) n = parseInt(n);
  if (typeof n === 'number') n = n.toLocaleString();
  return n;
}

function inferBrowserIcon(s, size = 48, browser = 'web') {
  const browsers = 'avant,basilisk,brave,browsh,chrome,chromium,deno,dolphin,edge,electron,epic,falkon,firefox,geckoview,hermes,icecat,jsdom,konqueror,maxthon,midori,netsurf,node.js,nw.js,opera,otter,puffin,qutebrowser,safari,seamonkey,servo,silk,spidermonkey,tor,uc,v8,vivaldi,web,webkit,yandex'.split(',');
  const sizes = '16,24,32,48,64,128,256,512'.split(',');
  const arr = s.toLowerCase().trim().split(' ');
  let intersection = browsers.filter(value => arr.includes(value));
  if (intersection.length) browser = intersection[0];

  return `https://cdnjs.cloudflare.com/ajax/libs/browser-logos/72.0.0/${ browser }/${ browser }_${ size }x${ size }.png`;
}

function inferOsIcon(s) {
  const codes = 'AIX,AND,AMG,ATV,ARL,BTR,SBA,BEO,BLB,QNX,CAI,CES,COS,CYN,DEB,DEE,DFB,FED,FOS,FIR,BSD,FYD,GNT,GTV,HPX,HAI,IPA,HAR,KOS,KNO,KBT,LIN,LBT,MAC,MAE,MAG,MDR,SMG,MIN,MOR,NBS,WII,NDS,OS2,OBS,OWR,PCL,PSP,PS3,RHT,ROS,ROK,RSO,REM,REX,SAB,SSE,SAF,SLW,SOS,SYL,SYM,SYS,S40,S60,SY3,TDX,TIZ,UBT,WAS,WHS,WIN,WCE,WIO,WMO,WPH,WRT,XBX,XBT,YNS,IOS,POS,WOS'.split(',');
  const names = 'aix,android,amigaos,tvos,arch linux,backtrack,bada,beos,blackberry os,blackberry tablet os,caixa mágica,centos,chrome os,cyanogenmod,debian,deepin,dragonfly,fedora,firefox os,fire os,freebsd,fydeos,gentoo,google tv,hp-ux,haiku os,ipados,harmonyos,kaios,knoppix,kubuntu,linux,lubuntu,mac,maemo,mageia,mandriva,meego,mint,morphos,netbsd,nintendo,nintendo mobile,os/2,openbsd,openwrt,pclinuxos,playstation portable,playstation,red hat,risc os,roku os,rosa,remix os,rex,sabayon,suse,sailfish os,slackware,solaris,syllable,symbian,symbian os,symbian os series 40,symbian os series 60,symbian^3,threadx,tizen,ubuntu,watchos,whale os,windows,windows ce,windows iot,windows mobile,windows phone,windows rt,xbox,xubuntu,yunos,ios,palmos,webos'.split(',');
  const sizes = '16,24,32,48,64,128,256,512'.split(',');
  let code = '', size = sizes[3];
  s = s.toLowerCase().trim();

  let inx = (names.map(x => s.includes(x))).indexOf(true);
  if (inx > 0) code = codes[inx];

  return code ? `https://cdn.jsdelivr.net/npm/@egoistdeveloper/operating-system-logos/src/${ size }x${ size }/${ code }.png`:'/default.png';
}

function addIcon(s) {
  s = (s+'').toLowerCase().trim();

  const lookup = {
    'desktop': 'bi bi-pc-display-horizontal',
    'laptop': 'bi bi-laptop',
    'tablet': 'bi bi-tablet',
    'mobile': 'bi bi-phone',
    'returning': 'bi bi-arrow-repeat',
    'new': 'bi bi-person-plus',
    'normal users': 'bi bi-person-square',
    'headless browsers': 'bi bi-robot',
  };

  return lookup[s];
}

function flagForCountryCode(code) {
  return `https://cdn.jsdelivr.net/npm/svg-country-flags/svg/${ code.toLowerCase() }.svg`
}

function countryCodeToName(code) {
  const data = {"AD": "Andorra","AE": "United Arab Emirates","AF": "Afghanistan","AG": "Antigua and Barbuda","AI": "Anguilla","AL": "Albania","AM": "Armenia","AO": "Angola","AQ": "Antarctica","AR": "Argentina","AS": "American Samoa","AT": "Austria","AU": "Australia","AW": "Aruba","AX": "\u00c5land Islands","AZ": "Azerbaijan","BA": "Bosnia and Herzegovina","BB": "Barbados","BD": "Bangladesh","BE": "Belgium","BF": "Burkina Faso","BG": "Bulgaria","BH": "Bahrain","BI": "Burundi","BJ": "Benin","BL": "Saint Barthélemy","BM": "Bermuda","BN": "Brunei Darussalam","BO": "Bolivia, Plurinational State of","BQ": "Caribbean Netherlands","BR": "Brazil","BS": "Bahamas","BT": "Bhutan","BV": "Bouvet Island","BW": "Botswana","BY": "Belarus","BZ": "Belize","CA": "Canada","CC": "Cocos (Keeling) Islands","CD": "Congo, the Democratic Republic of the","CF": "Central African Republic","CG": "Republic of the Congo","CH": "Switzerland","CI": "C\u00f4te d'Ivoire","CK": "Cook Islands","CL": "Chile","CM": "Cameroon","CN": "China (People's Republic of China)","CO": "Colombia","CR": "Costa Rica","CU": "Cuba","CV": "Cape Verde","CW": "Cura\u00e7ao","CX": "Christmas Island","CY": "Cyprus","CZ": "Czech Republic","DE": "Germany","DJ": "Djibouti","DK": "Denmark","DM": "Dominica","DO": "Dominican Republic","DZ": "Algeria","EC": "Ecuador","EE": "Estonia","EG": "Egypt","EH": "Western Sahara","ER": "Eritrea","ES": "Spain","ET": "Ethiopia","EU": "Europe","FI": "Finland","FJ": "Fiji","FK": "Falkland Islands (Malvinas)","FM": "Micronesia, Federated States of","FO": "Faroe Islands","FR": "France","GA": "Gabon","GB-ENG": "England","GB-NIR": "Northern Ireland","GB-SCT": "Scotland","GB-WLS": "Wales","GB": "United Kingdom","GD": "Grenada","GE": "Georgia","GF": "French Guiana","GG": "Guernsey","GH": "Ghana","GI": "Gibraltar","GL": "Greenland","GM": "Gambia","GN": "Guinea","GP": "Guadeloupe","GQ": "Equatorial Guinea","GR": "Greece","GS": "South Georgia and the South Sandwich Islands","GT": "Guatemala","GU": "Guam","GW": "Guinea-Bissau","GY": "Guyana","HK": "Hong Kong","HM": "Heard Island and McDonald Islands","HN": "Honduras","HR": "Croatia","HT": "Haiti","HU": "Hungary","ID": "Indonesia","IE": "Ireland","IL": "Israel","IM": "Isle of Man","IN": "India","IO": "British Indian Ocean Territory","IQ": "Iraq","IR": "Iran, Islamic Republic of","IS": "Iceland","IT": "Italy","JE": "Jersey","JM": "Jamaica","JO": "Jordan","JP": "Japan","KE": "Kenya","KG": "Kyrgyzstan","KH": "Cambodia","KI": "Kiribati","KM": "Comoros","KN": "Saint Kitts and Nevis","KP": "Korea, Democratic People's Republic of","KR": "Korea, Republic of","KW": "Kuwait","KY": "Cayman Islands","KZ": "Kazakhstan","LA": "Laos (Lao People's Democratic Republic)","LB": "Lebanon","LC": "Saint Lucia","LI": "Liechtenstein","LK": "Sri Lanka","LR": "Liberia","LS": "Lesotho","LT": "Lithuania","LU": "Luxembourg","LV": "Latvia","LY": "Libya","MA": "Morocco","MC": "Monaco","MD": "Moldova, Republic of","ME": "Montenegro","MF": "Saint Martin","MG": "Madagascar","MH": "Marshall Islands","MK": "North Macedonia","ML": "Mali","MM": "Myanmar","MN": "Mongolia","MO": "Macao","MP": "Northern Mariana Islands","MQ": "Martinique","MR": "Mauritania","MS": "Montserrat","MT": "Malta","MU": "Mauritius","MV": "Maldives","MW": "Malawi","MX": "Mexico","MY": "Malaysia","MZ": "Mozambique","NA": "Namibia","NC": "New Caledonia","NE": "Niger","NF": "Norfolk Island","NG": "Nigeria","NI": "Nicaragua","NL": "Netherlands","NO": "Norway","NP": "Nepal","NR": "Nauru","NU": "Niue","NZ": "New Zealand","OM": "Oman","PA": "Panama","PE": "Peru","PF": "French Polynesia","PG": "Papua New Guinea","PH": "Philippines","PK": "Pakistan","PL": "Poland","PM": "Saint Pierre and Miquelon","PN": "Pitcairn","PR": "Puerto Rico","PS": "Palestine","PT": "Portugal","PW": "Palau","PY": "Paraguay","QA": "Qatar","RE": "Réunion","RO": "Romania","RS": "Serbia","RU": "Russian Federation","RW": "Rwanda","SA": "Saudi Arabia","SB": "Solomon Islands","SC": "Seychelles","SD": "Sudan","SE": "Sweden","SG": "Singapore","SH": "Saint Helena, Ascension and Tristan da Cunha","SI": "Slovenia","SJ": "Svalbard and Jan Mayen Islands","SK": "Slovakia","SL": "Sierra Leone","SM": "San Marino","SN": "Senegal","SO": "Somalia","SR": "Suriname","SS": "South Sudan","ST": "Sao Tome and Principe","SV": "El Salvador","SX": "Sint Maarten (Dutch part)","SY": "Syrian Arab Republic","SZ": "Swaziland","TC": "Turks and Caicos Islands","TD": "Chad","TF": "French Southern Territories","TG": "Togo","TH": "Thailand","TJ": "Tajikistan","TK": "Tokelau","TL": "Timor-Leste","TM": "Turkmenistan","TN": "Tunisia","TO": "Tonga","TR": "Turkey","TT": "Trinidad and Tobago","TV": "Tuvalu","TW": "Taiwan (Republic of China)","TZ": "Tanzania, United Republic of","UA": "Ukraine","UG": "Uganda","UM": "US Minor Outlying Islands","US": "United States","UY": "Uruguay","UZ": "Uzbekistan","VA": "Holy See (Vatican City State)","VC": "Saint Vincent and the Grenadines","VE": "Venezuela, Bolivarian Republic of","VG": "Virgin Islands, British","VI": "Virgin Islands, U.S.","VN": "Vietnam","VU": "Vanuatu","WF": "Wallis and Futuna Islands","WS": "Samoa","XK": "Kosovo","YE": "Yemen","YT": "Mayotte","ZA": "South Africa","ZM": "Zambia","ZW": "Zimbabwe"}
  return data[(code || '').toUpperCase()] || code;
}

function columnToHost(s) {
  s = (s+'').toLowerCase().trim();

  if (s.indexOf('http') === 0) {
    const url = new URL(s);
    s = url.hostname;
  }

  return s;
}

function maxLength(s, n = 40) {
  if (s && s.length > n) s = s.substring(0, n) + '...';
  return s;
}

function justTaco(s) {
  if (s.includes('?')) s = s.split('?')[0];
  return s;
}

onMounted(getData);
watch(host, getData);
watch(path, getData);
watch(range, getData);
// watch(summary, getData);
watch(showVisitors, getData);
// watch(watcherBundle, getData);
watch(os, getData);
watch(device, getData);
watch(is_bot, getData);
watch(is_new, getData);
watch(browser, getData);
watch(language, getData);
watch(referrer, getData);
watch(utm_source, getData);
watch(utm_medium, getData);
watch(utm_campaign, getData);
watch(country, getData);
watch(region, getData);
watch(city, getData);
watch(event, getData);
</script>

<template>
  <div class="mt-2 pseudotable" :class="{ loading }">

    <div class="spinner-border spinme" role="status" v-if="loading"></div>

    <div class="mb-1" v-else-if="!rows.length">
      No data for selected period
    </div>

    <div class="mb-1" v-for="row in rows" v-else>
      <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" :style="`width: ${ (row[valueColumnActual] / maxValue ) * 85 }%`">&nbsp;

        <div v-if="iconify && addIcon(keyFormatter ? keyFormatter(row[column]) : row[column])" style="display:inline-block; margin-left: -3px">
          <i :class="addIcon(keyFormatter ? keyFormatter(row[column]) : row[column])"></i>&nbsp;&thinsp;
        </div>

        <a class="text-decoration-underline cp" v-if="!row[column] && setter" @click="setter && store.commit(setter, 0)">{{ defaultText || 'None' }}</a>
        <span v-else-if="!row[column]">{{ defaultText || 'None' }}</span>

        <div v-if="favicons" style="display: inline-block">
          <img v-if="row[column] && favicons" :src="`https://logo.clearbit.com/${ columnToHost(row[column]) }`" onerror="this.src='default.png';">&nbsp;&thinsp;
        </div>

        <div v-if="browserIcons" style="display: inline-block">
          <img v-if="row[column] && browserIcons" :src="`${ inferBrowserIcon(row[column]) }`">&nbsp;&thinsp;
        </div>

        <div v-if="column === 'event'" style="display: inline-block">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 630 630" style="width: 18px; height: 18px; margin-top: -4px;">
            <rect width="630" height="630" fill="#f7df1e"/>
            <path d="m423.2 492.19c12.69 20.72 29.2 35.95 58.4 35.95 24.53 0 40.2-12.26 40.2-29.2 0-20.3-16.1-27.49-43.1-39.3l-14.8-6.35c-42.72-18.2-71.1-41-71.1-89.2 0-44.4 33.83-78.2 86.7-78.2 37.64 0 64.7 13.1 84.2 47.4l-46.1 29.6c-10.15-18.2-21.1-25.37-38.1-25.37-17.34 0-28.33 11-28.33 25.37 0 17.76 11 24.95 36.4 35.95l14.8 6.34c50.3 21.57 78.7 43.56 78.7 93 0 53.3-41.87 82.5-98.1 82.5-54.98 0-90.5-26.2-107.88-60.54zm-209.13 5.13c9.3 16.5 17.76 30.45 38.1 30.45 19.45 0 31.72-7.61 31.72-37.2v-201.3h59.2v202.1c0 61.3-35.94 89.2-88.4 89.2-47.4 0-74.85-24.53-88.81-54.075z"/>
          </svg>&nbsp;&thinsp;
        </div>

        <div v-if="osIcons" style="display: inline-block">
          <img v-if="row[column] && osIcons" :src="`${ inferOsIcon(row[column]) }`">&nbsp;&thinsp;
        </div>

        <div v-if="addCountries && row.country_code && row[column]" style="display: inline-block">
          <img v-if="row.country_code && addCountries" style="max-width:25px;max-height:25px;height:25px;margin-top: -5px;" :title="`${ row[column] }${ row[column] ? ', ':'' }${ row.region && column !== 'region' ? row.region:'' }${ row.region && column !== 'region' ? ', ':'' }${ countryCodeToName(row.country_code) }`" :src="`${ flagForCountryCode(row.country_code) }`">&nbsp;&thinsp;
        </div>

        <div v-if="showFlags" style="display: inline-block">
          <img v-if="row[column] && showFlags" style="max-width:25px;max-height:25px;height:25px;margin-top: -5px;" :src="`${ flagForCountryCode(row[column]) }`">&nbsp;&thinsp;
        </div>

        <div v-if="setter" style="display: inline-block">
          <a
              v-if="row[column]" class="d-inline-block text-truncate cp"
              @click="store.commit(setter, row[column])"
          >
            {{ maxLength( keyFormatter ? keyFormatter(row[column]) : row[column] ) }}<!--{{ `${ column === 'region' || column === 'city' ? ', ':'' }${ row.region && column !== 'region' ? row.region:'' }${ row.region && column !== 'region' ? ', ':'' }${ row.country_code && column !== 'country_code' ? row.country_code:'' }` }}-->
          </a>
          &nbsp;<a
              v-if="row[column] && links" class="d-inline-block text-truncate"
              :href="`${ row[column].indexOf('http') ? 'http://':'' }${ linkPrefix || '' }${ row[column] }`"
              style="text-decoration: none"
              title="Open in new tab"
              target="_blank"
          >
            <i class="bi bi-box-arrow-up-right"></i>
          </a>
        </div>
        <div v-else-if="links" style="display: inline-block">
          <a
              v-if="row[column] && links" class="d-inline-block text-truncate"
              :href="`${ row[column].indexOf('http') ? 'http://':'' }${ linkPrefix || '' }${ row[column] }`"
              target="_blank"
          >
            {{ maxLength(row[column]) }}
          </a>

          <a
              v-if="column === 'referer_url' && (row[column] || '').includes('//t.co/') && (row[column] || '').length > 13"
              :href="`https://twitter.com/search?q=${ encodeURIComponent(justTaco(row[column])) }&src=typed_query&f=top`"
              style="margin-left: 5px"
              target="_blank"
          >
            <i class="bi bi-twitter"></i>
          </a>

          &nbsp;<a
            v-if="row[column] && links" class="d-inline-block text-truncate"
            :href="`${ row[column].indexOf('http') ? 'http://':'' }${ linkPrefix || '' }${ row[column] }`"
            style="text-decoration: none"
            title="Open in new tab"
            target="_blank"
          >
            <i class="bi bi-box-arrow-up-right"></i>
          </a>
        </div>

        <span v-if="row[column] && !links && !setter">{{ keyFormatter ? keyFormatter(row[column]) : row[column] }}</span>

      </div>
      <span class="float-right text-right pt-1">{{ valueFormatter ? valueFormatter(row[valueColumnActual]) : localify(row[valueColumnActual]) }}</span>
    </div>

  </div>
</template>

<style scoped>
i.bi.bi-box-arrow-up-right {
  font-size: 14px;
  position: relative;
  top: -1px;
}
.pseudotable.loading { height: 200px }
</style>