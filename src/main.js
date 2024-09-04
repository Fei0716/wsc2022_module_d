import { createApp } from 'vue'
//import css and js from bootstrap
import './assets/bootstrap/css/bootstrap.min.css'
import './assets/bootstrap/js/bootstrap.min.js'
import './style.css'
import App from './App.vue'

import {createPinia} from "pinia";
import router from './router.js';

createApp(App).use(createPinia()).use(router).mount('#app');
