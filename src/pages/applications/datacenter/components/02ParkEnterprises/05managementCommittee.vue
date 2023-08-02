<!-- 企业用户中心 -->
<template>
  <div class="main">
    <!-- 返回 -->
    <div class="title_back">
      <a @click="back()"><a-icon type="arrow-left" />返回</a>
    </div>
    <div class="task_list">
      <!-- 
      <div class="task_list_title">
        <div>
          <a-input
            placeholder="请输入用户名"
            allowClear
            v-model="searchform.keyword"
            style="width: 26%; margin: 5px 10px 10px 5px"
          /> 
          <span>
            <a-button @click="onSearch" type="primary" style="margin: 5px 10px 10px 5px">
              查询
            </a-button>
          </span> 
        </div>
      </div> 
      -->
      <!-- 新增、回收站 功能部分 -->
      <div style="width: 100%; padding: 5px 0px;">
        <a-space style="margin-left:5px">
          <a-button @click="onAdd()"><a-icon type="file-add" />新增</a-button>
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
        :dataSource="userList.items"
        bordered
      >
        <!-- 时间的插槽(样式自定义) -->
        <span slot="release" slot-scope="text">
          <span>{{text.split(" ")[0]}}</span>
        </span>
        <!-- 操作字段的插槽(样式自定义) -->
        <span slot="action" slot-scope="text, record">
          
          <a href="#" @click="onEdit(record)"><a-icon type="edit" /> 编辑 </a>
          <a-divider type="vertical" />
          <a href="#" @click="onDelete(record)" style="color:red"><a-icon type="delete" /> 删除 </a>
          <a-divider type="vertical" />
          <a href="#" @click="onDetails(record)"><a-icon type="file" /> 详情 </a>
        </span>
      </a-table>
      <!-- 分页组件 -->
      <a-pagination
        :disabled = "isdisabled"
        size="small"
        class="paginations"
        @change="changepage"
        :current="pagination.page"
        :pageSize="pagination.per_page"
        @showSizeChange="changepage"
        :pageSizeOptions="pageSizeOptions"
        :total="userList.total"
        :show-size-changer = "!isdisabled"
        :show-quick-jumper = "!isdisabled"
        :show-total="(total) => `共 ${total} 条`"
      ></a-pagination>
    </div>
    <Applications v-if="false"></Applications>
    <!-- 编辑企业基本信息的弹窗 -->
    <a-modal
    class="notification"
    :title="titles"
    :visible="visible"
    :width="800"
    :maskClosable="false"
    @ok="handleOk"
    @cancel="handleCancel"
    >
      <k-form-build :value="channelForm" ref="channelFormes" :dynamicData = "dynamicDated" :config="config"/>
    </a-modal>
    <a-drawer
    title="详情："
    placement="right"
    :visible="visible_details"
    :closable="true"
    :width="800"
    @close="handleCancel_details"
    >
      <a-spin class="spinclass" tip="Loading..." :spinning = 'isSpin'>
        <div v-html="dataStr"></div>
        <div style="height:30px">   </div>
      </a-spin>
      
    </a-drawer>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import Cookie from "js-cookie";
import Applications from "../..";
import {
form_get  // 导入自定义表单接口
} from "@/services/forms";
import {
info_paginate,
info_delete,  // 企业信息删除接口
info_edit,  // 企业信息编辑接口
industry_create,  // 商务信息新增和编辑的接口
info_get,  // 企业信息详情
info_list,  // 企业列表
dict_tree,  // 字典列表
ruser_paginate,  // 用户分页接口
ruser_create,  // 用户创建接口
ruser_delete,  // 用户数据删除
ruser_restore,  // 用户数据还原
ruser_policy,  // 用户策略列表
ruser_get,  // 企业用户获取
policy_list,  // 策略列表
company_managements_list,  // 管委会走访列表
company_managements_edit,  // 管委会走访编辑
company_managements_get,  // 管委会走访获取
company_managements_delete  // 管委会走访删除
} from "@/services/datacenter";
import {
  user_add,  // 用户新增
  user_edit,  // 用户编辑
  reset_password,  // 用户密码重置
} from "@/services/user";
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
      id:undefined,  // 用于分页接口的数据
      ids:undefined,  // 用于新增接口的数据
      visible:false,  // 控制基本信息的弹窗的显示与隐藏
      visible_business:false,  // 控制商务信息的显示与隐藏
      visible_details:false,
      channelForm:{},  // 将基本信息数据渲染到表单里
      channelForm_business:{},  // 将商务信息数据渲染到自定义表单里
      statusArray:[],  // 接字典树返回过来的数据，企业状态
      scaleArray:[],  // 接字典树返回过来的数据，企业规模
      searchform: {
        keyword:""
      },
      page: 1,
      per_page: 10,
      columns: [
        {
          title: "类型",
          dataIndex: "type",
          align: "center",
          width: "120px",
        },
        {
          title: "公司",
          dataIndex: "company",
          align: "center",
          width: "140px",
        },
        {
          title: "时间",
          dataIndex: "release",
          align: "center",
          width: "120px",
          scopedSlots:{ customRender:"release" }
        },
        {
          title: "操作",
          width: "150px",
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
      taskData: {},
      loading: false,  // 遮罩层默认为false，即关闭状态
      pageSizeOptions: ["10", "20", "30", "40"],
      applications: [],
      //用户信息列表
      userList:[],
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
      companyLists:[],  // 承接公司列表接口返回来的数据
      policyarr:[],  // 用户承接策略列表返回返回来的数据
      policyList:[],  // 用于向后端接口传策略
      countyList:[],  // 该数组接收分页返回的数据（所有的，因为这里请求分页的时候 page 为 1，per_page 为 1000 ），用于公司名的查询
      county:"",  // 用于查询字段，是公司名称的双向绑定的字段
      isdisabled:false,  // 分页组件默认可以使用
      managementCommitteeList:[],  // 管委会新增记录列表，用来承接字典列表（接口）返回来的数据
      titles:undefined,  // 弹窗的标题
      dataStr:'',  // 用来展示管委会记录的详情
      title_details:undefined,  // 管委会记录详情抽屉的标题
      isSpin:false,  // 管委会记录详情页面默认是不处于加载中状态的；
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
    dynamicDated(){
      let result = {
        typeList:this.managementCommitteeList.map(item => {
          return {  // 这里的 return 是 map 中自带的方法，如果使用map，必须要使用 return
            value:item.title,  // 向后台传递的数据其实是 value 对应的字段
            label:item.title,  // 在页面的下拉选择框中显示的是 label 对应的字段
          };
        }),
      }
      return result;  // 返回
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
  },
  created() {
    console.log('03params',this.params)
    this.id = this.params.record.id;
    this.company = this.params.record.id;
    this.release = this.params.record.release;
    this.init();
  },
  methods: {
    ...mapMutations("account", ["setUser", "setPermissions", "setRoles"]),
    ...mapMutations("websocket", ["setId"]),
    ...mapMutations(["addApps", "removeApps", "setApps"]),
    // 页面初始执行的函数
    init() {
      // 遮罩层的值置为 true，即开启状态
      this.loading = true;
      this.isdisabled = false;  // 分页组件启用
      company_managements_list(Object.assign(this.searchform,{id:this.id,page:this.page,per_page:this.per_page}))
      .then(res => {
        // 访问成功，遮罩层置为 false，即关闭状态
        this.loading = false
        this.userList = res.data.data
        console.log("userList",this.userList)
      })
      // 企业基本信息创建
      form_get({ name: "managementCommitteeAdd" })
      .then((response) => {
        this.channelForm = response.data.data.form;
      })
      .catch((error) => {
        this.$message.error(error);
      });
      info_list()
      .then(res => {
        this.companyLists = res.data.data
      })
      ruser_policy()
      .then(res => {
        this.policyarr = res.data.data;
      }),
      dict_tree()
      .then(res => {
        console.log('字典列表',res)
        // 管委会新增记录列表
        this.managementCommitteeList = res.data.data[6].children[11].children;
      })
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
    // 用户的新增
    onAdd() {
      this.visible = true;
      this.ids = undefined;  // 使用新增的方法时，id 就应该为 undefined
      this.titles = '记录新增';
    },
    // 弹窗确定按钮
    handleOk(){
      this.$refs.channelFormes.getData()  // 获取添加的数据,从表单中获取最后一次的数据
      .then(data => {
        console.log('0000',data)
        company_managements_edit(Object.assign(data,{id:this.ids,release:this.release,company:this.company}))
        .then(res => {
          this.visible = false; //弹窗关闭
          this.init();  // 调用init()函数，用来刷新页面
          this.$message.success("操作成功！");
          this.$refs.channelFormes.setData({
            type:[],
            content:' ',
          })
        }).catch(error => {
          this.$message.error(error.response.data.message);
          this.$refs.channelFormes.setData({
            type:[],
            content:' ',
          })
        })
      })
    },
    // 弹窗取消按钮
    handleCancel(){
      this.visible = false;  // 弹窗隐藏
      this.$refs.channelFormes.setData({
        type:[],
        content:' ',
      })
    },
    // 企业信息编辑
    onEdit(record){
      console.log('record',record)
      this.visible = true;
      this.ids = record.id;
      this.titles = '记录编辑';
      this.$nextTick(() => {
        this.$refs.channelFormes.setData({  // 这里是一打开弹窗时，需要想当前的弹窗中渲染当前该条数据的信息
          type: record.type,
          content:record.content,
        });
      });
    },
    // 企业信息删除
    onDelete(item){
      console.log('item',item)
      var that = this;   //把this里面的所有传给了that
      this.$confirm({
        title: "您确定要删除此条数据吗?",
        icon: "info-circle",
        okText: "确定",
        cancelText: "取消",
        onOk() {  //确定
          var parems = {id: item.id};  //定义了一个对象，里面只有id这一个属性
          company_managements_delete(parems)  //接口，方法
          .then(() => {
            that.$message.success("操作成功！");  //弹出操作成功的提示
            that.init();  //刷新页面
          }).catch((err) => {
          });
        },
        onCancel() {}  //取消
      });
    },
    // 点击打开详情页
    onDetails(record){
      this.visible_details = true;
      this.isSpin = true;
      company_managements_get({id:record.id})
      .then((res) => {
        console.log('-----',res)
        this.isSpin = false;
        this.title_details = res.data.data.type;
        this.$nextTick(() => {
          this.dataStr = res.data.data.content;
        })
      })
    },
    handleCancel_details(){
      this.visible_details = false;
      this.dataStr = ' ';
    },
    //返回
    back() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "Home",
          params: {
            data:this.params
          },
        },
      });
    }
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
.items_list .ant-list-item-meta {
  display: flex;
  align-items: center;
}
</style>
<style scoped lang="less">
.main {
  height: 100%;
  overflow: auto;
  /* 返回按钮样式 */
  .title_back {
    margin: 10px 24px;
    padding: 10px;
    background: #daedff;
    border: 1px solid #40a9ff;
    border-radius: 5px;
    margin-bottom: 20px;
  }
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

<style scoped>
  /* 样式传统，改变弹窗原有的样式 */
  .notification >>> .ant-modal-body {
    height:630px;
    overflow:auto;
  }
  .spinclass {
    height: 100vh;
  }
</style>
