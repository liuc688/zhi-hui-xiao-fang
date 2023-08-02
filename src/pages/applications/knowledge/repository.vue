<template>
  <div style="width: 100%; height: calc(100vh-64px)">
    <!-- <a-spin
      :spinning="spinning"
      style="height: 100%; width: 100%"
      tip="Loading..."
    >
      <div style="height: 100%">
        <component
          ref="component"
          :is="route"
          :params="params"
          @event="event"
          :key="params.id"
        ></component> -->

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
      <!-- </div>
    </a-spin> -->
  </div>
</template>
<script>
import { mapState } from "vuex";
import PageToggleTransition from "@/components/transition/PageToggleTransition";
import Home from "./components/home.vue";
import InfoDetails from "./components/infodetails.vue";
import Testpaper from "./components/testpaper.vue";
import Information from "./components/information.vue";
export default {
  props: {
    open: {
      type: Function,
    },
  },
  components: {
    Home,
    InfoDetails,
    Testpaper,
    Information,
    PageToggleTransition,
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
    onOpen(params) {
      this.$emit("open", params || {});
    },
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