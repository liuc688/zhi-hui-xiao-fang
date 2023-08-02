<template>
  <div style="padding: 0 30px">
    <a-form-model
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
    </a-form-model>
    <div style="width: 100%; padding: 5px 0px">
      <a-space>
        <a-dropdown-button @click="onAdd()" v-auth="`user.add`">
          新建用户
        </a-dropdown-button>
        <a-dropdown :disabled="selectedRows.length ? false : true">
          <a-menu slot="overlay">
            <a-menu-item key="oneditorganization" @click="onEditOrganization">
              <a-icon type="user" />
              添加到行业
            </a-menu-item>
            <a-menu-item key="1" @click="onPullOrganization">
              <a-icon type="user" />
              从该行业移除
            </a-menu-item>
          </a-menu>
          <a-button>批量设置行业<a-icon type="down" /> </a-button>
        </a-dropdown>
        <a-dropdown :disabled="selectedRows.length ? false : true">
          <a-menu slot="overlay">
            <template v-for="item in policylist">
              <a-menu-item :key="item.id" @click="onEditPolicy(item)">
                <a-icon type="user" />
                {{ item.title }}
              </a-menu-item>
            </template>
          </a-menu>
          <a-button>授权策略<a-icon type="down" /> </a-button>
        </a-dropdown>
        <a-dropdown :disabled="selectedRows.length ? false : true">
          <a-menu slot="overlay">
            <a-menu-item key="user" @click="onEditRole('user')">
              <a-icon type="user" />
              用户
            </a-menu-item>
            <a-menu-item key="guest" @click="onEditRole('guest')">
              <a-icon type="user" />
              访客
            </a-menu-item>
          </a-menu>
          <a-button> 设置角色 <a-icon type="down" /> </a-button>
        </a-dropdown>
        <a-button-group>
          <a-button
            :disabled="selectedRows.length ? false : true"
            @click="deleteRecord"
            >删除</a-button
          >
        </a-button-group>
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
    >
      <span slot="action" slot-scope="{ record }">
        <a-tooltip>
          <template slot="title">删除</template>
          <a @click="deleteRecord(record)" v-auth="`user.delete`">
            <a-icon type="delete" />
          </a>
        </a-tooltip>
      </span>
      <span slot="username" slot-scope="{ record }">
        <a @click="onEdit(record)" v-auth="`user.edit`" style="color: #1890ff">
          {{ record.username }}
        </a>
      </span>
      <span slot="role" slot-scope="{ record }">
        <a-tag color="cyan" v-if="record.role == 'admin'"> 管理员 </a-tag>
        <a-tag color="blue" v-if="record.role == 'user'"> 用户 </a-tag>
        <a-tag color="green" v-if="record.role == 'guest'"> 访客 </a-tag>
      </span>
      <span slot="policy" slot-scope="{ record }">
        <a-tag color="purple" v-if="record.policy"
          >{{ record.policy.title }}
        </a-tag>
        <template v-else> N/A </template>
      </span>
      <span slot="organization" slot-scope="{ record }">
        <template v-if="record.organization && record.organization.length">
          <a-tag color="blue" v-for="item in record.organization" :key="item.id"
            >{{ item.title }}
          </a-tag>
        </template>
        <template v-else> N/A </template>
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
      :title="edittitle"
      :visible="visible"
      :width="400"
      :confirm-loading="loading"
      :maskClosable="false"
      @ok="onok"
      @cancel="
        () => {
          this.$refs.formsadd.reset();
          this.organization = [];
          visible = false;
        }
      "
    >
      <k-form-build
        :value="jsonData"
        ref="formsadd"
        :dynamicData="dynamicData"
      />
    </a-modal>
    <a-modal
      title="批量设置行业"
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
      title="批量从行业移除"
      :visible="visiblePullOrg"
      :width="600"
      :confirm-loading="loading"
      :maskClosable="false"
      @ok="onPullOrg"
      @cancel="
        () => {
          this.organization = [];
          visiblePullOrg = false;
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
          v-model="pullOrganization"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="rowOrganizations"
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
  </div>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import {
  user_paginate,
  user_add,
  user_edit,
  user_delete,
  user_editorganization,
  user_pullorganization,
  user_editpolicy,
  user_editrole,
} from "@/services/user";
import { form_get } from "@/services/forms";
import { policy_list } from "@/services/policy";
import { organization_tree } from "@/services/organization";
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
          title: "登录账号",
          width: 100,
          dataIndex: "username",
          scopedSlots: { customRender: "username" },
        },
        {
          title: "昵称",
          width: 120,
          dataIndex: "nickname",
          scopedSlots: { customRender: "nickname" },
        },
        {
          title: "角色",
          width: 100,
          dataIndex: "role",
          scopedSlots: { customRender: "role" },
        },
        {
          title: "策略",
          width: 100,
          scopedSlots: { customRender: "policy" },
        },
        {
          title: "组织",
          scopedSlots: { customRender: "organization" },
        },

        {
          title: "操作",
          width: 80,
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
    };
  },

  created() {
    this.onLoad();
  },
  authorize: {
    init: "user.paginate",
    deleteRecord: "user.delete",
    onAdd: "user.add",
    onEdit: "user.edit",
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
      this.selectedRows.forEach((item) => {
        result = [...result, ...(item.organization || [])];
      });
      return result;
    },
    dynamicData() {
      let result = {
        organizations: this.organizations,
        policylist: [],
      };
      for (let item in this.policylist) {
        result.policylist.push({
          value: this.policylist[item].id,
          label: this.policylist[item].title,
        });
      }
      return result;
    },
    selectedRowIds() {
      return this.selectedRows.map((item) => item.id);
    },
    userinfo() {
      return this.$store.getters["account/user"];
    },
  },
  methods: {
    onLoad() {
      this.selectedRows = [];
      this.paginate();
      Promise.all([
        policy_list(),
        organization_tree(),
        form_get({ name: "user_add" }),
      ])
        .then((response) => {
          this.policylist = response[0].data.data;
          this.organizations = response[1].data.data;
          this.jsonData = response[2].data.data.form;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    onPullOrganization() {
      this.pullOrganization = [];
      this.visiblePullOrg = true;
      this.loading = false;
    },
    onPullOrg() {
      this.loading = true;

      user_pullorganization({
        id: this.selectedRowIds,
        organization: this.pullOrganization,
      })
        .then((response) => {
          this.$message.success(response.data.message);
          this.onLoad();
          this.visiblePullOrg = false;
          this.loading = false;
        })
        .catch((error) => {
          console.log("error", error);
          this.loading = false;
        });
    },
    onEditOrganization() {
      this.organization = [];
      this.visibleEditOrg = true;
      this.loading = false;
    },
    onEditOrg() {
      this.loading = true;
      user_editorganization({
        id: this.selectedRowIds,
        organization: this.organization,
      })
        .then((response) => {
          this.$message.success(response.data.message);
          this.onLoad();
          this.visibleEditOrg = false;
          this.loading = false;
        })
        .catch((error) => {
          this.$message.error(error);
          this.loading = false;
        });
    },
    onEditPolicy(record) {
      user_editpolicy({
        id: this.selectedRowIds,
        policy: record.id,
      })
        .then((response) => {
          this.$message.success(response.data.message);
          this.onLoad();
        })
        .catch((error) => {
          console.log("error", error);
          this.$message.error(error.data.message);
        });
    },
    onEditRole(role) {
      const that = this;
      if (role === "user") {
        let result = [];
        this.selectedRows.forEach((item) => {
          if (!item.policy) {
            result.push({
              username: item.username,
              realname: item.realname,
              message: "未设置策略",
            });
          }
          if (!item.organization || !item.organization.length) {
            result.push({
              username: item.username,
              realname: item.realname,
              message: "未设置组织",
            });
          }
        });
        if (result.length) {
          let lines = [];

          result.forEach((item) => {
            lines.push(
              this.$createElement(
                "p",
                `${item.realname},错误信息:${item.message}`
              )
            );
          });

          this.$error({
            title: "设置角色错误",
            content: this.$createElement("div", {}, lines),
          });
          return;
        }
        this.$confirm({
          title: "确定要将用户角色设置为用户吗?",
          content:
            "将用户角色设置为用户时,请确保该用户已拥有组织及策略,用户将移至用户列表",
          okText: "确定",
          okType: "danger",
          cancelText: "取消",
          onOk() {
            user_editrole({
              id: that.selectedRowIds,
              role: role,
            })
              .then((response) => {
                that.$message.success(response.data.message);
                that.onLoad();
              })
              .catch((error) => {
                that.$message.error(error);
                console.log("error", error);
              });
          },
          onCancel() {
            console.log("Cancel");
          },
        });
      } else {
        this.$confirm({
          title: "确定要将用户角色设置为访客吗?",
          content: "将用户角色设置为访客,用户将移至访客列表",
          okText: "确定",
          okType: "danger",
          cancelText: "取消",
          onOk() {
            user_editrole({
              id: that.selectedRowIds,
              role: role,
            })
              .then((response) => {
                that.$message.success(response.data.message);
                that.onLoad();
              })
              .catch((error) => {
                that.$message.error(error);
                console.log("error", error);
              });
          },
          onCancel() {
            console.log("Cancel");
          },
        });
      }
    },
    paginate() {
      user_paginate(
        Object.assign(this.pagination, this.searchForm, {
          roletype: "admin",
        })
      )
        .then((res) => {
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
    deleteRecord(record) {
      let ids = [];
      if (record.id) {
        ids = [record.id];
      } else {
        ids = this.selectedRowIds;
      }
      let that = this;
      this.$confirm({
        title: "确定要删除此用户吗?",
        content: "删除后该用户所绑定所有第三方登录信息将被一同移除",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          that.loading = true;
          that.onLoad();
          user_delete({ ids: ids })
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
    // 用户添加
    onAdd() {
      this.visible = true;
      this.editId = "";
      this.edittitle = "添加用户";
      this.methods_act = user_add;
      this.$nextTick(() => {
          this.$refs.formsadd.reset();
          this.$refs.formsadd.enable(["username"]);
        });
    },
    // 用户表单增编
    onEdit(record) {
      this.visible = true;
      this.recordes = record;
      this.edittitle = "编辑用户";
      this.editId = record.id;
      this.methods_act = user_edit;
      this.$nextTick(() => {
        this.$refs.formsadd.disable(["username"]);
        this.organization = record.organization;
        this.$refs.formsadd.setData({
          username: record.username,
          nickname: record.nickname,
          realname: record.realname,
          password: "123456",
          mobile: record.mobile,
          policy: record.policy,
        });
      });
    },
    onok() {
      this.$refs.formsadd
        .getData()
        .then((res) => {
          var data = {
            id: this.editId,
            username: res.username,
            password: md5(res.password),
            realname: res.realname,
            nickname: res.nickname,
            mobile: res.mobile,
          };
          if (!this.editId) {
            data.organization = [this.id];
          }
          this.methods_act(data)
            .then(() => {
              this.$refs.formsadd.reset();
              this.organization = [];
              this.visible = false;
              this.$message.success("保存成功");
              this.onLoad();
            })
            .catch((err) => {
              console.log("err", err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onSearch() {
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
