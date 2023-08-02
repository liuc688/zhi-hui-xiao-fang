<template>
  <a-card>
    <div>
      <a-page-header>
        <a-form layout="horizontal" :model="searchform" ref="searchform">
          <div :class="'fold'">
            <a-row>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="关键字"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-input placeholder="请输入" v-model="searchform.keyword" allowClear/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="行业分类"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-tree-select
                    show-search
                    allowClear
                    :treeData="organization"
                    :replaceFields="{
                      key: 'id',
                      value: 'id',
                    }"
                    v-model="searchform.organization"
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                    placeholder="请选择行业分类"
                    allow-clear
                    multiple
                    tree-default-expand-all
                  ></a-tree-select>
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
      <a-alert message="下期预告" type="success" closable>
        <a slot="closeText">关闭</a>
        <div slot="description">
          <a> {{ forecast.title }} </a>
          <p>发布时间：{{ forecast._createtime }}</p>
        </div>
      </a-alert>
      <div style="width: 100%; padding: 5px 0px">
        <a-dropdown-button @click="onAdd()">
          创建报告
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="onAddForecast"> 添加预告 </a-menu-item>
          </a-menu>
        </a-dropdown-button>
      </div>
      <standard-table
        :loading="loading"
        :columns="columns"
        :dataSource="data.items"
        :selectedRows.sync="selectedRows"
        @clear="onClear"
        :rowKey="'id'"
        @selectedRowChange="onSelectChange"
        :pagination="false"
      >
        <div slot="_title" slot-scope="{ record }">
          <a @click="onClick(record)">{{ record.title }}</a>
        </div>

        <div slot="action" slot-scope="{ text, record }">
          <a @click="onClick(record)">
            <a-icon type="eye" />
            查看
          </a>
          <a-divider type="vertical" />
          <a @click="onEdit(record)">
            <a-icon type="edit" />
            编辑
          </a>
          <a-divider type="vertical" />
          <a @click="onDelete(record.id)">
            <a-icon type="delete" />
            删除
          </a>
        </div>
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
        v-model="visible"
        :title="title"
        :maskClosable="false"
        ok-text="确认"
        cancel-text="取消"
        @ok="onOk"
        centered
        width="45%"
        :confirmLoading="loading"
        :z-index="1002"
        @cancel="
          () => {
            this.$refs.form.reset();
            visible = false;
          }
        "
      >
        <k-form-build :value="jsonData" ref="form" :dynamicData="dynamicData" />
      </a-modal>
    </div>
  </a-card>
</template>

<script>
import { form_get } from "@/services/forms";
import { organization_tree } from "@/services/organization";
import {
  report_paginate,
  report_delete,
  forecast_add,
  forecast_get,
} from "@/services/report";

import StandardTable from "@/components/table/StandardTable";
export default {
  components: {
    StandardTable,
  },
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
      loading: false,
      visible: false,
      avatar: require("@/assets/images/empty.png"),
      title: null,
      jsonData: {},
      data: {
        page: 1,
        per_page: 10,
      },
      forecast: {},
      organization: [],
      searchform: {},
      selectedRows: [],
      columns: [
        {
          title: "标题",
          scopedSlots: { customRender: "_title" },
        },
        {
          title: "摘要",
          dataIndex: "summary",
          ellipsis: true,
        },
        {
          title: "操作",
          width: 300,
          scopedSlots: { customRender: "action" },
        },
      ],
    };
  },
  computed: {
    userinfo() {
      return this.$store.getters["account/user"];
    },
    dynamicData() {
      let result = {
        organization: this.organization,
      };

      return result;
    },
    currOrganization() {
      let organization = this.userinfo.organization;
      if (this.searchform.organization && this.searchform.organization.length) {
        organization = this.searchform.organization;
      }
      return organization;
    },
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
  },
  authorize: {},
  created() {
    this.onLoad();
  },
  methods: {
    onLoad() {
      this.paginate();
      Promise.all([
        organization_tree(),
        forecast_get({
          organization: this.currOrganization,
        }),
        form_get({
          name: "forecast_add",
        }),
      ])
        .then((response) => {
          this.organization = response[0].data.data;
          this.forecast = response[1].data.data;
          this.jsonData = response[2].data.data.form;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    paginate() {
      this.loading = true;
      const params = Object.assign(
        Object.assign(this.pagination, this.searchform),
        {
          organization: this.currOrganization,
        }
      );

      report_paginate(params)
        .then((response) => {
          this.data = response.data.data;
          this.loading = false;
        })
        .catch((error) => {
          this.$message.error(error.data.message);
          this.loading = false;
        });
    },

    onClick(record) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "report-detail",
          params: record || {},
        },
      });
    },
    onAddForecast() {
      this.visible = true;
    },
    onOk() {
      this.loading = true;
      this.$refs.form.getData().then((formData) => {
        forecast_add(formData)
          .then((response) => {
            this.$message.success(response.data.message);
            this.loading = false;
            this.visible = false;
            this.onLoad();
          })
          .catch((error) => {
            this.$message.error(error);
            this.loading = false;
          });
      });
    },
    onAdd() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "report-editor",
          params: {},
        },
      });
    },
    onEdit(record) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "report-editor",
          params: record || {},
        },
      });
    },
    onDelete(record) {
      let ids = [];
      if (record.id) {
        //单选
        ids.push(record.id);
      } else {
        //多选
        ids = this.selectedRows.map((item) => {
          return item.id;
        });
      }
      report_delete({
        id: ids,
      })
        .then((response) => {
          this.$message.success(response.data.message);
          this.onLoad();
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    onSearch() {
      this.paginate();
    },
    onClear() {},
    onSelectChange() {},
    onChangePage(page, pageSize) {
      this.loading = true;
      this.pagination.page = page;
      this.pagination.per_page = pageSize;
      this.paginate();
    },
  },
};
</script>

<style lang="less" scoped>
.avatar {
  width: 140px;
  height: 140px;
  border-radius: 5%;
}

.card-grid {
  width: 350px;
  cursor: pointer;
}

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