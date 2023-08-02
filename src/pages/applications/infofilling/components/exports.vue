<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <a-form-model layout="horizontal" :model="searchform" ref="searchform">
      <a-row>
        <a-col :md="8" :sm="24">
          <a-form-model-item
            label="填报类型"
            :labelCol="{ span: 7 }"
            :wrapperCol="{ span: 16 }"
          >
            <a-select
              placeholder="请输入填报类型查询"
              v-model="searchform.category"
              allowClear
            >
              <a-select-option value="建设审批">建设审批</a-select-option>
              <a-select-option value="安全生产">安全生产</a-select-option>
              <a-select-option value="环保治污">环保治污</a-select-option>
              <a-select-option value="其他">其他</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item
            label="行业类型"
            :labelCol="{ span: 7 }"
            :wrapperCol="{ span: 16 }"
          >
            <a-select
              placeholder="请选择产品品类查询"
              v-model="searchform.type"
              allowClear
            >
              <a-select-option v-for="item in industry" :key="item">{{
                item
              }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <template v-if="advanced">
          <a-col :md="8" :sm="24">
            <a-form-model-item
              label="填报状态"
              :labelCol="{ span: 7 }"
              :wrapperCol="{ span: 16 }"
            >
              <a-select
                placeholder="请选择填报状态查询"
                v-model="searchform.model"
                allowClear
              >
                <a-select-option
                  v-for="item in categorystatuslist"
                  :key="item"
                  >{{ item }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>
        </template>
        <a-col :md="6" :sm="24" :offset="1">
          <span
            style="
              float: left;
              margin-top: 3px;
              display: block;
              margin-bottom: 24px;
              white-space: nowrap;
            "
          >
            <a-button type="primary" :loading="loadingsearch" @click="onSearch"
              >查询</a-button
            >
            <a-button
              style="margin-left: 8px"
              @click="resetForm()"
              :loading="loadingreset"
              >重置</a-button
            >
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? "收起" : "展开" }}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a>
          </span>
        </a-col>
      </a-row>
    </a-form-model>
    <!-- <a-button type="primary" @click="onAdd" style="margin: 0px 0px 20px">
      <a-icon type="plus" />新增
    </a-button> -->
    <div class="alert">
      <a-alert type="info" :show-icon="true">
        <div class="message" slot="message">
          已选择&nbsp;
          <a>{{ selectedRowKeys.length }}</a>
          &nbsp;项
          <a
            class="clear"
            @click="onSelectClear"
            v-if="this.selectedRowKeys.length > 0"
            >取消</a
          >
          <!-- <a-divider type="vertical" class="clear" />
          <a
            class="clear"
            @click="deleteDraft"
            v-if="this.selectedRowKeys.length > 0"
            >删除</a
          > -->
        </div>
      </a-alert>
    </div>

    <a-table
      ref="table"
      bordered
      class="table_content"
      size="middle"
      rowKey="id"
      :loading="loading"
      :pagination="false"
      :columns="columns"
      :dataSource="enterpriselist"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
    >
      <span slot="action">
        <a @click="onEnter" style="color: #00aaf0" disabled> 导出 </a>
      </span>

      <span slot="categorystatus" slot-scope="text, record">
        <a-tag
          :color="
            record.categorystatus == '已填报'
              ? 'green'
              : record.categorystatus == '未填报'
              ? 'blue'
              : 'orange'
          "
          >{{ record.categorystatus }}</a-tag
        >
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
      :total="1"
      show-size-changer
      show-quick-jumper
      :show-total="(total) => `共 ${total} 条`"
    ></a-pagination>
    <a-modal
      :title="titles"
      width="60%"
      :confirm-loading="confirmLoading"
      :visible="formDialog"
      :maskClosable="false"
      @ok="onSubmit"
      @cancel="
        () => {
          formDialog = false;
          this.$refs.forms.reset();
        }
      "
    >
      <k-form-build
        :value="jsonData"
        :config="config"
        :dynamicData="dynamicData"
        ref="forms"
      />
    </a-modal>
    <pic-preview
      :file-preview-show="previewShow"
      :img-list="preImages"
      :current-img="currentImg"
      @close="() => (previewShow = false)"
    ></pic-preview>
    <a-modal
      :visible="videopres"
      title="产品视频"
      :confirm-loading="confirmLoading"
      :maskClosable="false"
      :closable="false"
      width="70%"
      @cancel="
        () => {
          videopres = false;
          this.activeKey = 0;
        }
      "
    >
      <span slot="footer">
        <a-button @click="cancels">关闭</a-button>
      </span>
      <a-tabs :activeKey="activeKey" @change="changes" tabPosition="right">
        <a-tab-pane v-for="(item, index) in videolist" :key="index">
          <span slot="tab">{{ item.name }} </span>
          <video controls style="width: 100%" :src="item.url"></video>
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </a-card>
</template>

<script>
import Cookie from "js-cookie";
import { form_get } from "@/services/forms";

import PicPreview from "@/components/PicPreview";
import { enterpriselist } from "./data.json";
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
  components: {
    PicPreview,
  },
  data() {
    return {
      advanced: false,
      formDialog: false, //弹窗
      confirmLoading: false, //弹窗
      loading: true, //表格
      loadingsearch: false, //查询
      loadingreset: false, //重置
      searchform: {},
      dataSource: {},
      jsonData: {},
      columns: [
        {
          title: "填报标题",
          dataIndex: "title",
          scopedSlots: { customRender: "title" },
        },
        {
          title: "填报类别",
          dataIndex: "category",
          scopedSlots: { customRender: "category" },
        },
        {
          title: "下发日期",
          dataIndex: "start",
          scopedSlots: { customRender: "start" },
        },
        {
          title: "截止日期 ",
          dataIndex: "end",
          scopedSlots: { customRender: "end" },
        },
        {
          title: "填报状态",
          dataIndex: "categorystatus",
          width: "100px",
          align: "center",
          scopedSlots: { customRender: "categorystatus" },
        },
        {
          title: "操作",
          dataIndex: "action",
          width: "130px",
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
      selectedRowKeys: [],
      pageSizeOptions: ["10", "20", "30", "40"],
      draftId: "",
      titles: "新增产品",
      //   图片
      previewShow: false,
      preImages: [],
      currentImg: "",
      videopres: false,
      activeKey: 0,
      videolist: [],
      industry: [
        "批发业",
        "金属制品业",
        "其他制造业",
        "研究和试验发展",
        "科技推广和应用服务业",
        "电气机械和器材制造业",
        "科技推广和应用服务业",
        "医药制造业",
        "仪器仪表制造业",
        "零售业",
      ],
      categorystatuslist: ["已填报", "未填报", "已超期"],
      enterpriselist,
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
    dynamicData() {
      let result = {
        organizations: [],
        sitelist: [],
        scope: {
          1: "今天",
          2: "本周",
          3: "上周",
          4: "本月",
          5: "上月",
        },
      };
      return result;
    },
  },
  created() {
    this.init();
    console.log("this.params", this.params);
  },
  methods: {
    // 增编 提交
    onSubmit() {
      this.$refs.forms
        .getData()
        .then((values) => {
          console.log("values", values);
          this.confirmLoading = true;

          console.log("this.dataSource", this.dataSource);
          setTimeout(() => {
            this.dataSource.items.push(
              Object.assign(values, { id: this.dataSource.items.length + 1 })
            );
            this.confirmLoading = false;
            this.formDialog = false;
          }, 500);
        })
        .catch((err) => {
          console.log("err", err);
          //   for (let i in err) {
          //     this.$message.warning(err[i].errors[0].message);
          //   }
        });
    },
    // 编辑
    onEnter() {
      console.log(11111111111111111111)
      // var a = document.createElement("a");
      // var filename = "建筑工程施工审批表.doc";
      // a.href = "/resources/public/20220718/62d4f820cc1561a8c35278fe.doc";
      // a.download = filename;
      // a.click();
    },
    // 添加
    onAdd() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "themedetails",
          params: {
            id: undefined,
          },
        },
      });
    },
    // 删除 草案
    deleteDraft() {
      var that = this;
      this.$confirm({
        title: "您确定要删除选中的数据吗?",
        icon: "info-circle",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          var parems = {
            id: that.selectedRowKeys,
          };
          draft_delete(parems)
            .then(() => {
              that.$message.success("操作成功！");
              that.selectedRowKeys = [];
              that.loadDataSrouce();
            })
            .catch((err) => {
              console.log(err);
            });
        },
        onCancel() {},
      });
    },
    confirm(record) {
      this.dataSource.items.splice(record.id - 1, 1);
    },
    init() {
      this.searchform = this.params.searchform || this.searchform;
      form_get({ name: "zdxf_products" })
        .then((Response) => {
          this.jsonData = Response.data.data.form;
          this.loadDataSrouce();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 分页
    changepage(page, pageSize) {
      console.log(page, pageSize);
      this.pagination.page = page;
      this.pagination.per_page = pageSize;
      this.loadDataSrouce();
    },

    loadDataSrouce() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.loadingsearch = false;
        this.loadingreset = false;
      }, 500);
    },
    onSearch() {
      this.loading = true;
      this.loadingsearch = true;
      this.searchform.page = 1;
      this.searchform.per_page = 10;
      this.loadDataSrouce();
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    onSelectClear() {
      this.selectedRowKeys = [];
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    resetForm() {
      this.searchform = {};
      this.loading = true;
      this.loadingreset = true;
      this.loadDataSrouce();
    },
    // 图片
    previews(record) {
      this.preImages = record.map((item) => item.url);
      this.currentImg = record[0].url;
      this.previewShow = true;
    },
    // 视频
    prevideos(record) {
      console.log(record);
      this.videopres = true;
      this.$nextTick(() => {
        this.videolist = record;
      });
    },
    cancels() {
      this.activeKey = 0;
      this.videopres = false;
    },
    changes(value) {
      this.activeKey = value;
    },

    //查看
    toform(record) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "edit-forms",
          params: {
            id: this.params.id ? this.params.id : "",
            data: record,
            searchform: Object.assign(this.searchform, this.pagination),
          },
        },
      });
    },
  },
  mounted() {},
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
<style lang="less" scoped>
// .loading {
//   position: fixed;
//   left: 0;
//   top: 0;
//   width: 100vw;
//   height: 100%;
//   z-index: 990;
//   padding: 45vh 0;
//   background: #ffffff;
// }
// .span_loading {
//   align-items: center;
//   display: block;
// }
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
.alert {
  margin-bottom: 16px;
  .message {
    a {
      font-weight: 600;
      color: #1890ff;
    }
  }
  .clear {
    float: right;
  }
}
.action_button:hover {
  color: #1890ff;
}
.table_content {
  margin: 20px 0;
}
// ::-webkit-scrollbar {
//   width: 0 !important;
// }
// ::-webkit-scrollbar {
//   width: 0 !important;
//   height: 0;
// }
</style>
