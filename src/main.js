import Vue from 'vue'
import App from './App.vue'
import router from './router'
import qs from 'qs'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store'
import axios from  'axios'


import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon,FontAwesomeLayers, FontAwesomeLayersText} from '@fortawesome/vue-fontawesome'


library.add(fas, far)


Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)




Vue.config.productionTip = false
Vue.prototype.$ajax = axios;
Vue.prototype.$qs = qs;
// axios.defaults.baseURL = 'https://api.example.com';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Vue.config.productionTip = false;
Vue.use(ElementUI);

// JWT 用户权限校验，判断 TOKEN 是否在 localStorage 当中
router.beforeEach(({name}, from, next) => {
  // 获取 JWT Token
  if (localStorage.getItem('JWT_TOKEN')) {
    // 如果用户在login页面
    if (name === 'Login') {
      next('/');
    } else {
      next();
    }
  } else {
    if (name === 'Login') {
      next();
    } else {
      next({name: 'Login'});
    }
  }
});

// http request 拦截器
axios.interceptors.request.use(
    config => {
      if (localStorage.JWT_TOKEN) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
        config.headers.Authorization = `${localStorage.JWT_TOKEN}`;
      }
      return config;
    },
    err => {
      return Promise.reject(err);
    });


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
