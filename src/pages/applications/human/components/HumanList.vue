<template>
  <a-card>
    <a-form layout="horizontal" :model="searchform" ref="searchform">
      <div :class="advanced ? null : 'fold'">
        <a-row>
          <a-col :md="7" :sm="24">
            <a-form-item
              label="关键字"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-input
                placeholder="请输入"
                v-model="searchform.keyword"
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="24" :offset="1">
            <a-form-item
              label="所属组织"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-tree-select
                allowClear
                tree-data-simple-mode
                :tree-data="organizations"
                placeholder="请选择组织"
                v-model="searchform.organization"
                :replaceFields="{
                  key: 'id',
                  value: 'id',
                  title: 'title',
                }"
              />
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="24" :offset="1">
            <a-form-item
              label="标签"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-select
                mode="multiple"
                v-model="searchform.tags"
                placeholder="请选择标签"
              >
                <a-select-option v-for="i in tags" :key="i">
                  {{ i }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="7" :sm="24">
            <a-form-item
              label="所属部门"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-select
                allowClear
                placeholder="请选择部门"
                v-model="searchform.department"
              >
                <a-select-option
                  v-for="item in dynamicData.department"
                  :key="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="24" :offset="1">
            <a-form-item
              label="所属岗位"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-select
                allowClear
                placeholder="请选择岗位"
                v-model="searchform.post"
              >
                <a-select-option
                  v-for="item in dynamicData.post"
                  :key="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="24" :offset="1">
            <a-form-item
              label="所属职位"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-select
                allowClear
                placeholder="请选择职位"
                v-model="searchform.position"
              >
                <a-select-option
                  v-for="item in dynamicData.position"
                  :key="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="7" :sm="24">
            <a-form-item
              label="在职状态"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-select
                allowClear
                placeholder="请选择在职状态"
                v-model="searchform.jstatus"
              >
                <a-select-option
                  v-for="item in dynamicData.jstatus"
                  :key="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <span style="float: right; margin-top: 3px">
        <a-button type="primary" @click="onSearch" :loading="loading"
          >查询</a-button
        >
        <a-button
          style="margin-left: 8px"
          @click="
            () => {
              searchform = {};
              onLoad();
            }
          "
          >重置</a-button
        >
      </span>
    </a-form>
    <div>
      <div style="width: 100%; padding: 5px 0px">
        <a-space>
          <a-dropdown-button @click="onAdd()" v-auth="`human.edit`">添加人员</a-dropdown-button>
          <a-dropdown-button @click="onForm()">设置表单</a-dropdown-button>
        </a-space>
      </div>
      <a-table
        :loading="loading"
        :columns="columns"
        :dataSource="dataSource"
        :selectedRows.sync="selectedRows"
        @clear="onClear"
        :rowKey="'id'"
        @selectedRowChange="onSelectChange"
        :scroll="{ x: 1500 }"
        :pagination="{
          'show-quick-jumper': true,
          'show-size-changer': true,
          'page-size-options': ['10', '20', '40', '50', '100'],
          'page-size': 10,
        }"
      >
        <a slot="lable" slot-scope="record" @click="onEdit(record)">
          {{ record.realname }}
        </a>
        <span slot="organizations" slot-scope="record">
          <template v-if="record.organizations.length">
            <a-tag
              :key="item"
              color="blue"
              v-for="item in record.organizations.split(sep)"
            >
              {{ item }}
            </a-tag>
          </template>
          <template v-else>
            N/A
          </template>
        </span>

        <span slot="working" slot-scope="record">
          <template v-if="record.working">
            {{
              `${record.working.year}年${record.working.month}个月零${record.working.day}天`
            }}
          </template>
        </span>
        <span slot="holiday" slot-scope="record">
          <template v-if="record.holiday">
            {{ `${record.holiday}天` }}
          </template>
        </span>
        <span slot="jstatus" slot-scope="record">
          <template v-if="record.jstatus">
            <a-tag :color="record.jstatus.color">
              {{ record.jstatus.title }}
            </a-tag>
          </template>
          <template v-else>
            N/A
          </template>
        </span>
        <span slot="department" slot-scope="record">
          <template v-if="record.department">
            <a-tag :color="record.department.color">
              {{ record.department.title }}
            </a-tag>
          </template>
          <template v-else>
            N/A
          </template>
        </span>
        <span slot="post" slot-scope="record">
          <template v-if="record.post">
            <a-tag :color="record.post.color">
              {{ record.post.title }}
            </a-tag>
          </template>
          <template v-else>
            N/A
          </template>
        </span>
        <span slot="position" slot-scope="record">
          <template v-if="record.position">
            <a-tag :color="record.position.color">
              {{ record.position.title }}
            </a-tag>
          </template>
          <template v-else>
            N/A
          </template>
        </span>
        <div slot="action" slot-scope="record">
          <a-dropdown>
            <a class="ant-dropdown-link"> 操作 <a-icon type="down" /> </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="onEdit(record)" v-auth="`human.edit`">
                  <a-icon type="edit" />
                  编辑
                </a>
              </a-menu-item>
              <a-menu-item>
                <a @click="onDelete(record)" v-auth="`human.delete`">
                  <a-icon type="edit" />
                  删除
                </a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
        <template slot="footer" slot-scope="records">
          <a-descriptions :column="3" size="small">
            <a-descriptions-item label="人员数量">
              <a-statistic
                :precision="0"
                :value="records.length"
                :valueStyle="{
                  fontSize: '16px',
                }"
              />
            </a-descriptions-item>
          </a-descriptions>
        </template>
      </a-table>
    </div>
  </a-card>
</template>

<script>
import { form_get } from "@/services/forms";
import Cookie from "js-cookie";

import { human_delete, human_list } from "@/services/human";

import { table_form_get } from "@/services/table";
import { dictmap_tree } from "@/services/dictmap";
import { organization_tree } from "@/services/organization";
import { user_list } from "@/services/user";

export default {
  props: {
    params: {
      //传递的数据
      type: Object,
    },
    event: {
      type: Function,
    },
    crumbs: {
      type: Array,
    },
  },
  data() {
    return {
      loading: false,
      advanced: false,
      visible: false,
      sep: ",",
      columns: [],
      id: null,
      users: [],
      defaultJsonData: {},
      jsonData: {
        list: [],
        config: {
          layout: "vertical",
          labelCol: {
            xs: 4,
            sm: 4,
            md: 4,
            lg: 4,
            xl: 4,
            xxl: 4,
          },
          labelWidth: 100,
          labelLayout: "flex",
          wrapperCol: {
            xs: 18,
            sm: 18,
            md: 18,
            lg: 18,
            xl: 18,
            xxl: 18,
          },
          hideRequiredMark: false,
          customStyle: "",
        },
      },
      data: [],
      searchform: {},
      selectedRows: [],
      fields: [],
      groups: [],
      formId: "61c55a86f8bd7af024f527e4",
      action: null,
      record: {},
      organizations: [],
      tags: [],
      humanResources: [],
    };
  },
  computed: {
    dynamicData() {
      let result = {
        organizations: this.organizations,
        users: this.users.map((x) => {
          return {
            label: x.realname,
            value: x.id,
            key: x.id,
          };
        }),
      };
      if (this.humanResources) {
        var Department = this.humanResources.find(
          (x) => x.name == "HunmanResources_Department"
        );
        if (Department) {
          result.department = Department.children.map((x) => {
            return {
              label: x.title,
              value: x.id,
              key: x.id,
            };
          });
        }
      }
      if (this.humanResources) {
        var Post = this.humanResources.find(
          (x) => x.name == "HunmanResources_Post"
        );
        if (Post) {
          result.post = Post.children.map((x) => {
            return {
              label: x.title,
              value: x.id,
              key: x.id,
            };
          });
        }
      }
      if (this.humanResources) {
        var Status = this.humanResources.find(
          (x) => x.name == "HunmanResources_Status"
        );
        if (Status) {
          result.jstatus = Status.children.map((x) => {
            return {
              label: x.title,
              value: x.id,
              key: x.id,
            };
          });
        }
      }
      if (this.humanResources) {
        var Position = this.humanResources.find(
          (x) => x.name == "HunmanResources_Position"
        );
        if (Position) {
          result.position = Position.children.map((x) => {
            return {
              label: x.title,
              value: x.id,
              key: x.id,
            };
          });
        }
      }

      return result;
    },
    config() {
      return {
        uploadFileHeaders: {
          Authorization: Cookie.get("Authorization"),
        },
        uploadImageHeaders: {
          Authorization: Cookie.get("Authorization"),
        },
      };
    },
    crumbParams() {
      return Object.assign({}, this.searchform);
    },
    dataSource() {
      if (this.data.length && this.columns.length) {
        const data = this.data.map((item) => {
          for (const key in item) {
            if (Object.hasOwnProperty.call(item, key)) {
              if (
                item[key] instanceof Array &&
                item[key].length &&
                !(item[key][0] instanceof Array) &&
                !(item[key][0] instanceof Object) &&
                !this.columns.map((x) => x.key).includes(key)
              ) {
                item[key] = item[key].join(this.sep);
              }
            }
          }
          return item;
        });

        return data;
      }
      return [];
    },
  },
  authorize: {
    onAdd:'human.edit',
    onForm:'table.form',
    onEdit:'human.edit',
    onDelete:'human.delete',
    onLoadList:'human.list',
  },
  created() {
    this.onLoad();
  },
  methods: {
    onLoad() {
      this.loading = true;
      Promise.all([
        this.onLoadList(),
        table_form_get({
          parent: this.formId,
        }),
        form_get({
          name: "human_add",
        }),
        organization_tree(),
        user_list(),
        dictmap_tree({
          name: "HunmanResources",
        }),
      ])
        .then((response) => {
          this.jsonData = response[1].data.data
            ? response[1].data.data.form
            : this.jsonData;
          this.fields = response[1].data.data
            ? response[1].data.data.fields
            : [];
          this.groups = response[1].data.data
            ? response[1].data.data.groups
            : [];
          this.defaultJsonData = response[2].data.data.form;
          this.organizations = response[3].data.data;
          this.users = response[4].data.data;
          this.humanResources = response[5].data.data;
          this.columns = [
            {
              title: "工号",
              width: 80,
              dataIndex: "sntrances.jnumber",
              ellipsis: true,
            },
            {
              title: "在职状态",
              ellipsis: true,
              scopedSlots: { customRender: "jstatus" },
            },
            {
              title: "人员名称",
              ellipsis: true,
              scopedSlots: { customRender: "lable" },
            },
            {
              title: "所属组织",
              width: 400,
              ellipsis: true,
              scopedSlots: { customRender: "organizations" },
            },
            {
              title: "所属部门",
              ellipsis: true,
              scopedSlots: { customRender: "department" },
            },
            {
              title: "所属岗位",
              ellipsis: true,
              scopedSlots: { customRender: "post" },
            },
            {
              title: "所属职位",
              ellipsis: true,
              scopedSlots: { customRender: "position" },
            },
            {
              title: "工龄",
              ellipsis: true,
              scopedSlots: { customRender: "working" },
            },
            {
              title: "年假",
              ellipsis: true,
              scopedSlots: { customRender: "holiday" },
            },
            ...this.fields.map((item) => {
              const filters = [];
              this.data.forEach((temp) => {
                const value = temp[item.key];
                if (
                  value &&
                  typeof value != Object &&
                  !(value instanceof Array)
                ) {
                  const element = {
                    text: value,
                    value: value,
                  };
                  if (!filters.map((x) => x.value).includes(element.value)) {
                    filters.push(element);
                  }
                }
              });
              return {
                title: item.label,
                ellipsis: true,
                filters: filters,
                onFilter: (value, record) => {
                  return record[item.key] === value;
                },
                dataIndex: item.key,
              };
            }),
            {
              title: "操作",
              width: 80,
              fixed: "right",
              scopedSlots: { customRender: "action" },
            },
          ];
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    onLoadList() {
      this.loading = true;
      return new Promise((resolve, reject) => {
        human_list({
          ...this.searchform,
        })
          .then((response) => {
            this.data = response.data.data;
            this.tags = response.data.tags;
            this.loading = false;
            resolve(response);
          })
          .catch((error) => {
            this.loading = false;
            reject(error);
          });
      });
    },
    onDetail() {},
    onAdd() {
      this.onLink({
        params: {
          record: {},
          extend: {
            defaultJsonData: this.defaultJsonData,
            jsonData: this.jsonData,
            dynamicData: this.dynamicData,
            users: this.users,
          },
        },
        currRoute: "human-list",
        targetRoute: "human-edit",
      });
    },
    onEdit(record) {
      this.onLink({
        params: {
          record: record,
          extend: {
            defaultJsonData: this.defaultJsonData,
            jsonData: this.jsonData,
            dynamicData: this.dynamicData,
            users: this.users,
          },
        },
        currRoute: "human-list",
        targetRoute: "human-edit",
      });
    },
  
    onDelete(record) {
      this.$confirm({
        title: "删除确认",
        content: "确认要删除吗?该操作不可逆,请谨慎操作!",
        okText: "确认",
        cancelText: "取消",
        confirmLoading: this.loading,
        onOk: () => {
          this.loading = true;
          human_delete({ ids: [record.id] })
            .then((response) => {
              this.$message.success(response.data.message);
              this.loading = false;
              this.onLoad();
            })
            .catch((error) => {
              this.$message.error(error.response.data.message);
              this.loading = false;
              this.onLoad();
            });
        },
      });
    },
    onForm() {
      this.onLink({
        params: {
          id: this.formId,
        },
        currRoute: "human-list",
        targetRoute: "table-form",
      });
    },
    onContractList(record) {
      this.onLink({
        params: record,
        currRoute: "human-list",
        targetRoute: "contract-list",
      });
    },
    onContractForm(record) {
      this.onLink({
        params: record,
        currRoute: "human-list",
        targetRoute: "table-form",
      });
    },
    onSearch() {
      this.onLoadList();
    },

    onLink({ params, currRoute, targetRoute }) {
      this.crumbs.push({
        params: this.crumbParams,
        route: currRoute,
      });
      this.$emit("event", {
        method: "onLink",
        params: {
          route: targetRoute,
          params: params || {},
          crumbs: this.crumbs || [],
        },
      });
    },
    groupFields(records) {
      const result = {};
      if (records.length && this.groups.length) {
        const data = records.map((x) => {
          const item = {};
          this.groups.forEach((k) => {
            item[k.label] = x[k.key] || 0;
          });
          return item;
        });
        const group = {};
        data.forEach((x) => {
          for (const field in x) {
            if (Object.hasOwnProperty.call(x, field)) {
              const element = x[field];
              group[field] = (group[field] || 0) + (element || 0);
            }
          }
        });

        return group;
      }
      return result;
    },
    onClear() {},
    onSelectChange() {},
  },
};
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}
.fold {
  width: calc(100% - 216px);
  display: inline-block;
}
.operator {
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
