<!-- 企业经营信息(第五项) -->
<template>
  <div class="main">
    <div class="task_list">
      <div class="task_list_title">
        <!-- task_search样式为右浮动 -->
        <!-- <div class="task_search"> -->
        <div class="queryFieldArea">
          <!-- 关键词 -->
          <a-input
            placeholder="请输入关键词"
            allowClear
            v-model="searchform.keyword"
            style="width: 26%; margin: 5px 10px 10px 5px"
          />
          <!-- 行业分类 -->
          <a-tree-select
            style="width: 26%; margin: 5px 10px 10px 5px"
            multiple
            allowClear
            :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
            :treeData="industryLists"
            placeholder="请选择行业分类"
            v-model="searchform.category"
            :replaceFields="{
              value: 'title',
              title: 'title',
            }"
            :filterTreeNode="
              (value, node) => {
                const data = node.componentOptions.propsData.dataRef;
                return data.title.indexOf(value) !== -1;
              }">
          </a-tree-select>
          <!-- mode="multiple"这个属性一旦添加上,表示选择输入框可以多选了 -->
          <!-- 公司状态 -->
          <a-select
            placeholder="请选择公司状态"
            mode="multiple"
            allowClear
            v-model="searchform.status"
            style="width: 26%; margin: 5px 10px 10px 5px"
            @change="handleChangeStatus"
          >
            <a-select-option v-for="(item,index) in statusList" :key="index" :value="item.title"> {{item.title}} </a-select-option>
          </a-select>
          <!-- 查询字段中展示和隐藏的区域 -->
          <span v-if="show_hide">
            <!-- mode="multiple"这个属性一旦添加上,表示选择输入框可以多选了 -->
            <!-- 选择月份 -->
            <!-- <a-select
              placeholder="请选择月份"
              mode="multiple"
              v-model="searchform.month"
              allowClear
              style="width: 26%; margin: 5px 10px 10px 5px"
            >
              <a-select-option v-for="(item,index) in month" :key="index" :value="item"> {{item}} </a-select-option>
            </a-select> -->
            <!-- 年营业收入 -->
            <a-select
              placeholder="请选择年营业收入"
              mode="multiple"
              v-model="searchform.scale"
              allowClear
              style="width: 26%; margin: 5px 10px 10px 5px"
            >
              <a-select-option v-for="(item,index) in scaleList" :key="index" :value="item.title"> {{item.title}} </a-select-option>
            </a-select>
            <!-- 资质 -->
            <!-- 
              <a-input
              placeholder="请选择资质"
              allowClear
              v-model="searchform.qualification"
              style="width: 26%; margin: 5px 10px 10px 5px"
            /> 
            -->
          </span>
          <!-- :style="show_hide?'':'float:right'"表示是否动态的右浮动 -->
          <!-- <span :style="show_hide?'':'float:right'"> -->
          <span class="queryButtonGroup">
            <a-button @click="onSearch" type="primary" style="margin: 5px 10px 10px 5px">
              查询
            </a-button>
            <a @click="toggleshow_hide" style="margin-left: 10px">
              {{ show_hide ? "收起" : "展开" }}
              <a-icon :type="show_hide ? 'up' : 'down'" />
            </a>
          </span>
        </div>
      </div>
      <!-- 导出 统计 产品信息 功能部分 -->
      <div style="width: 100%; padding: 5px 0px;margin-top: 10px">
        <a-space>
          <!-- a-dropdown-button组件表现出的按钮,后面带...的 -->
          <!-- 
          <a-dropdown style="margin-left:5px">
            <a-button> 导出 <a-icon type="down" /></a-button>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="/resources/public/20220718/62d5167acc1561a8c3527964.xlsx" download="企业经营信息表"><a-icon type="download"/> 导出报表 </a>
              </a-menu-item>
              <a-menu-item>
                <a href="/resources/public/20220718/62d51cc3cc1561a8c3527970.png" download="企业经营信息-打印"><a-icon type="printer"/> 打印 </a>
              </a-menu-item>
            </a-menu>
          </a-dropdown> 
          -->
          <!-- <a-button @click="onStatistics()">统计</a-button> -->
          <a-button @click="onDistributionAll()" style="margin-left:5px"> 一键填报 </a-button>
          <!-- <a-button @click="onProductInfo()">产品信息</a-button> -->
        </a-space>
      </div>
      <!-- 表格 -->
      <a-table
        class="task_table"
        :columns="columns"
        :loading="loading"
        size="middle"
        rowKey="_id"
        :pagination="false"
        :dataSource="dataSource.items"
      >
        <!-- 企业名称字段的插槽(样式自定义) -->
        <span slot="titles" slot-scope="text, record">
          <a class="locatoins" @click="toDetails(record)"> {{ record.title }} </a>
        </span>
        <!-- 公司规模字段的插槽(样式自定义) -->
        <span slot="scale" slot-scope="text">
          <span v-if="text">
            <a-tag :color="color[scaleColor.indexOf(text)]" style="font-weight:600">{{text}}</a-tag>
          </span>
          <span v-else>
            <a-tag color="#eee" style="font-weight:400;color:#343434">{{'无'}}</a-tag>
          </span>
        </span>
        <!-- 行业分类字段的插槽（样式自定义） -->
        <span slot="oneIndustry" slot-scope="text">
          {{text?text:'无'}}
        </span>
        <!-- 公司状态字段的插槽(样式自定义) -->
        <span slot="status" slot-scope="text">
          <span v-if="text">
            <a-tag :color="color[statusColor.indexOf(text)]" style="font-weight:600">{{text}}</a-tag>
          </span>
          <span v-else>
            <a-tag color="#eee" style="font-weight:400;color:#343434">{{'无'}}</a-tag>
          </span>
        </span>
        <!-- 营业额字段的插槽(样式自定义) -->
        <span slot="nowYingyee" slot-scope="text,record">
          <span v-if="record.nowYingyee>=record.lastYingyee">
            <img src="../../images/arrowup.png" style="width:20px" />
            <br />
            <span style="font-weight:700;color:#d81e06">{{text.toFixed(1)}}</span>
          </span>
          <span v-else>
            <img src="../../images/arrowdown.png" style="width:20px" />
            <br />
            <span style="color:#3f8600;font-weight:700">{{text.toFixed(1)}}</span>
          </span>
        </span>
         <!-- 纳税字段的插槽(样式自定义) -->
        <span slot="nowNashui" slot-scope="text,record">
          <span v-if="record.nowNashui>=record.lastNashui">
            <img src="../../images/arrowup.png" style="width:20px" />
            <br />
            <span style="font-weight:700;color:#d81e06">{{text.toFixed(1)}}</span>
          </span>
          <span v-else>
            <img src="../../images/arrowdown.png" style="width:20px" />
            <br />
            <span style="color:#3f8600;font-weight:700">{{text.toFixed(1)}}</span>
          </span>
        </span>
        <!-- 月份字段的插槽(样式自定义) -->
        <span slot="release" slot-scope="text, record">
          <a-tag :color="monthColor(text)" style="font-weight:600">{{month[monthNum.indexOf(text.split("-")[1])]}}</a-tag>
        </span>
        <!-- 公司地址的插槽（样式自定义） -->
        <span slot="address" slot-scope="text, record">
          {{text?text:'无'}}
        </span>
        <!-- 操作字段的插槽（样式自定义） -->
        <span slot="action" slot-scope="text, record">
          <a href="#" @click="onDistribution(record)"><a-icon type="fullscreen" /> 填报 </a>
        </span>
      </a-table>
      <!-- 分页组件 -->
      <a-pagination
        size="small"
        class="paginations"
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
    <Applications v-if="false"></Applications>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import Applications from "../../../../applications/";
import {
manage_admin_paginate,  // 企业经营信息
dict_tree,  // 字典列表
manage_input_warn,  // 企业未填报预警
info_message,  // 经营预警分发
} from "@/services/datacenter"
export default {
  props: {
    params: {
      //传递的数据
      type: Object,
    },
    event: {
      type: Function,
    },
    onOpen: {
      type: Function,
    },
  },
  components: {
    Applications,
  },
  data() {
    return {
      searchform: {
        keyword: undefined,
        page:1,
        per_page:10,
      },
      documents: {
        degrees: [],
        number: 0,
      },
      columns: [
        {
          title: "企业名称",
          dataIndex: "title",
          width: "120px",
          scopedSlots: { customRender: "titles" },
        },
        {
          title: "法定代表人",
          dataIndex: "rperson",
          align: "center",
          width: "60px",
          scopedSlots: { customRender: "rperson" },
        },
        {
          title: "公司规模",
          dataIndex: "scale",
          align: "center",
          width: "60px",
          scopedSlots: { customRender: "scale" },
        },
        {
          title: "行业分类",
          dataIndex: "oneIndustry",
          align: "center",
          width: "80px",
          scopedSlots: { customRender: "oneIndustry" },
        },
        {
          title: "公司状态",
          dataIndex: "status",
          align: "center",
          width: "60px",
          scopedSlots: { customRender: "status" },
        },
        {
          title: "公司地址",
          dataIndex: "address",
          width: "140px",
          // align:'center',
          scopedSlots: { customRender: "address" },
          ellipsis:true,
        },
        {
          title: "操作",
          width: "60px",
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
      taskData: {},
      loading: false,
      selectedRowKeys: [],  // 默认是一个空数组，用来承接选中数据的 id
      pageSizeOptions: ["10", "20", "40", "60", "80", "100"],
      show_hide:false,  //查询字段是否全显示,false表示不全显示(折叠),true表示全显示(展开)
      statusList:[  //查询字段状态列表
        '在营','筹建','在建','停业','注销'
      ],
      scaleList:[  //查询字段规模列表
        '小微','中小','1000万以下'
      ],
      color:['blue','green','red','skyblue','deeppink','#f50','#2db7f5','#87d068','#108ee9','#C66584','#ff00ff','#ff8877','#1f9246'],  // 公司规模字段(以标签形式展示)，对应的颜色数组
      colorList:['skyblue','deeppink','#f50','#2db7f5','#87d068','#108ee9','#C66584','#ff00ff','#ff8877','#1f9246','#4511bf','#bf1145',],  // 月份字段(以标签形式展示)，对应的颜色数组
      // 年营业收入列表，等价于字典中的年营业收入，这个数组主要用来做不同状态的颜色区别
      scaleColor:["1000万以下","1000万~2000万","2000万~5000万","5000万~1亿","1亿以上","小微","中小","规上","中型"],
      // 状态列表，等价于字典中的状态列表，这个数组主要用来做不同状态的颜色区别
      statusColor:["筹建","在建","在营","停业","注销"],
      companyStatus:[],  // 查询字段公司状态选择框的双向绑定值
      month:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],  // 查询字段月份列表
      monthNum:['01','02','03','04','05','06','07','08','09','10','11','12'],
      industrytree: [  // 树形选择器的数据
        {
          key: "农业产品",
          children: [
            {
              key: "谷物",
            },
            {
              key: "油料",
            },
            {
              key: "豆类",
            },
            {
              key: "农作物副产品",
            },
          ],
        },
        {
          key: "农副食品加工业",
          children: [
            {
              key: "豆制品制造",
            },
            {
              key: "蛋品加工",
            },
            {
              key: "谷物磨制",
            },
            {
              key: "饲料加工",
            },
            {
              key: "植物油加工",
            },
          ],
        },
        {
          key: "有色金属",
          children: [
            { key: "贵金属矿" },
            {
              key: "常用有色金属矿",
              children: [
                { key: "铜矿" },
                { key: "镍矿" },
                { key: "钴矿" },
                { key: "锡矿" },
                { key: "镁矿" },
              ],
            },
            { key: "稀有稀土金属矿" },
            { key: "放射性金属矿" },
          ],
        },
      ],
      dataSource:{},  // 承接分页信息返回的参数
      industryLists:[],  // 
      industryList:[],  // 
    };
  },
  computed: {
    pagination: {
      get() {
        return {
          page: this.dataSource.page || 1,
          per_page: this.dataSource.per_page || 10,
        };
      },
      set(val) {
        this.dataSource.page = val.page;
        this.dataSource.per_page = val.per_page;
      },
    },
    detailsObj(){
      return this.dataSource;
    }
  },
  created() {
    // this.searchform.page = this.params.data?this.params.data.page:1;
    // this.searchform.per_page = this.params.data?this.params.data.per_page:10;
    this.init();  // 执行初始化方法
  },
  methods: {
    ...mapMutations("account", ["setUser", "setPermissions", "setRoles"]),
    ...mapMutations("websocket", ["setId"]),
    ...mapMutations("applications", ["addApps", "removeApps", "setApps"]),
    //查询字段是否全显示(切换)
    toggleshow_hide() {
      this.show_hide = !this.show_hide;
    },
    // init 初始化方法
    init() {
      this.loading = true;
      manage_input_warn(this.searchform)
      .then(res => {
        this.loading = false;
        this.dataSource = res.data.data;
      })
      dict_tree()
      .then(res => {
        // 公司状态列表
        this.statusList = res.data.data[6].children[0].children
        // 公司规模列表
        this.scaleList = res.data.data[6].children[1].children
        this.industryLists = res.data.data[6].children[3].children
      })
    },
    // 月份颜色 
    monthColor(text){
      return this.colorList[this.monthNum.indexOf(text.split("-")[1])]
    },
    // 查询
    onSearch() {
      this.searchform.page = 1;
      this.searchform.per_page = 10;
      this.init()
    },
    // 分页
    changepage(page, pageSize) {
      this.searchform.page = page;
      this.searchform.per_page = pageSize;
      this.init();
    },
    loadDataSrouce() {
      this.loading = true;
      setTimeout(()=>{
      this.loading = false;
      },500)
    },
    //数据统计(跳转页面,到宏观经济页面(product_visualization.vue))
    onStatistics(){
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "macroeconomicVisualization",
          params: {
            menus: ["macroeconomicVisualization"],
          },
        },
      });
    },
    //跳转到产品信息模块(tasklist)
    onProductInfo(){
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "tasklist",
          params: {
            menus: ["tasklist"],
          },
        },
      });
    },
    onDistribution(record){
    },
    // 查询字段"公司状态"的回调函数
    handleChangeStatus(e) {
    },
    // 我们在 a-table 组件中，我们定义了一个回调函数 onChange
    // 回调函数 onSelectChange
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 数据分发（单条）
    onDistribution(item) {
      var that = this;  // 把this里面的所有传给了that
      this.$confirm({
        title: "您确定要通知该企业填报数据吗?",
        icon: "info-circle",
        okText: "确定",
        cancelText: "取消",
        onOk() {  // 确定
          var parems = {id: item.id};  // 定义了一个对象，里面只有id这一个属性
          info_message(parems)  // 接口，方法
          .then(() => {
            that.$message.success("操作成功！");  // 弹出操作成功的提示
            that.init();  // 刷新页面
          }).catch((err) => {
            console.log(err);
          });
        },
        onCancel() {}  // 取消
      });
    },
    // 一键分发（所有）
    onDistributionAll(){
      var that = this;  // 把this里面的所有传给了that
      this.$confirm({
        title: "您确定要通知该企业填报数据吗?",
        icon: "info-circle",
        okText: "确定",
        cancelText: "取消",
        onOk() {  // 确定
          info_message(that.searchform)  // 接口，方法
          .then(() => {
            that.$message.success("操作成功！");  // 弹出操作成功的提示
            that.init();  // 刷新页面
          }).catch((err) => {
            console.log(err);
          });
        },
        onCancel() {}  // 取消
      });
    },
  },
};
</script>
<style scoped>
.task_table >>> .ant-table-body {
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
}
.toop {
  max-width: 500px;
}
.items_list .ant-list-item-meta {
  display: flex;
  align-items: center;
}
.queryFieldArea {
  position: relative;
}
.queryFieldArea .queryButtonGroup {
  display: block;
  position: absolute;
  right: 5px;
  top: 2px;
}
</style>
<style scoped lang="less">
.main {
  height: 100%;
  overflow: auto;
  .main_headers {
    background: #fff;
    padding: 16px 24px;
    .header_left {
      width: 50%;
      display: flex;
      justify-content: left;
      align-items: center;
      padding: 18px 0;
      img {
        width: 72px;
        height: 72px;
        border-radius: 50%;
      }
      .header_left_title {
        margin-left: 24px;
        .titles {
          font-size: 20px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.85);
        }
        .faburenwu {
          margin-top: 8px;
          width: 88px;
          height: 32px;
          line-height: 32px;
          background: #1890ff;
          font-size: 14px;
          text-align: center;
          color: #ffffff;
          border-radius: 3px;
          cursor: pointer;
        }
      }
    }
    .header_right {
      width: 50%;
      display: flex;
      justify-content: right;
      align-items: center;
      padding: 18px 0;
      .ant-divider-vertical {
        height: 40px;
        background: #e9e9e9;
      }
      .items {
        font-size: 14px;
        font-family: PingFang SC, PingFang;
        font-weight: 常规体;
        text-align: center;
        color: rgba(0, 0, 0, 0.45);
        width: 130px;
        div {
          font-size: 30px;
          font-family: HelveticaNeue;
          text-align: center;
          color: rgba(0, 0, 0, 0.85);
        }
      }
    }
  }
  .centers {
    display: flex;
    .a_cards {
      width: 100%;
      height: 460px;
      overflow: hidden;
      .ant-avatar {
        width: 40px;
        height: 40px;
      }
      .minis {
        width: 100%;
        height: 24px;
        margin-top: 50px;
        canvas {
          width: 100%;
        }
      }
    }
    .tasks {
      width: calc(50% - 36px);
      margin: 24px 12px 24px 24px;
      background: #fff;
      .ant-list-split .ant-list-item {
        height: 80px;
        // cursor: pointer;
      }
      .list_item {
        width: 120px;
        text-align: end;
        font-size: 14px;
        color: #00000040;
      }
    }
    .datas {
      width: calc(50% - 36px);
      margin: 24px 24px 24px 12px;
      background: #fff;
      .datas_title {
        font-size: 14px;
        text-align: left;
        margin: 24px 0 12px;
        color: rgba(0, 0, 0, 0.45);
      }
      .up {
        color: red;
      }
      .down {
        color: green;
      }
      .documents_num {
        font-size: 24px;
        color: #000000d9;
        margin-right: 28px;
      }
      .table_title {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        // color: #1890ff !important;
        a {
          color: #00aaf0 !important;
        }
      }
    }
    .tasks_title {
      font-size: 16px;
      font-weight: 500;
      color: #000000d9;
    }
    i {
      color: #bfbfbf;
      margin-left: 12px;
    }
    .active {
      color: #1890ff;
    }
  }
  .task_list {
    margin: auto 24px;
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
        float: right;  //右浮动
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
        color: #666;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        padding: 0 5px;
      }
    }
    .paginations {
      text-align: right;
      .ant-pagination-item-active {
        background: #1890ff;
        a {
          color: #fff !important;
        }
      }
    }
  }
  .overflows {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
  .channels {
    cursor: pointer;
    color: #1890ff;
  }
}
</style>
