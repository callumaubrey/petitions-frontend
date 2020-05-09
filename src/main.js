import Vue from 'vue';
import App from './App.vue';

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(VueAxios, axios);

import VueCookies from 'vue-cookies'
Vue.use(VueCookies);

import { BootstrapVue, IconsPlugin, NavbarPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
Vue.use(BootstrapVue);

import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)
Vue.use(NavbarPlugin);

import SocialSharing from 'vue-social-sharing';
Vue.use(SocialSharing);

import routes from './routes';

const router = new VueRouter({
    routes: routes,
    mode: 'history'
});

import Helpers from './helpers';
Vue.use(Helpers);

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
