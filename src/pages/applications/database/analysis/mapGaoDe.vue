<template>
  <div id="container"></div>
</template>
<script>
import AMapLoader from '@amap/amap-jsapi-loader';
export default {
  mounted(){
    //DOM初始化完成进行地图初始化
    this.initMap();
  },
  data(){
    return{
      // 此处不声明 map 对象，可以直接使用 this.map赋值或者采用非响应式的普通对象来存储。
      // map:null,
    } 
  },
  methods:{
    initMap(){
      AMapLoader.load({
        // key:"e035dc6d9b99b5a187c574a767d56ee3",  // 申请好的Web端开发者Key，首次调用 load 时必填
        key:"2c4de54ffa2ed6844b402d351af10a73",
        version:"2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins:[''],       // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      }).then((AMap)=>{
        this.map = new AMap.Map("container",{  //设置地图容器id
          viewMode:"3D",    //是否为3D地图模式
          zoom:16,           //初始化地图级别
          // 设置地图的显示样式，官方提供的样式有标准（normal）、马卡龙（macaron）、涂鸦（graffiti）、远山黛（whitesmoke）、
          // 幻夜黑（dark）、草青色（fresh）、极夜蓝（darkblue）、靛青蓝（blue）、月光银（light）、雅士灰（grev）
          mapStyle: 'amap://styles/fresh', 
          center:[115.949126,36.51041], //初始化地图中心点位置
          // [115.97,36.45] 聊城市经纬度
          // [115.949126,36.51041] 嘉明经济开发区经纬度
          // [115.946685,36.511326] 聊城龙大肉食食品有限公司
          // [115.950471,36.511921] 山东聊城烟草有限公司
        });
        // 创建一个 Marker 实例：
        var marker1 = new AMap.Marker({
          position: new AMap.LngLat(116.39, 39.9),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: '北京'
        });
        var marker2 = new AMap.Marker({
          position: new AMap.LngLat(115.946685,36.511326),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: '聊城龙大肉食食品有限公司'
        });
        var marker3 = new AMap.Marker({
          position: new AMap.LngLat(115.950471,36.511921),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: '山东聊城烟草有限公司'
        });
        this.map.add([marker1,marker2,marker3])
      }).catch(e=>{
        console.log(e);
      })
    },
  },
}
</script>
<style  scoped>
  #container{
    padding:0px;
    margin: 100px auto;
    width: 45%;
    height: 500px;
    border: 2px dotted deeppink;
    border-radius: 30px;
  }
</style>