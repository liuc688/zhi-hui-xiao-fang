<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <a-form-model layout="horizontal" :model="searchform" ref="searchform" style="margin-top:15px">
      <a-row>
        <a-col :md="8" :sm="24">
          <a-form-model-item
            label="关键字"
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 18 }"
          >
            <a-input
              v-model="searchform.keyword"
              placeholder="请输入查询关键字"
              allowClear
            />
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item
            label="指定日期"
            :labelCol="{ span: 7 }"
            :wrapperCol="{ span: 16 }"
          >
            <a-select
              placeholder="请选择"
              v-model="searchform.scope"
              allowClear
            >
              <a-select-option
                v-for="(item, key) in dynamicData.scope"
                :key="key"
                :value="key"
                >{{ item }}</a-select-option
              >
            </a-select>
          </a-form-model-item>
        </a-col>

        <template v-if="advanced">
          <a-col :md="8" :sm="24">
            <a-form-model-item
              label="时间范围"
              :labelCol="{ span: 7 }"
              :wrapperCol="{ span: 16 }"
              format="YYYY-MM-DD"
            >
              <a-range-picker
                style="width: 100%"
                v-model="searchform.rangedata"
                @change="onTimerRangeChange"
                allowClear
              />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item
              label="意见状态"
              :labelCol="{ span: 4 }"
              :wrapperCol="{ span: 18 }"
            >
              <a-select
                placeholder="请选择"
                v-model="searchform.status"
                allowClear
              >
                <a-select-option value="1">未开始征集</a-select-option>
                <a-select-option value="2">征集中</a-select-option>
                <a-select-option value="3">已结束</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <!-- 
          <a-col :md="6" :sm="24">
            <a-form-model-item
              label="组织部门"
              :labelCol="{ span: 7 }"
              :wrapperCol="{ span: 16 }"
            >
              <a-tree-select
                style="width: 100%"
                show-search
                v-model="searchform.site"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="siteList"
                placeholder="请选择搜索站点"
                allow-clear
                :replaceFields="{
                  title: 'title',
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
              >
                <span
                  slot="title"
                  slot-scope="{ key, value }"
                  style="color: #08c"
                  >Child Node1 {{ value }}</span
                >
              </a-tree-select>
            </a-form-model-item>
          </a-col> 
          -->
          <a-col :md="8" :sm="24">
            <a-form-model-item
              label="是否征集到意见"
              :labelCol="{ span: 7 }"
              :wrapperCol="{ span: 16 }"
            >
              <a-select
                placeholder="请选择"
                v-model="searchform.opinion"
                allowClear
              >
                <a-select-option value="2">是</a-select-option>
                <a-select-option value="1">否</a-select-option>
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
    <a-row style="padding: 10px 0px">
      <a-col :span="24" style="text-align: left">
        <a-space>
          <a-button  @click="onAdd" v-auth="`draft.add`">
            <a-icon type="plus" />新增
          </a-button>
          <!-- 
          <a-button type="primary" @click="addmold" v-auth="`mold.paginate`">
            <a-icon type="setting" />草案分类
          </a-button> 
          -->
        </a-space>
      </a-col>
    </a-row>
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
            >清空</a
          >
          <a-divider type="vertical" v-if="this.selectedRowKeys.length > 0" class="clear"/>
          <a
            @click="deleteDraft"
            class="clear"
            v-auth="`draft.delete`"
            v-if="this.selectedRowKeys.length > 0"
            >删除</a
          >
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
        <a @click="toform(record)" style="color: #00aaf0">查看意见</a>
      </span>
      <span slot="status" slot-scope="text, record">
        {{ opinion_status[record._extension.status] }}
      </span>
      <span slot="countent" slot-scope="text, record">
        {{ record.opinions.length }}条
      </span>
      <span slot="titles" slot-scope="text, record">
        <a
          @click="onEnter(record)"
          v-auth="`draft.update`"
          style="color: #00aaf0"
          >{{ record.title }}</a
        >
      </span>
      <span slot="start" slot-scope="text,record">
        {{record.start.substring(0, 10)}}
      </span>
      <span slot="end" slot-scope="text,record">
        {{record.end.substring(0, 10)}}
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
      <k-form-build :value="jsonData" :dynamicData="dynamicData" ref="forms" />
    </a-modal>
  </a-card>
</template>

<script>
import { form_get } from "@/services/forms";
import { draft_paginate, draft_delete } from "@/services/opinion";
import { organization_tree } from "@/services/organization";
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
      advanced: false,
      formDialog: false,
      confirmLoading: false,
      loading: true,
      loadingsearch: false,
      loadingreset: false,
      status: false,
      searchform: {},
      dataSource: [],
      jsonData: {},
      opinion_status: {
        0: "未开始",
        1: "征集中",
        2: "已结束",
      },
      columns: [
        {
          title: "标题",
          dataIndex: "title",
          scopedSlots: { customRender: "titles" },
        },
        {
          title: "组织部门",
          dataIndex: "site.title",
          width: "200px",
          scopedSlots: { customRender: "sitetitle" },
        },
        {
          title: "开始时间",
          dataIndex: "start",
          width: "120px",
          scopedSlots: { customRender: "start" },
        },
        {
          title: "结束时间",
          dataIndex: "end",
          width: "120px",
          scopedSlots: { customRender: "end" },
        },
        {
          title: "征集意见数",
          dataIndex: "countent",
          width: "120px",
          scopedSlots: { customRender: "countent" },
        },
        {
          title: "状态",
          dataIndex: "status",
          width: "100px",
          scopedSlots: { customRender: "status" },
        },
        {
          title: "操作",
          dataIndex: "action",
          width: "100px",
          scopedSlots: { customRender: "action" },
        },
      ],
      selectedRowKeys: [],
      pageSizeOptions: ["10", "20", "30", "40"],
      draftId: "",
      siteList: [],
      titles: "新增意见",
      molds: false,
    };
  },
  authorize: {
    onEnter: "draft.update",
    onAdd: "draft.add",
    deleteDraft: "draft.delete",
    addmold: "mold.paginate",
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
    // console.log("this.params", this.params);
  },
  methods: {
    // 增编 提交
    onSubmit() {
      this.$refs.forms
        .getData()
        .then((values) => {
          this.confirmLoading = true;
          var parems = {
            id: this.draftId,
            site: values.site,
            affiche: values.affiche,
            basic: values.basic,
            content: values.content,
            decision: values.decision,
            title: values.title,
            start: values.range[0],
            end: values.range[1],
            feedback: values.feedback,
            execution: values.execution,
          };
          this.methods(parems)
            .then(() => {
              this.confirmLoading = false;
              this.formDialog = false;
              this.$message.success("操作成功！");
              this.loadDataSrouce();
            })
            .catch((err) => {
              this.confirmLoading = false;
              this.formDialog = false;
              console.log("err", err);
            });
        })
        .catch((err) => {
          console.log("err", err);
          for (let i in err) {
            this.$message.warning(err[i].errors[0].message);
          }
        });
    },
    // 编辑
    onEnter(record) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "opinion-edit",
          params: {
            id: this.params.id ? this.params.id : "",
            data: record,
            searchform: Object.assign(this.searchform, this.pagination),
          },
        },
      });
      // this.formDialog = true;
      // this.draftId = data.id;
      // this.methods = draft_update;
      // this.titles = "编辑意见";
      // this.$nextTick(() => {
      //   this.$refs.forms.reset();
      //   this.$refs.forms.setData({
      //     site: data.site.id,
      //     title: data.title,
      //     affiche: data.affiche,
      //     content: data.content,
      //     basic: data.basic,
      //     range: [data.start, data.end],
      //     decision: data.decision || "",
      //     feedback: data.feedback || "",
      //     execution: data.execution || "",
      //   });
      // });
    },
    // 添加
    onAdd() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "opinion-edit",
          params: {
            id: this.params.id ? this.params.id : "",
            searchform: Object.assign(this.searchform, this.pagination),
          },
        },
      });

      // this.formDialog = true;
      // this.draftId = undefined;
      // this.titles = "新增意见";
      // this.methods = draft_add;
      // this.$nextTick(() => {
      //   this.$refs.forms.reset();
      // });
    },
    // 删除 草案
    deleteDraft() {
      var that = this;
      this.$confirm({
        title: "您确定要删除此草案吗?",
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
    init() {
      this.searchform = this.params.searchform || this.searchform;
      Promise.all([form_get({ name: "edit_opinion" }), organization_tree()])
        .then((Response) => {
          this.jsonData = Response[0].data.data.form;
          this.siteList = Response[1].data.data;
          // this.dynamicData.sitelist = Response[1].data.data;
          this.loadDataSrouce();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 分页
    changepage(page, pageSize) {
      this.searchform.page = page;
      this.searchform.per_page = pageSize;
      this.loadDataSrouce();
    },

    loadDataSrouce() {
      this.loading = true;
      // if (this.params.id) {
      //   this.searchform.site = this.params.id;
      // }
      // else {
      //   this.searchform.site = undefined
      // }
      this.searchform.site = this.params.id ? this.params.id : "";
      draft_paginate(this.searchform)
        .then((response) => {
          this.dataSource = response.data.data;
          this.loading = false;
          this.loadingsearch = false;
          this.loadingreset = false;
        })
        .catch((error) => {
          console.log("erroe", error);
          this.loading = false;
          this.loadingsearch = false;
          this.loadingreset = false;
        });
    },
    onSearch() {
      this.loading = true;
      this.loadingsearch = true;
      this.searchform.page = 1;
      this.searchform.per_page = 10;
      this.loadDataSrouce();
    },
    onTimerRangeChange(data, strdate) {
      if (strdate && strdate.length) {
        this.searchform.start = strdate[0];
        this.searchform.end = strdate[1];
      } else {
        this.searchform.start = undefined;
        this.searchform.end = undefined;
      }
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
    addmold() {
      this.molds = true;
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
