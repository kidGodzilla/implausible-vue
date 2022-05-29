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
    dark: {
      type: Boolean
    }
  },

  methods: {
    createMap() {
      new svgMap({
        targetElementID: this.id,
        colorMax: this.dark ? '#4c9be8' : '#3459E6',
        colorMin: '#c7d2fc',
        colorNoData: this.dark ? 'rgb(78, 93, 108)' : '#E2E2E2',
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

  computed: {
    bundle() {
      let { countries, dark } = this;
      return { countries, dark };
    }
  },

  mounted() {
    this.createMap()
  },

  watch: {
    bundle(val) {
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
