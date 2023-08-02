<template>
  <div style="width: 100%; height: calc(100vh-64px);overflow:hidden" v-if="appdata.status">
    <a-spin
      :spinning="spinning"
      style="height: 100%; width: 100%"
      tip="Loading..."
    >
      <div class="box_opin">
        <TreeViews
          :header="false"
          :tree-data="organizations"
          :selectedKeys.sync="keys"
          @on-tree-select="onTreeSelect"
          :data="params"
          @on-back="onBack"
        >
          <template slot="search">
            <a-list :loading="spinning">
              <a-tree-select
                style="width: 100%"
                show-search
                allowClear
                @change="handleChanges"
                v-model="key"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="organizations"
                placeholder="请选择搜索站点"
                :replaceFields="{
                  title: 'title',
                  key: 'id',
                  value: 'id',
                }"
                :filterTreeNode="
                  (value, node) => {
                    const data = node.componentOptions.propsData.dataRef;
                    return (
                      data.title.indexOf(value) !== -1 ||
                      data.name.indexOf(value) !== -1
                    );
                  }
                "
              >
              </a-tree-select>
            </a-list>
          </template>
          <template slot="content" style="height: 100%">
            <component
              ref="component"
              :is="route"
              :params="params"
              @event="event"
              :key="key"
            ></component>
          </template>
        </TreeViews>
      </div>
    </a-spin>
  </div>
  <maintain v-else/>
</template>

<script>
import Home from "./components/home.vue";
import SurveyDetails from "./components/surveydetails.vue";
import SurveyStatistics from "./components/surveystatistics.vue";
import TreeViews from "@/layouts/ApplicationViews/TreeViews";
import { organization_tree } from "@/services/organization";
import maintain from "@/pages/applications/maintain"
import { application_get } from "@/services/application";

export default {
  props:{
    appid: {
      type: String,
    },
  },
  components: {
    Home,
    SurveyDetails,
    SurveyStatistics,
    TreeViews,
    maintain
  },
  data() {
    return {
      spinning: false,
      params: {},
      back: {
        route: null,
        params: null,
      },
      route: "",
      key: null,
      keys: [],
      organizations: [],
      organization: "",
      expandedKeys: [],
      title: "",
      currData: {},
      selectedRows: [],
      appdata:{
        status: true
      }
    };
  },
  created(){
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
    init() {
      organization_tree() //站点列表
        .then((response) => {
          // console.log("我是站点列表", response.data.data);
          this.organizations = response.data.data;
          this.key =  this.organizations[0].id;
          this.keys = [this.organizations[0].id];
          this.$nextTick(() => {
            this.expandedKeys = this.organizations.map((item) => {
              return item.id;
            });
          });
          this.params={
            id: this.key
          }
          this.route = "home"
          this.spinning = false;
          // this.loading = false;
        })
        .catch((err) => {
          this.$message.error(err.response.data.message)
          console.log(err);
        });
    },
    handleChanges(value, key, e) {
      this.currData = e.triggerNode.$options.propsData.dataRef;
      this.key = this.currData.id;
      this.keys = [this.key];
      this.params.id = this.currData.id;
    },
    onTreeSelect(record, e) {
      if (e.selected) {
        this.currData = e.node.$options.propsData.dataRef;
        this.key = this.currData.id;
        this.keys = [this.key];
        this.params.id = this.currData.id;
      } else {
        this.currData = {};
        this.key = "";
        this.keys = [];
        this.params.id = undefined;
      }
      this.route = "home"  // 点击选择页面左侧的列表框，页面总是回到首页
    },
    onBack() {
      console.log("onBack");
    },
    onRefresh() {
      this.init();
    },
    onClear() {},
    onSelectChange() {},
    deleteRecord() {},
  },
};
</script>

<style scoped>
  
</style>>
  
