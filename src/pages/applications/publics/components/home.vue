<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <a-back-top />
    <div :class="advanced ? 'search' : null">
      <a-form-model layout="horizontal" :model="searchform" ref="searchform">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-model-item
                label="查询码"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-model="searchform.keyword"
                  placeholder="请输入查询码"
                  allowClear
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item
                label="状态"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-select
                  placeholder="请选择查询状态"
                  mode="multiple"
                  v-model="searchform.status"
                  :allowClear="true"
                >
                  <a-select-option
                    v-for="(item, key) in dynamicData.status"
                    :key="key"
                    :value="key"
                    >{{ item.title }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item
                label="时间范围"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-select
                  placeholder="请选择查询时间"
                  v-model="searchform.scope"
                  allowClear
                >
                  <a-select-option
                    v-for="(item, key) in dynamicData.scope"
                    :key="key"
                    :value="key"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-model-item
                label="指定日期"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
                format="YYYY-MM-DD"
              >
                <a-range-picker
                  style="width: 100%"
                  v-model="searchform.rangedata"
                  @change="onTimerRangeChange"
                  allowClear
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item
                label="是否公开"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-select
                  placeholder="请选择是否公开"
                  v-model="searchform.boardshow"
                  allowClear
                >
                  <a-select-option value="2">公开</a-select-option>
                  <a-select-option value="1">不公开</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <!-- <a-col :md="8" :sm="24">
              <a-form-model-item
                label="受理部门"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-select
                  v-model="searchform.organizations"
                  placeholder="请选择查询部门"
                  allowClear
                  show-search
                  :filter-option="filterOption"
                >
                  <a-select-option
                    v-for="item in dynamicData.organizations"
                    :key="item.value"
                    >{{ item.label }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col> -->

            <a-col :md="8" :sm="24">
            <a-form-model-item
              label="受理部门"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18,offset:1 }"
            >
              <a-tree-select
                style="width: 100%"
                show-search
                v-model="searchform.organizations"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="organization"
                placeholder="请选择查询部门"
                allow-clear multiple
                :replaceFields="{
                  title: 'title',
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
                <span
                  slot="title"
                  slot-scope="{ key, value }"
                  style="color: #08c"
                  >{{ value }}</span
                >
              </a-tree-select>
            </a-form-model-item>
          </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px">
          <a-button type="primary" @click="onSearch" :loading="searchloading"
            >查询</a-button
          >
          <a-button
            style="margin-left: 8px"
            @click="resetForm"
            :loading="resetloading"
            >重置</a-button
          >
          <a @click="toggleAdvanced" style="margin-left: 8px">
            {{ advanced ? "收起" : "展开" }}
            <a-icon :type="advanced ? 'up' : 'down'" />
          </a>
        </span>
      </a-form-model>
    </div>
    <a-row style="padding: 10px 20px">
      <a-col :span="24" style="text-align: left">
        <a-space>
          <a-button type="primary" @click="onEnter" v-auth="`public.insert`" v-if="true">
            <a-icon type="plus" />录入
          </a-button>
          <a-button type="primary" @click="add" v-auth="`config.get`">
            <a-icon type="setting" />配置
          </a-button>
        </a-space>
      </a-col>
    </a-row>
    <a-drawer
      placement="right"
      :closable="true"
      width="500"
      :getContainer="false"
      :visible="drawerVisible"
      @close="
        () => {
          drawerVisible = false;
        }
      "
    >
      <setting />
    </a-drawer>
    <!-- <div class="alert">
      <a-alert type="info" :show-icon="true">
        <div class="message" slot="message">
          已选择&nbsp;
          <a>{{ selectedRowKeys.length }}</a>
          &nbsp;项
          <a class="clear" v-if="selectedRowKeys.length" @click="onSelectClear">清空</a>
        </div>
      </a-alert>
    </div> -->

    <a-table
      ref="table"
      bordered
      class="table_content"
      size="middle"
      :loading="loadings"
      rowKey="id" :scroll="{ x: 'calc( 800px + 50%)' }"
      :pagination="false"
      :columns="columns" 
      :dataSource="dataSource.items"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
    >
      <span slot="action" slot-scope="text, record">
        <a
          @click="onEdit(record)"  v-auth="`public.insert`"
          v-if="
            record._creator && record.status[record.status.length - 1] !== 110
          "
          >编辑</a
        >
        <a-divider
          type="vertical"
          v-if="
            record._creator && record.status[record.status.length - 1] !== 110
          "
        />
        <a @click="toform(record)"  v-if="$auth('public.get')">查看</a>
        <a-divider
          type="vertical"
          v-if="record.status[record.status.length - 1] !== 110"
        />
        <a
          @click="repeal(record)" v-auth="`public.repeal`"
          v-if="record.status[record.status.length - 1] !== 110"
          >撤销</a
        >
        <a-divider type="vertical" v-if="record.next.length !== 0" />
        <a-dropdown v-if="record.next.length !== 0">
          <a class="ant-dropdown-link">
            更多
            <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item v-for="item in record.next" :key="item">
              <a
                class="action_button"
                href="javascript:;"
                @click="tagButton(record, dynamicData.button[item], item)"
                >{{ dynamicData.button[item].title }}</a
              >
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
      <span slot="organization" slot-scope="text, record">{{
        record.organization
      }}</span>
      <span slot="type" slot-scope="text, record">{{
        record.type == 1 ? "公民" : "企业"
      }}</span>
      <span slot="status" slot-scope="text, record">
        <a-tag
          :color="dynamicData.status[item].color"
          class="tags"
          v-for="item in record.status"
          :key="item"
          >{{ dynamicData.status[item].title }}</a-tag
        >
      </span>
      <span slot="deadline" slot-scope="text, record">{{
        record.index > 0
          ? "剩余" + record.index + "天"
          : record.index == 0
          ? "已完成"
          : "逾期" + -record.index + "天"
      }}</span>
      <span slot="purpose" slot-scope="text, record">{{
        purposeFun(record.form.purpose)
      }}</span>
      <span slot="mode" slot-scope="text, record">{{
        modeFun(record.form.mode)
      }}</span>
      <span slot="boardshow" slot-scope="text, record">{{
        record.boardshow == true ? "是" : "否"
      }}</span>
      <span slot="provide" slot-scope="text, record">{{
        provideFun(record.form.provide)
      }}</span>
      <!-- 标签 -->
      <span slot="keywords" slot-scope="text, record">
        <a-tag class="tags" v-for="item in record.keywords" :key="item">{{
          item
        }}</a-tag>
      </span>
    </a-table>
    <a-pagination
      size="small"
      style="text-align: right"
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
    <!-- 新增弹窗 -->
    <a-modal
      title="录入"
      width="80%"
      :visible="formDialog"
      :confirm-loading="subloading"
      @ok="onSubmit"
      @cancel="
        () => {
          formDialog = false;
          this.$refs.kform.reset();
          this.$refs.keyforms.resetFields();
        }
      "
    >
      <a-radio-group
        default-value="citizen"
        v-model="typeform"
        button-style="solid"
        @change="onTypeChange"
      >
        <a-radio-button value="citizen">公民</a-radio-button>
        <a-radio-button value="company">企业</a-radio-button>
      </a-radio-group>
      <k-form-build
        :value="jsonData"
        ref="kform" :config="config"
        @change="chanales"
        :dynamicData="dynamicData"
      />
      <a-form-model ref="keyforms" :model="keyforms" :rules="rules">
        <a-form-model-item
          label="标签"
          prop="keywords"
          :labelCol="{ span: 3 }"
          :wrapperCol="{ span: 10 }"
        >
          <a-select
            mode="tags"
            placeholder="请输入有关此申请内容的标签"
            style="width: 90%"
            v-model="keyforms.keywords"
          >
            <a-select-option v-for="items in keywordsList" :key="items">{{
              items
            }}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 公民表单编辑弹窗 -->
    <a-modal
      title="编辑公民申请"
      width="80%"
      :confirm-loading="subloading"
      :visible="citizenedit"
      @ok="citizenEditSubmit(citizenForm)"
      @cancel="
        () => {
          citizenedit = false;
        }
      "
    >
      <k-form-build
        :value="citizenData"
        :defaultValue="citizenForm"
        ref="kcitizenForm" :config="config"
        :dynamicData="dynamicData"
      />
    </a-modal>
    <!-- 企业表单编辑弹窗 -->
    <a-modal
      title="编辑企业申请"
      width="80%"
      :confirm-loading="subloading"
      :visible="companyedit"
      @ok="onEditSubmit(companyForm)"
      @cancel="
        () => {
          companyedit = false;
        }
      "
    >
      <k-form-build
        :value="companyData"
        :defaultValue="companyForm"
        ref="kcompanyForm" :config="config"
        :dynamicData="dynamicData"
      />
    </a-modal>
    <!-- 修改状态 -->
    <a-modal
      :title="titleStr"
      width="50%"
      :confirm-loading="subloading"
      :visible="status"
      @ok="statusSubmit()"
      @cancel="
        () => {
          (status = false), this.$refs.forms.reset();
        }
      "
    >
      <k-form-build
        :value="listData"
        @change="modalChange"
        :dynamicData="dynamicData"
        ref="forms" :config="config"
      />
    </a-modal>
    <!-- 申请撤销 -->
    <a-modal
      title="申请撤销"
      width="50%"
      :confirm-loading="subloading"
      :visible="repeals"
      @ok="repealsSubmit()"
      @cancel="
        () => {
          (repeals = false), this.$refs.repealsforms.reset();
        }
      "
    >
      <k-form-build
        :value="repealData"
        @change="modalChange"
        :dynamicData="dynamicData"
        ref="repealsforms" :config="config"
      />
    </a-modal>
    <!-- 输入标签 -->
    <a-modal
      title="输入标签"
      width="50%"
      :confirm-loading="subloading"
      :visible="keywords"
      @ok="keyformsSubmit()"
      @cancel="
        () => {
          this.keywords = false;
          this.$refs.keyforms.resetFields();
        }
      "
    >
      <a-form-model ref="keyforms" :model="keyforms" :rules="rules">
        <a-form-model-item
          label="标签"
          prop="keywords"
          :labelCol="{ span: 4 }"
          :wrapperCol="{ span: 18 }"
        >
          <a-select
            mode="tags"
            placeholder="请输入有关此申请内容的标签"
            style="width: 100%"
            v-model="keyforms.keywords"
          >
            <a-select-option v-for="items in keywordsList" :key="items">{{
              items
            }}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- <div class="loading" v-if="loadings">
      <a-spin class="span_loading" tip="Loading..." size="large" />
    </div> -->
  </a-card>
</template>

<script>
import { form_get } from "@/services/forms";
import {
  edit,
  public_paginate,
  public_insert,
  repeal, //撤销
  defer, //延期
  repair, //待补证
  reply, //答复
  restore, //补充答复
  addition, //补证资料
  opinion, // 待征求第三方意见
  opinioned, //录入第三方意见
  teamwork, //待补充协办信息
  teamworked, //录入协办信息
  reconsider, //行政复议
  lawsuit, //诉讼
  keywords, //标签
  keywordslist, //标签列表
  uploadlist, //模板列表
  replace, //模板下载
  site_list
} from "@/services/public";
import setting from "./setting";
import Cookie from "js-cookie";
import { organization_tree } from "@/services/organization";

export default {
  props: {
    params: {
      //传递的数据
      type: Object,
    },
    event: {
      type: Function,
    },
  },
  components: {
    setting,
  },
  data() {
    return {
      advanced: false,
      formDialog: false,
      searchloading: false,
      resetloading: false,
      subloading: false,
      repeals: false,
      repealsId: "",
      columns: [
        {
          title: "查询编号",
          dataIndex: "select",
          width: 50,
          scopedSlots: { customRender: "select" },
        },
        {
          title: "查询码",
          dataIndex: "secret",
          width: 80,
          scopedSlots: { customRender: "secret" },
        },
        {
          title: "申请人姓名",
          dataIndex: "realname",
          width: 60,
          scopedSlots: { customRender: "realname" },
        },
        {
          title: "申请人性质",
          dataIndex: "type",
          width: 60,
          scopedSlots: { customRender: "type" },
        },
        {
          title: "手机号码",
          dataIndex: "mobile",
          width: 100,
          scopedSlots: { customRender: "mobile" },
        },
        {
          title: "证件号码",
          dataIndex: "passport",
          width: 100,
          scopedSlots: { customRender: "passport" },
        },
        {
          title: "组织",
          dataIndex: "organization.title",
          width: 120,
          scopedSlots: { customRender: "title" },
        },
        {
          title: "信息用途",
          dataIndex: "purpose",
          width: 80,
          scopedSlots: { customRender: "purpose" },
        },
        {
          title: "天数(自然日)",
          dataIndex: "deadline",
          width: 100,
          scopedSlots: { customRender: "deadline" },
        },
        {
          title: "申请方式",
          dataIndex: "mode",
          width: 60,
          scopedSlots: { customRender: "mode" },
        },
        {
          title: "信息提供方式",
          dataIndex: "provide",
          width: 100,
          scopedSlots: { customRender: "provide" },
        },
        {
          title: "创建时间",
          dataIndex: "_createtime",
          width: 120,
          scopedSlots: { customRender: "_createtime" },
        },
        {
          title: "是否公开",
          dataIndex: "boardshow",
          width: 50,
          scopedSlots: { customRender: "boardshow" },
        },
        {
          title: "状态",
          dataIndex: "status",
          width: 120,
          scopedSlots: { customRender: "status" },
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 230,
          scopedSlots: { customRender: "action" },
        },
      ],
      jsonData: {},
      keyforms: {
        keywords: [],
      },
      citizenData: {},
      companyData: {},
      listData: {},
      deferData: {},
      repairData: {},
      replyData: {},
      restoreData: {},
      opinionsData: {},
      opinionedData: {},
      teamworkData: {},
      teamworkedData: {},
      lawsuitData: {},
      reconsiderData: {},
      repealData: {}, //撤销
      jsonDatas: {
        citizen: {},
        company: {},
        citizenedit: {},
        companyedit: {},
      },
      searchform: {},
      typeform: "citizen",
      dataSource: {},
      selectedRowKeys: [],
      total: 1,
      pageSizeOptions: ["10", "20", "30", "40"],
      // 编辑弹窗信息
      citizenedit: false,
      companyedit: false,
      status: false,
      citizenForm: {}, //公民表单
      companyForm: {}, //企业表单
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      id: "",
      editmethod: "",
      titleStr: "",
      modalId: "",
      replyInfo: "",
      loadings: true,
      modalList: [],
      keywords: false,
      keywordsid: "",
      keywordsList: [],
      rules: {
        keywords: [{ required: true, message: "请输入标签" }],
      },
      drawerVisible: false,
      organization:[]
    };
  },
  computed: {
    userinfo() {
      return this.$store.getters["account/user"];
    },
    pagination: {
      get() {
        return {
          page: this.dataSource.page || 1,
          per_page: this.dataSource.per_page || 10,
        };
      },
      set(val) {
        this.dataSource.page = val.page;
        this.dataSource.per_page = val.per_page;
      },
    },
    dynamicData() {
      let result = {
        organizations: this.organization,
        modalList: [],
        provide: [
          {
            label: "纸面",
            value: 1,
          },
          {
            label: "电子邮件",
            value: 2,
          },
          {
            label: "光盘",
            value: 3,
          },
          {
            label: "磁盘",
            value: 4,
          },
        ],
        purpose: [
          {
            label: "自身生活需要",
            value: 1,
          },
          {
            label: "自身生产需要",
            value: 2,
          },
          {
            label: "自身科研需要",
            value: 3,
          },
          {
            label: "查验自身信息",
            value: 4,
          },
        ],
        mode: [
          {
            label: "网络",
            value: 1,
          },
          {
            label: "当面",
            value: 2,
          },
          {
            label: "邮寄",
            value: 3,
          },
          {
            label: "传真",
            value: 4,
          },
        ],
        status: {
          20: { title: "待答复", color: "red" },
          25: { title: "待补证", color: "orange" },
          30: { title: "补证资料", color: "pink" },
          31: { title: "待补充第三方意见", color: "pink" },
          32: { title: "待补充协办信息", color: "pink" },
          40: { title: "第三方意见", color: "green" },
          45: { title: "协办信息", color: "green" },
          50: { title: "延期信息", color: "green" },
          60: { title: "已答复", color: "green" },
          65: { title: "补充答复", color: "green" },
          70: { title: "行政复议", color: "blue" },
          75: { title: "诉讼", color: "blue" },
          // 80: { title: "答复复议", color: "purple" },
          // 90: { title: "已答复复议", color: "purple" },
          100: { title: "已失效", color: "gray" },
          110: { title: "已撤销", color: "gray" },
        },
        scope: {
          1: "今天",
          2: "本周",
          3: "上周",
          4: "本月",
          5: "上月",
        },
        button: {
          25: {
            title: "待补证",
            color: "pink",
            interface: "repair",
            name: "补证原因",
          },
          30: {
            title: "补证资料",
            color: "orange",
            interface: "addition",
            name: "补证资料",
          },
          31: {
            title: "待征求第三方意见",
            color: "orange",
            interface: "opinion",
            name: "征求第三方意见",
          },
          32: {
            title: "待补充协办信息",
            color: "orange",
            interface: "teamwork",
            name: "补充协办信息",
          },
          40: {
            title: "录入第三方意见",
            color: "green",
            interface: "opinioned",
            name: "第三方意见",
          },
          45: {
            title: "录入协办信息",
            color: "green",
            interface: "teamworked",
            name: "协办信息",
          },
          50: {
            title: "申请延期",
            color: "red",
            interface: "defer",
            name: "延期",
          },
          60: {
            title: "答复",
            color: "cyan",
            interface: "reply",
            name: "办结答复",
          },
          65: {
            title: "补充答复",
            color: "green",
            interface: "restore",
            name: "补充答复",
          },
          70: {
            title: "行政复议",
            color: "blue",
            interface: "reconsider",
            name: "行政复议",
          },
          75: {
            title: "诉讼",
            color: "blue",
            interface: "lawsuit",
            name: "行政诉讼",
          },
          // 80: {
          //   title: "答复复议",
          //   color: "purple",
          //   interface: "restore",
          //   name: "答复复议"
          // }
        },
        download: this.download,
      };
      // for (let item in this.organization) {
      //   result.organizations.push({
      //     value: this.organization[item].id,
      //     label: this.organization[item].title,
      //   });
      // }
      for (let item in this.modalList) {
        result.modalList.push({
          value: this.modalList[item].id,
          label: this.modalList[item].title,
        });
      }
      return result;
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
  },
  authorize:{
    onEnter: "public.insert",
    add: "config.get",
    onEdit: "public.insert",
    toform: "public.get",
    repeal: "public.repeal",
  },
  created() {
    this.searchform = this.params.searchform
      ? this.params.searchform
      : this.searchform;
    this.init();
  },
  methods: {
    init() {
      Promise.all([
        form_get({ name: "citizen_y" }),
        form_get({ name: "company_y" }),
        form_get({ name: "citizenEditor_y" }),
        form_get({ name: "companyEditor_y" }),
        form_get({ name: "defer_y" }),
        form_get({ name: "repair_y" }),
        form_get({ name: "reply_y" }),
        form_get({ name: "restore_y" }),
        form_get({ name: "opinions_y" }),
        form_get({ name: "opinioned_y" }),
        form_get({ name: "teamwork_y" }),
        form_get({ name: "teamworked_y" }),
        form_get({ name: "repeal_y" }),
        form_get({ name: "lawsuit_y" }),
        form_get({ name: "reconsider_y" }),
        keywordslist(),
        organization_tree()
      ])
        .then((Response) => {
          this.jsonDatas.citizen = Response[0].data.data.form;
          this.jsonData = this.jsonDatas.citizen;
          this.jsonDatas.company = Response[1].data.data.form;
          this.jsonDatas.citizenedit = Response[2].data.data.form;
          this.citizenData = this.jsonDatas.citizenedit;
          this.jsonDatas.companyedit = Response[3].data.data.form;
          this.companyData = this.jsonDatas.companyedit;
          this.deferData = Response[4].data.data.form;
          this.repairData = Response[5].data.data.form;
          this.replyData = Response[6].data.data.form;
          this.restoreData = Response[7].data.data.form;
          this.opinionsData = Response[8].data.data.form;
          this.opinionedData = Response[9].data.data.form;
          this.teamworkData = Response[10].data.data.form;
          this.teamworkedData = Response[11].data.data.form;
          this.repealData = Response[12].data.data.form;
          this.lawsuitData = Response[13].data.data.form;
          this.reconsiderData = Response[14].data.data.form;
          this.keywordsList = Response[15].data.data;
          this.organization= Response[16].data.data
          this.loadDataSrouce();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 分页
    changepage(page, pageSize) {
      this.searchform.page = page;
      this.searchform.per_page = pageSize;
      this.loadDataSrouce();
    },
    // 获取模板列表
    uploadlist(data) {
      uploadlist({ status: [data] })
        .then((res) => {
          this.modalList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    loadDataSrouce() {
      this.loadings = true;
      public_paginate(this.searchform)
        .then((response) => {
          this.selectedRowKeys = [];
          this.dataSource = response.data.data;
          this.loadings = false;
          this.searchloading = false;
          this.resetloading = false;
        })
        .catch((error) => {
          console.log("erroe", error);
          this.loadings = false;
          this.searchloading = false;
          this.resetloading = false;
        });
    },
    onTypeChange() {
      this.jsonData = this.jsonDatas[this.typeform];
    },
    // 录入提交
    onSubmit() {
      this.$refs.kform
        .getData()
        .then((data) => {
          // 获取数据成功
          this.$refs.keyforms.validate((valid) => {
            if (valid) {
              this.subloading = true;
              data.type = this.typeform == "citizen" ? 1 : 2;
              data.keywords = this.keyforms.keywords;
              public_insert(data)
                .then(() => {
                  this.subloading = false;
                  this.$refs.kform.reset();
                  this.$refs.keyforms.resetFields();
                  this.formDialog = false;
                  this.$message.success("录入成功！");
                  this.loadDataSrouce();
                })
                .catch((error) => {
                  console.log(error);
                  this.subloading = false;
                });
            }
          });
        })
        .catch((err) => {
          console.log(err, "校验失败");
        });
    },
    // 查询
    onSearch() {
      this.searchform.page = 1;
      this.searchform.per_page = 10;
      this.searchloading = true;
      this.loadDataSrouce();
    },
    onEnter() {
      this.formDialog = true;
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    onTimerRangeChange(data, strdate) {
      if (strdate && strdate.length) {
        this.searchform.start = strdate[0];
        this.searchform.end = strdate[1];
      } else {
        this.searchform.start = undefined;
        this.searchform.end = undefined;
      }
    },
    onSelectClear() {
      this.selectedRowKeys = [];
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    resetForm() {
      this.searchform = {};
      this.resetloading = true;
      this.loadDataSrouce();
    },
    //编辑触发
    onEdit(record) {
      if (record.keyword) {
        if (record.type == 1) {
          this.citizenedit = true;
          this.companyedit = false;
          this.$nextTick(() => {
            this.citizenForm = record;
            this.$refs.kcitizenForm.setData({
              address: record.form.address,
              email: record.form.email,
              corporation: record.form.corporation,
              postcode: record.form.postcode,
              project: record.form.project,
              content: record.form.content,
              provide: record.form.provide,
              mode: record.form.mode,
              boardshow: record.form.boardshow,
              purpose: record.form.purpose,
              attachment: record.form.attachment,
            });
          });
        } else {
          this.companyedit = true;
          this.citizenedit = false;
          this.$nextTick(() => {
            this.companyForm = record;
            this.$refs.kcompanyForm.setData({
              address: record.form.address,
              email: record.form.email,
              corporation: record.form.corporation,
              postcode: record.form.postcode,
              project: record.form.project,
              content: record.form.content,
              provide: record.form.provide,
              mode: record.form.mode,
              boardshow: record.form.boardshow,
              purpose: record.form.purpose,
              attachment: record.form.attachment,
              linkman: record.form.linkman,
              corporationNo: record.form.corporationNo,
            });
          });
        }
      } else {
        this.$message.warning("请先添加标签再进行操作！");
        this.keywords = true;
        this.keywordsid = record.id;
      }
    },
    //企业编辑提交
    onEditSubmit(companyForm) {
      this.$refs.kcompanyForm.getData().then((data) => {
        this.subloading = true;
        data.id = companyForm.id;
        data.organization = companyForm.organization._id;
        edit(data)
          .then(() => {
            this.$message.success("编辑成功！");
            this.subloading = false;
            this.companyedit = false;
            this.$refs.kcompanyForm.reset();
            this.loadDataSrouce();
          })
          .catch((error) => {
            console.log(error);
            this.$refs.kcompanyForm.reset();
            this.subloading = false;
          });
      });
    },
    //公民编辑提交
    citizenEditSubmit(citizenForm) {
      this.$refs.kcitizenForm.getData().then((data) => {
        this.subloading = true;
        data.id = citizenForm.id;
        data.organization = citizenForm.organization._id;
        edit(data)
          .then(() => {
            this.subloading = false;
            this.$message.success("编辑成功！");
            this.citizenedit = false;
            this.$refs.kcitizenForm.reset();
            this.loadDataSrouce();
          })
          .catch((error) => {
            console.log(error);
            this.subloading = false;
          });
      });
    },
    //撤销
    repeal(record) {
      if (record.keyword) {
        this.repeals = true;
        this.repealsId = record.id;
        this.uploadlist(110);
      } else {
        this.$message.warning("请先添加标签再进行操作！");
        this.keywords = true;
        this.keywordsid = record.id;
      }
    },
    //撤销提交
    repealsSubmit() {
      this.$refs.repealsforms
        .getData()
        .then((res) => {
          this.subloading = true;
          var data = res;
          data.id = this.repealsId;
          repeal(data).then(() => {
            this.subloading = false;
            this.repeals = false;
            this.$message.success("操作成功!");
            this.loadDataSrouce();
          });
        })
        .catch((err) => {
          console.log(err);
          this.subloading = false;
        });
    },
    //查看
    toform(record) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "apply-details",
          params: {
            data: record,
            searchform: Object.assign(this.searchform),
          },
        },
      });
    },
    //状态弹窗
    tagButton(record, item, index) {
      if (record.keyword) {
        this.status = true;
        this.id = record.id;
        this.editmethod = item.interface;
        this.titleStr = item.name;
        if (this.editmethod == "repair") {
          //补证
          this.listData = this.repairData;
          this.uploadlist(index);
        } else if (this.editmethod == "defer") {
          //延期
          this.listData = this.deferData;
          this.titleStr =
            this.dynamicData.status[record.status].title + item.name;
          this.uploadlist(index);
        } else if (this.editmethod == "reply") {
          //答复
          this.replyInfo = record.id;
          this.listData = this.replyData;
          this.uploadlist(index);
        } else if (this.editmethod == "restore") {
          //补充答复
          this.listData = this.restoreData;
          this.uploadlist(index);
        } else if (this.editmethod == "reconsider") {
          //行政复议
          this.listData = this.reconsiderData;
          this.uploadlist(index);
        } else if (this.editmethod == "addition") {
          // 补证资料
          if (record.type == 1) {
            this.listData = this.citizenData;
            this.$nextTick(() => {
              setTimeout(() => {
                this.$refs.forms.setData({
                  address: record.form.address,
                  email: record.form.email,
                  corporation: record.form.corporation,
                  postcode: record.form.postcode,
                  project: record.form.project,
                  content: record.form.content,
                  provide: record.form.provide,
                  mode: record.form.mode,
                  boardshow: record.form.boardshow,
                  purpose: record.form.purpose,
                  attachment: record.form.attachment,
                });
              }, 50);
            });
          } else {
            this.listData = this.companyData;
            this.$nextTick(() => {
              setTimeout(() => {
                this.$refs.forms.setData({
                  address: record.form.address,
                  email: record.form.email,
                  corporation: record.form.corporation,
                  postcode: record.form.postcode,
                  project: record.form.project,
                  content: record.form.content,
                  provide: record.form.provide,
                  mode: record.form.mode,
                  boardshow: record.form.boardshow,
                  purpose: record.form.purpose,
                  attachment: record.form.attachment,
                  linkman: record.form.linkman,
                  corporationNo: record.form.corporationNo,
                });
              }, 50);
            });
          }
        } else if (this.editmethod == "opinion") {
          this.listData = this.opinionsData;
          this.uploadlist(index);
        } else if (this.editmethod == "opinioned") {
          this.listData = this.opinionedData;
        } else if (this.editmethod == "teamwork") {
          this.listData = this.teamworkData;
          this.uploadlist(index);
        } else if (this.editmethod == "teamworked") {
          this.listData = this.teamworkedData;
        } else if (this.editmethod == "lawsuit") {
          this.listData = this.lawsuitData;
          this.uploadlist(index);
        }
      } else {
        this.$message.warning("请先添加标签再进行操作！");
        this.keywords = true;
        this.keywordsid = record.id;
      }
    },
    // 标签表单提交
    keyformsSubmit() {
      this.$refs.keyforms.validate((valid) => {
        if (valid) {
          this.subloading = true;
          var parems = {
            data: {
              id: this.keywordsid,
              keywords: this.keyforms.keywords,
            },
          };
          keywords(parems)
            .then(() => {
              this.keywords = false;
              this.$refs.keyforms.resetFields();
              this.subloading = false;
              this.$message.success("提交成功！");
              this.loadDataSrouce();
            })
            .catch((err) => {
              console.log(err);
              this.subloading = false;
            });
        }
      });
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.indexOf(input) >= 0;
    },
    //状态修改
    statusSubmit() {
      var that = this;
      this.$refs.forms
        .getData()
        .then((data) => {
          // 获取数据成功
          this.subloading = true;
          data.id = this.id;
          const params = data;
          var method = that.editmethod;
          if (method == "defer") {
            defer(params)
              .then(() => {
                this.subloading = false;
                this.$refs.forms.reset();
                this.status = false;
                this.$message.success("提交成功！");
                this.loadDataSrouce();
              })
              .catch((error) => {
                console.log(error);
                this.subloading = false;
                // this.status = false;
              });
          } else if (method == "repair") {
            repair(params)
              .then(() => {
                this.subloading = false;
                this.$refs.forms.reset();
                this.status = false;
                this.$message.success("提交成功！");
                this.loadDataSrouce();
              })
              .catch((error) => {
                console.log(error);
                this.subloading = false;
                // this.$refs.forms.reset();
                // this.status = false;
              });
          } else if (method == "reply") {
            reply(params)
              .then(() => {
                this.subloading = false;
                this.$refs.forms.reset();
                this.status = false;
                this.$message.success("提交成功！");
                this.loadDataSrouce();
              })
              .catch((error) => {
                console.log(error);
                this.subloading = false;
                // this.status = false;
              });
          } else if (method == "restore") {
            restore(params)
              .then(() => {
                this.subloading = false;
                this.$refs.forms.reset();
                this.status = false;
                this.$message.success("提交成功！");
                this.loadDataSrouce();
              })
              .catch((error) => {
                console.log(error);
                this.subloading = false;
                // this.status = false;
              });
          } else if (method == "addition") {
            addition(params)
              .then(() => {
                this.subloading = false;
                this.$refs.forms.reset();
                this.status = false;
                this.$message.success("提交成功！");
                this.loadDataSrouce();
              })
              .catch((error) => {
                console.log(error);
                this.subloading = false;
                // this.status = false;
              });
          } else if (method == "opinion") {
            opinion(params)
              .then(() => {
                this.subloading = false;
                this.$refs.forms.reset();
                this.status = false;
                this.$message.success("提交成功！");
                this.loadDataSrouce();
              })
              .catch((error) => {
                console.log(error);
                this.subloading = false;
                // this.status = false;
              });
          } else if (method == "opinioned") {
            opinioned(params)
              .then(() => {
                this.subloading = false;
                this.$refs.forms.reset();
                this.status = false;
                this.$message.success("提交成功！");
                this.loadDataSrouce();
              })
              .catch((error) => {
                console.log(error);
                this.subloading = false;
                // this.status = false;
              });
          } else if (method == "teamwork") {
            teamwork(params)
              .then(() => {
                this.subloading = false;
                this.$refs.forms.reset();
                this.status = false;
                this.$message.success("提交成功！");
                this.loadDataSrouce();
              })
              .catch((error) => {
                console.log(error);
                this.subloading = false;
                // this.status = false;
              });
          } else if (method == "teamworked") {
            teamworked(params)
              .then(() => {
                this.subloading = false;
                this.$refs.forms.reset();
                this.status = false;
                this.$message.success("提交成功！");
                this.loadDataSrouce();
              })
              .catch((error) => {
                console.log(error);
                this.subloading = false;
                // this.status = false;
              });
          } else if (method == "reconsider") {
            reconsider(params)
              .then(() => {
                this.subloading = false;
                this.$refs.forms.reset();
                this.status = false;
                this.$message.success("提交成功！");
                this.loadDataSrouce();
              })
              .catch((error) => {
                console.log(error);
                this.subloading = false;
                // this.status = false;
              });
          } else if (method == "lawsuit") {
            lawsuit(params)
              .then(() => {
                this.subloading = false;
                this.$refs.forms.reset();
                this.status = false;
                this.$message.success("提交成功！");
                this.loadDataSrouce();
              })
              .catch((error) => {
                console.log(error);
                this.subloading = false;
                this.$refs.forms.reset();
                this.$message.success("提交失败！");
              });
          }
        })
        .catch((err) => {
          console.log(err, "校验失败");
        });
    },
    purposeFun(data) {
      var purpose = this.dynamicData.purpose;
      var lisr = purpose.filter((item) => {
        return item.value == data;
      });
      return lisr[0].label;
    },
    modeFun(data) {
      var mode = this.dynamicData.mode;
      var list = mode.filter((item) => {
        return data.indexOf(item.value) > -1;
      });
      var lists = "";
      for (var i = 0; i < list.length; i++) {
        lists = lists + list[i].label + (list.length == i + 1 ? "" : "、");
      }
      return lists == "" ? "无" : lists;
    },
    provideFun(data) {
      var provide = this.dynamicData.provide;
      var list = provide.filter((item) => {
        return data.indexOf(item.value) > -1;
      });
      var lists = "";
      for (var i = 0; i < list.length; i++) {
        lists = lists + list[i].label + (list.length == i + 1 ? "" : "、");
      }
      return lists == "" ? "无" : lists;
    },
    // 数据变化时触发
    chanales(value, key) {
      var that = this;
      if (key == "remedy") {
        var daras = new Date();
        var days = new Date(value);
        if (daras < days) {
          that.$message.err("请选择当前日期之前!");
        }
      }
    },
    //答复-选择模板
    modalChange(key, value) {
      if (value == "modal") {
        this.modalId = key;
      }
    },
    //答复-模板下载
    download() {
      var params = {
          id: this.id,
          module: this.modalId,
      };
      if (this.modalId) {
        var name = this.modalList.filter((item) => {
          return this.modalId == item.id;
        });
        replace(params)
          .then((res) => {
            const a = document.createElement("a");
            var bstr = atob(res.data.data),
              n = bstr.length,
              u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            const blob = new Blob([u8arr], {
              type:
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });
            a.download = name[0].title;
            a.href = window.URL.createObjectURL(blob);
            a.click();
            this.$message.success("操作成功！");
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("下载文档失败");
          });
      } else {
        this.$message.warning("请选择模板！");
      }
    },
    add() {
      this.drawerVisible = true;
    },
    onReset() {
      this.searchform = {};
      this.loadDataSrouce();
    },
  },
};
</script>

<style >
.ant-table table {
  border-collapse: collapse;
  border-spacing: 0;
}
.ant-table-thead > tr > th,
.ant-table-tbody > tr > td {
  border-left: 1px solid #f0f0f0;
  border-top: 1px solid #f0f0f0;
}
</style>
<style lang="less" scoped>
// .loading {
//   position: fixed;
//   left: 0;
//   top: 0;

//   width: 100vw;
//   height: 100%;
//   z-index: 990;
//   padding: 45vh 0;
//   background: #ffffff;
// }
// .span_loading {
//   align-items: center;
//   display: block;
// }
.search {
  margin-bottom: 54px;
}
.fold {
  width: calc(100% - 256px);
  display: inline-block;
}
.operator {
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
.alert {
  margin-bottom: 16px;
  .message {
    a {
      font-weight: 600;
    }
  }
  .clear {
    float: right;
  }
}
.action_button:hover {
  color: #1890ff;
}
.table_content {
  margin: 20px 0;
}
.tags {
  margin-bottom: 5px;
}

.table_content a{
  color: #1890ff;
}
</style>