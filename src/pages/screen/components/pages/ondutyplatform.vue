<template>
  <div class="info_rights">
    <!-- <div class="titles">值守平台...</div> -->
    <div id="map" style="height: 100%"></div>
  </div>
</template>
<script>
// 引入百度地图
export default {
  data() {
    return {
      map: '',
      mapZoom: 14,
    };
  },
  created() {
    this.$nextTick(() => {
      this.initMap();
    });
  },
  methods: {
    // 初始化
    initMap() {
      // 创建Map实例
      this.map = new BMapGL.Map('map');
      // 初始化地图,设置中心点坐标和地图级别
      this.map.centerAndZoom(new BMapGL.Point(117.1201, 36.6512), this.mapZoom);
      // 设置地图显示的城市 此项是必须设置的
      this.map.setCurrentCity('济南');
      // 启用滚轮放大缩小，默认禁用
      this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
      // 启用地图惯性拖拽，默认禁用
      // this.map.enableContinuousZoom(true);
      // this.map.setHeading(64.5); //设置地图旋转角度
      // this.map.setMapStyle({ style: 'grayscale' });
      // var scaleCtrl = new BMapGL.ScaleControl(); // 添加比例尺控件
      // this.map.addControl(scaleCtrl);
      // var zoomCtrl = new BMapGL.ZoomControl(); // 添加缩放控件
      // this.map.addControl(zoomCtrl);
      // var cityCtrl = new BMapGL.CityListControl(); // 添加城市列表控件
      // this.map.addControl(cityCtrl);
      // 添加控件---
      // 添加缩放控件
      // const navigationControl = new BMapGL.NavigationControl();
      // this.map.addControl(navigationControl);
      // // 添加比例尺控件
      // const scaleControl = new BMapGL.ScaleControl();
      // this.map.addControl(scaleControl);
      // // 添加缩略地图控件
      // const overviewMapControl = new BMapGL.OverviewMapControl();
      // this.map.addControl(overviewMapControl);
      // 添加地图类型控件
      // const mapTypeControl = new BMapGL.MapTypeControl();
      // this.map.addControl(mapTypeControl);
      // 添加定位控件
      // const geolocationControl = new BMapGL.GeolocationControl();
      // this.map.addControl(geolocationControl);
      // 添加指南针控件
      // const navigationPanControl = new BMapGL.NavigationControl({ type: BMapGL_NAVIGATION_CONTROL_PAN });
      // this.map.addControl(navigationPanControl);
      // 添加精简版缩放控件
      // const navigationSmallControl = new BMapGL.NavigationControl({ type: BMapGL_NAVIGATION_CONTROL_SMALL });
      // this.map.addControl(navigationSmallControl);
      // 添加地图全景控件
      // const panoramaControl = new BMapGL.PanoramaControl({ anchor: BMapGL_ANCHOR_BOTTOM_RIGHT });
      // this.map.addControl(panoramaControl);
    },
  },
};
</script>
<style scoped lang="less">
.info_rights {
  height: calc(100% - 40px);
  width: 100%;
  /* padding: 30px; */
  background-image: url('./images/info_bg.png') !important;
  background-size: 100% 100%;
  margin: 20px auto;
  position: relative;
  #id {
    width: 100%;
    height: 100%;
  }
}
.titles {
  text-align: center;
  color: #4f819c;
  font-size: 20px;
  margin-top: 10%;
}
</style>

<style>
.anchorBL {
  display: none;
}
</style>
