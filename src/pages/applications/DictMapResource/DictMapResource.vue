<template>
  <TreeViews v-if="appdata.status"
    :header="false"
    :tree-data="dictTree"
    :selectedKeys.sync="keys"
    :expandedKeys.sync="expandedKeys"
    @on-tree-select="onTreeSelect"
    :data="params"
    @on-back="onBack"
  >
    <template slot="search">
      <a-tree-select
        style="width: 100%"
        show-search
        @change="handleChanges"
        v-model="key"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        :treeData="dictTree"
        placeholder="请选择搜索站点"
        :replaceFields="{
          key: 'id',
          value: 'id',
        }"
        :filterTreeNode="
          (value, node) => {
            const data = node.componentOptions.propsData.dataRef;
            let filter =
              data.title.indexOf(value) > -1 ||
              data.title.toLowerCase().indexOf(value) > -1;
            filter =
              filter ||
              data.name.indexOf(value) > -1 ||
              data.name.toLowerCase().indexOf(value) > -1;

            return filter;
          }
        "
      ></a-tree-select>
    </template>
    <template slot="content">
      <component
        ref="component"
        :is="route"
        :params="params"
        @event="event"
        :key="key"
      ></component>
    </template>
  </TreeViews>
  <maintain v-else />

</template>

<script>
import TreeViews from "@/layouts/ApplicationViews/TreeViews";
import { dictmap_tree } from "@/services/dictmap";

import DictMapList from "./components/DictMapList.vue";
import maintain from "@/pages/applications/maintain"
import { application_get } from "@/services/application";
export default {
  name: "dict-map",
  components: {
    TreeViews,
    DictMapList,
    maintain
  },
  props: {
    appid:{
      type: String
    }
  },
  data() {
    return {
      loading: false,
      key: null,
      keys: [],
      dictTree: [],
      dictList: [],
      expandedKeys: [],
      params: {},
      title: "",
      route: undefined,
      currData: {},
      selectedRows: [],
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
  watch: {},
  computed: {},
  methods: {
    init() {
      Promise.all([dictmap_tree()]).then((response) => {
        this.dictTree = response[0].data.data;
        this.route = "dict-map-list";
        this.$nextTick(() => {
          this.expandedKeys = this.dictTree.map((item) => {
            return item.id;
          });
        });
      });
    },
    onBack() {
      console.log("onBack");
    },
    onRefresh() {
      this.init();
    },
    event({ method, params }) {
      if (this[method] && typeof this[method] === "function") {
        this[method](params);
      }
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
    },
    onClear() {},
    onSelectChange() {},
    deleteRecord() {},
  },
};
</script>

<style></style>
