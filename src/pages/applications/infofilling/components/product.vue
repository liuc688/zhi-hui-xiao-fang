<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <a-form-model layout="horizontal" :model="searchform" ref="searchform">
      <a-row>
        <a-col :md="8" :sm="24">
          <a-form-model-item
            label="产品名称"
            :labelCol="{ span: 7 }"
            :wrapperCol="{ span: 16 }"
          >
            <a-input
              v-model="searchform.keyword"
              placeholder="请输入产品名称、简介关键词查询"
              allowClear
            />
          </a-form-model-item>
        </a-col>
        <!-- <a-col :md="8" :sm="24">
          <a-form-model-item
            label="产品类型"
            :labelCol="{ span: 7 }"
            :wrapperCol="{ span: 16 }"
          >
            <a-select
              placeholder="请选择产品类型查询"
              v-model="searchform.category"
              allowClear
            >
              <a-select-option v-for="item in categorylist" :key="item.title">{{
                item.title
              }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>

        <template v-if="advanced">
          <a-col :md="8" :sm="24">
            <a-form-model-item
              label="产品型号"
              :labelCol="{ span: 7 }"
              :wrapperCol="{ span: 16 }"
            >
              <a-select
                placeholder="请选择产品型号查询"
                v-model="searchform.model"
                allowClear
              >
                <a-select-option v-for="item in modellist" :key="item.title">{{
                  item.title
                }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item
              label="产品规格"
              :labelCol="{ span: 7 }"
              :wrapperCol="{ span: 16 }"
            >
              <a-select
                placeholder="请选择产品规格查询"
                v-model="searchform.specs"
                allowClear
              >
                <a-select-option v-for="item in specslist" :key="item.title">{{
                  item.title
                }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </template> -->
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
            <!-- <a @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? "收起" : "展开" }}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a> -->
          </span>
        </a-col>
      </a-row>
    </a-form-model>
    <a-space>
      <a-button type="primary" @click="onAdd" style="margin: 0px 0px 20px">
        <a-icon type="plus" />新增
      </a-button>
      <a-button style="margin: 0px 0px 20px">
        <a-checkbox v-model="searchform.delete" @change="onRecycles"
          >回收站</a-checkbox
        >
      </a-button>
    </a-space>
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
      :dataSource="dataSource.items"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
    >
      <span slot="action" slot-scope="text, record">
        <a
          @click="onEnter(record)"
          v-if="!record._delete"
          style="color: #00aaf0"
        >
          编辑
        </a>
        <a-popconfirm
          placement="topRight"
          title="您确定要还原这条产品数据吗?"
          ok-text="确定"
          v-else
          cancel-text="取消"
          @confirm="restores(record)"
        >
          <a style="color: #00aaf0"> 还原 </a>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a-popconfirm
          placement="topRight"
          title="您确定要删除这条产品数据吗?"
          ok-text="确定"
          cancel-text="取消"
          @confirm="confirm(record)"
        >
          <a style="color: #00aaf0"> 删除 </a>
        </a-popconfirm>
      </span>
      <span slot="diagram" slot-scope="text, record">
        <a-tag
          v-if="record.cptp.length"
          color="green"
          @click="previews(record.cptp)"
          >图</a-tag
        >
        <a-tag
          v-if="record.cpsp.length"
          color="blue"
          @click="prevideos(record.cpsp)"
          >视</a-tag
        >
      </span>
      <span slot="titles" slot-scope="text, record">
        <a-avatar
          :size="36"
          class="avaters"
          v-if="record.cptp.length"
          @click="previews(record.cptp)"
          :src="record.cptp[0].url"
        />
        <a-avatar :size="36" v-else icon="user" />
        <a
          style="color: #40a9ff; margin: 0 10px"
          v-if="!record._delete"
          @click="todetails(record)"
          >{{ record.title }}</a
        >
        <span style="margin: 0 10px" v-else>{{ record.title }}</span>
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
      <k-form-build :value="jsonData" :config="config" ref="forms" />
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
          <span slot="tab">{{ item.category }} </span>
          <video controls style="width: 100%" :src="item.url"></video>
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </a-card>
</template>

<script>
import Cookie from "js-cookie";
import { form_get } from "@/services/forms";
import {
  product_paginate,
  product_edit,
  product_create,
  product_get,
  product_delete,
  product_restore,
} from "@/services/infofilling";
import { dictmap_tree } from "@/services/dictmap";
import PicPreview from "@/components/PicPreview";
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
      id: undefined,
      advanced: false,
      formDialog: false, //弹窗
      confirmLoading: false, //弹窗
      loading: true, //表格
      loadingsearch: false, //查询
      loadingreset: false, //重置
      searchform: {
        delete: false,
        page: 1,
        per_page: 10,
      },
      dataSource: {},
      jsonData: {},
      columns: [
        {
          title: "名称",
          dataIndex: "title",
          with: "20%",
          scopedSlots: { customRender: "titles" },
        },
        {
          title: "类型",
          dataIndex: "category",
          scopedSlots: { customRender: "category" },
        },
        {
          title: "型号",
          dataIndex: "model",
          scopedSlots: { customRender: "model" },
        },
        {
          title: "规格",
          dataIndex: "specs",
          scopedSlots: { customRender: "specs" },
        },
        {
          title: "单位",
          dataIndex: "unit",
          scopedSlots: { customRender: "unit" },
        },
        {
          title: "价格",
          children: [
            {
              title: "园区价(元)",
              dataIndex: "parkprice",
              width: "130px",
              scopedSlots: { customRender: "parkprice" },
            },
            {
              title: "出厂价(元)",
              dataIndex: "factoryprice",
              width: "130px",
              scopedSlots: { customRender: "factoryprice" },
            },
            {
              title: "零售价(元)",
              dataIndex: "retailprice",
              width: "130px",
              scopedSlots: { customRender: "retailprice" },
            },
          ],
        },
        {
          title: "库存",
          dataIndex: "stock",
          scopedSlots: { customRender: "stock" },
        },
        {
          title: "主图",
          dataIndex: "diagram",
          width: "100px",
          align: "center",
          scopedSlots: { customRender: "diagram" },
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
      methodes: undefined,
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
        this.dataSource.page = val.page || 1;
        this.dataSource.per_page = val.per_page || 10;
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
  },
  created() {
    console.log("params123123", this.params);
    this.id = this.params.id;
    this.searchform = this.params.searchform || this.searchform;
    this.init();
  },
  methods: {
    init() {
      this.searchform = this.params.searchform || this.searchform;
      Promise.all([
        form_get({ name: "zdxf_products" }),
        // dictmap_tree({ name: "product_category" }), //产品类型
        // dictmap_tree({ name: "product_model" }), //产品型号
        // dictmap_tree({ name: "product_specs" }), //产品规格
        // dictmap_tree({ name: "product_unit" }), //产品单位
      ])
        .then((Response) => {
          console.log("Response", Response);
          this.jsonData = Response[0].data.data.form;
          // this.categorylist = Response[1].data.data;
          // this.modellist = Response[2].data.data;
          // this.specslist = Response[3].data.data;
          // this.unitlist = Response[4].data.data;
          this.loadDataSrouce();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 增编 提交
    onSubmit() {
      this.$refs.forms
        .getData()
        .then((values) => {
          this.confirmLoading = true;
          this.methodes(
            Object.assign(values, {
              id: this.draftId,
              comeform: "PC端",
              company: this.draftId ? undefined : this.id,
            })
          )
            .then((response) => {
              this.formDialog = false;
              this.confirmLoading = false;
              this.loadDataSrouce();
            })
            .catch((err) => {
              this.$message.error(err.response.data.message);
              this.formDialog = false;
              this.confirmLoading = false;
            });
        })
        .catch((err) => {
          console.log("err", err);
          //   for (let i in err) {
          //     this.$message.warning(err[i].errors[0].message);
          //   }
        });
    },
    // 编辑
    onEnter(record) {
      this.formDialog = true;
      this.draftId = record.id;
      this.titles = "新增产品";
      this.methodes = product_edit;
      product_get({ id: record.id })
        .then((response) => {
          this.$nextTick(() => {
            this.$refs.forms.setData({
              title: response.data.data.title,
              category: response.data.data.category,
              model: response.data.data.model || undefined,
              specs: response.data.data.specs || undefined,
              unit: response.data.data.unit || undefined,
              stock: response.data.data.stock || undefined,
              parkprice: response.data.data.parkprice || undefined,
              factoryprice: response.data.data.factoryprice || undefined,
              retailprice: response.data.data.retailprice || undefined,
              content: response.data.data.content || undefined,
              imgs: response.data.data.imgs || [],
              videos: response.data.data.videos || [],
            });
          });
        })
        .catch((error) => {
          console.log(error);
          this.$message.error(error.response.data.message);
        });
    },
    // 添加
    onAdd() {
      this.formDialog = true;
      this.draftId = undefined;
      this.titles = "新增产品";
      this.methodes = product_create;
      this.$nextTick(() => {
        this.$refs.forms.reset();
      });
    },
    // 删除 产品
    deleteDraft() {
      var that = this;
      this.$confirm({
        title: "您确定要删除选中的产品吗?",
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
      product_delete({ id: record.id })
        .then((res) => {
          this.$message.success(res.data.message);
          this.loadDataSrouce();
        })
        .catch((error) => {
          console.log(error);
          this.$message.error(error.response.data.message);
        });
    },
    restores(record) {
      product_restore({ id: record.id })
        .then((res) => {
          this.$message.success(res.data.message);
          this.loadDataSrouce();
        })
        .catch((error) => {
          console.log(error);
          this.$message.error(error.response.data.message);
        });
    },
    onRecycles() {
      this.loading = true;
      this.loadDataSrouce();
    },
    // 分页
    changepage(page, pageSize) {
      console.log(page, pageSize);
      this.searchform.page = page;
      this.searchform.per_page = pageSize;
      this.loadDataSrouce();
    },
    loadDataSrouce() {
      product_paginate(Object.assign(this.searchform, { company: this.id }))
        .then((res) => {
          console.log("res", res);
          this.dataSource = res.data.data;
          this.loading = false;
          this.loadingsearch = false;
          this.loadingreset = false;
        })
        .catch((error) => {
          this.loading = false;
          this.loadingsearch = false;
          this.loadingreset = false;
          console.log(error);
          this.$message.error(error.response.date.message);
        });
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
      console.log("record", record);
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
    todetails(record) {
      console.log("record查看", record);
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "productdetails",
          params: {
            ids: record.id,
            searchform: Object.assign(this.searchform, this.pagination),
          },
        },
      });
    },
    // todetails(data) {
    //   console.log("data", data);
    //   this.$emit("event", {
    //     method: "onLink",
    //     params: {
    //       route: "productdetails",
    //       params: {
    //         ids: data.id,
    //         searchform: Object.assign(this.searchform, this.pagination),
    //       },
    //     },
    //   });
    // },
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
.avaters {
  background: #e8e8e8;
  border-radius: 50%;
}
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
