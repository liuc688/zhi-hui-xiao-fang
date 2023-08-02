<template>
  <div>
    <a-row>
      <a-col :span="24">
        <a-tree-select
          :disabled="disabled"
          v-model="site"
          multiple
          allowClear
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="
            dynamicData['organizations'] ? dynamicData['organizations'] : []
          "
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
        >
          <span slot="title" slot-scope="{ key, value }" style="color: #08c"
            >Child Node1 {{ value }}</span
          >
        </a-tree-select>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-input-search
          :disabled="disabled"
          placeholder="检索条件"
          v-model="searchValue"
          @search="onSearch"
          :loading="loading"
          enter-button="检索"
      /></a-col>
    </a-row>
    <a-row>
      <a-row>
        是否双向关联：
        <a-switch v-model="result.oneway" @change="switchChange" />
      </a-row>
      <a-row>
        查看：
        <a-button type="link" @click="onSelectSearch">我关联的</a-button>
        <!-- <a-divider type="vertical" />
				<a-button type="link" @click="onSearchSelect">关联我的</a-button> -->
      </a-row>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-table
          :loading="loading"
          :bordered="true"
          size="middle"
          rowKey="id"
          :columns="columns"
          :dataSource="searchData.items"
          :pagination="false"
          :row-selection="{
            selectedRowKeys: result.document,
            onChange: onChange,
          }"
        >
          <span slot="parent" slot-scope="text, record">{{
            record.parent.title
          }}</span>
          <span slot="site" slot-scope="text, record">{{
            record.parent.site.title
          }}</span>
        </a-table>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-pagination
          size="small"
          style="text-align:right"
          :current="pagination.page"
          @change="PaginationChange"
          @showSizeChange="PaginationChange"
          :pageSizeOptions="['10', '20', '30', '40']"
          :total="pagination.total"
          show-size-changer
          show-quick-jumper
          :show-total="(total) => `共 ${total} 条`"
        ></a-pagination>
      </a-col>
    </a-row>
  </div>
</template>
<script>
export default {
  name: "RelatedDocuments",
  props: {
    value: {
      type: Object,
      default: () => ({
        oneway: false,
        releated: true,
        document: [],
      }),
    },
    record: {
      type: Object,
      required: true,
    },
    // form-item 宽度配置
    formConfig: {
      type: Object,
      required: false,
    },
    config: {
      type: Object,
      default: () => ({}),
    },
    dynamicData: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    pagination: {
      get() {
        return {
          page: this.searchData.page || 1,
          per_page: this.searchData.per_page || 10,
          total: this.searchData.total || 0,
        };
      },
      set(val) {
        this.searchData.page = val.page;
        this.searchData.per_page = val.per_page;
      },
    },
  },

  data() {
    return {
      tableTitle: null,
      rowSelection: undefined,
      searchValue: "",
      result: {
        oneway: false,
        document: [],
      },
      loading: false,
      site: null,
      searchData: {
        page: 1,
        per_page: 10,
        total: 0,
        items: [],
      },
      columns: [
        {
          title: "标题",
          dataIndex: "title",
          scopedSlots: { customRender: "title" },
        },
        {
          title: "发布时间",
          dataIndex: "release",
          scopedSlots: { customRender: "release" },
        },
        {
          title: "目录",
          dataIndex: "parent",
          scopedSlots: { customRender: "parent" },
        },
        {
          title: "站点",
          dataIndex: "site",
          scopedSlots: { customRender: "site" },
        },
      ],
    };
  },

  watch: {
    result: {
      handler(value) {
        this.$emit("change", value);
      },
      deep: true,
    },
    value: {
      handler(value) {
        if (value) {
          this.result = value;
        }
      },
      deep: true,
    },
  },
  created() {
    console.log("this.record", this.record);
  },
  methods: {
    onChange(value) {
      this.result.document = value;
    },
    switchChange(value) {
      this.result.oneway = value;
    },
    onSelectSearch() {
      if (typeof this.dynamicData["onSearch"] === "function") {
        this.pagination.page = 1;
        this.loading = true;
        this.dynamicData["onSearch"]({
          data: {
            page: this.pagination.page,
            per_page: this.pagination.per_page,
            ids: this.result.document,
          },
        })
          .then((response) => {
            this.searchData = response.data;
            this.loading = false;
          })
          .catch((error) => {
            console.log(error);
            this.loading = false;
          });
      }
    },
    onSearchSelect() {
      this.tableTitle = "关联我的";
    },
    onSearch(value) {
      if (
        typeof this.dynamicData["onSearch"] === "function" &&
        this.site &&
        this.site.length
      ) {
        this.loading = true;
        this.dynamicData["onSearch"]({
          data: {
            site: this.site,
            page: this.pagination.page,
            per_page: this.pagination.per_page,
            keyword: value || this.searchValue,
          },
        })
          .then((response) => {
            this.searchData = response.data;
            this.loading = false;
          })
          .catch((error) => {
            console.log(error);
            this.loading = false;
          });
      } else {
        console.log("请选择站点");
      }
    },
    PaginationChange(page, per_page) {
      console.log(page);
      this.loading = true;
      this.pagination.page = page;
      this.pagination.per_page = per_page;
      this.onSearch();
    },
    onShowSearch() {},
  },
};
</script>
