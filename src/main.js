import Vue from 'vue';
import App from './App.vue';

import data from './data';
import api from './api';

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');

const msg = data.message + data.text;
alert(msg);
api.action();
