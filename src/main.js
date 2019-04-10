import Vue from 'vue'
import App from './App.vue'
import router from './router'
import qs from 'qs'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import NormailizeCss from 'normalize.css'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
import store from './store'
import axios from  'axios'

Vue.prototype.$ajax = axios;
Vue.prototype.$qs = qs;
// axios.defaults.baseURL = 'https://api.example.com';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.component('icon', Icon);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
