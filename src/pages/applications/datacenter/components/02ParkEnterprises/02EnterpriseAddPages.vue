<template>
  <div class="enterprise_add">
    <div class="title_back">
      <a @click="back()"><a-icon type="arrow-left" />返回</a>
    </div>
    <div class="steps_s">
      <a-steps :current="current">
        <a-step v-for="items in stemlist" :key="items.id">
          <template slot="title">{{ items.title }}</template>
          <!-- <span slot="description">{{ items.description }}</span> -->
        </a-step>
      </a-steps>
    </div>
    <!-- 表单 -->
    <div class="forms" v-if="current == 0">
      <a-spin :spinning="spinning0" tip="目录加载中...">
        <k-form-build
        :value="formDatas"
        ref="kcompanyForm"
        :config="config"
        />
      </a-spin>
      <div style="text-align: center; margin: 50px auto 70px">
        <a-button type="primary" @click="next">下一步</a-button>
      </div>
    </div>
    <!-- 第二个表单 -->
    <div class="forms1" v-if="current == 1">
      <k-form-build
      :value="businessValue"
      ref="businessValue"
      :config="config"
      :dynamicData="dynamicData"
      />
      <div style="text-align: center; margin: 50px auto 70px">
        <a-button type="primary" @click="next">下一步</a-button>
      </div>
    </div>
    <!-- 第三部分 -->
    <div class="finished" v-if="current == 2">
      <div class="finished_imgs">
        <img src="../../images/finish.png" alt="" />
      </div>
      <div class="finished_title">任务创建成功</div>
      <div class="finished_content">任务创建成功</div>
      <a-space>
        <!-- <a-button type="primary" @click="creattask">创建任务</a-button> -->
        <a-button @click="back">返回列表</a-button>
      </a-space>
    </div>
  </div>
</template>
<script>
  import { form_get } from "@/services/forms";  // 导入自定义表单接口
  import { 
  info_create,  // 基本信息新增接口
  industry_create,  // 商务信息新增接口
  dict_tree,  // 字典列表
  } from "@/services/datacenter";
  import Cookie from "js-cookie";
  export default {
    created(){
      this.init()
    },
    computed:{
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
            return {  //这里的return是map中自带的方法
              value:item.title,
              label:item.title,
            };
          }),
          
        }
        return result;  // 返回
      }
    },
    data(){
      return {
        stemlist: [
          { id: 0, title: "基本信息" },
          { id: 1, title: "工商信息" },
          { id: 2, title: "创建完成" },
        ],
        current:0,  // 默认在第一阶段
        spinning0:false,
        changeformes:{},
        formDatas:{},  // 该对象来封装第一部分的数据
        id:undefined,
        // ------------------------------------------------------------------
        businessValue:{},  // 该对象来封装第二部分的数据
        statusArray:[],  // 接字典树返回过来的数据，企业状态
        scaleArray:[],  // 接字典树返回过来的数据，企业规模
        industryLists:[],
        industryList:[],
      }
    },
    methods:{
      // 初始化
      init(){
        // 企业基本信息创建
        form_get({ name: "enterprise_added" })
        .then((response) => {
          this.spinning0 = false
          this.formDatas = response.data.data.form;
        })
        .catch((error) => {
          this.$message.error(error);
        });
        // 企业工商（商务）信息创建
        form_get({ name: "enterprise_business_information" })
        .then((response) => {
          this.businessValue = response.data.data.form;
        })
        .catch((error) => {
          this.$message.error(error);
        });
        // 字典列表
        dict_tree()
        .then(res => {
          // console.log('字典列表',res);
          this.statusArray = res.data.data[6].children[0].children
          this.scaleArray = res.data.data[6].children[1].children
          // this.industryLists 我们在 data 中定义的一个数组，用来承接接口返回来的数据
          this.industryLists = res.data.data[6].children[3].children
          // 我们可以发现 this.industryList 这个数组是 this.industryLists 这个数组处理之后的结果
          this.industryList = this.digui(this.industryLists);  // 这里调用了 digui 这个方法

          // console.log('状态列表',this.statusArray);
          // console.log('规模列表',this.scaleArray);
          // console.log('this.industryList',this.industryList);
        })
      },
      // digui方法
      digui(tree){
        // 对传过来的树型数据进行循环遍历
        for(let i=0;i<tree.length;i++) {
          tree[i].id = tree[i].title;  // 当前节点的id等于当前节点的 title
          if(tree[i].children && tree[i].children.length) {  // 如果当前节点的孩子也是一个树型结构的话，对当前节点的孩子也进行递归遍历
            this.digui(tree[i].children)
          }
        }
        return tree;
      },
      //返回
      back() {
        this.$emit("event", {
          method: "onLink",
          params: {
            route: "home",
            params: {
              menus: ["home"],
            },
          },
        });
      },
      changeforms(){},
      handleOk(){},
      handleCancel(){},
      next(){
        if(this.current == 0) {
          this.$refs.kcompanyForm.getData()  //获取添加的数据,从表单中获取最后一次的数据
          .then((data) => {
            info_create(Object.assign(data,{id:this.id},{comeform:"PC端"}))
            //使用this.method，就是为了区分新增和编辑，data可以自动匹配对应的字段，和接口中的字段对应上，
            //id另写，因为它是不确定的
            .then((res) => {
              this.$refs.kcompanyForm.reset(); //重置表单数据, 
              this.id = res.data.data.id;
              this.current++;
              // console.log('基本信息',res);
            });
          });
        } else if(this.current == 1) {
          this.$refs.businessValue.getData()  //获取添加的数据,从表单中获取最后一次的数据
          .then((data) => {
            data.isHighCompany = data.isHighCompany == 1?true:false
            industry_create(Object.assign(data,{company:this.id},{comeform:"PC端"}))
            //使用this.method，就是为了区分新增和编辑，data可以自动匹配对应的字段，和接口中的字段对应上，
            //id另写，因为它是不确定的
            .then((res) => {
              this.$refs.businessValue.reset(); //重置表单数据,
              this.current++;
              // console.log('工商信息',res);
            });
          });
        }
      }
    }
  }
</script>

<style scope>
  /* 返回按钮样式 */
  .title_back {
    margin: 10px;
    padding: 10px;
    background: #daedff;
    border: 1px solid #40a9ff;
    border-radius: 5px;
    margin-bottom: 20px;
  }
  /*  */
 .steps_s {
    padding: 45px 20%;
    border-bottom: 1px solid #fcfafa;
  }
  .forms {
    padding: 15px 20% 50px;
  }
  .forms1 {
    padding: 15px 15% 50px;
  }
  /* .enterprise_add {
    background: linear-gradient(45deg, #f0ebeb, transparent,#fffafa);
  } */
</style>
<style>
  .steps_s .ant-steps-item-title::after {
    background-color: #cdcdcd !important;
  }
  .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title::after {
    background-color: #1890ff !important;
}
</style>
<style lang="less">
  .finished {
    width: 100%;
    text-align: center;
    padding: 90px 0px;
    .finished_imgs img {
      width: 70px;
      height: 70px;
    }
    .finished_title {
      font-size: 24px;
      text-align: center;
      color: #000000d9;
      margin: 36px auto 5px;
    }
    .finished_content {
      font-size: 14px;
      text-align: center;
      color: #00000073;
      margin: 5px auto 25px;
    }
  }
</style>
<style scoped>
  /* 样式穿透 */
  .enterprise_add >>> .ant-spin-nested-loading {
    background: #fff !important;
    padding: 25px !important;
    box-shadow: #cdcdcd 0 0 10px !important;
    border-radius: 8px !important;
  }
  .forms1 >>> .ant-form {
    background: #fff;
    padding: 25px;
    box-shadow: #cdcdcd 0 0 8px;
    border-radius: 8px;
  }
</style>