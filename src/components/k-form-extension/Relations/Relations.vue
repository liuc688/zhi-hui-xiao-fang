<template>
  <div>
    <a-row>
      <a-col :span="24">
        <a-tree-select
          v-model="site"
          multiple
          allowClear
          :disabled="disabled"
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
        </a-tree-select>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-input-search
          placeholder="检索条件"
          v-model="searchValue"
          @search="onSearch"
          :loading="loading"
          enter-button="检索"
          :disabled="disabled"
      /></a-col>
    </a-row>
    <a-row>
      <a-row>
        查看：
        <a-button type="link" @click="onSelectSearch">我关联的</a-button>
        <!-- <a-divider type="vertical" />
				<a-button type="link" @click="onSearchSelect">关联我的</a-button> -->
      </a-row>
    </a-row>
    <a-row>
      <a-col :span="24">
        <!-- <a-table
					:loading="loading"
					:bordered="true"
					size="middle"
					rowKey="id"
					:columns="columns"
					:dataSource="searchData.items"
					:pagination="false"
					:row-selection="{ selectedRowKeys: result.document, onChange: onChange }"
				>
				
					<span slot="parent" slot-scope="text, record">{{ record.parent.title }}</span>
					<span slot="site" slot-scope="text, record">{{ record.parent.site.title }}</span>
				</a-table> -->

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
          <template slot="nick" slot-scope="text, record">
            <a-textarea
              :disabled="edits"
              style="margin: -5px 0"
              v-model="record.nick"
              :placeholder="record.title"
            />
          </template>
          <template slot="order" slot-scope="text, record">
            <a-input-number
              :min="0"
              :disabled="edits"
              style="margin: -5px 0"
              v-model="record.order"
            />
          </template>
          <template slot="group" slot-scope="text, record">
            <a-input
              style="margin: -5px 0"
              v-model="record.group"
              :disabled="edits"
            />
          </template>
          <template slot="bothway" slot-scope="text, record">
            <a-switch
              style="margin: -5px 0"
              v-model="record.bothway"
              :disabled="edits"
            />
          </template>
          <template slot="site" slot-scope="text, record">
            {{record.organization}}
          </template>
          <template slot="release" slot-scope="text, record">
            {{record.release ? record.release.substring(0, 10) : ''}}
          </template>
          <template slot="channel" slot-scope="text, record">
            {{record.parent ? record.parent.title : ''}}
          </template>
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
  name: "Relations",
  props: {
    value: {
      type: Object,
      default: () => ({
        document: [],
        documents: [],
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
        document: [],
        documents: [],
      },
      loading: false,
      edits: false,
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
          width: "20%",
          scopedSlots: { customRender: "title" },
        },
        {
          title: "站点",
          dataIndex: "site",
          width: "150px",
          scopedSlots: { customRender: "site" },
        },
        {
          title: "目录",
          dataIndex: "channel",
          width: "150px",
          scopedSlots: { customRender: "channel" },
        },
        {
          title: "发布时间",
          dataIndex: "release",
          width: "100px",
          scopedSlots: { customRender: "release" },
        },
        {
          title: "发布标题",
          width: "20%",
          dataIndex: "nick",
          scopedSlots: { customRender: "nick" },
        },
        {
          title: "位置排序",
          dataIndex: "order",
          width: "70px",
          scopedSlots: { customRender: "order" },
        },
        {
          title: "分组",
          dataIndex: "group",
          width: "120px",
          scopedSlots: { customRender: "group" },
        },
        {
          title: "双向绑定",
          dataIndex: "bothway",
          width: "80px",
          scopedSlots: { customRender: "bothway" },
        },
      ],
      // arrays: [],
    };
  },

  watch: {
    result: {
      handler(value) {
        // this.onSelectSearch()
        console.log('valuevaluevalue', value)
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
    searchData: {
      handler(value) {
        let datas = this.result.document;
        var arrays = new Array();
        for (let item in datas) {
          value.items.filter((ite) => {
            if (ite.id == datas[item]) {
              arrays.push({
                document: ite.id,
                nick: ite.nick || ite.title,
                group: ite.group || "",
                order: ite.order || 0,
                bothway: ite.bothway || false,
              });
            } else {
            }
          });
          this.result.documents = arrays;
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.result = this.value
  },
  methods: {
    // 点选
    onChange(value, e) {
      // this.result.document = value;
      // console.log(value , e )
      // e.filter((items) => {
      //   this.result.documents.push({
      //     document: items.id,
      //     nick: items.nick || items.title,
      //     group: items.group || "",
      //     order: items.order || 0,
      //     bothway: items.bothway || false,
      //   });
      // });
      if (value.length) {
        this.result.document = this.deletsagin(value);
        this.result.documents = [];
        e.filter((items) => {
          this.result.documents.push({
            document: items.id,
            nick: items.nick || items.title,
            group: items.group || "",
            order: items.order || 0,
            bothway: items.bothway || false,
          });
        });
      } else {
        this.result.document = [];
        this.result.documents = {};
      }
    },
    // 去重
    deletsagin(data) {
      if (data.length) {
        var arrays = [];
        data.forEach((val) => {
          if (arrays.indexOf(val) == -1) {
            arrays.push(val);
          }
        });
        return arrays;
      } else {
        return [];
      }
    },
    // 我关联的
    onSelectSearch() {
      if (
        typeof this.dynamicData["onSearch"] === "function" ||
        this.dynamicData["searchDatas"]
      ) {
        this.pagination.page = 1;
        this.loading = true;
        this.edits = false;
        this.dynamicData["onSearch"]({
          page: this.pagination.page,
          per_page: this.pagination.per_page,
          ids: this.deletsagin(this.result.document),
        })
          .then((response) => {
            this.loading = false;
            let sourceData = response.data.data;
            let datas = this.dynamicData["searchDatas"];
            for (let item in datas) {
              sourceData.items.filter((items) => {
                if (items.id == datas[item].document) {
                  items.bothway = datas[item].bothway || false;
                  items.document = datas[item].document;
                  items.group = datas[item].group;
                  items.nick = datas[item].nick;
                  items.order = datas[item].order;
                }
              });
            }
            this.searchData = sourceData;
          })
          .catch((error) => {
            this.loading = false;
            console.log(error);
          });
      } else {
        console.log("请选择站点");
      }
    },
    onSearchSelect() {
      this.tableTitle = "关联我的";
    },
    // 查询
    onSearch(value) {
      if (
        typeof this.dynamicData["onSearch"] === "function" &&
        this.site &&
        this.site.length
      ) {
        this.loading = true;
        this.edits = true;
        this.dynamicData["onSearch"]({
          site: this.site,
          page: this.pagination.page,
          per_page: this.pagination.per_page,
          keyword: value || this.searchValue,
        })
          .then((response) => {
            if (this.dynamicData["searchDatas"]) {
              let sourceData = response.data.data;
              let datas = this.dynamicData["searchDatas"];
              for (let item in datas) {
                sourceData.items.filter((items) => {
                  if (items.id == datas[item].document) {
                    items.bothway = datas[item].bothway || false;
                    items.document = datas[item].document;
                    items.group = datas[item].group;
                    items.nick = datas[item].nick;
                    items.order = datas[item].order;
                  }
                });
              }
              this.searchData = sourceData;
              this.loading = false;
            } else {
              this.searchData = response.data.data;
              this.loading = false;
            }
          })
          .catch((error) => {
            console.log(error);
            this.loading = false;
          });
      } else {
        this.$message.error("请选择站点");
      }
    },
    PaginationChange(page, per_page) {
      this.loading = true;
      this.pagination.page = page;
      this.pagination.per_page = per_page;
      this.onSearch();
    },
    onShowSearch() {},
  },
};
</script>
