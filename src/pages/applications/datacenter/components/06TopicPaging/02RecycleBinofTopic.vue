<!-- 回收站页面 -->
<template>
  <div class="main">
    <div class="title_back">
      <a @click="back()"><a-icon type="arrow-left" />返回</a>
    </div>
    <!-- 任务列表 -->
    <div class="task_list">
      <div class="task_list_title">
        <!-- task_search样式为右浮动 -->
        <!-- <div class="task_search"> -->
        <!-- <div>
          <a-input
            placeholder="请输入关键词"
            allowClear
            v-model="searchform.status"
            style="width: 26%; margin: 5px 10px 10px 5px"
          />
          <a-tree-select
            style="width: 26%; margin: 5px 10px 10px 5px"
            multiple
            allowClear
            :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
            :treeData="industrytree"
            placeholder="请选择行业分类"
            :replaceFields="{
              value: 'key',
              title: 'key',
            }"
            :filterTreeNode="
              (value, node) => {
                const data = node.componentOptions.propsData.dataRef;
                return data.key.indexOf(value) !== -1;
              }">
          </a-tree-select>
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
          <span style="float:right">
            <a-button @click="onSearch" type="primary" style="margin: 5px 10px 10px 5px">
              查询
            </a-button>
            <a @click="toggleshow_hide" style="margin-left: 10px">
              {{ show_hide ? "收起" : "展开" }}
              <a-icon :type="show_hide ? 'up' : 'down'" />
            </a>
          </span>
        </div> -->
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
        <!-- 企业名称字段的插槽(样式自定义) -->
        <span slot="titles" slot-scope="text, record">
          <a class="locatoins" @click="toDetails(record)">
            {{ record.title }}
          </a>
        </span>
        <!-- 名称字段的插槽(样式自定义) -->
        <span slot="titles" slot-scope="text, record" style="color:#d98719;font-size:15px">
            {{ record.title }}
        </span>
        <!-- 状态字段的插槽(样式自定义) -->
        <span slot="status" slot-scope="text, record">
          <a-progress 
          type="circle"
          :percent="parseInt((record.answers/record.companys)*100)" 
          :stroke-color = "{'0%': '#108ee9','100%': '#87d068'}"
          :width='50'
          />
        </span>
        <!-- 种类的插槽(样式自定义) -->
        <span slot="categorys" slot-scope="text">
          <span v-for="(item,index) in text" :key="index">
            <a-tag color='chocolate' style="margin-right:5px !important">{{item}}</a-tag>
          </span>
        </span>
        <!-- 操作字段的插槽(样式自定义) -->
        <span slot="action" slot-scope="text, record">
          <a href="#" @click="onReduction(record)" style="color:#4198e9;font-weight:700"><a-icon type="rollback" /> 还原 </a>
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
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import Applications from "../..";
import {
info_paginate,
info_restore,  // 企业信息还原
theme_paginate,  // 主题分页接口
theme_restore,   // 主题还原接口
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
      visible_business:false,  // 控制商务信息的显示与隐藏
      channelForm:{},  // 将基本信息数据渲染到表单里
      channelForm_business:{},  // 将商务信息数据渲染到自定义表单里
      searchform: {

      },
      page: 1,
      per_page: 10,
      columns: [
        {
          title: "主题名称",
          dataIndex: "title",
          align: "center",
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
        {
          title: "种类",
          dataIndex: "categorys",
          align: "center",
          width: "80px",
          scopedSlots: { customRender: "categorys" },
        },
        {
          title: "操作",
          width: "170px",
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
      taskData: {},
      loading: false,
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
      },
      set(val) {
        this.taskData.page = val.page;
        this.taskData.per_page = val.per_page;
        this.total = val.total;
      },
    },
  },
  created() {
    this.init();
  },
  methods: {
    ...mapMutations("account", ["setUser", "setPermissions", "setRoles"]),
    ...mapMutations("websocket", ["setId"]),
    ...mapMutations(["addApps", "removeApps", "setApps"]),
    // 页面初始执行的函数
    init() {
      theme_paginate({page:this.page,per_page:this.per_page,delete:true})
      .then(res => {
        this.enterpriseList = res.data.data
      })
    },
    // 查询
    onSearch() {
      this.loading = true;
      this.enterpriseList = this.enterpriseList_one
      this.pagination.page = 1;
      this.pagination.per_page = 10;
      this.enterpriseList = this.enterpriseList.filter((item) => {
        if(this.companyStatus.length == 0) {
          return true;
        }else{
          return(this.companyStatus.includes(item.companyStatus))
        }
      })
      setTimeout(() => {
        this.loading = false;
      }, 150);
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
    // 主题信息还原
    onReduction(item){
      var that = this;   //把this里面的所有传给了that
      this.$confirm({
        title: "您确定要还原此条数据吗?",
        icon: "info-circle",
        okText: "确定",
        cancelText: "取消",
        onOk() {  //确定
          var parems = {id: item.id};  //定义了一个对象，里面只有id这一个属性
          theme_restore(parems)  //接口，方法
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
    // 查询字段"公司状态"的回调函数
    handleChangeStatus(e) {
    },
    //返回
    back() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "topicPaging",
          params: {
            menus: ["topicPaging"],
            searchform:this.params.searchform,
          },
        },
      });
    },
  },
};
</script>

<style scoped>
/* 返回按钮样式 */
.title_back {
  margin: 10px 24px;
  padding: 10px;
  background: #daedff;
  border: 1px solid #40a9ff;
  border-radius: 5px;
  margin-bottom: 20px;
}
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
