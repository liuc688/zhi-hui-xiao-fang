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
      <div style="width: 100%; padding: 5px 0px 10px; margin-top: -20px">
        <a-space>
          <a-dropdown-button
            @click="onAdd()"
            v-auth="`customer.add`"
            class="grli_button"
            >添加客户</a-dropdown-button
          >
          <a-dropdown-button @click="onForm()" class="grli_button"
            >设置表单</a-dropdown-button
          >
          <a-button class="grli_button" style="padding: 0 25px" @click="download"
            ><a-icon type="download" />导出</a-button
          >
        </a-space>
      </div>
      <a-table
        class="table"
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
          'page-size': 10,
        }"
      >
        <div slot="action" slot-scope="record">
          <a-dropdown>
            <a class="ant-dropdown-link"> 操作 <a-icon type="down" /> </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="onEdit(record)" v-auth="`customer.edit`">
                  <a-icon type="edit" />
                  编辑
                </a>
              </a-menu-item>
              <a-menu-item>
                <a @click="onDelete(record)" v-auth="`customer.delete`">
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
            <a-descriptions-item label="客户数量">
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
        <k-form-build
          :value="defaultJsonData"
          ref="defaultForm"
          :dynamicData="dynamicData"
          :config="config"
        />
        <k-form-build :value="jsonData" ref="form" :dynamicData="dynamicData" />
      </a-modal>
    </div>
  </a-card>
</template>

<script>
import { form_get } from "@/services/forms";
import Cookie from "js-cookie";

import {
  customer_add,
  customer_edit,
  customer_delete,
  customer_list,

} from "@/services/customer";
import {
  customer_export
} from "@/services/project";
import { table_form_get } from "@/services/table";
import { formSetData } from "@/utils/util";
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
      title: "添加客户",
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
      formId: "61a9d16f0f30e0da2ccd7c16",
      action: null,
      record: {},
    };
  },
  computed: {
    dynamicData() {
      let result = {};
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
      return {};
    },
    dataSource() {
      if (this.data.length) {
        const data = this.data.map((item) => {
          for (const key in item) {
            if (Object.hasOwnProperty.call(item, key)) {
              if (
                item[key] instanceof Array &&
                item[key].length &&
                !(item[key][0] instanceof Array) &&
                !(item[key][0] instanceof Object)
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
  authorize: {
    onAdd: "customer.add",
    onEdit: "customer.edit",
    onDelete: "customer.delete",
    onLoadList: "customer.list",
    onForm: "table.form.get",
  },
  created() {
    this.onLoad();
  },
  methods: {
    onLoad() {
      Promise.all([
        this.onLoadList(),
        table_form_get({
          parent: this.formId,
        }),
        form_get({
          name: "customer_add",
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
          this.columns = [
            {
              title: "客户名称",
              dataIndex: "title",
              ellipsis: true,
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
      return new Promise((resolve, reject) => {
        customer_list({
          ...this.searchform,
        })
          .then((response) => {
            this.data = response.data.data;
            this.loading = false;
            resolve(response);
          })
          .catch((error) => {
            this.loading = false;
            reject(error);
          });
      });
    },
    onAdd() {
      this.title = "添加客户";
      this.visible = true;
      this.record = {};
      this.action = customer_add;
      this.$nextTick(() => {
        this.$refs.defaultForm.reset();
        this.$refs.form.reset();
      });
    },
    onEdit(record) {
      this.title = "编辑客户";
      this.visible = true;
      this.record = record;
      this.action = customer_edit;
      this.$nextTick(() => {
        this.$refs.defaultForm.reset();
        this.$refs.form.reset();

        formSetData(this.$refs.defaultForm, record);
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
                parent: this.params.id,
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
          customer_delete({ ids: [record.id] })
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
        currRoute: "customert-list",
        targetRoute: "table-form",
      });
    },
    onSearch() {
      this.onLoadList();
    },
    onBack() {
      const last = this.crumbs.pop();
      console.log("last", last);

      this.$emit("event", {
        method: "onLink",
        params: {
          route: "project-paginate",
          params: last.params,
          crumbs: this.crumbs || [],
        },
      });
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
    download(){
      console.log('helloworld');
      customer_export({...this.searchform,})
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
