<template>
  <a-card>
    <a-tabs :default-active-key="home" @change="onChangePage">
      <a-tab-pane key="project-list" tab="项目管理"> </a-tab-pane>
      <a-tab-pane key="customert-list" tab="客户管理"> </a-tab-pane>
      <a-tab-pane key="account-list" tab="账款管理"> </a-tab-pane>
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
import ContractDetail from "./components/ContractDetail.vue";
import ContractList from "./components/ContractList.vue";
import CustomertList from "./components/CustomertList.vue";
import AccountList from "./components/AccountList.vue";
import AccountPlanList from "./components/AccountPlanList.vue";
import ProjectDetail from "./components/ProjectDetail.vue";
import ProjectList from "./components/ProjectList.vue";

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
    ProjectDetail,
    ProjectList,
    ContractDetail,
    ContractList,
    CustomertList,
    AccountList,
    AccountPlanList,
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
      home: "project-list",
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
        this.home = "account-plan-list";
        this.crumbs = [{
          route: 'project-list',
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
