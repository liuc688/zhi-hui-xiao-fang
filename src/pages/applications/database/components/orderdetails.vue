<template>
  <div style="background: #fff; padding: 10px 50px 10px" ref="body">
    <!-- 返回 -->
    <div class="title_back">
      <a @click="back"><a-icon type="rollback" />&nbsp;&nbsp;返回</a>
    </div>
    <!-- 搜索条件 -->
    <a-row>
      <a-input-group
        size="default"
        style="padding: 3px 0px"
        compact
        v-for="(item, index) in domains"
        :key="index"
      >
        <a-select
          v-model="item.judge"
          placeholder="请选择"
          :disabled="index == 0"
          :showArrow="false"
          style="width: 70px"
        >
          <a-select-option value="and">并且</a-select-option>
          <a-select-option value="ors">或者</a-select-option>
        </a-select>
        <a-select
          v-model="item.field"
          style="width: 200px"
          placeholder="请选择查询字段"
        >
          <a-select-option v-for="items in titlelist" :key="items.field">{{
            items.title
          }}</a-select-option>
        </a-select>
        <a-select
          v-model="item.type"
          style="width: 150px"
          placeholder="值类型"
          @change="changetype(index)"
        >
          <a-select-option v-for="temp in types" :key="temp.name">{{
            temp.title
          }}</a-select-option>
        </a-select>
        <a-select v-model="item.query" style="width: 90px" placeholder="条件">
          <a-select-option v-for="itemes in item.querys" :key="itemes">{{
            itemes
          }}</a-select-option>
        </a-select>
        <a-date-picker
          v-if="item.type == 3"
          :show-time="{ format: 'HH:mm:ss' }"
          format="YYYY-MM-DD HH:mm:ss"
          style="width: 200px"
          v-model="item.value"
          placeholder="请选择日期时间"
          @change="changedata(item.value, index)"
        />
        <a-select
          v-else-if="item.type == 4"
          style="width: 200px"
          v-model="item.value"
          placeholder="请选择布尔值"
        >
          <a-select-option :key="1">是</a-select-option>
          <a-select-option :key="0">否</a-select-option>
        </a-select>
        <a-input
          v-else
          style="width: 200px"
          v-model="item.value"
          allowClear
          placeholder="请输入查询值"
        ></a-input>
        <!-- 按钮 -->
        <a-button @click="addfactor" v-if="index == 0">
          <a-icon type="plus" />
        </a-button>
        <a-button v-if="index > 0" @click="reducefactor(index)">
          <a-icon type="minus" />
        </a-button>
        <a-button
          @click="onSearch"
          type="primary"
          v-if="index == domains.length - 1"
          ><a-icon type="search"></a-icon>查询</a-button
        >
        <a-divider type="vertical" />
        <a-button
          @click="onReset"
          type="primary"
          v-if="index == domains.length - 1"
          ><a-icon type="undo"></a-icon>重置</a-button
        >
      </a-input-group>
      <a-space style="margin-top: 10px">
        <a-button type="primary" @click="settings">
          <a-icon type="setting" />
          设置表单
        </a-button>
        <a-button type="primary" @click="add_value"
          ><a-icon type="plus" /> 数据创建</a-button
        >
        <!-- <a-button type="primary" @click="uploads"
          ><a-icon type="upload" />数据模板导入</a-button
        > -->
        <a-button type="primary" @click="reportforms">
          <a-icon type="container" />
          报表管理</a-button
        >
        <a-button type="primary" @click="valueexport">
          <a-icon type="download" />
          结果导出</a-button
        >
        <a-button type="primary" @click="exportlist">
          <a-icon type="table" />
          导出列表</a-button
        >
        <a-button class="button_chheckbox">
          <a-checkbox v-model="status" @change="onRecycles">回收站</a-checkbox>
        </a-button>
      </a-space>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="17">
        <a-table
          ref="table"
          bordered
          class="table_content"
          size="middle"
          rowKey="id"
          :loading="loading"
          :pagination="false"
          :columns="columns"
          :dataSource="dataSource.items"
          :scroll="{ x: 1500 }"
          @change="changes"
        >
          <span slot="action" slot-scope="text, record">
            <a-popconfirm
              placement="topLeft"
              v-if="status"
              :title="'是否确认还原这条数据吗?'"
              ok-text="确认"
              cancel-text="取消"
              @confirm="restore_value(record)"
            >
              <a style="color: #1890ff">还原</a>
            </a-popconfirm>

            <a style="color: #1890ff" @click="edit_value(record)" v-else
              >编辑</a
            >
            <a-divider type="vertical" />
            <a-popconfirm
              placement="topLeft"
              :title="'是否确认删除这条数据吗?'"
              ok-text="确认"
              cancel-text="取消"
              @confirm="delete_value(record)"
            >
              <a style="color: #1890ff">删除</a>
            </a-popconfirm>
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
      </a-col>

      <a-col :span="7">
        <div class="rights">
          <a-card style="width: 100%; height: 330px">
            <template slot="title" style="padding: 0 !important">数据录入统计</template>
            <a-spin tip="Loading..." :spinning="spinning">
              <div id="echarts"></div>
            </a-spin>
          </a-card>
          <a-divider orientation="left"> 字段管理 </a-divider>
          <!-- <a-alert
            message="字段排序需要在包含删除字段的情况下！"
            type="warning"
            show-icon
          /> -->
          <a-space>
            <a-button
              type="primary"
              v-auth="`field.create`"
              @click="editwords()"
              >添加字段</a-button
            >

            <a-button style="padding: 5px; 10px">
              <a-checkbox
                @change="onRecycle"
                v-model="deletes"
                class="checkbox_txt"
                >删除字段</a-checkbox
              >
            </a-button>
          </a-space>
          <draggable
            element="ul"
            v-model="columnsdataes"
            :disabled="true"
            :animation="600"
          >
            <li class="over" v-for="item in columnsdataes" :key="item.name">
              <a-tooltip v-if="!item._delete" placement="left">
                <template slot="title"> 字段编辑 </template>
                <a
                  :disabled="changevent || item.delete"
                  v-if="$auth('field.edit')"
                  @click="editwords(item)"
                >
                  <a-icon type="edit" class="li_icon"></a-icon>
                </a>
              </a-tooltip>
              <span class="li_span"
                >{{ item.title }}
                <span style="margin-left: 10px">({{ item.name }})</span>
                <a-tag
                  style="margin-left: 10px"
                  v-if="item._delete"
                  color="orange"
                  >已删</a-tag
                ></span
              >
              <a-tooltip v-if="$auth('field.delete')">
                <template slot="title"> 字段删除 </template>
                <a-popconfirm
                  placement="topLeft"
                  title="是否确认删除此字段吗?"
                  ok-text="确认"
                  cancel-text="取消"
                  @confirm="deletewords(item)"
                  v-auth="`field.delete`"
                >
                  <a :disabled="changevent" style="float: right">
                    <a-icon class="icon_dele" type="delete" />
                  </a>
                </a-popconfirm>
              </a-tooltip>
              <a-tooltip v-if="$auth('field.restore')">
                <template slot="title"> 字段还原 </template>
                <a-popconfirm
                  placement="topLeft"
                  title="是否确认还原此字段吗?"
                  ok-text="确认"
                  cancel-text="取消"
                  @confirm="resetwords(item)"
                >
                  <a v-if="item._delete" style="float: right">
                    <a-icon class="icon_dele" type="sync" />
                  </a>
                </a-popconfirm>
              </a-tooltip>
            </li>
          </draggable>
        </div>
      </a-col>
    </a-row>
    <!-- 字段增编 -->
    <a-modal
      :title="field_title"
      :visible="visibles"
      :width="900"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <k-form-build
        :value="listData"
        :dynamicData="dynamicData"
        @change="changesData"
        ref="forms"
      />
    </a-modal>
    <!-- 数据增编 -->
    <a-modal
      :title="titles"
      :visible="value_visibles"
      :width="900"
      :maskClosable="false"
      :confirm-loading="value_confirmLoading"
      @ok="valuehandleOk"
      @cancel="valuehandleCancel"
    >
      <k-form-build :value="valueData" ref="valueforms" />
    </a-modal>
    <!-- 数据导入 -->
    <a-modal
      title="数据模板导入"
      :visible="template_visibles"
      :width="900"
      :maskClosable="false"
      :confirm-loading="template_confirmLoading"
      @ok="templatehandleOk"
      @cancel="templateCancel"
    >
      <k-form-build
        :value="templateData"
        ref="templateforms"
        @change="templatechanges"
        :config="config"
      />
    </a-modal>
    <a-modal
      title="日志"
      :visible="journal_visibles"
      :width="900"
      :closable="false"
    >
      <template slot="footer">
        <a-button
          @click="
            () => {
              journal_visibles = false;
            }
          "
          >关闭</a-button
        >
      </template>
      <!-- 日志 -->
      <a-timeline class="time_line">
        <a-timeline-item
          v-for="(item, index) in logsDate"
          :key="item.id"
          style="padding: 5px 0 20px"
        >
          <p>{{ logsDate[logsDate.length - index - 1]._createtime }}</p>
          <p>
            <a-tag color="blue">{{
              logsDate[logsDate.length - index - 1]._source
            }}</a-tag>
            <span style="margin-right: 5px"> 操作人: 陈震南</span>
          </p>
        </a-timeline-item>
      </a-timeline>
    </a-modal>
    <a-modal
      title="表单设置"
      :visible="form_visibles"
      :width="1500"
      :maskClosable="false"
      @cancel="canceles"
      :footer="null"
    >
      <div style="height: 600px; overflow: auto">
        <k-form-design
          title="表单编辑"
          :toolbarsTop="false"
          :showToolbarsText="true"
          :value="jsonData"
          ref="formdesign"
          :fields="fields"
          :toolbars="[
            'preview',
            'save',
            'importJson',
            'exportJson',
            'exportCode',
            'reset',
          ]"
          :showHead="false"
          @save="onSubmit"
        >
          <!-- v-if="JSON.stringify(jsonData) == '{}'" -->
          <template slot="right-action">
            <a-tooltip title="生成表单">
              <a @click="generate">
                <a-icon type="diff" />
                <span>生成表单</span>
              </a>
            </a-tooltip>
          </template>
        </k-form-design>
      </div>
    </a-modal>
    <!-- 报表管理 -->
    <!-- <a-drawer
      title="Create a new account"
      :width="720"
      :visible="reportvisible"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
    >
     </a-drawer> -->

    <a-drawer
      placement="right"
      :closable="true"
      :width="720"
      :getContainer="false"
      :visible="reportvisible"
      :body-style="{ paddingBottom: '80px' }"
      @close="
        () => {
          reportvisible = false;
        }
      "
    >
      <setting :columns="columnsdata" :id="id" :titlelist="titlelist" />
    </a-drawer>
    <a-modal
      title="导出文件列表"
      :visible="report_visibles"
      :width="800"
      :maskClosable="false"
      @cancel="reportcanceles"
    >
      <span slot="footer">
        <a-button @click="reportcanceles">关闭</a-button>
      </span>
      <a-alert type="warning" show-icon>
        <span slot="message" style="font-size: 16px; letter-spacing: 1px"
          >导出文件生成后7天内有效，7天后自动删除</span
        >
      </a-alert>
      <a-table
        ref="table"
        bordered
        class="table_content"
        size="middle"
        rowKey="id"
        :loading="report_loading"
        :pagination="false"
        :columns="reportcolumns"
        :dataSource="sportslist.items"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="downloads(record)" style="color: #1890ff">下载</a>
        </span>
        <span slot="_createtime" slot-scope="text">
          {{ timestyles(text) }}
        </span>
        <span slot="lasttime" slot-scope="text">
          {{ timestyles(text) }}
        </span>
        <span slot="overdue" slot-scope="text, record">
          {{ timeoverdue(record) }}
        </span>
      </a-table>
      <a-pagination
        size="small"
        style="text-align: right"
        @change="changepages"
        :current="paginate.page"
        :pageSize="paginate.per_page"
        @showSizeChange="changepages"
        :pageSizeOptions="pageSizeOptiones"
        :total="sportslist.total"
        show-size-changer
        show-quick-jumper
        :show-total="(total) => `共 ${total} 条`"
      ></a-pagination>
    </a-modal>
  </div>
</template>
<script>
import {
  field_delete,
  field_restore,
  value_restore, //数据还原
  value_delete,
  value_create,
  value_edit,
  value_template,
  select_record,
  field_list, //字段列表
  field_create, //字段创建
  field_edit, //字段编辑
  field_verify, //字段验证
  table_forms, //表单生成
  table_formsget, //表单获取
  forms_edit, //表单编辑
  select_filter, //列表分页查询
  select_get, // 数据详情查询
  value_export, // 查询结果导出
  download_paginate, //下载分页
  download_get, //下载
  filter_select, //查询统计
  create_select, //数据录入统计
} from "@/services/database";
import { form_get } from "@/services/forms";
import moment from "moment";
import draggable from "vuedraggable";
import Cookie from "js-cookie";
import { Line } from "@antv/g2plot";
import setting from "./setting";
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
    draggable,
    setting,
  },
  watch: {
    deletes: {
      handler(value) {
        if (value) {
          this.draggables = false;
        } else {
          this.draggables = true;
        }
      },
      deep: true,
    },
    selectedRowKeys: {
      handler(value) {
        if (value.length == 1) {
          this.titles = "数据编辑";
        } else {
          this.titles = "数据创建";
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      id: "",
      datas: {},
      searchforms: {
        status: 1,
        table: "",
        ands: [],
        ors: [],
        order: [],
      },
      status: false,
      dataSource: {},
      loading: false,
      columns: [],
      columnsdata: [],
      columnsdataes: [],
      pageSizeOptions: ["10", "20", "30", "40"],
      pageSizeOptiones: ["10", "20", "30", "40"],
      dynamicValidateForm: {},
      domains: [
        {
          field: undefined,
          query: undefined,
          value: undefined,
          type: undefined,
          judge: "and",
          querys: [
            "等于",
            "小于",
            "小于等于",
            "大于",
            "大于等于",
            "包含",
            "是空",
            "非空",
            "存在",
            "不存在",
          ],
        },
      ],
      titlelist: [],
      types: [
        {
          name: 0,
          title: "整数类型",
        },
        {
          name: 1,
          title: "浮点类型",
        },
        {
          name: 2,
          title: "文本类型",
        },
        {
          name: 3,
          title: "日期时间类型",
        },
        {
          name: 4,
          title: "对象类型",
        },
        {
          name: 5,
          title: "布尔类型",
        },
      ],
      channelRowKeys: [],
      changevent: false,
      visibles: false,
      value_visibles: false,
      confirmLoading: false,
      value_confirmLoading: false,
      listData: {},
      editData: {},
      valueData: {},
      field_title: "添加字段",
      value_title: "数据创建",
      indexid: undefined,
      deletes: false,
      draggables: true,
      selectedRowKeys: [],
      titles: "数据创建",
      template_visibles: false,
      template_confirmLoading: false,
      templateData: {},
      // 事件状态值
      statuslist: [
        { id: 0, title: "开始", background: "##f5222f", color: "#ffffff" },
        { id: 1, title: "关闭", background: "##f5222f", color: "#ffffff" },
        { id: 2, title: "激活", background: "##f5222f", color: "#ffffff" },
      ],
      journal_visibles: false,
      logsDate: [],
      columnsdaes: [],
      cards: 0,
      stackedColumnPlot: {},
      form_visibles: false,
      jsonData: {},
      fields: [
        "input",
        "textarea",
        "number",
        "select",
        // "checkbox",
        "radio",
        "date",
        "time",
        "rate",
        "slider",
        // "uploadFile",
        // "uploadImg",
        // "cascader",
        // "treeSelect",
        // "batch",
        // "selectInputList",
        "editor",
        // "switch",
        // "button",
        // "alert",
        // "text",
        // "html",
        "divider",
        "card",
        "tabs",
        "grid",
        "table",
      ],
      color: "#1890ff", //主题色
      datas_id: undefined,
      reportvisible: false,
      report_visibles: false,
      sportslist: {},
      reportcolumns: [
        {
          title: "标题",
          dataIndex: "category",
          scopedSlots: { customRender: "category" },
        },
        {
          title: "导出时间",
          dataIndex: "_createtime",
          scopedSlots: { customRender: "_createtime" },
        },
        {
          title: "生成时间",
          dataIndex: "lasttime",
          scopedSlots: { customRender: "lasttime" },
        },
        {
          title: "过期时间",
          dataIndex: "overdue",
          scopedSlots: { customRender: "overdue" },
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
          width: "110px",
          align: "center",
          fixed: "right",
        },
      ],
      report_loading: false,
      dataslist: [],
      dataslists: [],
      spinning:false
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
        this.dataSource.page = val.page || 1;
        this.dataSource.per_page = val.per_page || 10;
        this.dataSource.total = val.total || 0;
      },
    },
    paginate: {
      get() {
        return {
          page: this.sportslist.page || 1,
          per_page: this.sportslist.per_page || 10,
          total: this.sportslist.total || 0,
        };
      },
      set(val) {
        this.sportslist.page = val.page || 1;
        this.sportslist.per_page = val.per_page || 10;
        this.sportslist.total = val.total || 0;
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
        typelist: [
          { label: "整数类型", value: 0 },
          { label: "浮点类型", value: 1 },
          { label: "文本类型", value: 2 },
          { label: "日期时间类型", value: 3 },
          { label: "对象类型", value: 4 },
          { label: "布尔类型", value: 5 },
        ],
      };
      return result;
    },
  },
  authorize: {
    // confirm: "table.delete",
    // uploads: "value.template", //导入
    delete_value: "value.delete", //删除
    // edit_value: "value.edit", //编辑
    journal: "select.record", //日志
  },
  created() {
    document.body.style.setProperty("--theme", this.color);
  },
  mounted() {
    this.datas = this.params.data || {};
    this.id = this.datas.id || "";
    this.init();
  },
  methods: {
    canceles() {
      this.form_visibles = false;
    },
    onSubmit(value) {
      forms_edit({
        table: this.id,
        forms: value,
      })
        .then((response) => {
          console.log("response", response);
          this.$message.success(response.data.message);

          this.valueData = response.data.data.forms;
          this.form_visibles = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    moment,
    init() {
      Promise.all([
        field_list({ table: this.id, delete: false }), //字段列表
        form_get({ name: "fields_edit" }),
        table_formsget({ table: this.id }),
        // filter_select({ table: this.id }),
        create_select({ table: this.id }),
      ])
        .then((res) => {
          console.log("res", res);
          this.columnsdata = res[0].data.data;
          this.editData = res[1].data.data.form;
          if (res[2].data.data) {
            this.valueData = res[2].data.data.forms;
          }
          // this.dataslist = res[3].data.data;
          this.dataslists = res[3].data.data;
          this.cards++
          this.containers(this.dataslists);
          this.columns = [];
          this.titlelist = [];
          for (let index = 0; index < this.columnsdata.length; index++) {
            this.columns.push({
              title: this.columnsdata[index].title,
              dataIndex: "values." + [`${this.columnsdata[index].id}`],
              ellipsis: true,
              filters: [
                { text: "升序", value: 1 },
                { text: "降序", value: 0 },
              ],
              filterMultiple: false,
            });
            this.titlelist.push({
              title: this.columnsdata[index].title,
              name: this.columnsdata[index].name,
              field: this.columnsdata[index].id,
              types: this.columnsdata[index].types,
            });
          }
          this.columns.push({
            title: "操作",
            dataIndex: "action",
            scopedSlots: { customRender: "action" },
            width: "110px",
            align: "center",
            fixed: "right",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
      this.getfield();
      this.list();
    },
    containers(data2) {
      if (this.cards == 1) {
        this.stackedColumnPlot = new Line("echarts", {
          data: data2.reverse(),
          isGroup: true,
          xField: "name",
          yField: "count",
          // seriesField: "name",
          // padding:[30, 10, 30, 10],
          // xAxis:{
          //   label:{
          //     autoRotate:true
          //   }
          // },
          yAxis: {
            label: {
              // 数值格式化为千分位
              formatter: (v) =>
                `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
            },
          },
          legend: {
            layout: "horizontal",
            position: "top",
          },
          animation: {
            appear: {
              animation: "path-in",
              duration: 500,
            },
          },
        });
        this.stackedColumnPlot.render();
      } else {
        this.stackedColumnPlot.update({
          data: data2.reverse(),
        });
      }
      this.spinning = false;
    },
    getfield() {
      field_list({ table: this.id, delete: this.deletes })
        .then((res) => {
          this.columnsdataes = res.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 获取数据
    list() {
      this.loading = true;
      select_filter(Object.assign(this.searchforms, { table: this.id }))
        .then((res) => {
          this.dataSource = res.data.data;
          console.log("this.dataSource", res.data.data);
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err.response.data.message);
          console.log(err);
        });
    },
    // 分页
    changepage(page, pageSize) {
      this.searchforms.page = page;
      this.searchforms.per_page = pageSize;
      this.pagination.page = page;
      this.pagination.per_page = pageSize;
      this.list();
    },
    // 查询
    onSearch() {
      this.searchforms.ands = [];
      this.searchforms.ors = [];
      this.searchforms.page = 1;
      this.searchforms.per_page = 10;
      this.domains.filter((item) => {
        if (item.judge == "and" && item.field && item.query) {
          this.searchforms.ands.push(item);
        } else if (item.judge == "ors" && item.field && item.query) {
          this.searchforms.ors.push(item);
        }
      });
      this.list();
    },
    onReset() {
      this.searchforms.ands = [];
      this.searchforms.ors = [];
      this.searchforms.page = 1;
      this.searchforms.per_page = 10;
      (this.domains = [
        {
          field: undefined,
          query: undefined,
          value: undefined,
          type: undefined,
          judge: "and",
          querys: [
            "等于",
            "小于",
            "小于等于",
            "大于",
            "大于等于",
            "包含",
            "是空",
            "非空",
            "存在",
            "不存在",
          ],
        },
      ]),
        this.list();
    },
    // 时间change
    changedata(value, index) {
      if (value) {
        this.domains[index].value = moment(value).format("YYYY-MM-DD HH:mm:ss");
      } else {
        this.domains[index].value = undefined;
      }
    },
    // 添加条件
    addfactor() {
      this.domains.push({
        name: undefined,
        query: undefined,
        value: undefined,
        type: undefined,
        judge: "and",
        querys: [
          "等于",
          "小于",
          "小于等于",
          "大于",
          "大于等于",
          "包含",
          "是空",
          "非空",
          "存在",
          "不存在",
        ],
      });
    },
    // 减少条件
    reducefactor(index) {
      this.domains.splice(index, 1);
    },
    /** 字段管理 */
    // 是否包含删除字段
    onRecycle() {
      this.getfield();
    },
    // 数据回收站
    onRecycles(value) {
      if (this.status) {
        this.searchforms.status = 0;
      } else {
        this.searchforms.status = 1;
      }
      this.onSearch();
    },
    changesData(key, value) {
      if (value == "title") {
        // 验证
      } else if (value == "types") {
        if (key == 3) {
          //日期
          this.$refs.forms.hide(["number"]);
          this.$refs.forms.show(["category"]);
        } else if (key == 1) {
          //浮点
          this.$refs.forms.hide(["category"]);
          this.$refs.forms.show(["number"]);
        } else {
          this.$refs.forms.hide(["number", "category"]);
        }
      } else if (value == "name") {
        if (key) {
          var dates = {
            table: this.id,
            name: key,
          };
          field_verify(dates).then((res) => {
            console.log("res", res);
            if (res.data.data) {
              // this.$message.success(res.data.message);
            } else {
              this.$message.error("此字段名已存在!");
            }
          });
        }
      }
    },
    // 编辑字段
    editwords(item) {
      this.visibles = true;
      if (item) {
        console.log("item", item);
        this.field_title = "编辑字段";
        this.listData = this.editData;
        this.indexid = item.id;
        this.$nextTick(() => {
          this.$refs.forms.setData({
            name: item.name || undefined,
            title: item.title || undefined,
            hidden: item.hidden || false,
            major: item.major || false,
            types: item.types || undefined,
            category: item.category || undefined,
            default: item.default || undefined,
            number: item.number || undefined,
          });
          if (item.types == 3) {
            //日期
            this.$refs.forms.hide(["number"]);
            this.$refs.forms.show(["category"]);
          } else if (item.types == 1) {
            //浮点
            this.$refs.forms.hide(["category"]);
            this.$refs.forms.show(["number"]);
          } else {
            this.$refs.forms.hide(["number", "category"]);
          }
        });
      } else {
        this.field_title = "添加字段";
        this.listData = this.editData;
        this.$nextTick(() => {
          this.$refs.forms.reset();
          this.$refs.forms.hide(["number", "category"]);
        });
        this.indexid = undefined;
      }
    },
    // 删除字段
    deletewords(item) {
      var data = {
        // table: this.id,
        field: item.id,
      };
      field_delete(data)
        .then(() => {
          this.init();
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
    },
    // 还原字段
    resetwords(item) {
      var data = {
        field: item.id,
      };
      field_restore(data)
        .then(() => {
          this.init();
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
    },
    // 字段保存
    handleOk() {
      this.$refs.forms
        .getData()
        .then((res) => {
          this.confirmLoading = true;
          if (this.field_title == "编辑字段") {
            const data = Object.assign(res, {
              table: this.id,
              id: this.indexid,
            });
            field_edit(data)
              .then(() => {
                this.visibles = false;
                this.confirmLoading = false;
                this.init();
              })
              .catch((err) => {
                console.log(err);
                this.confirmLoading = false;
                this.$message.error(err.response.data.message);
              });
          } else {
            const datas = Object.assign(res, {
              table: this.id,
            });
            field_create(datas)
              .then(() => {
                this.visibles = false;
                this.confirmLoading = false;
                this.init();
              })
              .catch((err) => {
                console.log(err);
                this.confirmLoading = false;
                this.$message.error(err.response.data.message);
              });
          }
        })
        .catch((err) => {
          console.log("err", err);
          this.$message.error(err.response.data.message);
        });
    },
    handleCancel() {
      this.visibles = false;
      this.$nextTick(() => {
        this.$refs.forms.reset();
      });
    },
    /**数据管理 */
    // 数据删除
    delete_value(record) {
      var datas = {
        table: this.id,
        major: record.id,
      };
      value_delete(datas)
        .then(() => {
          this.init();
        })
        .catch((err) => {
          console.log("err", err);
          this.$message.error(err.response.data.message);
        });
    },
    // 数据还原
    restore_value(record) {
      var datas = {
        table: this.id,
        major: record.id,
      };
      value_restore(datas)
        .then(() => {
          this.init();
        })
        .catch((err) => {
          console.log("err", err);
          this.$message.error(err.response.data.message);
        });
    },

    valuehandleCancel() {
      this.value_visibles = false;
      this.$nextTick(() => {
        this.$refs.valueforms.reset();
      });
    },
    // 数据新增
    add_value() {
      this.value_visibles = true;
      this.titles = "数据新增";
      this.datas_id = undefined;
      this.$nextTick(() => {
        this.$refs.valueforms.reset();
      });
    },
    // 数据编辑
    edit_value(record) {
      console.log("record", record);
      this.datas_id = record.id;
      this.titles = "数据编辑";
      select_get({ table: this.id, id: record.id })
        .then((response) => {
          console.log(response);
          this.value_visibles = true;
          this.$nextTick(() => {
            this.$refs.valueforms.reset();
            this.$refs.valueforms.setData(response.data.data);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 数据提交
    valuehandleOk() {
      this.$refs.valueforms
        .getData()
        .then((res) => {
          if (this.titles == "数据编辑") {
            var datas = Object.assign({
              table: this.id,
              major: this.datas_id,
              data: res,
            });
            value_edit(datas)
              .then(() => {
                this.value_visibles = false;
                this.init();
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            var datas = Object.assign({
              table: this.id,
              data: res,
            });
            value_create(datas)
              .then(() => {
                this.value_visibles = false;
                this.init();
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    // 数据模板导入
    uploads() {
      this.template_visibles = true;
    },
    templatechanges(key, value) {
      if (key.length) {
        if (key[0].name.indexOf(".xlsx") < 0) {
          this.$message.error("请选择格式为.xlsx的文件！");
          this.$nextTick(() => {
            this.$refs.templateforms.setData({
              path: [],
            });
          });
        }
      }
    },
    templatehandleOk() {
      this.$refs.templateforms
        .getData()
        .then((res) => {
          value_template({
            path: res.path[0].url,
          })
            .then(() => {
              this.template_visibles = false;
              this.list();
            })
            .catch((error) => {
              console.log("error", error);
              this.$message.error(error.response.data.message);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    templateCancel() {
      this.template_visibles = false;
      this.$nextTick(() => {
        this.$refs.templateforms.reset();
      });
    },
    changetype(index) {
      const condition = this.domains[index].type;
      if (condition == 2) {
        //字符串
        this.domains[index].querys = ["包含", "是空", "非空", "存在", "不存在"];
      } else if (condition == 1 || condition == 0 || condition == 3) {
        //整数、小数、 日期
        this.domains[index].querys = [
          "等于",
          "小于",
          "小于等于",
          "大于",
          "大于等于",
        ];
      } else if (condition == 5 || condition == 4) {
        //布尔 对象
        this.domains[index].querys = ["等于"];
      }
    },
    // 日志
    journal(record) {
      this.journal_visibles = true;

      select_record({ table: this.datas.name, id: record.id })
        .then((res) => {
          this.logsDate = res.data.data._sources;
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    // 设置表单
    settings() {
      this.form_visibles = true;
      table_formsget({ table: this.id })
        .then((response) => {
          if (response.data.data) {
            this.jsonData = response.data.data.forms;
            this.$nextTick(() => {
              this.$refs.formdesign.handleSetData(this.jsonData);
            });
          } else {
            this.jsonData = {};
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 生成表单
    generate() {
      table_forms({ table: this.id })
        .then((res) => {
          this.$nextTick(() => {
            this.$refs.formdesign.handleSetData(res.data.data);
          });
          this.$message.success(res.data.message);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    reportforms() {
      this.reportvisible = true;
      console.log("columns", this.columns);
    },
    onClose() {
      this.reportvisible = false;
    },
    // 结果导出
    valueexport() {
      value_export({ table: this.id })
        .then((res) => {
          this.$message.success(res.data.data);
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
    },
    exportlist() {
      this.report_visibles = true;
      this.report_loading = true;
      download_paginate(this.paginate)
        .then((res) => {
          this.sportslist = res.data.data;
          this.report_loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
    },
    // 分页
    changepages(page, pageSize) {
      this.paginate.page = page;
      this.paginate.per_page = pageSize;
      this.exportlist();
    },
    reportcanceles() {
      this.report_visibles = false;
    },
    downloads(record) {
      download_get({ id: record.id })
        .then((res) => {
          const a = document.createElement("a");
          var bstr = atob(res.data.data),
            n = bstr.length,
            u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const blob = new Blob([u8arr], {
            type: record.mimetype,
          });
          a.download = record.category;
          a.href = window.URL.createObjectURL(blob);
          a.click();
          this.$message.success("操作成功！");
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
    },
    // 时间 + 8小时
    timestyles(time) {
      var date = new Date(time).getTime() + 8 * 60 * 60 * 1000;
      date = new Date(date);
      const Y = date.getFullYear();
      const M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      const D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      const h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      const m =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      const s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
    },
    // 时间 + 7天
    timeoverdue(record) {
      var time = record.lasttime;
      var date = new Date(time).getTime() + 7 * 24 * 60 * 60 * 1000;
      date = new Date(date);
      const Y = date.getFullYear();
      const M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      const D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      const h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      const m =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      const s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
    },
    back() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "home",
          params: this.params,
        },
      });
    },
    changes(e, filters, sorter) {
      var order = [];
      console.log("filters", filters);
      for (let item in filters) {
        console.log("item", item);
        if (filters[item].length) {
          order.push({
            field: item.substring(7),
            asc: filters[item][0] ? true : false,
          });
        }
      }
      // console.log("order", order);
      this.searchforms.order = order;
      this.list();
    },
  },
};
</script>
<style scoped>
.button_chheckbox >>> .ant-checkbox + span {
  padding-right: 8px !important;
}
.journal_s {
  height: 500px;
  overflow: auto;
}
#echarts {
  height: 230px !important;
}
.time_line {
  margin-left: 150px;
  height: 400px;
  overflow-y: auto;
}
.title_back {
  padding: 5px;
  background: #e7f3ff;
  border: 1px solid #5ab5ff;
  border-radius: 5px;
  margin-bottom: 10px;
  font-size: 16px;
}
.title_back a {
  color: #1890ff;
}
.table_content {
  margin: 10px 0;
}
.rights {
  margin: 10px 0px;
  /* max-height: 80vh; */
  /* overflow-y: auto; */
}
.rights ul {
  padding: 20px 0;
  width: 100%;
}
.rights ul li {
  font-size: 18px;
  background: #e5f6ff;
  margin: 5px 0;
  border-bottom: 1px solid #91d5ff;
  border-radius: 5px;
  padding: 0 5px;
}
.rights ul li:hover {
  color: #2196f3;
}
.rights >>> .ant-card-extra {
  padding: 10px 0px;
}
.over {
  line-height: 30px;
}
.li_icon {
  margin: 5px 0;
  cursor: pointer;
  font-size: 15px;
}
.icon_dele {
  margin: 9px;
  cursor: pointer;
  font-size: 14px;
}
.li_span {
  margin-left: 10px;
}
.checkbox_txt {
  font-size: 14px;
  width: 110px;
}
</style>
<style scoped>
.form-form {
  width: 100%;
  clear: both;
}
.body {
  background: #ffffff !important;
  padding: 10px;
}
</style>
<style>
.form-designer-container-9136076486841527
  .content
  section
  .form-panel
  .draggable-box
  .list-main
  .drag-move-box:hover {
  background: #cae7ff;
}
.form-designer-container-9136076486841527
  .content
  section
  .form-panel
  .draggable-box
  .list-main
  .drag-move-box
  .show-key-box {
  color: var(--theme);
}
.form-designer-container-9136076486841527
  .content
  section
  .form-panel
  .draggable-box
  .list-main
  .drag-move-box
  > .copy {
  background: var(--theme);
}
.form-designer-container-9136076486841527
  .content
  section
  .form-panel
  .draggable-box
  .list-main
  .drag-move-box
  > .delete {
  background: var(--theme);
}
.form-designer-container-9136076486841527
  .content
  section
  .form-panel
  .draggable-box
  .list-main
  .drag-move-box:before {
  background: var(--theme);
}
.form-designer-container-9136076486841527
  .content
  section
  .form-panel
  .draggable-box
  .list-main
  .drag-move-box.active {
  background: #cae7ff;
}
.form-designer-container-9136076486841527
  .content
  aside.right
  .form-item-properties
  .close-box {
  background: var(--theme);
}
.form-designer-container-9136076486841527 .content aside.left ul li:hover {
  color: var(--theme);
  border: 1px solid var(--theme);
  -webkit-box-shadow: 0 2px 6px var(--theme);
  box-shadow: 0 2px 6px var(--theme);
}
.form-designer-container-9136076486841527 .operating-area a:hover {
  color: var(--theme);
}
.conter ant-layout-content {
  background: none !important;
}
</style>