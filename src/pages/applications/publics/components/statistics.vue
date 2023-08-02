<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <a-spin tip="Loading..." :spinning="loadings">
      <a-back-top />
      <a-form-model layout="horizontal" :model="searchform" ref="searchform">
        <a-row>
          <a-col :md="8" :sm="24">
            <a-form-model-item
              label="指定日期"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
              format="YYYY-MM-DD"
            >
              <a-range-picker
                style="width: 100%"
                v-model="rangedata"
                @change="onTimerRangeChange"
                allowClear
              />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span style="float: right; margin-top: 3px">
              <a-button
                type="primary"
                @click="onSearch"
                :loading="searchloading"
                >查询</a-button
              >
              <a-button
                style="margin-left: 8px"
                @click="resetForm"
                :loading="resetloading"
                >重置</a-button
              >
            </span>
          </a-col>
        </a-row>
      </a-form-model>
      <!-- 柱状图 -->
      <div class="charts" id="publicCharts1"></div>
      <div v-show="selectKeys" class="line_sty">
        <!-- <hr /> -->
        <h2>标签为“{{ selectKey }}”的申请记录</h2>
        <!-- 折线图 -->
        <div id="taglins" style="height: 400px"></div>
        <div>
          <a-table
            ref="table"
            bordered
            class="table_content"
            size="middle"
            rowKey="id"
            :pagination="true"
            :columns="columns"
            :dataSource="dataSource"
          >
            <span slot="action" slot-scope="text, record">
              <a @click="toform(record)">查看</a>
            </span>
            <span slot="type" slot-scope="text, record">{{
              record.type == 1 ? "公民" : "企业"
            }}</span>
            <span slot="keywords" slot-scope="text, record">
              <a-tag
                v-for="(item, index) in record.keywords"
                :key="index"
                :color="item == selectKey ? 'blue' : ''"
                >{{ item }}</a-tag
              >
            </span>
            <span slot="status" slot-scope="text, record">
              <a-tag
                :color="status[item].color"
                class="tags"
                v-for="item in record.status"
                :key="item"
                >{{ status[item].title }}</a-tag
              >
            </span>
          </a-table>
        </div>
      </div>
    </a-spin>
  </a-card>
</template>
<script>
import { statistics, keywordsapply } from "@/services/public";
import { Column, Line } from "@antv/g2plot";
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
  data() {
    return {
      searchform: {},
      rangedata: [],
      searchloading: false,
      resetloading: false,
      loadings: true,
      data: [],
      index: 0,
      times: 0,
      linePlot: {},
      lines: {},
      selectKey: "",
      selectKeys: false,
      currentDates: "",
      currentDate: "",
      dataSource: [],
      columns: [
        {
          title: "序号",
          dataIndex: "",
          key: "rowIndex",
          width: 60,
          align: "center",
          customRender: function (t, r, index) {
            return parseInt(index) + 1;
          },
        },
        {
          title: "申请人姓名",
          dataIndex: "realname",
          scopedSlots: { customRender: "realname" },
        },
        {
          title: "申请人性质",
          dataIndex: "type",
          scopedSlots: { customRender: "type" },
        },
        {
          title: "标签",
          dataIndex: "keywords",
          scopedSlots: { customRender: "keywords" },
        },
        {
          title: "创建时间",
          dataIndex: "_createtime",
          scopedSlots: { customRender: "_createtime" },
        },
        {
          title: "状态",
          dataIndex: "status",
          scopedSlots: { customRender: "status" },
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 100,
          scopedSlots: { customRender: "action" },
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
        80: { title: "答复复议", color: "purple" },
        90: { title: "已答复复议", color: "purple" },
        100: { title: "已失效", color: "gray" },
        110: { title: "已撤销", color: "gray" },
      },
    };
  },
  mounted() {},
  computed: {
    userinfo() {
      return this.$store.getters["account/user"];
    },
  },
  created() {
    this.todates();
    setTimeout(() => {
      this.init();
    }, 500);
  },
  methods: {
    todates() {
      var date = new Date();
      let dates = new Date(date - 1000 * 60 * 60 * 24 * 30); //最后一个
      var month = date.getMonth() + 1;
      var months = dates.getMonth() + 1;
      var strDates = dates.getDate();
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (months >= 1 && months <= 9) {
        months = "0" + months;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      if (strDates >= 0 && strDates <= 9) {
        strDates = "0" + strDates;
      }
      this.currentDate = date.getFullYear() + "-" + month + "-" + strDate;
      this.currentDates = dates.getFullYear() + "-" + months + "-" + strDates;
      this.rangedata = [this.currentDates, this.currentDate];
      this.searchform={
        start:this.currentDates,
        end:this.currentDate
      }
    },
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
    linePlots(data) {
      if (this.index == 1) {
        this.linePlot = new Column("publicCharts1", {
          data: data,
          xField: "_id",
          yField: "count",
          seriesField: "_id",
          tooltip: {
            position: "top",
          },
          height: 400,
        });
      }
      this.linePlot.render();
      this.linePlot.changeData(data);
      this.linePlot.on("element:click", (e) => {
        this.selectKey = e.data.data._id;
        this.applykeywords(this.selectKey);
      });
    },
    applykeywords(data) {
      this.loadings=true
      keywordsapply({keywords: data})
        .then((res) => {
          this.selectKeys = true;
          this.dataSource = res.data.data;
          this.loadings=false
          this.antLines(res.data.keyword);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 折线图-关键字
    antLines(data) {
      if (this.times == 0) {
        this.lines = new Line("taglins", {
          data,
          xField: "date",
          yField: "count",
          padding : [30, 60, 50, 60],
          appendPadding :[16,8,16,8],
          renderer:'svg',
          label: {
            offsetY: 5
          },
          smooth: true,
          limitInPlot: false,
          point: {
            size: 2,
            style: {
              fill: "white",
              stroke: "#2593fc",
              lineWidth: 2,
            },
          },
          tooltip: {
            formatter: (datum) => {
              return { name: "总计", value: datum.count };
            },
          },
          yAxis: {
            // min: 0,
            tickInterval:1
          },
        });
      }
      this.times++;
      this.lines.render();
      this.lines.changeData(data);
    },
    init() {
      statistics(this.searchform)
        .then((res) => {
          this.index++;
          this.data = res.data.data;
          if (this.data.length == 0) {
            this.$message.warning("此时间段暂无数据！");
          }
          this.linePlots(this.data);
          this.searchloading = false;
          this.resetloading = false;
          this.loadings = false;
        })
        .catch((err) => {
          console.log("err", err);
          this.loadings = false;
        });
    },
    onTimerRangeChange(data, strdate) {
      if (strdate && strdate.length) {
        this.searchform.start = strdate[0];
        this.searchform.end = strdate[1];
        this.rangedata = [strdate[0], strdate[1]];
      } else {
        this.searchform.start = undefined;
        this.searchform.end = undefined;
      }
    },
    onSearch() {
      this.data = [];
      this.selectKeys = false;
      this.searchloading = true;
      this.init();
    },
    resetForm() {
      this.searchform = {};
      this.rangedata = [this.currentDates, this.currentDate];
      this.selectKeys = false;
      this.resetloading = true;
      this.init();
    },
    onReset() {
      this.loadings = true;
      this.resetForm();
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
<style scoped>
.line_sty {
  padding: 10px;
  margin-top: 30px;
}
.table_content {
  margin-top: 30px;
}
</style>