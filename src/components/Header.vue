<script setup>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex'
const store = useStore();

const is_dark = ref(false);
const siteName = import.meta.env.VITE_APP_NAME;

onMounted(() => {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) is_dark.value = true;
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
  is_dark.value = event.matches;
});

watch(is_dark, () => {
  store.commit('setDark', is_dark.value);
  document.querySelector('#theme').href = `https://cdnjs.cloudflare.com/ajax/libs/bootswatch/5.1.3/${ is_dark.value ? import.meta.env.VITE_BOOTSWATCH_THEME_DARK : import.meta.env.VITE_BOOTSWATCH_THEME_LIGHT }/bootstrap.min.css`;

  if (is_dark.value) document.body.classList.add('dark');
  else document.body.classList.remove('dark');
});
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark" :class="{ 'mt-1': is_dark, 'bg-primary': !is_dark }">
    <div class="container">
      <a class="navbar-brand" href="/">{{ siteName }}</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarColor01">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <a class="nav-link cp" :class="{ 'btn-dark': is_dark, 'nudge': is_dark }" data-bs-toggle="modal" data-bs-target="#embedScript">Add to your Website</a>
          </li>
        </ul>
      </div>

      <div class="d-none d-md-inline-block form-check form-switch float-right">
        <input class="form-check-input" type="checkbox" id="themer" v-model="is_dark">
        <label class="form-check-label" for="themer" style="user-select: none" :class="{ 'text-white': !is_dark }">Dark mode</label>
      </div>
    </div>
  </nav>
</template>