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
              label="合同签约方"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-select
                mode="multiple"
                v-model="searchform.customer"
                allowClear
                showSearch
                :filterOption="onFilterOption"
              >
                <a-select-option v-for="item in customers" :key="item.id">
                  {{ item.title }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="24" offset="1">
            <a-form-item
              label="合同签订"
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

        <template v-if="show_hide">
          <a-row>
            <a-col :md="7" :sm="24">
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
            <a-col :md="7" :sm="24" :offset="1">
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
          </a-row>
          <a-row>
            <a-col :md="7" :sm="24">
              <a-form-item
                label="合同结束"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-range-picker
                  v-model="searchform.end"
                  valueFormat="YYYY-MM-DD"
                />
              </a-form-item>
            </a-col>
            <a-col :md="7" :sm="24" :offset="1">
              <a-form-item
                label="计划收款"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-range-picker
                  v-model="searchform.nexttime"
                  valueFormat="YYYY-MM-DD"
                />
              </a-form-item>
            </a-col>

            <a-col :md="7" :sm="24" :offset="1">
              <a-form-item
                label="收/付款合同"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-switch
                  checked-children="付款"
                  un-checked-children="收款"
                  v-model="searchform.ispay"
                />
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
      <div style="width: 100%; padding: 0px 0px 10px; margin-top: -20px">
        <a-space>
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
        :scroll="{ x: 1500 }"
        @change="onTableChange"
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
        <a slot="parent" slot-scope="record">{{ record.parent.title }}</a>
        <a slot="contract" slot-scope="record">{{ record.title }}</a>
        <span slot="customer" slot-scope="record">{{
          record.customer ? record.customer.title : "N/A"
        }}</span>
        <span slot="money" slot-scope="record">
          <a-statistic
            :precision="2"
            :value="record.money"
            valueStyle="font-size: 14px;"
            prefix="￥"
          />
        </span>
        <span slot="nextmoneys" slot-scope="record">
          <a-statistic
            :precision="2"
            :value="record.nextmoneys"
            valueStyle="font-size: 14px;"
            prefix="￥"
          />
        </span>
        <span slot="payed" slot-scope="record">
          <a-statistic
            :precision="2"
            :value="
              record.plans.length > 1
                ? record.plans[1].money
                : record.plans[0].id
                ? record.plans[0].money
                : 0
            "
            valueStyle="font-size: 14px;"
            prefix="￥"
          />
        </span>
        <span slot="isinvoices" slot-scope="record">
          <a-statistic
            :precision="2"
            :value="record.isinvoices"
            valueStyle="font-size: 14px;"
            prefix="￥"
          />
        </span>

        <span slot="waitmoney" slot-scope="record">
          <a-statistic
            :precision="2"
            :value="
              record.plans.length > 1
                ? record.money - record.plans[1].money
                : record.plans[0].id
                ? record.money - record.plans[0].money
                : record.money
            "
            valueStyle="font-size: 14px;"
            prefix="￥"
          />
        </span>
        <span slot="nexttime" slot-scope="record">
          {{ record.plans[0].nexttime }}
        </span>
        <span slot="nextmoney" slot-scope="record">
          <a-statistic
            :precision="2"
            :value="
              record.plans.length > 1
                ? record.plans[0].nextmoney
                : record.plans[0].id
                ? 0
                : record.plans[0].nextmoney
            "
            valueStyle="font-size: 14px;"
            prefix="￥"
          />
        </span>
        <span slot="speed" slot-scope="record">
          <a-progress
            :percent="
              Math.round(
                (record.plans.length > 1
                  ? record.plans[1].money / record.money
                  : record.plans[0].id
                  ? record.plans[0].money / record.money
                  : 0) * 100
              )
            "
            size="small"
            status="active"
          />
        </span>
        <span slot="isinvoices" slot-scope="record">
          <a-statistic
            :precision="2"
            :value="record.isinvoices"
            valueStyle="font-size: 14px;"
            prefix="￥"
          />
        </span>
        <div slot="action" slot-scope="record">
          <a-dropdown>
            <a class="ant-dropdown-link"> 操作 <a-icon type="down" /> </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="onPlan(record)">
                  <a-icon type="snippets" />
                  设置计划
                </a>
              </a-menu-item>
              <a-menu-item>
                <a @click="onForm(record)">
                  <a-icon type="pic-left" />
                  设置表单
                </a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
        <template slot="footer" slot-scope="records">
          <a-descriptions :column="4" size="small">
            <a-descriptions-item label="合同总额">
              <a-statistic
                prefix="￥"
                :precision="2"
                :value="Sum(records, 'money')"
                :valueStyle="{
                  fontSize: '16px',
                }"
              />
            </a-descriptions-item>
            <a-descriptions-item label="计划总额">
              <a-statistic
                prefix="￥"
                :precision="2"
                :value="Sum(records, 'nextmoneys')"
                :valueStyle="{
                  fontSize: '16px',
                }"
              />
            </a-descriptions-item>
            <a-descriptions-item label="待收/付总额">
              <a-statistic
                prefix="￥"
                :precision="2"
                :value="
                  Sum(
                    records.map((x) => {
                      if (x.plans.length > 1) {
                        return x.money - x.plans[1].money;
                      } else {
                        return x.plans[0].id
                          ? x.money - x.plans[0].money
                          : x.money;
                      }
                    })
                  )
                "
                :valueStyle="{
                  fontSize: '16px',
                }"
              />
            </a-descriptions-item>
            <a-descriptions-item label="已收/付总额">
              <a-statistic
                prefix="￥"
                :precision="2"
                :value="
                  Sum(
                    records.map((x) => {
                      if (x.plans.length > 1) {
                        return x.plans[1].money;
                      } else {
                        return x.plans[0].id ? x.plans[0].money : 0;
                      }
                    })
                  )
                "
                :valueStyle="{
                  fontSize: '16px',
                }"
              />
            </a-descriptions-item>
            <a-descriptions-item label="已开票总额">
              <a-statistic
                prefix="￥"
                :precision="2"
                :value="Sum(records, 'isinvoices')"
                :valueStyle="{
                  fontSize: '16px',
                }"
              />
            </a-descriptions-item>
            <a-descriptions-item label="下期收/付总额">
              <a-statistic
                prefix="￥"
                :precision="2"
                :value="
                  Sum(
                    records.map((x) => {
                      if (x.plans.length > 1) {
                        return x.plans[0].nextmoney;
                      } else {
                        return x.plans[0].id ? 0 : x.plans[0].nextmoney;
                      }
                    })
                  )
                "
                :valueStyle="{
                  fontSize: '16px',
                }"
              />
            </a-descriptions-item>
          </a-descriptions>
          <span
            style="
              font-size: 14px;
              line-height: 1.5;
              font-weight: bold;
              margin-left: 10px;
            "
            >总进度 ：
          </span>
          <a-progress
            style="width: 90%"
            :percent="
              Math.round(
                (Sum(
                  records.map((x) => {
                    if (x.plans.length > 1) {
                      return x.plans[1].money;
                    } else {
                      return x.plans[0].id ? x.plans[0].money : 0;
                    }
                  })
                ) /
                  Sum(records, 'money')) *
                  100
              )
            "
            size="small"
            status="active"
          />
        </template>
      </a-table>
    </div>
  </a-card>
</template>

<script>
import { account_list } from "@/services/account";
import { customer_list } from "@/services/customer";
import { Sum, getCrumb } from "@/utils/util";
import { organization_tree } from "@/services/organization";
import {
  account_export,
} from "@/services/project";

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
      show_hide: false,
      loading: false,
      advanced: false,
      columns: [
        {
          title: "项目名称",
          width: 200,
          scopedSlots: { customRender: "parent" },
        },
        {
          title: "合同名称",
          width: 200,
          scopedSlots: { customRender: "contract" },
        },
        {
          title: "合同签约方",
          width: 200,
          scopedSlots: { customRender: "customer" },
        },
        {
          title: "合同金额",
          key: "money",
          sorter: true,
          width: 200,
          scopedSlots: { customRender: "money" },
        },
        {
          title: "计划金额",
          key: "nextmoneys",
          sorter: true,
          width: 200,
          scopedSlots: { customRender: "nextmoneys" },
        },
        {
          title: "待收/付款金额",
          width: 200,
          scopedSlots: { customRender: "waitmoney" },
        },
        {
          title: "已收/付款金额",
          width: 200,
          scopedSlots: { customRender: "payed" },
        },
        {
          title: "开票金额",
          width: 200,
          scopedSlots: { customRender: "isinvoices" },
        },
        {
          title: "进度",
          width: 160,
          scopedSlots: { customRender: "speed" },
        },
        {
          title: "已开票金额",
          ellipsis: true,
          key: "isinvoices",
          scopedSlots: { customRender: "isinvoices" },
        },
        {
          title: "下期收/付款金额",
          width: 200,
          scopedSlots: { customRender: "nextmoney" },
        },
        {
          title: "下期收/付款日期",
          width: 200,
          scopedSlots: { customRender: "nexttime" },
        },
        {
          title: "操作",
          width: 80,
          fixed: "right",
          scopedSlots: { customRender: "action" },
        },
      ],
      data: [],
      tags: [],
      searchform: {
        ispay: false,
      },
      selectedRows: [],
      fields: [],
      groups: [],
      customers: [],
      record: {},
      organizations: [],
      crumbParams: {},
    };
  },
  computed: {
    dynamicData() {
      let result = {};
      return result;
    },

    dataSource() {
      if (this.data.length) {
        console.log("dataSource", this.data);
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
  },
  authorize: {
    onLoadList: "account.list",
    onPlan: "account.plan.list",
    onForm: "table.form.get",
  },
  created() {
    this.onLoad();
  },
  methods: {
    Sum,
    onLoad() {
      const searchform = getCrumb(this.params, [
        "keyword",
        "parent",
        "tags",
        "atags",
        "customer",
        "start",
        "end",
        "nexttime",
        "ispay",
      ]);

      this.searchform = Object.assign({}, searchform);
      Promise.all([this.onLoadList(), customer_list(), organization_tree()])
        .then((response) => {
          this.customers = response[1].data.data;
          this.organizations = response[2].data.data;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    onLoadList() {
      return new Promise((resolve, reject) => {
        account_list({
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
    onPlan(record) {
      this.onLink({
        params: record,
        currRoute: "account-list",
        targetRoute: "account-plan-list",
      });
    },
    onForm(record) {
      this.onLink({
        params: {
          id: record.id,
        },
        currRoute: "account-list",
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

    onClear() {},
    onFilterOption(e, o) {
      const entity = this.customers.find((x) => x.id == o.key);

      if (entity) {
        if (entity.title.indexOf(e) !== -1) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
      // this.customers = this.customers.filter((item) => {
      //   console.log('item.title.indexOf(e) !== -1',item.title.indexOf(e) !== -1);

      //   return item.title.indexOf(e) !== -1;
      // });
    },
    toggleshow_hide() {
      this.show_hide = !this.show_hide;
    },
    download(){
      console.log('helloworld');
      account_export({...this.searchform,})
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
