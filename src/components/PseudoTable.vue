<script setup>
import {queryCounts, queryLoadTimes} from '../store/query-utils';
import { mapGetters } from '../store/map-state';
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
const store = useStore();

const { column, iconify, favicons, browserIcons, osIcons, links, linkPrefix, limit, defaultText, valueColumn, loadTimes, valueFormatter, keyFormatter } = defineProps({
  column: String,
  iconify: Boolean,
  favicons: Boolean,
  browserIcons: Boolean,
  osIcons: Boolean,
  links: Boolean,
  linkPrefix: String,
  limit: Number,
  defaultText: String,
  valueColumn: String,
  loadTimes: Boolean,
  valueFormatter: Function,
  keyFormatter: Function,
});

const { host, range } = mapGetters();

const rows = ref([]);
const maxValue = ref(0);
const loading = ref(true);

async function getData() {
  let result = loadTimes ? await queryLoadTimes(store) : await queryCounts(store, column, limit || 10);

  // console.log('result', column, result);

  rows.value = result;
  // console.log(result);
  try{ maxValue.value = result[0][valueColumn || 'count(*)']; } catch(e) { maxValue.value = 0 }
  loading.value = false;
}

function inferBrowserIcon(s) {
  const browsers = 'avant,basilisk,brave,browsh,chrome,chromium,deno,dolphin,edge,electron,epic,falkon,firefox,geckoview,hermes,icecat,jsdom,konqueror,maxthon,midori,netsurf,node.js,nw.js,opera,otter,puffin,qutebrowser,safari,seamonkey,servo,silk,spidermonkey,tor,uc,v8,vivaldi,web,webkit,yandex'.split(',');
  const sizes = '16,24,32,48,64,128,256,512'.split(',');
  const arr = s.toLowerCase().trim().split(' ');
  let browser = 'web', size = sizes[3];
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


onMounted(getData);
watch(host, getData);
watch(range, getData);
</script>

<template>
  <div class="mt-2 pseudotable">

    <div class="spinner-border spinme" role="status" v-if="loading"></div>

    <div class="mb-1" v-else-if="!rows.length">
      No data for selected period
    </div>

    <div class="mb-1" v-for="row in rows" v-else>
      <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" :style="`width: ${ (row[valueColumn || 'count(*)'] / maxValue ) * 85 }%`">&nbsp;

        <div v-if="iconify && addIcon(keyFormatter ? keyFormatter(row[column]) : row[column])" style="display:inline-block; margin-left: -3px">
          <i :class="addIcon(keyFormatter ? keyFormatter(row[column]) : row[column])"></i>&nbsp;&thinsp;
        </div>

        <span v-if="!row[column]">{{ defaultText || 'None' }}</span>

        <div v-if="favicons" style="display:inline-block">
          <img v-if="row[column] && favicons" :src="`https://logo.clearbit.com/${ row[column] }`" onerror="this.onerror=null; this.src='default.png';">&nbsp;&thinsp;
        </div>

        <div v-if="browserIcons" style="display:inline-block">
          <img v-if="row[column] && browserIcons" :src="`${ inferBrowserIcon(row[column]) }`">&nbsp;&thinsp;
        </div>

        <div v-if="osIcons" style="display:inline-block">
          <img v-if="row[column] && osIcons" :src="`${ inferOsIcon(row[column]) }`">&nbsp;&thinsp;
        </div>

        <div v-if="links" style="display:inline-block">
          <a
              v-if="row[column] && links" class="d-inline-block text-truncate"
              :href="`http://${ linkPrefix || '' }${ row[column] }`"
              target="_blank"
          >
            {{ row[column] }}
          </a>
        </div>

        <span v-if="row[column] && !links">{{ keyFormatter ? keyFormatter(row[column]) : row[column] }}</span>

      </div>
      <span class="float-right text-right pt-1">{{ valueFormatter ? valueFormatter(row[valueColumn || "count(*)"]) : row[valueColumn || "count(*)"] }}</span>
    </div>

  </div>
</template>