<script setup>
import Subnav from '../components/Subnav.vue'
import Visits from '../components/Visits.vue'
import Card from '../components/Card.vue'
import Stat from '../components/Stat.vue'
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

                <div class="mt-2 pseudotable referrers">
                  <div class="mb-1">
                    <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" style="width: 85%">&nbsp;Direct / None</div>
                    <span class="float-right text-right pt-1">100</span>
                  </div>
                  <div class="mb-1">
                    <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" style="width: 51.85%">&nbsp;<img src="https://logo.clearbit.com/www.meetingroom365.com" onerror="this.onerror=null; this.src='default.png';">&nbsp;<a class="d-inline-block text-truncate" href="http://www.meetingroom365.com" target="_blank">www.meetingroom365.com</a></div>
                    <span class="float-right text-right pt-1">61</span>
                  </div>
                  <div class="mb-1">
                    <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" style="width: 16.15%">&nbsp;<img src="https://logo.clearbit.com/medium.com" onerror="this.onerror=null; this.src='default.png';">&nbsp;<a class="d-inline-block text-truncate" href="http://medium.com" target="_blank">medium.com</a></div>
                    <span class="float-right text-right pt-1">19</span>
                  </div>
                  <div class="mb-1">
                    <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" style="width: 2.55%">&nbsp;<img src="https://logo.clearbit.com/baidu.com" onerror="this.onerror=null; this.src='default.png';">&nbsp;<a class="d-inline-block text-truncate" href="http://baidu.com" target="_blank">baidu.com</a></div>
                    <span class="float-right text-right pt-1">3</span>
                  </div>
                  <div class="mb-1">
                    <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" style="width: 2.55%">&nbsp;<img src="https://logo.clearbit.com/www.reddit.com" onerror="this.onerror=null; this.src='default.png';">&nbsp;<a class="d-inline-block text-truncate" href="http://www.reddit.com" target="_blank">www.reddit.com</a></div>
                    <span class="float-right text-right pt-1">3</span>
                  </div>
                  <div class="mb-1">
                    <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" style="width: 1.7%">&nbsp;<img src="https://logo.clearbit.com/www.google.es" onerror="this.onerror=null; this.src='default.png';">&nbsp;<a class="d-inline-block text-truncate" href="http://www.google.es" target="_blank">www.google.es</a></div>
                    <span class="float-right text-right pt-1">2</span>
                  </div>
                  <div class="mb-1">
                    <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" style="width: 0.85%">&nbsp;<img src="https://logo.clearbit.com/www.google.com" onerror="this.onerror=null; this.src='default.png';">&nbsp;<a class="d-inline-block text-truncate" href="http://www.google.com" target="_blank">www.google.com</a></div>
                    <span class="float-right text-right pt-1">1</span>
                  </div>
                  <div class="mb-1">
                    <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" style="width: 0.85%">&nbsp;<img src="https://logo.clearbit.com/www.benq.com" onerror="this.onerror=null; this.src='default.png';">&nbsp;<a class="d-inline-block text-truncate" href="http://www.benq.com" target="_blank">www.benq.com</a></div>
                    <span class="float-right text-right pt-1">1</span>
                  </div>
                  <div class="mb-1">
                    <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" style="width: 0.85%">&nbsp;<img src="https://logo.clearbit.com/blog.meetingroom365.com" onerror="this.onerror=null; this.src='default.png';">&nbsp;<a class="d-inline-block text-truncate" href="http://blog.meetingroom365.com" target="_blank">blog.meetingroom365.com</a></div>
                    <span class="float-right text-right pt-1">1</span>
                  </div>
                  <div class="mb-1">
                    <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" style="width: 0.85%">&nbsp;<img src="https://logo.clearbit.com/dhelic98.github.io" onerror="this.onerror=null; this.src='default.png';">&nbsp;<a class="d-inline-block text-truncate" href="http://dhelic98.github.io" target="_blank">dhelic98.github.io</a></div>
                    <span class="float-right text-right pt-1">1</span>
                  </div></div>
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
        <Card title="Countries">
          foo
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
                <div class="mb-1">
                  <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" style="width: 85%">&nbsp;New</div>
                  <span class="float-right text-right pt-1">138</span>
                </div>
                <div class="mb-1">
                  <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" style="width: 33.8768115942029%">&nbsp;Returning</div>
                  <span class="float-right text-right pt-1">55</span>
                </div></div>
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