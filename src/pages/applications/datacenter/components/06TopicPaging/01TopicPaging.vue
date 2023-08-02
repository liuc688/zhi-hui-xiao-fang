<!-- 主题调查分页 -->
<template>
  <div class="main">
    <!-- 任务列表 -->
    <div class="task_list">
      <div class="task_list_title">
        <div>
          <!-- 关键词 -->
          <a-input
          placeholder="请输入关键词"
          allowClear
          v-model="searchform.keyword"
          style="width: 26%; margin: 5px 10px 10px 5px"
          />
          <!-- 行业分类 -->
          <!-- 
          <a-tree-select
          style="width: 26%; margin: 5px 10px 10px 5px"
          multiple
          allowClear
          :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
          :treeData="industryLists"
          placeholder="请选择行业分类"
          :replaceFields="{
            value: 'title',
            title: 'title',
          }"
          :filterTreeNode="
            (value, node) => {
              const data = node.componentOptions.propsData.dataRef;
              return data.key.indexOf(value) !== -1;
            }">
          </a-tree-select> 
          -->
          <!-- mode="multiple"这个属性一旦添加上,表示选择输入框可以多选了 -->
          <!-- 公司状态 -->
          <!-- 
          <a-select
          placeholder="请选择公司状态"
          mode="multiple"
          allowClear
          v-model="companyStatus"
          style="width: 26%; margin: 5px 10px 10px 5px"
          @change="handleChangeStatus"
          >
            <a-select-option v-for="(item,index) in statusList" :key="index" :value="item"> {{item}} </a-select-option>
          </a-select> 
          -->
          <!-- 查询字段中展示和隐藏的区域 -->
          <!-- 
          <span v-if="show_hide">
            <a-select
            placeholder="请选择规模"
            mode="multiple"
            allowClear
            style="width: 26%; margin: 5px 10px 10px 5px"
            >
              <a-select-option v-for="(item,index) in scaleList" :key="index"> {{item}} </a-select-option>
            </a-select>
            <a-input
            placeholder="请选择资质"
            allowClear
            v-model="searchform.qualification"
            style="width: 26%; margin: 5px 10px 10px 5px"
            />
            <a-input
            placeholder="请选择荣誉"
            allowClear
            v-model="searchform.honor"
            style="width: 26%; margin: 5px 10px 10px 5px"
            />
          </span> 
          -->
          <!-- :style="show_hide?'':'float:right'"表示是否动态的右浮动 -->
          <!-- <span :style="show_hide?'':'float:right'"> -->
          <span>
            <a-button @click="onSearch" type="primary" style="margin: 5px 10px 10px 5px"> 查询 </a-button>
            <!-- 
            <a @click="toggleshow_hide" style="margin-left: 10px">
              {{ show_hide ? "收起" : "展开" }}
              <a-icon :type="show_hide ? 'up' : 'down'" />
            </a> 
            -->
          </span>
        </div>
      </div>
      <!-- 导出 统计 产品信息 功能部分 -->
      <div style="width: 100%; padding: 5px 0px;margin-top: 10px">
        <a-space style="margin-left:5px">
          <a-button @click="onAdd()"><a-icon type="file-add" />新增</a-button>
          <!-- a-dropdown-button组件表现出的按钮,后面带...的 -->
          <!-- 
          <a-dropdown style="margin-left:5px">
            <a-button> 导出 <a-icon type="down" /></a-button>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="/resources/public/20220718/62d5167acc1561a8c3527964.xlsx" download="企业信息表"><a-icon type="download"/> 导出报表 </a>
              </a-menu-item>
              <a-menu-item>
                <a href="/resources/public/20220718/62d51887cc1561a8c352796d.png" download="企业信息-打印"><a-icon type="printer"/> 打印 </a>
              </a-menu-item>
            </a-menu>
          </a-dropdown> 
          -->
          <!-- 
          <a-button @click="onStatistics()">统计</a-button>
          <a-button @click="onProductInfo()">产品信息</a-button> 
          -->
          <a-button @click="recycleBin()"><a-icon type="delete" />回收站</a-button>
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
      :dataSource="enterpriseList.items"
      >
        <!-- 名称字段的插槽(样式自定义) -->
        <span slot="titles" slot-scope="text, record" style="color:#d98719;font-size:15px">
            {{ record.title }}
        </span>
        <!-- 状态字段的插槽(样式自定义) -->
        <span slot="status" slot-scope="text, record">
          <div v-if="record.number !== 0" style="cursor:pointer;">
            <a-progress 
            type="circle"
            :percent="parseInt((record.answer/record.number)*100)"
            :stroke-color = "{'0%': '#108ee9','100%': '#87d068'}"
            :width='50'
            />
          </div>
          <div v-else style="cursor:pointer;">
            <a-tooltip title="无公司符合要求，不需填报！">
              <div style="font-size:18px;color:red">N/A</div>
            </a-tooltip>
          </div>
        </span>
        <!-- 种类的插槽(样式自定义) -->
        <span slot="categorys" slot-scope="text">
          <span v-for="(item,index) in category(text)" :key="index">
            <a-tag color='chocolate' style="margin-right:5px !important">{{item}}</a-tag>
          </span>
        </span>
        <!-- 操作字段的插槽(样式自定义) -->
        <span slot="action" slot-scope="text, record">
          <a-button type='link' @click="onEdit(record)"><a-icon type="edit" /> 编辑 </a-button>
          <a-divider type="vertical" />
          <a-button type='link' @click="onDelete(record)" style="color:red"><a-icon type="delete" /> 删除 </a-button>
          <a-divider type="vertical" />
          <a-button type='link' size='small' @click="toDetails(record)" :disabled='record.companys == 0?true:false'><a-icon type="file-text" /> 详情 </a-button>
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
      :total="enterpriseList.total"
      show-size-changer
      show-quick-jumper
      :show-total="(total) => `共 ${total} 条`"
      ></a-pagination>
    </div>
    <Applications v-if="false"></Applications>
    <!-- 新增和编辑主题填报的弹窗 -->
    <a-modal
    title="主题调查"
    :visible="visible"
    :width="900"
    :maskClosable="false"
    @ok="handleOk"
    @cancel="handleCancel"
    >
      <k-form-build :value="channelForm" ref="channelForm" :dynamicData="dynamicData" />
    </a-modal>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import Applications from "../..";
import {
form_get  // 导入自定义表单接口
} from "@/services/forms";
import {
info_paginate,
info_delete,  // 企业信息删除接口
info_edit,  // 企业信息编辑接口
info_get,  // 企业信息详情
dict_tree,  // 字典列表
theme_paginate,  // 主题分页接口
theme_create,  // 主题创建
theme_edit,  // 主题填报编辑
theme_get,  // 主题详情
theme_info,  // 主题信息，用于主题数据的编辑，theme_get接口也可以，只是theme_get接口数据太多了，很多用不到，影响性能
theme_delete,  // 主题删除
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
      visible:false,  // 控制基本信息的弹窗的显示与隐藏
      channelForm:{},  // 将基本信息数据渲染到表单里
      statusArray:[],  // 接字典树返回过来的数据，企业状态
      scaleArray:[],  // 接字典树返回过来的数据，企业规模
      searchform: {
      },
      page: 1,
      per_page: 10,
      columns: [
        {
          title: "主题名称",
          dataIndex: "title",
          width: "150px",
          scopedSlots: { customRender: "titles" },
        },
        {
          title: "完成状态",
          dataIndex: "status",
          align: "center",
          width: "90px",
          scopedSlots:{ customRender:'status' }
        },
        {
          title: "开始时间",
          dataIndex: "start",
          align: "center",
          width: "80px",
        },
        {
          title: "结束时间",
          dataIndex: "end",
          align: "center",
          width: "80px",
        },
        // {
        //   title: "状态",
        //   dataIndex: "",
        //   align: "center",
        //   width: "80px",
        // },
        {
          title: "操作",
          width: "170px",
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
      taskData: {},
      loading: false,  // 遮罩层默认为false，即关闭状态
      pageSizeOptions: ["10", "20", "30", "40"],
      applications: [],
      //企业信息列表
      enterpriseList:[],
      total:0,  // total表示分页数据的总条数
      show_hide:false,  //查询字段是否全显示,false表示不全显示(折叠),true表示全显示(展开)
      statusList:[  //查询字段状态列表
        '在营','筹建','在建','停业','注销'
      ],
      scaleList:[  //查询字段规模列表
        '小微','中小','规上'
      ],
      color:['blue','green','red','skyblue','deeppink'],  //公司规模字段(以标签形式展示),对应的颜色数组
      companyStatus:[],  // 查询字段公司状态选择框的双向绑定值
      id:undefined,
      industryLists:[],  // 行业分类列表，里面的数据是一个树型的结构
      industryList:[],  // 行业分类列表，里面的数据是一个树型的结构，经过了industryLists数组处理
      // detailObj:{},
    };
  },
  computed: {
    pagination: {
      get() {
        return {
          page: this.page || 1,
          per_page: this.per_page || 10,
          total: this.total || 0,
        };
      }
    },
    dynamicData(){
      let result = {
        statusList:this.statusArray.map(item => {
          return {  // 这里的 return 是 map 中自带的方法
            value:item.title,
            label:item.title,
          };
        }),
        scaleList:this.scaleArray.map(item => {
          return {  // 这里的 return 是 map 中自带的方法
            value:item.title,
            label:item.title,
          };
        }),
        categoryList:this.industryList
      }
      return result;  // 返回
    },
    statusComputed(record) {

    },
    detailsObj(){
      return this.enterpriseList;
    }
  },
  created() {
    console.log('01params',this.params);
    // 下面这两句代码的意思是，详情页返回，回到进入详情页前的页面，这就要求 page 和 per_page 要和之前一致
    this.page = this.params.details?this.params.details.page:1;
    this.per_page = this.params.details?this.params.details.per_page:10;
    this.searchform = this.params&&this.params.searchform?this.params.searchform:this.searchform;
    this.$nextTick(() => {
      this.init();
    })
  },
  methods: {
    ...mapMutations("account", ["setUser", "setPermissions", "setRoles"]),
    ...mapMutations("websocket", ["setId"]),
    ...mapMutations(["addApps", "removeApps", "setApps"]),
    // 页面初始执行的函数
    init() {
      // 遮罩层的值置为 true，即开启状态
      this.loading = true;
      theme_paginate(Object.assign(this.searchform,{page:this.page,per_page:this.per_page}))
      .then(res => {
        // 访问成功，遮罩层置为 false，即关闭状态
        this.loading = false
        this.enterpriseList = res.data.data
      })
      // 企业基本信息创建
      form_get({ name: "topicAdd" })
      .then((response) => {
        this.channelForm = response.data.data.form;
      })
      .catch((error) => {
        this.$message.error(error);
      });
      // 字典列表
      dict_tree()
      .then(res => {
        this.statusArray = res.data.data[6].children[0].children
        this.scaleArray = res.data.data[6].children[1].children
        this.industryLists = res.data.data[6].children[3].children
        this.industryList = this.digui(this.industryLists);
      })
    },
    // 递归
    digui(tree){
      for(let i=0;i<tree.length;i++) {
        tree[i].id = tree[i].title;
        if(tree[i].children && tree[i].children.length) {
          this.digui(tree[i].children)
        }
      }
      return tree;
    },
    // 种类数组去重
    category(val){
      var categoryOnly = [... new Set(val)];
      return categoryOnly.length ? categoryOnly : ""
    },
    // 查询
    onSearch() {
      this.loading = true;
      this.page = 1;
      this.per_page = 10;
      this.init()
    },
    //查询字段是否全显示(切换)
    toggleshow_hide() {
      this.show_hide = !this.show_hide;
    },
    // 分页
    changepage(page, pageSize) {
      this.page = page;
      this.per_page = pageSize;
      this.pagination.page = page;
      this.pagination.per_page = pageSize;
      this.init();
    },
    // 假的刷新
    loadDataSrouce() {
      this.loading = true;
      setTimeout(()=>{
      this.loading = false;
      },500)
    },
    // 企业信息的新增
    onAdd() {
      // this.visible = true;
      // this.method = theme_create;
      // this.id = undefined;
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "topicDataAdded",
          params: {
            menus: ["topicDataAdded"],
            searchform:this.searchform
          },
        },
      });
    },
    // 编辑功能虽然和新增都是跳转到同一个页面，但是写了两个方法 onAdd、onEdit，因为编辑的时候需要传递参数 id
    onEdit(item) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "topicDataAdded",
          params: {
            menus: ["topicDataAdded"],
            id:item.id,
          },
        },
      });
    },
    // 基本信息确定按钮
    handleOk(){
      this.$refs.channelForm.getData()  //获取添加的数据,从表单中获取最后一次的数据
      .then((data) => {
        this.method(Object.assign(data,{id:this.id}))
        .then((res) => {
          this.visible = false; //弹窗关闭
          this.$refs.channelForm.reset();  // 重置表单数据, 
          this.init();  // 调用init()函数，用来刷新页面
        });
      });
    },
    // 基本信息取消按钮
    handleCancel(){
      this.visible = false;  // 弹窗隐藏
      this.$refs.channelForm.reset();  // 重置了自定义表单
    },
    // 企业信息删除
    onDelete(item){
      var that = this;   //把this里面的所有传给了that
      this.$confirm({
        title: "您确定要删除此条数据吗?",
        icon: "info-circle",
        okText: "确定",
        cancelText: "取消",
        onOk() {  //确定
          var parems = {id: item.id};  //定义了一个对象，里面只有id这一个属性
          theme_delete(parems)  //接口，方法
          .then(() => {
            that.$message.success("操作成功！");  //弹出操作成功的提示
            that.init();  //刷新页面
          }).catch((err) => {
            console.log(err);
          });
        },
        onCancel() {}  //取消
      });
    },
    // 回收站
    recycleBin(){
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "recycleBinofTopic",
          params: {
            menus: ["recycleBinofTopic"],
            searchform:this.searchform,
          },
        },
      });
    },
    // 数据统计(跳转页面,到宏观经济页面(product_visualization.vue))
    onStatistics(){
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "enterpriseVisualization",
          params: {
            menus: ["enterpriseVisualization"],
          },
        },
      });
    },
    // 跳转到产品信息模块(跳转页面,到产品信息页面(tasklist.vue))
    onProductInfo(){
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "tasklist",
          params: {
          },
        },
      });
    },
    // 跳转到主题调查的详情页
    toDetails(record) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "topicDetail",
          params: {
            menus: ["topicDetail"],
            record:record,  // 将上面插槽中的内容传递到详情页面里去
            details:this.detailsObj,
            searchform:this.searchform,
          },
        },
      });
    },
    // 查询字段"公司状态"的回调函数
    handleChangeStatus(e) {
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
        a {
          color: #00aaf0 !important;
        }
      }
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
        font-weight: 600;
        color: #1890ff;
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
<style scoped>
/* 自定义操作中按钮的样式 */
.task_table >>> .ant-btn {
  padding: 0 0 !important;
}
</style>
