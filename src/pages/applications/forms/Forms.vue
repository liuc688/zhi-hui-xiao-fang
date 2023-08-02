<template>
  <system-views v-if="appdata.status">
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
  <maintain v-else />
</template>

<script>
import SystemViews from "@/layouts/ApplicationViews/SystemViews";
import { mapState } from "vuex";
import FormsDetails from "./components/FormsDetails.vue";
import FormsList from "./components/FormsList.vue";
import maintain from "@/pages/applications/maintain"
import { application_get } from "@/services/application";

export default {
  name: "user",
  components: {
    SystemViews,
    FormsDetails,
    FormsList,
    maintain
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
    appid:{
      type: String
    }
  },
  computed: {
    ...mapState("setting", ["animate"]),
  },
  data() {
    return {
      routers: [
        {
          group: "表单管理",
          records: [
            {
              parent: "forms-list",
              title: "用户表单列表",
              meta: {
                invisible: !this.$auth(`forms.user.paginate`),
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
      appdata:{
        status: true
      }
    };
  },
  created() {
    application_get({ id: this.appid }).then((res) => {
      this.appdata = res.data.data;
      if(this.appdata.status){
        this.init();
      }
    }).catch(err=>{
      console.log(err)
      this.$message.error(response.data.message)
    })
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
