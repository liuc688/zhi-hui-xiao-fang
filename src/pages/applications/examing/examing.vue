<template>
  <div style="width: 100%; height: calc(100vh-64px)">
        <page-toggle-transition
          :disabled="animate.disabled"
          :animate="animate.name"
          :direction="animate.direction"
        >
          <component
            ref="component"
            :is="route"
            :params="params"
            @event="event"
            :key="key"
          ></component>
        </page-toggle-transition>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Home from "./components/home.vue";
import InfoDetail from "./components/infodetail.vue";
import Modify from "./components/modify.vue";
import Shortmodify from "./components/shortmodify.vue";
import Texamranking from "./components/texamranking.vue";
import Examabout from "./components/examabout.vue";
export default {
  components: {
    Home,
    InfoDetail,
    Modify,
    Shortmodify,
    Texamranking,
    Examabout
  },
  data() {
    return {
      spinning: false,
      params: {},
      back: {
        route: null,
        params: null,
      },
      route: "home",
    };
  },
   computed: {
    ...mapState("setting", ["theme", "animate"]),
    key() {
      return Math.random();
    },
  },
  methods: {
    event({ method, params }) {
      if (this[method] && typeof this[method] === "function") {
        this[method](params);
      }
    },
    onLink({ route, params }) {
      this.back.route = this.route;
      this.back.params = this.params;
      //跳转
      this.route = route;
      this.params = params;
    },
  },
};
</script>