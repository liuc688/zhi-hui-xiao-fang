<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-page-header
        @back="onBack"
      >
      <span slot="title">
        <a @click="onBack" style="color:#000000;">返回</a>
      </span>
      <a-form layout="horizontal" :model="searchform" ref="searchform">
        <div :class="advanced ? null : 'fold'">
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
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px">
          <a-button type="primary" @click="onSearch" :loading="loading"
            >查询</a-button
          >
          <a-button style="margin-left: 8px" @click="()=>{
              searchform = {};
              onLoad();
            }">重置</a-button>
        </span>
      </a-form>
      </a-page-header>
    </div>
    <div>
      <div style="width: 100%; padding: 5px 0px">
        <a-space>
          <a-dropdown-button @click="onAddTask()">发起协同请求</a-dropdown-button></a-dropdown-button>
          <a-button-group
            ><a-button
              :disabled="selectedRows.length ? false : true"
              @click="onDelete"
              >删除</a-button
            ></a-button-group
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
        @selectedRowChange="onSelectChange"
        :pagination="false"
      >
        <div slot="_title" slot-scope="{ record }">
          <a @click="onSee(record)">{{ record.title }}</a>
        </div>
        <div slot="organization" slot-scope="{ record }">
          {{record.organization.title}}
        </div>
        <div slot="hander" slot-scope="{ record }">
          <span v-if="record.hander">
            {{ record.hander.realname }}
          </span>
          <span v-else style="color: #ccc"> N/A </span>
        </div>
        <div slot="accept" slot-scope="{ text, record }">
          <template v-if="record.accept === undefined">
            <span style="color: #faad14">
              <a-icon type="inbox" />
              未处理
            </span>
          </template>
          <template v-else>
            <span v-if="record.accept" style="color: #40a9ff">
              <a-icon type="select" />
              已接受
            </span>
            <span v-else style="color: #ff7575">
              <a-icon type="import" />
              已退回
            </span>
          </template>
        </div>
        <div slot="action" slot-scope="{ text, record }">
          <a @click="onSee(record)">
            <a-icon type="eye" />
            查看
          </a>
           <a-divider type="vertical" />
          <a @click="onDelete(record)">
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
import {
  riskrequest_paginate,
  riskrequest_delete,
  riskrequest_add,
} from "@/services/riskrequest";
import { organization_tree } from "@/services/organization";

import StandardTable from "@/components/table/StandardTable";
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
    crumbs: {
      type: Array,
    },
  },
  data() {
    return {
      loading: false,
      advanced: false,
      visible: false,
      columns: [
        {
          title: "标题",
          scopedSlots: { customRender: "_title" },
        },
        {
          title: "涉及行业",
          scopedSlots: { customRender: "organization" },
        },
        {
          title: "处置人",
          scopedSlots: { customRender: "hander" },
        },
        {
          title: "是否处理",
          scopedSlots: { customRender: "accept" },
        },
        {
          title: "操作",
          width: "160px",
          scopedSlots: { customRender: "action" },
        },
      ],
      id: null,
      organization: [],
      title: null,
      jsonData: {},
      data: {},
      searchform: {},
      selectedRows: [],
    };
  },
  computed: {
    dynamicData() {
      let result = {
        organization: this.organization,
      };
      return result;
    },
    pagination: {
      get() {
        return {
          page: this.data.page || this.params.page || 1,
          per_page: this.data.per_page || this.params.per_page || 10,
        };
      },
      set(val) {
        this.data.page = val.page;
        this.data.per_page = val.per_page;
      },
    },
    userinfo() {
      return this.$store.getters["account/user"];
    },
    crumbParams() {
      return Object.assign(this.pagination, this.searchform, {
        requester: this.userinfo.id,
      });
    },
  },
  authorize: {},
  created() {
    this.onLoad();
  },
  methods: {
    onLoad() {
      this.loading = true;

      if (
        this.params &&
        typeof this.params == "object" &&
        Object.keys(this.params).length
      ) {
        const searchform = Object.assign({}, this.params);
        delete searchform["page"];
        delete searchform["per_page"];
        delete searchform["id"];
        this.searchform = searchform;
      }

      this.paginate();

      Promise.all([
        form_get({
          name: "risk_request",
        }),
        organization_tree(),
      ])
        .then((response) => {
          this.jsonData = response[0].data.data.form;
          this.organization = response[1].data.data;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    paginate() {
      this.loading = true;

      riskrequest_paginate(this.crumbParams)
        .then((response) => {
          this.data = response.data.data;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },
    onSee(record) {
      this.$emit("event", {
        method: "onOpen",
        params: {
          name: "riskrequestdetail",
          height: "80%",
          width: "80%",
          title: "网络舆情协同处置平台",
          type: "system",
          router: "RiskRequestDetail",
          data: {
            id: record.id,
            self: true,
          },
        },
      });
    },
    onAddTask() {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.form.reset();
      });
    },
    onOk() {
      this.loading = true;
      this.$refs.form
        .getData()
        .then((formData) => {
          const params = Object.assign(formData, {
            parent: this.params.id,
          });
          riskrequest_add(params)
            .then((response) => {
              this.$message.success(response.data.message);
              this.onLoad();
              this.visible = false;
              this.loading = false;
            })
            .catch((error) => {
              console.log("error", error);
              this.loading = false;
            });
        })
        .catch((error) => {
          console.log("error", error);
          this.loading = false;
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
      this.$confirm({
        title: "确定要执行删除吗?",
        content: "该操作不可逆 !请谨慎操作 !",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          riskrequest_delete({
            id: ids,
          })
            .then((response) => {
              this.$message.success(response.data.message);
              this.onLoad();
            })
            .catch((error) => {
              this.$message.success(error.data.message);
              this.onLoad();
            });
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    onSearch() {
      this.pagination.page = 1;
      this.paginate();
    },
    onBack() {
      const last = this.crumbs.pop();
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "risk-list",
          params: last.params,
          crumbs: this.crumbs || [],
        },
      });
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
