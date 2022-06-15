<script setup>
const year = new Date().getFullYear();
const copyright_link = import.meta.env.VITE_COPYRIGHT_LINK;
</script>

<template>
  <p class="text-center mt-3">
    Copyright &copy; 2021-<span class="year">{{ year }}</span>&nbsp;<a v-if="copyright_link" :href="copyright_link" target="_blank">James Futhey</a><strong v-else>James Futhey</strong>.
    &nbsp;All Rights Reserved.
  </p>
</template>
