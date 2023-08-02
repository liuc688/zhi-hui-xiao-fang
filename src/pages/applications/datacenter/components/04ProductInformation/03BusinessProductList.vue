<!-- 产品信息(第四项) -->
<template>
  <div class="main">
    <div class="title_back">
      <a @click="back()"><a-icon type="arrow-left" />返回</a>
    </div>
    <div class="task_list">
      <div class="task_list_title">
        <div class="task_search">
          <!-- 关键词 -->
          <a-input
            placeholder="请输入关键词"
            allowClear
            v-model="searchform.keyword"
            style="width: 21%; margin: 5px 10px 10px 5px"
          />
          <!-- 价格区间 -->
          <a-select
          placeholder="请选择价格区间"
          allowClear
          style="width: 21%; margin: 5px 10px 10px 5px"
          @change="changeItem"
          >
            <a-select-option
            v-for="(item, index) in priceRangeList"
            :key="index"
            >
              {{ item.value }}
            </a-select-option>
          </a-select>
          <a-button @click="onSearch" type="primary" style="margin-left: 16px">
            查询
          </a-button>
        </div>
      </div>
      <!-- 导出 统计 产品信息 功能部分 -->
      <div style="width: 100%; padding: 5px 0px; margin-top: 10px">
        <a-space>
          <!-- a-dropdown-button组件表现出的按钮,后面带...的 -->
          <!-- 
          <a-dropdown style="margin-left: 5px">
            <a-button> 导出 <a-icon type="down" /></a-button>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="/resources/public/20220718/62d5168ecc1561a8c3527967.xlsx" download="产品信息表"><a-icon type="download" /> 导出报表 </a>
              </a-menu-item>
              <a-menu-item>
                <a href="/resources/public/20220718/62d51820cc1561a8c352796a.png" download="产品信息-打印"><a-icon type="printer" /> 打印 </a>
              </a-menu-item>
            </a-menu>
          </a-dropdown> 
          -->
          <!-- <a-button @click="onStatistics()">统计</a-button> -->
        </a-space>
      </div>
      <!-- 表格 -->
      <!-- 
        scroll 设置横向或纵向滚动，也可用于指定滚动区域的宽和高，建议为 x 设置一个数字，如果要设置为 true，
        需要配合样式 .ant-table td { white-space: nowrap; } 类型为:{ x: number | true, y: number } 
        例子: :scroll="{ x: 1500 }" 这时候column中的最右侧的一项(大多数情况下)会加上fixed: "right",表示固定定位在右侧
      -->
      <a-table
        class="task_table"
        :columns="columns"
        :loading="loading"
        size="middle"
        rowKey="_id"
        :pagination="false"
        :dataSource="dataSource.items"
        bordered
      >
        <!-- 产品名称字段的插槽(样式自定义) -->
        <span slot="titles" slot-scope="text, record">
          <!-- <div class="table_titles locatoins" @click="previews(record.cptp[0].url)"> -->
          <!-- 现在点击标题不再是，展示产品的图片了，而是跳转页面到产品详情页面 -->
          <div class="table_titles locatoins" @click="onJump(record)">
            <!-- <a-avatar :size="36" :src="record.cptp[0].url" /> -->
            {{ record.title }}
          </div>
        </span>
        <!-- 品类字段的插槽(样式自定义) -->
        <span slot="category" slot-scope="text" style="font-weight: 700; color: chocolate">
          {{ text }}
        </span>
        <!-- 价格字段的插槽(样式自定义) -->
        <span slot="price" slot-scope="text" style="font-weight: 700; color: chocolate">
          {{ text }}
        </span>
        <!-- 状态字段的插槽(样式自定义) -->
        <span slot="status" slot-scope="text">
          <a-tag :color="text == '在产' ? 'green' : 'red'" style="font-weight: 600">{{ text }}</a-tag>
        </span>
        <!-- 所属公司字段插槽（样式自定义） -->
        <span slot="affiliatedCompany" slot-scope="text,record">
          <template>
            <!-- placement="topLeft" 表示气泡从左上侧弹出 -->
            <a-popover title="所属公司" placement="topLeft">
              <!-- 鼠标停在 a-tag 标签上，会弹窗相应的气泡卡片 -->
              <!-- 
              弹出的内容和默认展示的是一样的，我们这里使用的是 a-tag 标签渲染数据，由于不是一个，
              所以我们在这里使用了 v-for 遍历
              -->
              <template slot="content" style="max-width:320px">
                <a-tag color="blue">
                  {{record.company.title}}
                </a-tag>
              </template>
              {{record.company.title}}
            </a-popover>
          </template>
        </span>
        <!-- 库存字段插槽（样式自定义） -->
        <span slot="stock" slot-scope="text">
          <!-- <a-tag :color="text == '在产' ? 'green' : 'red'" style="font-weight: 600"></a-tag> -->
          {{ format(text) }}
        </span>
      </a-table>
      <!-- 分页组件 -->
      <a-pagination
      size="small"
      style="text-align: right"
      @change="changepage"
      :current="pagination.page"
      :pageSize="pagination.per_page"
      @showSizeChange="changepage"
      :pageSizeOptions="pageSizeOptions"
      :total="dataSource.total"
      show-size-changer
      show-quick-jumper
      :show-total="(total) => `共 ${total} 条`"
      ></a-pagination>
    </div>
    <!-- 图片在页面显示的一个插件 -->
    <pic-preview
    :file-preview-show="previewShow"
    :img-list="preImages"
    :current-img="currentImg"
    @close="() => (previewShow = false)"
    ></pic-preview>
  </div>
</template>
<script>
import PicPreview from "@/components/PicPreview";
import {
product_paginate,  // 产品分页
company_products_list,  // 企业产品分页
} from "@/services/datacenter"
import { log } from '@antv/g2plot/lib/utils';
export default {
  props: {
    params: {
      //传递的数据
      type: Object,
    },
    event: {
      type: Function,
    },
  },
   components: {
    PicPreview,
  },
  data() {
    return {
      dataSource:{},  // 用来承接产品分页接口返回来的数据
      searchform: {
        keyword: undefined,
        types: "",
        page:1,
        per_page:10,
      },
      columns: [
        {
          title: "产品名称",
          dataIndex: "title",
          // align: "center",
          width: "200px",
          scopedSlots: { customRender: "titles" },
        },
        {
          title: "品类",
          dataIndex: "category",
          align: "center",
          width: "120px",
          scopedSlots: { customRender: "category" },
        },
        {
          title: "产品型号",
          dataIndex: "model",
          align: "center",
          width: "80px",
        },
        {
          title: "所属公司",
          align: "center",
          width: "150px",
          ellipsis: true,
          scopedSlots: { customRender: "affiliatedCompany" },
        },
        {
          title: "产品规格",
          dataIndex: "specs",
          align: "center",
          width: "80px",
        },
        // {
        //   title: "价格 (元)",
        //   dataIndex: "parkprice",
        //   align: "center",
        //   width: "120px",
        // },
        {
          title:'价格',
          align:'center',
          children:[
            {
              title: "园区价 (元)",
              dataIndex: "parkprice",
              align: "center",
              width: "80px",
            },
            {
              title: "出厂价 (元)",
              dataIndex: "factoryprice",
              align: "center",
              width: "80px",
            },
            {
              title: "零售价 (元)",
              dataIndex: "retailprice",
              align: "center",
              width: "80px",
            },
          ],
        },
        // {
        //   title: "库存",
        //   dataIndex: "stock",
        //   align: "center",
        //   width: "120px",
        // },
        {
          title:"库存",
          dataIndex:"stock",
          align: "center",
          width: "60px",
          scopedSlots: { customRender: "stock" },
        }
      ],
      taskData: {},
      loading: false,
      siteloading: true,
      sitelist: [],
      pageSizeOptions: ["10", "20", "30", "40"],
      indext: 0,
      areaPlot: {},
      indexl: 0,
      channeltree: [],
      sitetree: [],
      id: undefined,
      statusList: [
        // 查询字段状态列表
        "在产",
        "停产",
      ],
      categoryList: [
        // 查询字段品类列表
        "服饰",
        "水产",
        "五金",
        "化工",
        "食品",
        "其它",
      ],
      priceRangeList: [
        // 查询字段价格区间列表
        {min:0,max:50,value:"50及以下"},
        {min:50,max:100,value:"50~100"},
        {min:100,max:500,value:"100~500"},
        {min:500,max:1000,value:"500~1000"},
        {min:1000,max:5000,value:"1000~5000"},
        {min:5000,max:'',value:"5000及以上"},
      ],
      category: [], // 查询字段品类的选择框的双向绑定值
      color: ["red", "orange", "yellow", "green", "blue", "skyblue"], // 品类字段(以标签形式展示),对应的颜色数组
      // 图片
      previewShow:false,  // 表示组件弹窗默认是隐藏的
      preImages: [],  // 循环遍历图片初始化是一个空数组
      currentImg: "", //当前图片的初始化路径
    };
  },
  // 计算属性
  computed: {
    pagination: {
      get() {
        return {
          page: this.dataSource.page || 1,
          per_page: this.dataSource.per_page || 10,
          total: this.dataSource.total || 0,
        };
      },
      set(val) {
        this.dataSource.page = val.page;
        this.dataSource.per_page = val.per_page;
        this.dataSource.total = val.total;
      },
    },
  },
  created() {
    console.log('-----',this.params);
    /* 
    从 产品详情页（按序号排第二个页面）返回到企业列表页面（当前页面） 和 从产品列表页（按序号排第一个页面）到企业列表页面（当前页）
    params 中的参数不一样；
    从产品列表页（按序号排第一个页面）到企业列表页面（当前页）中的 params 中的 record 中的 company 是一个数组类型的
    从产品详情页（按序号排第二个页面）到企业列表页面（当前页）中的 params 中的 record 中的 company 是一个对象类型的
    */
    this.id = (this.params.record.company&&this.params.record.company[0])?this.params.record.company[0].id:""  || this.params.record.company.id;
    /* 
    思考一个问题，当我们从产品详情页（按序号排第二个页面）返回到企业列表页面（当前页面）的时候，page 可能不是 1，per_page 也可能不是 10；
    解答：在这里，看一下 this.params 中含不含有 searchform 对象，一般情况，如果有的话，都是从产品详情页面返回回来的，如果没有则表示页面
    不是返回操作回来的；如果 params 对象中含有 searchform 对象，那么我们就用 params 对象中的 searchform 对象覆盖掉当前页面的 searchform 对象
    如果 params 对象中不含有 searchform 对象，不对当前页面的 searchform 对象做修改
    */
    if(this.params&&this.params.flag==2){
      this.searchform = this.params?this.params.searchform:this.searchform;
    }
    /* 
    整理 params 对象中的 searchform 对象，如果 params 对象中有 researchform 对象（A 页面中的参数对象），就让 params 对象中的
    searchform 对象等于 params 对象中的 researchform 对象，否则，不对 params 对象中的 searchform 对象做修改，
    这样做的目的是，返回到 01 页面时，01 页面能更容易的回显渲染；
    */
    this.params.searchform = this.params.researchform?this.params.researchform:this.params.searchform,
    this.init();
  },
  methods: {
    init() {
      this.loading = true
      company_products_list(Object.assign(this.searchform,{id:this.id}))
      .then(res => {
        console.log('##########',res)
        this.loading = false
        this.dataSource = res.data.data;
      })
    },
    // 利用filter过滤数组,实现假查询(这里以品类为准)
    onSearch() {
      this.searchform.page = 1;
      this.searchform.per_page = 10;
      this.init();
    },
    // 分页
    changepage(page, pageSize) {
      this.searchform.page = page;
      this.searchform.per_page = pageSize;
      this.init();
    },
    loadDataSrouce() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    // 跳转到产品信息的可视化界面(product_visualization)
    onStatistics() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "productVisualization",
          params: {
            menus: ["productVisualization"],
          },
        },
      });
    },
    // 查询字段"品类"的回调函数
    handleChange_category(e) {
    },
    // 组件按钮,图片点击方法
    previews(record) {
      this.preImages = [record];
      this.currentImg = record;
      this.previewShow = true;
    },
    changeItem(index,item) {  // 我们这里只用到了 index 而没有用到 item
      if(index >=0 ){
        switch (this.priceRangeList[index].value) {
          case "50及以下":
          this.searchform.ivalue = 0;
          this.searchform.avalue = 50;
          break;
          case "50~100":
          this.searchform.ivalue = 50;
          this.searchform.avalue = 100;
          break;
          case "100~500":
          this.searchform.ivalue = 100;
          this.searchform.avalue = 500;
          break;
          case "500~1000":
          this.searchform.ivalue = 500;
          this.searchform.avalue = 1000;
          break;
          case "1000~5000":
          this.searchform.ivalue = 1000;
          this.searchform.avalue = 5000;
          break;
          case "5000及以上":
          this.searchform.ivalue = 5000;
          this.searchform.avalue = undefined;
          break;
        }
      } else {  // 就是说，如果没有选择价格的时候，我们把 ivalue 和 avalue 置为 undefined
        this.searchform.ivalue = undefined;
        this.searchform.avalue = undefined;
      }
    },
    // js 处理数字要求每隔三位数字添加一个逗号，在这里使用的是正则方法 
    format(text){
      const reg = /(\d)(?=(?:\d{3})+$)/g;
      return text.toString().replace(reg,'$1,');
    },
    // 点击产品名称，跳转到产品详情页
    onJump(record){
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "productDetails",
          params: {
            menus: ["productDetails"],
            record:record,  // 将上面插槽中的内容传递到详情页面里去
            page:this.searchform.page,
            per_page:this.searchform.per_page,
            repage:this.params.page,
            reper_page:this.params.per_page,
            researchform:this.params.searchform,
            searchform:this.searchform,
            flag:2
          },
        },
      });
    },
    back() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "productInformation",
          params: this.params,
        },
      });
    }
  },
};
</script>
<style scoped>
/* 返回按钮样式 */
.title_back {
  margin: 15px 24px;
  padding: 10px;
  background: #daedff;
  border: 1px solid #40a9ff;
  border-radius: 5px;
}
.toop {
  max-width: 500px;
}
</style>
<style lang="less">
</style>
<style scoped lang="less">
.main {
  height: 100%;
  overflow: auto;
  .task_list {
    margin: 24px;
    padding: 28px 24px;
    background: #fff;
    .task_list_title {
      width: 100%;
      clear: both;
      display: inline-block;
      .list_title {
        font-size: 16px;
        font-family: PingFang SC, PingFang SC-Medium;
        font-weight: 500;
        color: #000000d9;
        float: left;
        i {
          color: #bfbfbf;
          margin-left: 10px;
        }
      }
      .task_search {
        // float: right;
      }
    }
    .fabu_task {
      width: 100%;
      margin-top: 24px;
      font-size: 14px;
      color: #000000a6;
    }
    .task_table {
      margin: 4px auto 16px;
      a {
        color: #1890ff;
      }
      .table_titles {
        font-size: 15px;
        font-weight: 550;
        color: rgba(0, 0, 0, 0.65);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        margin-bottom: 5px;
        cursor: pointer;
      }
      .table_contents {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
      .locatoins {
        font-size: 14px;
        color: #1890ff;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        padding: 0 5px;
      }
    }
  }
}
</style>
