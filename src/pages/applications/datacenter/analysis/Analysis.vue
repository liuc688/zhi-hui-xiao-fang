<template>
  <div class="analysis">
    <a-spin tip="加载中..." :spinning = 'spinning'>
      <a-row style="margin-top: 0" :gutter="[24, 24]">
        <a-col :sm="24" :md="12" :xl="6">
          <chart-card title="总营业额 （万元）" :total="turnoverObj.yingyee?turnoverObj.yingyee.toFixed(2).replace(this.reg,'$&,'):''">
          </chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6">
          <chart-card  title="总纳税额 （万元）" :total="turnoverObj.nashui?turnoverObj.nashui.toFixed(2).replace(this.reg,'$&,'):''">
          </chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6">
          <chart-card  title="总用工数" :total="employeesNum.number">
          </chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6">
          <chart-card  title="总党员数" :total="employeesNum.dangyuan">
          </chart-card>
        </a-col>
      </a-row>
      <div>
        <a-row class="CompanyDistribution">
          <a-col :span="13" class="CompanyDistributionOne">
            <div style="height:100%;background:#fff">
              <div style="color:#000;padding:10px 0 15px 15px;border-bottom:1px solid #ddd">公司分布</div>
              <div id="zhongdiancontainer"></div>
            </div>
          </a-col>
          <a-col :span="10" class="CompanyDistributionTwo">
            <div style="height:100%;background:#fff">
              <div style="padding:12px 0 15px 12px;border-bottom:1px solid #ddd">
                营业额排行榜前十名 (单位 : 万元)
              </div>
              <!-- 
              <Turnover-leaderboards-list :list="TurnoverRanking" style="padding:0 32px 32px 12px !important">
                <span slot="title">
                  123
                </span>
              </Turnover-leaderboards-list> 
              -->
              <a-table 
              :columns="columns" 
              :data-source="TurnoverRanking"
              :pagination="false"
              >
                <!-- 公司名称字段自定义样式 -->
                <a slot="name" slot-scope="text,record">
                  <a style="color:#3490f4" @click="onSee(record)">{{ text }}</a>
                </a>
              </a-table>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="charts">
        <a-row type="flex" justify="space-around" align="middle">
          <a-col style="padding: 0 12px" :xl="11" :lg="24" :md="24" :sm="24" :xs="24" class="charts_a_col_one" v-if="brokenLine&&brokenLine.length">
            <div class="title">主题填报折线图</div>
            <div id="fillInTheLineChart"></div>
          </a-col>
          <a-col style="padding: 0 12px;height:100%" :xl="11" :lg="24" :md="24" :sm="24" :xs="24" class="charts_a_col_one" v-else>
            <div class="title">主题填报折线图</div>
            <div id="noData">
              暂无数据
            </div>
          </a-col>
          <a-col style="padding: 0 12px" :xl="11" :lg="24" :md="24" :sm="24" :xs="24" class="charts_a_col_two">
            <div class="title">企业规模详情</div>
            <div id="proportionOfEachCategory"></div>
          </a-col>
        </a-row> 
        <div style="height:30px"></div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import ChartCard from '@/components/card/ChartCard'
import MiniArea from '@/components/chart/MiniArea'
import MiniBar from '@/components/chart/MiniBar'
import MiniProgress from '@/components/chart/MiniProgress'
import Bar from '@/components/chart/Bar'
import RankingList from '@/components/chart/RankingList'
import TurnoverLeaderboardsList from '@/components/chart/TurnoverLeaderboardsList'  // 营业额排行榜列表
// import HotSearch from './HotSearch'
import Trend from '@/components/chart/Trend'
import dataV from '@jiaminghi/data-view'
import Vue from 'vue'
import { Pie, Line, DualAxes } from "@antv/g2plot";
import {
product_paginate,  // 产品分页
company_run_sum,  // 企业营业额
company_run_rank,  // 营业额排行榜
company_number_sum,  // 企业用工情况
company_run_category,  // 产品分类
company_address,  // 企业地址分布
company_datetime_theme,  // 填报折线图
company_manage_scale  // 企业规模分类
} from "@/services/datacenter"
// 引入百度地图
import BMap from 'BMap'
Vue.use(dataV)
export default {
  name: 'Analysis',
  // i18n: require('./i18n'),
  data () {
    return {
      rankList:[],
      loading: true,
      turnoverObj:{},  // 里面包含总营业额和总纳税数额
      employeesNum:{},  // 里面存放企业用工人数返回的数据，包含总员工数和总党员数
      TurnoverRanking:[],  // 接收营业额排行榜接口返回的数据，是一个数组
      linePlot:{},
      piePlot2:{},
      enterpriseScaleArr:[
        { type: "小微", value: 320 },
        { type: "中小", value: 287 },
        { type: "规上", value: 116 },
      ],
      indxt:1,
      spinning:true,  // 默认不出于加载中
      columns:[
        {
          title: '公司名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '营业额（万元）',
          dataIndex: 'total',
          align: "center",
        },
      ],
      map: undefined,  // 百度地图的 map 项
      mapZoom: 11,  // 地图级别
      pointList:[],  // point 点集合
      markerList:[],  // 经纬坐标点 marker 集合
      infoContent:"",  // 用于百度地图中信息窗口显示的内容
      reg:/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,
      brokenLine:[],  // 折线图应该获取的数据
    }
  },
  created() {
    this.init();
    // DOM初始化完成进行地图初始化
    this.$nextTick(() => {
      this.initMap()
    })
  },
   mounted(){
    
  },
  beforeDestroy(){
    // 百度地图实例初始化
    this.map = undefined;
    // 企业规模折线图销毁（只有当折线图需要的数组有值的时候才销毁，才可以销毁）
    if(this.brokenLine&&this.brokenLine.length) {
      this.linePlot.destroy();
    }
    // 企业规模饼图销毁
    this.piePlot2.destroy();
  },
  components: {Trend, RankingList, Bar, MiniProgress, MiniBar, MiniArea, ChartCard,TurnoverLeaderboardsList},
  methods:{
    // 地图区域
    initMap(){
      // 创建Map实例
      this.map = new BMap.Map('zhongdiancontainer');
      // 初始化地图,设置中心点坐标和地图级别
      this.map.centerAndZoom(new BMap.Point(115.98,36.45), this.mapZoom);
      // 添加控件
      this.map.addControl(new BMap.NavigationControl());
      this.map.addControl(new BMap.ScaleControl());
      this.map.addControl(new BMap.OverviewMapControl());
      this.map.addControl(new BMap.MapTypeControl());
      // 设置地图显示的城市 此项是必须设置的
      this.map.setCurrentCity('聊城');
      // 启用滚轮放大缩小，默认禁用
      // this.map.enableScrollWheelZoom(true);
      // 启用地图惯性拖拽，默认禁用
      this.map.enableContinuousZoom(true);
      // 标注
      // var point1 = new BMap.Point(115.961054,36.484553);  // 昌润小学
      // var point2 = new BMap.Point(116.007658,36.481071);  // 星光水晶城
      // this.map.addOverlay(marker1);  // 将标注添加到地图中
      // this.map.addOverlay(marker2);  // 将标注添加到地图中
      // 企业地址分布
      company_address()
      .then(res => {
        console.log('企业地址分布',res);
        this.addressList = res.data.data;
        for(let i=0;i<this.addressList.length;i++){
          if(this.addressList[i].latitude&&this.addressList[i].longitude) {
            this.pointList[i] = new BMap.Point(this.addressList[i].longitude,this.addressList[i].latitude)
            this.markerList[i] = new BMap.Marker(this.pointList[i])
            // this.map.addOverlay(new BMap.Marker(new BMap.Point(this.addressList[i].longitude,this.addressList[i].latitude)))
            this.map.addOverlay(this.markerList[i])  // 添加标点
          }
        }
        // 监听标注的事件，当我们点击了标注的时候会触发
        for(let i=0;i<this.markerList.length;i++){
          var that = this;  // 这里使用 that = this，因为回调函数里面的 this 和 这里的 this 不一样
          that.markerList[i].addEventListener("click",function(e){
            // console.log(that.pointList[i])
            for(let j=0;j<that.addressList.length;j++) {
              if(that.pointList[i].lng == that.addressList[j].longitude&&that.pointList[i].lat == that.addressList[j].latitude) {
                that.infoContent = that.addressList[j].title;
              }
            }
            var opts = {    
              width : 250,  // 信息窗口宽度
              height: 10,  // 信息窗口高度
              title : "公司名称"  // 信息窗口标题
            }    
            var infoWindow = new BMap.InfoWindow(that.infoContent, opts);  // 创建信息窗口对象    
            that.map.openInfoWindow(infoWindow, that.pointList[i]);  // 打开信息窗口
          })
        }
      })
    },
    init(){
      this.spinning = true;
      // 企业营业额
      company_run_sum()
      .then(res => {
        // console.log('企业营业额',res);
        this.turnoverObj = res.data.data;
        // console.log('this.turnoverObj',this.turnoverObj);
      }) 
      // 营业额排行榜
      company_run_rank()
      .then(res => {
        // console.log('营业额排行榜',res);
        this.TurnoverRanking = res.data.data.items;
        // const reg = /\d{1,3}(?=(\d{3})+(\.\d*)?$)/g;
        this.TurnoverRanking = this.TurnoverRanking.map(item => {
          return {
            name: item.id.title,
            total:item.count?(item.count.toFixed(2).replace(this.reg,'$&,')):"",
            id:item.id.id
          }
        })
      })
      // 企业用工情况
      company_number_sum()
      .then(res => {
        this.spinning = false;
        // console.log('企业用工情况',res);
        this.employeesNum = res.data.data
      })
      // 产品分类
      company_run_category()
      .then(res => {
        // console.log('产品分类',res);
      })
      // 填报折线图
      company_datetime_theme()
      .then(res => {
        // console.log('填报折线图',res);
        // 从接口获取折线图需要的数据
        this.brokenLine = res.data.data;
        /*
        如果数组不为空（res.data.data 该数组不是一个空数组）的话，才会执行函数 this.fillInTheLineChart 方法，
        */ 
        if(res.data.data && res.data.data.length) {
          this.fillInTheLineChart(res.data.data.reverse())
        }
      })
      // 企业规模分类接口
      company_manage_scale()
      .then(res => {
        // console.log('首页企业规模分类接口',res);
        this.enterpriseScale(res.data.data);
      })
    },
    // 跳转到企业经营信息的页面
    onSee(record){
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "enterpriseDetail",
          params: {
            menus: ["enterpriseDetail"],
            record:record.id,  // 将上面插槽中的内容传递到详情页面里去
            page:1,
            per_page:10,
            flag:3,
          },
        },
      });
    },
    // 企业填报折线图
    fillInTheLineChart(item) {
      this.linePlot = new Line("fillInTheLineChart", {
        data: item,
        xField: "_id",
        yField: "count",
        point: {
          size: 5,
          shape: "diamond",
          style: {
            fill: "white",
            stroke: "#5B8FF9",
            lineWidth: 2,
          },
        },
        tooltip: { showMarkers: false },
        xAxis: {
          range: [0, 1],
          label: {
            style: {
              fill: "#000",
            },
          },
        },
        yAxis: {
          line:{
            style: {
              stroke: '#ccc',
              lineWidth: 1,
            }
          },
          label: {
            style: {
              fill: "#000",
            },
          },
        },
        //折线平滑
        smooth: true,
        // @TODO 后续会换一种动画方式
        // animation 是一种平滑的过渡
        animation: {
          appear: {
            /* 
            animation表示动画效果
              折线图常用的属性wave-in,path-in,个人觉得wave-in更好用一点
              柱状图常用的属性fade-in,fade-out,grow-in-x(容器沿x方向放大的矩阵动画),grow-in-y(容器沿y方向放大的矩阵动画),zoom-in(沿着图形中心点放大的动画),zoom-out(沿着图形中心点缩小的动画)
            */
            animation: "wave-in",
            duration: 5000, //动画执行时间
          },
        },
      });
      this.linePlot.render();
    },
    // 企业规模饼形图
    enterpriseScale(item){
      item.forEach(item => {
        if(!item._id || item._id == 1) {
          item._id = "未填报"
        }
      });
      this.piePlot2 = new Pie("proportionOfEachCategory", {
        appendPadding: 10,
        data:item,
        angleField: "count",
        colorField: "_id",
        radius: 0.75,
        label: {
          style: {
            fill: "#000",
          },
          type: "spider",
          labelHeight: 28,
          content: "{name}\n{percentage}",
        },
        legend: {
          position: "top-right",
          itemName: {
            style: {
              fill: "#000",
            },
          },
        },
        color: [
          '#FF745A',
          '#007E99',
          '#FFA8A8',
          '#2498D1',
          '#BBBDE6',
          '#4045B2',
          '#21A97A',
        ],
        interactions: [
          { type: "element-selected" },
          { type: "element-active" },
        ],
      });
      this.piePlot2.render();
    },
    // js 处理数字要求每隔三位数字添加一个逗号，在这里使用的是正则方法 
    format(text){
      const reg = /(\d)(?=(?:\d{3})+$)/g;
      return text.toString().replace(reg,'$1,');
    }
  }
}
</script>

<style lang="less" scoped>
  .extra-wrap{
    .extra-item{
      display: inline-block;
      margin-right: 24px;
      a:not(:first-child){
        margin-left: 24px;
      }
    }
  }
  @media screen and (max-width: 992px){
    .extra-wrap .extra-item{
      display: none;
    }
  }
  @media screen and (max-width: 576px){
    .extra-wrap{
      display: none;
    }
  }
  #zhongdiancontainer{
    width: 92%;
    height: 450px;
    margin: 10px auto;
    box-shadow: #000000b4 0px 0px 15px;
    border-radius: 30px;
  }
</style>
<style>
  .map {
    position: relative;
    margin: 0 auto;
    width: 21vw;
    height: 25vw;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .city {
    position: absolute;
    right: 223px;
    top: 201px;
  }
  .citys {
    position: absolute;
    right: 162px;
    top: 225px;
  }
  .cityss {
    position: absolute;
    right: 240px;
    top: 245px;
  }
  .city_one {
    font-size: 14px;
    font-weight: 600;
    color:#444;
    position: absolute;
    right: 200px;
    top: 211px;
  }
  .city_two {
    font-size: 14px;
    font-weight: 600;
    color:#444;
    position: absolute;
    right: 144px;
    top: 235px;
  }
  .city_three {
    font-size: 14px;
    font-weight: 600;
    color:#444;
    position: absolute;
    right: 218px;
    top: 255px;
  }
  .dotted {
    width: 6px;
    height: 6px;
    background-color: #C66584;
    border-radius: 50%;
  }
  .city div[class^='pulse'] {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 6px;
    height: 6px;
    box-shadow: 0 0 12px #7937e4;
    border-radius: 50%;
    animation: pulse 1.8s ease-in infinite;
  }
  .citys div[class^='pulse'] {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 6px;
    height: 6px;
    box-shadow: 0 0 12px #7937e4;
    border-radius: 50%;
    animation: pulse 2.0s ease-in infinite;
  }
  .cityss div[class^='pulse'] {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 4px;
    height: 4px;
    box-shadow: 0 0 12px #7937e4;
    border-radius: 50%;
    animation: pulse 2.6s ease-in infinite;
  }
  .pulse2 {
      animation-delay: 1.0s !important;
  }
  .pulse3 {
      animation-delay: 1.6s !important;
  }
  @keyframes pulse {
    0% {
    }
    70% {
      width: 30px;
      height: 30px;
      opacity: 1;
    }
    100% {
      width: 70px;
      height: 70px;
      opacity: 0;
    }
  }
  .rank .list li {
    margin-top: 22px !important;
  }
</style>
<style scoped>
  .analysis >>> .chart-card-footer {
  border-top:0px;
  }
  .analysis >>> .chart-card-content {
  height: 0px;
  }
  .analysis >>> .ant-table {
    line-height: 0.8;
  }
  /* 中间一层（第二层），公司分布 */
  .CompanyDistribution .CompanyDistributionOne {
    height:540px;
    margin: 0 0 0 17px;
  }
  /* 中间一层（第二层），公司排名 */
  .CompanyDistribution .CompanyDistributionTwo {
    height:540px;
    float:right;
    margin: 0 17px 0 0;
  }
  /* 最下面一层（第三层），承装数据可视化部分 */
  .charts {
  margin: 25px 0px;
  }
  /* 数据可视化的第一个图,第二个图 */
  .charts_a_col_one,.charts_a_col_two {
  background:#fff
  }
  /* 数据可视化的第一个图 */
  .charts_a_col_one {
    margin-right: 10px;
  }
  /* 第一个图中的标题样式 */
  .charts_a_col_one .title {
    font-size: 24px;
    padding: 15px;
    text-align:center
  }
  /* 数据可视化的第二个图 */
  .charts_a_col_two {
    margin-left: 10px;
  }
  /* 第二个图中的标题样式 */
  .charts_a_col_two .title {
    font-size: 24px;
    padding: 15px;
    text-align:center
  }
  /* 数据可视化图中的第一个 */
  #fillInTheLineChart {
    padding: 32px;
    height: 500px;
  }
  #noData {
    padding: 32px;
    font-size: 32px;
    height: 500px;
    line-height: 400px;
    text-align: center;
  }
  /* 可视化图中的第二个 */
  #proportionOfEachCategory {
    padding: 32px;
    height: 500px;
  }
  /* 隐藏百度地图上的图标和比例尺 */
  #zhongdiancontainer >>> .anchorBL{ 
    display: none !important;
  }
</style>
