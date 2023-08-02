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
        @back="backs"
      >
        <template slot="title">
          <a-button @click="backs"><span>返回</span></a-button>
        </template>
      </a-page-header>
      <div style="padding: 20px 0 0">
        <a-row>
          <a-col :span="12" class="to_col">
            <div class="to_col_title">部门选择</div>
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
          </a-col>
          <a-col :span="12" class="to_col">
            <div class="to_col_title">目录列表</div>
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
                  multiple
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
          <a-col :span="24">
            <div class="get_channels">
              <a-tag
                v-for="(item, index) in organizations"
                :key="item"
                closable
                class="get_tags"
                @close="preventDefault(index)"
                >{{ varlists(item) }}</a-tag
              >
            </div>
          </a-col>
        </a-row>
      </div>

      <div style="text-align: right; padding: 20px 0">
        <a-button type="primary" @click="submint" :loading="loading">保存</a-button>
      </div>
    </a-spin>
  </a-card>
</template>
<script>
import { channel_list } from "@/services/content";
import { document_issued } from "@/services/content";
import { organization_tree } from "@/services/organization";
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
  },
  data() {
    return {
      loading: true,
      spinning: false,
      organizas: "",
      organizaslist: [],
      organizations: [],
      sites: [],
      classs: 0,
      channellist: [],
      expandedKeyss: [],
      autoExpandParents: true,
      searchValue: "",
      dataList: [],
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      organization_tree({ id: this.params.site })
        .then((res) => {
          this.organizaslist = res.data.data;
          this.sites = res.data.data;
          //   this.choosesites(this.organizaslist[0].id, 0);
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    searchsites(e) {
      this.organizaslist = this.sites.filter((item) => {
        return item.name.indexOf(e) !== -1 || item.title.indexOf(e) !== -1;
      });
    },
    // 站点选择
    choosesites(value, e) {
      this.spinning = true;
      channel_list({
        site: value[0],
        tree: true,
      })
        .then((response) => {
          this.channellist = response.data.data;
          this.spinning = false;
          this.generateList(this.channellist, e.node.title);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 获取列表
    generateList(data, title) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const key = node.id;
        this.dataList.push({ key, title: node.title, parent: title });
        var titless = title + " / " + node.title;
        if (node.children) {
          this.generateList(node.children, titless);
        }
      }
      this.spinning = false;
    },
    selects(value) {
      this.organizations = value;
    },
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
    onExpands(expandedKeys) {
      this.expandedKeyss = expandedKeys;
      this.autoExpandParents = false;
    },
    varlists(data) {
      var las = this.dataList.filter((item) => {
        return item.key == data;
      });
      return las[0].parent + " / " + las[0].title;
    },
    preventDefault(index) {
      this.$nextTick(() => {
        this.organizations.splice(index, 1);
      });
    },
    submint() {
      this.loading = true
      document_issued({
        id: this.params.selectedRowKeys,
        channel: this.organizations,
      })
        .then((response) => {
          this.loading = false;
          this.$message.success(response.data.message);
          if (this.params.channel) {
            this.backs();
          } else {
            this.back();
          }
        })
        .catch((error) => {
          this.$message.error(error);
          this.loading = false;
        });
    },
    back() {
      this.$emit("event", {
        method: "OrganizationGet",
        params: this.params.site,
      });
    },
    backs() {
      this.$emit("event", {
        method: "treeSelect",
        params: [this.params.channel],
      });
    },
  },
};
</script>
<style scoped>
.to_div_scroll {
  /* padding: 10px 38px; */
  height: 260px;
  overflow-y: scroll;
}
.actives {
  background: #096dd98f !important;
  list-style: none;
  color: #fafafa !important;
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