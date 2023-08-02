<template>
  <system-views
    :memus="routers"
    @on-menu-item="onMenuItem"
    @edit-add-route="EditAddRoute"
    @on-right-click="onRightClickMenu"
    :default-selected-keys="parents"
    :default-open-keys="selectspage"
  >

    <template slot="header">
      <a-button-group slot="enterButton"
        ><a-button
          icon="sync"
          type="link"
          style="color: #ffffff"
          @click="onSync"
          v-auth="`route.sync`"
          :loading="loading"
          >同步</a-button
        ></a-button-group
      >
      <a-button-group slot="enterButton"
        ><a-button
          icon="file"
          type="link"
          style="color: #ffffff"
          @click="OnAddRoute"
          v-auth="`route.edit`"
          :loading="loading"
          >新增</a-button
        ></a-button-group
      >
      <!-- <a-button-group slot="enterButton"><a-button icon="sync" type="link" style="color: #FFFFFF;" @click="refrsh(defultdatas)" :loading="loading">刷新</a-button></a-button-group> -->
      <!-- <a-button-group slot="enterButton"><a-input-search :loading="loading" @search="onSearch"></a-input-search></a-button-group> -->
      <a-modal
        v-model="visible"
        :title="title"
        ok-text="确认"
        cancel-text="取消"
        @ok="onOk"
        centered
        width="75%"
        :confirmLoading="okloading"
        :z-index="1002"
      >
        <k-form-build :value="jsonData" ref="form" :dynamicData="dynamicData" />
      </a-modal>
    </template>
    <template slot="content">
      <component
        ref="component"
        style="width: 100%"
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
import detailes from "./components/detailes";
import { routeinfo_group, route_edit, route_sync,route_delete } from "@/services/routes";
import { form_get } from "@/services/forms";
export default {
  name: "router",
  components: {
    SystemViews,
    detailes,
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
      routers: [],
      show: false,
      loading: false,
      route: null,
      params: {},
      // 编辑应用
      visible: false,
      title: undefined,
      okloading: false,
      jsonData: {},
      dynamicData: {
        config: {},
      },
      commit: null,
      currendId: null,
      currendParent: null,
      currentRoute: {},
      defultdatas: {},
      selectspage: [],
      parents: [],
    };
  },
  created() {
    if (JSON.stringify(this.data) !== "{}") {
      this.refrsh(this.data.data);
    } else {
      this.init();
    }
  },
  authorize: {
    onSync: "route.sync",
    OnAddRoute: "route.edit",
  },
  methods: {
    init() {
      Promise.all([routeinfo_group(), form_get({ name: "route_add" })])
        .then((res) => {
          this.routers = res[0].data.data;
          this.jsonData = res[1].data.data.form;
          this.defultdatas = this.routers[0].records[0];
          (this.selectspage[0] = this.routers[0].records[0].parent),
            (this.parents[0] = this.routers[0]._id);
          this.onMenuItem(this.defultdatas);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 刷新
    refrsh(data) {
      var that = this;
      Promise.all([routeinfo_group(), form_get({ name: "route_add" })])
        .then((res) => {
          that.routers = res[0].data.data;
          that.jsonData = res[1].data.data.form;
          (this.selectspage[0] = data.parent), (this.parents[0] = data._id);
          that.onMenuItem(data);
        })
        .catch((err) => {
          console.log(err);
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
    onMenuItem(record) {
      var that = this;
      that.defultdatas = record;
      that.onLink({
        route: "detailes",
        params: record,
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
    // 查询
    onSearch(val) {
      console.log(val);

      this.routers.forEach((item) => {
        item.records.forEach((items) => {
          if (items.title.indexOf(val) > -1) {
            return items;
          }
        });
      });
    },
    // 表单回显
    setData() {
      let formData = {};
      for (let key in this.$refs.form.form.formItems) {
        formData[key] = this.currentRoute[key];
      }
      this.$refs.form.setData(formData);
    },
    onRightClickMenu(record){
      this.$contextmenu({
        items: [
          {
            label: "编辑",
            onClick: () => {
              this.EditAddRoute(record);
            },
          },
          {
            label: "删除",
            onClick: () => {
              route_delete({
                ids:[record.id]
              }).then(response=>{
                this.init();
                this.refrsh()
                
              }).catch(error=>{
                console.log('error',error);
                
              })
            },
          }
        ],
        event,
        customClass: "class-a",
        zIndex: 1000,
        minWidth: 230,
      });
      return false;
    },
    // 编辑分组
    EditAddRoute(record) {
      this.visible = true;
      this.currendId = record.parent;
      this.currendParent = null;
      this.currentRoute = record.route;
      this.$nextTick(() => {
        this.$refs.form.reset();
        this.commit = route_edit; //方法名
        this.setData();
      });
    },
    // 新增分组
    OnAddRoute() {
      this.visible = true;
      this.currendId = null;
      this.currendParent = null;
      this.currentRoute = {};
      this.$nextTick(() => {
        this.$refs.form.reset();
        this.commit = route_edit;
      });
    },
    onOk() {
      this.$nextTick(() => {
        this.$refs.form
          .getData()
          .then((formData) => {
            this.okloading = true;
            if (this.currendId) {
              formData.id = this.currendId;
            }
            if (this.currendParent) {
              formData.parent = this.currendParent;
            }
            this.commit(formData)
              .then((response) => {
                this.refrsh(this.defultdatas);
                this.visible = false;
                this.okloading = false;
                this.$emit("onRefresh", response);
              })
              .catch((error) => {
                console.log(error);
                this.refrsh(this.defultdatas);
                this.visible = false;
                this.okloading = false;
                this.$emit("onRefresh", error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      });
    },
  },
};
</script>

<style scoped>

.icon_to_see {
	padding: 12px;
	right: 20px; 
	margin: auto; 
	position: absolute;
}
</style>
