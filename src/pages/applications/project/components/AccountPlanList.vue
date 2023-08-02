<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-page-header @back="onBack">
        <span slot="title">
          <a @click="onBack" style="color:#000000;">返回</a>
        </span>
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
                  label="计划签约方"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-select
                    mode="multiple"
                    v-model="searchform.customer"
                    allowClear
                  >
                    <a-select-option v-for="item in customers" :key="item.id">
                      {{ item.title }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="7" :sm="24" offset="1">
                <a-form-item
                  label="计划签订日期"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-range-picker
                    v-model="searchform.start"
                    valueFormat="YYYY-MM-DD"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="7" :sm="24">
                <a-form-item
                  label="计划结束日期"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-range-picker
                    v-model="searchform.end"
                    valueFormat="YYYY-MM-DD"
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
      </a-page-header>
    </div>
    <div>
      <div style="width: 100%; padding: 5px 0px">
        <a-space>
          <a-dropdown-button @click="onAdd()" v-auth="`account.plan.add`">添加计划</a-dropdown-button>
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
        @change="onTableChange"
        :pagination="{
          'show-quick-jumper': true,
          'show-size-changer': true,
          'page-size-options': ['10', '20', '40', '50', '100',dataSource.length.toString()],
          'page-size': 10,
        }"
      >
        <span slot="nextmoney" slot-scope="record">
          <a-statistic
            :precision="2"
            :value="record.nextmoney"
            valueStyle="font-size: 14px;"
            prefix="￥"
          />
        </span>
        <span slot="invoicemoney" slot-scope="record">
          <a-statistic
            :precision="2"
            :value="record.invoicemoney"
            valueStyle="font-size: 14px;"
            prefix="￥"
            v-if="record.invoicemoney"
          />
          <template v-else>
            N/A
          </template>
        </span>
        <span slot="invoicetime" slot-scope="record">
          <template v-if="record.invoicetime && record.isinvoice == 1">{{
            record.invoicetime
          }}</template>
          <template v-else>
            N/A
          </template>
        </span>
        <span slot="ispayed" slot-scope="record">
          <a-switch v-model="record.ispayed" @change="onIsPayChange(record)" />
        </span>
        <span slot="isinvoice" slot-scope="record">
          <a-tag color="pink" v-if="!record.isinvoice">
            未开票
          </a-tag>
          <a-tag color="cyan" v-else-if="record.isinvoice === 1">
            已开票
          </a-tag>
          <a-tag color="orange" v-else>
            无发票
          </a-tag>
        </span>
        <div slot="action" slot-scope="record">
          <a-dropdown>
            <a class="ant-dropdown-link"> 操作 <a-icon type="down" /> </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="onEdit(record)" v-auth="`account.plan.edit`">
                  <a-icon type="edit" />
                  编辑
                </a>
              </a-menu-item>
              <a-menu-item>
                <a @click="onDelete(record)" v-auth="`account.plan.delete`">
                  <a-icon type="delete" />
                  删除
                </a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
        <template slot="footer" slot-scope="records">
          <a-descriptions :column="6" size="small">
            <a-descriptions-item label="合同总额">
              <a-statistic
                prefix="￥"
                :precision="2"
                :value="contract.money"
                :valueStyle="{
                  fontSize: '16px',
                }"
              />
            </a-descriptions-item>
            <a-descriptions-item label="计划总额">
              <a-statistic
                :precision="2"
                prefix="￥"
                :value="Sum(records, 'nextmoney')"
                :valueStyle="{
                  fontSize: '16px',
                }"
              />
            </a-descriptions-item>
            <a-descriptions-item label="剩余总额">
              <a-statistic
                :precision="2"
                prefix="￥"
                :value="contract.money - Sum(records, 'nextmoney')"
                :valueStyle="{
                  fontSize: '16px',
                }"
              />
            </a-descriptions-item>
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
        <a-alert type="info">
          <span slot="message">合同状态 : </span>
          <a-descriptions :column="3" size="small" slot="description">
            <a-descriptions-item label="合同金额">
              <a-statistic
                :precision="2"
                :value="contract.money"
                prefix="￥"
                :valueStyle="{
                  fontSize: '16px',
                }"
              />
            </a-descriptions-item>
            <a-descriptions-item label="剩余开票金额">
              <a-statistic
                :precision="2"
                :value="
                  contract.money - Sum(data, 'invoicemoney') - invoicemoney
                "
                prefix="￥"
                :valueStyle="{
                  fontSize: '16px',
                  color:
                    contract.money - Sum(data, 'invoicemoney') - invoicemoney >=
                    0
                      ? '#000000'
                      : 'red',
                }"
              />
            </a-descriptions-item>
            <a-descriptions-item label="剩余计划金额">
              <a-statistic
                :precision="2"
                :value="contract.money - Sum(data, 'nextmoney') - nextmoney"
                prefix="￥"
                :valueStyle="{
                  fontSize: '16px',
                  color:
                    contract.money - Sum(data, 'nextmoney') - nextmoney >= 0
                      ? '#000000'
                      : 'red',
                }"
              />
            </a-descriptions-item>
          </a-descriptions>
        </a-alert>
        <k-form-build
          :value="defaultJsonData"
          ref="defaultForm"
          :dynamicData="dynamicData"
          :config="config"
          @change="defaultFormChange"
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
  account_plan_add,
  account_plan_edit,
  account_plan_delete,
  account_plan_list,
  account_plan_pay,
} from "@/services/account";

import { contract_get } from "@/services/contract";

import { table_form_get } from "@/services/table";
import { formSetData, Sum } from "@/utils/util";
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
      title: "添加计划",
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
      customers: [],
      record: {},
      action: null,
      contract: {},
      nextmoney: 0,
      invoicemoney: 0,
    };
  },
  computed: {
    dynamicData() {
      let result = {
        customer: this.customers.map((item) => {
          return {
            key: item.id,
            value: item.id,
            title: item.title,
          };
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
    crumbParams() {
      return Object.assign(this.pagination, this.searchform, {
        parent: this.params.id,
      });
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
    onAdd:'account.plan.add',
    onEdit:'account.plan.edit',
    onDelete:'account.plan.delete',
  },
  filters: {
    moneySum(records) {
      var number = 0;
      records.forEach((item) => {
        number += item.money;
      });
      return number;
    },
  },
  created() {
    this.onLoad();
  },
  methods: {
    Sum,
    onLoad() {
      Promise.all([
        table_form_get({
          parent: this.params.id,
        }),
        form_get({
          name: "account_plan_add",
        }),
        contract_get({
          id: this.params.id,
        }),
        this.onLoadList(),
      ])
        .then((response) => {
          this.jsonData = response[0].data.data
            ? response[0].data.data.form
            : this.jsonData;
          this.fields = response[0].data.data
            ? response[0].data.data.fields
            : [];
          this.groups = response[0].data.data
            ? response[0].data.data.groups
            : [];
          this.defaultJsonData = response[1].data.data.form;
          this.contract = response[2].data.data;
          this.columns = [
            {
              title: "下期收付款金额",
              key: "nextmoney",
              sorter: true,
              ellipsis: true,
              scopedSlots: { customRender: "nextmoney" },
            },
            {
              title: "下期收付款时间",
              dataIndex: "nexttime",
              sorter: true,
              ellipsis: true,
            },
            {
              title: "开票金额",
              key: "invoicemoney",
              sorter: true,
              ellipsis: true,
              scopedSlots: { customRender: "invoicemoney" },
            },
            {
              title: "开票日期",
              key: "invoicetime",
              sorter: true,
              ellipsis: true,
              scopedSlots: { customRender: "invoicetime" },
            },
            {
              title: "是否开票",
              key: "isinvoice",
              ellipsis: true,
              scopedSlots: { customRender: "isinvoice" },
            },
            {
              title: "是否收/付款",
              key: "ispayed",
              ellipsis: true,
              scopedSlots: { customRender: "ispayed" },
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
                sorter: true,
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
        this.loading = true;
        account_plan_list({
          parent: this.params.id,
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
    onTableChange(pagination, filters, sorter) {
      if (sorter.order) {
        this.searchform.sort = sorter.columnKey;
        this.searchform.order_by = sorter.order == "descend" ? false : true;
      } else {
        this.searchform.sort = undefined;
        this.searchform.order_by = undefined;
      }
      this.onLoadList();
    },
    onAdd() {
      this.title = "添加计划";
      this.visible = true;
      this.nextmoney = 0;
      this.invoicemoney = 0;
      this.record = {};
      this.action = account_plan_add;
      this.$nextTick(() => {
        this.$refs.defaultForm.reset();
        this.$refs.form.reset();
      });
    },
    onEdit(record) {
      this.title = "编辑计划";
      this.visible = true;
      this.nextmoney = 0;
      this.invoicemoney = 0;
      this.record = record;
      this.action = account_plan_edit;
      this.$nextTick(() => {
        this.$refs.defaultForm.reset();
        this.$refs.form.reset();

        formSetData(this.$refs.defaultForm, record, {
          isinvoice: record.isinvoice.toString(),
        });
        formSetData(this.$refs.form, record);
      });
    },
    defaultFormChange(value, key) {
      switch (key) {
        case "nextmoney":
          console.log("value", value);
          this.nextmoney = value;
          break;
        case "invoicemoney":
          console.log("value", value);
          this.invoicemoney = value;
          break;
        default:
          break;
      }
    },
    onIsPayChange(record) {
      this.loading = true;
      account_plan_pay({
        id: record.id,
        ispayed: record.ispayed,
      })
        .then((response) => {
          this.$message.success(response.data.message);
          this.onLoadList();
        })
        .catch((error) => {
          console.log("error", error);
          this.$message.error(error.response.data.message);
          this.loading = false;
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
          account_plan_delete({ ids: [record.id] })
            .then((response) => {
              this.$message.success(response.data.message);
              this.loading = false;
              this.onLoad();
            })
            .catch(() => {
              this.loading = false;
              this.onLoad();
            });
        },
      });
    },
    onSearch() {
      this.onLoadList();
    },
    onBack() {
      const last = this.crumbs.pop();
      this.$emit("event", {
        method: "onLink",
        params: {
          route: last.route,
          params: last.params,
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
