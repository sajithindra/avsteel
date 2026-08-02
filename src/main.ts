import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@google/model-viewer'

import './assets/main.css'
import './firebase'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
