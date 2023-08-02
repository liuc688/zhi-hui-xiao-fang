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
        style="background: none"
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
import Home from "./components/home.vue";
import InfoDetails from "./components/infodetails.vue";
import PeopleFor from "./components/peoplefor.vue";
import Information from "./components/information.vue";



export default {
  name: "user",
  components: {
    SystemViews,
    Home,
    InfoDetails,
    PeopleFor,
    Information
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
          group: "资源管理",
          records: [
            {
              parent: "home",
              title: "资源库",
              meta: {
                invisible: !this.$auth(`forms.user.paginate`),
              },
            },
            {
              parent: "people-for", 
              title: "人工服务",
              meta: {
                invisible: !this.$auth(`forms.system.paginate`),
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
        // this.params = this.back.params;
      }
    },
  },
};
</script>

<style></style>
