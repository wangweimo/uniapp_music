import Vue from 'vue';
import App from './App';

Vue.config.productionTip = false;

App.mpType = 'app';

Vue.filter('formatCount', (value) => {
  if (value >= 10000 && value <= 100000000) {
    value /= 1000;
    return value.toFixed(1) + '万';
  } else if (value > 100000000) {
    value /= 100000000;
    return value.toFixed(1) + '亿';
  } else {
    return value;
  }
});
const app = new Vue({
  ...App
});
app.$mount();
