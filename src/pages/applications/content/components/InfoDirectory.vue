<template>
  <div style="padding: 20px; background: white">
    <a-form-model
      ref="form"
      :model="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-row>
        <a-col  :xl="7" :lg="7">
          <a-form-model-item ref="type" label="文档类型" prop="type">
            <a-select
              v-model="selectData"
              mode="multiple"
              @change="onSelectChange"
              placeholder="请选择文档类型"
            >
              <a-select-option value="0">未审核</a-select-option>
              <a-select-option value="1">已审核</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :xl="7" :lg="5">
          <a-form-model-item ref="keyword" label="关键字" prop="keyword">
            <a-input-search
              v-model="keyword"
              allowClear
              :loading="loading"
              enterButton
              @search="onSearch"
              placeholder="请输入关键字"
            />
          </a-form-model-item>
        </a-col>
        <a-col :xl="10" :lg="12">
          <div style="margin-top: 5px;text-align: right;"> 
          <a-space >
            <a-button v-if="params.channel"><a-checkbox @change="onFilter">过滤器</a-checkbox></a-button>
            <a-button v-if="params.channel && black" :disabled="!selectedRowKeys.length" @click="removefilter" type="danger">移除过滤</a-button>
             <a-dropdown v-if="params.channel && !black" >
                <a-menu slot="overlay">
                  <a-menu-item key="0">
                    <a-button
                      icon="eye-invisible"
                      :disabled="!selectedRowKeys.length"
                      type="link"
                      @click="artFilter"
                      size="small"
                    >
                      文章过滤
                    </a-button>
                  </a-menu-item>
                </a-menu>
                <a-button style="margin-left: 8px" :loading="loading">
                  <a-icon type="more" />
                  更多
                </a-button>
             </a-dropdown>
            <!-- <a-button type="primary" icon="edit" @click="onAdd">新增</a-button>
            <a-button
              type="danger"
              icon="delete"
              @click="onDelete"
              :loading="loading"
              :disabled="!selectedRowKeys.length"
              >删除</a-button
            > -->
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
      @change="handleTableChange"
      :columns="columns"
      :dataSource="data.items"
      :pagination="false"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onChange }"
    >
      <span slot="_title" slot-scope="text, record">
        <div style="text-align: left">
          <template v-if="record._delete">
            <a-tag color="#f50">已删除</a-tag>
          </template>
          <template v-else>
            <a-tag v-if="!record.status" class="doc_tags" color="orange">审</a-tag>
          </template>
          <template v-if="record.logo && record.logo.length">
            <a-tag class="doc_tags" color="green">图</a-tag>
          </template>
          <template v-if="record.parent.site._id !== params.site">
            <a-tag color="cyan" class="doc_tags">映</a-tag>
          </template>
          <template v-else-if="record.source && record.parent.site._id != params.site">
            <a-tooltip placement="bottom">
              <template slot="title">
                <p>
                  <span>呈送类型：</span>
                  <span v-if="record.islink">连接型</span>
                  <span v-else>源类型</span>
                </p>
                <!-- <p>{{ record.source.parent.site.title }} / {{ record.source.parent.title }}</p> -->
              </template>
              <a-tag color="orange" class="doc_tags">
                <span>呈</span>
              </a-tag>
            </a-tooltip>
          </template>
          <template v-else-if="record.source && record.parent.site._id == params.site">
            <a-tooltip placement="bottom">
              <template slot="title">
                <p>
                  <span>抄送类型：</span>
                  <span v-if="record.islink">连接型</span>
                  <span v-else>源类型</span>
                </p>
                <!-- <p>{{ record.source.parent.site.title }} / {{ record.source.parent.title }}</p> -->
              </template>
              <a-tag color="blue" class="doc_tags">
                <span>抄</span>
              </a-tag>
            </a-tooltip>
          </template>
          
          <a @click="onEdit(record)" style="color: #1890ff">
            {{ text }}
          </a>
        </div>
      </span>
      <span slot="parent" slot-scope="text, record">
        {{ record.parent ? record.parent.title :""}}
      </span>
      <span slot="site" slot-scope="text, record">{{
        record.site ? record.site.title :""
      }}</span>
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
  </div>
</template>
<script>
import {
  directory_document,
  directory_delete,
  document_editstatic,
  document_rollback,
  directory_black,
  directory_filter
} from "@/services/content";
export default {
  name: "InfoDetails",
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
  },
  data() {
    return {
      form: {},
      selectData: ["0", "1"],
      isrecycle: false,
      black:false,
      keyword: "",
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
      loading: true,
      columns: [
        {
          title: "编号",
          dataIndex: "number",
          align: "center",
          scopedSlots: { customRender: "number" },
        },
        {
          title: "标题",
          dataIndex: "title",
          // sorter: true,
          align: "center",
          scopedSlots: { customRender: "_title" },
        },
        {
          title: "目录",
          dataIndex: "parent",
          align: "center",
          scopedSlots: { customRender: "parent" },
        },
        {
          title: "站点",
          dataIndex: "site",
          align: "center",
          scopedSlots: { customRender: "site" },
        },
        {
          title: "发布时间",
          dataIndex: "release",
          sorter: true,
          align: "center",
          scopedSlots: { customRender: "release" },
        },
      ],
      selectedRowKeys: [],
      data: {},
    };
  },
  computed: {
    search() {
      let status = null;
      if (
        this.selectData.indexOf("0") === -1 &&
        this.selectData.indexOf("1") !== -1
      ) {
        status = true;
      } else if (
        this.selectData.indexOf("1") === -1 &&
        this.selectData.indexOf("0") !== -1
      ) {
        status = false;
      }
      return {
        status: status,
        delete: this.isrecycle,
        black: this.black,
        keyword: this.keyword || undefined,
      };
    },
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
      },
    },
  },
  watch: {
    params: {
      handler(value) {
        this.loading = true;
        this.init();
      },
      deep: true,
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.pagination = this.params.pagination || this.pagination;
      this.searchForm = this.params.searchForm || this.searchForm;
      this.paginate();
    },
    paginate() {
      var datas = {
        site: this.params.site|| this.params.id,
        page: this.pagination.page,
        directory: this.params.channel || undefined,
        per_page: this.pagination.per_page,
        search: this.search,
      };
      directory_document(datas)
        .then((res) => {
          this.data = res.data.data;
          this.loading = false; 
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onSearch() {
      this.loading = true;
      this.pagination.page = 1;
      this.paginate();
    },
    //表格排序
    handleTableChange(e, filters, sorter) {
      if (sorter.field) {
        var sorts= 0;
        if (sorter.order == "ascend") {
          // 上升
          sorts = 1;
        } else {
          // 下降
          sorts= -1;
        }
        var datas = {
        site: this.params.site || this.params.id,
        page: this.pagination.page,
        channel: this.params.channel || undefined,
        per_page: this.pagination.per_page,
        search: this.search,
        sort: sorts
      };
        this.loading = true;
        directory_document(datas)
          .then((res) => {
            this.data = res.data.data;
            this.loading = false;
          })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
      }
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
    // 过滤器
    onFilter(e) {
      this.selectedRowKeys=[]
      this.black = e.target.checked;
      this.loading = true;
      this.pagination.page = 1;
      this.paginate();
    },
    onSelectChange(value) {
      this.selectedRowKeys=[]
      this.selectData = value;
      this.loading = true;
      this.pagination.page = 1;
      this.paginate();
    },
    // 文章过滤
    artFilter(){
      if(this.params.channel){
        this.loading = true;
        this.$confirm({
          title: "过滤确认",
          content: "确认要过滤当前栏目下选中的文章吗!",
          okText: "确认",
          cancelText: "取消",
          onOk: () => {
            directory_black({
              id: this.params.channel,
              documents: this.selectedRowKeys,
            })
              .then((response) => {
                this.paginate();
                this.selectedRowKeys = [];
                this.$message.success(response.data.message);
              })
              .catch((error) => {
                console.log(error);
                this.$message.error(error.response.data.message);
              });
          },
          onCancel: () => {
            this.loading = false;
          },
        });
      }else{
        this.$message.error("请选择过滤栏目")
      }
      
    },
    // 移除过滤
    removefilter(){
      this.loading = true;
      this.$confirm({
        title: "确认移除过滤",
        content: "确认要移除过滤文章吗!",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          directory_filter({
            id: this.params.channel,
            documents: this.selectedRowKeys
          })
            .then((response) => {
              this.paginate();
              this.selectedRowKeys = [];
              this.$message.success(response.data.message);
            })
            .catch((error) => {
              console.log(error);
              this.$message.error(error.response.data.message);
            });
        },
        onCancel: () => {
          this.loading = false;
        },
      });

    },
    // 文章删除
    onDelete() {
      this.loading = true;
      this.$confirm({
        title: "删除确认",
        content: "确认要删除文章吗!",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          directory_delete({
            id: this.selectedRowKeys,
          })
            .then((response) => {
              this.paginate();
              this.selectedRowKeys = [];
              this.$message.success(response.data.message);
            })
            .catch((error) => {
              console.log(error);
              this.$message.error(error.response.data.message);
            });
        },
        onCancel: () => {
          this.loading = false;
        },
      });
    },
    // 文章查看
    onEdit(record) {
      console.log("record", record);
      this.$emit("on-open", {
        id: record.id,
        name: "Document",
        title: `文章详情 -- ${record.title}`,
        status: true,
        location: "top",
        sort: 0,
        type: "system",
        hidden: false,
        width: "75%",
        height: "75%",
        router: "Document",
        data: record,
        cancel: () => {
          this.init();
        },
      });
    },
    // onEdit(record) {
    //   let readonly = false;
    //   // 映射 呈送
    //   if (record.parent.site.id != this.params.site) {
    //     readonly = true;
    //   } else {
    //     // 抄送
    //     if (record.islink) {
    //       readonly = true;
    //     }
    //   }
    //   this.$emit("event", {
    //     method: "onLink",
    //     params: {
    //       route: "edit-documents",
    //       params: Object.assign({}, record, {
    //         pagination: this.pagination,
    //         searchForm: this.searchForm,
    //         channel: readonly ?  this.params.channel : record.parent.id ,
    //         directory: this.params.channel,
    //         readonly: readonly,
    //         site: this.params.site,
    //         key: "2"
    //       }),
    //     },
    //   });
    // },
    // 文章添加
    // onAdd() {
    //   this.$emit("event", {
    //     method: "onLink",
    //     params: {
    //       route: "edit-documents",
    //       params: Object.assign({},{
    //         pagination: this.pagination,
    //         searchForm: this.searchForm,
    //         site: this.params.site
    //       }),
    //     },
    //   });
    // },
    onChannel(record) {
      this.pagination.page = 1;
      this.$emit("event", {
        method: "treeSelect",
        params: [record.parent.id],
      });
    },
    // 文章撤回/审核
    onEditStatus(record) {
      if(record){
        this.loading = true;
        document_editstatic( { id: record.id })
          .then((response) => {
            this.$message.success(response.data.message);
            this.paginate();
          })
          .catch((error) => {
            this.$message.error(error.response.data.message);
        });
      }else{

      }
      
    },
    // 文章还原
    onRollback(record) {
      this.loading = true;
      document_rollback({ id: [record.id] })
        .then((res) => {
          this.$message.success(res.data.message);
          this.paginate();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>