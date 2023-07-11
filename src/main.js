import { createApp } from 'vue';
import './assets/fonts/fonts.css';
import App from './App.vue';
import naive from 'naive-ui';
import router from './router/index.js';
import { createPinia } from 'pinia';
import print from 'vue3-print-nb';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import JsonExcel from 'vue-json-excel3';

window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: 'pusher',
  cluster: 'mt1',
  wsHost: import.meta.env.VITE_DOMAIN,
  key: import.meta.env.VITE_WEB_SOCKET_KEY,
  wsPort: 6001,
  wssPort: 6001,
  disableStats: true,
  encrypted: true,
  forceTLS: false,
  enabledTransports: ['ws', 'wss']
});

const app = createApp(App);

app.component('DownloadExcel', JsonExcel);
app.use(router).use(createPinia()).use(naive).use(print).use(JsonExcel);

app.provide('axios', app.config.globalProperties.axios);

app.mount('#app');
