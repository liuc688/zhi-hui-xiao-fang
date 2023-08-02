<template>
  <a-card>
    <a-tabs :default-active-key="home" @change="onChangePage">
      <a-tab-pane key="human-list" tab="人员列表"> </a-tab-pane>
    </a-tabs>
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
        :crumbs="crumbs"
      ></component>
    </page-toggle-transition>
  </a-card>
</template>

<script>
import { mapState } from "vuex";
import PageToggleTransition from "@/components/transition/PageToggleTransition";
import HumanEdit from "./components/HumanEdit.vue";
import HumanList from "./components/HumanList.vue";
import TableForm from "./components/TableForm.vue";

export default {
  props: {
    open: {
      type: Function,
    },
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: {
    TableForm,
    HumanEdit,
    HumanList,
    PageToggleTransition,
  },
  data() {
    return {
      loading: false,
      route: null,
      params: {},
      back: {
        route: null,
        params: null,
      },
      currData: {},
      crumbs: [],
      home: "human-list",
    };
  },
  computed: {
    ...mapState("setting", ["theme", "animate"]),
    key() {
      return Math.random();
    },
  },
  authorize: {},
  created() {
    this.onLoad();
  },
  methods: {
    onLoad() {
      if (this.data.project) {
        this.home = "human-list";
        this.crumbs = [{
          route: 'human-list',
          params: {},
          crumbs: [],
        }]
        this.onLink({
          route: this.home,
          params: {
            id: this.data.project,
          },
          crumbs: this.crumbs,
        });
      } else {
        this.onLink({
          route: this.home,
          params: this.params,
          crumbs: this.crumbs,
        });
      }
    },
    onChangePage(key) {
      this.onLink({
        route: key,
        params: this.params,
        crumbs: this.crumbs,
      });
    },
    onBack() {
      if (this.back.route) {
        this.route = this.back.route;
        this.params = this.back.params;
      }
    },
    onOpen(params) {
      this.$emit("open", params || {});
    },
    onRefresh() {
      if (
        this.$refs.component &&
        typeof this.$refs.component.onReset === "function"
      ) {
        this.$refs.component.onReset();
      }
    },
    onLink({ route, params, crumbs }) {
      this.back.route = this.route;
      this.back.params = this.params;
      this.back.crumbs = this.crumbs;
      //跳转
      this.params = params;
      this.route = route;
      this.crumbs = crumbs;
    },

    event({ method, params }) {
      if (this[method] && typeof this[method] === "function") {
        this[method](params);
      }
    },
  },
};
</script>
