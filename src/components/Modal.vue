<script setup>
const { ref } = 'vue';

let server = 'https://analytics.serv.rs' || `${ location.protocol }//${ location.host }`;
const script_text = window.$('<textarea />').html(`&lt;script src="${ server }/a.js">&lt;/script>`).text();
</script>

<template>
  <div class="modal" id="embedScript" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add to your Website</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Embed this script on your website, and your data will appear here (publicly).</p>
          <p>
            <textarea rows="1" class="form-control" id="script" data-clipboard-target="#script" style="resize: none; font-family: monospace">{{ script_text }}</textarea>
            <small class="d-block mt-1">
              <a class="cp" data-clipboard-target="#script">Copy to clipboard</a>
              <span class="d-none">&nbsp;Copied!</span>
            </small>
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
<!--          <button type="button" class="btn btn-primary">Save changes</button>-->
        </div>
      </div>
    </div>
  </div>
</template>