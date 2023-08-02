<template>
  <div style="padding: 20px; background: white">
    <a-form-model
      ref="form"
      :model="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-row>
        <a-col :xl="6" :lg="6">
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
        <a-col :xl="5" :lg="5">
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
        <a-col :xl="13" :lg="13">
          <div class="rights_pa">
            <a-space>
              <a-button>
                <a-checkbox :disabled="onRecycles" @change="onRecycle"
                  >回收站</a-checkbox
                >
              </a-button>
              <a-button v-if="params.channel"
                ><a-checkbox @change="onFilter" :disabled="onFilters"
                  >过滤器</a-checkbox
                ></a-button
              >
              <a-button type="primary" icon="edit" @click="onAdd"
                >新增</a-button
              >
              <a-button
                type="danger"
                icon="delete"
                @click="onDelete"
                :loading="loading"
                :disabled="!selectedRowKeys.length"
                >删除</a-button
              >
              <a-dropdown>
                <a-menu slot="overlay">
                  <a-menu-item key="0">
                    <a-button
                      type="link"
                      size="small"
                      @click="onEditStatus(selectedRowKeys)"
                      :disabled="!selectedRowKeys.length"
                    >
                      <a-icon type="check" />
                      批量送审
                    </a-button>
                  </a-menu-item>
                  <a-menu-item key="1" v-if="parents.parent">
                    <a-button
                      icon="upload"
                      type="link"
                      size="small"
                      @click="batchSource"
                      :disabled="!selectedRowKeys.length"
                      >批量呈送</a-button
                    >
                  </a-menu-item>
                  <a-menu-item key="2">
                    <a-button
                      icon="copy"
                      type="link"
                      size="small"
                      @click="batchCopy"
                      :disabled="!selectedRowKeys.length"
                      >批量抄送</a-button
                    >
                  </a-menu-item>
                  <a-menu-item key="3">
                    <a-button
                      icon="swap"
                      type="link"
                      size="small"
                      @click="batchMove"
                      :disabled="!selectedRowKeys.length"
                      >批量迁移</a-button
                    >
                  </a-menu-item>
                  <a-menu-item key="4" v-if="!parents.parent">
                    <a-button
                      icon="vertical-align-bottom"
                      :disabled="!selectedRowKeys.length"
                      type="link"
                      @click="batchIssued"
                      size="small"
                    >
                      批量下达
                    </a-button>
                  </a-menu-item>
                  <a-menu-item key="5" v-if="params.channel && !black">
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
                  <a-menu-item key="6" v-if="params.channel && black">
                    <a-button
                      :disabled="!selectedRowKeys.length"
                      icon="eye"
                      size="small"
                      @click="removefilter"
                      type="link"
                      >移除过滤</a-button
                    >
                  </a-menu-item>
                </a-menu>
                <a-button style="margin-left: 8px" :loading="loading" v-show="!isrecycle">
                  <a-icon type="more" />
                  更多
                </a-button>
              </a-dropdown>
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
      :customRow="customRow"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onChange }"
    >
      <span slot="_title" slot-scope="text, record">
        <div class="overflowhiddens">
          <template v-if="record._delete">
            <a-tag color="#f50">已删除</a-tag>
          </template>
          <template v-else>
            <template v-if="record.approved && !record.approved.status && !record.status">
              <a-tooltip>
                <template slot="title"> 待审核 </template>
                <a-tag class="doc_tags" color="orange">审</a-tag>
              </a-tooltip>
            </template>
            <template
              v-else-if="record.approved && record.approved.status == 2 && !record.status"
            >
              <a-tooltip>
                <template slot="title"> 已驳回 </template>
                <a-tag class="doc_tags" color="red">驳</a-tag>
              </a-tooltip>
            </template>
            <template v-else-if="!record.approved && !record.status">
              <a-tooltip>
                <template slot="title"> 待送审 </template>
                <a-tag class="doc_tags" color="pink">送</a-tag>
              </a-tooltip>
            </template>
          </template>
          <template v-if="record.logo && record.logo.length">
            <a-tag class="doc_tags" color="green">图</a-tag>
          </template>
          <template v-if="record.link">
            <a-tag color="cyan">链</a-tag>
          </template>
          <!-- 下达判断 -->
          <!-- <template v-if="(record.site.title !== record.organization  && record.site.parent !== null)">
            <a-tooltip>
              <a-popover>
              <div slot="title">
                <div>
                  下达来源：
                </div>
              </div>
              <div slot="content">
                {{
                  record.organization ? record.organization : ""
                }}
                / {{ record.parent ? record.parent.title : "" }}
              </div>
              <a-tag class="doc_tags" color="orange">达</a-tag>
            </a-popover>
            </a-tooltip>
          </template> -->
          <template v-if="record.site._id !== params.site">
            <a-tag color="cyan" class="doc_tags">映</a-tag>
          </template>
          <!-- <template
            v-else-if="
              record.source.id && record.source.parent.site != params.site
            "
          >
            <a-popover>
              <div slot="title">
                <div>
                  <span>呈送类型：</span>
                  <span v-if="record.islink">链接型</span>
                  <span v-else>源类型</span>
                </div>
              </div>
              <div slot="content">
                呈送来源：
                {{
                  record.source.organization ? record.source.organization : ""
                }}
                / {{ record.source.parent ? record.source.parent.title : "" }}
              </div>
              <a-tag color="orange" class="doc_tags">
                <span>呈</span>
              </a-tag>
            </a-popover>
          </template> -->
          <!-- <template
            v-else-if="
              record.source.id && record.source.parent.site == params.site
            "
          >
            <a-popover>
              <div slot="title">
                <div>
                  <span>抄送类型：</span>
                  <span v-if="record.islink">链接型</span>
                  <span v-else>源类型</span>
                </div>
              </div>
              <div slot="content">
                抄送来源：
                {{
                  record.source.organization ? record.source.organization : ""
                }}
                / {{ record.source.parent ? record.source.parent.title : "" }}
              </div>
              <a-tag color="blue" class="doc_tags">
                <span>抄</span>
              </a-tag>
            </a-popover>
          </template> -->
          <template v-if="record.send && record.send.length">
            <a-popover>
              <div slot="title">送至：</div>
              <div slot="content" class="doc_tags_conten">
                <div
                  v-for="item in record.send"
                  :key="item.id"
                  class="doc_tags_items"
                >
                  <!-- <span class="doc_tags_title">{{ record.site.id == item.site.id ? "抄送" : "呈送"}}</span> -->
                  <a-tag color="#87d068" v-if="record.site.id == item.site.id"
                    >抄送</a-tag
                  >
                  <a-tag color="#108ee9" v-else>呈送</a-tag>
                  <span class="doc_tags_sites">{{ item.site.title }}</span> 站点
                  <span class="doc_tags_sites">{{ item.parent.title }}</span>
                  目录
                </div>
              </div>
              <a-tag color="blue" class="doc_tags">
                <span>送至</span>
              </a-tag>
            </a-popover>
          </template>
          <template
            v-if="record.supervise && record.supervise.risk_supervise == false"
          >
            <a-tag color="purple" class="doc_tags">督</a-tag>
          </template>
          <a @click="onCheck(record)" v-if="!record._delete" style="color: #1890ff">
            {{ text }}
          </a>
          <span v-else >
            {{ text }}
          </span>
        </div>
      </span>
      <span slot="parent" slot-scope="text, record">
        <template v-if="record.site.id == params.site && !record._delete">
          <a @click="onChannel(record)" style="color: #1890ff">{{
            record.parent.title
          }}</a>
        </template>
        <template v-else>
          <span>{{ record.parent.title }}</span>
        </template>
      </span>
      <span slot="site" slot-scope="text, record">{{ record.site.title }}</span>
      <span slot="action" slot-scope="text, record">
        <div style="text-align: center">
          <a
            icon="rollback"
            v-if="record._delete"
            :loading="loading"
            sizt="small"
            type="link"
            style="color: #2db7f5"
            @click="onRollback(record)"
            >还原</a
          >
          <template v-else>
            <a
              @click="onEdit(record)"
              style="color: #2db7f5"
              v-if="record.site._id === params.site"
            >
              <a-icon :type="'edit'" />
              编辑
            </a>
            <a v-else @click="tomapping(record)" style="color: #2db7f5"
              ><a-icon :type="'edit'" />编辑</a
            >
          </template>
          <a-dropdown class="drops" v-show="!isrecycle">
            <a style="color: #2db7f5">
              <a-icon type="more" />
              更多
            </a>
            <a-menu slot="overlay" style="width: 150px">
              <a-menu-item key="0">
                <a @click="onPreview(record)" style="color: #2db7f5">预览</a>
              </a-menu-item>
              <a-menu-item
                key="1"
                v-if="
                  record.site._id === params.site &&
                  record.approved &&
                  !record.approved.status && !record._delete
                "
              >
                <a @click="onEditStatus([record.id])" style="color: #2db7f5"
                  >送审</a
                >
              </a-menu-item>
              <a-menu-item key="2" v-if="!record._delete">
                <a @click="onSupervise(record)" style="color: #2db7f5"
                  >创建督导任务</a
                >
              </a-menu-item>
              <!--  v-if="$auth('render.router')" -->
              <a-menu-item key="urls3">
                <a @click="render_routers(record)" style="color: #2db7f5">
                  获取文章地址
                </a>
              </a-menu-item>
              <!-- <a-sub-menu key="test">
                <span slot="title" style="color: #2db7f5"> 发布 &nbsp;</span>
                <a-menu-item key="2">
                  <a style="color: #2db7f5" @click="shares('微博账号')"
                    >微博账号</a
                  >
                </a-menu-item>
                <a-menu-item key="3">
                  <a style="color: #2db7f5" @click="shares('微信公众号')">
                    微信公众号</a
                  >
                </a-menu-item>
              </a-sub-menu> -->
              <a-sub-menu key="update">
                <span slot="title" style="color: #2db7f5"> 更新文章缓存 </span>
                <a-menu-item>
                  <a @click="Updatecache(record, true)" style="color: #2db7f5">
                    读取最新数据
                  </a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="Updatecache(record, false)" style="color: #2db7f5">
                    读取缓存数据
                  </a>
                </a-menu-item>
              </a-sub-menu>
            </a-menu>
          </a-dropdown>
        </div>
      </span>
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
    <div class="fenxiang" :style="{ display: sharese ? 'block' : 'none' }">
      <img
        style="width: 50px; height: 50px"
        v-show="sharese_src == 1"
        src="../images/weibo.png"
      />
      <img
        style="width: 50px; height: 50px"
        v-show="sharese_src == 2"
        src="../images/weixin.png"
      />
      <div>发布成功！</div>
    </div>
    <a-modal
      title="创建督导任务"
      width="50%"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <k-form-build :value="formDatas" ref="kcompanyForm" />
    </a-modal>
  </div>
</template>
<script>
import {
  document_paginate,
  document_delete,
  document_rollback,
  channel_black,
  channel_filter,
  document_sort,
  document_router,
  risk_initiative,
  render_reset,
  render_router, //获取站点、目录、文章地址
} from "@/services/content";
import { form_get } from "@/services/forms";
import { organization_get } from "@/services/organization";
import { approve_submit, approve_multisub } from "@/services/approve";
import EditDocuments from "./EditDocuments.vue";
import Applications from "../../Applications.vue";
export default {
  name: "InfoDetails",
  components: {
    EditDocuments,
    Applications,
  },
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
  data() {
    return {
      form: {},
      selectData: ["0", "1"],
      isrecycle: false,
      black: false,
      keyword: "",
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
      loading: true,
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
          align: "left",
          width: "50%",
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
          align: "center",
          sorter: true,
          scopedSlots: { customRender: "release" },
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 140,
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
      selectedRowKeys: [],
      data: {},
      parents: {},
      sharese: false,
      sharese_src: 1,
      visible: false,
      confirmLoading: false,
      formDatas: {},
      risk_initiatives: {},
      onRecycles: false,
      onFilters: false,
      urltext: "",
      sorts: -1
    };
  },
  computed: {
    search: {
      get() {
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
      set(val) {
        this.status = val.status;
        this.delete = val.delete;
        this.black = val.black;
        this.keyword = val.keyword;
      },
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
    userinfo() {
      return {
        roles: this.$store.getters["account/roles"],
      };
    },
  },
  // watch: {
  //   params: {
  //     handler(value) {
  //       this.loading = true;
  //       this.init();
  //     },
  //     deep: true,
  //   },
  // },
  created() {
    console.log("params", this.params);
    this.init();
  },
  methods: {
    init() {
      this.pagination = this.params.pagination || this.pagination;
      this.search = this.params.search || this.search;
      this.parents = this.params.siteinfo;
      this.$nextTick(() => {
        this.paginate();
      });
      form_get({ name: "delete_task" })
        .then((respose) => {
          console.log("respose", respose);
          this.formDatas = respose.data.data.form;
        })
        .catch((err) => {
          console.log(err);
        });
      // organization_get({ id: this.params.site })
      //   .then((res) => {
      //     this.parents = res.data.data;
      //     this.paginate();
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    },
    paginate() {
      var datas = {
        site: this.params.site || this.params.id,
        page: this.pagination.page,
        channel: this.params.channel || undefined,
        per_page: this.pagination.per_page,
        search: this.search,
        sort: this.sorts
      };
      this.loading = true;
      document_paginate(datas)
        .then((res) => {
          this.data = res.data.data;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
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
        if (sorter.order == "ascend") {
          // 上升
          this.sorts = 1;
        } else {
          // 下降
          this.sorts= -1;
        }
        var datas = {
        site: this.params.site || this.params.id,
        page: this.pagination.page,
        channel: this.params.channel || undefined,
        per_page: this.pagination.per_page,
        search: this.search,
        sort: this.sorts
      };
        this.loading = true;
        document_paginate(datas)
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
      this.params.pagination = {
        page: page,
        per_page: pageSize,
      };
      this.paginate();
    },
    // 过滤器
    onFilter(e) {
      console.log('e', e)
      this.selectedRowKeys = [];
      this.black = e.target.checked;
      console.log("e.target.checked", e.target.checked);
      if (e.target.checked) {
        this.onRecycles = true;
      } else {
        this.onRecycles = false;
      }
      this.loading = true;
      this.pagination.page = 1;
      this.paginate();
    },
    // 回收站
    onRecycle(e) {
      this.selectedRowKeys = [];
      this.isrecycle = e.target.checked;
      if (e.target.checked) {
        this.onFilters = true;
      } else {
        this.onFilters = false;
      }
      this.loading = true;
      this.pagination.page = 1;
      this.paginate();
    },
    onSelectChange(value) {
      this.selectData = value;
      this.loading = true;
      this.pagination.page = 1;
      this.paginate();
    },
    // 移除过滤
    removefilter() {
      this.loading = true;
      this.$confirm({
        title: "确认移除过滤",
        content: "确认要移除过滤文章吗!",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          channel_filter({
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
    },
    // 文章过滤
    artFilter() {
      if (this.params.channel) {
        this.loading = true;
        this.$confirm({
          title: "过滤确认",
          content: "确认要过滤当前目录下选中的文章吗!",
          okText: "确认",
          cancelText: "取消",
          onOk: () => {
            channel_black({
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
      } else {
        this.$message.error("请选择过滤目录");
      }
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
          document_delete({
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
    // 文章编辑
    onEdit(record) {
      console.log("record", record);
      let readonly = false;
      // 映射 呈送
      if (record.site._id != this.params.site) {
        readonly = true;
      } else {
        // 抄送
        if (record.islink) {
          readonly = true;
        }
      }
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "edit-documents",
          params: Object.assign({}, record, {
            pagination: this.pagination,
            search: this.search,
            site: this.params.site,
            channel: readonly ? record.parent.id : this.params.channel,
            readonly: readonly,
            siteinfo: this.parents,
            channelData: this.params.channelData,
          }),
        },
      });
    },
    onCheck(record) {
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
    // 文章添加
    onAdd() {
      let readonly = false;
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "edit-documents",
          params: Object.assign({
            pagination: this.pagination,
            search: this.search,
            site: this.params.site,
            channel: this.params.channel || undefined,
            readonly: readonly,
            siteinfo: this.parents,
            channelData: this.params.channelData,
          }),
        },
      });
    },
    onChannel(record) {
      this.pagination.page = 1;
      this.$emit("event", {
        method: "treeSelect",
        params: [record.parent.id],
      });
    },
    // 送审
    onEditStatus(record) {
      const items = this.filterMapsDocument(record);
      record = items.filter((x) => !x.status).map((x) => x.id);
      approve_multisub({
        documents: record,
      })
        .then(() => {
          this.$message.success(`${record.length}条文章已送审`);
          this.paginate();
        })
        .catch((error) => {
          console.log("error", error);
          this.$message.error(error.response.data.message);
        });
    },
    // 创建督导任务
    onSupervise(record) {
      this.visible = true;
      this.risk_initiatives = record;
    },
    // 督导任务提交
    handleOk() {
      this.$refs.kcompanyForm
        .getData()
        .then((res) => {
          var that = this;
          var datas = Object.assign(res, {
            site: that.risk_initiatives.site.id,
            channel: that.risk_initiatives.parent.id,
            document: that.risk_initiatives.id,
            start: res.rangedata[0],
            end: res.rangedata[1],
          });
          risk_initiative(datas)
            .then((response) => {
              console.log("response", response);
              this.visible = false;
              this.paginate();
            })
            .catch((error) => {
              console.log(error);
              this.$message.error(error.response.data.message);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleCancel() {
      this.visible = false;
      this.$refs.kcompanyForm.reset();
    },
    //排除映射文章
    filterMapsDocument(ids) {
      const items = [...this.data.items];
      return items.filter((record) => {
        if (ids.indexOf(record.id) === -1) {
          return false;
        }
        if (record.site._id !== this.params.site) {
          return false;
        }
        return true;
      });
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
    // 文章呈送
    batchSource() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "document-source",
          params: Object.assign(
            {},
            {
              pagination: this.pagination,
              search: this.search,
              site: this.params.site,
              selectedRowKeys: this.selectedRowKeys,
              channel: this.params.channel || undefined,
              siteinfo: this.parents,
              batch: false,
            }
          ),
        },
      });
    },
    // 文章抄送
    batchCopy() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "document-source",
          params: Object.assign(
            {},
            {
              pagination: this.pagination,
              search: this.search,
              site: this.params.site,
              selectedRowKeys: this.selectedRowKeys,
              channel: this.params.channel || undefined,
              siteinfo: this.parents,
              batch: true,
            }
          ),
        },
      });
    },
    // 文章迁移
    batchMove() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "document-move",
          params: Object.assign(
            {},
            {
              pagination: this.pagination,
              search: this.search,
              site: this.params.site,
              selectedRowKeys: this.selectedRowKeys,
              channel: this.params.channel || undefined,
              siteinfo: this.parents,
            }
          ),
        },
      });
    },
    // 文章下达
    batchIssued() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "document-issued",
          params: Object.assign(
            {},
            {
              pagination: this.pagination,
              search: this.search,
              site: this.params.site,
              selectedRowKeys: this.selectedRowKeys,
              channel: this.params.channel || undefined,
              siteinfo: this.parents,
            }
          ),
        },
      });
    },
    // 文章映射
    tomapping(record) {
      var roles = this.userinfo.roles[1].operation;
      var asdl = roles.filter((item) => {
        return item == record.site.name;
      });
      if (asdl.length) {
        this.$emit("on-open", {
          id: record.id,
          name: "Content",
          status: true,
          location: "top",
          sort: 0,
          type: "system",
          hidden: false,
          width: "75%",
          height: "75%",
          router: "Content",
          data: {
            site: record.site.id,
            channel: record.parent.id,
            document: record,
            yingshe: true,
          },
          cancel: () => {},
        });
      }else{
        this.$message.warning("您没有映射目录的权限！")
      }
      // var that = this;
      // this.$confirm({
      //   okText: "确定",
      //   cancelText: "取消",
      //   title: "是否确定跳转到" + record.organization + "站点进行编辑？",
      //   // content: "该操作不可返回，需重新点击站点及目录才能返回当前页面。",
      //   onOk() {
      //     that.$emit("event", {
      //       method: "refreshsite",
      //       params: {
      //         data: record.parent.id,
      //         site: record.site.id,
      //         document: record,
      //       },
      //     });
      //   },
      //   onCancel() {
      //     console.log("Cancel");
      //   },
      // });
    },
    // 预览
    onPreview(record) {
      var uri = `site_${record.site.name}/channel_${record.parent.name}/doc_${record.id}.html`;
      var url = `${process.env.VUE_APP_CHECK_URL}${uri}`;
      var layer = this.$layer.iframe({
        id: record.id,
        type: 2,
        title: record.title,
        maxmin: false,
        shade: false,
        shadeClose: false,
        resize: false,
        zIndex: 500,
        icon: false,
        area: ["100%", "100%"],
        scrollbar: false,
        content: {
          content: Applications, //传递的组件对象
          parent: this, //当前的vue对象
          data: {
            type: "iframe",
            router: url,
            refresh: () => {},
            open: () => {},
          },
        },
        full: () => {
          //关闭弹窗事件
          console.log("关闭iframe");
        },
        min: function (layero) {
          //执行最小化
          console.log(layero);
        },
        restore: function (layero) {
          //执行还原
          console.log(layero);
        },
        cancel: () => {
          //关闭弹窗事件
          console.log("关闭iframe");
        },
      });
    },
    // 拖动排序
    customRow(record, index) {
      // return {
      //   // FIXME: draggable： true 不生效还不晓得是什么原因，先使用鼠标移入事件设置目标行的draggable属性
      //   props: {
      //     // draggable: 'true'
      //   },
      //   style: {
      //     cursor: "pointer",
      //   },
      //   on: {
      //     // 鼠标移入
      //     mouseenter: (event) => {
      //       // 兼容IE
      //       var ev = event || window.event;
      //       ev.target.draggable = true;
      //     },
      //     // 开始拖拽
      //     dragstart: (event) => {
      //       // 兼容IE
      //       var ev = event || window.event;
      //       // 阻止冒泡
      //       ev.stopPropagation();
      //       // 得到源目标数据
      //       this.sourceObj = record;
      //       this.starts = record.id;
      //     },
      //     // 拖动元素经过的元素
      //     dragover: (event) => {
      //       // 兼容 IE
      //       var ev = event || window.event;
      //       // 阻止默认行为
      //       ev.preventDefault();
      //     },
      //     // 鼠标松开
      //     drop: (event) => {
      //       // 兼容IE
      //       var ev = event || window.event;
      //       // 阻止冒泡
      //       ev.stopPropagation();
      //       this.ends = record.id;
      //       document_sort({
      //         id: this.starts,
      //         target: this.ends,
      //         position: 1,
      //       })
      //         .then(() => {
      //           this.paginate();
      //         })
      //         .catch((err) => {
      //           console.log(err);
      //         });
      //     },
      //   },
      // };
    },
    // 获取文章地址
    // 获取目录地址
    render_routers(record){
      var data = {
        document: record.id
      }
      render_router(data).then(res =>{
        if(res.data.data.document){
          this.urltext= res.data.data.document.router
          var that = this
          that.$info({
            title: "文章地址：",
            content: that.urltext,
            okText:"复制",
            onOk() {
              that.$copyText(that.urltext)
              .then((res) => {
                that.$message.success("复制成功!");
              })
              .catch((err) => {
                console.log(err);
                that.$message.error("复制失败！");
              });
            },
          });
        }else{
          this.$message.error("当前文章暂无地址！")
        }
      }).catch(err=>{
        console.log(err)
        this.$message.error(err.response.data.message)
      })
    },
    // 发布
    shares(index) {
      var that = this;
      that.$confirm({
        title:
          index == "微博账号"
            ? "是否确认将该文章发布到微博账号?"
            : "是否确认将该文章发布到微信公众号?",
        cancelText: "取消",
        okText: "确定",
        onOk() {
          if (index == "微博账号") {
            that.$nextTick(() => {
              that.sharese_src = 1;
              that.sharese = true;
            });
          } else {
            that.$nextTick(() => {
              that.sharese_src = 2;
              that.sharese = true;
            });
          }
          setTimeout(() => {
            that.sharese = false;
          }, 3000);
        },
        onCancel() {},
      });
    },
    Updatecache(record, boolean) {
      render_reset({
        nocache: boolean,
        document: record.id,
      })
        .then((response) => {
          if (response.data.status == 200) {
            this.$message.success(response.data.message);
            this.paginate();
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
  },
};
</script>
<style scoped>
.rights_pa {
  margin-top: 5px;
  text-align: right;
}
.rights_pa >>> .ant-checkbox + span {
  padding-right: 8px !important;
}
.time_line {
  height: 500px;
  overflow: auto;
}
.sdfsdf {
  width: 100%;
  text-align: center;
}
.doc_tags_conten {
  width: 400px;
  max-height: 200px;
  overflow-y: auto;
}
.doc_tags_items {
  margin: 8px 0;
}
.doc_tags_title {
  background: #eee;
  padding: 2px 8px;
  margin-right: 10px;
}
.doc_tags_sites {
  color: #00aaf0;
  font-weight: 500;
}
</style>
<style lang="less">
.drops {
  .ant-dropdown-menu-submenu-title {
    color: #1890ff;
  }
}
.fenxiang {
  display: none;
  position: absolute;
  top: 20px;
  left: calc(50% - 140px);
  background: #fff;
  padding: 20px 100px;
  border: 1px solid #e7e7e7;
  text-align: center;
  font-size: 16px;
  animation: fadenum 3s ease;
}
@keyframes fadenum {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.overflowhiddens {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
</style>
