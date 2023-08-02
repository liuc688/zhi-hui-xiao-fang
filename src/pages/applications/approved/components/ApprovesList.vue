<template>
  <a-card>
    <a-alert
      message="注意"
      description="当选中目录时，向目录添加审核流程，取消选中时，向站点添加审核流程"
      type="info"
      :showIcon="true"
    >
      <a-icon type="exclamation-circle" slot="icon" />
    </a-alert>
    <a-layout>
      <a-layout-sider class="approved-paginatsion-sider" width="20%">
        <!-- 站点/组织选择 -->
        <a-tree-select
          @change="onTreeChange"
          show-search
          style="width: 100%; padding: 10px 5%; background: #1890ff33"
          v-model="curr_site_id"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="sites"
          placeholder="请选择所在组织"
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
        <a-tree-select
          show-search
          style="width: 100%; padding: 10px 5%; background: #1890ff33"
          v-model="channelsss"
          @change="researchchannel"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="channels"
          placeholder="检索目录"
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
        <a-tree
          class="draggable-tree"
          :tree-data="channels"
          :draggable="true"
          :default-expand-all="true"
          auto-expand-parent
          :expandedKeys.sync="channelexpandedKeys"
          :selectedKeys.sync="channelselectedKeys"
          :block-node="true"
          :replaceFields="{
            title: undefined,
            key: 'id',
            value: 'id',
          }"
          ref="channelTree"
          @select="onTreeSelect"
          @expand="onTreeExpand"
        >
          <span
            slot="title"
            slot-scope="record"
            color="#f50"
            class="channel-tree-item"
          >
            {{ record.title }}
          </span>
        </a-tree>
      </a-layout-sider>
      <a-layout-content class="approved-paginatsion-content">
        <div style="padding: 10px; background-color: rgba(24, 144, 255, 0.2)">
          <a-space>
            <a-button icon="edit" @click="onCreateFlows" v-if="$auth('approve.add')">添加审批流程</a-button>
          </a-space>
        </div>
        <a-table :dataSource="dataSource" :columns="columns" :loading="loading">
          <span slot="action" slot-scope="text, record">
            <a style="color: #2db7f5" @click="onCheck(record)"> 查看 </a>
          </span>
        </a-table>
      </a-layout-content>
    </a-layout>
  </a-card>
</template>

<script>
import { organization_tree } from "@/services/organization";
import { channel_list } from "@/services/content";
import { approve_versions } from "@/services/approve";

export default {
  props: {},
  components: {},
  data() {
    return {
      loading: false,
      params: {},
      curr_site_id: null,
      ischannel: false,
      site: {},
      channel: {},
      sites: [],
      channels: [],
      channelsss: undefined,
      channelexpandedKeys: [],
      channelselectedKeys: [],
      dataSource: [],
      columns: [
        {
          title: "版本",
          dataIndex: "version",
          width: 120,
        },
        {
          title: "创建时间",
          dataIndex: "_createtime",
        },
        {
          title: "创建人",
          dataIndex: "creator.realname",
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 140,
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
    };
  },
  computed: {
    curr_channel_id() {
      return this.channelselectedKeys.length
        ? this.channelselectedKeys[0]
        : undefined;
    },
  },
  created() {
    this.onLoad();
  },
  methods: {
    onLoad() {
      this.loading = true;
      this.channelselectedKeys = [];
      Promise.all([organization_tree()])
        .then((response) => {
          this.sites = response[0].data.data;
          if (this.sites.length) {
            this.site = this.sites[0];
            this.ischannel = false;
            this.curr_site_id = this.sites[0].id;
            this.getChannelTree(this.curr_site_id);
            this.getVersions(this.curr_site_id, false);
            this.loading = false;
          }
        })
        .catch((error) => {
          console.log("error", error);
          this.loading = false;
        });
    },
    //
    researchchannel(e, s, event) {
      var node = event.triggerNode;
      console.log("node", node);
      this.onTreeSelect([e], { node: node });
    },
    onTreeSelect(e, s) {
      console.log("e", e, s);
      let record_id = undefined;
      let ischannel = true;
      if (e.length) {
        record_id = e[0];
        this.channelsss = e[0];
        this.channelselectedKeys = e;
        this.channelexpandedKeys = e;
        ischannel = true;
        this.ischannel = true;
        this.channel = s.node.dataRef;
      } else {
        record_id = this.curr_site_id;
        this.channelselectedKeys = [];
        this.channelexpandedKeys = [];
        this.channelsss = undefined
        ischannel = false;
        this.ischannel = false;
      }
      this.getVersions(record_id, ischannel);
    },
    onTreeExpand(expandedKeys, info) {
      if (info.expanded) {
        this.channelexpandedKeys = [];
      } else {
        this.channelexpandedKeys = [expandedKeys];
      }
    },
    onTreeChange(record_id, s, node) {
      this.channelsss = undefined;
      this.site = node.triggerNode.dataRef;
      this.getChannelTree(record_id);
      this.getVersions(record_id, false);
    },
    getChannelTree(record_id) {
      channel_list({
        site: record_id,
        tree: true,
      })
        .then((response) => {
          this.channels = response.data.data;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    getVersions(record_id, ischannel) {
      const formData = {};
      if (ischannel) {
        formData.channel = record_id;
      } else {
        formData.site = record_id;
      }
      approve_versions(formData)
        .then((response) => {
          this.dataSource = response.data.data;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    onCreateFlows() {
      const record = this.ischannel ? this.channel : this.site;
      this.createFlows(record, this.ischannel);
    },
    createFlows(record, ischannel) {
      ischannel = ischannel || false;
      this.$emit("on-open", {
        id: record.id,
        name: "Approve",
        title: `设置审批流程 -- ${record.title}`,
        status: true,
        location: "top",
        sort: 0,
        type: "system",
        hidden: false,
        width: "75%",
        height: "75%",
        router: "Approve",
        data: {
          isChannel: ischannel,
          params: record,
          site: this.curr_site_id,
        },
        cancel: () => {
          this.onLoad();
        },
      });
    },
    onCheck(record) {
      this.$emit("on-open", {
        id: record.id,
        name: "Approves",
        title: `查看审批流程`,
        status: true,
        location: "top",
        sort: 0,
        type: "system",
        hidden: false,
        width: "40%",
        height: "40%",
        router: "Approves",
        data: record,
        cancel: () => {},
      });
    },
  },
};
</script>
<style scoped>
.approved-paginatsion-sider {
  background-color: #ffffff;
}
.approved-paginatsion-content {
  background-color: #ffffff;
}
</style>
