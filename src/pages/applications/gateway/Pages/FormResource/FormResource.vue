<template>
  <div>
    <a-menu v-model="current" mode="horizontal" @click="onMenuItem" style="margin-bottom: 20px;">
      <a-menu-item :key="item.route" v-for="item in routers">
        <a-icon type="unordered-list" /> {{ item.title }}
      </a-menu-item>
    </a-menu>
    <page-toggle-transition
      :disabled="animate.disabled"
      :animate="animate.name"
      :direction="animate.direction"
    >
      <component
        ref="component"
        style="background: none"
        :is="route"
        :params="params"
        @event="event"
      ></component>
    </page-toggle-transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import PageToggleTransition from "@/components/transition/PageToggleTransition";

import FormsDetails from "./components/FormsDetails.vue";
import FormsSystemDetails from "./components/FormsSystemDetails.vue";
import FormsList from "./components/FormsList.vue";
import FormsSystemList from "./components/FormsSystemList.vue";
import FormsWorkflow from "./components/FormsWorkflow.vue";
import WorkflowDetails from "./components/WorkflowDetails.vue";

export default {
  components: {
    PageToggleTransition,
    FormsDetails,
    FormsList,
    FormsSystemList,
    FormsSystemDetails,
    FormsWorkflow,
    WorkflowDetails,
  },
  props: {
    id: {
      type: String,
    },
    data: {
      //传递的数据
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    ...mapState("setting", ["animate"]),
  },
  data() {
    return {
      current: ["forms-list"],
      routers: [
        {
          route: "forms-list",
          title: "用户表单列表",
          meta: {
            invisible: !this.$auth(`forms.user.paginate`),
          },
        },
        {
          route: "forms-system-list",
          title: "系统表单列表",
          meta: {
            invisible: !this.$auth(`forms.system.paginate`),
          },
        },
        {
          route: "forms-workflow",
          title: "流程表单列表",
          meta: {
            invisible: !this.$auth(`forms.system.paginate`),
          },
        },
      ],
      show: false,
      loading: false,
      route: null,
      params: {},
      back: {
        route: null,
        params: null,
      },
    };
  },
  created() {
    this.init();
  },
  authorize: {},
  methods: {
    init() {
      this.route = "forms-list";
    },
    onLink({ route, params }) {
      if (params.pagination) {
        this.back.route = this.route;
        this.back.params = this.params;
      } else {
        this.back.route = null;
        this.back.params = null;
      }
      //跳转
      this.route = route;
      this.params = params;
    },
    onRefresh() {
      if (
        this.$refs.component &&
        typeof this.$refs.component.onReset === "function"
      ) {
        this.$refs.component.onReset();
      }
    },
    event({ method, params }) {
      if (this[method] && typeof this[method] === "function") {
        this[method](params);
      }
    },
    onMenuItem(e) {
      this.onLink({
        route: e.key,
        params: {},
      });
    },

    onBack() {
      if (this.back.route) {
        this.route = this.back.route;
        // this.params = this.back.params;
      }
    },
  },
};
</script>

<style></style>
