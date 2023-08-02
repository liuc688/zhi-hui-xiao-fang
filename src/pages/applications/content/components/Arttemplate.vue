<template>
  <a-card
    :body-style="{ padding: '24px 32px', maxHeight: '80vh' }"
    :bordered="false"
  >
    <a-spin tip="Loading..." :spinning="loading">
      <a-page-header
        style="
          border-bottom: 1px solid #ccc;
          margin-bottom: 10px;
          padding-bottom: 10px;
        "
        @back="back"
      >
        <template slot="title">
          <a-button @click="back"><span>返回</span></a-button>
        </template>
      </a-page-header>
      <a-form-model
        ref="form"
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-row :gutter="24">
          <a-col :xl="8" :lg="8">
            <a-form-model-item label="关键字">
              <a-input
                v-model="keyword"
                allowClear
                :loading="loading"
                enterButton
                placeholder="请输入关键字"
              />
            </a-form-model-item>
          </a-col>
          <a-col :xl="5" :lg="5">
            <a-form-model-item label="类型">
              <a-select v-model="status" placeholder="请选择文件处理类型">
                <a-select-option :value="1"> 导入 </a-select-option>
                <a-select-option :value="2"> 导出 </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span
              style="
                float: left;
                margin-top: 3px;
                display: block;
                margin-bottom: 24px;
                white-space: nowrap;
              "
            >
              <a-button type="primary" @click="onSearch"> 查询 </a-button>
              <a-button
                style="margin-left: 8px"
                @click="resetForm"
                :loading="loadingreset"
              >
                重置
              </a-button>
            </span>
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
      >
        <!-- 
         :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onChange,
        }"
       -->
        <span slot="_title" slot-scope="text, record">
          {{ record.title }}
        </span>
        <span slot="status" slot-scope="text, record">
          <a-tag :color="record.status == 1 ? 'green' : 'orange'">
            {{ record.status == 1 ? "文章导入结果" : "文章导出结果" }}
          </a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <div style="text-align: center">
            <a style="color: #2db7f5" @click="getdetailes(record)">
              <a-icon :type="'edit'" />
              详情
            </a>
          </div>
        </span>
      </a-table>
      <a-pagination
        size="small"
        style="text-align: right"
        :current="pagination.page"
        :pageSize.sync="pagination.per_page"
        @change="changepage"
        @showSizeChange="changepage"
        :pageSizeOptions="['10', '20', '30', '40']"
        :total="pagination.total"
        show-size-changer
        show-quick-jumper
        :show-total="(total) => `共 ${total} 条`"
      ></a-pagination>
    </a-spin>
    <a-modal
      title="文章操作详情"
      :visible="docvisibles"
      @ok="dochandleOks"
      @cancel="
        () => {
          docvisibles = false;
        }
      "
      width="50%"
    >
      <div>
        <div style="padding: 10px; font-size: 18px; background: #f0f8ff">
          导出结果命名：{{ detaildata.title }}
        </div>
        <a-table
          ref="tables"
          :bordered="true"
          size="middle"
          rowKey="id"
          :loading="loading"
          :columns="resultcolumns"
          :dataSource="datass"
          :pagination="paginations"
        >
        </a-table>
      </div>
    </a-modal>
  </a-card>
</template>
<script>
import {
  download_result_paginate, // 文章结果分页
  download_result_get,
} from "@/services/content";
export default {
  name: "arttemplate",
  props: {
    params: {
      type: Object,
      default: () => {
        return {};
      },
    },
    event: {
      type: Function,
    },
    onOpen: {
      type: Function,
    },
  },
  data() {
    return {
      form: {},
      keyword: undefined,
      status: undefined,
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
      loading: true,
      columns: [
        {
          title: "标题",
          dataIndex: "title",
          align: "left",
          width: "50%",
          scopedSlots: { customRender: "_title" },
        },
        {
          title: "分类",
          dataIndex: "status",
          align: "center",
          scopedSlots: { customRender: "status" },
        },
        {
          title: "创建时间",
          dataIndex: "_createtime",
          align: "center",
          scopedSlots: { customRender: "_createtime" },
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 140,
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
      resultcolumns: [
        {
          title: "数据行数",
          dataIndex: "titles",
          align: "left",
          width: "50%",
          scopedSlots: { customRender: "titles" },
        },
        {
          title: "导入结果",
          dataIndex: "results",
          align: "center",
          width: "50%",
          scopedSlots: { customRender: "results" },
        },
      ],
      selectedRowKeys: [],
      paginations: {
        pageSize: 10,
      },
      data: {},
      datass: [],
      loadingreset: false,
      docvisibles: false,
      detaildata: {},
    };
  },
  computed: {
    pagination: {
      get() {
        return {
          page: this.data.page || 1,
          per_page: this.data.per_page || 10,
          total: this.data.total || 0,
        };
      },
      set(val) {
        this.data.page = val.page;
        this.data.per_page = val.per_page;
        this.data.total = val.total;
      },
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.paginate();
      });
    },
    paginate() {
      var datas = {
        keyword: this.keyword || undefined,
        status: this.status || undefined,
      };
      this.loading = true;
      download_result_paginate(Object.assign(datas, this.pagination))
        .then((res) => {
          this.data = res.data.data;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },
    onSearch() {
      this.loading = true;
      this.pagination.page = 1;
      this.paginate();
    },
    resetForm() {
      this.keyword = undefined;
      this.status = undefined;
      this.paginate();
    },

    onChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    changepage(page, pageSize) {
      this.loading = true;
      this.pagination.page = page;
      this.pagination.per_page = pageSize;
      this.paginate();
    },
    getdetailes(record) {
      console.log("record", record);
      this.docvisibles = true;
      download_result_get({ id: record.id })
        .then((Response) => {
          console.log("Response", Response);

          this.detaildata = Response.data.data;
          this.datass = [];
          for (let key in this.detaildata.result) {
            this.datass.push({
              titles: key,
              results: this.detaildata.result[key].message,
            });
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    dochandleOks() {},
    back() {
      this.$emit("event", {
        method: this.params.key == "2" ? "refreshes" : "refresh",
        params: {
          data: this.params.channel,
          site: this.params.id,
        },
      });
    },
  },
};
</script>
<style scoped>
.rights_pa {
  margin-top: 5px;
  text-align: right;
}
.rights_pa >>> .ant-checkbox + span {
  padding-right: 8px !important;
}
.time_line {
  height: 500px;
  overflow: auto;
}
.sdfsdf {
  width: 100%;
  text-align: center;
}
</style>
<style lang="less">
.drops {
  .ant-dropdown-menu-submenu-title {
    color: #1890ff;
  }
}
.fenxiang {
  display: none;
  position: absolute;
  top: 20px;
  left: calc(50% - 140px);
  background: #fff;
  padding: 20px 100px;
  border: 1px solid #e7e7e7;
  text-align: center;
  font-size: 16px;
  animation: fadenum 3s ease;
}
@keyframes fadenum {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.overflowhiddens {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
</style>
