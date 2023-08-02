<template>
  <div style="margin: 50px 30px">
    <a-input-group size="large">
      <a-row :gutter="8">
        <a-col :span="5">
          <a-input v-model="citys" />
        </a-col>
        <a-col :span="8">
          <a-input-search placeholder="input search text" v-model="keywords" enter-button @search="onSearch" />
        </a-col>
        <a-col :span="8">经度：{{ center[0] }}</a-col>
        <a-col :span="8">纬度：{{ center[1] }}</a-col>
      </a-row>
    </a-input-group>
    <div class="maps" id="zhongdiancontainer"></div>
  </div>
</template>
<script>
import axios from 'axios';
import AMapLoader from '@amap/amap-jsapi-loader'; // 引入高德地图组件接口
export default {
  data() {
    return {
      datas: [],
      keywords: undefined,
      citys: undefined,
      center: [116.061434, 36.463872],
      marker1: undefined,
    };
  },
  created() {
    this.init();
  },
  methods: {
    onSearch(value) {
      console.log('value', value);
      this.keywords = value;
      axios
        .get('https://restapi.amap.com/v3/place/text?key=afdba655586ef4bcbbbc6b8cd519877a&keywords=' + this.keywords + 'city=' + this.citys)
        .then(res => {
          console.log('rerere', res);
          this.datas = res.data;
          if (res.data.pois.length) {
            var daas = res.data.pois[0].location.split(',');
            // this.map.remove([this.marker1]);
            this.map.clearMap();
            this.marker1 = new AMap.Marker({
              position: new AMap.LngLat(daas[0], daas[1]), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
              title: res.data.pois[0].name,
            });
            this.center = [daas[0], daas[1]];
            this.map.add([this.marker1]);
          } else {
            this.$message.error('暂未查询到数据！');
          }
          this.map.setFitView();
        })
        .catch(err => {
          console.log(err);
        });
    },
    init() {
      AMapLoader.load({
        // key:"e035dc6d9b99b5a187c574a767d56ee3",  // 这个是视频中示例中的key 申请好的Web端开发者Key，首次调用 load 时必填
        key: '2c4de54ffa2ed6844b402d351af10a73', // 自己申请的key
        version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [''], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      }).then(AMap => {
        this.map = new AMap.Map('zhongdiancontainer', {
          // 设置地图容器id
          pitch: 53, // 地图俯仰角度，有效范围 0 度- 83 度
          viewMode: '2D', // 是否为3D地图模式
          zoom: 17, // 初始化地图级别
          // 设置地图的显示样式，官方提供的样式有标准（normal）、马卡龙（macaron）、涂鸦（graffiti）、远山黛（whitesmoke）、
          // 幻夜黑（dark）、草青色（fresh）、极夜蓝（darkblue）、靛青蓝（blue）、月光银（light）、雅士灰（grev）
          mapStyle: 'amap://styles/grev',
          center: this.center, // 初始化地图中心点位置
        });
        this.map.on('click', this.markerClick);

        this.$nextTick(() => {
          this.marker1 = new AMap.Marker({
            position: new AMap.LngLat(116.061434, 36.463872), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            title: '山东尚可网络科技有限公司',
          });
          this.map.add([this.marker1]);
        });
      });
    },
    markerClick(e) {
      console.log('e', e);
      this.center = [e.lnglat.getLat(), e.lnglat.getLng()];
      this.map.clearMap();
      this.marker1 = new AMap.Marker({
        // icon: 'https://vdata.amap.com/icons/b18/1/2.png',
        position: [e.lnglat.lng, e.lnglat.lat],
      });
      this.map.add(this.marker1);
      this.map.setFitView();
      // this.index = e.target.content - 0;
      // console.log(this.index);
      // if (this.isOK) {
      //   this.open1 = true;
      // }
    },
  },
};
</script>
<style scoped>
.maps {
  width: 1200px;
  margin: auto;
  height: 700px;
  border: 1px solid #eee;
}
</style>
