<template>
  <div class="topicDataAdd">
    <a-spin tip='Loading...' :spinning = 'isSpin'>
      <a-page-header
        :title="params.id ? '主题编辑' : '主题新增'"
        sub-title=""
        @back="obBack"
      >
        <template slot="extra">
          <a-button
            type="primary"
            icon="cloud-upload"
            @click="onSubmit"
            :loading="loading"
            >保存提交</a-button
          >
        </template>
      </a-page-header>
      <k-form-build :value="jsonData" ref="form" :config="config" class="customForm"/>
      
      <a-row class="enterpriseQueryArea">
        <a-col :md="8" :sm="24">
          <a-form-item
          label="行业分类"
          :labelCol="{ span: 4 }"
          :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-select
            mode="multiple"
            show-search
            placeholder="请选择行业分类"
            v-model="searchform.category"
            @change="handleChange"
            allow-clear
            >
              <a-select-option v-for="(item,index) in industryList" :key="index" :value='item.title'>
                {{ item.title }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item
          label="年营业收入"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-select
            mode="multiple"
            show-search
            placeholder="请选择年营业收入"
            v-model="searchform.scale"
            @change="handleChange"
            allow-clear
            >
              <a-select-option v-for="(item,index) in scaleList" :key="index" :value='item.title'>
                {{ item.title }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item
          label="资质荣誉"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-select
            mode="multiple"
            show-search
            placeholder="请选择资质荣誉"
            v-model="searchform.title"
            @change="handleChange"
            allow-clear
            >
              <a-select-option v-for="(item,index) in qualificationList" :key="index" :value='item.title'>
                {{ item.title }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <!-- <a-alert message="企业选择" type="info" show-icon closable ></a-alert> -->
      <div class="functionBox">
        <div style="float:left;padding:0 10px">
          <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
          <span style="margin-left:5px;color:deeppink">企业选择区域（必选项）</span>
        </div>
        <div style="float:right">
          <a-checkbox
          :disabled = !(enterpriseList&&enterpriseList.length)
          :checked="checkAll"
          @change="onEnterpriseAllChange"
          >
            全选
          </a-checkbox>
        </div>
        
      </div>
      
      <div class="enterpriseCheckboxArea">
        <a-checkbox-group v-model="checkedList" :options="enterpriseList" @change="onChange" />
      </div>
      <div style="float:right;margin-top: 20px;margin-right: 24px;background:#fff">
        <a-button
        type="primary"
        icon="cloud-upload"
        @click="onSubmit"
        :loading="loading"
        >
          保存提交
        </a-button>
      </div>
      <div style="height:100px;background:#fff">

      </div>
    </a-spin>
  </div>
</template>
<script>
import Cookie from "js-cookie";
import { form_get } from "@/services/forms";
import { dictmap_tree } from "@/services/dictmap";
import { organization_tree } from "@/services/organization";
import { riskinfo_get, riskinfo_add, riskinfo_edit } from "@/services/risk";
import { log } from '@antv/g2plot/lib/utils';
import {
dict_tree,  // 字典列表
info_list,  // 企业列表
theme_create,  // 主题创建
theme_edit,  // 主题编辑
theme_info,  // 主题信息，用于主题数据的编辑，theme_get 接口也可以，只是 theme_get 接口数据太多了，很多用不到，影响性能
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
  },
  data() {
    return {
      isSpin:false,  // 页面默认不处于加载中
      loading: false,
      jsonData: {},
      dictmaps: [],
      organization: [{id:"1",title:"1"},{id:"2",title:"2"},{id:"3",title:"3"},{id:"4",title:"4"}],
      currData: {},
      searchform:{},  // 里面存着查询条件
      industryList:[],  // 行业分类，用来接收字典接口返回来的数据
      scaleList:[],  // 年营业收入，用来接收字典接口返回来的数据
      qualificationList:[],  // 资质荣誉列表，用来接收字典接口返回来的数据
      enterpriseList:[],  // 企业列表，用来接收对 info_list 接口查询后的数据
      checkAll:true,  // 默认是选中的状态
      checkedList:[],  // 企业列表默认选择的
      bussinessListOriginal:[],  // 企业列表返回来的原始数据
      companys:[],  // 传给后台接口的公司 id 字段，该字段是必填的
      id:undefined,  // 默认情况下，id 是 undefined，新增时不需要 id，编辑时需要 id；
      checkedAllList:[],  // 用于全选按钮为 true 时，构造一个只包含 enterpriseList 数组中的 id 的新数组
      
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
    level() {
      if (this.dictmaps.length) {
        const maps = this.dictmaps.find((item) => {
          return item.name == "LEVEL";
        });
        return maps.children;
      }
      return [];
    },
    status() {
      if (this.dictmaps.length) {
        const maps = this.dictmaps.find((item) => {
          return item.name == "STATUS";
        });
        return maps.children;
      }
      return [];
    },
    division() {
      if (this.dictmaps.length) {
        const maps = this.dictmaps.find((item) => {
          return item.name == "DIVISION";
        });
        maps.children[0].children.unshift({
          id:"60a47e3c1ca90939e59b3d27",
          name: "LIAOCHENG",
          parent: "60a474a31ca90939e59b3d1f",
          title:"聊城市",
        })
        return maps.children[0].children;
      }
      return [];
    },
    industrial() {
      if (this.dictmaps.length) {
        const maps = this.dictmaps.find((item) => {
          return item.name == "INDUSTRIAL";
        });
        return maps.children;
      }
      return [];
    },
  },
  created() {
    console.log('04params',this.params)
    this.init();
  },
  methods: {
    init() {
      this.isSpin = true;
      /*
      if(!this.params.id) 保证了从主页面点击“编辑”按钮时，不会调用这个方法，以免，出现企业列表渲染的错误
      */
      if(!this.params.id) {
        this.initLoad()
      }
      if(this.params.id) {
        this.id = this.params.id;
        // 只有当处于编辑页面的时候，才会调用这个方法
        this.backFillData()
      }
      // this.$nextTick(() => {
      // })
      this.loading = true;
      Promise.all([
        form_get({
          name: "topicAddNew",
        }),
      ])
      .then((response) => {
        this.jsonData = response[0].data.data.form;
        this.loading = false;
        this.isSpin = false;
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.isSpin = false;
      });
      // 字典列表
      dict_tree()
      .then(res => {
        // 年营业收入列表
        this.scaleList = res.data.data[6].children[1].children
        // 行业分类列表
        this.industryList = res.data.data[6].children[3].children
        // 资质荣誉列表
        this.qualificationList = res.data.data[6].children[4].children
      })
    },
    obBack() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "topicPaging",  // 返回页面的路由
          params: {
            menus: ["topicPaging"],
            searchform:this.params.searchform,
          },
        },
      });
    },
    // 
    onChange(checkedList){
      this.checkAll = checkedList.length === this.enterpriseList.length;
    },
    // 企业列表接口封装成一个函数，初始化时需调用，关联公司列表需调用
    initLoad(){
      if(this.searchform&&this.searchform.title&&this.searchform.title.length == 0){
        delete this.searchform.title  // 删除 this.searchform 对象里的 title 属性，这里空的 title 传给接口会报错；
      } 
      info_list(this.searchform)
      .then(res => {
        this.bussinessListOriginal = res.data.data;  // 数组 bussinessListOriginal 装的是企业列表返回来的原始数据
        this.enterpriseList = res.data.data.map(item => {  // 全部的
          return {label:item.title,value:item.id}
        })
        this.checkedList = res.data.data.map(item => {  // 选中的
          return item.id
        })
        this.checkAll = true;
      })
    },
    // 如果是处于编辑状态的话，从主页跳转到当前页面，需要将数据渲染到合适的位置
    backFillData(){
      this.$nextTick(() => {
        theme_info({id:this.id})
        .then(res => {
          this.visible = true;
          this.enterpriseList = res.data.data[0].companys.map(item => {  // 全部的
            return {label:item.title,value:item.company}
          }),
          this.checkedList = res.data.data[0].companys.map(item => {  // 选中的
            return item.company
          }),
          this.$nextTick(() => {
            this.$refs.form.setData({
              title:res.data.data[0].title,
              files:res.data.data[0].files,
              start:res.data.data[0].start.split(" ")[0],
              end:res.data.data[0].end.split(" ")[0],
              content:res.data.data[0].content,
            })
          })
        })
      })
    },
    // 关联公司列表
    handleChange(e){
      this.initLoad()
    },
    // 全选
    onEnterpriseAllChange(e){
      this.checkedAllList = this.enterpriseList.map(item => {
        return item.value
      })
      this.checkedList = e.target.checked ? this.checkedAllList : [];
      this.checkAll = e.target.checked;
    },
    // 保存提交按钮
    onSubmit() {
      // this.companys 其实就是 this.checkedList，用来向给接口传数据
      this.companys = this.checkedList;
      this.$refs.form.getData()
      .then((formData) => {
        // 开始时间转换为时间戳
        var start = new Date(formData.start);
        // 结束时间转换为时间戳
        var end = new Date(formData.end);
        if(end>=start) {
          this.loading = true;
          if (this.id) {  // 编辑
            theme_edit(Object.assign(formData,{companys:this.companys,id:this.id}))
            .then((response) => {
              this.$message.success(response.data.message);
              this.loading = false;
              this.obBack();
            })
            .catch((error) => {
              this.$message.error(response.data.message);
              this.loading = false;
            });
          } else {  // 新增
            if(this.companys&&this.companys.length){
              theme_create(Object.assign(formData,{companys:this.companys}))
              .then((response) => {
                this.$message.success(response.data.message);
                this.loading = false;
                this.obBack();
              })
              .catch((error) => {
                this.$message.error(response.data.message);
                this.loading = false;
              });
            } else {
              this.$message.warn("请选择企业");
              this.loading = false;
            }
          }
        } else {
          this.$message.error('结束日期应该大于开始日期');
        }
      })
      .catch((error) => {
        this.loading = false;
      });
    },
  },
};
</script>
<style scoped>
  .topicDataAdd {
    padding: 0 30px;
    /* height: 100vh; */
    background:#fff
  }
  .customForm >>> .ant-col-12 {
    border: 1px solid #eee;
    padding: 10px 0 5px;
    max-height: 102px;
    overflow: auto;
  }
  /* 主题描述字段和上面有一个距离，更好看一点 */
  .customForm >>> .ant-row:nth-child(2) {
    margin-bottom: 15px;
  }
  .enterpriseQueryArea {
    margin-top: 25px;
  }
  .enterpriseQueryArea >>> .ant-select {
    width: 100%;
  }
  .enterpriseCheckboxArea {
    margin-top: 15px;
    width: 100%;
    min-height: 100px;
  }
  .enterpriseCheckboxArea >>> .ant-checkbox-group {
    width: 100%;
  }
  .enterpriseCheckboxArea >>> .ant-checkbox-group-item {
    border: 1px solid #eee;
    width: 45%;
    padding: 5px;
    margin: 5px 26px;
  }
  /* .checkboxArea {
    border: 1px solid #eee;
    padding: 5px;
    margin: 5px 26px;
    width: 45%;
  } */
  .functionBox {
    font-size: 18px;
    height:40px;
    width:100%;
    background:rgba(11, 185, 244, 0.1);
    line-height:40px;
    border-radius:5px;
    border: 1px solid skyblue;
  }
</style>
