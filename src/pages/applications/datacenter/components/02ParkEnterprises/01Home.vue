<!-- 园区企业(第二项) -->
<template>
  <div class="main">
    <!-- 任务列表 -->
    <div class="task_list">
      <div class="task_list_title">
        <!-- 查询区域 -->
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
            :treeData="industryList"
            v-model="searchform.category"
            placeholder="请选择行业分类"
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
            <a-select-option v-for="(item,index) in statusLists" :key="index" :value="item.title"> {{item.title}} </a-select-option>
          </a-select>
          <!-- 查询字段中展示和隐藏的区域 -->
          <span v-if="show_hide">
            <a-select
              placeholder="请选择年营业收入"
              mode="multiple"
              v-model="searchform.scale"
              allowClear
              style="width: 26%; margin: 5px 10px 10px 5px"
            >
              <a-select-option v-for="(item,index) in scaleLists" :key="index" :value="item.title"> {{item.title}} </a-select-option>
            </a-select>
            <a-select
              placeholder="请选择资质荣誉"
              mode="multiple"
              v-model="searchform.title"
              allowClear
              style="width: 26%; margin: 5px 10px 10px 5px"
            >
              <a-select-option v-for="(item,index) in qualificationList" :key="index" :value="item.title"> {{item.title}} </a-select-option>
            </a-select>
          </span>
          <!-- :style="show_hide?'':'float:right'"表示是否动态的右浮动 -->
          <!-- <span :style="show_hide?'':'float:right'"> -->
          <span class="queryButtonGroup">
          <!-- <span> -->
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
          <a-button @click="onAdd()" style="margin-left:5px">新增</a-button>
          <!-- a-dropdown-button组件表现出的按钮,后面带...的 -->
          <!-- <a-dropdown style="margin-left:5px">
            <a-button> 导出 <a-icon type="down" /></a-button>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="/resources/public/20220718/62d5167acc1561a8c3527964.xlsx" download="企业信息表"><a-icon type="download"/> 导出报表 </a>
              </a-menu-item>
              <a-menu-item>
                <a href="/resources/public/20220718/62d51887cc1561a8c352796d.png" download="企业信息-打印"><a-icon type="printer"/> 打印 </a>
              </a-menu-item>
            </a-menu>
          </a-dropdown> -->
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
        bordered
        :scroll="{ x: 1600 }"
      >
        <!-- 企业名称字段的插槽(样式自定义) -->
        <span slot="titles" slot-scope="text, record">
          <span class="locatoins">
            {{ record.title }}
          </span>
        </span>
        <!-- 法定代表人字段的插槽(样式自定义) -->
        <span slot="contact" slot-scope="text, record">
          <span v-if="record.industry&&record.industry[0]">
            {{ record.industry[0]?record.industry[0].legal:'' }}
          </span>
          <span v-else>
            无
          </span>
        </span>
        <!-- 年营业收入字段的插槽(样式自定义) -->
        <span slot="companySize" slot-scope="text, record">
          <span v-if="record.industry&&record.industry[0]">
            <a-tag :color="color[scaleColor.indexOf(record.industry[0]?record.industry[0].scale:'')]" style="font-weight:600">{{record.industry[0]?record.industry[0].scale:''}}</a-tag>
          </span>
          <span v-else>
            <a-tag color="#eee" style="color:#343434">{{'无'}}</a-tag>
          </span>
        </span>
        <!-- 公司状态字段的插槽(样式自定义) -->
        <span slot="companyStatus" slot-scope="text, record">
          <span v-if="record.industry&&record.industry[0]">
            <a-tag :color="color[statusColor.indexOf(record.industry[0]?record.industry[0].status:'')]" style="font-weight:600">{{record.industry[0]?record.industry[0].status:''}}</a-tag>
          </span>
          <span v-else>
            <a-tag color="#eee" style="color:#343434">{{'无'}}</a-tag>
          </span>
        </span>
        <!-- 成立日期的插槽(样式自定义) -->
        <span slot="establishmentDate" slot-scope="text, record">
          <span  style="font-weight:600">{{record.industry[0]?record.industry[0].release:''}}</span>
        </span>
        <!-- 企业地址的插槽（样式自定义） -->
        <span slot="businessAddress" slot-scope="text, record">
          {{text?text:'无'}}
        </span>
        <!-- 操作字段的插槽(样式自定义) -->
        <span slot="action" slot-scope="text, record" class="actions">
          <!-- <a-dropdown style="margin-left:5px">
            <a> 编辑 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="onBasicInfoEdit(record)"><a-icon type="edit"/> 基础信息编辑 </a>
              </a-menu-item>
              <a-menu-item>
                <a @click="onBusinessInfoEdit(record)"><a-icon type="edit"/> 商务信息编辑 </a>
              </a-menu-item>
            </a-menu>
          </a-dropdown> -->
          <!-- 
          <a @click="onBasicInfoEdit(record)"><a-icon type="edit"/> 编辑 </a>
          <a-divider type="vertical" /> 
          -->
          <!-- <a-button type="link" @click="toDetails(record)" :disabled='!(record.industry&&record.industry.length)'><a-icon type="file-text" /> 详情 </a-button> -->
          <a-button type="link" @click="toDetails(record)"><a-icon type="file-text" /> 详情 </a-button>
          <a-divider type="vertical" />
          <a href="#" @click="onDelete(record)" style="color:red"><a-icon type="delete" /> 删除 </a>
          <a-divider type="vertical" />
          <a-button type="link" @click="managementCommittee(record)"><a-icon type="form" /> 管委会 </a-button>
        </span>
      </a-table>
      <!-- 分页组件 -->
      <!-- pageSize 表示每页多少条数据 -->
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
    <!-- 新增企业信息的弹窗 -->
    <!-- <a-modal
    title="基本信息编辑"
    :visible="visible_onAdd"
    :width="900"
    :maskClosable="false"
    @ok="handleOk_onAdd"
    @cancel="handleCancel_onAdd"
    >
      <k-form-build :value="channelForm_onAdd" ref="channelForm_onAdd" :config="config" />
    </a-modal> -->
    <!-- 编辑企业基本信息的弹窗 -->
    <a-modal
    :title="title"
    :visible="visible"
    :width="900"
    :maskClosable="false"
    @ok="handleOk"
    @cancel="handleCancel"
    >
      <k-form-build :value="channelForm" ref="channelForm" :config="config" />
    </a-modal>
    <!-- 编辑企业商务信息的弹窗 -->
    <a-modal
    title="商务信息编辑"
    :visible="visible_business"
    :width="900"
    :maskClosable="false"
    @ok="handleOk_business"
    @cancel="handleCancel_business"
    >
      <k-form-build :value="channelForm_business" ref="channelForm_business" :dynamicData="dynamicData" />
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
info_admin_create,  // 基本信息新增接口
info_paginate,
info_delete,  // 企业信息删除接口
info_edit,  // 企业信息编辑接口
industry_create,  // 商务信息新增和编辑的接口
info_get,  // 企业信息详情
dict_tree,  // 字典列表
info_admin_verify,  // 企业用户新增时，验证（公司名或者联系方式重复不）
} from "@/services/datacenter"
import Cookie from "js-cookie";
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
      title:"",  // 新增和编辑时窗口展示不一样的 title
      visible:false,  // 控制基本信息的弹窗的显示与隐藏
      visible_business:false,  // 控制商务信息的显示与隐藏
      channelForm:{},  // 将基本信息数据渲染到表单里
      channelForm_business:{},  // 将商务信息数据渲染到自定义表单里
      statusArray:[],  // 接字典树返回过来的数据，企业状态
      scaleArray:[],  // 接字典树返回过来的数据，年营业收入
      searchform: {
      },
      page: 1,
      per_page: 10,
      columns: [
        {
          title: "企业名称",
          dataIndex: "title",
          width: 300,
          scopedSlots: { customRender: "titles" },
        },
        {
          title: "法定代表人",
          align: "center",
          scopedSlots: { customRender: "contact" },
        },
        {
          title: "年营业收入",
          align: "center",
          scopedSlots: { customRender: "companySize" },
        },
        {
          title: "联系电话",
          dataIndex: "rmobile",
          align: "center",
        },
        {
          title: "公司状态",
          dataIndex: "companyStatus",
          align: "center",
          scopedSlots: { customRender: "companyStatus" },
        },
        {
          title: "企业地址",
          dataIndex: "address",
          scopedSlots: { customRender: "businessAddress" },
          ellipsis: true,
          width: 300,
        },
        {
          title: "操作",
          width: 250,
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" },
          fixed: "right"  // 最后一项，固定在最右侧
        },
      ],
      taskData: {},
      loading: false,  // 遮罩层默认为false，即关闭状态
      pageSizeOptions: ["10", "20", "30", "40"],
      applications: [],
      //企业信息列表
      enterpriseList:[],
      show_hide:false,  //查询字段是否全显示,false表示不全显示(折叠),true表示全显示(展开)
      statusLists:[], // 查询字段状态列表
      scaleLists:[],  // 查询字段年营业收入列表
      // 状态列表，等价于字典中的状态列表，这个数组主要用来做不同状态的颜色区别
      statusColor:["筹建","在建","在营","停业","注销"],
      // 年营业收入列表，等价于字典中的年营业收入，这个数组主要用来做不同状态的颜色区别
      scaleColor:["1000万以下","1000万~2000万","2000万~5000万","5000万~1亿","1亿以上","小微","中小","规上","中型"],
      color:['blue','green','red','skyblue','deeppink','blue','green','red','skyblue','deeppink'],  // 公司规模字段(以标签形式展示),对应的颜色数组
      companyStatus:[],  // 查询字段公司状态选择框的双向绑定值
      industryLists:[],  // 
      industryList:[],  // 
      qualificationList:[],  // 资质荣誉列表，用来接收字典接口返回来的数据
    };
  },
  computed: {
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
    pagination: {
      // get 有什么作用，当有人读取 pagination 时，get 就会被调用
      get() {
        return {
          page: this.page || 1,
          per_page: this.per_page || 10,
        };
      },
    },
    dynamicData(){
      let result = {
        // categoryList 就是我们在自定义表单中定义的动态数据的字段，this.industryList 是我们在 data 中定义的一个数组
        categoryList:this.industryList,
        statusList:this.statusArray.map(item => {
          return {  //这里的return是map中自带的方法
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
      }
      return result;  // 返回
    },
    detailsObj(){
      return this.enterpriseList;
    }
  },
  created() {
    console.log('我是园区企业首页',this.params)
    this.page = this.params.data?this.params.data.page:1;
    this.per_page = this.params.data?this.params.data.per_page:10;
    this.searchform = this.params.data?this.params.data.searchform:this.searchform;
    this.init();
  },
  methods: {
    ...mapMutations("account", ["setUser", "setPermissions", "setRoles"]),
    ...mapMutations("websocket", ["setId"]),
    ...mapMutations(["addApps", "removeApps", "setApps"]),
    // 页面初始执行的函数
    init() {
      this.paginations();
      // 企业基本信息创建
      form_get({ name: "enterprise_added" })
      .then((response) => {
        this.channelForm = response.data.data.form;
      })
      .catch((error) => {
        this.$message.error(error);
      });
      // 企业工商（商务）信息创建
      form_get({ name: "enterprise_business_information" })
      .then((response) => {
        this.channelForm_business = response.data.data.form;
      })
      .catch((error) => {
        this.$message.error(error);
      });
      // 字典列表
      dict_tree()
      .then(res => {
        this.statusArray = res.data.data[6].children[0].children
        this.statusLists = this.statusArray
        // console.log("this.statusLists",this.statusLists)
        // 规模列表
        this.scaleArray = res.data.data[6].children[1].children
        this.scaleLists = this.scaleArray
        // this.industryLists 我们在 data 中定义的一个数组，用来承接接口返回来的数据
        this.industryLists = res.data.data[6].children[3].children
        // 我们可以发现 this.industryList 这个数组是 this.industryLists 这个数组处理之后的结果
        this.industryList = this.digui(this.industryLists);  // 这里调用了 digui 这个方法
        // 资质荣誉列表
        this.qualificationList = res.data.data[6].children[4].children
        // console.log('资质荣誉列表',this.qualificationList);
      })
    },
    // 分页单独拿出来,提高新能
    paginations() {
      // 遮罩层的值置为 true，即开启状态
      this.loading = true;
      info_paginate(Object.assign(this.searchform,{page:this.page,per_page:this.per_page}))
      .then(res => {
        // 访问成功，遮罩层置为 false，即关闭状态
        this.loading = false
        // console.log('分页信息',res)
        this.enterpriseList = res.data.data
        console.log('分页信息',this.enterpriseList)
      })
    },
    // digui方法
    digui(tree){
      // 对传过来的树型数据进行循环遍历
      for(let i=0;i<tree.length;i++) {
        tree[i].id = tree[i].title;  // 当前节点的id等于当前节点的title
        if(tree[i].children && tree[i].children.length) {  // 如果当前节点的孩子也是一个树型结构的话，对当前节点的孩子也进行递归遍历
          this.digui(tree[i].children)
        }
      }
      return tree;
    },
    // 查询
    onSearch() {
      this.loading = true;
      this.page = 1;
      this.per_page = 10;
      this.paginations();
    },
    //查询字段是否全显示(切换)
    toggleshow_hide() {
      this.show_hide = !this.show_hide;
    },
    // 分页
    changepage(page, pageSize) {
      this.page = page;
      this.per_page = pageSize;
      // console.log('this.pagination',this.pagination)
      this.paginations();
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
      this.title = '数据新增';
      this.visible = true;
      this.method = info_admin_create;
      // this.$nextTick(() => {
      //   this.$refs.channelForm.hide(["logo","email","address","content"])  // 使用隐藏字段
      // })
    },
    // 企业信息的新增页面
    // onAdd() {
    //   this.$emit("event", {
    //     method: "onLink",
    //     params: {
    //       route: "enterprise_add_pages",
    //       params: {
    //         menus: ["enterprise_add_pages"],
    //         page:this.detailsObj.page,
    //         per_page:this.detailsObj.per_page,
    //       },
    //     },
    //   });
    // },
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
          info_delete(parems)  //接口，方法
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
    // 基本信息编辑
    onBasicInfoEdit(record){
      info_get({id:record.id})  // 在企业信息详情接口中调用企业信息编辑接口，为了渲染返回来的数据
      .then(res => {
        // console.log('res',res)
        this.title = "基本信息编辑"
        this.visible = true;
        this.method = info_edit;
        this.id = record.id;  // 获取这里的id
        this.$nextTick(() => {
          this.$refs.channelForm.show(["logo","email","address","content"])  // 使用显示字段
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
    // 基本信息确定按钮
    handleOk(){
      this.$refs.channelForm.getData()  //获取添加的数据,从表单中获取最后一次的数据
      .then((data) => {
        // console.log('this.data',data)
        info_admin_verify({company:data.title,rmobile:data.rmobile})
        .then(res => {
          // console.log('res是什么东西',res)
          if(res.data.data || this.method == info_edit ) {  // 验证成功，或者是处于编辑，都可以执行 if 里面的语句
            this.method(Object.assign(data,{comeform:'PC端'},{id:this.id},))
            .then((res) => {
              // console.log('弹窗关闭了',res)
              this.visible = false; //弹窗关闭
              this.$refs.channelForm.reset();  // 重置表单数据, 
              this.init();  // 调用init()函数，用来刷新页面
              // console.log('看一下现在的this.method是什么',this.method)
              if(this.method == info_admin_create) {  // 只有新增时，才会提示用户创建账户成功
                this.openNotification(res.data.data.rmobile);  // 用于提示用户创建账户成功，账号就是联系电话，密码是 123456
              }
              
            });
          } else {
            this.$message.error('企业名称或联系方式重复了！！');
          }
        })
        
      });
    },
    // 基本信息取消按钮
    handleCancel(){
      this.visible = false;  // 弹窗隐藏
      this.$refs.channelForm.reset();  // 重置了自定义表单
    },
    // 新增企业成功后，会调的函数，用于提示用户相应的账户也创建成功了
    openNotification(item) {
      this.$notification.open({
        message: '操作成功',
        description:
          '账户创建成功，用户名是 '+ item +'，密码是 123456',
        duration: null,
        style:{
          width:'500px',
          marginTop:'25px',
          marginLeft: `${335 - 450}px`,
        },
        icon: <a-icon type="smile" style="color: #108ee9" />,
      });
    },
    // 商务信息编辑
    onBusinessInfoEdit(record){
      info_get({id:record.id})  // 在企业信息详情接口中调用企业信息编辑接口，为了渲染返回来的数据
      .then(res => {
        // console.log('res',res)
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
          route: "recycleBin",
          params: {
            menus: ["recycleBin"],
            searchform:this.searchform,
          },
        },
      });
    },
    // 管委会页面（包括走访记录、点评等等...）
    managementCommittee(record){
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "managementCommittee",
          params: {
            record:record,  // 将上面插槽中的内容传递到详情页面里去
            page:this.searchform.page,
            per_page:this.searchform.per_page,
            searchform:this.searchform,
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
    // 企业详情页(跳转到兵哥给的企业详情页(enterprisedetail.vue))
    toDetails(record) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "enterpriseDetail",
          params: {
            menus: ["enterpriseDetail"],
            record:record.id,  // 将上面插槽中的内容传递到详情页面里去
            searchform:this.searchform,
            page:this.detailsObj.page,
            per_page:this.detailsObj.per_page,
            flag:1,
          },
        },
      });
    },
    // 查询字段"公司状态"的回调函数
    handleChangeStatus(e) {
      console.log(e);
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
.actions >>> .ant-btn {
  padding: 0 3px !important;
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
        font-weight: 500;
        // color: #1890ff;
        color: #120e10;
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
