import Vue from 'vue';
import App from './App.vue';
import '@/assets/stylus/app.styl';

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
