<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <a-form-model layout="horizontal" :model="searchform" ref="searchform">
      <a-row>
        <a-col :md="8" :sm="24">
          <a-form-model-item
            label="关键词"
            :labelCol="{ span: 7 }"
            :wrapperCol="{ span: 16 }"
          >
            <a-input
              v-model="searchform.keyword"
              placeholder="请输入关键词查询"
              allowClear
            />
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item
            label="类别"
            :labelCol="{ span: 7 }"
            :wrapperCol="{ span: 16 }"
          >
            <a-select
              placeholder="请选择类别查询"
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
              label="类型"
              :labelCol="{ span: 7 }"
              :wrapperCol="{ span: 16 }"
            >
              <a-select
                placeholder="请选择类型查询"
                v-model="searchform.type"
                allowClear
              >
                <a-select-option v-for="item in typelist" :key="item.title">{{
                  item.title
                }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <!-- <a-col :md="8" :sm="24">
            <a-form-model-item
              label="方式"
              :labelCol="{ span: 7 }"
              :wrapperCol="{ span: 16 }"
            >
              <a-select
                placeholder="请选择方式查询"
                v-model="searchform.specs"
                allowClear
              >
                <a-select-option value="匿名">匿名</a-select-option>
                <a-select-option value="留名">留名</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col> -->
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
        <a @click="onEnter(record)" v-if="!record._delete" style="color: #00aaf0"> 编辑 </a>
        <a-popconfirm v-else
          placement="topRight"
          title="您确定要还原这条信息吗?"
          ok-text="确定"
          cancel-text="取消"
          @confirm="restoremessage(record)"
        >
          <a style="color: #00aaf0"> 还原 </a>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a-popconfirm
          placement="topRight"
          title="您确定要删除这条信息吗?"
          ok-text="确定"
          cancel-text="取消"
          @confirm="deletesmessage(record)"
        >
          <a style="color: #00aaf0"> 删除 </a>
        </a-popconfirm>
      </span>
      <span slot="titles" slot-scope="text, record">
        <a  @click="getdetailes(record)">{{record.title}}</a>
      </span>
      <span slot="mode" slot-scope="text, record">
        <a-tag :color="record.mobile ? '#87d068' : '#afafaf'">{{
          record.mobile ? "留名" : "匿名"
        }}</a-tag>
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
      <k-form-build
        :value="jsonData"
        :config="config"
        :dynamicData="dynamicData"
        @change="changes"
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
import {
  message_paginate,
  message_create,
  message_edit,
  message_delete,
  message_restore,
} from "@/services/infofilling";
import { dictmap_tree } from "@/services/dictmap";
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
      searchform: {
        page: 1,
        per_page: 10,
        delete: false,
      },
      dataSource: {},
      jsonData: {},
      columns: [
        {
          title: "标题",
          dataIndex: "title",
          ellipsis: true,
          scopedSlots: { customRender: "titles" },
        },
        {
          title: "类别",
          dataIndex: "category",
          width: "150px",
          scopedSlots: { customRender: "category" },
        },
        {
          title: "类型",
          dataIndex: "type",
          width: "150px",
          scopedSlots: { customRender: "type" },
        },
        {
          title: "方式",
          dataIndex: "mode",
          width: "100px",
          scopedSlots: { customRender: "mode" },
        },
        // {
        //   title: "内容详情",
        //   dataIndex: "content",
        //   ellipsis: true,
        //   width: "40%",
        //   scopedSlots: { customRender: "content" },
        // },
        {
          title: "操作",
          dataIndex: "action",
          width: "150px",
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
      categorylist: [],
      typelist: [],
      methoeds: undefined,
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
        categorylist: [],
        typelist: [],
      };
      this.categorylist.filter((item) => {
        result.categorylist.push({
          label: item.title,
          value: item.title,
        });
      });
      this.typelist.filter((item) => {
        result.typelist.push({
          label: item.title,
          value: item.title,
        });
      });
      return result;
    },
  },
  created() {
    this.init();
    console.log("this.params", this.params);
  },
  methods: {
    init() {
      this.searchform = this.params.searchform || this.searchform;
      Promise.all([
        form_get({ name: "zdxf_suggestions" }),
        dictmap_tree({ name: "messages_categorys" }), //沟通类别
        dictmap_tree({ name: "messages_types" }), //沟通类型
      ])
        .then((Response) => {
          this.jsonData = Response[0].data.data.form;
          this.categorylist = Response[1].data.data;
          this.typelist = Response[2].data.data;
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
          console.log("values", values);
          var datas = Object.assign(values, {
            id: this.draftId,
          });
          this.methoeds(datas)
            .then((res) => {
              console.log("res", res), (this.formDialog = false);
              this.loadDataSrouce();
            })
            .catch((err) => {
              console.log(err);
              this.formDialog = false;
              this.$message.error(err.Response.data.message);
            });
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    // 编辑
    onEnter(record) {
      this.formDialog = true;
      this.draftId = record.id;
      this.titles = "编辑建议";
      this.methoeds = message_edit;
      this.$nextTick(() => {
        if (record.mobile) {
          this.$refs.forms.show(["name", "address", "mobile", "email"]);
          this.$nextTick(() => {
            this.$refs.forms.setData(Object.assign(record, { mode: "留名" }));
          });
        } else {
          this.$refs.forms.hide(["name", "address", "mobile", "email"]);
          this.$nextTick(() => {
            this.$refs.forms.setData(Object.assign(record, { mode: "匿名" }));
          });
        }
      });
    },
    // 添加
    onAdd() {
      this.formDialog = true;
      this.draftId = undefined;
      this.titles = "新增建议";
      this.methoeds = message_create;
      this.$nextTick(() => {
        this.$refs.forms.hide(["name", "address", "mobile", "email"]);
        this.$refs.forms.setData({
          content: undefined,
        });
        this.$refs.forms.reset();
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
    deletesmessage(record) {
      message_delete({ id: record.id })
        .then(() => {
          this.loadDataSrouce();
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.Response.data.message);
        });
    },
    restoremessage(record){
      message_restore({ id: record.id })
        .then(() => {
          this.loadDataSrouce();
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.Response.data.message);
        });
    },
    // 分页
    changepage(page, pageSize) {
      console.log(page, pageSize);
      this.searchform.page = page;
      this.searchform.per_page = pageSize;
      this.loadDataSrouce();
    },
    onRecycles() {
      this.loadDataSrouce();
    },

    loadDataSrouce() {
      this.loading = true;
      message_paginate(this.searchform)
        .then((res) => {
          console.log("res123", res);
          this.loading = false;
          this.loadingsearch = false;
          this.loadingreset = false;
          this.dataSource = res.data.data;
        })
        .catch((err) => {
          console.log("err", err);
        });
      // setTimeout(() => {
      //   this.dataSource = {
      //     items: [
      //       {
      //         id: 0,
      //         title: "测试标题",
      //         category: "管理",
      //         type: "建议",
      //         mode: "匿名",
      //         content:
      //           "随着国民素质的提高，现在的父母为了让孩子德智体美劳全面发展，也为了让孩子赢在起跑线上，从小便让他们学习各种知识，培养兴趣，而这些教育资源对于出身于贫困地区的孩子来说，几乎是接触不到的。",
      //         images: [],
      //         video: [],
      //       },
      //       {
      //         id: 1,
      //         title: "测试标题",
      //         category: "管理",
      //         type: "建议",
      //         mode: "匿名",
      //         content:
      //           "随着国民素质的提高，现在的父母为了让孩子德智体美劳全面发展，也为了让孩子赢在起跑线上，从小便让他们学习各种知识，培养兴趣，而这些教育资源对于出身于贫困地区的孩子来说，几乎是接触不到的。",
      //         images: [],
      //         video: [],
      //       },
      //       {
      //         id: 2,
      //         title: "测试标题",
      //         category: "管理",
      //         type: "建议",
      //         mode: "留名",
      //         name: "李煜",
      //         address: "东昌府区振兴东路荣盛水岸花语",
      //         telephone: "18355888855",
      //         mail: "18355888855@163.com",
      //         content:
      //           "随着国民素质的提高，现在的父母为了让孩子德智体美劳全面发展，也为了让孩子赢在起跑线上，从小便让他们学习各种知识，培养兴趣，而这些教育资源对于出身于贫困地区的孩子来说，几乎是接触不到的。",
      //         images: [
      //           {
      //             type: "img",
      //             name: "004.png",
      //             status: "done",
      //             uid: "vc-upload-1657945595875-7",
      //             url: "/resources/public/20220716/62d24465cc1561a8c3527894.png",
      //           },
      //         ],
      //         video: [],
      //       },
      //       {
      //         id: 3,
      //         title: "测试标题",
      //         category: "管理",
      //         type: "建议",
      //         mode: "匿名",
      //         content:
      //           "随着国民素质的提高，现在的父母为了让孩子德智体美劳全面发展，也为了让孩子赢在起跑线上，从小便让他们学习各种知识，培养兴趣，而这些教育资源对于出身于贫困地区的孩子来说，几乎是接触不到的。",
      //         images: [
      //           {
      //             type: "img",
      //             name: "004.png",
      //             status: "done",
      //             uid: "vc-upload-1657945595875-7",
      //             url: "/resources/public/20220716/62d24465cc1561a8c3527894.png",
      //           },
      //         ],
      //         video: [
      //           {
      //             type: "file",
      //             name: "b_PJzvhT1gEpGy1565263937.mp4",
      //             status: "done",
      //             uid: "62d24474cc1561a8c3527896",
      //             url: "/resources/public/20220716/62d24474cc1561a8c3527897.mp4",
      //           },
      //         ],
      //       },
      //       {
      //         id: 4,
      //         title: "测试标题",
      //         category: "管理",
      //         type: "建议",
      //         mode: "匿名",
      //         content:
      //           "随着国民素质的提高，现在的父母为了让孩子德智体美劳全面发展，也为了让孩子赢在起跑线上，从小便让他们学习各种知识，培养兴趣，而这些教育资源对于出身于贫困地区的孩子来说，几乎是接触不到的。",
      //         images: [],
      //         video: [],
      //       },
      //       {
      //         id: 5,
      //         title: "测试标题",
      //         category: "管理",
      //         type: "建议",
      //         mode: "匿名",
      //         content:
      //           "随着国民素质的提高，现在的父母为了让孩子德智体美劳全面发展，也为了让孩子赢在起跑线上，从小便让他们学习各种知识，培养兴趣，而这些教育资源对于出身于贫困地区的孩子来说，几乎是接触不到的。",
      //         images: [],
      //         video: [],
      //       },
      //       {
      //         id: 6,
      //         title: "测试标题",
      //         category: "管理",
      //         type: "建议",
      //         mode: "匿名",
      //         content:
      //           "随着国民素质的提高，现在的父母为了让孩子德智体美劳全面发展，也为了让孩子赢在起跑线上，从小便让他们学习各种知识，培养兴趣，而这些教育资源对于出身于贫困地区的孩子来说，几乎是接触不到的。",
      //         images: [],
      //         video: [],
      //       },
      //       {
      //         id: 7,
      //         title: "测试标题",
      //         category: "管理",
      //         type: "建议",
      //         mode: "匿名",
      //         content:
      //           "随着国民素质的提高，现在的父母为了让孩子德智体美劳全面发展，也为了让孩子赢在起跑线上，从小便让他们学习各种知识，培养兴趣，而这些教育资源对于出身于贫困地区的孩子来说，几乎是接触不到的。",
      //         images: [],
      //         video: [],
      //       },
      //       {
      //         id: 8,
      //         title: "测试标题",
      //         category: "管理",
      //         type: "建议",
      //         mode: "匿名",
      //         content:
      //           "随着国民素质的提高，现在的父母为了让孩子德智体美劳全面发展，也为了让孩子赢在起跑线上，从小便让他们学习各种知识，培养兴趣，而这些教育资源对于出身于贫困地区的孩子来说，几乎是接触不到的。",
      //         images: [],
      //         video: [],
      //       },
      //       {
      //         id: 9,
      //         title: "测试标题",
      //         category: "管理",
      //         type: "建议",
      //         mode: "留名",
      //         name: "李煜",
      //         address: "东昌府区振兴东路荣盛水岸花语",
      //         telephone: "18355888855",
      //         mail: "18355888855@163.com",
      //         content:
      //           "随着国民素质的提高，现在的父母为了让孩子德智体美劳全面发展，也为了让孩子赢在起跑线上，从小便让他们学习各种知识，培养兴趣，而这些教育资源对于出身于贫困地区的孩子来说，几乎是接触不到的。",
      //         images: [
      //           {
      //             type: "img",
      //             name: "004.png",
      //             status: "done",
      //             uid: "vc-upload-1657945595875-7",
      //             url: "/resources/public/20220716/62d24465cc1561a8c3527894.png",
      //           },
      //         ],
      //         video: [
      //           {
      //             type: "file",
      //             name: "b_PJzvhT1gEpGy1565263937.mp4",
      //             status: "done",
      //             uid: "62d24474cc1561a8c3527896",
      //             url: "/resources/public/20220716/62d24474cc1561a8c3527897.mp4",
      //           },
      //         ],
      //       },
      //     ],
      //     page: this.searchform.page,
      //     per_page: this.searchform.per_page,
      //     total: 100,
      //   };
      //   this.loading = false;
      //   this.loadingsearch = false;
      //   this.loadingreset = false;
      // }, 500);
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
    //详情
    getdetailes(record){
      
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
    // 表单变动
    changes(value, key) {
      if (key == "mode") {
        if (value == "留名") {
          this.$refs.forms.show(["name", "address", "mobile", "email"]);
        } else {
          this.$refs.forms.hide(["name", "address", "mobile", "email"]);
        }
      }
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
