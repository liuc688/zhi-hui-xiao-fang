<template>
  <div style="width: 100%" v-if="appdata.status">
    <a-spin
      :spinning="spinning"
      style="height: 100%; width: 100%"
      tip="Loading..."
    >
      <a-layout style="width: 100%; height: 100%">
        <!-- 左侧列表 -->
        <a-layout-sider class="layout_sid">
          <div style="height: 50px; width: 100%">
            <a-tree-select
              style="width: 100%"
              show-search
              @change="handleChanges"
              v-model="channelselectedKeys"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="organizations"
              placeholder="请选择搜索站点"
              :replaceFields="{
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
          </div>
          <div class="div_sloder">
            <a-tree
              :tree-data="organizations"
              :draggable="true"
              :default-expand-all="true"
              auto-expand-parent
              :expandedKeys.sync="channelexpandedKeys"
              :selectedKeys.sync="channelselectedKeys"
              :block-node="true"
              :replaceFields="{
                title: 'title',
                key: 'id',
                value: 'id',
              }"
              ref="channelTree"
              @select="onTreeSelect"
              @expand="onExpand"
            >
            </a-tree>
          </div>
        </a-layout-sider>
        <a-layout-content style="background: #fff">
          <!-- <div style="padding: 20px; clear: both">
            <a-space>
              <a-input
                v-auth="`organization.edit`"
                style="width: 260px"
                v-model="title"
              />
              <span
                >唯一标识(name) : {{ currData.name ? currData.name : "" }}</span
              >
              <a v-auth="`organization.add`"
                ><a-icon
                  type="plus-square"
                  @click="onAdd"
                  theme="twoTone"
                  style="font-size: 26px"
              /></a>
            </a-space>
            <a-button
              icon="save"
              type="link"
              style="float: right"
              v-if="title"
              v-auth="`organization.edit`"
              @click="onEdit"
              >保存</a-button
            >
          </div> -->
          <component
            ref="component"
            :is="route"
            :params="params"
            @event="event"
            :key="Math.random(10000)"
          ></component>
        </a-layout-content>
      </a-layout>
    </a-spin>
    <!-- <a-modal
      title="添加组织"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      :maskClosable="false"
    
      @cancel="
        () => {
          (visible = false), this.$refs.formsadd.reset();
        }
      "
    >
      <k-form-build
        :value="jsonData"
        ref="formsadd"
        :dynamicData="dynamicData"
      />
    </a-modal> -->
  </div>
  <maintain v-else/>
</template>

<script>
import TreeViews from "@/layouts/ApplicationViews/TreeViews";
import {
  organization_tree,
  organization_add,
  organization_edit,
  organization_list,
  organization_get,
} from "@/services/organization";
import { form_get } from "@/services/forms";
import { policy_list } from "@/services/policy";
import OrganizationDetails from "./components/OrganizationDetails.vue";
import maintain from "@/pages/applications/maintain"
import { application_get } from "@/services/application";
export default {
  props: {
    selectedKeys: {
      type: Array,
      default: () => {
        return [];
      },
    },
    appid:{
      type:String
    }
  },
  data() {
    return {
      spinning: false,
      channelexpandedKeys: [],
      channelselectedKeys: [],
      loading: false,
      organizations: [],
      route: null,
      params: {},
      keys: this.selectedKeys,
      back: {
        route: null,
        params: null,
      },
      currData: {},
      title: "",
      visible: false,
      confirmLoading: false,
      jsonData: {},
      orglist: [],
      orginId: "",
      selects: [],
      jsonDatas: {},
      // policylist: [],
      sites: {},
      appdata:{
        status: true
      }
    };
  },
  components: {
    TreeViews,
    OrganizationDetails,
    maintain
  },
  watch: {
    selectedKeys(val) {
      this.keys = val; // 新增isVisible的watch，监听变更并同步到IsShowPage上
    },
    channelselectedKeys(val) {
      if (val.length) {
        this.getsites(val);
      }
    },
  },
  created() {
    application_get({ id: this.appid }).then((res) => {
      this.appdata = res.data.data;
      if(this.appdata.status){
        this.inits();
      }
    }).catch(err=>{
      console.log(err)
      this.$message.error(response.data.message)
    })
  },
  authorize: {
    onAdd: "organization.add",
    onEdit: "organization.edit",
  },
  computed: {
    expandedKeys: {
      get() {
        return expandedKeys;
      },
      set(val) {
        this.expandedKeys = val;
      },
    },
    dynamicData() {
      let result = {
        orglist: [],
      };
      for (let item in this.orglist) {
        result.orglist.push({
          value: this.orglist[item].id,
          label: this.orglist[item].title,
        });
      }
      return result;
    },
  },
  methods: {
    inits() {
      Promise.all([
        organization_tree(),
        organization_list(),
        form_get({
          name: "organization_add",
        }),
        form_get({ name: "user_add" }),
        // policy_list(),
      ])
        .then((response) => {
          this.organizations = response[0].data.data;
          this.orglist = response[1].data.data;
          this.jsonData = response[2].data.data.form;
          this.jsonDatas = response[3].data.data.form;
          // policy_list({organization: this.organizations[0].id}).then(response=>{
          //     this.policylist = response.data.data;
          // }).catch(err=>{
          //   console.log(err)
          // })
          
          this.spinning = false;
          this.$nextTick(() => {
            if (this.organizations.length) {
              this.currData = this.organizations[0];
              this.channelselectedKeys = [this.currData.id];
            }
            this.onLink({
              route: "organization-details",
              params: Object.assign(
                this.currData,
                {
                  jsonData: this.jsonData,
                  jsonDatas: this.jsonDatas,
                  organizations: this.organizations,
                  orglist: this.orglist,
                }
              ),
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取站点
    getsites(data) {
      organization_get({ id: data[0] })
        .then((res) => {
          this.sites = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onBack() {
      if (this.back.route) {
        this.route = this.back.route;
        this.params = this.back.params;
      }
    },
    onRefresh() {
      if (
        this.$refs.component &&
        typeof this.$refs.component.onReset === "function"
      ) {
        this.$refs.component.onReset();
      }
    },
    handleChanges(selectedKeys, value, e) {
      this.currData = e.triggerNode.$options.propsData.dataRef;
      this.title = this.currData.title;
      this.channelselectedKeys = [selectedKeys] || [];
      this.channelexpandedKeys = [selectedKeys] || [];
      this.onLink({
        route: "organization-details",
        params: Object.assign(
          {},
          {
            id: selectedKeys,
            jsonData: this.jsonData,
            jsonDatas: this.jsonDatas,
            // policylist: this.policylist,
            organizations: this.organizations,
            orglist: this.orglist,
          }
        ),
      });
    },
    // 树状选择
    onTreeSelect(key, e) {
      if (e.selected) {
        this.currData = e.node.$options.propsData.dataRef;
        this.title = this.currData.title;
        this.channelselectedKeys = key;
        this.channelexpandedKeys = key;
        this.onLink({
          route: "organization-details",
          params: Object.assign(
            this.currData,
            {},
            {
              jsonData: this.jsonData,
              jsonDatas: this.jsonDatas,
              // policylist: this.policylist,
              organizations: this.organizations,
              orglist: this.orglist,
            }
          ),
        });
      } else {
        this.currData = {};
        this.title = "";
        this.key = "";
        this.channelselectedKeys = [];
        this.channelexpandedKeys = [];
        this.onLink({
          route: "organization-details",
          params: Object.assign(
            {},
            {
              jsonData: this.jsonData,
              jsonDatas: this.jsonDatas,
              // policylist: this.policylist,
              organizations: this.organizations,
              orglist: this.orglist,
            }
          ),
        });
      }
    },
    onExpand(expandedKeys, info) {
      if (info.expanded) {
        this.channelexpandedKeys = [];
      } else {
        this.channelexpandedKeys = [expandedKeys];
      }
    },
    //
    onLink({ route, params }) {
      this.back.route = this.route;
      this.back.params = this.params;
      //跳转
      this.route = route;
      this.params = params;
    },
    onDragEnter(info) {
    },
    onSelect(selectedKeys, info) {
    },
    onCheck(checkedKeys, info) {
    },
    onDrop(info) {
    },
    event({ method, params }) {
      if (this[method] && typeof this[method] === "function") {
        this[method](params);
      }
    },
    onAdd() {
      this.visible = true;
    },
    onEdit() {
      this.spinning = true;
      delete this.sites["_modifytime"];
      delete this.sites["_createtime"];
      organization_edit(Object.assign({}, this.sites, { title: this.title }))
        .then(() => {
          this.inits();
          this.$message.success("保存成功");
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    handleOk() {
      this.$refs.formsadd
        .getData()
        .then((res) => {
          var methods = this.orginId ? organization_edit : organization_add;
          methods(Object.assign(res, { id: this.orginId }))
            .then(() => {
              this.visible = false;
              this.spinning = true;
              this.$refs.formsadd.reset();
              this.inits();
            })
            .catch((err) => {
              console.log("err", err);
            });
        })
        .catch((error) => {
          console.log(error);
          for (var i in error) {
            this.$message.warning(error[i].errors[0].message);
          }
        });
    },
  },
};
</script>
<style scoped>
.layout_sid {
  height: 100%;
  /* overflow: auto; */
  flex: none !important;
  background: #f5f5f5;
  max-width: 300px !important;
  min-width: 300px !important;
}
.div_sloder {
  height: 92%;
  overflow-y: auto;
}
</style>
