<template>
  <div id="main_cards">
    <a-row :gutter="24" style="height: 100%">
      <a-col :span="6" style="height: 100%">
        <div class="anquanzhishu">
          <img src="../../img/anquanzhishu.png" alt="" />
          <div>设备信息概况</div>
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
          <div>报警类别统计</div>
        </div>
        <div class="info_all">
          <div id="Area_infos"></div>
        </div>
      </a-col>
      <a-col :span="18" style="height: 100%; margin-top: 5px">
        <div class="info_right">
          <div class="search">
            <a-input class="search_input" placeholder="设备编号"></a-input>
            <a-input class="search_input" placeholder="安装地址"></a-input>
            <div class="search_button">
              <img src="./images/search.png" alt="" />
              搜索
            </div>
          </div>
          <div class="datasource">
            <div class="items" v-for="item in datasource" :key="item.name">
              <div style="display: flex; justify-content: center; align-items: center; width: 100%">
                <div>
                  <div style="width: 100%; text-align: center">
                    <img src="./images/lixian.png" alt="" v-if="item.stutas" style="width: 50px; height: 38px" />
                    <img src="./images/baojing.png" alt="" v-else style="width: 50px; height: 38px" />
                  </div>
                  <div class="shebei_xq">
                    <div>设备名称：{{ item.name }}</div>
                    <div>设备编号：{{ item.number }}</div>
                    <div>设备类型：{{ item.type }}</div>
                    <div>地址：{{ item.adress }}</div>
                  </div>
                  <div class="item_stutas">
                    <span v-if="!item.stutas">该设备报警请及时处理</span>
                  </div>
                  <div class="item_action">
                    <div>详情</div>
                    <div>报警记录</div>
                    <div>远程控制</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
    this.getArea_info();
  },
  methods: {
    // 获取折线图
    getArea_info() {
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
      const area = new Area('Area_infos', {
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
    #Area_infos {
      width: 100%;
      height: 100%;
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
    background-image: url('./images/info_bg.png');
    background-size: 100% 100%;

    .search {
      display: flex;
      margin-left: 15px;
      .search_button {
        width: 71px;
        height: 30px;
        margin-left: 24px;
        background-image: url('./images/anniu.png');
        background-size: 100% 100%;
        line-height: 30px;
        padding: 0 10px;
        cursor: pointer;
        img {
          width: 18px;
          height: 18px;
        }
      }
    }
    .search_input {
      width: 137px;
      height: 30px;
      margin-right: 8px;
      background: #083c62;
      border: 1px solid #175a88;
      box-shadow: 0px 1px 4px 0px #002038 inset;
      color: #fff;
    }
    .datasource {
      width: 100%;
      height: calc(100% - 54px);
      margin-top: 24px;
      overflow: auto;
      .items {
        width: calc(25% - 30px);
        display: inline-flex;
        padding: 18px;
        // opacity: 0.61;
        border: 0.5px solid #6cbfee;
        margin: 10px 15px;
        height: calc(45% - 24px);
        .shebei_xq {
          margin-top: 12px;
          font-size: 14px;
          font-family: PingFang SC, PingFang SC-Regular;
          font-weight: 400;
          text-align: left;
          color: #ffffff;
          div {
            line-height: 22px;
          }
        }
        .item_stutas {
          margin: 12px 0;
          height: 17px;
          font-family: PingFang SC, PingFang SC-Regular;
          font-weight: 400;
          text-align: left;
          color: #e5953c;
          line-height: 17px;
        }
        .item_action {
          display: flex;
          div {
            background-image: url('./images/actions.png');
            background-size: 100% 100%;
            padding: 3px 15px;
            margin: 0 5px;
            cursor: pointer;
          }
        }
      }
      .items:hover {
        filter: brightness(1.3);
      }
    }
  }
}
</style>
