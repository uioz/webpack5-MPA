import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import routes from "./router";
import App from "./index.vue";

Vue.use(VueRouter);
Vue.use(Vuex);

new Vue({
  created() {
    import("lodash/debounce");
  },
  store: new Vuex.Store({
    state: {
      count: 10,
    },
  }),
  router: new VueRouter({
    mode: "history",
    routes,
  }),
  render: (h) => h(App),
}).$mount("#app");
