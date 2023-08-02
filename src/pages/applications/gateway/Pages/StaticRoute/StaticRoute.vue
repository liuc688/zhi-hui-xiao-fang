<template>
  <a-card :bordered="false">
    <!-- <a-form-model
      ref="searchForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :model="searchForm"
    >
      <a-row>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-model-item label="关键字">
            <a-input
              style="width: 100%"
              placeholder="请输入"
              allowClear
              v-model="searchForm.keyword"
            />
          </a-form-model-item>
        </a-col>
        <template v-if="advanced"> </template>
        <a-col :lg="8" :md="12" :sm="24">
          <div style="padding-left: 50px; margin-top: 3px">
            <a-button type="primary" @click="onSearch" html-type="submit"
              >查询</a-button
            >
            <a-button style="margin-left: 8px" @click="onReset">重置</a-button>
          </div>
        </a-col>
      </a-row>
    </a-form-model> -->
    <div style="width: 100%; padding: 5px 0px">
      <a-space>
        <a-dropdown-button @click="onAdd()" v-auth="`user.add`">
          添加
        </a-dropdown-button>
        <a-dropdown-button
          :disabled="params.id ? false : true"
          @click="onEdit()"
          v-auth="`user.add`"
        >
          编辑
        </a-dropdown-button>
        <a-dropdown-button
          :disabled="params.id ? false : true"
          @click="copyjiekou()"
          v-auth="`user.add`"
        >
          复制接口
        </a-dropdown-button>
        <a-button-group>
          <a-button :disabled="params.id ? false : true" @click="onDelete"
            >删除</a-button
          >
        </a-button-group>
        <a-button-group>
          <a-button icon="redo" @click="refresh" :loading="loading"
            >刷新</a-button
          >
        </a-button-group>
        <a-button-group>
          <a-button icon="sync" @click="onSync" :loading="loading"
            >同步</a-button
          >
        </a-button-group>
      </a-space>
    </div>
    <a-layout>
      <a-layout-sider
        style="background-color: #000; overflow-y: auto; max-height: 600px"
      >
        <a-menu
          mode="inline"
          :open-keys.sync="openKeys"
          :selected-keys="selectedKeys"
        >
          <a-sub-menu v-for="item in groups" :key="item.group">
            <span slot="title">{{ item.group }}</span>
            <a-menu-item
              :key="temp.record"
              v-for="temp in item.record"
              @click="onMenuItem(temp)"
            >
              {{ temp.title || "未分组" }}
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout-content
        style="background-color: #fff; overflow-y: auto; max-height: 600px"
      >
        <page-toggle-transition
          :disabled="animate.disabled"
          :animate="animate.name"
          :direction="animate.direction"
        >
          <component
            ref="component"
            style="width: 100%"
            :is="route"
            :params="params"
            @event="event"
            :key="componentKey"
          ></component>
        </page-toggle-transition>
      </a-layout-content>
    </a-layout>
  </a-card>
</template>

<script>
import { mapState } from "vuex";
import PageToggleTransition from "@/components/transition/PageToggleTransition";
import Editor from "./components/Editor";
import Detail from "./components/Detail";
import {
  routeinfo_group,
  routeinfo_get,
  route_sync,
  route_delete,
} from "@/services/routes";

export default {
  name: "router",
  components: {
    Detail,
    Editor,
    PageToggleTransition,
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
    onRefresh: {
      type: Function,
      default: () => {
        console.log("onRefresh");
      },
    },
  },
  computed: {
    ...mapState("setting", ["animate"]),
  },
  data() {
    return {
      groups: [],
      route: null,
      loading: false,
      jsonData: {},
      dynamicData: {},
      currData: {},
      params: {},
      labelCol: { span: 5 },
      wrapperCol: { span: 18, offset: 1 },
      searchForm: {},
      advanced: false,
      openKeys: [],
      selectedKeys: [],
      componentKey: null,
    };
  },
  created() {
    this.onLoad();
  },
  authorize: {
    onSync: "route.sync",
    OnAddRoute: "route.edit",
  },
  methods: {
    onLoad() {
      Promise.all([routeinfo_group()])
        .then((response) => {
          this.groups = response[0].data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    refresh() {
      this.onLoad();
      if (this.selectedKeys.length) {
        this.onMenuItem({ record: this.selectedKeys[0] });
      }
    },
    onEdited(record) {
      this.onLoad();
      this.onMenuItem({ record: record });
    },
    onMenuItem(e) {
      this.selectedKeys = [e.record];
      routeinfo_get({
        id: e.record,
      })
        .then((response) => {
          console.log('response',response)
          var params = response.data.data;
          this.$nextTick(() => {
            this.currData = params;
            this.componentKey = this.currData.id;

            this.onLink({
              route: "Detail",
              params: this.currData,
            });
          });
        })
        .catch((error) => {
          this.$message.error(error.response.data.message);
        });
    },
    ondesktopmenu(event) {
      console.log("event", event);
      let record = event.target.__vue__._props.eventKey;
      this.$contextmenu({
        items: [
          {
            label: "复制接口",
            onClick: () => {
              this.copyjiekou(record);
            },
          },
        ],
        event,
        customClass: "class-a",
        zIndex: 6000,
        minWidth: 230,
      });
      return false;
    },
    copys(record){
      console.log('record', record)
      this.componentKey = this.currData.id;
      this.onLink({
        route: "Editor",
        params: {
          type: "edit",
          data: record,
          openKeys: this.openKeys,
          selectedKeys: this.selectedKeys,
        },
      });

    },
    // 复制接口
    copyjiekou() {
      this.componentKey = this.currData.id;
      this.onLink({
        route: "Editor",
        params: {
          type: "copy",
          data: this.currData,
          openKeys: this.openKeys,
          selectedKeys: this.selectedKeys,
        },
      });
    },
    onAdd() {
      this.componentKey = undefined;
      this.onLink({
        route: "Editor",
        params: {
          data: {},
          openKeys: this.openKeys,
          selectedKeys: this.selectedKeys,
        },
      });
    },
    onEdit() {
      this.componentKey = this.currData.id;
      this.onLink({
        route: "Editor",
        params: {
          type: "edit",
          data: this.currData,
          openKeys: this.openKeys,
          selectedKeys: this.selectedKeys,
        },
      });
    },
    onSearch() {},
    onReset() {},
    onDelete() {
      this.$nextTick(() => {
        this.$confirm({
          title: "删除确认",
          content: "确认要删除此路由吗!该操作不可逆,请谨慎操作!",
          okText: "确认",
          cancelText: "取消",
          onOk: () => {
            route_delete({
              ids: [this.currData.parent.id],
            })
              .then((response) => {
                this.$message.success(response.data.message);
                this.currData = {};
                this.selectedKeys = [];
                this.route = null;
                this.refresh();
              })
              .catch((error) => {
                this.$message.success(error.response.data.message);
              });
          },
          onCancel: () => {
            console.log("取消");
          },
        });
      });
    },
    // 同步
    onSync() {
      this.loading = true;
      route_sync()
        .then((response) => {
          this.$message.success(`同步${response.data.message}`);
          this.loading = false;
        })
        .catch((error) => {
          this.$message.success("同步失败");
          this.loading = false;
          console.log(error);
        });
    },
    onLink({ route, params }) {
      //跳转
      this.route = route;
      this.params = params;
    },
    event({ method, params }) {
      if (this[method] && typeof this[method] === "function") {
        this[method](params);
      }
    },
    // 表单回显
    setData() {
      let formData = {};
      for (let key in this.$refs.form.form.formItems) {
        formData[key] = this.currentRoute[key];
      }
      this.$refs.form.setData(formData);
    },
  },
};
</script>
