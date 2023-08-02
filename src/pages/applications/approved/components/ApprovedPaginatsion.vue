<template>
  <a-card>
    <a-form-model
      style="margin: 10px 0 0"
      ref="searchform"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :model="searchform"
    >
      <a-row>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-model-item label="标题"
            ><a-input
              style="width: 100%"
              placeholder="请输入标题查询"
              v-model="searchform.keyword"
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
            <a-tooltip 
              v-if="$auth('approved.verify') && selectedRowKeys.length <= 10 && selectedRowKeys.length">
              <template slot="title">
                最多批量审核10篇文章
              </template>
              <a-button
                key="resolve"
                type="primary"
                icon="check"
                style="margin-left: 8px"
                :disabled="selectedRowKeys.length > 10"
                @click="onResolve"
              >
                批量审核
              </a-button>
            </a-tooltip>
            
          </div>
        </a-col>
      </a-row>
    </a-form-model>
    <a-table
      :dataSource="dataSource.items"
      :columns="columns"
      :loading="loading"
      :pagination="false"
      rowKey="id"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onChange }"
    >
      <span slot="_title" slot-scope="text, record">
        <div style="text-align: left">
          <template>
            <a-tag v-if="!record.status" class="doc_tags" color="orange"
              >审</a-tag
            >
          </template>
          <template v-if="record.logo ? record.logo.length : false">
            <a-tag class="doc_tags" color="green">图</a-tag>
          </template>
          <a @click="onCheck(record)" style="color: #1890ff">
            {{ text }}
          </a>
        </div>
      </span>
      <span slot="parent" slot-scope="text, record">
        {{ record.parent.title }}
      </span>
      <span slot="site" slot-scope="text, record">{{
        record.parent.site.title
      }}</span>
    </a-table>
    <a-pagination
      size="small"
      style="text-align: right; margin: 20px 0"
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
</template>

<script>
import {
  approve_document,
  approved_get,
  approved_verify,
} from "@/services/approve";
export default {
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
  components: {},
  data() {
    return {
      loading: true,
      curr_site_id: null,
      dataSource: [],
      columns: [
        {
          title: "编号",
          dataIndex: "sort",
          align: "center",
          scopedSlots: { customRender: "sort" },
        },
        {
          title: "标题",
          dataIndex: "title",
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
          // sorter: true,
          align: "center",
          scopedSlots: { customRender: "release" },
        },
      ],
      labelCol: { span: 5 },
      wrapperCol: { span: 18, offset: 1 },
      searchform: {
        keyword: undefined,
      },
      pageSizeOptions: ["10", "20", "30", "40"],
      selectedRowKeys: [],
    };
  },

  computed: {
    pagination: {
      get() {
        return {
          page: this.dataSource.page || 1,
          per_page: this.dataSource.per_page || 10,
          total: this.dataSource.total || 0,
        };
      },
      set(val) {
        this.dataSource.page = val.page;
        this.dataSource.per_page = val.per_page;
        this.dataSource.total = val.total;
      },
    },
  },
  created() {
    this.onLoad();
  },
  methods: {
    onChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    onLoad() {
      this.getdatasource();
    },
    getdatasource() {
      this.loading = true;
      var data = Object.assign({}, this.searchform, this.pagination, {
        delete: false,
      });
      approve_document(data)
        .then((response) => {
          this.dataSource = response.data.data;
          this.loading = false;
        })
        .catch((error) => {
          console.log("error", error);
          this.loading = false;
          this.$message.error(error.response.data.message);
        });
    },
    // 分页
    changepage(page, pageSize) {
      this.pagination.page = page;
      this.pagination.per_page = pageSize;
      this.getdatasource();
    },
    onCheck(record) {
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
        cancel: () => {},
      });
    },
    onTreeSelect() {},
    onTreeExpand(expandedKeys, info) {
      if (info.expanded) {
        this.channelexpandedKeys = [];
      } else {
        this.channelexpandedKeys = [expandedKeys];
      }
    },
    onSearch() {
      this.loading = true;
      this.pagination.page = 1;
      this.pagination.per_page = 10;
      this.getdatasource();
    },
    onReset() {
      this.searchform = {
        keyword: undefined,
      };
      this.pagination.page = 1;
      this.pagination.per_page = 10;
      this.getdatasource();
    },
    // 批量审核
    onResolve() {
      console.log('selectedRowKeys', this.selectedRowKeys)
      if (this.selectedRowKeys.length > 10) {
        this.$message.error("批量审核仅支持10篇以内文章数!");
      } else if(this.selectedRowKeys.length>0){
        var that = this;
        that.$confirm({
          title: "确定审核通过选中的文章吗?",
          okText: "确定",
          cancelText: "取消",
          onOk() {
            console.log("OK");
            for (let item in that.selectedRowKeys) {
              approved_get({ id: that.selectedRowKeys[item] })
                .then((res) => {
                  approved_verify({
                    document: that.selectedRowKeys[item],
                    status: 1,
                    step: res.data.step,
                    opinion: "审核通过",
                  })
                    .then((res) => {
                      console.log("res", res);
                      if (item == that.selectedRowKeys.length - 1) {
                        that.onReset();
                        that.$message.success("文章审核操作完成");
                        that.selectedRowKeys = [];
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                      that.loading = false;
                      that.$message.error("文章审核失败!");
                    });
                })
                .catch((error) => {
                  console.log(error);
                  that.loading = false;
                  that.$message.error("获取文章信息失败!");
                });
            }
          },
        });
      }else{
        this.$message.error("请选择审核文章!");
      }
    },
  },
};
</script>
<style scoped>
.approved-paginatsion-sider {
  background-color: #f0f2f5;
}
</style>
