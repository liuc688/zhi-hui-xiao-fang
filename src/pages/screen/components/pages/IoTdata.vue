<template>
  <div id="main_cards">
    <a-row :gutter="24" style="height: 100%">
      <a-col :span="6" style="height: 100%">
        <div class="anquanzhishu">
          <img src="../../img/anquanzhishu.png" alt="" />
          <div>实时安全指数</div>
        </div>
        <div class="info_all">
          <div class="bigblock">
            <div class="info_items">
              <img class="info_items_img" src="./images/info_1.png" alt="" />
              <div class="info_items_text">
                设备总数:
                <img src="./images/info.png" alt="" />
                <span>0</span>
              </div>
            </div>
            <div class="info_items">
              <img class="info_items_img" src="./images/info_2.png" alt="" />
              <div class="info_items_text">
                报警数量:
                <img src="./images/info.png" alt="" />
                <span>0</span>
              </div>
            </div>
            <div class="info_items">
              <img class="info_items_img" src="./images/info_3.png" alt="" />
              <div class="info_items_text">
                正常数量:
                <img src="./images/info.png" alt="" />
                <span>0</span>
              </div>
            </div>
            <div class="info_items">
              <img class="info_items_img" src="./images/info_4.png" alt="" />
              <div class="info_items_text">
                离线数量:
                <img src="./images/info.png" alt="" />
                <span>0</span>
              </div>
            </div>
          </div>
        </div>
        <div class="anquanzhishu" style="margin-top: 5px">
          <img src="../../img/anquanzhishu.png" alt="" />
          <div>实时安全指数</div>
        </div>
        <div class="info_all">
          <div class="info_items">
            <img class="info_items_img" src="./images/zhishu_s.png" alt="" />
            <div class="info_items_text">
              <div style="font-size: 16px">报警总数:</div>
              <div>
                <img src="./images/info_dsj.png" alt="" />
              </div>
              <div style="color: #e5953c; font-size: 24px">0</div>
              <div class="lines"></div>
            </div>
          </div>
        </div>
      </a-col>
      <a-col :span="18" style="height: 100%">
        <a-row :gutter="12" style="height: 100%">
          <a-col :span="6" style="height: 100%">
            <div class="anquanzhishu">
              <img src="../../img/anquanzhishu.png" alt="" />
              <div>用电信息</div>
            </div>
            <div class="info_all">
              <div>
                <div class="sbzs">
                  <div>设备总数</div>
                  <div class="sbzs_num">0</div>
                  <div class="sbzs_num">0</div>
                  <div class="sbzs_num">3</div>
                </div>
                <div class="jbs">
                  <div class="jbs_item">
                    <div class="jbs_num">0</div>
                    <img src="./images/info_dsj.png" alt="" style="width: 8px; height: 6px; margin: 20px auto 5px" />
                    <div>报警数</div>
                  </div>
                  <div class="jbs_item">
                    <div class="jbs_num">0</div>
                    <img src="./images/info_dsj.png" alt="" style="width: 8px; height: 6px; margin: 20px auto 5px" />
                    <div>正常数</div>
                  </div>
                  <div class="jbs_item">
                    <div class="jbs_num">0</div>
                    <img src="./images/info_dsj.png" alt="" style="width: 8px; height: 6px; margin: 20px auto 5px" />
                    <div>离线数</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="anquanzhishu" style="margin-top: 5px">
              <img src="../../img/anquanzhishu.png" alt="" />
              <div>用电趋势</div>
            </div>
            <div class="info_all">
              <div id="containers1"></div>
            </div>
          </a-col>
          <a-col :span="6" style="height: 100%">
            <div class="anquanzhishu">
              <img src="../../img/anquanzhishu.png" alt="" />
              <div>用水信息</div>
            </div>
            <div class="info_all">
              <div>
                <div class="sbzs">
                  <div>设备总数</div>
                  <div class="sbzs_num">0</div>
                  <div class="sbzs_num">0</div>
                  <div class="sbzs_num">3</div>
                </div>
                <div class="jbs">
                  <div class="jbs_item">
                    <div class="jbs_num numb1">0</div>
                    <img src="./images/dsj_ys.png" alt="" style="width: 8px; height: 6px; margin: 20px auto 5px" />
                    <div>报警数</div>
                  </div>
                  <div class="jbs_item">
                    <div class="jbs_num numb1">0</div>
                    <img src="./images/dsj_ys.png" alt="" style="width: 8px; height: 6px; margin: 20px auto 5px" />
                    <div>正常数</div>
                  </div>
                  <div class="jbs_item">
                    <div class="jbs_num numb1">0</div>
                    <img src="./images/dsj_ys.png" alt="" style="width: 8px; height: 6px; margin: 20px auto 5px" />
                    <div>离线数</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="anquanzhishu" style="margin-top: 5px">
              <img src="../../img/anquanzhishu.png" alt="" />
              <div>用水趋势</div>
            </div>
            <div class="info_all">
              <div id="containers2"></div>
            </div>
          </a-col>
          <a-col :span="6" style="height: 100%">
            <div class="anquanzhishu">
              <img src="../../img/anquanzhishu.png" alt="" />
              <div>烟感信息</div>
            </div>
            <div class="info_all">
              <div>
                <div class="sbzs">
                  <div>设备总数</div>
                  <div class="sbzs_num">0</div>
                  <div class="sbzs_num">0</div>
                  <div class="sbzs_num">3</div>
                </div>
                <div class="jbs">
                  <div class="jbs_item">
                    <div class="jbs_num numb2">0</div>
                    <img src="./images/dsj_yg.png" alt="" style="width: 8px; height: 6px; margin: 20px auto 5px" />
                    <div>报警数</div>
                  </div>
                  <div class="jbs_item">
                    <div class="jbs_num numb2">0</div>
                    <img src="./images/dsj_yg.png" alt="" style="width: 8px; height: 6px; margin: 20px auto 5px" />
                    <div>正常数</div>
                  </div>
                  <div class="jbs_item">
                    <div class="jbs_num numb2">0</div>
                    <img src="./images/dsj_yg.png" alt="" style="width: 8px; height: 6px; margin: 20px auto 5px" />
                    <div>离线数</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="anquanzhishu" style="margin-top: 5px">
              <img src="../../img/anquanzhishu.png" alt="" />
              <div>烟感趋势</div>
            </div>
            <div class="info_all">
              <div id="containers3"></div>
            </div>
          </a-col>
          <a-col :span="6" style="height: 100%">
            <div class="anquanzhishu">
              <img src="../../img/anquanzhishu.png" alt="" />
              <div>其他信息</div>
            </div>
            <div class="info_all">
              <div>
                <div class="sbzs">
                  <div>设备总数</div>
                  <div class="sbzs_num">0</div>
                  <div class="sbzs_num">0</div>
                  <div class="sbzs_num">3</div>
                </div>
                <div class="jbs">
                  <div class="jbs_item">
                    <div class="jbs_num numb3">0</div>
                    <img src="./images/dsj_qt.png" alt="" style="width: 8px; height: 6px; margin: 20px auto 5px" />
                    <div>报警数</div>
                  </div>
                  <div class="jbs_item">
                    <div class="jbs_num numb3">0</div>
                    <img src="./images/dsj_qt.png" alt="" style="width: 8px; height: 6px; margin: 20px auto 5px" />
                    <div>正常数</div>
                  </div>
                  <div class="jbs_item">
                    <div class="jbs_num numb3">0</div>
                    <img src="./images/dsj_qt.png" alt="" style="width: 8px; height: 6px; margin: 20px auto 5px" />
                    <div>离线数</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="anquanzhishu" style="margin-top: 5px">
              <img src="../../img/anquanzhishu.png" alt="" />
              <div>其他趋势</div>
            </div>
            <div class="info_all">
              <div id="containers4"></div>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { Area } from '@antv/g2plot';
export default {
  name: 'Cards',
  data() {
    return {
      datasource: [
        { name: '11233311198650', number: '11233875111908', type: '电气火灾监控探测器', adress: '展厅', stutas: false },
        { name: '11233311198651', number: '11233875111907', type: '电气火灾监控探测器1', adress: '展厅4', stutas: true },
        { name: '11233311198652', number: '11233875111906', type: '电气火灾监控探测器2', adress: '展厅3', stutas: true },
        { name: '11233311198653', number: '11233875111905', type: '电气火灾监控探测器3', adress: '展厅2', stutas: true },
        { name: '11233311198654', number: '11233875111904', type: '电气火灾监控探测器4', adress: '展厅1', stutas: true },
      ],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.areas1();
      this.areas2();
      this.areas3();
      this.areas4();
    },
    areas1() {
      var data = [
        {
          Date: '2023-01',
          scales: 2,
        },
        {
          Date: '2023-02',
          scales: 3,
        },
        {
          Date: '2023-03',
          scales: 1,
        },
        {
          Date: '2023-04',
          scales: 2,
        },
        {
          Date: '2023-05',
          scales: 4,
        },
      ];
      const area = new Area('containers1', {
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
          max: 20,
        },
      });
      area.render();
    },
    areas2() {
      var data = [
        {
          Date: '2023-01',
          scales: 2,
        },
        {
          Date: '2023-02',
          scales: 3,
        },
        {
          Date: '2023-03',
          scales: 1,
        },
        {
          Date: '2023-04',
          scales: 2,
        },
        {
          Date: '2023-05',
          scales: 4,
        },
      ];
      const area = new Area('containers2', {
        data: data,
        xField: 'Date',
        yField: 'scales',
        areaStyle: {
          fill: '#1BAD98',
        },
        line: {
          color: '#1BAD98',
        },
        yAxis: {
          min: 0,
          max: 20,
        },
      });
      area.render();
    },
    areas3() {
      var data = [
        {
          Date: '2023-01',
          scales: 2,
        },
        {
          Date: '2023-02',
          scales: 3,
        },
        {
          Date: '2023-03',
          scales: 1,
        },
        {
          Date: '2023-04',
          scales: 2,
        },
        {
          Date: '2023-05',
          scales: 4,
        },
      ];
      const area = new Area('containers3', {
        data: data,
        xField: 'Date',
        yField: 'scales',
        areaStyle: {
          fill: '#E6AE5A',
        },
        line: {
          color: '#E6AE5A',
        },
        yAxis: {
          min: 0,
          max: 20,
        },
      });
      area.render();
    },
    areas4() {
      var data = [
        {
          Date: '2023-01',
          scales: 2,
        },
        {
          Date: '2023-02',
          scales: 3,
        },
        {
          Date: '2023-03',
          scales: 1,
        },
        {
          Date: '2023-04',
          scales: 2,
        },
        {
          Date: '2023-05',
          scales: 4,
        },
      ];
      const area = new Area('containers4', {
        data: data,
        xField: 'Date',
        yField: 'scales',
        areaStyle: {
          fill: '#C71D14',
        },
        line: {
          color: '#C71D14',
        },
        yAxis: {
          min: 0,
          max: 20,
        },
      });
      area.render();
    },
  },
};
</script>

<style lang="less">
#main_cards {
  height: calc(100% - 30px);
  width: 100%;
  padding: 30px 0 0;
  .anquanzhishu {
    display: flex;
    height: calc(6% - 5px);
    img {
      width: 30px;
      height: 52px;
      margin-left: -5px;
    }
    div {
      width: calc(100% - 25px);
      height: 40px;
      font-size: 16px;
      font-family: PingFang SC, PingFang SC-Medium;
      font-weight: 500;
      text-align: left;
      color: #ffffff;
      line-height: 40px;
      letter-spacing: 1px;
      padding-left: 20px;
      margin: 5px 0;
      background-image: url('../../img/baojinleibie.png');
      background-size: 100% 100%;
    }
  }
  .info_all {
    background-image: url('../../img/bigblock.png');
    background-size: 100% 100%;
    margin-top: 20px;
    padding: 20px;
    height: calc(44% - 15px);
    display: flex;
    justify-content: center;
    align-items: center;
    .info_items {
      width: calc(50% - 10px);
      display: inline-block;
      text-align: center;
      margin: 10px 0;
      .info_items_img {
        width: 67px;
        height: 72px;
      }
      .info_items_text {
        font-size: 14px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        text-align: center;
        color: #ffffff;
        line-height: 30px;
        width: 100%;
        img {
          width: 6px;
          height: 8px;
          margin: 0 5px;
        }
        span {
          font-size: 24px;
          font-family: DIN Alternate, DIN Alternate-Bold;
          font-weight: 700;
          text-align: left;
          color: #e5953c;
          line-height: 28px;
        }
        .lines {
          width: 100px;
          margin: auto;
          height: 0.6px;
          border: 0.6px solid;
          margin-top: 6px;
          border-image: linear-gradient(40deg, #022238 15%, #8bd9f5 50%, #02243b 85%) 0.5 0.2;
        }
      }
    }
    #containers1 {
      width: 100%;
      height: 100%;
    }
    #containers2 {
      width: 100%;
      height: 100%;
    }
    #containers3 {
      width: 100%;
      height: 100%;
    }
    #containers4 {
      width: 100%;
      height: 100%;
    }
    .sbzs {
      display: flex;
      font-size: 16px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      text-align: left;
      color: #ffffff;
      line-height: 22px;
      letter-spacing: 1px;
      display: flex;
      justify-content: center;
      align-items: center;
      .sbzs_num {
        font-size: 22px;
        font-family: DIN Alternate, DIN Alternate-Bold;
        font-weight: 700;
        color: #eef9ff;
        line-height: 26px;
        background-image: url('./images/quejiao.png');
        background-size: 100% 100%;
        padding: 4px 11px;
        margin-left: 11px;
      }
    }
    .jbs {
      font-size: 15px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      color: #ffffff;
      line-height: 21px;
      letter-spacing: 0.94px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 50px;
      .jbs_item {
        text-align: center;
        margin: 0 10px;
        font-size: 16px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        color: #ffffff;
        line-height: 22px;
        letter-spacing: 1px;
        .jbs_num {
          font-size: 28px;
          font-family: DIN Alternate, DIN Alternate-Bold;
          font-weight: 700;
          color: #eef9ff;
          line-height: 32px;
          padding: 20px 28px;
          background-image: url('./images/num1.png');
          background-size: 100% 100%;
        }
        .numb1 {
          background-image: url('./images/num2.png');
          background-size: 100% 100%;
        }
        .numb2 {
          background-image: url('./images/num3.png');
          background-size: 100% 100%;
        }
        .numb3 {
          background-image: url('./images/num4.png');
          background-size: 100% 100%;
        }
      }
    }
  }

  .bigblock {
    // width: 80%;
    // height: 80%;
    // margin: auto;
    padding: 0 50px;
    .info_items {
      width: calc(50% - 10px);
      display: inline-block;
      text-align: center;
      margin: 10px 0;
      .info_items_img {
        width: 67px;
        height: 72px;
      }
      .info_items_text {
        font-size: 14px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        text-align: center;
        color: #ffffff;
        line-height: 30px;
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
        img {
          width: 6px;
          height: 8px;
          margin: 0 5px;
        }
        span {
          font-size: 24px;
          font-family: DIN Alternate, DIN Alternate-Bold;
          font-weight: 700;
          text-align: left;
          color: #e5953c;
          line-height: 28px;
        }
      }
    }
  }
  .info_right {
    width: 100%;
    height: 100%;
    padding: 12px;
    // background-image: url('./images/info_bg.png');
    // background-size: 100% 100%;
  }
}
</style>
