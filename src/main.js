

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import '@fortawesome/fontawesome-free/css/all.min.css';

createApp(App).use(Vue3Toastify, {
  autoClose: 3000,
  position: "top-right"
}).use(router).mount('#app')
