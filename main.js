import Vue from 'vue';
import App from './App';
import Http from './api/request';
import store from './store/index';
import actions from '@/actions/index';
import { msg } from './utils/index';
import './filter/index'

Vue.config.productionTip = false;
Vue.prototype.$Http = Http;
Vue.prototype.$Actions = actions;
Vue.prototype.$store = store;
Vue.prototype.$showMsg = msg;
App.mpType = 'app';


const app = new Vue({
  ...App
});
app.$mount();
