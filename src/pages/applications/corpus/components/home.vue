<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <a-form-model layout="horizontal" :model="searchform" ref="searchform">
      <a-row>
        <a-col :md="6" :sm="24">
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
        <a-col :md="6" :sm="24" style="margin-top: 2px">
          <a-form-model-item
            label="类型"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-select
              allowClear
              placeholder="请选择类型"
              v-model="searchform.guide"
            >
              <a-select-option value="0"> 语料 </a-select-option>
              <a-select-option value="1"> 导办 </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :md="6" :sm="24" style="margin-bottom: 10px; padding-left: 6.3%">
          <span
            style="
              float: left;
              margin-top: 3px;
              display: block;
              margin-bottom: 24px;
              white-space: nowrap;
            "
          >
            <a-button type="primary" :loading="loadingsearch" @click="onSearch">查询
            </a-button>
            <a-button style="margin-left: 8px" @click="resetForm()">
              重置
            </a-button>
          </span>
        </a-col>
      </a-row>
      <a-row style="margin-bottom: 10px">
        <a-button-group>
          <a-button type="primary" @click="onAdd_yulc">
            <a-icon type="plus" />语料新增
          </a-button>
          <a-button type="primary" @click="onAdd_dkbj">
            <a-icon type="plus" />导办新增
          </a-button>
        </a-button-group>
        <a-button
          style="margin-left: 15px"
          icon="sync"
          @click="onSync"
          :loading="loading_sync"
        >
          同步
        </a-button>
      </a-row>
    </a-form-model>

    <div class="alert">
      <a-alert type="info" :show-icon="true">
        <div class="message" slot="message">
          已选择&nbsp;
          <a>{{ selectedRowKeys.length }}</a>
          &nbsp;项
          <!-- <a @click="onDeleteS()" type='link' v-show="selectedRowKeys.length" style="margin-left:15px;color:red !important"> 批量删除 </a> -->
          <a
            class="clear"
            @click="onSelectClear"
            v-if="this.selectedRowKeys.length > 0"
          >
            清空
          </a>
        </div>
      </a-alert>
    </div>
    <a-table
      ref="table"
      bordered
      class="table_content"
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
      <span slot="titless" slot-scope="text, record" class="colorr">
        {{ record.title }}
      </span>
      <span slot="Preview" slot-scope="text, record">
        <a type="primary" @click="showModal(record)" style="font-size: 16px">
          查看
        </a>
        <a-divider type="vertical"></a-divider>
        <a type="primary" @click="yulc_edit(record)" style="font-size: 16px">
          编辑
        </a>
        <a-divider type="vertical"></a-divider>
        <a
          type="primary"
          @click="yulc_delete(record)"
          style="font-size: 16px; color: red !important"
        >
          删除
        </a>
      </span>

      <span slot="organization" slot-scope="text, record">
        <span style="color: #1890ff" v-if="record.guide == 0">
          <a-tag color="#2db7f5" style="padding: 0 15px">语料</a-tag>
        </span>
        <span style="color: #1890ff" v-if="record.guide == 1">
          <a-tag color="#f50" style="padding: 0 15px">导办</a-tag>
        </span>
      </span>
      <!-- 创建人列样式自定义 -->
      <span slot="domain" slot-scope="text,record">
        <span v-if="text">
          {{text}}
        </span>
        <span v-else>
          匿名
        </span>
      </span>
      <!-- 修改人列样式自定义 -->
      <span slot="site" slot-scope="text,record">
        <span v-if="text">
          {{text}}
        </span>
        <span v-else>
          匿名
        </span>
      </span>
    </a-table>
    <a-pagination
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
    >
    </a-pagination>
    <a-modal
    title="语料新增"
    width="850px"
    :visible="visible_yulc"
    :maskClosable="false"
    @ok="onSubmit_yulc"
    @cancel="cancel_yulc"
    class="yulc_box"
    >
      <a-form-model
      :label-col="title_col"
      :wrapper-col="wrapper_col"
      >
        <a-form-model-item ref="title">
          <span slot="label" style="font-size: 16px">语料标题</span>
          <a-input placeholder="请输入语料标题" v-model="yulc_title"></a-input>
        </a-form-model-item>
      </a-form-model>
      <a-form-model :wrapper-col="wrapperCol">
        <div
        v-for="(item, index) in yulc_lib"
        :key="item.id"
        class="jieduanDetail"
        >
          <!-- 内容答案 -->
          <div class="header_detail">
            <span style="font: size 16px" class="header_details_ans">
              答案({{ index + 1 }})
            </span>
            <a-button
            class="header_details_butt"
            v-if="yulc_lib.length > 0"
            icon="delete"
            :disabled="yulc_lib.length === 0"
            @click="removeDomain(item)"
            >
              删除 
            </a-button>
          </div>
          <a-form-model-item>
            <a-input :rows="4" v-model="yulc_lib[index]" type="textarea" />
          </a-form-model-item>
        </div>
        <a-form-model-item :wrapperCol="{ span: 24 }">
          <a-button
          @click="addDomain"
          type="dashed"
          icon="plus"
          style="margin: 5px 8px 5px 0; width: 100%"
          >
            添加语料答案
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal
    title="导办新增"
    width="850px"
    :visible="visible_dkbj"
    :maskClosable="false"
    @ok="onSubmit_dkbj"
    @cancel="onCancel_dkbj"
    
    class="guideModule"
    >
      <k-form-build :value="jsonData_dkbj" ref="jsonData_dkbj" />
    </a-modal>
  </a-card>
</template>

<script>
import { form_get } from "@/services/forms";
import {
  corpus_paginate,
  corpus_create,
  corpus_delete,
  corpus_edit,
  corpus_get,
  corpus_static,
  corpus_title_verify,
} from "@/services/corpus";
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
      visible_yulc: false,
      visible_dkbj: false,
      wrapperCol: { span: 24 },
      title_col: { span: 24 },
      wrapper_col: { span: 24 },
      loading: false,
      content: "",
      titled: "",
      type: [],
      domain: [],
      site: [],
      organization: {},
      loadingsearch: false,
      searchform: {
        page:1,
        per_page:10,
      },
      dataSource: {},
      columns: [
        {
          title: "标题",
          dataIndex: "title",
          scopedSlots: { customRender: "titless" },
          ellipsis: true,
        },
        {
          title: "类型",
          dataIndex: "organization",
          align: "center",
          scopedSlots: { customRender: "organization" },
          ellipsis: true,
        },

        {
          title: "创建人",
          dataIndex: "_creator.nickname",
          align: "center",
          scopedSlots: { customRender: "domain" },
          ellipsis: true,
        },
        {
          title: "创建时间",
          dataIndex: "_createtime",
          align: "center",
          scopedSlots: { customRender: "lasttime" },
          ellipsis: true,
        },
        {
          title: "修改人",
          dataIndex: "_modifier.nickname",
          align: "center",
          scopedSlots: { customRender: "site" },
          ellipsis: true,
        },
        {
          title: "修改时间",
          dataIndex: "_modifytime",
          align: "center",
          scopedSlots: { customRender: "type" },
          ellipsis: true,
        },

        {
          title: "预览",
          dataIndex: "content",
          align: "center",
          scopedSlots: { customRender: "Preview" },
        },
      ],
      selectedRowKeys: [],
      pageSizeOptions: ["10", "20", "30", "40"],
      jsonData_dkbj: {},
      yulc_title: "",
      yulc_lib: [],
      content_detail: [],
      loading_sync: false,
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
  },
  created() {
    this.init();
    this.list();
  },
  methods: {
    //预览弹窗的显示
    showModal(data) {
      corpus_get({ id: data.id }).then((res) => {
        this.content_detail = res.data.data.content;
        this.$emit("event", {
          method: "onLink",
          params: {
            route: "details_list",
            params: {
              content_detail: this.content_detail,
              data: data,
              searchform: Object.assign(this.searchform),
            },
          },
        });
      });
    },
    init() {
      this.searchform = this.params.searchform || this.searchform;
      form_get({ name: "dkbj_add" })
      .then((response) => {
        this.jsonData_dkbj = response.data.data.form;
      })
      .catch((error) => {
        this.$message.error(error);
      });
    },
    list() {
      this.searchloading = true;
      this.loading = true;
      corpus_paginate(this.searchform)
        .then((res) => {
          console.log("nihk", res);
          this.dataSource = res.data.data;
          this.forwards = res.data.data.forward;
          this.total = res.data.data.total;
          this.searchloading = false;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.searchloading = false;
          this.loading = false;
        });
    },
    // 分页
    changepage(page, pageSize) {
      this.searchform.page = page;
      this.searchform.per_page = pageSize;
      this.list();
    },
    onSearch() {
      this.searchform.page = 1;
      this.searchform.per_page = 10;
      this.list();
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
    onSelectClear() {
      this.selectedRowKeys = [];
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    resetForm() {
      this.searchform = {};
      this.list();
    },
    onAdd_yulc() {
      this.visible_yulc = true;
      this.$nextTick(() => {
        this.mothed_yulc = corpus_create;
        this.id = undefined;
      });
    },
    onSubmit_yulc() {
      console.log("99999",this.yulc_lib)
      if(this.yulc_lib&&this.yulc_lib.length){  // 如果 yulc_lib 存在，并且 yulc_lib 数组的长度不为 0
        corpus_title_verify({ title: this.yulc_title })
        .then((response) => {
          console.log("标题检测",response)
          if (response.data.data || this.id) {
            this.mothed_yulc(
              Object.assign(
                { id: this.id },
                { title: this.yulc_title },
                { content: this.yulc_lib }
              )
            )
              .then((res) => {
                this.visible_yulc = false;
                this.yulc_title = "";
                this.yulc_lib = [];
                this.list();
              })
              .catch((err) => {
                console.log("hello err", err);
                this.$message.error(err.response.data.message);
                // this.visible_yulc = false;
                // this.yulc_title = "";
                // this.yulc_lib = [];
                this.list();
              });
          } else {
            this.$message.error("该标题已存在,请更换标题");
          }
        })
        .catch((err) => {
          this.$message.error(err.response.data.reason.title[0]);
        });
      } else {
        this.$message.error("答案不能为空")
      }
    },
    cancel_yulc() {
      this.visible_yulc = false;
      this.yulc_title = "";
      this.yulc_lib = [];
      this.list();
    },
    addDomain() {
      this.yulc_lib.push("");
    },
    removeDomain(item) {
      let index = this.yulc_lib.indexOf(item);
      if (index !== -1) {
        this.yulc_lib.splice(index, 1);
      }
    },
    // 语料编辑
    yulc_edit(item) {
      if (item.guide == 0) {
        corpus_get({ id: item.id }).then((res) => {
          this.yulc_title = res.data.data.title;
          this.yulc_lib = res.data.data.content;
        });
        this.id = item.id;
        this.visible_yulc = true;
        this.mothed_yulc = corpus_edit;
      }
      if (item.guide == 1) {
        this.visible_dkbj = true;
        this.id = item.id;
        console.log('hello,这里是导办编辑',this.id);
        this.$nextTick(() => {
          corpus_get({ id: item.id }).then((res) => {
            this.content_dkbj = res.data.data.content[0];
            this.mothed_dkbj = corpus_edit;
            this.$refs.jsonData_dkbj.setData({
              title: item.title,
              content: this.content_dkbj,
            });
          });
        });
      }
    },
    // 删除
    yulc_delete(data) {
      var that = this;
      this.$confirm({
        title: "您确定要删除此数据吗?",
        icon: "info-circle",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          var parems = {
            id: data.id,
          };
          corpus_delete(parems)
          .then(() => {
            that.$message.success("操作成功！");
            /*
            解决的问题是，如果在分页的最后一页，只有一条数据，执行删除操作，页面不会刷新到前一页，而是会让页面出现空白
            that.total-((that.searchform.page-1)*that.searchform.per_page) == 1 表示最后一页正好有一条数据，而且我们删除的也就是这一条
            那么，当删除完这条数据后，让 searchform.page 的值减 1
            */
            if(that.total-((that.searchform.page-1)*that.searchform.per_page) == 1) {
              that.searchform.page--;
            }
            that.list();
          })
          .catch((err) => {
            console.log(err);
            that.list();
          });
        },
        onCancel() {},
      });
    },
    // 批量删除
    // onDeleteS() {
    //   var that = this;
    //   this.$confirm({
    //     title: "您确定要删除此草案吗?",
    //     icon: "info-circle",
    //     okText: "确定",
    //     cancelText: "取消",
    //     onOk() {
    //       var parems = { id: that.selectedRowKeys };  // that.selectedRowKeys 是一个数组
    //       corpus_delete(parems)  // draft_delete 是删除接口
    //       .then(() => {
    //         that.$message.success("操作成功！");
    //         that.selectedRowKeys = [];  // 完成后，将 that.selectedRowKeys 数组置空

    //         that.list();
    //       })
    //       .catch((err) => { console.log(err) });
    //     },
    //     onCancel() {},
    //   });
    // },
    onAdd_dkbj() {
      this.visible_dkbj = true;
      this.$nextTick(() => {
        this.mothed_dkbj = corpus_create;
        this.id = undefined;
      });
    },
    // 新增导办时的弹窗中的确定按钮
    onSubmit_dkbj() {
      this.$refs.jsonData_dkbj.getData().then((data) => {
        corpus_title_verify({ title: data.title })
        .then((response) => {
          if (response.data.data || this.id) {
            this.mothed_dkbj(
              Object.assign(
                data,
                { id: this.id },
                { guide: 1 },
                { content: [data.content] }
              )
            )
              .then((res) => {
                this.visible_dkbj = false;
                this.$refs.jsonData_dkbj.reset();  // 富文本不是原来的自定义表单了，这里的 reset() 对富文本字段不管用
                // this.$refs.jsonData_dkbj = {};  // 新增成功之后，手动将自定义表单中的值置空，下一次新增的时候，是一个空表单
                this.$refs.jsonData_dkbj.setData({
                  content:' ',  // content 是富文本的字段名称，' ' 是一个空格
                })
                this.list();
              })
              .catch((err) => {
                console.log(err);
                this.visible_dkbj = false;
                this.$refs.jsonData_dkbj.reset();  // 富文本不是原来的自定义表单了，这里的 reset() 对富文本字段不管用
                // this.$refs.jsonData_dkbj = {};  // 新增失败之后，手动将自定义表单中的值置空，下一次新增的时候，是一个空表单
                this.$refs.jsonData_dkbj.setData({
                  content:' ',  // content 是富文本的字段名称，' ' 是一个空格
                })
                this.list();
              });
          } else {
            this.$message.error("该标题已存在,请更换标题");
          }
        })
        .catch((err) => {
          console.log(err);
        });
      });
    },
    // 新增导办时的弹窗中的取消按钮
    onCancel_dkbj(){
      this.visible_dkbj = false; 
      this.$refs.jsonData_dkbj.reset()  // 富文本不是原来的自定义表单了，这里的 reset() 对富文本字段不管用
      this.$refs.jsonData_dkbj.setData({
        content:' ',  // content 是富文本的字段名称，' ' 是一个空格
      })
    },
    // 语料同步
    onSync() {
      this.loading_sync = true;
      corpus_static()
        .then((response) => {
          this.$message.success(`同步${response.data.message}`);
          this.loading_sync = false;
        })
        .catch((error) => {
          this.$message.success("同步失败");
          this.loading_sync = false;
          console.log(error);
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
.yulc_box .ant-modal-body {
  max-height: 640px !important;
  overflow: auto;
}
</style>
<style lang="less" scoped>
a {
  color: #00bfff !important;
}
.model p {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  margin: 20px 60px;
}
.model div {
  height: 600px;
  padding: 0 99px;
  overflow: auto;
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
</style>

<style scoped>
.jieduanDetail {
  /* background-color: #ddd; */
  /* padding: 0 5px; */
  margin: 15px 0 20px 0;
  /* box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5); */
  box-shadow: #bcbcbc 0 0 10px;
  padding:  5px;
  border-radius: 8px;
}
.header_detail {
  position: relative;
  height: 55px;
  line-height: 55px;
  border-bottom: 1px dashed #CD5555;
  margin-bottom: 15px;
}
.header_details_ans {
  position: absolute;
  left: 5px;
  font-size: 22px;
  font-family: '华文行楷';
  color: 	#CD5555;
}
.header_details_butt {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translate(0, -50%);
  background: #CD5555 !important;
  color: #f0f0f0;
}
/* 导办弹窗内容区域高度限制 */
.guideModule >>> .ant-modal-body {
  height: 640px;
  overflow: auto;
}
</style>
