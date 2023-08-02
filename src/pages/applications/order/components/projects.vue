<template>
  <div style="background: #f1f1f1">
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-row style="padding: 10px 0px">
        <!-- <a-col :span="8">
          <a-input
            placeholder="查询项目"
            style="width: 95%"
            allowClear
            v-model="searchproject"
            @change="selectobjects(searchproject)"
          />
        </a-col> -->
        <a-form-model layout="horizontal" :model="searchform" ref="searchform">
          <a-row :gutter="24">
            <a-col :md="8" :sm="24">
              <a-form-model-item
                label="关键词"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-model="searchform.keyword"
                  placeholder="请输入关键词"
                  allowClear
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24" style="margin-top: 4px; padding-left: 5%">
              <span>
                <a-button type="primary" @click="searchQuery" icon="search"
                  >查询</a-button
                >
                <a-button
                  type="primary"
                  @click="searchReset"
                  icon="reload"
                  style="margin-left: 8px"
                  >重置</a-button
                >
                <!-- <a @click="handleToggleSearch" style="margin-left: 8px">
                      {{ toggleSearchStatus ? "收起" : "展开" }}
                      <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
                    </a> -->
              </span>
            </a-col>
          </a-row>
        </a-form-model>
        <a-col :span="12" style="text-align: left">
          <a-button
            type="primary"
            @click="addOrder()"
            v-auth="`project.insert`"
          >
            <a-icon type="plus" />
            <span>项目创建</span>
          </a-button>
        </a-col>
      </a-row>
      <div class="alert">
        <a-alert type="info" :show-icon="true">
          <div class="message" slot="message">
            已选择&nbsp;
            <a>{{ selectedRowKeys.length }}</a>
            &nbsp;项
            <div class="clear" v-if="this.selectedRowKeys.length > 0">
              <a @click="onSelectClear">清空选中</a>
            </div>
          </div>
        </a-alert>
      </div>
      <!-- 表格 -->
      <a-table
        ref="table"
        bordered
        class="table_content"
        size="middle"
        :loading="searchloading"
        :pagination="false"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource.items"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="addOrder(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="你确定要删除此标签吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="confirmOk(record)"
            @cancel="cancel"
            v-auth="`project.del`"
          >
            <a>移除</a>
          </a-popconfirm>
          <!-- <a-divider type="vertical" />
          <a @click="addOrder(record, 2)">详情</a> -->
        </span>
      </a-table>
      <a-pagination
        size="small"
        style="text-align: right"
        @change="changepage"
        :current="pagination.page"
        :pageSize="pagination.per_page"
        @showSizeChange="changepage"
        :pageSizeOptions="pageSizeOptions"
        :total="dataSource.total"
        show-size-changer
        show-quick-jumper
        :show-total="(total) => `共 ${total} 条`"
      ></a-pagination>
    </a-card>
    <a-modal
      title="项目增编"
      width="50%"
      :confirm-loading="subloading"
      :visible="orderedit"
      :maskClosable="false"
      @ok="onEditSubmit()"
      @cancel="
        () => {
          orderedit = false;
          $refs.form_get.reset();
        }
      "
    >
      <k-form-build
        :value="jsonData"
        ref="form_get"
        :dynamicData="dynamicData"
      />
    </a-modal>
  </div>
</template>
<script>
import {
  projectdel,
  application_list,
  form_get,
  projectinsert,
  projectsave,
  projectpaginate,
} from "@/services/order";
import { project_list } from "@/services/project";
export default {
  data() {
    return {
      pageSizeOptions: ["10", "20", "30", "40"],
      dataSource: {},
      searchform: {},
      selectedRowKeys: [], //选中数组
      searchloading: true, //表格加载
      subloading: false, //提交按钮加载
      orderedit: false,
      jsonData: {},
      columns: [
        {
          title: "项目名称",
          dataIndex: "title",
          align: "title",
          scopedSlots: { customRender: "color" },
        },
        {
          title: "排序权重",
          align: "center",
          dataIndex: "weight",
          scopedSlots: { customRender: "weight" },
        },
        {
          title: "创建时间",
          align: "center",
          dataIndex: "_createtime",
          scopedSlots: { customRender: "_createtime" },
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
      projectId: "",
      resource: "",
      searchproject: "",
    };
  },
  computed: {
    pagination: {
      get() {
        return {
          page: this.dataSource.page || 1,
          per_page: this.dataSource.per_page || 10,
        };
      },
      set(val) {
        this.dataSource.page = val.page;
        this.dataSource.per_page = val.per_page;
      },
    },
    userinfo() {
      // return this.$store.getters["account/user"];
      return this.application_list();
    },
    dynamicData() {
      let result = {};
      return result;
    },
  },
  created() {
    this.list();
  },
  authorize: {
    addOrder: "project.insert",
    confirmOk: "project.del",
  },
  methods: {
    // 查询
    searchQuery() {
      this.searchform.page = 1;
      this.searchform.per_page = 10;
      this.list();
    },
    // 重置
    searchReset() {
      this.searchform = {};
      this.list();
    },
    projectpaginate() {
      project_list(this.searchform)
        .then((res) => {
          this.dataSource = res.data.data;
          // this.dataSource = this.dataSources;
          // this.total = res[0].data.data.total || res[0].data.data.length;
          this.searchloading = false;
        })
        .catch((err) => {
          this.searchloading = false;
          console.log(err);
        });
    },
    // 页面获取
    list() {
      Promise.all([
        application_list(),
        form_get({ name: "project_addendum" }),
      ]).then((res) => {
        this.application_list = res[0].data.data;
        this.jsonData = res[1].data.data.form;

        this.projectpaginate();
      });
    },
    // selectobjects(e) {
    //   this.searchloading = true;
    //   this.dataSource = this.dataSources.filter((item) => {
    //     return item.title.indexOf(e) !== -1;
    //   });
    //   this.searchloading = false;
    // },
    // 移除
    confirmOk(record) {
      this.searchloading = true;
      projectdel({
        id: record.id,
        source: this.resource,
      })
        .then(() => {
          this.list();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    cancel() {},
    addOrder(record) {
      this.orderedit = true;
      if (record) {
        this.projectId = record.id;
        this.methods = projectsave;
        var that = this;
        this.$nextTick(() => {
          that.$refs.form_get.setData({
            title: record.title,
            weight: record.weight,
            content: record.content,
          });
        });
      } else {
        this.projectId = "";
        this.methods = projectinsert;
      }
    },
    // 提交
    onEditSubmit() {
      this.$refs.form_get
        .getData()
        .then((res) => {
          this.subloading = true;
          this.methods({
            id: this.projectId,
            title: res.title,
            weight: res.weight ? res.weight : 0,
            content: res.content,
            source: [this.resource],
          })
            .then(() => {
              this.orderedit = false;
              this.searchloading = true;
              this.subloading = false;
              this.$refs.form_get.reset();
              this.list();
            })
            .catch(() => {
              this.subloading = false;
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 选中清空
    onSelectClear() {
      this.selectedRowKeys = [];
    },
    // 选中项
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 分页
    changepage(page, pageSize) {
      this.searchform.page = page;
      this.searchform.per_page = pageSize;
      this.list();
    },
  },
};
</script>
<style>
.ant-table table {
  border-collapse: collapse;
  border-spacing: 0;
}
.ant-table-thead > tr > th,
.ant-table-tbody > tr > td {
  border-left: 1px solid #f0f0f0;
  border-top: 1px solid #f0f0f0;
}
</style>
<style scoped>
.alert {
  margin-bottom: 16px;
}
.alert .message a {
  font-weight: 600;
}
.alert .clear {
  float: right;
}
.table_content {
  margin: 20px 0;
}
</style>
