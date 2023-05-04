<script setup>
import { ref } from 'vue'
import { mapGetters } from '../store/map-state';
const { dark } = mapGetters();

defineProps({
  header: String,
  title: String,
  body: String,
  footer: String,
  loading: Boolean,
})

</script>

<template>
  <div class="card min-357" :class="{ 'x-bg-dark': dark }">
    <div class="card-header" v-if="header">
      <slot name="header">
        {{ header }}
      </slot>
    </div>
    <div class="card-body">
      <h5 class="card-title" v-if="title">{{ title }}</h5>
      <div v-if="loading" class="spinner-border spinme" role="status"></div>
      <slot>
        {{ body }}
      </slot>
    </div>
    <div class="card-footer" v-if="footer">
      <slot name="footer">
        {{ footer }}
      </slot>
    </div>
  </div>
</template>

<style scoped>
.card-title {
  position: relative;
  max-width: 100px;
  /*top: -6px;*/
}
</style>