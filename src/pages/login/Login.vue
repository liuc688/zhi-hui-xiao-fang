<template>
  <div style="width: 100%; height: calc(100vh-64px)">
    <a-spin
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
          :key="key"
        ></component>
      </div>
    </a-spin>
  </div>
</template>
<script>
import Default from "./components/Default.vue";
import SSO from "./components/SSO.vue";
import { getQuery } from "@/utils/util";
export default {
  components: {
    Default,
    SSO,
  },
  data() {
    return {
      spinning: false,
      params: {},
      back: {
        route: null,
        params: null,
      },
      route: "Default",
    };
  },
  computed: {
    query() {
      return getQuery();
    },
    key() {
      return Math.random();
    },
  },
  created() {
    if (this.query && this.query.state) {
      this.route = "SSO";
    }
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