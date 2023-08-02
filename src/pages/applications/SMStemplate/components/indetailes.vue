<template>
  <a-card :body-style="{ padding: '24px 52px' }" :bordered="false">
    <div class="title_backs">
      <a @click="back"><a-icon type="arrow-left" />返回</a>
    </div>
    <a-descriptions bordered class="describle">
      <a-descriptions-item label="签名">
        {{ datas.singnature }}
        <a-tooltip>
          <template slot="title"> 复制模板id </template>
          <a-icon type="copy" theme="twoTone" @click="copys(datas.id)" />
        </a-tooltip>
      </a-descriptions-item>
      <a-descriptions-item label="APIkey">
        {{ datas.un }}
      </a-descriptions-item>
      <a-descriptions-item label="APIsecret">
        {{ datas.pw }}
      </a-descriptions-item>
      <a-descriptions-item label="内容类型">
        {{ datas.dc == 15 ? "中文" : "UCS2" }}
      </a-descriptions-item>
      <a-descriptions-item label="内容编码">
        {{ datas.tf == 8 ? "UTF-8" : "GBK" }}
      </a-descriptions-item>
      <a-descriptions-item label="返回格式">
        {{ datas.rf == 2 ? "JSON" : "XML" }}
      </a-descriptions-item>
      <a-descriptions-item label="创建时间">
        {{ datas._createtime }}
      </a-descriptions-item>
      <a-descriptions-item label="创建人员">
        {{ creator.length ? creator[0].realname : "" }}
      </a-descriptions-item>
      <a-descriptions-item label="最后修改时间">
        {{ datas._modifytime }}
      </a-descriptions-item>
      <a-descriptions-item label="最后修改人员">
        {{ modifier.length ? modifier[0].realname : "" }}
      </a-descriptions-item>
      <a-descriptions-item label="已发送短信条数">
        <a-badge :count="datas.count" />
      </a-descriptions-item>
      <a-descriptions-item label="是否需要状态报告">
        {{ datas.rd == 1 ? "需要" : "不需要" }}
      </a-descriptions-item>
      <a-descriptions-item label="内容模板" :span="3">
        {{ datas.sm }}
      </a-descriptions-item>
    </a-descriptions>
    <a-card class="cccard">
      <span slot="title" class="paod_title">短信发送统计图</span>
      <div class="paod" id="paod"></div>
    </a-card>
  </a-card>
</template>
<script>
import { short_get, short_count } from "@/services/SMStemplate";
import { Line } from "@antv/g2plot";
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
      id: undefined,
      datas: {},
      modifier: [],
      creator: [],
      stackedColumnPlot: {},
    };
  },
  created() {
    this.id = this.params.id;
    this.init();
  },
  mounted() {},
  methods: {
    init() {
      short_get({ id: this.id })
        .then((res) => {
          this.datas = res.data.data;
          this.creator = res.data.data._creator;
          this.modifier = res.data.data._modifier;
        })
        .catch((err) => {
          console.log("err", err);
          this.$message.error(err.response.data.message);
        });
      short_count({ template: this.id })
        .then((response) => {
          this.selectdata = response.data.data;
          this.getselects(this.selectdata);
        })
        .catch((err) => {
          console.log("err", err);
          this.$message.error(err.response.data.message);
        });
    },
    getselects(data) {
      this.stackedColumnPlot = new Line("paod", {
        data: data,
        padding: "auto",
        xField: "_id",
        yField: "count",
        label: {},
        point: {
          size: 5,
          shape: "diamond",
          style: {
            fill: "white",
            stroke: "#5B8FF9",
            lineWidth: 2,
          },
        },
        tooltip: { showMarkers: false },
        state: {
          active: {
            style: {
              shadowBlur: 4,
              stroke: "#000",
              fill: "red",
            },
          },
        },
        appendPadding: [26, 8, 26, 8],
      });
      this.stackedColumnPlot.render();
    },
    copys(id) {
      this.$copyText(id)
        .then((res) => {
          this.$message.success("复制成功!");
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("复制失败！");
        });
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
  },
};
</script>
<style scoped>
.title_backs {
  padding: 10px;
  background: #daedff;
  border: 1px solid #40a9ff;
  border-radius: 5px;
  margin-bottom: 20px;
}
.describle {
  margin: 20px auto 50px;
}
.describle >>> .ant-descriptions-item-label {
  font-size: 16px !important;
}
.describle >>> .ant-descriptions-item-content {
  font-size: 16px !important;
}
.paod_title {
  font-size: 20px;
  font-weight: 600;
}
.paod {
  height: 400px;
}
.cccard >>> .ant-card-head{
  background: #daedff;
}
</style>