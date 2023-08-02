<template>
  <div class="info_rights">
    <div class="top_bg">检测报告</div>
    <div class="search_action">
      <a-select v-model="type" style="width: 120px; margin-right: 10px" class="selectes" placeholder="请选择">
        <a-select-option v-for="item in list" :key="item">{{ item }}</a-select-option>
      </a-select>
      <a-date-picker @change="onChange" class="selectes" style="width: 140px" placeholder="请选择开始日期" />
      <span style="margin: auto 10px">到</span>
      <a-date-picker @change="onChange" class="selectes" style="width: 140px" placeholder="请选择结束日期" />
      <div class="search_bgs">
        <img src="./images/search.png" alt="" />
        查询
      </div>
      <div class="search_dcs">
        <img src="./images/search_dc.png" alt="" />
        导出word
      </div>
      <div class="search_dcs">
        <img src="./images/search_dc.png" alt="" />
        导出PDF
      </div>
    </div>
    <div class="top_bg">联网单位信息</div>
    <div class="table_s">
      <table class="table_border">
        <tr style="width: 100%">
          <th>单位名称:</th>
          <td>演示账号</td>
          <th>单位地址:</th>
          <td>演示账号</td>
        </tr>
        <tr style="width: 100%">
          <th>单位类别:</th>
          <td style="text-align: left">高层公共建筑、地下铁道、地下观光隧道、粮、棉、木材、百货等物资仓库和堆场、重点工程的施工现场,高层公共建筑,写字楼（办公楼）</td>

          <th>消防第一责任人:</th>
          <td>柴（15315559860）</td>
        </tr>
        <tr style="width: 100%">
          <th>设备总数:</th>
          <td>9套</td>
          <th>设备总数:</th>
          <td>0套 | 8套</td>
        </tr>
      </table>
    </div>
    <div class="table_s">
      <table class="table_borders">
        <tr style="width: 100%">
          <th :rowspan="4">接入系统</th>
          <td>
            <img src="./images/xitong_01.png" alt="" />
            电气火灾监测
          </td>
          <td>
            总设备 |
            <span style="color: aqua">3</span>
          </td>
          <td>
            总设备 |
            <span style="color: aqua">3</span>
          </td>
          <td>
            总设备 |
            <span style="color: aqua">3</span>
          </td>
          <td>
            总设备 |
            <span style="color: aqua">3</span>
          </td>
        </tr>
        <tr style="width: 100%">
          <td>
            <img src="./images/xitong_02.png" alt="" />
            消防用水监测
          </td>
          <td>
            总设备 |
            <span style="color: aqua">3</span>
          </td>
          <td>
            总设备 |
            <span style="color: aqua">3</span>
          </td>
          <td>
            总设备 |
            <span style="color: aqua">3</span>
          </td>
          <td>
            总设备 |
            <span style="color: aqua">3</span>
          </td>
        </tr>
        <tr style="width: 100%">
          <td>
            <img src="./images/xitong_03.png" alt="" />
            消防用水监测
          </td>
          <td>
            总设备 |
            <span style="color: aqua">3</span>
          </td>
          <td>
            总设备 |
            <span style="color: aqua">3</span>
          </td>
          <td>
            总设备 |
            <span style="color: aqua">3</span>
          </td>
          <td>
            总设备 |
            <span style="color: aqua">3</span>
          </td>
        </tr>
        <tr style="width: 100%">
          <td>
            <img src="./images/xitong_04.png" alt="" />
            消防用水监测
          </td>
          <td>
            总设备 |
            <span style="color: aqua">3</span>
          </td>
          <td>
            总设备 |
            <span style="color: aqua">3</span>
          </td>
          <td>
            总设备 |
            <span style="color: aqua">3</span>
          </td>
          <td>
            总设备 |
            <span style="color: aqua">3</span>
          </td>
        </tr>
      </table>
    </div>
    <div class="top_bg">联网单位信息</div>

    <div class="table_s">
      <table class="table_border">
        <tr style="width: 100%">
          <th>报警总数:</th>
          <td>0次</td>
          <th>单位地址:</th>
          <td>演示账号</td>
        </tr>
        <tr style="width: 100%">
          <th>烟感报警:</th>
          <td>0次</td>

          <th>消防第一责任人:</th>
          <td>柴（15315559860）</td>
        </tr>
        <tr style="width: 100%">
          <th>语音提醒发送:</th>
          <td>0次</td>
          <th>设备总数:</th>
          <td>0套 | 8套</td>
        </tr>
      </table>
    </div>
    <div class="top_bg">报警统计</div>
    <div class="tubiao">
      <a-row :gutter="24" style="height: 100%">
        <a-col :span="6" style="height: 100%">
          <div id="container001"></div>
        </a-col>
        <a-col :span="18" style="height: 100%">
          <div id="container002"></div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
import { Radar, Area } from '@antv/g2plot';

export default {
  data() {
    return {
      type: undefined,
      list: ['本周', '本月', '本季度', '本年'],
    };
  },
  created() {},
  mounted() {
    this.get001();
    this.get002();
  },

  methods: {
    init() {},
    get001() {
      const data = [
        { name: '消防用水', star: 10371 },
        { name: '电气火灾', star: 7380 },
        { name: '可燃气体', star: 7414 },
        { name: '烟感', star: 2140 },
      ];
      const radarPlot = new Radar('container001', {
        data: data.map(d => ({ ...d, star: Math.sqrt(d.star) })),
        xField: 'name',
        yField: 'star',
        appendPadding: [0, 10, 0, 10],
        meta: {
          star: {
            alias: 'star 数量',
            min: 0,
            nice: true,
            formatter: v => Number(v).toFixed(2),
          },
        },
        xAxis: {
          tickLine: null,
        },
        yAxis: {
          label: false,
          grid: {
            line: {
              type: 'line',
              style: {
                lineDash: null,
              },
            },
            alternateColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
        // 开启辅助点
        point: {
          size: 2,
        },
        area: {},
      });
      radarPlot.render();
    },
    get002() {
      var data = [
        {
          Date: '1',
          scales: 0.2,
        },
        {
          Date: '2',
          scales: 0.13,
        },
        {
          Date: '3',
          scales: 0.1,
        },
        {
          Date: '4',
          scales: 0.15,
        },
        {
          Date: '5',
          scales: 0.12,
        },
        {
          Date: '6',
          scales: 0.2,
        },
        {
          Date: '7',
          scales: 0.13,
        },
        {
          Date: '8',
          scales: 0.1,
        },
        {
          Date: '9',
          scales: 0.15,
        },
        {
          Date: '10',
          scales: 0.12,
        },
        {
          Date: '11',
          scales: 0.12,
        },
        {
          Date: '12',
          scales: 0.2,
        },
        {
          Date: '13',
          scales: 0.13,
        },
        {
          Date: '14',
          scales: 0.1,
        },
        {
          Date: '15',
          scales: 0.15,
        },
      ];
      const area = new Area('container002', {
        data,
        xField: 'Date',
        yField: 'scales',
        yAxis: {
          min: 0,
          max: 1,
        },
      });
      area.render();
    },
  },
};
</script>
<style scoped>
.info_rights {
  height: calc(100% - 40px);
  width: 100%;
  padding: 30px;
  background-image: url('./images/info_bg.png') !important;
  background-size: 100% 100%;
  margin: 20px auto;
  overflow-y: auto;
}
.info_rights::-webkit-scrollbar {
  width: 5px;
}
.info_rights::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(82, 82, 82, 0.1);
  background: rgba(214, 214, 214, 0.1);
}
.info_rights::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(61, 61, 61, 0.1);
  border-radius: 0;
  background: rgba(204, 204, 204, 0.1);
}

.titles {
  text-align: center;
  color: #4f819c;
  font-size: 20px;
  margin-top: 10%;
}

.search_action >>> .ant-select-arrow {
  color: #bde1f9;
}
.search_action >>> .ant-select-selection {
  background: #083c62 !important;
  border: 1px solid #175a88;
  box-shadow: 0px 1px 4px 0px #002038 inset;
}

.selectes >>> .ant-select-dropdown-menu-item {
  background: #083c62 !important;
  border: 1px solid #175a88;
  color: #67a0c7;
  box-shadow: 0px 1px 4px 0px #002038 inset;
}

.selectes >>> .ant-input {
  background: #083c62 !important;
  border: 1px solid #175a88;
  color: #67a0c7;
  box-shadow: 0px 1px 4px 0px #002038 inset;
}
</style>
<style lang="less">
.info_rights {
  .top_bg {
    height: 52px;
    background: #0f64a1;
    border: 1px solid #054e84;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    color: #eef9ff;
    line-height: 28px;
    letter-spacing: 1.25px;
    margin: 24px auto;
  }
  .search_action {
    display: flex;
    margin: 24px auto;
    .selectes {
      background: #083c62 !important;
      color: #ffffff;
      width: 100px;
      border: 1px solid #175a88;
      box-shadow: 0px 1px 4px 0px #002038 inset;
      font-size: 14px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      color: #67a0c7;
      line-height: 20px;
      letter-spacing: 0.88px;
    }
    .search_bgs {
      background-image: url('./images/search_bg.png') !important;
      background-size: 100% 100%;
      padding: 5px 10px;
      margin-left: 32px;
      img {
        width: 17px;
        height: 17px;
      }
    }
    .search_dcs {
      background-image: url('./images/search_dc_bg.png') !important;
      background-size: 100% 100%;
      padding: 5px 10px;
      margin-left: 12px;
      img {
        width: 17px;
        height: 17px;
      }
    }
  }
  .table_s {
    width: 100%;
    margin-top: 20px;
    .table_border {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      width: 100%;
      th {
        width: 20%;
        background: #07375a;
        font-size: 18px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        color: #eef9ff;
        line-height: 25px;
        letter-spacing: 1.13px;
        text-align: center;
        padding: 20px !important;
      }
      td {
        width: 30%;
        // background: #01192a;
        font-size: 16px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        color: #eef9ff;
        line-height: 22px;
        letter-spacing: 1px;
        padding: 20px !important;
        text-align: center;
      }

      tr,
      th,
      td {
        border: 1px solid #2f76ab;

        padding: 5px;
      }
    }
    .table_borders {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      width: 100%;
      th {
        width: 80px;
        background: #07375a;
        font-size: 18px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        color: #eef9ff;
        line-height: 25px;
        letter-spacing: 1.13px;
        text-align: center;
        padding: 20px !important;
        writing-mode: vertical-lr;
        letter-spacing: 10px;
      }
      td {
        width: calc(20% - 20px);
        // background: #01192a;
        font-size: 16px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        color: #eef9ff;
        line-height: 22px;
        letter-spacing: 1px;
        padding: 20px !important;
        text-align: center;
        img {
          width: 58px;
          height: 58px;
        }
      }
      tr,
      th,
      td {
        border: 1px solid #2f76ab;

        padding: 5px;
      }
    }
  }
  .tubiao {
    width: 100%;
    height: 400px;
    #container001 {
      height: 100%;
      width: 100%;
    }
    #container002 {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
