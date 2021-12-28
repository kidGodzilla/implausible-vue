<template>
  <div :id="id" ref="svgMap"></div>
</template>

<script>
export default {
  name: 'svg-map',

  data() {
    return {
      id: 'svg-map-' + Math.random().toString(36).substr(2, 9)
    }
  },

  props: {
    countries: {
      type: Object
    },
  },

  methods: {
    createMap() {
      new svgMap({
        targetElementID: this.id,
        colorMax: '#3459E6',
        colorMin: '#c7d2fc',
        colorNoData: '#E2E2E2',
        data: {
          data: {
            visitors: {
              name: 'visitors',
              format: '{0}',
              thousandSeparator: ','
            }
          },
          applyData: 'visitors',
          values: this.countries || {}
        }
      });
    }
  },

  mounted() {
    // console.log('svg-map mounted', this.id);

    this.createMap()
  },

  watch: {
    countries (val) {
      // console.log('svg-map watch countries', val);
      // console.log('iht', this.$refs.svgMap);
      this.$refs.svgMap.innerHTML = '';

      this.$nextTick(() => {
        this.createMap()
      });
    }
  }

}
</script>
