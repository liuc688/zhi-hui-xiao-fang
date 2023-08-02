<template>
  <a-card
    :body-style="{ padding: '24px 32px', maxHeight: '80vh', overflow: 'auto' }"
    :bordered="false"
  >
    <a-spin tip="Loading..." :spinning="loading">
      <a-page-header
        style="
          border-bottom: 1px solid #ccc;
          margin-bottom: 10px;
          padding-bottom: 10px;
        "
        @back="back"
      >
        <template slot="title">
          <a-button @click="back"><span>返回</span></a-button>
        </template>
      </a-page-header>
      <div style="text-align: right; padding: 10px">
        <a-button
          :disabled="!selectedRowKeys.length"
          type="danger"
          @click="deletmapping"
          >批量删除</a-button
        >
      </div>
      <a-collapse v-model="activeKey">
        <a-collapse-panel key="1">
          <a slot="header"><a-icon type="plus" />添加</a>
          <div style="width: 100%; height: 300px">
            <a-row :gutter="50">
              <a-col :span="12">
                <a-input
                  class="to_col_search"
                  size="large"
                  placeholder="部门查询"
                  allowClear
                  v-model="organizas"
                  @change="searchsites(organizas)"
                />
                <a-directory-tree
                  multiple
                  class="to_div_scroll"
                  :tree-data="organizaslist"
                  @select="choosesites"
                  :showIcon="false"
                  :replaceFields="{
                    title: 'title',
                    key: 'id',
                    value: 'id',
                  }"
                >
                <template slot="title" slot-scope="{ title }">
                        <span v-if="title.indexOf(searchValue) > -1">
                          {{ title.substr(0, title.indexOf(searchValue)) }}
                          <span style="color: #f50">{{ searchValue }}</span>
                          {{
                            title.substr(
                              title.indexOf(searchValue) + searchValue.length
                            )
                          }}
                        </span>
                        <span v-else>{{ title }}</span>
                      </template>
                </a-directory-tree>
                <!-- <div class="to_div_scroll">
                  <ul style="margin: 0px; padding: 0" class="to_ul">
                    <li
                      :class="classs == index + 1 ? 'actives' : ''"
                      v-for="(item, index) in organizaslist"
                      :key="item.id"
                      @click="choosesites(item, index)"
                    >
                      {{ item.title }}
                    </li>
                  </ul>
                </div> -->
              </a-col>
              <a-col :span="12">
                <a-input
                  class="to_col_search"
                  size="large"
                  allowClear
                  placeholder="目录查询"
                  @change="channelsearch"
                />
                <a-spin :spinning="spinning">
                  <div class="to_div_scroll">
                    <a-tree
                      :tree-data="channellist"
                      @select="selects"
                      @expand="onExpands"
                      :replaceFields="{
                        title: 'title',
                        key: 'id',
                        value: 'id',
                      }"
                      :expandedKeys.sync="expandedKeyss"
                      :autoExpandParent="autoExpandParents"
                    >
                      <template slot="title" slot-scope="{ title }">
                        <span v-if="title.indexOf(searchValue) > -1">
                          {{ title.substr(0, title.indexOf(searchValue)) }}
                          <span style="color: #f50">{{ searchValue }}</span>
                          {{
                            title.substr(
                              title.indexOf(searchValue) + searchValue.length
                            )
                          }}
                        </span>
                        <span v-else>{{ title }}</span>
                      </template>
                    </a-tree>
                  </div>
                </a-spin>
              </a-col>
            </a-row>
          </div>
        </a-collapse-panel>
      </a-collapse>
      <a-table
        ref="table"
        :bordered="true"
        style="margin: 20px 0"
        size="middle"
        rowKey="id"
        :columns="columns"
        :data-source="datalist"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onChange,
        }"
      >
      </a-table>
    </a-spin>
  </a-card>
</template>
<script>
import {
  channel_maps,
  channel_editmaps,
  channel_deletemaps,
  channel_list,
} from "@/services/content";
import { organization_alltree, organization_tree } from "@/services/organization";
export default {
  name: "mountforms",
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
      loading: true,
      spinning: false,
      datalist: [],
      organizas: "", //站点选择
      organizaslist: [], //站点列表
      channellist: [], //目录列表
      columns: [
        {
          title: "站点",
          dataIndex: "siteTitle",
          width: "40%",
          scopedSlots: { customRender: "siteTitle" },
        },
        {
          title: "标题",
          dataIndex: "title",
          key: "title",
        }
      ],
      activeKey: "",
      classs: 1,
      sites: [],
      autoExpandParents: true,
      expandedKeyss: [],
      searchValue: "",
      dataList: [],
      siteselect: "",
      selectedRowKeys: [],
    };
  },
  watch: {
    params(val) {
      this.loading = true;
      this.init();
    },
  },
  computed: {
    dynamicData() {
      let result = {
        formslist: [],
      };
      // for (let item in this.formslists) {
      //   result.formslist.push({
      //     value: this.formslists[item].id,
      //     label: this.formslists[item].title,
      //   });
      // }
      return result;
    },
    organization_tree() {
      return this.$auth("organization.alltree") ? organization_alltree : organization_tree;
    },
  },
  created() {
  },
  mounted(){
    this.init();
  },
  methods: {
    init() {
      Promise.all([
        channel_maps({ channel: this.params.id }),
        this.organization_tree({ id: this.params.site }),
      ])
        .then((res) => {
          console.log(res);
          this.datalist = res[0].data.data;
          this.organizaslist = res[1].data.data;
          this.sites = res[1].data.data;
          // this.choosesites([this.sites[0].id]);
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 列表刷新
    refresh() {
      channel_maps({ channel: this.params.id })
        .then((res) => {
          console.log(res);
          this.datalist = res.data.data;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 站点查询
    searchsites(e) {
      console.log(e)
      this.organizaslist = this.sites.filter((item) => {
        // if(item.children.length){
        //   this.searchsites(item.children)
        // }
        return item.name.indexOf(e) !== -1 || item.title.indexOf(e) !== -1;
      });
    },
    // 站点选择
    choosesites(value) {
      this.spinning = true;
      channel_list({
        site: value[0],
        tree: true,
        channel:this.params.id
      })
        .then((response) => {
          this.channellist = response.data.data;
          this.spinning = false;
          this.generateList(this.channellist);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 目录查询
    channelsearch(e) {
      const value = e.target.value;
      const expandedKeyss = this.dataList.map((item) => {
        if (item.title.indexOf(value) > -1) {
          return item.key;
        }
        return null;
      });
      Object.assign(this, {
        expandedKeyss: expandedKeyss,
        searchValue: value,
        autoExpandParents: true,
      });
    },
    onChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    deletmapping() {
      this.loading = true;
      channel_deletemaps({
        channel: this.params.id,
        maps: this.selectedRowKeys,
      })
        .then((res) => {
          console.log(res);
          this.selectedRowKeys = [];
          this.refresh();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 目录选择
    selects(value) {
      this.organizations = value;
      this.loading = true;
      channel_editmaps({
        channel: this.params.id,
        maps: value[0],
      })
        .then((res) => {
          console.log(res);
          this.refresh();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onExpands(expandedKeys) {
      this.expandedKeyss = expandedKeys;
      this.autoExpandParents = false;
    },
    // 获取目录列表
    generateList(data) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const key = node.id;
        this.dataList.push({ key, title: node.title });
        if (node.children) {
          this.generateList(node.children);
        }
      }
      this.spinning = false;
    },
    back() {
      this.$emit("event", {
        method: "treeSelect",
        params: [this.params.id],
      });
    },
  },
};
</script>
<style scoped>
.to_div_scroll {
  /* padding: 10px 38px; */
  height: 250px;
  overflow-y: scroll;
  background: #f5f5f5;
}
.to_col {
  border: 1px solid #dddddd;
  width: 46%;
  background: #fafafa;
  margin: 0 2%;
}
.to_col .to_col_title {
  background: #1890ffad;
  padding: 10px;
  color: #fafafa;
  font-size: 22px;
  text-align: center;
  letter-spacing: 2px;
  font-weight: bolder;
}
.to_col .to_col_search {
  margin: 8px auto;
  width: 80%;
  display: block;
  padding: 10px 0 !important;
}
.to_ul {
  margin: 0px;
  padding: 0;
  background: #fff;
}
.to_ul li {
  list-style: none;
  line-height: 30px;
  cursor: pointer;
  color: #3d4348b3;
  background: #f5f5f5;
  font-size: 16px;
  padding-left: 10%;
}
.to_ul li:hover {
  background: #bae7ff80;
}
.get_channels {
  width: 96%;
  margin: 30px auto 0px;
  height: 160px;
  border: 1px solid #91d5ff;
  overflow-y: scroll;
}
.get_tags {
  padding: 5px;
  margin: 5px 5px 0px;
  font-size: 16px;
  white-space: normal;
}
</style>