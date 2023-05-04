<script setup>
import { computed, ref } from 'vue'
import { mapGetters } from '../store/map-state';

const { key, publicKey, dark } = mapGetters();

const encrypted = ref(true);

let queryParams = {};
location.search.slice(1).split('&').map(s => s.split('=')).forEach(a => queryParams[a[0]] = a[1]);
Object.keys(queryParams).map(x => queryParams[x] = decodeURIComponent(queryParams[x]));

const server = import.meta.env.VITE_BACKEND_URL || `${ location.protocol }//${ location.host }`;

const encryption_string = computed(() => publicKey.value && encrypted.value ? `&lt;script>window.__analytics_encryption_key = '${ publicKey.value }';&lt;/script>\n` : '');
const script_text = computed(() => formatString(`&lt;!-- ${ import.meta.env.VITE_APP_NAME } -->\n${ encryption_string.value }&lt;script src='${ server }/a.js'>&lt;/script>`));

const key_string = computed(() => encrypted.value ? `&key=${ encodeURIComponent(key.value) }&pkey=${ publicKey.value }` : '');
const url_text = computed(() => `${ server }?host=${ queryParams.host }&range=${ queryParams.range }${ key_string.value }`);

function formatString(text) {
  return window.$('<textarea />').html(text).text()
}
</script>

<template>
  <div class="modal" id="embedScript" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content" :class="{ 'x-bg-dark': dark }">
        <div class="modal-header">
          <h5 class="modal-title">Add to your Website</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h5>Embed Code</h5>

          <p>Embed this script on your website, and your analytics data will appear here.</p>
          <p>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" v-model="encrypted" id="flexSwitchCheckChecked" checked>
              <label class="form-check-label" for="flexSwitchCheckChecked">{{ encrypted ? 'Encrypted Analytics' : 'Public Analytics' }}</label>
            </div>
          </p>
          <p>
            <textarea rows="4" spellcheck="false" class="form-control" id="script" data-clipboard-target="#script" style="resize: none; font-family: monospace">{{ script_text }}</textarea>
            <small class="d-block mt-1">
              <a class="cp" data-clipboard-target="#script">Copy to clipboard</a>
              <span class="d-none">&nbsp;Copied!</span>
            </small>
          </p>
          <br>
          <h5>URL to View Analytics</h5>
          <p>You will need the following URL to access {{ encrypted ? '(and decrypt)' : '' }} your analytics:</p>
          <p>
            <textarea rows="3" spellcheck="false" class="form-control" id="url" data-clipboard-target="#url" style="resize: none; font-family: monospace">{{ url_text }}</textarea>
            <small class="d-block mt-1">
              <a class="cp" data-clipboard-target="#url">Copy to clipboard</a>
              <span class="d-none">&nbsp;Copied!</span>
            </small>
          </p>
          <p v-if="encrypted">
            <small><strong>Save your URL.</strong> If you lose this, you will need to reinstall analytics with a new encryption key.</small>
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
<!--          <button type="button" class="btn btn-primary">Save changes</button>-->
        </div>
      </div>
    </div>
  </div>
</template>