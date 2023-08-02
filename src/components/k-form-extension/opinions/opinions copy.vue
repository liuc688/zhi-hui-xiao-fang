<template>
  <div>
    <a-row>
      <a-col :span="24">
        <a-input-group>
          <a-row :gutter="8">
            <a-col :span="20">
              <a-tree-select
                :disabled="record.options.disabled"
                v-model="site"
                allowClear
                showSearch
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="
                  dynamicData['organizations']
                    ? dynamicData['organizations']
                    : []
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
              </a-tree-select>
            </a-col>
            <a-col :span="4">
              <a-button type="primary" @click="searches()" :loading="loading">
                查询
              </a-button>
            </a-col>
          </a-row>
        </a-input-group>
      </a-col>
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
            selectedRowKeys: selectedRowKeys,
            onChange: onChange,
          }"
        >
          <span slot="titles" slot-scope="text, record">{{
            record.title
          }}</span>
          <span slot="site" slot-scope="text, record">{{
            record.site ? record.site.title : ""
          }}</span>
        </a-table>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-pagination
          size="small"
          style="text-align: right"
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
  name: "oponions",
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    record: {
      type: Object,
      default: () => ({}),
    },
    dynamicData: {
      type: Object,
      default: () => ({}),
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
      result: {},
      selectedRowKeys: [],
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
          scopedSlots: { customRender: "titles" },
        },
        {
          title: "站点",
          dataIndex: "site",
          scopedSlots: { customRender: "site" },
        },
        {
          title: "开始时间",
          dataIndex: "start",
          scopedSlots: { customRender: "start" },
        },
        {
          title: "结束时间",
          dataIndex: "end",
          scopedSlots: { customRender: "end" },
        },
      ],
    };
  },
  mounted() {
    console.log('this.value', this.value)
    console.log('record',this.record)
    this.$nextTick(() => {
      this.searchData.items = [this.value];
    });
  },
  methods: {
    onChange(value, e) {
      if (value.length > 1) {
        this.$message.error("只能选择一篇");
      } else {
        this.selectedRowKeys = value;
        var datas = {
          title: e[0].title,
          site: {
            title: e[0].site.title,
            id: e[0].site.id,
          },
          status: e[0]._extension,
          start: e[0].start,
          end: e[0].end,
          id: e[0].id,
        };
        this.result = datas;
      }
    },
    searches() {
      if (
        typeof this.dynamicData["onSearches"] === "function" &&
        this.site &&
        this.site.length
      ) {
        this.loading = true;
        this.dynamicData["onSearches"]({
          data: {
            site: this.site,
            page: this.pagination.page,
            per_page: this.pagination.per_page,
          },
        })
          .then((response) => {
            this.searchData = response.data.data;
            this.loading = false;
          })
          .catch((error) => {
            console.log(error);
            this.loading = false;
          });
      } else {
        this.$message.warning("请选择站点");
      }
    },
    PaginationChange(page, per_page) {
      this.loading = true;
      this.pagination.page = page;
      this.pagination.per_page = per_page;
      this.searches();
    },
  },
};
</script>
