<template>
  <div style="padding: 0 30px">
    <a-form-model
      ref="searchForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :model="searchForm"
    >
      <a-row>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-model-item label="关键字"
            ><a-input
              style="width: 100%"
              placeholder="请输入"
              allowClear
              v-model="searchForm.keyword"
          /></a-form-model-item>
        </a-col>

        <a-col :lg="8" :md="12" :sm="24">
          <div style="padding-left: 50px; margin-top: 3px">
            <a-button
              type="primary"
              @click="onSearch"
              html-type="submit"
              :loading="loading"
              >查询</a-button
            >
            <a-button style="margin-left: 8px" @click="onReset">重置</a-button>
          </div>
        </a-col>
      </a-row>
    </a-form-model>
    <a-tabs type="card" :activeKey="activeKey" @change="callback">
      <a-tab-pane key="1" tab="我的模板">
      </a-tab-pane>
      <a-tab-pane key="2" tab="分享的模板" force-render>
      </a-tab-pane>
    </a-tabs>
    <div style="width: 100%; padding: 5px 10px" v-if="activeKey == '1'">
      <a-space
        ><a-button icon="plus" @click="onAdd()" v-if="params.id"
          >新建模版</a-button
        ></a-space
      >
    </div>
    <div style="width:100%;display: inline-block;">
      <a-list
        :grid="{ gutter: 24, xl: 6, lg: 3, md: 3, sm: 2, xs: 1 }"
        style="margin: 0 -8px" :loading="loading"
      >
        <a-list-item
          :key="record.id"
          v-for="record in data.items"
          style="padding: 0 8px"
        >
          <a-card class="card_s">
            <img
              slot="cover"
              @click="onPicPreview(record)"
              :src="record.images | image"
              height="154"
              style="cursor: pointer"
            />
            <a @click="dirRecord(record)" class="templets_s">
              <a-card-meta>
                <template slot="title">
                  <a-tooltip
                    :title="record.title"
                  >
                    {{ record.title }}
                  </a-tooltip>
                </template>
                <div slot="description" style="overflow: hidden;text-overflow: ellipsis;">{{ record.name || ''}}</div>
              </a-card-meta>
              <div class="content">
                <span>{{ record._createtime }}</span>
              </div>
            </a>
            <span slot="actions" v-if="record.ishare">此模版来自于分享</span>
            <template v-else>
              <a slot="actions" @click="onEdit(record)" v-if="activeKey == '1'">
                <a-tooltip title="编辑" :get-popup-container="getPopupContainer"
                  ><a-icon type="edit"
                /></a-tooltip>
              </a>
              <a slot="actions" @click="deleteRecord(record)" v-if="activeKey == '1'">
                <a-tooltip title="删除" :get-popup-container="getPopupContainer"
                  ><a-icon type="delete"
                /></a-tooltip>
              </a>
              <a slot="actions" @click="onShare(record)" v-if="activeKey == '1'">
                <a-tooltip title="分享" :get-popup-container="getPopupContainer"
                  ><a-icon type="share-alt"
                /></a-tooltip>
              </a>
              <a slot="actions" @click="uploads(record)" v-else>
                <a-tooltip title="下载" :get-popup-container="getPopupContainer"
                  ><a-icon type="download" /></a-tooltip>
              </a>
            </template>
            <a slot="actions" @click="onNote(record)">
              <a-tooltip title="文档" :get-popup-container="getPopupContainer"
                ><a-icon type="form"
              /></a-tooltip>
            </a>
          </a-card>
        </a-list-item>
      </a-list>
    </div>
    <a-pagination
      size="small"
      style="text-align: right; padding: 15px 0"
      :current="pagination.page"
      :defaultPageSize="pagination.per_page"
      @change="onChangePage"
      @showSizeChange="onChangePage"
      :pageSizeOptions="['12', '24', '36', '48']"
      :total="data.total"
      show-size-changer
      show-quick-jumper
      :show-total="(total) => `共 ${total} 条`"
    ></a-pagination>

    <a-modal
      :title="edittitle"
      :visible="visible"
      :width="900"
      :confirm-loading="loading"
      :maskClosable="false"
      @ok="onok"
      @cancel="
        () => {
          this.$refs.forms.reset();
          visible = false;
        }
      "
    >
      <k-form-build
        :value="forms"
        ref="forms"
        :dynamicData="dynamicData"
        :config="config"
      />
    </a-modal>
    <pic-preview
      :file-preview-show="previewShow"
      :img-list="preImages"
      @close="() => (previewShow = false)"
    ></pic-preview>

    <a-modal
      title="分享"
      :visible="shareVisible"
      :width="900"
      :confirm-loading="loading"
      :maskClosable="false"
      @ok="shareRecord"
      @cancel="
        () => {
          shareVisible = false;
        }
      "
    >
      <a-tree-select
        style="width: 100%"
        show-search
        multiple
        allowClear
        @change="treeSelectChange"
        v-model="organization"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        :treeData="organizations"
        placeholder="请选择搜索站点"
        :replaceFields="{
          key: 'id',
          value: 'id',
        }"
        :filterTreeNode="
          (value, node) => {
            const data = node.componentOptions.propsData.dataRef;
            return (
              data.title.indexOf(value) !== -1 ||
              data.name.indexOf(value) !== -1
            );
          }
        "
      ></a-tree-select>
    </a-modal>
    <a-modal
      title="描述"
      :visible="noteVisible"
      :width="900"
      :confirm-loading="loading"
      :maskClosable="false"
      @ok="
        () => {
          noteVisible = false;
        }
      "
      @cancel="
        () => {
          noteVisible = false;
        }
      "
    >
      <mark-down-editor v-model="note" :readonly="true"></mark-down-editor>
    </a-modal>
  </div>
</template>

<script>
import MarkDownEditor from "@/components/MarkDownEditor";
import {
  template_add,
  template_paginate,
  template_edit,
  template_share,
  template_delete,
  template_sharepaginate,
  template_download
} from "@/services/templates";
import PicPreview from "@/components/PicPreview";
import image from "../../../../assets/images/bg.jpg";
import Cookie from "js-cookie";

export default {
  components: { PicPreview, MarkDownEditor },
  props: {
    params: {
      //传递的数据
      type: Object,
    },
    forms: {
      type: Object,
    },
    event: {
      type: Function,
    },
    organizations: {
      type: Array,
    },
  },
  data() {
    return {
      loading: false,
      previewShow: false,
      preImages: [],
      data: {},
      columns: [
        {
          title: "标题",
          dataIndex: "title",
          scopedSlots: { customRender: "_title" },
        },
        {
          title: "标识",
          dataIndex: "name",
        },
        {
          title: "入口文件",
          dataIndex: "main",
        },
        {
          title: "操作",
          scopedSlots: {
            customRender: "action",
          },
          align: "center",
        },
      ],
      visible: false,
      shareVisible: false,
      noteVisible: false,
      jsonData: {},
      orglist: [],
      id: "",
      //
      selectedRows: [],
      datadetailes: {},
      //
      searchForm: {},
      labelCol: { span: 5 },
      wrapperCol: { span: 18, offset: 1 },
      advanced: false,
      edittitle: "添加",
      editId: "",
      organization: [],
      methods_act: null,
      // 组织
      mockData: [],
      currentData: {},
      note: null,
      activeKey: '1'
    };
  },
  filters: {
    image(val) {
      if (val && val.length) {
        return val[0].url;
      } else {
        return image;
      }
    },
  },
  created() {
    console.log("params", this.params)
    this.init();
  },
  authorize: {},
  computed: {
    pagination: {
      get() {
        return {
          page: this.data.page || 1,
          per_page: this.data.per_page || 12,
        };
      },
      set(val) {
        this.data.page = val.page;
        this.data.per_page = val.per_page;
      },
    },
    dynamicData() {
      let result = {};

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
  },
  methods: {
    init() {
      this.id = this.params ? this.params.id : undefined;
      if(this.id){
        this.paginate();
      // }else{
        // this.$message.error("请选择站点！")
      }
    },
    paginate() {
      this.loading = true;
      template_paginate(
        Object.assign(
          this.pagination,
          Object.assign(
            {
              id: this.id,
            },
            this.searchForm
          )
        )
      )
        .then((response) => {
          this.loading = false;
          this.$nextTick(() => {
            this.data = response.data.data;
          });
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    sharepaginate() {
      this.loading = true;
      var dats = Object.assign(
          this.pagination,
          this.searchForm,
          {
            id:this.id,
          }
        )
      template_sharepaginate(dats)
        .then((response) => {
          this.loading = false;
          this.$nextTick(() => {
            this.data = response.data.data;
          });
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    onPicPreview(record) {
      this.preImages = record.images.map((item) => item.url);
      this.previewShow = true;
    },
    onClear() {
      this.$message.info("您清空了勾选的所有行");
    },
    onNote(record) {
      console.log(record);
      this.note = record.note;
      this.noteVisible = true;
    },
    onChangePage(page, pageSize) {
      this.loading = true;
      this.pagination.page = page;
      this.pagination.per_page = pageSize;
      if(this.activeKey == '1'){
        this.paginate();
      }else{
        this.sharepaginate()
      }
    },

    deleteRecord(record) {
      if (record.ishare) {
        this.$message.error("被分享的模板无法删除");
        return;
      }
      let ids = [record.id];
      const that = this;
      this.$confirm({
        title: "确定要删除此模版吗?",
        content: "该操作不可逆 !请谨慎操作 !",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          template_delete({
            id: ids,
          })
            .then((response) => {
              const { status, message } = response.data;
              if (status) {
                that.$message.success(message);
                that.init();
                that.loading = false;
              } else {
                that.$message.error(message);
                that.loading = false;
              }
            })
            .catch((error) => {
              console.log(error);
              that.$message.error("删除失败");
              that.loading = false;
            });
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    treeSelectChange() {},
    onShare(record) {
      this.shareVisible = true;
      this.currentData = record;
      this.organization = record.share;
    },
    // 下载
    uploads(record){
      var datas={
        site: this.id,
        id: record.id
      }
      template_download(datas).then(res=>{
        console.log('res', res)
        this.$message.success(res.data.message)

      }).catch(err=>{
        console.log(err)
        this.$message.error(err.response.data.message)
      })
    },
    //分享
    shareRecord() {
      this.loading = true;
      if (this.currentData.ishare) {
        this.$message.error("被分享的模板无法再分享");
        return;
      }
      const formData = {
        id: this.currentData.id,
        organization: this.organization,
      };
      template_share(formData)
        .then((response) => {
          const { status, message } = response.data;
          if (status) {
            this.$message.success(message);
            this.init();
          } else {
            this.$message.error(message);
          }
          this.shareVisible = false;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.init();
          this.shareVisible = false;
          this.loading = false;
        });
    },
    //模板目录
    dirRecord(record) {
      if (record.ishare) {
        this.$message.error("被分享的模板无法查看目录");
        return;
      }
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "template-folder",
          params: record,
        },
      });
    },
    // 用户添加
    onAdd() {
      this.visible = true;
      this.editId = undefined;
      this.edittitle = "添加模板";
      this.methods_act = template_add;
    },
    // 用户表单增编
    onEdit(record) {
      if (record.ishare) {
        this.$message.error("被分享的模板无法编辑");
        return;
      }
      this.visible = true;
      this.edittitle = "编辑模板";
      this.editId = record.id;
      this.methods_act = template_edit;
      this.$nextTick(() => {
        this.organization = record.organization;
        this.$refs.forms.setData({
          title: record.title,
          name: record.name,
          main: record.main,
          images: record.images,
          note: record.note,
        });
      });
    },
    onok() {
      this.loading = true;
      this.$refs.forms
        .getData()
        .then((res) => {
          const formData = Object.assign(res, {
            id: this.editId,
            parent: this.id,
          });
          this.methods_act(formData)
            .then((response) => {
              if (response.data.status) {
                this.init();
                this.visible = false;
                this.loading = false;
              } else {
                this.$message.error(response.data.message);
                this.loading = false;
              }
            })
            .catch((error) => {
              console.log(error);
              this.$message.error(error.response.data.message);
              this.loading = false;
            });
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },
    onSearch() {
      this.pagination = {
        per_page: 12,
        page: 1,
      };
      this.loading = true;
      this.paginate();
    },
    onReset() {
      this.loading = true;
      this.searchForm = {};
      this.pagination = {
        per_page: 12,
        page: 1,
      };
      this.paginate();
    },
    getPopupContainer(trigger) {
      return trigger.parentElement;
    },
    callback(e){
      console.log('e' , e)
      this.activeKey = e
      this.pagination = {
        per_page: 12,
        page: 1,
      };
      if(e == '1' ){
        this.paginate();
      }else{
        this.sharepaginate()
      }

    },
  },
};
</script>

<style scoped>
.new-btn {
  border-radius: 2px;
  width: 100%;
  height: 270px;
}
.templets_s{
  background: #c9c9c9;
}
.card_s >>> .ant-card-body{
  padding: 5px;
  background: #f7fbff;
}
</style>
