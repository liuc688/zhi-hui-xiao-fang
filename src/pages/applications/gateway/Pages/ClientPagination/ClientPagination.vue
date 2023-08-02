<template>
  <div style="padding: 0 30px" >
    <a-form-model
      ref="searchForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :model="searchForm"
    >
      <a-row>
        <a-col :lg="7" :md="12" :sm="24">
          <a-form-model-item :label-col="{ span: 3 }" label="关键字">
            <a-input
              style="width: 100%"
              placeholder="请输入"
              allowClear
              v-model="searchForm.keyword"
            />
          </a-form-model-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <div style="padding-left: 50px; margin-top: 3px">
            <a-button type="primary" @click="onSearch" html-type="submit"
              >查询</a-button
            >
            <a-button style="margin-left: 8px" @click="onReset">重置</a-button>
          </div>
        </a-col>
      </a-row>
    </a-form-model>
    <div style="width: 100%; padding: 5px 0px">
      <a-space>
        <a-button @click="onAdd_client"
          ><a-icon type="plus" />客户端新增</a-button
        >
        <a-button
          :disabled="selectedRows.length ? false : true"
          @click="onDelete_client"
          ><a-icon type="delete" />客户端删除</a-button
        >
      </a-space>
    </div>

    <standard-table
      :loading="loading"
      :columns="columns"
      :dataSource="data.items"
      :selectedRows.sync="selectedRows"
      @clear="onClear"
      :rowKey="'id'"
      v-auth="`user.paginate`"
      @selectedRowChange="onSelectChange"
      :pagination="false"
      bordered
    >
      <span slot="action" slot-scope="{ record }">
        <a-button @click="onEdit_client(record)" v-auth="`client.edit`">
          <a-icon type="edit" style="vertical-align: baseline" />编辑
        </a-button>
        <a-divider type="vertical" style="height: 25px"></a-divider>
        <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item
              key="oneditorganization"
              @click="onEditOrganization(record)"
            >
              <a-icon type="setting" />
              设置组织
            </a-menu-item>
            <a-menu-item key="1" @click="onEditRoutes(record)">
              <a-icon type="bulb" />
              设置路由
            </a-menu-item>
            <a-menu-item key="2" @click="onEditAppli(record)">
              <a-icon type="appstore" />
              设置应用
            </a-menu-item>
          </a-menu>
          <a-button>设置<a-icon type="down" /> </a-button>
        </a-dropdown>
      </span>
    </standard-table>
    <a-pagination
      size="small"
      style="text-align: right; padding: 15px 0"
      :current="pagination.page"
      :defaultPageSize="pagination.per_page"
      @change="onChangePage"
      @showSizeChange="onChangePage"
      :pageSizeOptions="['10', '20', '30', '40']"
      :total="data.total"
      show-size-changer
      show-quick-jumper
      :show-total="(total) => `共 ${total} 条`"
    ></a-pagination>

    <a-modal
      title="设置组织"
      :visible="visibleEditOrg"
      :width="600"
      :confirm-loading="loading"
      :maskClosable="false"
      @ok="onEditOrg"
      @cancel="
        () => {
          this.organization = [];
          visibleEditOrg = false;
        }
      "
    >
      <a-form-model-item
        label="所在组织"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 21 }"
      >
        <a-tree-select
          class="tree_sty"
          show-search
          multiple
          v-model="organization"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="organizations"
          placeholder="请选择所在组织"
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
      </a-form-model-item>
    </a-modal>

    <a-modal
      title="设置路由"
      :visible="visibleEditRou"
      :width="1350"
      :maskClosable="false"
      @ok="onEditRou"
      @cancel="
        () => {
          this.organization = [];
          visibleEditRou = false;
        }
      "
      class="routes_root"
    >

      <div style="width: 100%;padding:0;margin:0" class="route_box">
          <a-card-meta>
            <div slot="title" style="padding:2px 1%">
              <span>设置路由</span>
              <span>
                <a-checkbox
                  @change="onRouteAllChange"
                  :indeterminate="indeterminate.route"
                  :checked="checks_route"
                  style="float: right;"
                >
                  全选
                </a-checkbox>
              </span>
            </div>
            <div slot="description">
              <a-checkbox-group :value="routees" @change="onRouteChange">
                <template v-for="temp in route_arr">
                  <a-card-grid :title="temp._id" :key="temp._id" :bordered='false' style="width:99%;margin-left:0.5%">
                    <div style="font-size:14px;font-weight:600;margin-bottom: 12px;">{{temp.group}}</div>
                    <template v-for="item in temp.record">
                      <a-checkbox
                        :value="item.parent"
                        :key="item.parent"
                        class="checkbox-item"
                      >
                        {{ item.title }}
                      </a-checkbox>
                    </template>
                  </a-card-grid>
                </template>
              </a-checkbox-group>
            </div>
          </a-card-meta>
        </div>

    </a-modal>

    <a-modal
      title="设置应用"
      :visible="visibleEditApp"
      :width="600"
      :maskClosable="false"
      @ok="onEditApp"
      @cancel="
        () => {
          this.organization = [];
          visibleEditApp = false;
        }
      "
    >
      <a-form-model-item
        label="所在应用"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 21 }"
      >
        <a-tree-select
          class="tree_sty"
          show-search
          multiple
          v-model="applications"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="appli_arr"
          placeholder="请选择应用"
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
      </a-form-model-item>
    </a-modal>

    <a-modal
      title="客户端新增"
      width="40%"
      :visible="visible_client"
      :maskClosable="false"
      @ok="onSubmit_client"
      @cancel="
        () => {
          visible_client = false;
          this.$refs.jsonData_client.reset();
        }
      "
    >
      <k-form-build :value="jsonData_client" ref="jsonData_client" />
    </a-modal>
  </div>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import {
} from "@/services/user";
import { form_get } from "@/services/forms";
import { policy_list } from "@/services/policy";
import { organization_tree } from "@/services/organization";
import {
  client_add,
  client_edit,
  client_paginate,
  client_delete,
  routeinfo_group,
  application_list,
} from "@/services/clients";
import md5 from "md5";

export default {
  components: { StandardTable },
  props: {
    params: {
      //传递的数据
      type: Object,
    },
    event: {
      type: Function,
    },
  },
  data() {
    return {
      data: {},
      columns: [
        {
          title: "客户端名称",
          width: 160,
          dataIndex: "name",
          scopedSlots: { customRender: "name" },
        },
        {
          title: "客户端标识",
          width: 300,
          dataIndex: "appid",
          scopedSlots: { customRender: "appkey" },
        },
        {
          title: "客户端密钥",
          width: 300,
          dataIndex: "secretkey",
          scopedSlots: { customRender: "secret" },
        },
        {
          title: "过期时间",
          width: 160,
          dataIndex: "expire",
          scopedSlots: { customRender: "lasttime" },
        },
        {
          title: "操作",
          width: 240,
          scopedSlots: {
            customRender: "action",
          },
          align: "center",
        },
      ],
      visible: false,
      visibleEditOrg: false,
      visiblePullOrg: false,
      loading: false,
      jsonData: {},
      selectedRows: [],
      searchForm: {},
      labelCol: { span: 5 },
      wrapperCol: { span: 18, offset: 1 },
      advanced: false,
      edittitle: "添加用户",
      editId: "",
      organizations: [],
      pullOrganization: [],
      methods_act: null,
      policylist: [],
      // 组织
      organization: [],
      policylists: [],
      visible_client: false,
      jsonData_client: {},
      organiza_name: "",
      organiza_expire: "",
      organiza_id: "",
      visibleEditRou: false,
      route_arr: [],
      routees: [],
      routes: [],
      indeterminate:{
        route:true,
      },
      checks_route:false,
      visibleEditApp: false,
      applications: [], //双向绑定应用列表
      appli_arr: [],
    };
  },

  created() {
    this.onLoad();
  },
  // 权限验证
  authorize: {
    init: "client.paginate",
    deleteRecord: "client.delete",
    // onAdd: "client.add",
    onEdit: "client.edit",
  },
  computed: {
    pagination: {
      get() {
        return {
          page: this.data.page || 1,
          per_page: this.data.per_page || 10,
        };
      },
      set(val) {
        this.data.page = val.page;
        this.data.per_page = val.per_page;
      },
    },
    rowOrganizations() {
      let result = [];
      console.log("this.selectedRows", this.selectedRows);
      this.selectedRows.forEach((item) => {
        result = [...result, ...(item.organizations || [])];
      });
      return result;
    },

    // 用来汇总选中数据的id,形成一个数组
    selectedRowIds() {
      return this.selectedRows.map((item) => item.id);
    },
    userinfo() {
      return this.$store.getters["account/user"];
    },
    routeids() {
      const records = this.route_arr.map((item) => {
        const record = item.record.map((temp) => temp.parent);
        return record;
      });
      let routes = [];
      records.forEach((element) => {
        routes = [...routes, ...element];
      });
      return routes;
    },
  },
  watch:{
    'routees': {
      handler(val) {
        let all =
          this.routees.length &&
          this.routees.length !== this.routeids.length;
        const chceked =
          this.routees.length &&
          this.routees.length === this.routeids.length;
        this.checks_route = chceked ? true : false;
        all = all ? true : false;
        this.indeterminate.route = val.length ? all : false;
      },
      deep: true,
    }
  },
  methods: {
    onLoad() {
      this.selectedRows = [];
      this.paginate();
      Promise.all([
        policy_list(),
        organization_tree(),
        form_get({ name: "onadd_client" }),
        routeinfo_group({ authkeys: ["ClientKey"]}),
        application_list(),
      ])
        .then((response) => {
          this.policylist = response[0].data.data;
          this.organizations = response[1].data.data;
          this.jsonData_client = response[2].data.data.form;
          this.route_arr = response[3].data.data;
          console.log("routes", this.route_arr);
          this.appli_arr = response[4].data.data;
          console.log("applications", this.appli_arr);
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
   

    // 分页方法
    paginate() {
      client_paginate(Object.assign(this.pagination, this.searchForm, {}))
        .then((res) => {
          console.log("res", res);
          this.loading = false;
          this.data = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onSelectChange() {},
    onClear() {
      this.$message.info("您清空了勾选的所有行");
    },
    onChangePage(page, pageSize) {
      this.loading = true;
      this.pagination.page = page;
      this.pagination.per_page = pageSize;
      this.paginate();
    },

    // 用户表单增编
    onSearch() {
      console.log("routes", this.route_arr);
      this.pagination = {
        per_page: 10,
        page: 1,
      };
      this.loading = true;
      this.paginate();
    },
    onReset() {
      this.loading = true;
      this.searchForm = {};
      this.pagination = {
        per_page: 10,
        page: 1,
      };
      this.paginate();
    },
    // 客户端新增
    onAdd_client() {
      this.visible_client = true;
      this.$nextTick(() => {
        this.mothed_client = client_add;
        this.id = undefined;
      });
    },
    // 客户端弹窗确定按钮
    onSubmit_client() {
      this.$refs.jsonData_client.getData().then((data) => {
        this.mothed_client(Object.assign(data, { id: this.id }))
          .then((res) => {
            this.visible_client = false;
            this.$refs.jsonData_client.reset();
            this.paginate();
          })
          .catch((err) => {
            console.log(err);
            this.visible_client = false;
            this.$refs.jsonData_client.reset();
            this.paginate();
          });
      });
    },
    // 客户端编辑
    onEdit_client(item) {
      console.log("你好呀", item);
      this.visible_client = true;
      this.id = item.id;
      this.$nextTick(() => {
        this.mothed_client = client_edit;
        this.$refs.jsonData_client.setData({
          name: item.name,
          expire: item.expire,
        });
      });
    },
    // 客户端删除
    onDelete_client(record) {
      let ids = [];
      // 如果只选中了一条数据
      if (record.id) {
        ids = [record.id];
      } else {
        ids = this.selectedRowIds;
      }
      let that = this;
      this.$confirm({
        title: "确定要删除此客户端吗?",
        // content: "删除后该用户所绑定所有第三方登录信息将被一同移除",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          that.loading = true;
          that.onLoad();
          client_delete({ ids: ids })
            .then(() => {
              that.onLoad();
            })
            .catch((err) => {
              console.log("err", err);
            });
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },

    // 设置组织按钮
    onEditOrganization(record) {
      console.log("record", record);
      this.organiza_id = record.id;
      this.organiza_name = record.name;
      this.organiza_expire = record.expire;
      this.organization = record.organizations;
      this.routees = record.routes;
      this.applications = record.applications;
      this.visibleEditOrg = true;
      this.loading = false;
    },

    // 设置组织弹窗的确定按钮
    onEditOrg() {
      this.loading = true;
      console.log("organization", this.organization);
      client_edit({
        id: this.organiza_id,
        name: this.organiza_name,
        expire: this.organiza_expire,
        organizations: this.organization,
        routes: this.routees,
        applications: this.applications,
      })
        .then((res) => {
          console.log("hellohello", res);
          this.$message.success(res.data.message);
          this.onLoad();
          this.visibleEditOrg = false;
          this.loading = false;
        })
        .catch((error) => {
          this.$message.error(error);
          this.loading = false;
        });
    },

    // 设置路由按钮
    onEditRoutes(record) {
      console.log('record',record);
      this.visibleEditRou = true;
      this.organiza_id = record.id;
      this.organiza_name = record.name;
      this.organiza_expire = record.expire;
      this.organization = record.organizations;
      this.routees = record.routes;
      this.applications = record.applications;
    },
    // 设置路由弹窗确定按钮
    onEditRou() {
      console.log("routees", this.routees);
      this.loading = true;
      console.log("organization", this.organization);
      client_edit({
        id: this.organiza_id,
        name: this.organiza_name,
        expire: this.organiza_expire,
        organizations: this.organization,
        routes: this.routees,
        applications: this.applications,
      })
        .then((res) => {
          console.log("hellohello", res);
          this.$message.success(res.data.message);
          this.onLoad();
          this.visibleEditRou = false;
          this.loading = false;
        })
        .catch((error) => {
          this.$message.error(error);
          this.loading = false;
        });
    },

    // 设置应用
    onEditAppli(record) {
      console.log("record", record);
      this.visibleEditApp = true;
      this.loading = false;
      this.organiza_id = record.id;
      this.organiza_name = record.name;
      this.organiza_expire = record.expire;
      this.organization = record.organizations;
      this.routees = record.routes;
      this.applications = record.applications;
    },

    // 应用弹窗确定按钮
    onEditApp() {
      this.loading = true;
      console.log("organization", this.organization);
      client_edit({
        id: this.organiza_id,
        name: this.organiza_name,
        expire: this.organiza_expire,
        organizations: this.organization,
        routes: this.routees,
        applications: this.applications,
      })
        .then((res) => {
          console.log("hellohello", res);
          this.$message.success(res.data.message);
          this.onLoad();
          this.visibleEditApp = false;
          this.loading = false;
        })
        .catch((error) => {
          this.$message.error(error);
          this.loading = false;
        });
    },
    // 切换路由
    onRouteChange(checkedValue) {
      this.routees = checkedValue;
    },
    onRouteAllChange(e) {
      const check = e.target.checked;
      this.routees = check ? this.routeids : [];
    },
  },
};
</script>

<style scoped>
.tree_sty {
  width: 100%;
}
.tree_sty >>> .ant-select-selection--multiple {
  padding-right: 50px;
}
</style>
<style>

.routes_root .ant-modal .ant-modal-content {
  height: 750px !important;
  position: relative;
}
.routes_root .ant-modal .ant-modal-content .ant-modal-body {
  height: 642px;
  overflow: auto;
  padding: 10px;
}
.routes_root .ant-modal .ant-modal-content .ant-modal-footer {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
}
.routes_root .ant-modal .ant-modal-content .ant-checkbox-wrapper {
  font-size: 13px;
}
.route_box .ant-card-grid {
  padding: 10px;
}

</style>
