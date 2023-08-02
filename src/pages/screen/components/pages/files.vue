<template>
  <div class="info_rights">
    <a-row style="height: 100%">
      <a-col :span="4" style="height: 100%; border-right: 1px dashed #15527b">
        <div class="left_channel">
          <div :class="index == select ? 'selects channel_item' : 'channel_item'" v-for="(items, index) in channel" :key="index" @click="selectchannel(index)">{{ items }}</div>
        </div>
      </a-col>
      <a-col :span="20" style="height: 100%">
        <div class="right_channel">
          <div class="right_channel_title">演示账号</div>
          <div class="right_channel_content">
            {{ content }}
          </div>
          <div class="right_channel_block">
            <div style="width: 100%">
              <a-row :gutter="24">
                <a-col :span="4">
                  <div class="right_channel_block_item">基本信息</div>
                </a-col>
                <a-col :span="4">
                  <div class="right_channel_block_item bg1">
                    消防平面图
                    <span>(0)</span>
                  </div>
                </a-col>
                <a-col :span="4">
                  <div class="right_channel_block_item bg2">
                    消防预案
                    <span>(0)</span>
                  </div>
                </a-col>
                <a-col :span="4">
                  <div class="right_channel_block_item">
                    规章制度
                    <span>(0)</span>
                  </div>
                </a-col>
                <a-col :span="4">
                  <div class="right_channel_block_item bg1">
                    消防平面图
                    <span>(0)</span>
                  </div>
                </a-col>
                <a-col :span="4">
                  <div class="right_channel_block_item bg2">
                    合法性文件
                    <span>(0)</span>
                  </div>
                </a-col>
              </a-row>
            </div>
          </div>
          <!-- 列表 -->
          <a-row :gutter="24" style="height: calc(60% - 40px)">
            <a-col :span="8" style="height: 100%">
              <div class="anquanzhishues" style="margin-top: 5px">
                <img src="../../img/anquanzhishu.png" alt="" />
                <div>安全巡检</div>
              </div>
              <div class="info_all">
                <a-row :gutter="24">
                  <a-col :span="12">
                    <div class="anquanxunjian_s">
                      重点部位
                      <span>0(0%)</span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="anquanxunjian_s">
                      检查计划
                      <span>0(0%)</span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="anquanxunjian_s">微型消防站</div>
                  </a-col>
                  <a-col :span="12">
                    <div class="anquanxunjian_s">隐患记录</div>
                  </a-col>
                  <a-col :span="24">
                    <div class="anquanxunjian_s">隐患记录</div>
                  </a-col>
                </a-row>
              </div>
            </a-col>
            <a-col :span="8" style="height: 100%">
              <div class="anquanzhishues" style="margin-top: 5px">
                <img src="../../img/anquanzhishu.png" alt="" />
                <div>单位评估</div>
              </div>
              <div class="info_all">
                <div style="height: 100%">
                  <div id="Area_infoe_s"></div>
                  <div class="pinggu">
                    <div>单位评估成绩为：52，等级为：D 评估时间：2023-07-17 09:34:17</div>
                    <div class="pinggu_anniu">重新评估</div>
                  </div>
                </div>
              </div>
            </a-col>
            <a-col :span="8" style="height: 100%">
              <div class="anquanzhishues" style="margin-top: 5px">
                <img src="../../img/anquanzhishu.png" alt="" />
                <div>物联网设备</div>
              </div>
              <div class="info_all">
                <a-row :gutter="24">
                  <a-col :span="12">
                    <div class="anquanxunjian_s">智慧用电监测</div>
                  </a-col>
                  <a-col :span="12">
                    <div class="anquanxunjian_s">消防用水监测</div>
                  </a-col>
                  <a-col :span="12">
                    <div class="anquanxunjian_s">独立烟感预警</div>
                  </a-col>
                  <a-col :span="12">
                    <div class="anquanxunjian_s">可燃气体预警</div>
                  </a-col>
                  <a-col :span="12">
                    <div class="anquanxunjian_s">消防可视化监测</div>
                  </a-col>
                  <a-col :span="12">
                    <div class="anquanxunjian_s">自动联网报警</div>
                  </a-col>
                </a-row>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { Pie } from '@antv/g2plot';
export default {
  name: 'Cards',
  data() {
    return {
      channel: ['企业概览', '企业单位档案', '巡检点维护', '单位平面图', '消防合法文书', '消防预案和演练', '消防培训', '规章制度', '微型消防站', '值班人员'],
      select: 0,
      content:
        '行政区划：山东省,济南市,高新区，详细位置：高新区新泺大街铭盛大厦，消防等级：消防安全一般单位，高危单位：否，单位性质：企业，所属行业：信息传输、计算机服务和软件，单位类别：高层公共建筑、地下铁道、地下观光隧道、粮、棉、木材、百货等物资仓库和堆场、重点工程的施工现场,高层公共建筑,写字楼（办公楼），消防第一责任人：柴（15315559860），消防安全责任人：-，消防安全管理人：-，',
    };
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const data = [
        { type: '扣分', value: 48 },
        { type: '分數', value: 52 },
      ];

      const piePlot = new Pie('Area_infoe_s', {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.9,
        legend: false,
        label: {
          type: 'spider',
          labelHeight: 28,
          content: '{name}',
          style: {
            fill: '#8C8C8C',
          },
        },
        interactions: [{ type: 'element-active' }],
      });

      piePlot.render();
    },
    selectchannel(value) {
      console.log('value', value);
      this.select = value;
    },
  },
};
</script>
<style lang="less">
.anquanzhishues {
  display: flex;
  height: calc(15% - 5px);
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
  width: 100%;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  height: calc(85% - 20px);
  #Area_infoe_s {
    width: 100%;
    height: 60%;
  }
  .pinggu {
    height: 40%;
    width: 50%;
    margin: auto;
    font-size: 14px;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    color: #ffffff;
    line-height: 22px;
    text-align: center;
    .pinggu_anniu {
      width: 156px;
      height: 36px;
      margin: 20px auto;
      background: #0c519a;
      border: 1px solid;
      line-height: 36px;
      border-image: linear-gradient(266deg, #587d98 3%, #82b6d2 70%, #4f819c 97%) 1 1;
    }
  }
  .anquanxunjian_s {
    background: #094571;
    border: 1px solid;
    border-image: linear-gradient(266deg, #587d98 3%, #82b6d2 70%, #4f819c 97%) 1 1;
    padding: 10px 0;
    text-align: center;
    margin-bottom: 12px;
  }
}
.right_channel_block {
  margin: 24px auto;
  height: calc(20% - 48px);
  display: flex;
  justify-content: center;
  align-items: center;
  .right_channel_block_item {
    background: linear-gradient(180deg, #01628c, #0092b6 98%);
    border: 1px solid;
    border-image: linear-gradient(223deg, #0f85b2 2%, #6fc8da 78%, #0aaac4 98%) 1 1;
    font-size: 18px;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 500;
    color: #eef9ff;
    line-height: 25px;
    letter-spacing: 1.13px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .bg1 {
    background: linear-gradient(0deg, #1c6ac8, #00398a);
    border: 1px solid;
    border-image: linear-gradient(217deg, #2e74d9 11%, #80b9ff 91%) 1 1;
  }
  .bg2 {
    opacity: 0.86;
    background: linear-gradient(0deg, #11aba8, #038480);
    border: 1px solid;
    border-image: linear-gradient(224deg, #ef9f38, #ffebd1 72%, #fbb151 97%) 1 1;
  }
}
</style>
<style scoped>
.info_rights {
  height: calc(100% - 40px);
  width: 100%;
  padding: 30px;
  background-image: url('./images/info_bg.png') !important;
  background-size: 100% 100%;
  margin: 20px auto;
}
.left_channel {
  width: 100%;
  height: 100%;
  padding-right: 30px;
}
.channel_item {
  padding: 5px 15px;
  font-size: 16px;
  font-family: PingFang SC, PingFang SC-Regular;
  font-weight: 400;
  color: #eef9ff;
  line-height: 33px;
  letter-spacing: 1px;
  cursor: pointer;
  margin-bottom: 12px;
}
.selects {
  background-image: url('./images/files_channel.png') !important;
  background-size: 100% 100%;
}
.right_channel {
  width: 100%;
  height: 100%;
  padding-left: 30px;
}
.right_channel_title {
  font-size: 16px;
  font-family: PingFang SC, PingFang SC-Medium;
  font-weight: 500;
  text-align: left;
  color: #ffffff;
  line-height: 22px;
  letter-spacing: 1px;
}
.right_channel_content {
  height: 20%;
  padding: 20px 30px;
  margin-top: 18px;
  background: #07375a;
  border: 1px solid;
  border-image: linear-gradient(262deg, #487c98 3%, #c2d8e5 73%, #3e6785 99%) 1 1;
  font-size: 16px;
  font-family: PingFang SC, PingFang SC-Regular;
  font-weight: 400;
  color: #eef9ff;
  line-height: 26px;
  letter-spacing: 1px;
  word-break: break-all;
}
</style>
