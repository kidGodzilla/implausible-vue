<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
<!--  <HelloWorld msg="Hello Vue 3 + Vite" />-->
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" href="/">Implausible Analytics</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarColor01">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link cp" data-bs-toggle="modal" data-bs-target="#embedScript">Add to your Website</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>

  <div class="container mt-5">

    <div class="row">
      <div class="col-6">

        <ul class="nav nav-pills mb-1 d-inline-block">
          <li class="nav-item dropdown ms-auto">
            <a class="nav-link dropdown-toggle cp" data-bs-toggle="dropdown" role="button">
              <h5 class="d-inline pt-2 mb-0 name"></h5>
            </a>

            <div class="dropdown-menu websites left">
              <a class="dropdown-item cp" href="?host=analytics.serv.rs">Analytics.serv.rs</a>
            </div>
          </li>
        </ul>

        <span class="text-success d-none d-md-inline-block dot">·</span>
        <span class="current-visitors d-none d-md-inline-block">No current visitors</span>
      </div>
      <div class="col-6">
        <ul class="nav nav-pills mb-1">
          <li class="nav-item dropdown ms-auto">
            <a class="nav-link dropdown-toggle right cp" data-bs-toggle="dropdown" role="button">Latest</a>
            <div class="dropdown-menu right">
              <a class="dropdown-item cp" onclick="setRange(1)">Latest</a>
              <a class="dropdown-item cp" onclick="setRange(-1)">Yesterday</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item cp" onclick="setRange(7)">Last 7 Days</a>
              <a class="dropdown-item cp" onclick="setRange(30)">Last 30 Days</a>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-body">

            <div class="row">
              <div class="col-6 col-md-3">
                <h6 class="card-subtitle mb-2 text-muted">Visitors</h6>
                <h4 class="card-title visitors">-</h4>
              </div>

              <div class="col-6 col-md-3">
                <h6 class="card-subtitle mb-2 text-muted">Total Pageviews</h6>
                <h4 class="card-title pageviews">-</h4>
              </div>

              <div class="col-6 col-md-3 mt-3 mt-sm-0">
                <h6 class="card-subtitle mb-2 text-muted">Bounce Rate</h6>
                <h4 class="card-title bounced">-</h4>
              </div>

              <div class="col-6 col-md-3 mt-3 mt-sm-0">
                <h6 class="card-subtitle mb-2 text-muted"><span class="d-none d-sm-inline">Avg. </span>Session Length</h6>
                <h4 class="card-title duration">-</h4>
              </div>
            </div>

            <div id="visits" style="height: 300px;">
              <div class="spinner-border spinme" role="status"></div>
            </div>
          </div>
        </div>
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
              <div class="tab-pane fade show active" id="referrers">
                <small class="text-muted w-495 d-inline-block">Source</small>
                <small class="text-muted w-495 d-inline-block text-right">Visitors</small>

                <div class="mt-2 pseudotable referrers">
                  <div class="spinner-border spinme" role="status"></div>
                </div>
              </div>

              <div class="tab-pane fade show" id="medium">
                <small class="text-muted w-495 d-inline-block">Source</small>
                <small class="text-muted w-495 d-inline-block text-right">Visitors</small>

                <div class="mt-2 pseudotable medium">
                  <div class="spinner-border spinme" role="status"></div>
                </div>
              </div>

              <div class="tab-pane fade show" id="source">
                <small class="text-muted w-495 d-inline-block">Source</small>
                <small class="text-muted w-495 d-inline-block text-right">Visitors</small>

                <div class="mt-2 pseudotable source">
                  <div class="spinner-border spinme" role="status"></div>
                </div>
              </div>

              <div class="tab-pane fade show" id="campaign">
                <small class="text-muted w-495 d-inline-block">Source</small>
                <small class="text-muted w-495 d-inline-block text-right">Visitors</small>

                <div class="mt-2 pseudotable campaign">
                  <div class="spinner-border spinme" role="status"></div>
                </div>
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

                <div class="mt-2 pseudotable pages">
                  <div class="spinner-border spinme" role="status"></div>
                </div>
              </div>

              <div class="tab-pane fade show" id="loadtimes">
                <small class="text-muted w-495 d-inline-block">Page URL</small>
                <small class="text-muted w-495 d-inline-block text-right">Avg. Load Time</small>

                <div class="mt-2 pseudotable loadtimes">
                  <div class="spinner-border spinme" role="status"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-md-6">
        <div class="card min-357">
          <div class="card-body">
            <h5 class="card-title">Countries</h5>

            <div id="svgMap">
              <div class="spinner-border spinme" role="status"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 mt-3 mt-sm-0">
        <div class="card min-357">
          <div class="card-body">
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

                <div class="mt-2 pseudotable devices">
                  <div class="spinner-border spinme" role="status"></div>
                </div>

                <hr>

                <div class="mt-2 pseudotable bots"></div>
              </div>

              <div class="tab-pane fade" id="new">
                <small class="text-muted w-495 d-inline-block">New vs. Returning</small>
                <small class="text-muted w-495 d-inline-block text-right">Visitors</small>

                <div class="mt-2 pseudotable new">
                  <div class="spinner-border spinme" role="status"></div>
                </div>
              </div>

              <div class="tab-pane fade" id="browser">
                <small class="text-muted w-495 d-inline-block">Browser</small>
                <small class="text-muted w-495 d-inline-block text-right">Visitors</small>

                <div class="mt-2 pseudotable browsers">
                  <div class="spinner-border spinme" role="status"></div>
                </div>
              </div>

              <div class="tab-pane fade" id="language">
                <small class="text-muted w-495 d-inline-block">Language</small>
                <small class="text-muted w-495 d-inline-block text-right">Visitors</small>

                <div class="mt-2 pseudotable languages">
                  <div class="spinner-border spinme" role="status"></div>
                </div>
              </div>

              <div class="tab-pane fade" id="os">
                <small class="text-muted w-495 d-inline-block">OS</small>
                <small class="text-muted w-495 d-inline-block text-right">Visitors</small>

                <div class="mt-2 os">
                  <div class="spinner-border spinme" role="status"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
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

  <p class="text-center">
    Copyright &copy; <span class="year">2021</span> <a href="https://jamesfuthey.com/" target="_blank">James Futhey</a>.
    All Rights Reserved.
  </p>

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
            <textarea rows="1" class="form-control" id="script" data-clipboard-target="#script" style="resize: none; font-family: monospace"></textarea>
            <small class="d-block mt-1">
              <a class="cp" data-clipboard-target="#script">Copy to clipboard</a>
              <span class="d-none">&nbsp;Copied!</span>
            </small>
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.svgMap-map-wrapper { background: transparent }
.text-right { text-align: right !important }
.min-357 { min-height: 357px; height: 100% }
.bg-grey:hover { background: #2847b714 }
.bg-grey { background: #2847b729 }
.w-495 { width: 49.5% !important }
.float-right { float: right }
.cursor-help { cursor: help }
.cp { cursor: pointer }

.nav-tabs { font-size: 12px }
body { background-color: #fafafa }
.nav-tabs .nav-link { padding-top: 0.5rem; padding-bottom: 0.5rem }
.spinme { display:block; margin: 0 auto; position: relative; top: 125px }
.dropdown-menu.right.show { z-index: 99999 !important; transform: translate3d(-50px, 42px, 0px) !important }
.dropdown-menu.left.show { z-index: 99999 !important; transform: translate3d(25px, 42px, 0px) !important }
.dot { margin-left: 16px; margin-right: 4px; transform-origin: center center; transform: scale(4) translateY(-0.85px) }
.card { box-shadow: 0 1px 3px 0 rgba(0,0,0,.04),0 1px 2px 0 rgba(0,0,0,.02); border: 1px solid rgba(0,0,0,.05) }
.shaded img { max-height: 18px; max-width: 18px; margin-top: -5px }
.pseudotable > div { background: #00000007; padding-right: 6px }
.shaded a { color: #000; margin-bottom: -5px; max-width: 65vw }
#sankeyChart { height: 500px; width: 100%; }
.nav-pills { margin-top: -6px }
.shaded { padding-left: 3px }

@media screen and (max-width: 1200px) {
  .w-495 { width: 49% !important }
}
@media screen and (max-width: 768px) {
  .nav-pills { margin-top: -8px }
  .nav-tabs .nav-link { padding: .5rem .5rem }
}
</style>
