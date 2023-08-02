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
                v-model="searchform.parent"
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
              label="标签(存在)"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-select
                allowClear
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
        <template v-if="show_hide">
        <a-row>
          <a-col :md="7" :sm="24">
            <a-form-item
              label="标签(包含)"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-select
                allowClear
                mode="multiple"
                v-model="searchform.atags"
                placeholder="请选择标签"
              >
                <a-select-option v-for="i in tags" :key="i">
                  {{ i }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="24" :offset="1">
            <a-form-item
              label="编号前缀"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-select
                allowClear
                mode="multiple"
                v-model="searchform.prefixs"
                placeholder="请选择编号前缀"
              >
                <a-select-option v-for="i in numbers.prefixs" :key="i">
                  {{ i }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="24" :offset="1">
            <a-form-item
              label="编号日期"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-select
                allowClear
                mode="multiple"
                v-model="searchform.years"
                placeholder="请选择编号日期"
              >
                <a-select-option v-for="i in numbers.years" :key="i">
                  {{ i }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        </template>
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
        <a @click="toggleshow_hide" style="margin-left: 8px">
          {{ show_hide ? "收起" : "展开" }}
          <a-icon :type="show_hide ? 'up' : 'down'" />
        </a>
      </span>
    </a-form>
    <div>
      <div style=" padding: 5px 0px 10px;margin-top: -20px;">
        <a-space >
          <a-dropdown-button @click="onAdd()" v-auth="`project.add`" class="grli_button"
            >添加项目</a-dropdown-button
          >
          <a-dropdown-button @click="onForm()" class="grli_button">设置表单</a-dropdown-button>
          <a-button class="grli_button" style="padding: 0 25px" @click="download"><a-icon type="download"/>导出</a-button>
        </a-space>
      </div>
      <a-table
        class="table"
        ref="table"
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
          'page-size-options': [
            '10',
            '20',
            '40',
            '50',
            '100',
            dataSource.length.toString(),
          ],
          'default-page-size': pagination.per_page,
          'default-current': pagination.page,
          'hide-on-single-page': true,
        }"
      >
        <span slot="number" slot-scope="record">
          <a-tag v-if="record.number.prefix">
            {{
              `${record.number.prefix}-${record.number.year}-${record.number.index}`
            }}
          </a-tag>
          <template v-else>
            N/A
          </template>
        </span>
        <a slot="lable" slot-scope="record" @click="onDetail(record)">
          <a-tooltip :title="record.title">
            {{ record.title }}
          </a-tooltip>
        </a>
        <span slot="parent" slot-scope="record">
          <template v-if="record.parent">
            {{ record.parent.title }}
          </template>
          <template v-else>
            N/A
          </template>
        </span>
        <span slot="tags" slot-scope="record">
          <template v-if="record.tags.length">
            <a-tooltip>
              <span slot="title">
                <a-tag color="blue" v-for="item in record.tags" :key="item">
                  {{ item }}
                </a-tag>
              </span>
              <a-tag color="blue" v-for="item in record.tags" :key="item">
                {{ item }}
              </a-tag>
            </a-tooltip>
          </template>
          <template v-else>N/A</template>
        </span>
        <span slot="contract" slot-scope="record">
          <template v-if="record.contract">
            <a-statistic
              :precision="0"
              prefix="￥"
              :value="record.contract.sum"
              :valueStyle="{
                fontSize: '16px',
              }"
            />
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
                <a @click="onContractList(record)">
                  <a-icon type="pic-left" />
                  查看合同
                </a>
              </a-menu-item>
              <a-menu-item>
                <a @click="onContractForm(record)">
                  <a-icon type="pic-left" />
                  设计表单
                </a>
              </a-menu-item>
              <a-menu-item>
                <a @click="onEdit(record)" v-auth="`project.edit`">
                  <a-icon type="edit" />
                  编辑
                </a>
              </a-menu-item>
              <a-menu-item>
                <a @click="onDelete(record)" v-auth="`project.delete`">
                  <a-icon type="edit" />
                  删除
                </a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
        <template slot="footer" slot-scope="records">
          <a-descriptions :column="3" size="small">
            <template v-for="(value, label) in groupFields(records)">
              <a-descriptions-item :label="label" :key="label">
                <a-statistic
                  :precision="2"
                  :value="value"
                  prefix="￥"
                  :valueStyle="{
                    fontSize: '16px',
                  }"
                />
              </a-descriptions-item>
            </template>
            <a-descriptions-item label="项目数量">
              <a-statistic
                :precision="0"
                :value="records.length"
                :valueStyle="{
                  fontSize: '16px',
                }"
              />
            </a-descriptions-item>
            <a-descriptions-item label="合同总额">
              <a-statistic
                :precision="0"
                prefix="￥"
                :value="
                  Sum(
                    records.map((x) => {
                      return x.contract ? x.contract.sum : 0;
                    })
                  )
                "
                :valueStyle="{
                  fontSize: '16px',
                }"
              />
            </a-descriptions-item>
          </a-descriptions>
        </template>
      </a-table>

      <a-modal
        v-model="visible"
        :title="title"
        :maskClosable="false"
        ok-text="确认"
        cancel-text="取消"
        @ok="onOk"
        centered
        width="80%"
        :confirmLoading="loading"
        :z-index="1002"
        @cancel="
          () => {
            this.$refs.form.reset();
            visible = false;
          }
        "
      >
        <a-tabs default-active-key="default" tabPosition="left">
          <a-tab-pane key="default" tab="基础表单">
            <k-form-build
              :value="defaultJsonData"
              ref="defaultForm"
              :dynamicData="dynamicData"
              :config="config"
            />
          </a-tab-pane>
          <a-tab-pane key="extend" tab="扩展表单" force-render>
            <k-form-build
              :value="jsonData"
              ref="form"
              :dynamicData="dynamicData"
              :config="config"
            />
          </a-tab-pane>
        </a-tabs>
      </a-modal>
    </div>
  </a-card>
</template>

<script>
import { form_get } from "@/services/forms";
import Cookie from "js-cookie";
import { Sum } from "@/utils/util";
import {
  project_add,
  project_edit,
  project_delete,
  project_list,
  project_export,
} from "@/services/project";

import { table_form_get } from "@/services/table";
import { organization_tree } from "@/services/organization";
import { formSetData, getCrumb } from "@/utils/util";

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
      show_hide:false,
      loading: false,
      advanced: false,
      visible: false,
      title: "添加项目",
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
      formId: "61a46f818035a66383cd29c8",
      action: null,
      record: {},
      organizations: [],
      tags: [],
      crumbParams: {},
      pagination: {
        page: 1,
        per_page: 10,
      },
      numbers: {
        prefixs: [],
        years: [],
      },
    };  
  },
  computed: {
    dynamicData() {
      let result = {
        organizations: this.organizations,
        tags: this.tags.map((x) => {
          return { key: x, label: x };
        }),
      };
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
                item[key] = item[key].join("  ");
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
  watch: {
    params: {
      handler(val) {
        this.crumbParams = {
          ...this.crumbParams,
          ...val,
        };
      },
      deep: true,
    },
    searchform: {
      handler(val) {
        this.crumbParams = {
          ...this.crumbParams,
          ...val,
        };
      },
      deep: true,
    },
    pagination: {
      handler(val) {
        this.crumbParams = {
          ...this.crumbParams,
          ...val,
        };
      },
      deep: true,
    },
  },
  authorize: {
    onAdd: "project.add",
    onLoadList: "project.list",
    onEdit: "project.edit",
    onDelete: "project.delete",
    onForm: "table.form.get",
    onContractForm: "table.form.get",
    onContractList: "contract.list",
  },
  created() {
    this.onLoad();
  },
  methods: {
    Sum,
    onLoad() {
      this.loading = true;
      const searchform = getCrumb(this.params, [
        "keyword",
        "parent",
        "tags",
        "atags",
      ]);

      this.searchform = Object.assign({}, searchform);
      Promise.all([
        this.onLoadList(),
        table_form_get({
          parent: this.formId,
        }),
        form_get({
          name: "project_add",
        }),
        organization_tree(),
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
          this.columns = [
            {
              title: "项目编号",
              width: 160,
              scopedSlots: { customRender: "number" },
            },
            {
              title: "项目名称",
              ellipsis: true,
              scopedSlots: { customRender: "lable" },
            },
            {
              title: "所属组织",
              ellipsis: true,
              scopedSlots: { customRender: "parent" },
            },
            {
              title: "标签",
              ellipsis: true,
              key: "tags",
              scopedSlots: { customRender: "tags" },
            },
            {
              title: "合同金额",
              ellipsis: true,
              key: "contract",
              scopedSlots: { customRender: "contract" },
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
          this.loading = false;
        });
    },
    onLoadList() {
      this.loading = true;

      return new Promise((resolve, reject) => {
        project_list({
          ...this.searchform,
        })
          .then((response) => {
            this.data = response.data.data;
            this.tags = response.data.tags;
            this.numbers = response.data.numbers;
            this.loading = false;
            resolve(response);
          })
          .catch((error) => {
            this.loading = false;
            reject(error);
          });
      });
    },
    onDetail(record) {
      this.onLink({
        params: {
          record: record,
          extend: {
            jsonData: this.jsonData,
            config: this.config,
            dynamicData: this.dynamicData,
          },
        },
        currRoute: "project-list",
        targetRoute: "project-detail",
      });
    },
    onAdd() {
      this.title = "添加项目";
      this.visible = true;
      this.record = {};
      this.action = project_add;
      this.$nextTick(() => {
        this.$refs.defaultForm.reset();
        this.$refs.form.reset();
      });
    },
    onEdit(record) {
      this.title = "编辑项目";
      this.visible = true;
      this.record = record;
      this.action = project_edit;
      this.$nextTick(() => {
        this.$refs.defaultForm.reset();
        this.$refs.form.reset();
        console.log('record',record);
        
        formSetData(this.$refs.defaultForm, record, {
          parent: record.parent ? record.parent.id : undefined,
          'number.prefix':record.number.prefix,
          'number.year':record.number.year,
          'number.index':record.number.index
        });
        formSetData(this.$refs.form, record);
      });
    },
    onOk() {
      this.loading = true;
      const PromiseList = [this.$refs.defaultForm.getData()];
      if (this.jsonData.list.length) {
        PromiseList.push(this.$refs.form.getData());
      }
      Promise.all(PromiseList)
        .then((formDatas) => {
          let fields = {};
          let formData = {};
          formDatas.forEach((item, index) => {
            if (index != 0) {
              fields = {
                ...fields,
                ...item,
              };
            } else {
              formData = {
                ...item,
                id: this.record.id,
              };
            }
          });

          this.action({
            ...formData,
            fields: fields,
          })
            .then((response) => {
              this.$message.success(response.data.message);
              this.loading = false;
              this.visible = false;
              this.onLoad();
            })
            .catch((error) => {
              console.log("error", error);
              this.loading = false;
              this.$message.error(error.response.data.message);
            });
        })
        .catch((error) => {
          console.log("error", error);
          this.loading = false;
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
          project_delete({ ids: [record.id] })
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
        currRoute: "project-list",
        targetRoute: "table-form",
      });
    },
    onContractList(record) {
      this.onLink({
        params: record,
        currRoute: "project-list",
        targetRoute: "contract-list",
      });
    },
    onContractForm(record) {
      this.onLink({
        params: record,
        currRoute: "project-list",
        targetRoute: "table-form",
      });
    },
    onSearch() {
      this.onLoadList();
    },

    onLink({ params, currRoute, targetRoute }) {
      console.log("this.$refs.table.pagination", this.$refs.table.pagination);

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
    toggleshow_hide() {
      this.show_hide = !this.show_hide;
    },
    download(){
      console.log('helloworld');
      project_export({...this.searchform,})
        .then((res) => {
           var name = res.data.data.title;
          const a = document.createElement("a");
          var bstr = atob(res.data.data.data),
            n = bstr.length,
            u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const blob = new Blob([u8arr], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          a.download = name;
          a.href = window.URL.createObjectURL(blob);
          a.click();
          this.$message.success("操作成功！");
          this.onLoadList();
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    }
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
<style>
/* .grli_button {
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}
.table .ant-table-tbody tr:nth-child(2n+1) {
  background-color: rgba(0, 0, 0, 0.12);
} */
</style>
