<!-- 企业用户回收站页面 -->
<template>
  <div>
    <div class="title_back">
      <a @click="back()"><a-icon type="arrow-left" />返回</a>
    </div>
    <div class="main">
      <!-- 任务列表 -->
      <div class="task_list">
        <div class="task_list_title">
          <!-- task_search样式为右浮动 -->
          <!-- <div class="task_search"> -->
          <div>
            <!-- 关键词 -->
            <a-input
              placeholder="请输入用户名"
              allowClear
              v-model="searchform.keyword"
              style="width: 26%; margin: 5px 10px 10px 5px"
            />
            <!-- 公司名称 -->
            <a-input
              placeholder="请输入公司名称"
              allowClear
              v-model="county"
              style="width: 26%; margin: 5px 10px 10px 5px"
            />
            <span>
              <a-button @click="onSearch" type="primary" style="margin: 5px 10px 10px 5px">
                查询
              </a-button>
              <!-- <a @click="toggleshow_hide" style="margin-left: 10px">
                {{ show_hide ? "收起" : "展开" }}
                <a-icon :type="show_hide ? 'up' : 'down'" />
              </a> -->
            </span>
          </div>
        </div>
        <!-- 导出 统计 产品信息 功能部分 -->
        <div style="width: 100%; padding: 5px 0px;margin-top: 10px">
          <!-- 
          <a-space>
            <a-button @click="onAdd()"><a-icon type="user-add" />新增</a-button>
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
            <a-button @click="onStatistics()">统计</a-button>
            <a-button @click="onProductInfo()">产品信息</a-button>
            <a-button @click="recycleBin()"><a-icon type="delete" />回收站</a-button>
          </a-space> 
          -->
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
        >
          <!-- 企业名称字段的插槽(样式自定义) -->
          <!-- <span slot="titles" slot-scope="text, record">
            <a class="locatoins" @click="toDetails(record)">
              {{ record.title }}
            </a>
          </span> -->
          <!-- 法定代表人字段的插槽(样式自定义) -->
          <!-- <span slot="contact" slot-scope="text, record">{{ record.industry[0]?record.industry[0].legal:'' }}</span> -->
          <!-- 公司规模字段的插槽(样式自定义) -->
          <!-- <span slot="companySize" slot-scope="text, record">
            <a-tag :color="color[scaleList.indexOf(record.industry[0]?record.industry[0].scale:'')]" style="font-weight:600">{{record.industry[0]?record.industry[0].scale:''}}</a-tag>
          </span> -->
          <!-- 公司状态字段的插槽(样式自定义) -->
          <!-- <span slot="companyStatus" slot-scope="text, record">
            <a-tag :color="color[statusList.indexOf(record.industry[0]?record.industry[0].status:'')]" style="font-weight:600">{{record.industry[0]?record.industry[0].status:''}}</a-tag>
          </span> -->
          <!-- 手机号的插槽（样式自定义） -->
          <span slot="mobile" slot-scope="text, record">
            {{text?text:'无'}}
          </span>
          <!-- 成立日期的插槽(样式自定义) -->
          <span slot="establishmentDate" slot-scope="text, record">
            <span>{{text.split(" ")[0]}}</span>
          </span>
          <!-- 操作字段的插槽(样式自定义) -->
          <span slot="action" slot-scope="text, record">
            <a href="#" @click="onReduction(record)" style="color:#4198e9;font-weight:700"><a-icon type="rollback" /> 还原 </a>
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
      title="用户信息"
      :visible="visible"
      :width="700"
      :maskClosable="false"
      @ok="handleOk"
      @cancel="handleCancel"
      >
        <k-form-build :value="channelForm" ref="channelForm" :dynamicData = "dynamicDated"/>
      </a-modal>
    </div>
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
industry_create,  // 商务信息新增和编辑的接口
info_get,  // 企业信息详情
info_list,  // 企业列表
dict_tree,  // 字典列表
ruser_paginate,  // 用户分页接口
ruser_create,  // 用户创建接口
ruser_delete,  // 用户数据删除
ruser_restore,  // 用户数据还原
} from "@/services/datacenter";
import {
  user_add,  // 用户新增
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
      visible:false,  // 控制基本信息的弹窗的显示与隐藏
      visible_business:false,  // 控制商务信息的显示与隐藏
      channelForm:{},  // 将基本信息数据渲染到表单里
      channelForm_business:{},  // 将商务信息数据渲染到自定义表单里
      statusArray:[],  // 接字典树返回过来的数据，企业状态
      scaleArray:[],  // 接字典树返回过来的数据，企业规模
      searchform: {

      },
      page: 1,
      per_page: 10,
      columns: [
        {
          title: "用户名",
          dataIndex: "user[0].username",
          align: "center",
          width: "120px",
        },
        {
          title: "拥有公司",
          dataIndex: "company[0].title",
          align: "center",
          width: "120px",
        },
        {
          title: "手机号",
          dataIndex: "user[0].mobile",
          align: "center",
          width: "120px",
          scopedSlots: { customRender: "mobile" },
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
      companyLists:[],  // 承接公司列表接口返回来的数据
      county:"",  // 用于查询字段，是公司名称的双向绑定的字段
      countyList:[],  // 该数组接收分页返回的数据（所有的，因为这里请求分页的时候 page 为 1，per_page 为 1000 ），用于公司名的查询
      isdisabled:false,  // 分页组件默认可以使用
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
    dynamicData(){
        let result = {
          statusList:this.statusArray.map(item => {
            return {  //这里的return是map中自带的方法
              value:item.title,
              label:item.title,
            };
          }),
          scaleList:this.scaleArray.map(item => {
            return {  //这里的return是map中自带的方法
              value:item.title,
              label:item.title,
            };
          }),

        }
        return result;  // 返回
    },
    dynamicDated(){
      let result = {
        companyList:this.companyLists.map(item => {
          return {  // 这里的 return 是 map 中自带的方法，如果使用map，必须要使用return
            value:item.id,
            label:item.title,
          };
        }),
      }
      return result;
    }
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
      // 遮罩层的值置为 true，即开启状态
      this.loading = true;
      this.isdisabled = false;  // 分页组件启用
      ruser_paginate(Object.assign(this.searchform,{page:this.page,per_page:this.per_page,delete:true}))
      .then(res => {
        // 访问成功，遮罩层置为 false，即关闭状态
        this.loading = false
        this.userList = res.data.data
      })
      // 企业基本信息创建
      form_get({ name: "userAdd" })
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
    },
    // 查询
    onSearch() {
      this.loading = true;
      this.page = 1;
      this.per_page = 10;
      // 如果公司名称为空，会执行 init ，否则不执行
      if(this.county.trim() == "") {
        this.init()
      }
      // 如果公司名称查询字段不等于空，才会调用 onCounty 这个方法
      if(this.county.trim() !== "") {
        this.county = this.county.trim()
        this.onCounty()
      }
    },
    // 公司名查询
    onCounty(){
      ruser_paginate({page:1,per_page:1000,delete:true})
      .then(res => {
        // 访问成功，遮罩层置为 false，即关闭状态
        this.loading = false;
        this.countyList = res.data.data.items
        console.log('this.countyList',this.countyList)
        this.countyList = this.countyList.filter(item => {
          /*
          这里写 (item.company[0] && item.company[0].title.indexOf(this.county)>-1) 是为了解决 company[0] 这个对象中不存在 title 属性，会出现报错的问题
          (item.user[0] && item.user[0].username.indexOf(this.searchform.keyword)>-1) 解决相似的问题
          */
          if((item.company[0] && item.company[0].title.indexOf(this.county)>-1) && (item.user[0] && item.user[0].username.indexOf(this.searchform.keyword)>-1)) {
            return item
          }
        })
        this.userList.items = this.countyList
        console.log('this.userList',this.userList)
        {
          this.userList.total = this.countyList.length
          this.page = 1;
          this.per_page = this.countyList.length;
          this.isdisabled = true;  // 分页组件禁用
        }
      })
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
    // 用户的新增
    onAdd() {
      this.visible = true;
      this.id = undefined;  // 使用新增的方法时，id 就应该为 undefined
    },
    // 基本信息确定按钮
    handleOk(){
      this.$refs.channelForm.getData()  //获取添加的数据,从表单中获取最后一次的数据
      .then(data => {
        user_add(Object.assign(data,{id:this.id}))
        .then(res => {
          ruser_create(Object.assign({user:data.username},{company:data.company}))
          .then(item => {
            this.visible = false; //弹窗关闭
            this.$refs.channelForm.reset();  // 重置表单数据
            this.init();  // 调用init()函数，用来刷新页面
          })
        }).catch(error => {
          this.$message.error(error.response.data.message);
        })
      })
    },
    // 基本信息取消按钮
    handleCancel(){
      this.visible = false;  // 弹窗隐藏
      this.$refs.channelForm.reset();  // 重置了自定义表单
    },
    // 企业信息编辑
    onEdit(record){
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "enterprise_add_pages",
          params: {
            menus: ["enterprise_add_pages"],
            record:record
          },
        },
      });
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
          ruser_delete(parems)  //接口，方法
          .then(() => {
            that.$message.success("操作成功！");  //弹出操作成功的提示
            that.init();  //刷新页面
          }).catch((err) => {
          });
        },
        onCancel() {}  //取消
      });
    },
    // 基本信息编辑
    onBasicInfoEdit(record){
      info_get({id:record.id})  // 在企业信息详情接口中调用企业信息编辑接口，为了渲染返回来的数据
      .then(res => {
        this.visible = true;
        this.id = record.id;  // 获取这里的id
        this.$nextTick(() => {
          this.$refs.channelForm.setData({  // 这里是一打开弹窗时,需要想当前的弹窗中渲染当前该条数据的信息
            logo: res.data.data.logo,
            title: res.data.data.title,
            rperson: res.data.data.rperson,
            rmobile: res.data.data.rmobile,
            email: res.data.data.email,
            address: res.data.data.address,
            content: res.data.data.content,
          });
        });
      })
    },
    
    // 商务信息编辑
    onBusinessInfoEdit(record){
      info_get({id:record.id})  // 在企业信息详情接口中调用企业信息编辑接口，为了渲染返回来的数据
      .then(res => {
        this.visible_business = true;
        this.id = record.id;     //使用插槽，主要是获取这里的id
        this.$nextTick(() => {
          this.$refs.channelForm_business.setData({     //这里是一打开弹窗时,需要想当前的弹窗中渲染当前该条数据的信息
            release: res.data.data.industry[0].release,
            legal: res.data.data.industry[0].legal,
            status: res.data.data.industry[0].status,
            isHighCompany: res.data.data.industry[0].isHighCompany?'1':'0',  // 布尔值回显的方式
            scale: res.data.data.industry[0].scale,
            code: res.data.data.industry[0].code,
            longitude: res.data.data.industry[0].longitude,
            latitude: res.data.data.industry[0].latitude,
            oneIndustry: res.data.data.industry[0].oneIndustry,
            twoIndustry: res.data.data.industry[0].twoIndustry,
          });
        });
      })
    },
    // 商务信息确定按钮
    handleOk_business(){
      this.$refs.channelForm_business.getData()  //获取添加的数据,从表单中获取最后一次的数据
      .then((data) => {
        industry_create(Object.assign(data,{comeform:'PC端'},{company:this.id}))
        .then((res) => {
            this.visible_business = false; //弹窗关闭
            this.$refs.channelForm_business.reset();  // 重置表单数据, 
            this.init();  // 调用init()函数，用来刷新页面
        });
      });
    },
    // 商务信息取消按钮
    handleCancel_business(){
      this.visible_business = false;
      this.$refs.channelForm_business.reset();  // 重置了自定义表单

    },
    // 回收站
    recycleBin(){
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "userInformationRecycleBin",
          params: {
            menus: ["userInformationRecycleBin"],
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
          route: "productInformation",
          params: {
            menus: ["productInformation"],
          },
        },
      });
    },
    // 查询字段"公司状态"的回调函数
    handleChangeStatus(e) {
    },
    // 返回（企业用户分页）
    back() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "enterpriseUserCenterTab",  // 这里我们返回的是企业用户分页
          params: {
            menus: ["enterpriseUserCenterTab"],
            searchform:this.params.searchform,
            county:this.params.county,
          },
        },
      });
    },
    // 用户数据还原
    onReduction(item){
      var that = this;   //把this里面的所有传给了that
      this.$confirm({
        title: "您确定要还原此条数据吗?",
        icon: "info-circle",
        okText: "确定",
        cancelText: "取消",
        onOk() {  //确定
          var parems = {id: item.id};  //定义了一个对象，里面只有id这一个属性
          ruser_restore(parems)  //接口，方法
          .then(() => {
            that.$message.success("操作成功！");  //弹出操作成功的提示
            that.init();  //刷新页面
          }).catch((err) => {
          });
        },
        onCancel() {}  //取消
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
.title_back {
  margin: 10px 24px;
  padding: 10px;
  background: #daedff;
  border: 1px solid #40a9ff;
  border-radius: 5px;
  margin-bottom: 20px;
}
</style>
