<template>
  <div id="analysis">
    <a-row :gutter="24" style="height: 100%">
      <a-col :span="5" style="height: 100%">
        <div class="anquanzhishu">
          <img src="../img/anquanzhishu.png" alt="" />
          <div>设备信息概况</div>
        </div>
        <div class="info_all">
          <a-row :gutter="24" style="height: 100%">
            <a-col :span="8">
              <div class="info_items">
                <img class="info_items_img" src="./analys_img/01.png" alt="" />
                <div class="info_items_text">
                  设备总数:
                  <img src="./pages/images/info.png" alt="" />
                  <span>0</span>
                </div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="info_items">
                <img class="info_items_img" src="./analys_img/02.png" alt="" />
                <div class="info_items_text">
                  火焰识别:
                  <img src="./pages/images/info.png" alt="" />
                  <span>0</span>
                </div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="info_items">
                <img class="info_items_img" src="./analys_img/03.png" alt="" />
                <div class="info_items_text">
                  消控值班:
                  <img src="./pages/images/info.png" alt="" />
                  <span>0</span>
                </div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="info_items">
                <img class="info_items_img" src="./analys_img/04.png" alt="" />
                <div class="info_items_text">
                  消控通道:
                  <img src="./pages/images/info.png" alt="" />
                  <span>0</span>
                </div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="info_items">
                <img class="info_items_img" src="./analys_img/05.png" alt="" />
                <div class="info_items_text">
                  其他:
                  <img src="./pages/images/info.png" alt="" />
                  <span>0</span>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
        <div class="anquanzhishu" style="margin-top: 5px">
          <img src="../img/anquanzhishu.png" alt="" />
          <div>报警类别统计</div>
        </div>
        <div class="info_all">
          <a-row :gutter="24" style="height: 100%">
            <a-col :span="8">
              <div class="info_items">
                <img class="info_items_img" src="./analys_img/06.png" alt="" />
                <div class="info_items_text">
                  报警总数:
                  <img src="./pages/images/info.png" alt="" />
                  <span>0</span>
                </div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="info_items">
                <img class="info_items_img" src="./analys_img/02.png" alt="" />
                <div class="info_items_text">
                  火焰识别:
                  <img src="./pages/images/info.png" alt="" />
                  <span>0</span>
                </div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="info_items">
                <img class="info_items_img" src="./analys_img/07.png" alt="" />
                <div class="info_items_text">
                  脱岗睡岗:
                  <img src="./pages/images/info.png" alt="" />
                  <span>0</span>
                </div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="info_items">
                <img class="info_items_img" src="./analys_img/04.png" alt="" />
                <div class="info_items_text">
                  消控通道:
                  <img src="./pages/images/info.png" alt="" />
                  <span>0</span>
                </div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="info_items">
                <img class="info_items_img" src="./analys_img/05.png" alt="" />
                <div class="info_items_text">
                  其他:
                  <img src="./pages/images/info.png" alt="" />
                  <span>0</span>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-col>
      <a-col :span="14" style="height: 100%">
        <div class="anquanzhishus">
          <img src="../img/anquanzhishu.png" alt="" />
          <div>报警列表</div>
        </div>
        <div class="bigblocks">
          <div class="datasource">
            <div class="items" v-for="item in datasource" :key="item.name">
              <div style="display: flex; justify-content: center; align-items: center">
                <div>
                  <div style="width: 100%; text-align: center">
                    <img src="./analys_img/list_bg.png" alt="" style="width: 100%; height: 130px" />
                  </div>
                  <div class="shebei_xq">
                    <div>设备编号：{{ item.name }}</div>
                    <div>报警类型：{{ item.number }}</div>
                    <div>时间：{{ item.type }}</div>
                    <div>地址：{{ item.adress }}</div>
                  </div>
                  <div class="item_action">
                    <div>
                      <img src="./analys_img/080.png" alt="" />
                      监控
                    </div>
                    <div>
                      <img src="./analys_img/08.png" alt="" />
                      图片
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-col>
      <a-col :span="5" style="height: 100%">
        <div class="anquanzhishu">
          <img src="../img/anquanzhishu.png" alt="" />
          <div>报警类型分析</div>
        </div>
        <div class="info_alls">
          <div style="width: 100%">
            <div class="infoall_item">
              <img src="./analys_img/09.png" alt="" />
              <div class="infoall_item_block">
                <div>设备状态分布情况</div>
                <div class="title_color">
                  脱岗睡岗：
                  <span>0（0%）</span>
                </div>
              </div>
            </div>
            <div class="infoall_item">
              <img src="./analys_img/10.png" alt="" />
              <div class="infoall_item_block">
                <div>设备状态分布情况</div>
                <div class="title_color">
                  火焰识别：
                  <span>0（0%）</span>
                </div>
              </div>
            </div>
            <div class="infoall_item">
              <img src="./analys_img/11.png" alt="" />
              <div class="infoall_item_block">
                <div>设备状态分布情况</div>
                <div class="title_color">
                  消防通道占用：
                  <span>0（0%）</span>
                </div>
              </div>
            </div>
            <div class="infoall_item">
              <img src="./analys_img/12.png" alt="" />
              <div class="infoall_item_block">
                <div>设备状态分布情况</div>
                <div class="title_color">
                  其他报警：
                  <span>0（0%）</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="anquanzhishu" style="margin-top: 5px">
          <img src="../img/anquanzhishu.png" alt="" />
          <div>报警趋势</div>
        </div>
        <div class="info_all">
          <div id="Area_infoes"></div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { Area } from '@antv/g2plot';

export default {
  name: 'analysis',
  data() {
    return {
      datasource: [
        { name: '5M3612478i9GHION', number: '消防通道占用报警', type: '2023-04-12 11:57:33', adress: '展厅', stutas: false },
        { name: '5M3612478i8GHION', number: '消防通道占用报警', type: '2023-04-12 11:57:33', adress: '展厅', stutas: false },
        { name: '5M3612478i7GHION', number: '消防通道占用报警', type: '2023-04-12 11:57:33', adress: '展厅', stutas: false },
        { name: '5M3612478i6GHION', number: '消防通道占用报警', type: '2023-04-12 11:57:33', adress: '展厅', stutas: false },
      ],
    };
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
      const area = new Area('Area_infoes', {
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
  created() {},
  mounted() {
    this.getArea_info();
  },
};
</script>

<style lang="less">
#analysis {
  padding: 10px 40px;
  height: calc(100% - 30px);
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
      background-image: url('../img/baojinleibie.png');
      background-size: 100% 100%;
    }
  }
  .info_alls {
    background-image: url('../img/bigblock.png');
    background-size: 100% 100%;
    margin-top: 20px;
    padding: 20px 24px;
    height: calc(44% - 15px);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    .infoall_item {
      display: flex;
      margin: 20px auto;
      img {
        width: 52px;
        height: 52px;
        margin-right: 16px;
      }
      .infoall_item_block {
        width: calc(100% - 68px);
        padding: 6px;
        background-image: url('./analys_img/13.png');
        background-size: 100% 100%;
        div {
          font-size: 12px;
          font-family: PingFang SC, PingFang SC-Regular;
          font-weight: 400;
          color: #eef9ff;
          line-height: 17px;
          letter-spacing: 1px;
        }
        .title_color {
          font-size: 15px;
          font-family: PingFang SC, PingFang SC-Medium;
          font-weight: 500;
          color: #f5ab5a;
          line-height: 21px;
          letter-spacing: 1px;
        }
      }
    }
  }
  .info_all {
    background-image: url('../img/bigblock.png');
    background-size: 100% 100%;
    margin-top: 20px;
    padding: 20px;
    height: calc(44% - 15px);
    #Area_infoes {
      width: 100%;
      height: 100%;
    }
  }
  .info_items {
    text-align: center;
    margin: 20px 0;
    .info_items_img {
      width: 45px;
      height: 48px;
    }
    .info_items_text {
      height: 20px;
      font-size: 14px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      color: #ffffff;
      line-height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 12px auto;
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
  .anquanzhishus {
    display: flex;
    height: calc(6% - 5px);
    img {
      width: 30px;
      height: 52px;
      margin-left: -5px;
    }
    div {
      width: calc(50% - 25px);
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
      background-image: url('../img/baojinleibie.png');
      background-size: 100% 100%;
    }
  }
  .bigblocks {
    background-image: url('./analys_img/analys_bg.png');
    background-size: 100% 100%;
    margin-top: 20px;
    padding: 10px;
    height: calc(94% - 10px);
    #Area_info {
      width: 100%;
      height: 100%;
    }
    .datasource {
      width: 100%;
      height: calc(100% - 24px);
      margin-top: 12px;
      overflow: auto;
      .items {
        width: calc(33.33% - 30px);
        display: inline-flex;
        padding: 18px;
        // opacity: 0.61;
        border: 0.5px solid #6cbfee;
        margin: 10px 15px;
        height: calc(50% - 24px);
        .shebei_xq {
          margin-top: 12px;
          font-family: PingFang SC, PingFang SC-Regular;
          font-weight: 400;
          text-align: left;
          color: #ffffff;
          line-height: 22px;
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
          margin-top: 12px;
          div {
            background-image: url('./pages/images/actions.png');
            background-size: 100% 100%;
            padding: 3px 15px;
            margin: 0 5px;
            width: 130px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              width: 17px;
              height: 14px;
              margin-right: 8px;
            }
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
