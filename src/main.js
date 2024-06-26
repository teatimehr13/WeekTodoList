import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
library.add(fas,far)

const app = createApp(App)

// app.use(createPinia())
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.component("font-awesome-icon", FontAwesomeIcon).use(pinia).mount('#app')
