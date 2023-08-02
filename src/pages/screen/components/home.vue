<template>
  <div class="hom_main">
    <a-row :gutter="24" style="height: 100%">
      <a-col :span="6" style="height: calc(100% - 20px)">
        <div class="anquanzhishu">
          <img src="../img/anquanzhishu.png" alt="" />
          <div>实时安全指数</div>
        </div>
        <div class="bigblock">
          <img class="img_first" src="../img/52.png" alt="" />
          <img class="img_last" src="../img/zhishu_fire.png" alt="" />
          <div class="anquan_status">
            <a-row :gutter="24">
              <a-col :span="6">
                <div class="anquan_status_div">
                  正常
                  <div style="color: #90b9e2">0</div>
                </div>
              </a-col>
              <a-col :span="6">
                <div class="anquan_status_div">
                  报警
                  <div style="color: #ff5245">0</div>
                </div>
              </a-col>
              <a-col :span="6">
                <div class="anquan_status_div">
                  离线
                  <div style="color: #f29b3b">0</div>
                </div>
              </a-col>
              <a-col :span="6">
                <div class="anquan_status_div">
                  屏蔽
                  <div style="color: #47c2bc">0</div>
                </div>
              </a-col>
            </a-row>
          </div>
        </div>
        <div class="anquanzhishu" style="margin-top: 5px">
          <img src="../img/anquanzhishu.png" alt="" />
          <div>报警类别</div>
        </div>
        <div class="bigblock">
          <div id="containers"></div>
        </div>
        <div class="bigblock">
          <div id="zhongdiancontainer"></div>
        </div>
      </a-col>
      <a-col :span="12" style="height: calc(100% - 20px)">
        <a-row :gutter="24" style="height: 50%">
          <a-col :span="4" style="height: 100%">
            <div class="center_left">
              <div style="text-align: center">
                设备总数
                <div style="color: #f29b3b; text-align: center; font-size: 20px">14</div>
              </div>
            </div>
            <div class="center_left">
              <div>
                设备总数
                <span style="float: right; color: #98c6f3">3</span>
                <div>
                  报警数
                  <span style="float: right; color: #ff5245">0</span>
                </div>
              </div>
            </div>
            <div class="center_left">
              <div>
                设备总数
                <span style="float: right; color: #98c6f3">3</span>
                <div>
                  报警数
                  <span style="float: right; color: #ff5245">0</span>
                </div>
              </div>
            </div>
            <div class="center_left">
              <div>
                设备总数
                <span style="float: right; color: #98c6f3">3</span>
                <div>
                  报警数
                  <span style="float: right; color: #ff5245">0</span>
                </div>
              </div>
            </div>
            <div class="center_left">
              <div>
                设备总数
                <span style="float: right; color: #98c6f3">3</span>
                <div>
                  报警数
                  <span style="float: right; color: #ff5245">0</span>
                </div>
              </div>
            </div>
          </a-col>
          <a-col :span="20" style="height: 100%">
            <div class="lun_anquanyun">
              <div class="lun_shui orbit">
                <div class="icon_items">
                  <img src="../img/home_water.png" alt="" />
                  水
                </div>
                <img src="../img/lun_shui.png" alt="" class="icon01" />
              </div>
              <div class="lun_huo orbit">
                <div class="icon_items">
                  <img src="../img/home_smoke.png" alt="" />
                  烟感
                </div>
                <img src="../img/lun_yangan.png" alt="" class="icon02" />
              </div>
              <div class="lun_dian orbit">
                <div class="icon_items">
                  <img src="../img/home_ai.png" alt="" />
                  智能+
                </div>
                <img src="../img/lun_dian.png" alt="" class="icon03" />
              </div>
              <div class="lun_qi orbit">
                <div class="icon_items">
                  <img src="../img/home_was.png" alt="" />
                  气
                </div>
                <img src="../img/lun_qi.png" alt="" class="icon04" />
              </div>
              <div class="lun_zhineng orbit">
                <div class="icon_items">
                  <img src="../img/home_was.png" alt="" />
                  火自报
                </div>
                <img src="../img/lun_huo.png" alt="" class="icon05" />
              </div>
              <div class="lun_yangan orbit">
                <div class="icon_items">
                  <img src="../img/home_was.png" alt="" />
                  电
                </div>
                <img src="../img/lun_zhineng.png" alt="" class="icon06" />
              </div>
              <!-- 安全云 -->
              <div class="lun_tops">
                <img src="../img/home_topicon.png" alt="" class="icon06" />
              </div>
              <!-- 背景图 -->
              <div class="lun_bg">
                <!-- <img src="../img/home_bgs.png" alt="" class="icon06" /> -->
                <img src="../img/leida.png" alt="" class="icon06" />
              </div>
              <!-- 图例 -->
              <div class="tuli_tooth">
                <a-badge color="#06A4FF" text="正常" />
                <a-badge color="#FF5245" text="报警" />
                <a-badge color="#A9A9A9" text="离线" />
              </div>
            </div>
          </a-col>
        </a-row>
        <div class="anquanzhishus">
          <img src="../img/anquanzhishu.png" alt="" />
          <div>实时报警信息</div>
        </div>
        <div class="bigblocks">
          <!-- <div id="containers"></div> -->
        </div>
        <div class="anquanzhishus">
          <img src="../img/anquanzhishu.png" alt="" />
          <div>实时报警趋势</div>
        </div>
        <div class="bigblocks">
          <div id="Area_info"></div>
        </div>
      </a-col>
      <a-col :span="6" style="height: calc(100% - 20px)">
        <div class="anquanzhishu_es">
          <img src="../img/anquanzhishu.png" alt="" />
          <div>报警类别</div>
        </div>
        <div class="bigblock_es">
          <a-row :gutter="12" style="height: 100%">
            <a-col :span="8" style="height: 100%">
              <div class="bjlb">
                <img src="../img/ceshi.png" alt="" />
              </div>
            </a-col>
            <a-col :span="16" style="height: 100%">
              <div class="bjlb_tex">
                <img src="../img/points.png" alt="" />
                <span>姓名: 李凯</span>
              </div>
              <div class="bjlb_tex">
                <img src="../img/points.png" alt="" />
                <span>单位: 演示账号</span>
              </div>
              <div class="bjlb_tex">
                <img src="../img/points.png" alt="" />
                <span>职务: 保卫科</span>
              </div>
              <div class="bjlb_tex">
                <img src="../img/points.png" alt="" />
                <span>办电: 13288736517</span>
              </div>
              <div class="bjlb_tex">
                <img src="../img/points.png" alt="" />
                <span>手机: 8766541</span>
              </div>
            </a-col>
          </a-row>
        </div>
        <div class="anquanzhishu_es">
          <img src="../img/anquanzhishu.png" alt="" />
          <div>安全检查</div>
        </div>
        <div class="bigblock_es">
          <div class="xcyc">
            <div>巡查异常</div>
          </div>
          <div class="xcyc_item">
            <img src="../img/xczt.png" alt="" />
            <div>
              巡查状态：
              <span>有隐患</span>
            </div>
          </div>
          <div class="xcyc_item">
            <img src="../img/renwumingcheng.png" alt="" />
            <div>
              任务名称：
              <span>许年</span>
            </div>
          </div>
          <div class="xcyc_item">
            <img src="../img/weizhi.png" alt="" />
            <div>
              位置：
              <span>三楼配电箱1008</span>
            </div>
          </div>
        </div>
        <div class="anquanzhishu_es">
          <img src="../img/anquanzhishu.png" alt="" />
          <div>隐患处置情况</div>
        </div>
        <div class="bigblock_es">
          <a-row :gutter="12" style="height: 100%">
            <a-col :span="10" style="height: 100%">
              <div class="yhzs_left">
                <div>
                  <!-- <img src="../img/yinhuanzongshu.png" alt="" style="width: 104px; height: 104px" /> -->
                  <div class="tow_bgs">2</div>
                  <div style="text-align: center">
                    隐患总数：
                    <span style="color: #ff5245">2</span>
                  </div>
                </div>
              </div>
            </a-col>
            <a-col :span="14" style="height: 100%">
              <div class="yinhuan_item">
                <div>
                  已处置
                  <span>5</span>
                </div>
                <a-slider :min="0" :max="10" :value="5" />
              </div>
              <div class="yinhuan_item">
                <div>
                  处置中
                  <span style="color: #47c2bc">0</span>
                </div>
                <a-slider :min="0" :max="10" :value="0" />
              </div>
              <div class="yinhuan_item">
                <div>
                  未处置
                  <span style="color: #ff5245">2</span>
                </div>
                <a-slider :min="0" :max="10" :value="2" />
              </div>
            </a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { Radar, Area } from '@antv/g2plot';
// 引入百度地图
import BMap from 'BMap';
export default {
  name: 'RankingBoard',
  data() {
    return {};
  },
  created() {},
  methods: {
    init() {
      this.getRadars();
      this.getmaps();
      this.getArea_info();
    },
    // 获取地图
    getmaps() {
      const map = new BMap.Map('zhongdiancontainer', { enableMapClick: false });
      map.centerAndZoom(new BMap.Point(117.1364220766769, 36.67941560705922), 11);
      map.enableScrollWheelZoom(true);
      map.setMapStyle({ style: 'dark' });
    },
    // 获取网状图表
    getRadars() {
      const data = [
        { name: '火灾自动联网报警', star: 30 },
        { name: '消防用水', star: 18 },
        { name: '消防可视化', star: 22 },
        { name: '独立烟感', star: 15 },
        { name: '电气火灾', star: 28 },
        { name: '可燃气体', star: 0 },
      ];
      const radarPlot = new Radar('containers', {
        data: data.map(d => ({ ...d, star: Math.sqrt(d.star) })),
        xField: 'name',
        yField: 'star',
        appendPadding: [0, 10, 0, 10],
        meta: {
          star: {
            alias: '数量',
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
    // 获取折线图
    getArea_info() {
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
      const area = new Area('Area_info', {
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
    tuoyuan() {
      // 获取所有椭圆轨道的DOM元素
      const orbits = document.querySelectorAll('.orbit');
      const anquanyun = document.querySelectorAll('.lun_anquanyun');
      console.log('anquanyun', anquanyun[0].offsetWidth, anquanyun[0].offsetHeight);

      // 计算中心点坐标
      // const centerX = window.innerWidth / 2;
      // const centerY = window.innerHeight / 2;
      const centerX = anquanyun[0].offsetWidth / 2 - orbits[0].offsetWidth / 2;
      const centerY = anquanyun[0].offsetHeight / 2 - orbits[0].offsetHeight / 2;

      // 设置椭圆长短轴的半径
      const orbitRadiusX = 270;
      const orbitRadiusY = 120;

      // 获取椭圆轨道的数量
      const numOrbits = orbits.length;

      // 设置动画的持续时间（毫秒）
      const animationDuration = 10000;

      // 动画更新函数，实现椭圆运动
      function animateOrbits() {
        // 获取当前时间戳
        const currentTime = Date.now();

        // 遍历每个椭圆轨道元素
        orbits.forEach((orbit, index) => {
          // 计算每个椭圆轨道的角度
          const angle = (360 / numOrbits) * index + (360 * currentTime) / animationDuration;

          // 计算椭圆轨道元素的新位置
          const x = centerX + orbitRadiusX * Math.cos((angle * Math.PI) / 180);
          const y = centerY + orbitRadiusY * Math.sin((angle * Math.PI) / 180);

          // 更新椭圆轨道元素的位置
          orbit.style.left = x + 'px';
          orbit.style.top = y + 'px';
        });

        // 使用requestAnimationFrame调用下一帧的动画更新
        requestAnimationFrame(animateOrbits);
      }

      // 启动动画
      animateOrbits();
    },
  },
  mounted() {
    this.init();
    this.tuoyuan();
  },
};
</script>
<style lang="less">
.hom_main {
  padding: 10px 40px;
  height: 100%;
  .anquanzhishu {
    display: flex;
    height: 6%;
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
  .anquanzhishus {
    display: flex;
    height: 5%;
    margin-top: 1%;
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
  .anquanzhishu_es {
    display: flex;
    height: 5%;
    // margin-bottom: 1%;
    margin-top: 2px;
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
  .bigblock_es {
    background-image: url('../img/bigblock.png');
    background-size: 100% 100%;
    margin-top: 20px;
    margin-bottom: 10px;
    padding: 20px;
    height: calc(27% - 20px);
    .bjlb {
      background-image: url('../img/photo_bg.png');
      background-size: 100% 100%;
      width: 100%;
      height: 100%;
      padding: 10px;
      img {
        width: 100%;
        height: 100%;
        // margin: 20px;
        object-fit: contain;
      }
    }
    .bjlb_tex {
      height: 20%;
      border-bottom: 1px dashed #ccd9e7;
      display: flex;
      align-items: center;
      img {
        margin-right: 8px;
      }
      span {
        font-size: 14px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        text-align: left;
        color: #ccd9e7;
        line-height: 20px;
        letter-spacing: 0.97px;
      }
    }
    .xcyc {
      width: 135px;
      margin: auto;
      height: 40px;
      margin-bottom: 8px;
      div {
        background-image: url('../img/xunchayichang.png');
        background-size: 100% 100%;
        width: 135px;
        height: 38px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .xcyc_item {
      height: calc(33% - 15px);
      display: flex;
      margin-top: 5px;
      img {
        width: 30px;
        height: 30px;
      }
      div {
        width: calc(100% - 44px);
        height: 30px;
        margin-left: 10px;
        border: 1px solid;
        padding: 3px 20px;
        border-image: linear-gradient(270deg, #85c4e8 0%, #bad8f5 0%, #5cb6e8) 1 1;
      }
    }
    .yhzs_left {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
      .tow_bgs {
        width: 104px;
        height: 104px;
        background-image: url('../img/yinhuanzongshu.png');
        background-size: 100% 100%;
        font-size: 25px;
        font-family: PingFang SC, PingFang SC-Medium;
        font-weight: 500;
        text-align: left;
        color: #ff5245;
        line-height: 36px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .yinhuan_item {
      height: calc(33% - 5px);
      div {
        font-size: 14px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        text-align: left;
        color: #ccd9e7;
        line-height: 20px;
        padding-left: 5px;
        span {
          float: right;
          padding-right: 5px;
        }
      }
    }
  }
  .bigblocks {
    background-image: url('../img/ssbjxx.png');
    background-size: 100% 100%;
    margin-top: 20px;
    padding: 10px;
    height: calc(19% - 27px);
    #Area_info {
      width: 100%;
      height: 100%;
    }
  }
  .bigblock {
    background-image: url('../img/bigblock.png');
    background-size: 100% 100%;
    margin-top: 15px;
    padding: 20px;
    height: calc(28% - 10px);
    .img_first {
      width: 44px;
      height: 34px;
      margin: auto;
      display: block;
      margin-bottom: -30px;
      padding: 5px;
    }
    .img_last {
      width: 245px;
      height: 90px;
      margin: auto;
      display: block;
    }
    .anquan_status {
      //   display: inline-flex;
      width: 100%;
      .anquan_status_div {
        width: 100%;
        background-image: url('../img/anquan1.png');
        background-size: 100% 100%;
        height: 80px;
        text-align: center;
        padding-top: 20px;
        font-size: 14px;
        color: #ccd9e7;
      }
    }
    #containers {
      width: 100%;
      height: 100%;
    }
    #zhongdiancontainer {
      width: 96%;
      height: 100%;
      margin: 0px auto;
      box-shadow: #000000b4 0px 0px 15px;
      border-radius: 3px;
    }
  }
  .center_left {
    background-image: url('../img/shebeizongshu.png');
    background-size: 100% 100%;
    height: calc(20% - 20px);
    margin-top: 20px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    div {
      width: 90px;
      font-size: 14px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      text-align: left;
      color: #ffffff;
    }
  }
  .lun_anquanyun {
    width: 100%;
    height: 100%;
    position: relative;
    // border: 1px solid #e9e9e9;

    div {
      display: inline-flex;
      img {
        width: 160px;
        height: 130px;
      }
    }
    .icon_items {
      position: absolute;
      top: 10px;
      left: calc(50% - 20px);
    }
    .icon_items img {
      width: 20px;
      height: 20px;
      position: relative;
    }

    @keyframes moveX {
      0% {
        left: -7px;
      }
      100% {
        left: calc(100% - 100px);
      }
    }
    @keyframes moveY {
      0% {
        top: -7px;
      }
      100% {
        top: calc(100% - 100px);
      }
    }
    @keyframes move1X {
      0% {
        left: calc(100% - 100px);
      }
      100% {
        left: -7px;
      }
    }
    @keyframes move1Y {
      0% {
        top: calc(100% - 100px);
      }
      100% {
        top: -12px;
      }
    }
    @keyframes move2X {
      0% {
        left: -7px;
      }
      100% {
        left: calc(100% - 100px);
      }
    }
    @keyframes move2Y {
      0% {
        top: -12px;
      }
      100% {
        top: calc(100% - 100px);
      }
    }
    @keyframes move3X {
      0% {
        left: calc(50% - 100px);
      }
      100% {
        left: calc(50% - 100px);
      }
    }
    @keyframes move3Y {
      0% {
        top: -7px;
      }
      100% {
        top: calc(100% - 100px);
      }
    }
    @keyframes move4X {
      0% {
        left: calc(100% - 100px);
      }
      100% {
        left: -7px;
      }
    }
    @keyframes move4Y {
      0% {
        top: calc(100% - 100px);
      }
      100% {
        top: -12px;
      }
    }
    @keyframes move5X {
      0% {
        left: -7px;
      }
      100% {
        left: calc(100% - 100px);
      }
    }
    @keyframes move5Y {
      0% {
        top: -12px;
      }
      100% {
        top: calc(100% - 100px);
      }
    }
    // 水
    .lun_shui {
      position: absolute;
      // top: calc(0% + 50px);
      // left: calc(0% + 20px);
      // top: 60px;
      // left: 10px;
      // animation: move1X 6s cubic-bezier(0.36, 0, 0.64, 1) -3s infinite alternate, move1Y 6s cubic-bezier(0.36, 0, 0.64, 1) 0s infinite alternate;
    }
    // 烟感
    .lun_huo {
      position: absolute;
      // top: calc(0% + 0px);
      // left: calc(50% - 100px);
      // top: 10px;
      // left: 60px;
      // animation: moveX 6s cubic-bezier(0.36, 0, 0.64, 1) -3s infinite alternate, moveY 6s cubic-bezier(0.36, 0, 0.64, 1) 0s infinite alternate;
    }
    // 智能
    .lun_dian {
      position: absolute;
      // top: calc(0% + 20px);
      // left: calc(100% - 200px);
      // top: 30px;
      // left: 100px;
      // animation: move2X 6s cubic-bezier(0.36, 0, 0.64, 1) -3s infinite alternate, move2Y 6s cubic-bezier(0.36, 0, 0.64, 1) 0s infinite alternate;
    }
    // 气
    .lun_qi {
      position: absolute;
      // top: calc(50% + 20px);
      // left: calc(100% - 200px);
      // top: 160px;
      // left: 50px;
      // animation: moveX 6s cubic-bezier(0.36, 0, 0.64, 1) -3s infinite alternate, moveY 6s cubic-bezier(0.36, 0, 0.64, 1) 0s infinite alternate;
    }
    // 火自报
    .lun_zhineng {
      position: absolute;
      // top: calc(100% - 200px);
      // left: calc(0% + 50px);
      // top: 60px;
      // left: 90px;
      // animation: move4X 6s cubic-bezier(0.36, 0, 0.64, 1) -3s infinite alternate, move4Y 6s cubic-bezier(0.36, 0, 0.64, 1) 0s infinite alternate;
    }
    // 电
    .lun_yangan {
      position: absolute;
      // top: calc(50% + 50px);
      // left: calc(50% - 50px);
      // animation: move5X 6s cubic-bezier(0.36, 0, 0.64, 1) -3s infinite alternate, move5Y 6s cubic-bezier(0.36, 0, 0.64, 1) 0s infinite alternate;
    }
    .lun_tops {
      position: absolute;
      top: calc(50% - 140px);
      left: calc(50% - 100px);
      img {
        width: 200px;
        height: 180px;
      }
    }
    .lun_bg {
      position: absolute;
      // top: calc(50% - 70px);
      // left: calc(50% - 185px);
      // img {
      //   width: 370px;
      //   height: 180px;
      // }
      width: 100%;
      height: 100%;
      z-index: 999;
      img {
        position: absolute;
        z-index: 100;
        opacity: 0.8;
        width: 70%;
        height: 70%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .tuli_tooth {
      position: absolute;
      right: 20px;
      bottom: 20px;
      display: block;
      .ant-badge-status-text {
        color: #ffffff;
        font-size: 14px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        text-align: left;
        color: #ffffff;
        line-height: 20px;
        letter-spacing: 2px;
      }
      .ant-badge {
        display: block;
      }
    }
  }
}
</style>
<style scoped>
/* 隐藏百度地图上的图标和比例尺 */
#zhongdiancontainer >>> .anchorBL {
  display: none !important;
}
.yinhuan_item >>> .ant-slider-rail {
  height: 1px;
}

.yinhuan_item >>> .ant-slider {
  padding: 1px 0;
}
.yinhuan_item >>> .ant-slider-track {
  height: 1px;
}
.yinhuan_item >>> .ant-slider-handle {
  width: 10px;
  height: 10px;
}
</style>
