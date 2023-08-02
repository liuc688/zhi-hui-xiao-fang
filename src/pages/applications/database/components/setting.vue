<template>
  <div class="main">
    <a-input-search
      placeholder="请输入关键字查询"
      style="width: 60%"
      v-model="searchform.keyword"
      enter-button
      allowClear
      pressEnter
      @search="onSearch"
      :loading="searchloading"
    />
    <a-button style="margin-left: 10px">
      <a-checkbox v-model="searchform.delete" @change="onRecycle"
        >回收站</a-checkbox
      >
    </a-button>
    <div style="margin: 20px auto">
      <a-button type="primary" @click="addreport">
        <a-icon type="plus" />
        新增
      </a-button>
    </div>
    <a-table
      ref="table"
      :bordered="true"
      class="tables"
      size="middle"
      rowKey="id"
      :loading="loading"
      :columns="columnes"
      :dataSource="datasource.items"
      :pagination="false"
    >
      <span slot="action" slot-scope="text, record">
        <!-- 已删除 -->
        <div v-if="record._delete">
          <a-popconfirm
            placement="topLeft"
            :title="'是否确认还原这条数据吗?'"
            ok-text="确认"
            cancel-text="取消"
            @confirm="delete_restore(record)"
          >
            <a style="color: #1890ff">还原</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a-popconfirm
            placement="topLeft"
            :title="'是否确认删除这条报表吗?'"
            ok-text="确认"
            cancel-text="取消"
            @confirm="delete_table(record)"
          >
            <a style="color: #1890ff">删除</a>
          </a-popconfirm>
        </div>
        <!-- 未删除 -->
        <div v-else>
          <a style="color: #1890ff" @click="edit_table(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm
            placement="topLeft"
            :title="'是否确认删除这条报表吗?'"
            ok-text="确认"
            cancel-text="取消"
            @confirm="delete_table(record)"
          >
            <a style="color: #1890ff">删除</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a style="color: #1890ff" @click="runs(record)">运行</a>
          <!-- <a-dropdown>
            <a
              class="ant-dropdown-link"
              style="color: #1890ff"
              @click="(e) => e.preventDefault()"
            >
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm
                  placement="topLeft"
                  :title="'是否确认删除这条报表吗?'"
                  ok-text="确认"
                  cancel-text="取消"
                  @confirm="delete_table(record)"
                >
                  <a style="color: #1890ff">删除</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item>
                <a style="color: #1890ff" @click="runs(record)">运行</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown> -->
        </div>
      </span>
    </a-table>
    <a-pagination
      size="small"
      style="text-align: right"
      @change="changepage"
      :current="paginations.page"
      :pageSize="paginations.per_page"
      @showSizeChange="changepage"
      :pageSizeOptions="pageSizeOptions"
      :total="datasource.total"
      show-size-changer
      show-quick-jumper
      :show-total="(total) => `共 ${total} 条`"
    ></a-pagination>
    <a-modal
      width="60%"
      :title="Titles"
      :closable="false"
      v-bind:visible="visible"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
      @ok="handleOks"
      @cancel="handleCancel"
    >
      <a-spin tip="Loading..." :spinning="spinning">
        <a-form-model
          ref="form"
          :model="form"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :rules="rules"
        >
          <a-form-model-item label="报表标题" prop="title">
            <a-input v-model="form.title" placeholder="请输入报表标题" />
          </a-form-model-item>
          <a-form-model-item label="报表描述" prop="content">
            <a-input
              type="textarea"
              :rows="4"
              v-model="form.content"
              placeholder="请输入报表描述"
            />
          </a-form-model-item>
          <a-form-model-item label="查询条件">
            <a-input-group
              size="default"
              style="padding: 3px 0px"
              compact
              v-for="(item, index) in form.domains"
              :key="index"
            >
              <a-select
                v-model="item.judge"
                placeholder="请选择"
                :disabled="index == 0"
                :showArrow="false"
                style="width: 10%"
              >
                <a-select-option value="and">并且</a-select-option>
                <a-select-option value="ors">或者</a-select-option>
              </a-select>
              <a-select
                v-model="item.field"
                style="width: 20%"
                placeholder="请选择查询字段"
              >
                <a-select-option
                  v-for="items in titlelist"
                  :key="items.field"
                  >{{ items.title }}</a-select-option
                >
              </a-select>
              <a-select
                v-model="item.type"
                style="width: 20%"
                placeholder="值类型"
                @change="changetype(index)"
              >
                <a-select-option v-for="temp in types" :key="temp.name">{{
                  temp.title
                }}</a-select-option>
              </a-select>
              <a-select
                v-model="item.query"
                style="width: 15%"
                placeholder="条件"
              >
                <a-select-option v-for="itemes in item.querys" :key="itemes">{{
                  itemes
                }}</a-select-option>
              </a-select>
              <a-date-picker
                v-if="item.type == 3"
                :show-time="{ format: 'HH:mm:ss' }"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: calc(35% - 42px)"
                v-model="item.value"
                placeholder="请选择日期时间"
                @change="changedata(item.value, index)"
              />
              <a-select
                v-else-if="item.type == 4"
                style="width: calc(35% - 42px)"
                v-model="item.value"
                placeholder="请选择布尔值"
              >
                <a-select-option :key="1">是</a-select-option>
                <a-select-option :key="0">否</a-select-option>
              </a-select>
              <a-input
                v-else
                style="width: calc(35% - 42px)"
                v-model="item.value"
                allowClear
                placeholder="请输入查询值"
              ></a-input>
              <!-- 按钮 -->
              <a-button @click="reducefactor(index)">
                <a-icon type="minus" />
              </a-button>
            </a-input-group>
            <!-- 按钮 -->
            <a-button @click="addfactor">
              <a-icon type="plus" />
            </a-button>
          </a-form-model-item>
          <a-form-model-item label="排序">
            <a-input-group
              size="default"
              style="padding: 3px 0px"
              compact
              v-for="(temp, index) in form.order"
              :key="index"
            >
              <a-select
                v-model="temp.field"
                style="width: calc(60% - 23px)"
                allowClear
                placeholder="请选择字段"
              >
                <a-select-option
                  v-for="items in titlelist"
                  :key="items.field"
                  >{{ items.title }}</a-select-option
                >
              </a-select>
              <a-radio-group
                v-model="temp.asc"
                button-style="solid"
                style="
                  width: calc(40% - 23px);
                  margin-top: 5px;
                  text-align: center;
                "
              >
                <a-radio :value="true"> 升序 </a-radio>
                <a-radio :value="false"> 降序 </a-radio>
              </a-radio-group>
              <!-- 按钮 -->
              <a-button @click="reduceorder(index)">
                <a-icon type="minus" />
              </a-button>
            </a-input-group>
            <!-- 按钮 -->
            <a-button @click="addorder">
              <a-icon type="plus" />
            </a-button>
          </a-form-model-item>
          <a-form-model-item label="数据格式化">
            <a-input-group
              size="default"
              style="padding: 3px 0px"
              compact
              v-for="(temp, index) in form.project"
              :key="index"
            >
              <a-select
                v-model="temp.field"
                style="width: calc(50% - 23px)"
                allowClear
                placeholder="请选择字段"
              >
                <a-select-option
                  v-for="items in titlelists"
                  :key="items.field"
                  >{{ items.title }}</a-select-option
                >
              </a-select>
              <a-select
                v-model="temp.category"
                style="width: calc(50% - 23px)"
                allowClear
                placeholder="请选择是否升序"
              >
                <a-select-option :key="0">年</a-select-option>
                <a-select-option :key="1">年-月</a-select-option>
                <a-select-option :key="2">年-月-日</a-select-option>
                <a-select-option :key="3">年-月-日 时</a-select-option>
                <a-select-option :key="4">年-月-日 时:分</a-select-option>
                <a-select-option :key="5">年-月-日 时:分:秒</a-select-option>
              </a-select>
              <!-- 按钮 -->
              <a-button @click="reduceproject(index)">
                <a-icon type="minus" />
              </a-button>
            </a-input-group>
            <a-button @click="addproject">
              <a-icon type="plus" />
            </a-button>
          </a-form-model-item>
          <a-form-model-item label="横向坐标" prop="crosswise">
            <a-select
              mode="multiple"
              v-model="form.crosswise"
              style="width: 100%"
              allowClear
              placeholder="请选择横向坐标字段"
            >
              <a-select-option v-for="items in titlelist" :key="items.field">{{
                items.title
              }}</a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="纵向坐标" prop="lengthways">
            <a-input-group
              size="default"
              style="padding: 3px 0px"
              compact
              v-for="(temp, index) in form.lengthways"
              :key="index"
            >
              <a-select
                v-model="temp.field"
                style="width: calc(50% - 23px)"
                allowClear
                placeholder="请选择字段"
              >
                <a-select-option
                  v-for="items in titlelist"
                  :key="items.field"
                  >{{ items.title }}</a-select-option
                >
              </a-select>
              <a-select
                v-model="temp.lengthway"
                style="width: calc(50% - 23px)"
                allowClear
                placeholder="请选择计算函数"
              >
                <a-select-option :key="0">最大值</a-select-option>
                <a-select-option :key="1">最小值</a-select-option>
                <a-select-option :key="2">求和</a-select-option>
                <a-select-option :key="3">平均数</a-select-option>
                <a-select-option :key="4">总计</a-select-option>
              </a-select>
              <!-- 按钮 -->
              <a-button @click="reducelengthways(index)">
                <a-icon type="minus" />
              </a-button>
            </a-input-group>
            <a-button @click="addlengthways">
              <a-icon type="plus" />
            </a-button>
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </a-modal>
    <a-modal
      width="60%"
      :closable="false"
      :visible="datasvisible"
      :maskClosable="false"
    >
      <span slot="footer">
        <a-button @click="datasCancels">关闭</a-button>
      </span>
      <span slot="title" class="datas_table_s">{{ datas_table }}</span>
      <div v-if="database.length">
        <a-select
          v-model="actives"
          style="width: 150px; margin-bottom: 20px"
          @change="handleChange"
        >
          <a-select-option value="1"> 柱状图 </a-select-option>
          <a-select-option value="2"> 饼图 </a-select-option>
          <a-select-option value="3"> 折线图 </a-select-option>
        </a-select>
        <div id="containers_database"></div>
      </div>
      <div v-else class="database_s">暂无数据</div>
    </a-modal>
  </div>
</template>
<script>
import {
  report_paginate,
  report_delete,
  report_restore,
  report_run,
  report_create,
  report_get,
  report_edit,
} from "@/services/database";
import { Column, Pie, Line } from "@antv/g2plot";
import moment from "moment";
export default {
  props: {
    id: {
      type: String,
    },
    data: {
      //传递的数据
      type: Object,
      default: () => {
        return {};
      },
    },
    columns: {
      type: Array,
      default: () => {
        return [];
      },
    },
    titlelist: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  computed: {
    paginations: {
      get() {
        return {
          page: this.datasource.page || 1,
          per_page: this.datasource.per_page || 10,
          total: this.datasource.total || 0,
        };
      },
      set(val) {
        this.datasource.page = val.page || 1;
        this.datasource.per_page = val.per_page || 10;
        this.datasource.total = val.total || 0;
      },
    },
  },
  data() {
    return {
      searchform: {
        keyword: "",
        delete: false,
        page: 1,
        per_page: 10,
      },
      loading: false,
      searchloading: false,
      datasource: {},
      columnes: [
        {
          title: "标题",
          dataIndex: "title",
          scopedSlots: { customRender: "title" },
        },
        {
          title: "最后修改时间",
          dataIndex: "_modifytime",
          scopedSlots: { customRender: "_modifytime" },
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
          width: "150px",
          align: "center",
          fixed: "right",
        },
      ],
      Titles: "报表新增",
      visible: false,
      confirmLoading: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      form: {
        title: undefined,
        content: undefined,
        domains: [],
        order: [],
        project: [],
        crosswise: [],
        lengthways: [],
      },
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
      rules: {
        title: [{ required: true, message: "请输入报表标题", trigger: "blur" }],
        content: [
          { required: true, message: "请输入报表描述", trigger: "blur" },
        ],
        crosswise: [
          { required: true, message: "请选择横向坐标字段", trigger: "blur" },
        ],
        lengthways: [
          { required: true, message: "请选择横向坐标字段", trigger: "blur" },
          {
            required: true,
            validator: this.validators,
          },
        ],
      },
      titlelists: [],
      spinning: false,
      sportid: undefined,
      pageSizeOptions: ["10", "20", "30", "40"],
      //报表
      datasvisible: false,
      database: {},
      dataslast: {},
      lengthwaylist: [
        { key: 0, name: "最大值", id: "max" },
        { key: 1, name: "最小值", id: "min" },
        { key: 2, name: "求和", id: "sum" },
        { key: 3, name: "平均数", id: "avg" },
        { key: 4, name: "总计", id: "amount" },
      ],
      indext: 0,
      Linesdata: {},
      //
      actives: "1",
      datas_table: "",
    };
  },
  created() {},
  mounted() {
    setTimeout(() => {
      this.init();
    }, 1000);
  },
  methods: {
    init() {
      this.titlelists = this.titlelist.filter((item) => {
        return item.types == 3;
      });
      this.getdatas();
    },
    getdatas() {
      this.searchloading = true;
      this.loading = true;
      report_paginate(Object.assign(this.searchform, { table: this.id }))
        .then((Responses) => {
          this.datasource = Responses.data.data;
          this.searchloading = false;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.searchloading = false;
          this.loading = false;
        });
    },
    handleChange(e) {
      this.actives = e;
      this.Linesdata.destroy();
      this.Linesdata = new Object();
      if (e == 2) {
        // 饼图
        this.$nextTick(() => {
          this.Linesdata = new Pie("containers_database", {
            data: this.database,
            appendPadding: 10,
            radius: 0.9,
            angleField: "value",
            colorField: "name",
            label: {
              type: "outer",
              labelHeight: 28,
              content: "{name}\n{percentage}",
            },
          });
          this.Linesdata.render();
        });
      } else if (e == 1) {
        // 柱状图
        this.Linesdata = new Column("containers_database", {
          data: this.database,
          xField: "name",
          yField: "value",
          seriesField: "lebal",
          isGroup: "true",
          label: {
            // 可手动配置 label 数据标签位置
            position: "top",
            offset: 4,
          },
        });
        this.Linesdata.render();
      } else {
        // 折线图
        this.Linesdata = new Line("containers_database", {
          data: this.database,
          padding: "auto",
          xField: "name",
          yField: "value",
          xAxis: {
            tickCount: 5,
          },
          point: {
            size: 5,
            shape: "diamond",
            style: {
              fill: "white",
              stroke: "#5B8FF9",
              lineWidth: 2,
            },
          },
          label: {},
          smooth: true,
        });
        this.Linesdata.render();
      }
    },
    // 分页
    changepage(page, pageSize) {
      this.searchform.page = page;
      this.searchform.per_page = pageSize;
      this.paginations.page = page;
      this.paginations.per_page = pageSize;
      this.getdatas();
    },
    onSearch() {
      this.getdatas();
    },
    onRecycle() {
      this.getdatas();
    },
    // 编辑
    edit_table(record) {
      this.Titles = "报表编辑";
      this.visible = true;
      this.spinning = true;
      this.sportid = record.id;
      report_get({ id: record.id })
        .then((res) => {
          console.log(res);
          var dats = res.data.data;
          dats.domains = [];
          dats.ands.filter((item) => {
            dats.domains.push(
              Object.assign(item, {
                judge: "and",
                querys: this.getquerys(item),
              })
            );
          });
          dats.ors.filter((item) => {
            dats.domains.push(
              Object.assign(item, {
                judge: "ors",
                querys: this.getquerys(item),
              })
            );
          });
          this.$nextTick(() => {
            this.form = {
              title: dats.title || "",
              content: dats.content || "",
              domains: dats.domains || [],
              order: dats.order || [],
              project: dats.project || [],
              crosswise: dats.crosswise || [],
              lengthways: dats.lengthways || [],
            };
          });
          this.spinning = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getquerys(item) {
      if (item.type == 2) {
        //字符串
        return ["包含", "是空", "非空", "存在", "不存在"];
      } else if (item.type == 1 || item.type == 3 || item.type == 0) {
        //整数、小数、 日期
        return ["等于", "小于", "小于等于", "大于", "大于等于"];
      } else if (item.type == 5 || item.type == 4) {
        //布尔 对象
        return ["等于"];
      }
    },
    // 新增
    addreport() {
      this.visible = true;
      this.Titles = "报表新增";
      this.sportid = undefined;
      this.$nextTick(() => {
        this.$refs.form.resetFields();
      });
      this.form = {
        title: undefined,
        content: undefined,
        domains: [],
        order: [],
        project: [],
        crosswise: [],
        lengthways: [],
      };
    },
    // 保存
    handleOks() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          var datas = Object.assign(this.form, {
            ands: [],
            ors: [],
          });
          datas.domains.filter((item) => {
            if (item.judge == "and" && item.field && item.query) {
              datas.ands.push(item);
            } else if (item.judge == "ors" && item.field && item.query) {
              datas.ors.push(item);
            }
          });
          delete datas["domains"];
          if (this.sportid) {
            var dataws = Object.assign(datas, {
              table: this.id,
              id: this.sportid,
            });
            report_edit(dataws)
              .then((resp) => {
                console.log("resp", resp);
                this.visible = false;
                this.$message.success("操作成功！");
                this.getdatas();
              })
              .catch((error) => {
                console.log(error);
                this.visible = false;
              });
          } else {
            report_create(Object.assign(datas, { table: this.id }))
              .then(() => {
                this.$message.success("操作成功！");
                this.visible = false;
                this.getdatas();
              })
              .catch((error) => {
                console.log(error);
                this.visible = false;
              });
          }
        } else {
          console.log(3333);
        }
      });
    },
    handleCancel() {
      this.visible = false;
      this.$nextTick(() => {
        this.$refs.form.resetFields();
      });
      this.form = {
        title: undefined,
        content: undefined,
        domains: [],
        order: [],
        project: [],
        crosswise: [],
        lengthways: [],
      };
    },
    // 删除
    delete_table(record) {
      console.log("record", record);
      report_delete({ id: record.id })
        .then((res) => {
          console.log(res);
          this.getdatas();
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
    },
    // 还原
    delete_restore(record) {
      console.log("record", record);
      report_restore({ id: record.id })
        .then((res) => {
          console.log(res);
          this.getdatas();
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
    },
    //运行
    runs(record) {
      this.datas_table = record.title || "数据报表";
      report_run({ id: record.id })
        .then((res) => {
          console.log("res", res);
          this.database = res.data.data;
          this.datasvisible = true;
          this.$nextTick(() => {
            this.Linesdata = new Column("containers_database", {
              data: this.database,
              xField: "name",
              yField: "value",
              seriesField: "lebal",
              isGroup: "true",
              label: {
                // 可手动配置 label 数据标签位置
                position: "top",
                offset: 4,
              },
            });
            this.Linesdata.render();
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
    },
    //
    datasCancels() {
      this.datasvisible = false;
      this.actives = "1";
      this.Linesdata.destroy();
      this.Linesdata = new Object();
    },
    changetype(index) {
      const condition = this.form.domains[index].type;
      if (condition == 2) {
        //字符串
        this.form.domains[index].querys = [
          "包含",
          "是空",
          "非空",
          "存在",
          "不存在",
        ];
      } else if (condition == 1 || condition == 3 || condition == 0) {
        //整数、小数、 日期
        this.form.domains[index].querys = [
          "等于",
          "小于",
          "小于等于",
          "大于",
          "大于等于",
        ];
      } else if (condition == 5 || condition == 4) {
        //布尔 对象
        this.form.domains[index].querys = ["等于"];
      }
    },
    changedata(value, index) {
      if (value) {
        this.form.domains[index].value = moment(value).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      } else {
        this.form.domains[index].value = undefined;
      }
    },
    // 添加条件
    addfactor() {
      this.form.domains.push({
        title: undefined,
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
      this.form.domains.splice(index, 1);
    },

    // 增加排序
    addorder() {
      this.form.order.push({
        field: undefined,
        asc: undefined,
      });
    },
    // 减少排序
    reduceorder(index) {
      this.form.order.splice(index, 1);
    },

    // 增加数据格式化
    addproject() {
      this.form.project.push({
        field: undefined,
        category: undefined,
      });
    },
    // 减少数据格式化
    reduceproject(index) {
      this.form.project.splice(index, 1);
    },
    // 增加纵坐标
    addlengthways() {
      this.form.lengthways.push({
        field: undefined,
        lengthway: undefined,
      });
    },
    // 减少纵坐标
    reducelengthways(index) {
      this.form.lengthways.splice(index, 1);
    },
    // 验证
    validators(rule, value, callback) {
      var array = [];
      for (let index = 0; index < value.length; index++) {
        array.push(value[index].field);
        array.push(value[index].lengthway);
      }
      var arrays = array.filter((item) => {
        return item == undefined;
      });
      if (arrays.length) {
        return callback("请填选值！");
      } else {
        return callback();
      }
    },
  },
};
</script>
<style scoped>
.database_s {
  width: 100%;
  height: 500px;
  text-align: center;
  font-size: 30px;
  color: #dadada;
}
.main >>> .ant-checkbox + span {
  padding-right: 8px !important;
}
.datas_table_s {
  font-size: 24px;
}
</style>
<style lang="less" scoped >
.main {
  margin: 20px auto;
  .tables {
    margin: 20px auto;
  }
}
</style>