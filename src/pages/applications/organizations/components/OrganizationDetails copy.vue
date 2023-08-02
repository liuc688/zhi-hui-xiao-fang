<template>
  <div style="padding: 0 30px">
    <a-form-model ref="searchForm" :model="searchForm">
      <a-row>
        <a-col :lg="24" :md="24" :sm="24">
          <a-form-model-item
            label="组织"
            :label-col="{ span: 2 }"
            :wrapper-col="{ span: 20 }"
          >
            <a-tree-select
              show-search
              multiple
              class="selects_trees"
              v-model="searchForm.organization"
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
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-model-item
            label="关键字"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 18 }"
          >
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
        <a-dropdown-button @click="onAdd()" v-auth="`user.add`" :disabled="!id">
          新建用户
        </a-dropdown-button>

        <a-dropdown :disabled="selectedRows.length ? false : true">
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="onPullOrganization">
              <a-icon type="user" />
              从该组织移除
            </a-menu-item>
            <a-menu-item key="2" @click="onEditOrganization">
              <a-icon type="user" />
              添加到组织
            </a-menu-item>
          </a-menu>
          <a-button>批量设置组织<a-icon type="down" /> </a-button>
        </a-dropdown>
        <a-tree-select
          style="width: 200px"
          :disabled="selectedRows.length ? false : true"
          allowClear
          @change="treeSelectChange"
          v-model="policylistome"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="dynamicData.policylist"
          placeholder="请选择授权策略"
          :replaceFields="{
            key: 'id',
            value: 'id',
          }"
        ></a-tree-select>
        <!-- <a-dropdown :disabled="selectedRows.length ? false : true">
          <a-menu slot="overlay">
            <template v-for="item in dynamicData.policylist">
              <a-menu-item :key="item.id" @click="onEditPolicy(item)">
                <a-icon type="user" />
                {{ item.title }}
              </a-menu-item>
            </template>
          </a-menu>
          <a-button>授权策略<a-icon type="down" /> </a-button>
        </a-dropdown> -->
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
        <a-space>
          <a-tooltip>
            <template slot="title">删除</template>
            <a @click="deleteRecord(record)" v-auth="`user.delete`">
              <a-icon type="delete" />
            </a>
          </a-tooltip>
          <a-tooltip>
            <template slot="title">重置密码</template>
            <a @click="resetpassword(record)" v-auth="`user.resetpassword`">
              <a-icon type="undo" />
            </a>
          </a-tooltip>
        </a-space>
      </span>
      <span slot="username" slot-scope="{ record }">
        <a @click="onEdit(record)" v-auth="`user.edit`" style="color: #1890ff">
          {{ record.username }}
        </a>
      </span>
      <span slot="policy" slot-scope="{ record }">
        <a-tag color="orange" v-if="record.policy">
          {{ record.policy.title }}
        </a-tag>
        <div v-else></div>
      </span>
      <span slot="primary" slot-scope="{ record }">
        <a-tag color="cyan" v-if="record.primary">
          {{ record.primary.title }}
        </a-tag>
        <div v-else></div>
      </span>
      <span slot="organization" slot-scope="{ record }" style="cursor: pointer">
        <div @click="ognazitiongs(record)">
          <a-tag
            color="blue"
            style="cursor: pointer"
            :key="item.id"
            v-for="item in record.organization"
          >
            {{ item.title }}
          </a-tag>
        </div>
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
    <!-- 用户增编 -->
    <a-modal
      :title="edittitle"
      :visible="visible"
      :width="600"
      :confirm-loading="confirmLoading"
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
      <a-alert
        message="密码中必须字母开头、包含数字或下划线，且在8~16位"
        type="warning"
        show-icon
      >
      </a-alert>
      <k-form-build
        :value="jsonData"
        ref="formsadd"
        :dynamicData="dynamicData"
      />
    </a-modal>
    <a-modal
      title="批量设置组织"
      :visible="visibleEditOrg"
      :width="600"
      :confirm-loading="confirmLoading"
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
        <a-checkbox
          style="position: absolute; right: 0px"
          @change="onChange"
          v-model="allselect"
        >
          全选
        </a-checkbox>
      </a-form-model-item>
    </a-modal>
    <a-modal
      title="编辑用户组织"
      :visible="visibleogna"
      :width="800"
      :confirm-loading="confirmLoadings"
      :maskClosable="false"
      @ok="onEditOrgnas"
      @cancel="
        () => {
          visibleogna = false;
          organizationes = [];
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
          v-model="organizationes"
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
        <a-checkbox
          class="checkes_all"
          @change="onChanges"
          v-model="allselectes"
        >
          全选
        </a-checkbox>
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
  user_pushorganization,
  user_editpolicy,
  user_editrole,
  reset_password,
} from "@/services/user";
import md5 from "md5";
import { policy_alltree, policy_tree } from "@/services/policy";

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
      loading: true,
      data: {},
      columns: [
        {
          title: "登录账号",
          dataIndex: "username",
          width: 200,
          scopedSlots: { customRender: "username" },
        },
        {
          title: "昵称",
          width: 160,
          dataIndex: "nickname",
          scopedSlots: { customRender: "nickname" },
        },
        {
          title: "所属策略",
          dataIndex: "policy",
          width: 200,
          scopedSlots: { customRender: "policy" },
        },
        {
          title: "所在组织",
          dataIndex: "primary",
          width: 200,
          scopedSlots: { customRender: "primary" },
        },
        {
          title: "拥有组织",
          dataIndex: "organization",
          scopedSlots: { customRender: "organization" },
          ellipsis: true,
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
      confirmLoading: false,
      jsonData: {},
      orglist: [],
      id: "",
      //
      selectedRows: [],
      datadetailes: {},
      //
      searchForm: {
        keyword: undefined,
        organization: [],
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      advanced: false,
      edittitle: "添加用户",
      editId: "",
      organizations: [],
      methods_act: null,
      policylist: [],
      // 组织
      organization: [],
      allselect: null,
      policylists: [],
      policylistes: [],
      visibleogna: false,
      confirmLoadings: false,
      organizationes: [],
      allselectes: false,
      siteids: undefined,
      policylistome: undefined,
      recordes: {},
    };
  },
  watch: {
    organization: {
      handler(value) {
        if (value.length == this.policylists.length) {
          this.allselect = true;
        } else {
          this.allselect = false;
        }
      },
      deep: true,
    },
    organizationes: {
      handler(value) {
        if (value.length == this.policylists.length) {
          this.allselectes = true;
        } else {
          this.allselectes = false;
        }
      },
      deep: true,
    },
  },
  created() {
    this.init();
  },
  authorize: {
    init: "user.paginate",
    deleteRecord: "user.delete",
    resetpassword: "user.resetpassword",
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
    dynamicData() {
      let result = {
        organizations: this.organizations,
        policylist: [],
      };
      // for (let item in this.policylist) {
      //   result.policylist.push({
      //     value: this.policylist[item].id,
      //     label: this.policylist[item].title,
      //   });
      // }
      return result;
    },
    selectedRowIds() {
      return this.selectedRows.map((item) => item.id);
    },

    userinfo() {
      return this.$store.getters["account/user"];
    },
    policy_tree() {
      return this.$auth("policy.alltree") ? policy_alltree : policy_tree;
    },
  },
  methods: {
    init() {
      console.log("this.params", this.params);
      // 所有站点id
      this.policylists = [];
      this.orglist = this.params.orglist;
      for (let item in this.orglist) {
        this.policylists.push(this.orglist[item].id);
      }
      // 用户增编表单
      this.jsonData = this.params.jsonDatas;
      this.organizations = this.params.organizations;
      // 策略树
      if (this.params.id) {
        this.policy_tree({ organization: this.params.id })
          .then((response) => {
            this.dynamicData.policylist = response.data.data;
          })
          .catch((err) => {
            console.log(err);
            this.$message.error(err.response.data.message);
          });
      } else {
        this.$message.warning("请选择组织！");
      }

      // this.policylist = this.params.policylist;
      // var operation = this.userinfo.roles[1].operation;
      // if (operation.length == 1 && operation.indexOf("shuzijiaming") > -1) {
      //   this.policylist = this.params.policylist.filter((item) => {
      //     return item.title == "嘉明管委会_数据";
      //   });
      // } else {
      //   this.policylist = this.params.policylist;
      // }
      this.id = this.params ? this.params.id : undefined;
      if (this.id) {
        this.paginate();
      } else {
        this.loading = false;
      }
    },
    onPullOrganization() {
      if (this.id) {
        const that = this;
        this.$confirm({
          title: "确定要从该组织移除选定的账好吗?",
          content: "注：如选定的帐号仅剩当前组织，则无法将此账号从该组织移除！",
          okText: "确定",
          okType: "danger",
          cancelText: "取消",
          onOk() {
            that.loading = true;
            user_pullorganization({
              id: that.selectedRowIds,
              organization: [that.id],
            })
              .then((response) => {
                that.$message.success(response.data.message);
                that.init();
              })
              .catch((error) => {
                console.log("error", error);
              });
          },
          onCancel() {},
        });
      } else {
        this.$message.error("请选择一个项组织");
      }
    },
    onEditOrganization() {
      this.visibleEditOrg = true;
      this.confirmLoading = false;
    },
    onEditOrg() {
      this.confirmLoading = true;
      user_pushorganization({
        id: this.selectedRowIds,
        organization: this.organization,
      })
        .then((response) => {
          this.$message.success(response.data.message);
          this.init();
          this.visibleEditOrg = false;
          this.confirmLoading = false;
        })
        .catch((error) => {
          this.$message.error(error);
          this.confirmLoading = false;
        });
    },
    onEditPolicy(record) {
      user_editpolicy({
        id: this.selectedRowIds,
        policy: record.id,
      })
        .then((response) => {
          this.$message.success(response.data.message);
          this.init();
        })
        .catch((error) => {
          console.log("error", error);
          this.$message.error(error.data.message);
        });
    },
    onEditRole(role) {
      user_editrole({
        id: this.selectedRowIds,
        role: role,
      })
        .then((response) => {
          this.$message.success(response.data.message);
          this.init();
        })
        .catch((error) => {
          this.$message.error(error);
          console.log("error", error);
        });
    },
    paginate() {
      user_paginate(
        Object.assign(this.pagination, this.searchForm, {
          organization: this.searchForm.organization.length
            ? this.searchForm.organization
            : this.id
            ? [this.id]
            : [],
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
    onChange() {
      if (this.allselect) {
        this.organization = this.policylists;
      } else {
        this.organization = [];
      }
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
        title: "确定要删除此策略吗?",
        content: "删除后该用户组用户无法登录(需要重新设置用户组)",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          that.loading = true;
          that.init();
          user_delete({ ids: ids })
            .then(() => {
              that.init();
            })
            .catch((err) => {
              console.log("err", err);
            });
        },
        onCancel() {},
      });
    },
    // 重置密码
    resetpassword(record) {
      var that = this;
      that.$confirm({
        title: "您确定要重置密码吗?",
        content: "重置后密码为‘123456’",
        cancelText: "取消",
        onOk() {
          reset_password({ id: record.id })
            .then((res) => {
              console.log("res", res);
              if (res.status) {
                that.$message.success("密码重置成功！");
                that.paginate();
              } else {
                that.$message.error("密码重置失败！");
              }
            })
            .catch((err) => {
              console.log(err);
            });
        },
        onCancel() {
          that.$message.warning("密码重置已取消！");
        },
      });
      console.log("record", record);
    },
    // 用户添加
    onAdd() {
      if (this.id) {
        this.visible = true;
        this.editId = undefined;
        this.edittitle = "添加用户";
        this.recordes = {};
        this.methods_act = user_add;
        this.$nextTick(() => {
          this.$refs.formsadd.reset();
          this.$refs.formsadd.show(["password", "policy"]);
          this.$refs.formsadd.enable(["username", "password"]);
        });
      } else {
        this.$message.error("请选择一个项组织");
      }
    },
    // 用户表单增编
    onEdit(record) {
      this.visible = true;
      this.recordes = record;
      this.edittitle = "编辑用户";
      this.editId = record.id;
      this.methods_act = user_edit;
      this.$nextTick(() => {
        if (this.policylists.length == record.organization.length) {
          this.allselect = true;
        } else {
          this.allselect = false;
        }
        this.organization = record.organization;
        this.$refs.formsadd.disable(["username"]);
        this.$refs.formsadd.hide(["password", "policy"]);
        this.$refs.formsadd.setData({
          username: record.username,
          nickname: record.nickname,
          realname: record.realname,
          mobile: record.mobile,
          policy: record.policy.id,
        });
      });
    },
    onok() {
      this.$refs.formsadd
        .getData()
        .then((res) => {
          var datas = {};
          if (this.edittitle == "编辑用户") {
            datas = {
              id: this.editId,
              username: res.username,
              realname: res.realname,
              nickname: res.nickname,
              mobile: res.mobile,
              policy: this.editId ? this.recordes.policy.id : undefined,
            };
          } else {
            if (res.password && this.pPattern(res.password)) {
              this.$message.error("请按照规则填写密码！");
            } else {
              datas = {
                id: this.editId,
                username: res.username,
                password: md5(res.password),
                realname: res.realname,
                nickname: res.nickname,
                mobile: res.mobile,
                policy: res.policy,
              };
            }
          }
          if (!this.editId) {
            datas.organization = [this.id];
          }
          this.confirmLoading = true;
          this.methods_act(datas)
            .then(() => {
              this.confirmLoading = false;
              this.$refs.formsadd.reset();
              this.organization = [];
              this.visible = false;
              this.$message.success("保存成功");
              this.init();
            })
            .catch((err) => {
              this.confirmLoading = false;
              console.log("err", err);
              this.$message.error(err.response.data.message);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    pPattern(string) {
      if (string.length >= 8 && string.length <= 16) {
        var pattern_1 =
          /^.*(?=.{8,16})(?=.*\d)(?=.*[a-z]{1,})(?=.*[!@#$%^&*?\(\)]).*$/;
        var pattern_2 = /^.*(?=.{8,16})(?=.*\d)(?=.*[a-z]{1,}).*$/;
        var pattern_3 = /^.*(?=.{8,16})(?=.*\d)(?=.*[!@#$%^&*?\(\)]).*$/;
        var pattern_4 = /^.*(?=.{8,16})(?=.*[a-z]{1,})(?=.*[!@#$%^&*?\(\)]).*$/;
        if (pattern_1.test(string)) {
          //英文数字特殊字符
          return false;
        } else if (pattern_2.test(string)) {
          //英文数字
          return false;
        } else if (pattern_3.test(string)) {
          //数字特殊字符
          return false;
        } else if (pattern_4.test(string)) {
          //英文特殊字符
          return false;
        }
      }
      return true;
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
      this.searchForm = {
        organization: [],
        keyword: undefined,
      };
      this.pagination = {
        per_page: 10,
        page: 1,
      };
      this.paginate();
    },
    // 用户组织编辑
    onEditOrgnas() {
      this.confirmLoadings = true;
      user_editorganization({
        id: [this.siteids],
        organization: this.organizationes,
      })
        .then((response) => {
          this.$message.success(response.data.message);
          this.init();
          this.visibleogna = false;
          this.confirmLoadings = false;
        })
        .catch((error) => {
          this.$message.error(error);
          this.confirmLoadings = false;
        });
    },

    treeSelectChange(value) {
      if (value) {
        user_editpolicy({
          id: this.selectedRowIds,
          policy: value,
        })
          .then((response) => {
            this.$message.success(response.data.message);
            this.policylistome = undefined;
            this.init();
          })
          .catch((error) => {
            console.log("error", error);
            this.$message.error(error.data.message);
          });
      }
    },
    ognazitiongs(data) {
      this.loading = true;
      this.visibleogna = true;
      this.siteids = data.id;
      if (this.policylists.length == data.organization.length) {
        this.allselectes = true;
      } else {
        this.allselectes = false;
      }
      this.$nextTick(() => {
        var arrays = [];
        data.organization.filter((item) => {
          arrays.push(item.id);
        });
        this.organizationes = arrays;
        this.loading = false;
      });
    },
    onChanges() {
      if (this.allselectes) {
        this.organizationes = this.policylists;
      } else {
        this.organizationes = [];
      }
    },
  },
};
</script>

<style scoped>
.tree_sty {
  width: 100%;
  max-height: 500px;
  overflow: auto;
}

.a-popover-opened {
  width: 600px;
}

.tree_sty >>> .ant-select-selection--multiple {
  padding-right: 50px;
}

.checkes_all {
  position: absolute;
  right: 0px !important;
}

.checkes_all >>> .ant-checkbox + span {
  padding-right: 20px;
}

.selects_trees {
  width: 100%;
}

.selects_trees
  >>> .ant-select-selection--multiple
  .ant-select-selection__choice__content {
  max-width: 100px;
  overflow: hidden;
  white-space: nowrap;
}

.selects_trees >>> .ant-select-selection,
.ant-select-selection--multiple {
  max-height: 90px !important;
  overflow: auto;
}
</style>
