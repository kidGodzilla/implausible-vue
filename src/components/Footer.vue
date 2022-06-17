<script setup>
const copyright_link = import.meta.env.VITE_COPYRIGHT_LINK;
import { mapGetters } from '../store/map-state';
const year = new Date().getFullYear();
import { useStore } from 'vuex';
const { embed } = mapGetters();
const store = useStore();
</script>

<template>
  <p class="text-center mt-3" v-show="!embed">
    Copyright &copy; 2021-<span class="year">{{ year }}</span>&nbsp;<a v-if="copyright_link" :href="copyright_link" target="_blank">James Futhey</a><strong v-else>James Futhey</strong>.
    &nbsp;All Rights Reserved.
  </p>
</template>
