<template>
  <div class="main_infos_all">
    <div class="title_dwyhtj">单位隐患统计</div>
    <div class="search_action_s">
      <a-date-picker @change="onChange" class="selectes_s" style="width: 140px" placeholder="请选择开始日期" />
      <span style="margin: auto 10px">到</span>
      <a-date-picker @change="onChange" class="selectes_s" style="width: 140px" placeholder="请选择结束日期" />
      <div class="search_bgs">
        <img src="./images/search.png" alt="" />
        查询
      </div>
    </div>
    <div class="tubiao_others">
      <div id="mainter_zhexian" class="mainter_zhexian"></div>
      <div class="mainter_biaoge">
        <table class="table_borders">
          <tr style="width: 100%">
            <td>时间</td>
            <td>隐患数</td>
            <td>时间</td>
            <td>隐患数</td>
            <td>时间</td>
            <td>隐患数</td>
          </tr>
          <tr style="width: 100%">
            <td>2023-01</td>
            <td>0</td>
            <td>2023-02</td>
            <td>0</td>
            <td>2023-03</td>
            <td>0</td>
          </tr>
          <tr style="width: 100%">
            <td>2023-01</td>
            <td>0</td>
            <td>2023-02</td>
            <td>0</td>
            <td>2023-03</td>
            <td>0</td>
          </tr>
          <tr style="width: 100%">
            <td>2023-01</td>
            <td>0</td>
            <td>2023-02</td>
            <td>0</td>
            <td>2023-03</td>
            <td>0</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import { Area } from '@antv/g2plot';
export default {
  data() {
    return {};
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    onChange() {},
    init() {
      var data = [
        {
          Date: '1',
          scales: 0.15,
        },
        {
          Date: '2',
          scales: 0.05,
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
          scales: 0.19,
        },
        {
          Date: '6',
          scales: 0.15,
        },
        {
          Date: '7',
          scales: 0.05,
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
          scales: 0.19,
        },
        {
          Date: '11',
          scales: 0.15,
        },
        {
          Date: '12',
          scales: 0.05,
        },
        {
          Date: '13',
          scales: 0.1,
        },
        {
          Date: '14',
          scales: 0.15,
        },
        {
          Date: '15',
          scales: 0.25,
        },
      ];
      const areas = new Area('mainter_zhexian', {
        data: data,
        xField: 'Date',
        yField: 'scales',
        areaStyle: {
          fill: '#1890FF',
        },
        line: {
          color: '#1890FF',
        },
        yAxis: {
          min: 0,
          max: 1,
        },
      });
      areas.render();
    },
  },
};
</script>
<style scoped>
.selectes_s >>> .ant-input {
  background: #083c62 !important;
  border: 1px solid #175a88;
  color: #67a0c7;
  box-shadow: 0px 1px 4px 0px #002038 inset;
}
</style>
<style lang="less">
.main_infos_all {
  height: calc(100% - 40px);
  width: 100%;
  padding: 30px;
  background-image: url('./images/info_bg.png') !important;
  background-size: 100% 100%;
  margin: 20px auto;
  .title_dwyhtj {
    width: 100%;
    text-align: center;
    font-size: 24px;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    color: #eef9ff;
    line-height: 33px;
    height: 33px;
    letter-spacing: 1.5px;
  }
  .search_action_s {
    display: flex;
    margin: 24px auto;
    height: 34px;
    .selectes_s {
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
  }
  .tubiao_others {
    height: calc(100% - 115px);
    width: 100%;
    .mainter_zhexian {
      width: 100%;
      height: 50%;
      padding: 10px 0;
    }
    .mainter_biaoge {
      width: 100%;
      height: 50%;
      padding: 20px 0 10px;
      .table_borders {
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
        width: 100%;

        td {
          width: 16.66%;
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
    }
  }
}
</style>
