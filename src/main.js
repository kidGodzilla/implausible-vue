import { createApp } from 'vue'
import store from './store'
import App from './App.vue'

import '../node_modules/bootswatch/dist/zephyr/bootstrap.css'

const app = createApp(App).use(store).mount('#app')
