<template>
  <div class="workAnalysis_page">
    <div class="workAnalysis_page_content">
      <a-row style="height: 24%">
        <a-col :span="24" style="height: 100%">
          <!-- <img src="../pages/images/workAnalysis_page.png" class="circular" /> -->
          <div class="circular">
            <span class="circular_words">
              <span style="display: flex; font-size: 50px; position: relative; left: 28px">2</span>
              <span style="font-size: 16px">未整改隐患</span>
            </span>
          </div>
          <div class="circular">
            <span class="circular_words">
              <span style="display: flex; font-size: 50px; position: relative; left: 28px">4</span>
              <span style="font-size: 16px; position: relative; left: 18px">巡查点</span>
            </span>
          </div>
        </a-col>
      </a-row>
      <a-row style="height: 38%; margin-bottom: 20px">
        <a-col :span="4" style="height: 100%">
          <div class="left">
            <div class="left_top">每日防火检查</div>
            <div class="left_bottom">
              <div id="left_bottom_tu"></div>
              <div id="left_bottom_list">
                <ul type="none">
                  <li class="list_item">昨日巡查：0</li>
                  <li class="list_item">上月同日：0</li>
                  <li class="list_item">环比：0</li>
                  <li class="list_item">同比：0</li>
                </ul>
              </div>
            </div>
          </div>
        </a-col>
        <a-col :span="20" style="height: 100%">
          <div class="right">
            <div class="right_top">每日防火检查情况分析</div>
            <div class="right_bottom">
              <div id="right_bottom_tu"></div>
            </div>
          </div>
        </a-col>
      </a-row>
      <a-row style="height: 38%">
        <a-col :span="4" style="height: 100%">
          <div class="left">
            <div class="left_top">每月防火检查</div>
            <div class="left_bottom">
              <div id="left_bottom_tu2"></div>
              <div id="left_bottom_list">
                <ul type="none">
                  <li class="list_item">昨日巡查：0</li>
                  <li class="list_item">上月同日：0</li>
                  <li class="list_item">环比：0</li>
                  <li class="list_item">同比：0</li>
                </ul>
              </div>
            </div>
          </div>
        </a-col>
        <a-col :span="20" style="height: 100%">
          <div class="right">
            <div class="right_top">每月防火检查情况分析</div>
            <div class="right_bottom">
              <div id="right_bottom_tu2"></div>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
import { Pie, Area } from '@antv/g2plot';

export default {
  data() {
    return {};
  },
  methods: {
    getPie() {
      const data = [
        { type: '未检查', value: 23 },
        { type: '已检查', value: 77 },
      ];

      const piePlot = new Pie('left_bottom_tu', {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        innerRadius: 0.6,
        legend: {
          position: 'top',
          offsetX: 20,
          style: {
            fontSize: 16,
          },
        },
        label: {
          type: 'inner',
          offset: '-50%',
          content: '{value}',
          style: {
            textAlign: 'center',
            fontSize: 0,
          },
        },
        interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
        statistic: {
          title: false,
          content: {
            style: {
              whiteSpace: 'pre-wrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
            // content: 'AntV\nG2Plot',
          },
        },
      });
      piePlot.render();
    },
    getLine() {
      var data = [
        {
          Date: '1',
          scales: 0.5,
        },
        {
          Date: '2',
          scales: 0.3,
        },
        {
          Date: '3',
          scales: 0.1,
        },
        {
          Date: '4',
          scales: 0.4,
        },
        {
          Date: '5',
          scales: 0.5,
        },
        {
          Date: '6',
          scales: 0.7,
        },
        {
          Date: '7',
          scales: 0.6,
        },
        {
          Date: '8',
          scales: 0.5,
        },
        {
          Date: '9',
          scales: 0.7,
        },
        {
          Date: '10',
          scales: 0.6,
        },
      ];
      const area = new Area('right_bottom_tu', {
        data: data,
        xField: 'Date',
        yField: 'scales',
        xAxis: {
          range: [0, 1],
          tickCount: 5,
        },
        areaStyle: () => {
          return {
            fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
          };
        },
      });
      area.render();
    },

    getPie2() {
      const data = [
        { type: '未检查', value: 23 },
        { type: '已检查', value: 77 },
      ];

      const piePlot = new Pie('left_bottom_tu2', {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        innerRadius: 0.6,
        legend: {
          position: 'top',
          offsetX: 20,
          style: {
            fontSize: 16,
          },
        },
        label: {
          type: 'inner',
          offset: '-50%',
          content: '{value}',
          style: {
            textAlign: 'center',
            fontSize: 0,
          },
        },
        interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
        statistic: {
          title: false,
          content: {
            style: {
              whiteSpace: 'pre-wrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
            // content: 'AntV\nG2Plot',
          },
        },
      });
      piePlot.render();
    },
    getLine2() {
      var data = [
        {
          Date: '1',
          scales: 0.5,
        },
        {
          Date: '2',
          scales: 0.3,
        },
        {
          Date: '3',
          scales: 0.1,
        },
        {
          Date: '4',
          scales: 0.4,
        },
        {
          Date: '5',
          scales: 0.5,
        },
        {
          Date: '6',
          scales: 0.7,
        },
        {
          Date: '7',
          scales: 0.6,
        },
        {
          Date: '8',
          scales: 0.5,
        },
        {
          Date: '9',
          scales: 0.7,
        },
        {
          Date: '10',
          scales: 0.6,
        },
      ];
      const area = new Area('right_bottom_tu2', {
        data: data,
        xField: 'Date',
        yField: 'scales',
        xAxis: {
          range: [0, 1],
          tickCount: 5,
        },
        areaStyle: () => {
          return {
            fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
          };
        },
      });
      area.render();
    },
  },
  mounted() {
    this.getPie();
    this.getLine();

    this.getPie2();
    this.getLine2();
  },
};
</script>
<style lang="less">
#left_bottom_tu2 {
  height: 100%;
  width: 60%;
  display: inline-block;
  float: left;
}

#right_bottom_tu2 {
  height: 100%;
  width: 100%;
  padding: 30px 20px 10px 20px;
}

.workAnalysis_page {
  width: 100%;
  height: 100%;
  padding-bottom: 40px;

  .workAnalysis_page_content {
    height: 100%;
    margin: 20px 0;
    background-color: rgb(2, 35, 58) !important;
    padding: 20px;

    .circular {
      height: 125px;
      width: 7%;
      background-image: url('../pages/images/workAnalysis_page.png');
      display: inline-block;
      margin-left: 28%;
      position: relative;
      top: 5%;

      .circular_words {
        position: relative;
        left: 24px;
        top: 2px;
      }
    }

    .left {
      width: 100%;
      height: 100%;

      .left_top {
        height: 37px;
        width: 100%;
        background-color: rgb(7, 55, 90);
        margin-bottom: 5px;
        color: rgb(238, 249, 255);
        font-size: 16px;
        text-align: center;
        line-height: 37px;
      }

      .left_bottom {
        height: 83%;
        width: 100%;
        background-color: rgb(7, 55, 90);

        #left_bottom_tu {
          height: 100%;
          width: 60%;
          display: inline-block;
          float: left;
        }

        #left_bottom_list {
          height: 100%;
          width: 40%;
          display: inline-block;
          top: 60px;
          position: relative;
          left: -20px;

          .list_item {
            margin: 5px 0;
          }
        }
      }
    }

    .right {
      height: 100%;
      margin-left: 20px;

      .right_top {
        height: 37px;
        width: 100%;
        background-color: rgb(7, 55, 90);
        margin-bottom: 2px;
        color: rgb(238, 249, 255);
        font-size: 16px;
        text-align: center;
        line-height: 37px;
      }

      .right_bottom {
        height: 84%;
        width: 100%;
        border: 1px solid rgb(67, 121, 169);

        #right_bottom_tu {
          height: 100%;
          width: 100%;
          padding: 30px 20px 10px 20px;
        }
      }
    }
  }
}
</style>
<style scoped>
#left_bottom_tu >>> .g2-html-annotation {
  font-size: 0 !important;
}
</style>
