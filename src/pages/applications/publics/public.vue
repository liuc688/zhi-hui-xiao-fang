<template>
  <system-views :memus="routers" @on-menu-item="onMenuItem" v-if="appdata.status">
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
      <a-popover
        class="header-item"
        placement="bottom"
        trigger="click"
        v-if="quanxian"
      >
        <a-button icon="setting" type="link" style="color: #ffffff"
          >配置</a-button
        >
        <template slot="title">应用配置</template>
        <template slot="content">
          <a-card style="width: 500px">
            <a-form-model
              :model="form"
              ref="form"
              :rules="rules"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
            >
              <a-form-model-item label="逾期之前天预警" prop="day">
                <a-input-number
                  :min="0"
                  style="width: 100%"
                  :step="1"
                  placeholder="请输入逾期之前预警天数"
                  v-model="form.day"
                />
              </a-form-model-item>
              <a-form-model-item label="天/条短信" prop="frequency">
                <a-input-number
                  :min="0"
                  style="width: 100%"
                  :step="1"
                  placeholder="请输入每天发短信条数"
                  v-model="form.frequency"
                />
              </a-form-model-item>
              <a-form-model-item :wrapper-col="{ span: 14, offset: 8 }">
                <a-button type="primary" @click="onSubmit">保存</a-button>
              </a-form-model-item>
            </a-form-model>
          </a-card>
        </template>
      </a-popover>
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
  <maintain v-else/>
</template>

<script>
import SystemViews from "@/layouts/ApplicationViews/SystemViews";
import { mapState } from "vuex";
import Home from "./components/home.vue";
import Statistics from "./components/statistics.vue";
import Visualized from "./components/visualized.vue";
import ApplyDetails from "./components/applydetails.vue";
import { application_config } from "@/services/public";
import { application_list } from "@/services/application";
import maintain from "@/pages/applications/maintain";
import { application_get } from "@/services/application";
export default {
  name: "user",
  components: {
    SystemViews,
    Home,
    Statistics,
    Visualized,
    ApplyDetails,
    maintain,
  },
  computed: {
    ...mapState("setting", ["animate"]),
  },
  props: {
    id: {
      type: String,
    },
    type: {
      type: String,
    },
    name: {
      type: String,
    },
    router: {
      type: String,
    },
    data: {
      //传递的数据
      type: Object,
    },
    appid: {
      type: String,
    },
  },
  data() {
    return {
      routers: [
        {
          group: "依申请公开",
          records: [
            {
              parent: "home",
              title: "依申请公开",
              meta: {
                invisible: !this.$auth(`public.paginate`),
              },
            },
            {
              parent: "statistics",
              title: "标签统计",
              meta: {
                invisible: !this.$auth(`public.statistics`),
              },
            },
            {
              parent: "visualized",
              title: "可视化统计",
              meta: {
                invisible: !this.$auth(`organization.statistics`),
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
      rules: {
        day: [
          { required: true, message: "请输入逾期之前天预警", trigger: "blur" },
        ],
        frequency: [
          { required: true, message: "请输入天/条短信", trigger: "blur" },
        ],
      },
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
      form: {
        day: "",
        frequency: "",
      },
      quanxian: undefined,
      applist: [],
      appids: undefined,
      appdata:{
        status: true
      }
    };
  },
  computed: {
    userinfo() {
      return this.$store.getters["account/user"];
    },
  },
  created() {
    application_get({ id: this.appid })
      .then((res) => {
        this.appdata = res.data.data;
        if (this.appdata.status) {
          if (
            this.userinfo.role == "admin" ||
            this.userinfo.role.indexOf("admin") > -1
          ) {
            this.quanxian = true;
          } else {
            this.quanxian = false;
          }
          this.init();
        }
      })
      .catch((err) => {
        console.log(err);
        this.$message.error(response.data.message);
      });
  },
  authorize: {},
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          application_config(
            Object.assign(this.form, {
              id: this.appids,
            })
          )
            .then((res) => {
              this.$message.success(res.data.message);
              this.init();
            })
            .catch((error) => {
              console.log("error", error);
            });
        } else {
        }
      });
    },
    init() {
      application_list()
        .then((res) => {
          this.applist = res.data.data;
          var last = this.applist.filter((item) => {
            return item.name == this.name;
          });
          if (last.length) {
            this.appids = last[0].id;
            this.$nextTick(() => {
              this.$refs.form.setData(last[0]._extension);
            });
          } else {
            this.appids = undefined;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      if (this.data.ids) {
        this.onLink({
          route: "apply-details",
          params: {
            data: {
              id: this.data.ids,
            },
          },
        });
      } else {
        this.route = "home";
      }
    },
    onLink({ route, params }) {
      if (params.searchform) {
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

<style scoped>
a {
  color: #1890ff !important;
}
</style>
