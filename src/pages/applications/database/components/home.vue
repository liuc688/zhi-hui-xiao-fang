<template>
  <!-- style="height: calc(100vh - 240px); background: #f1f1f1" -->
  <div>
    <div class="headers">
      <div class="titles">
        <a-input-search
          class="searchs"
          placeholder="请输入关键词查询表格"
          size="large"
          v-model="searchform.keyword"
          allowClear
          enter-button
          @search="onSearch"
        />
      </div>
    </div>
    <a-card :bordered="false" class="cards">
      <a-row :gutter="24">
        <!-- 目录 -->
        <a-col
          :span="4"
          class="tree_channel"
          @contextmenu.prevent="ondesktopmenu"
        >
          <a-tree
            class="draggable-tree"
            :tree-data="channelData"
            :default-expand-all="true"
            auto-expand-parent
            :block-node="true"
            :replaceFields="{
              title: undefined,
              key: 'id',
              value: 'id',
            }"
            ref="channelTree"
            @select="treeSelect"
            @expand="onExpand"
            @rightClick="onRightClickchannel"
          >
            <span
              slot="title"
              slot-scope="record"
              color="#f50"
              class="channel-tree-item"
            >
              {{ record.title }}
              <a-tag color="orange" v-if="record.hidden">隐</a-tag>
              <a-tag color="blue" v-if="record.maps && record.maps.length"
                >映</a-tag
              >
            </span>
          </a-tree>
        </a-col>
        <a-col :span="20" style="padding: 40px">
          <a-row style="padding: 0px 0px 20px">
            <a-col :span="12" style="text-align: left">
              <a-space>
                <a-button type="primary" @click="addOrder()">
                  <a-icon type="plus" />
                  <span>创建表格</span>
                </a-button>
                <a-button type="primary" @click="addzhong()">
                  <a-icon type="plus" />
                  <span>创建中台</span>
                </a-button>
              </a-space>
            </a-col>
          </a-row>
          <a-list
            :loading="searchloading"
            :data-source="dataSource.items"
            rowKey="index"
            :grid="{ gutter: 24, xl: 4, lg: 3, md: 2, sm: 2, xs: 1 }"
          >
            <a-list-item slot="renderItem" slot-scope="item, index">
              <a-card class="itemd">
                <a-card-meta
                  @click="getdetails(item)"
                  v-auth="`table.get`"
                  class="items_card"
                  :style="{
                    backgroundImage: item.logo.length ? item.logo[0].url : '',
                  }"
                >
                  <a-avatar
                    v-if="item.logo.length"
                    slot="avatar"
                    :size="60"
                    :src="item.logo ? item.logo[0].url : ''"
                  />
                  <a-avatar v-else slot="avatar" :size="60" icon="table" />

                  <div slot="title" style="width: 100%">
                    <span class="title_title">{{ item.title }}</span>
                    <span class="title_number">{{
                      item.total ? item.total.count : 0
                    }}</span>
                  </div>
                  <div slot="description" class="content_style">
                    <p>{{ item.content }}</p>
                  </div>
                </a-card-meta>
                <template slot="actions" class="ant-card-actions">
                  <a-tooltip>
                    <template slot="title"> 编辑表格 </template>
                    <a-icon key="edit" type="edit" @click="addOrder(item)" />
                  </a-tooltip>
                  <a-tooltip>
                    <template slot="title"> 表格模板生成</template>
                    <a-icon
                      key="download"
                      type="download"
                      @click="addOrderss(item)"
                    />
                  </a-tooltip>
                  <a-tooltip>
                    <template slot="title">接口文档</template>
                    <a-icon
                      key="file-done"
                      type="file-done"
                      @click="interfaces(item)"
                    />
                  </a-tooltip>
                </template>
              </a-card>
            </a-list-item>
          </a-list>
          <a-pagination
            size="small"
            style="text-align: right"
            @change="changepage"
            :current="pagination.page"
            :pageSize="pagination.per_page"
            @showSizeChange="changepage"
            :pageSizeOptions="pageSizeOptions"
            :total="pagination.total"
            show-size-changer
            show-quick-jumper
            :show-total="(total) => `共 ${total} 条`"
          ></a-pagination>
        </a-col>
      </a-row>
    </a-card>
    <a-modal
      :title="table_title"
      :visible="visible"
      :width="900"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div class="able_t">
        <k-form-build
          :value="listData"
          ref="forms"
          @change="changes"
          :dynamicData="dynamicData"
          :config="config"
        />
      </div>
    </a-modal>
    <a-modal
      title="创建中台"
      :visible="visibles"
      :width="900"
      :maskClosable="false"
      @ok="handleOks"
      @cancel="handleCancels"
    >
      <div class="able_t">
        <k-form-build :value="listDatas" ref="formes" />
      </div>
    </a-modal>
    <a-modal
      :title="titles"
      :visible="visiblese"
      :width="900"
      :maskClosable="false"
      @ok="handleOkes"
      @cancel="handleCanceles"
    >
      <div class="able_t">
        <k-form-build
          :value="editDatas"
          :dynamicData="dynamicData"
          :config="config"
          ref="editformes"
        />
      </div>
    </a-modal>
  </div>
</template>
<script>
import {
  table_paginate,
  table_create,
  table_edit,
  table_name,
  table_template,
  interface_create,
  table_form,
} from "@/services/database";
import {
  channel_get,
  channel_list,
  channel_edit,
  channel_insert,
  channel_delete,
} from "@/services/content";
import { form_get } from "@/services/forms";
import Cookie from "js-cookie";
// import Vue from "vue";
// import VWave from "v-wave";

// Vue.use(VWave);
export default {
  data() {
    return {
      searchloadings: false,
      resetloadings: false,
      searchloading: false, //表格加载
      toggleSearchStatus: false, //搜索项隐藏
      searchform: {
        per_page: 12,
        page: 1,
      }, //搜索表单
      dataSource: {},
      pageSizeOptions: ["12", "24", "36", "48"],
      visible: false,
      visibles: false,
      confirmLoading: false,
      listData: {},
      listDatas: {},
      tableid: "",
      channelData: [],
      channelexpandedKeys: [],
      channelselectedKeys: [],
      channal: undefined,
      editDatas: {},
      table_title: "创建表格",
      titles: "创建目录",
      visiblese: false,
      mefthods: undefined,
      site: "62f9aa4ab66242ea3349c2ee",
      channelsss: "",
    };
  },
  props: {
    params: {
      //传递的数据
      type: Object,
    },
    event: {
      type: Function,
    },
  },
  computed: {
    userinfo() {
      return this.$store.getters["account/user"];
    },
    pagination: {
      get() {
        return {
          page: this.dataSource.page || 1,
          per_page: this.dataSource.per_page || 12,
          total: this.dataSource.total || 0,
        };
      },
      set(val) {
        this.dataSource.page = val.page || 1;
        this.dataSource.per_page = val.per_page || 12;
        this.dataSource.total = val.total;
      },
    },
    config() {
      return {
        uploadFileHeaders: {
          Authorization: Cookie.get("Authorization"),
        },
        uploadImageHeaders: {
          Authorization: Cookie.get("Authorization"),
        },
      };
    },
    dynamicData() {
      let result = {
        channels: [],
      };
      return result;
    },
  },
  created() {
    console.log("searchform", this.searchform);
    this.searchform = this.params.searchform || this.searchform;
    this.init();
  },
  authorize: {
    // addOrder: "table.create",
    getdetails: "table.get",
    // addOrderss: "table.template",
    confirm: "table.delete",
    // interfaces: "interface.create",
  },
  methods: {
    init() {
      Promise.all([
        form_get({ name: "database_add" }),
        form_get({ name: "zdxf_ztbj" }),
        form_get({ name: "channel_add_edit" }),
        channel_list({
          site: this.site,
          tree: true,
          key: Math.random().toString(36).slice(2),
        }),
      ])
        .then((res) => {
          this.listData = res[0].data.data.form;
          this.listDatas = res[1].data.data.form;
          this.editDatas = res[2].data.data.form;
          this.channelData = res[3].data.data;
          this.dynamicData.channels = res[3].data.data;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
      this.list();
    },
    // 页面获取
    list() {
      this.searchloading = true;
      //获取列表数据
      table_paginate(this.searchform)
        .then((res) => {
          this.dataSource = res.data.data;
          this.searchloadings = false;
          this.resetloadings = false;
          this.searchloading = false;
        })
        .catch((err) => {
          this.$message.error(err.response.data.message);
          this.searchloadings = false;
          this.resetloadings = false;
          this.searchloading = false;
          console.log(err);
        });
    },
    // 目录选择
    treeSelect(selectedKeys) {
      this.channelsss = selectedKeys[0] || undefined;
      this.searchform.channel = this.channelsss;
      this.searchform.page = 1;
      this.list();
    },
    //
    onExpand(expandedKeys, info) {
      if (info.expanded) {
        this.channelexpandedKeys = [];
      } else {
        this.channelexpandedKeys = [expandedKeys];
      }
    },
    // 目录右键
    onRightClickchannel({ event, node }) {
      event.stopPropagation();
      let record = node.$options.propsData.dataRef;
      if (!record.dir) {
        this.$contextmenu({
          items: [
            {
              label: "编辑目录",
              icon: "el-icon-printer",
              onClick: () => {
                this.addchannel(record);
              },
            },
            {
              label: "删除目录",
              icon: "el-icon-printer",
              onClick: () => {
                this.deletechannel(record);
              },
            },
          ],
          event,
          customClass: "class-a",
          zIndex: 6000,
          minWidth: 230,
        });
        return false;
      }
    },
    ondesktopmenu(event) {
      this.$contextmenu({
        items: [
          {
            label: "创建目录",
            onClick: () => {
              this.addchannel();
            },
          },
        ],
        event,
        customClass: "class-a",
        zIndex: 6000,
        minWidth: 230,
      });
      return false;
    },
    // 删除目录
    deletechannel(record) {
      var that = this;
      this.$confirm({
        title: "确定要删除此目录吗?",
        content: "该操作不可逆 !请谨慎操作 !",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          channel_delete({
            id: record.id,
          })
            .then((res) => {
              if (res.data.status) {
                that.$message.success(res.data.message);
              } else {
                that.$message.error(res.data.reason);
              }
              that.init();
            })
            .catch((err) => {
              that.$message.error(err.response.data.message);
            });
        },
        onCancel() {},
      });
    },
    // 编辑
    addchannel(record) {
      this.visiblese = true;
      if (record) {
        this.titles = "编辑目录";
        this.mefthods = channel_edit;
        this.$nextTick(() => {
          this.$refs.editformes.setData({
            id: record.id,
            title: record.title,
            parent: record.parent,
            logo: record.logo,
            link: record.link,
            icon: record.icon,
            mome: record._mome, //目录描述
            name: record.name,
            sort: record.sort,
          });
        });
      } else {
        this.titles = "创建目录";
        this.mefthods = channel_insert;
        this.$nextTick(() => {
          this.$refs.editformes.reset();
        });
      }
    },
    // 表格增编
    addOrder(record) {
      this.visible = true;
      if (record) {
        this.tableid = record.id;
        this.table_title = "编辑表格";
        this.$nextTick(() => {
          this.$refs.forms.setData({
            title: record.title,
            logo: record.logo,
            content: record.content,
            channel: record.channel,
          });
        });
      } else {
        this.tableid = undefined;
        this.table_title = "创建表格";
      }
    },
    addzhong() {
      this.visibles = true;
    },
    handleOk() {
      this.$refs.forms
        .getData()
        .then((res) => {
          this.confirmLoading = true;
          var datas = Object.assign(res, { id: this.tableid });
          var methodes = this.tableid ? table_edit : table_create;
          methodes(datas)
            .then(() => {
              this.confirmLoading = false;
              this.visible = false;
              this.list();
            })
            .catch((err) => {
              console.log("err", err);
              this.confirmLoading = false;
              this.$message.error(err.response.data.message);
            });
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
    },
    // 中台保存
    handleOks() {
      this.$refs.formes.getData().then((res) => {
        this.visibles = true;
      });
    },
    // 目录保存
    handleOkes() {
      this.$refs.editformes
        .getData()
        .then((res) => {
          this.mefthods(
            Object.assign(res, {
              site: this.site,
            })
          )
            .then((response) => {
              this.visiblese = false;
              this.$message.success(response.data.message);
              this.init();
            })
            .catch((error) => {
              this.$message.error(error);
              this.visiblese = false;
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleCanceles() {
      this.visiblese = false;
    },
    handleCancels() {
      this.visibles = false;
    },
    handleCancel() {
      this.visible = false;
      this.$nextTick(() => {
        this.$refs.forms.reset();
      });
    },
    // 表单校验
    changes(key, value) {
      if (value == "name" && key) {
        table_name({ name: key })
          .then((res) => {
            this.$message.success(res.data.data);
          })
          .catch((err) => {
            console.log(err);
            this.$message.error(err.response.data.message);
          });
      }
    },
    // 生成模板
    addOrderss(record) {
      table_template({ id: record.id })
        .then((res) => {
          const a = document.createElement("a");
          var bstr = atob(res.data.data),
            n = bstr.length,
            u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const blob = new Blob([u8arr], {
            type: res.data.mimetype,
          });
          a.download = res.data.title;
          a.href = window.URL.createObjectURL(blob);
          a.click();
          this.$message.success("操作成功！");
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
    },
    //查看
    todetails(record) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "orderdetails",
          params: {
            data: record,
            searchform: this.searchform,
          },
        },
      });
    },
    // 接口文档
    interfaces(record) {
      interface_create({ id: record.id })
        .then((res) => {
          const a = document.createElement("a");
          var bstr = atob(res.data.data),
            n = bstr.length,
            u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const blob = new Blob([u8arr], {
            type: res.data.mimetype,
          });
          a.download = record.title;
          a.href = window.URL.createObjectURL(blob);
          a.click();
          this.$message.success("操作成功！");
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
    },
    // 查询
    onSearch(value) {
      this.searchloadings = true;
      this.searchform = Object.assign(this.pagination, {
        keyword: value,
        channel: this.channelsss,
        page: 1,
        per_page: 12,
      });
      this.list();
    },
    // 分页
    changepage(page, pageSize) {
      this.searchform.page = page;
      this.searchform.per_page = pageSize;
      this.list();
    },
    // 详情页
    getdetails(data) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "orderdetails",
          params: {
            data: data,
            pagination: this.pagination,
            searchform: this.searchform,
          },
        },
      });
    },
  },
};
</script>
<style scoped>
.cards .tree_channel {
  height: calc(100vh - 193px);
  margin: -6px -12px;
  box-shadow: 2px 0px 10px #d9d9d9;
}
.tree_channel >>> .ant-tree-treenode-switcher-close {
  border-bottom: 1px solid #eee;
}
.able_t {
  max-height: 600px;
  overflow: auto;
  padding: 0 10px;
}
.cards {
  margin: 0 !important;
  box-shadow: none
}
.headers {
  min-height: 150px;
  width: 100%;
  background-image: url("../imgs/jm.jpg");
  box-shadow: none;
  padding: 0 10%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.h_title {
  text-align: left;
  padding: 20px;
  background: #7db4f7b8;
  margin: 40px 0;
}
.h_title a {
  padding: 10px;
  color: #444;
  font-size: 18px;
  font-weight: 600;
}
.h_title a:hover {
  color: #fff;
  /* background: #78c6e7; */
  border-radius: 5px;
}
.content_style {
  height: 80px;
  padding-top: 10px;
}
.content_style p {
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  display: -webkit-box;
}
.alert .message a {
  font-weight: 600;
}
.alert .clear {
  float: right;
}
.titles {
  width: 100%;
  text-align: center;
  margin: 40px auto 0px;
}
.searchs {
  width: 40%;
}

.itemd {
  width: 100%;
  background-size: 200% auto;
  background-image: linear-gradient(
    to right,
    #a1c4fd 0%,
    #d9f3ff 51%,
    #a1c4fd 100%
  );
  border-radius: 5px;
  transition: 0.8s;
}
.itemd:hover {
  background-position: right center;
  transform: scale(1.05);
}
.title_title {
  display: inline-block;
  width: 65%;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.title_number {
  color: #898989;
  font-size: 14px;
  width: 35%;
  text-align: right;
  display: inline-block;
  width: 35%;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.items_card {
  padding: 10px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 100%;
}
.items_card >>> .ant-card-meta-detail {
  width: 100%;
}
.itemd >>> .ant-card-body {
  padding: 5px 12px;
}

.verticals {
  top: -0.2em;
  height: 1.8em;
  background: #7a7a7a;
}
</style>