<!-- 产品信息(第四项) -->
<template>
  <div class="main">
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
      <div style="width: 100%; padding: 5px 0px; margin: 10px 0 0 5px">
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
          <a-button @click="onAdd()">新增</a-button>
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
        :scroll="{ x: 1700 }"
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
                  {{record.company[0].title}}
                </a-tag>
              </template>
              <a href="JavaScript:;" @click="onList(record)">{{record.company[0].title}}</a>
            </a-popover>
          </template>
        </span>
        <!-- 产品规格字段插槽（样式自定义） -->
        <span slot="productSpecifications" slot-scope="text">
          {{ text }}
          <!-- {{text?text:'自定义'}} -->
        </span>
        <!-- 库存字段插槽（样式自定义） -->
        <span slot="stock" slot-scope="text">
          <!-- <a-tag :color="text == '在产' ? 'green' : 'red'" style="font-weight: 600"></a-tag> -->
          {{ format(text) }}
        </span>
        <!-- 操作字段插槽（样式自定义） -->
        <span slot="action" slot-scope="text,record">
          <!-- <a href="#" @click="toDetails(record)"><a-icon type="file-text" /> 详情 </a> -->
          <!-- <a-divider type="vertical" /> -->
          <a href="#" @click="onEdit(record)"><a-icon type="edit" /> 编辑 </a>
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
      >
      </a-pagination>
    </div>
    <!-- 图片在页面显示的一个插件 -->
    <pic-preview
    :file-preview-show="previewShow"
    :img-list="preImages"
    :current-img="currentImg"
    @close="() => (previewShow = false)"
    ></pic-preview>
    <!-- 产品信息新增时的弹窗 -->
    <a-modal
    :title="titles"
    width="60%"
    :confirm-loading="confirmLoading"
    :visible="formDialog"
    :maskClosable="false"
    class="productAdd"
    @ok="onSubmit"
    @cancel=" () => { formDialog = false; this.$refs.forms.reset(); }">
      <k-form-build :value="jsonData" :config="config" ref="forms" :dynamicData = "dynamicDated" />
    </a-modal>
  </div>
  
</template>
<script>
import PicPreview from "@/components/PicPreview";
import Cookie from "js-cookie";
import { form_get } from "@/services/forms";  // 引入自定义表单接口
import {
product_paginate,  // 产品分页
company_products_list,  // 企业产品分页
info_list,  // 企业列表
product_create,  // 产品新增
product_edit,  // 产品编辑
product_get,  // 产品详情
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
          width: 200,
          scopedSlots: { customRender: "titles" },
        },
        {
          title: "品类",
          dataIndex: "category",
          align: "center",
          width: 120,
          scopedSlots: { customRender: "category" },
        },
        {
          title: "产品型号",
          dataIndex: "model",
          align: "center",
        },
        {
          title: "所属公司",
          align: "center",
          ellipsis: true,
          scopedSlots: { customRender: "affiliatedCompany" },
          width: 300,
        },
        {
          title: "产品规格",
          dataIndex: "specs",
          align: "center",
          scopedSlots: { customRender: "productSpecifications" },
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
            },
            {
              title: "出厂价 (元)",
              dataIndex: "factoryprice",
              align: "center",
            },
            {
              title: "零售价 (元)",
              dataIndex: "retailprice",
              align: "center",
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
          scopedSlots: { customRender: "stock" },
        },
        {
          title:"操作",
          dataIndex: "action",
          align: "center",
          width: 200,
          scopedSlots: { customRender: "action" },
          fixed: "right"  // 最后一项，固定在最右侧
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
      color: ["red", "orange", "yellow", "green", "blue", "skyblue"], // 品类字段(以标签形式展示)，对应的颜色数组
      // 图片
      previewShow:false,  // 表示组件弹窗默认是隐藏的
      preImages: [],  // 循环遍历图片初始化是一个空数组
      currentImg: "", // 当前图片的初始化路径
      titles: "新增产品",
      formDialog: false,  // 产品新增模块弹窗默认不开启
      jsonData: {},
      confirmLoading: false,
      countylist:[],  // data 中新建一个空数组，用于接收接口中返回的数据
      draftId:"",
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
    config() {
      return {
        uploadFileHeaders: {
          Authorization: Cookie.get("Authorization"),
        },
        uploadImageHeaders: {
          Authorization: Cookie.get("Authorization"),
        },
      };
    },
    dynamicDated() {
      let result = {
        select_regious:this.countylist.map(item => {
          return {  // 这里的 return 是 map 中自带的方法，如果使用map，必须要使用 return
            value:item.id,  // 向后台传递的数据其实是 value 对应的字段
            label:item.title,  // 在页面的下拉选择框中显示的是 label 对应的字段
          };
        }),
      }
      return result;  // 返回
    }
  },
  created() {
    console.log('首页',this.params)
    /* 
    在这里，看一下 this.params 中含不含有 searchform 对象，一般情况下，如果有的话，都是从其他页面返回回来的，如果没有，则表示当前页面
    不是返回回来的；params 对象中如果含有 searchform 对象，那么我们就将 params 对象中的 searchform 对象覆盖掉当前 searchform 对象
    如果没有，不对当前 searchform 对象做改变
    */
    this.searchform = this.params&&this.params.searchform?this.params.searchform:this.searchform;
    this.init();
  },
  methods: {
    init() { 
      this.loading = true
      product_paginate(this.searchform)
      .then(res => {
        this.loading = false
        this.dataSource = res.data.data;
        console.log('------',this.dataSource)
      })
      form_get({ name: "productinfo_managementcomm" })
      .then((Response) => {
        this.jsonData = Response.data.data.form;
      })
      .catch((err) => {
        console.log(err);
      });
      // 企业信息列表
      info_list()
      .then(res => {
        this.countylist = res.data.data;
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
    // 产品新增模块
    onAdd(){
      this.formDialog = true;
      this.draftId = undefined;
      this.titles = "新增产品";
      this.methodes = product_create;
      this.$nextTick(() => {
        this.$refs.forms.reset();
      });
    },
    // 编辑
    onEdit(record) {
      this.formDialog = true;
      this.draftId = record.id;
      this.titles = "编辑产品";
      this.methodes = product_edit;
      product_get({ id: record.id })
      .then((response) => {
        this.$nextTick(() => {
          this.$refs.forms.setData({
            company:response.data.data.company,
            title: response.data.data.title,
            category: response.data.data.category,
            model: response.data.data.model || undefined,
            specs: response.data.data.specs || undefined,
            unit: response.data.data.unit || undefined,
            stock: response.data.data.stock || undefined,
            parkprice: response.data.data.parkprice || undefined,
            factoryprice: response.data.data.factoryprice || undefined,
            retailprice: response.data.data.retailprice || undefined,
            content: response.data.data.content || undefined,
            imgs: response.data.data.imgs || [],
            videos: response.data.data.videos || [],
          });
        });
      })
      .catch((error) => {
        console.log(error);
        this.$message.error(error.response.data.message);
      });
    },
    // 产品新增确定按钮
    onSubmit() {
      this.$refs.forms.getData()
      .then((values) => {
        this.confirmLoading = true;
        this.methodes(
          Object.assign(values, {
            id:this.draftId,
            comeform: "PC端",
          })
        )
          .then((response) => {
            this.formDialog = false;
            this.confirmLoading = false;
            this.init();
          })
          .catch((err) => {
            this.$message.error(err.response.data.message);
            this.formDialog = false;
            this.confirmLoading = false;
          });
      })
      .catch((err) => {
        console.log("err", err);
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
            searchform:this.searchform,
            flag:1,
          },
        },
      });
    },
    // 点击所属公司，跳转到该公司的产品列表
    onList(record){
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "businessProductList",
          params: {
            menus: ["businessProductList"],
            record:record,  // 将上面插槽中的内容传递到详情页面里去
            page:this.searchform.page,
            per_page:this.searchform.per_page,
            searchform:this.searchform,
          },
        },
      });
    },
  },
};
</script>
<style scoped>
/* .task_table >>> .ant-table-body {
  margin: 0 !important;
}
.task_table >>> .ant-table table {
  border-collapse: collapse;
  border-spacing: 0;
}
.task_table >>> .ant-table-thead > tr > th,
.task_table >>> .ant-table-tbody > tr > td,
.task_table >>> .ant-table-tbody > tr {
  border: none;
  border-bottom: 1px solid #e9e9e9;
} */
.toop {
  max-width: 500px;
}
.productAdd >>> .ant-modal-body {
  height: 640px;
  overflow-y: auto;
}
</style>
<style lang="less">
// .task_table {
//   // 清除tag标签自带的右侧外间距
//   .ant-tag {
//     margin-right: 0px !important;
//   }
// }
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
