<template>
  <a-spin
    :spinning="spinning"
    style="height: 100%; width: 100%"
    tip="Loading..."
  >
    <div style="padding: 20px; min-height: 100%; background: white">
      <div class="title_back">
        <a @click="back()"><a-icon type="arrow-left" />返回</a>
      </div>
      <a-form-model
        ref="form"
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
       <a-row>
         <a-col :md="6" :sm="24">
          <a-form-model-item
            label="关键词"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-input
              v-model="keyword"
              placeholder="请输入关键词"
              allowClear
            />
          </a-form-model-item>
        </a-col>
        <a-col :md="6" :sm="24" :offset = '1'>
          <a-form-model-item
            label="时间范围"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 18, offset: 1 }"
            format="YYYY-MM-DD"
          >
            <a-range-picker
              style="width: 100%"
              v-model="daterange"
              @change="onTimerRangeChange"
              allowClear
            />
          </a-form-model-item>
          
        </a-col>
        <a-col :xl="10" :lg="8">
            <div style="margin-top: 4px; text-align: left">
              <a-space>
                <a-button
                  type="primary"
                  icon="search"
                  @click="onSearch"
                  style="margin-left: 20px"
                  >查询</a-button
                >
               
              </a-space>
            </div>
          </a-col>
       </a-row>
      </a-form-model>
      <a-table
        ref="table"
        :bordered="true"
        style="margin: 20px 0"
        size="middle"
        rowKey="id"
        :loading="loading"
        :columns="columns"
        :dataSource="data.items"
        :pagination="false"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onChange,
        }"
      >
      <span slot="sex" slot-scope="text,record">
        {{record.sex == 1?'男':'女'}}
      </span>
      <span slot="accept" slot-scope="text,record">
        {{record.accept?'是':'否'}}
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
        :total="data.total"
        show-size-changer
        show-quick-jumper
        :show-total="(total) => `共 ${total} 条`"
      ></a-pagination>
    </div>
  </a-spin>
</template>
<script>
import {
  know_check,
  know_delete,
  know_edit,
  know_insert,
  know_restore,
} from "@/services/know";
import {
  person_paginate,
} from "@/services/booking";
import { form_get } from "@/services/forms";
export default {
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
      spinning: false,
      deleted: undefined,
      issue: undefined,
      status: undefined,
      form: {},
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
      selectedRowKeys: [],
      data: {},
      columns: [
        {
          title: "姓名",
          dataIndex: "name",
          scopedSlots: { customRender: "name" },
        },
        {
          title: "性别",
          dataIndex: "sex",
          align: "center",
          scopedSlots: { customRender: "sex"},
        },
        {
          title: "学校",
          dataIndex: "school",
          align: "center",
          scopedSlots: { customRender: "school" },
        },
        {
          title: "班级",
          dataIndex: "classs",
          align: "center",
          scopedSlots: { customRender: "classs" },
        },
        
        {
          title: "电话号码",
          dataIndex: "mobile",
          align: "center",
          scopedSlots: { customRender: "mobile" },
        },
        {
          title: "身份证号",
          dataIndex: "identity",
          align: "center",
          scopedSlots: { customRender: "identity" },
        },
        {
          title: "截止时间",
          dataIndex: "datetime",
          align: "center",
          scopedSlots: { customRender: "datetime" },
        },
        {
          title: "是否受理",
          dataIndex: "accept",
          align: "center",
          scopedSlots: { customRender: "accept" },
        },
      ],
      loading: false,
      visible: false,
      confirmLoading: false,
      listData: {},
      pageSizeOptions: ["10", "20", "30", "40"],
      mothed: know_edit,
      daterange:[],
      keyword:""
    };
  },
  computed: {
    search: {
      get() {
        return {
          keyword: this.keyword,
          daterange: this.daterange
        };
      },
      set(val) {
        this.keyword = val.keyword;
        this.daterange = val.daterange;
      },
    },
    pagination: {
      get() {
        return {
          page: this.data.page ? this.data.page : 1,
          per_page: this.data.per_page ? this.data.per_page : 10,
          total: this.data.total ? this.data.total : 0,
        };
      },
      set(val) {
        this.data.page = val.page;
        this.data.per_page = val.per_page;
      },
    },
  },
  created() {
    this.pagination = this.params.pagination || this.pagination;
    this.search = this.params.search || this.search;
    this.init();
  },
  methods: {
    onTimerRangeChange(date,strdate) {
      this.daterange = strdate
    },
    init() {
      this.loadDataSrouce();
    },
    loadDataSrouce() {
      person_paginate(
        Object.assign({ booking: this.params.id }, this.pagination, this.search)
      )
        .then((res) => {
          this.data = res.data.data;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    onDelete() {
      know_delete({ ids: this.selectedRowKeys })
        .then(() => {
          this.loading = true;
          this.selectedRowKeys = [];
          this.loadDataSrouce();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onSearch() {
      this.loading = true;
      this.loadDataSrouce();
    },
    onRecycle(e) {
      this.deleted = e.target.checked;
      this.selectedRowKeys = [];
      this.loading = true;
      this.pagination.page = 1;
      this.pagination.per_page = 10;
      this.loadDataSrouce();
    },
    onChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // check(record) {
    //   know_check({ id: record.id })
    //     .then((res) => {
    //       this.$message.success(res.data.message);
    //       this.loading = true;
    //       this.loadDataSrouce();
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // },
    // 分页
    changepage(page, pageSize) {
      this.pagination.page = page;
      this.pagination.per_page = pageSize;
      this.loading = true;
      this.loadDataSrouce();
    },

    onAdd() {
      this.visible = true;
      this.$nextTick(() => {
        this.mothed = know_insert;
        this.ids = undefined;
        this.$refs.forms.reset();
      });
    },
    onEdit(record) {
      this.visible = true;
      this.$nextTick(() => {
        this.mothed = know_edit;
        this.ids = record.id;
        this.$refs.forms.setData({
          title: record.title,
          content: record.content,
        });
      });
    },
    handleOk() {
      this.$refs.forms
        .getData()
        .then((valid) => {
          valid.id = this.ids;
          this.mothed(valid)
            .then(() => {
              this.loading = true;
              this.visible = false;
              this.loadDataSrouce();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    },
    handleCancel() {
      this.visible = false;
    },
    torestore() {
      know_restore({ ids: this.selectedRowKeys })
        .then((res) => {
          this.loading = true;
          this.loadDataSrouce();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 查看答案
    todetiles(record) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "in-detailes",
          params: Object.assign({
            search: this.search,
            pagination: this.pagination,
            id: record.id,
          }),
        },
      });
    },
    back() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "home",
          params: this.params,
        },
      });
    },
  },
};
</script>
<style scoped>
.title_back {
  padding: 10px;
  background: #daedff;
  border: 1px solid #40a9ff;
  border-radius: 5px;
  margin-bottom: 20px;
}
</style>