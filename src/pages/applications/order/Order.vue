<template>
  <system-views :memus="routers" @on-menu-item="onMenuItem">
    <template slot="header">
      <a-button-group slot="enterButton"
        ><a-button
          icon="arrow-left"
          type="link"
          style="color: #ffffff"
          @click="onBack"
          :loading="loading"
          >后退</a-button
        ></a-button-group
      >
      <a-button-group slot="enterButton"
        ><a-button
          icon="reload"
          type="link"
          style="color: #ffffff"
          @click="onRefresh"
          :loading="loading"
          >刷新</a-button
        ></a-button-group
      >
    </template>
    <template slot="content">
      <component
        ref="component"
        :is="route"
        :params="params"
        @event="event"
      ></component>
    </template>
  </system-views>
</template>

<script>
import SystemViews from "@/layouts/ApplicationViews/SystemViews";
import { mapState } from "vuex";
import Label from "./components/label.vue";
import Department from "./components/department.vue";
import Home from "./components/home.vue";
import orderdetails from './components/orderdetails.vue';

export default {
  name: "user",
  components: {
    SystemViews,
    Label,
    Department,
    Home,
    orderdetails,
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
      routers: [
        {
          group: "工单管理",
          records: [
            {
              parent: "Home",
              title: "首页",
              meta: {
                invisible: !this.$auth(`order.paginate`),
              },
            },
            {
              parent: "Label",
              title: "标签管理",
              meta: {
                invisible: !this.$auth(`label.list`),
              },
            },
          ],
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
      this.route = "home";
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
    onMenuItem(record) {
      this.onLink({
        route: record.parent,
        params: record,
      });
    },
    onBack() {
      if (this.back.route) {
        this.route = this.back.route;
      }
    },
  },
};
</script>

<style>
.vl-notify-iframe{
  color: #000000a6  !important;
}
</style>
