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
            <a-select
              placeholder="请选择月份"
              mode="multiple"
              v-model="searchform.month"
              allowClear
              style="width: 26%; margin: 5px 10px 10px 5px"
            >
              <a-select-option v-for="(item,index) in month" :key="index" :value="item"> {{item}} </a-select-option>
            </a-select>
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
          <a-button @click="onAdd()" style="margin-left:5px">新增</a-button>
        </a-space>
      </div>
      <!-- 表格 -->
      <a-table
        class="task_table"
        :columns="columns"
        :loading="loading"
        :indentSize="18"
        size="large"
        :pagination="false"
        :rowKey="(record, index) => record.manage"
        :dataSource="dataSource.items"
        :scroll="{ x: 1700 }"
      >
        <!-- 企业名称字段的插槽(样式自定义) -->
        <span slot="titles" slot-scope="text, record">
          <span v-if="record&&record.count" class="namecustom" style="position:relative">
            <i class="absolutesolution" style="">{{record.count}}</i>
            {{ record.title }}
          </span>
          <span v-else>
            {{ record.title }}
          </span>
        </span>
        <!-- 公司规模字段的插槽(样式自定义) -->
        <span slot="scale" slot-scope="text">
          <a-tag :color="color[scaleColor.indexOf(text)]" style="font-weight:600">{{text}}</a-tag>
        </span>
        <!-- 公司状态字段的插槽(样式自定义) -->
        <span slot="status" slot-scope="text">
          <a-tag :color="color[statusColor.indexOf(text)]" style="font-weight:600">{{text}}</a-tag>
        </span>
        <!-- 营业额字段的插槽(样式自定义) -->
        <span slot="nowYingyee" slot-scope="text,record">
          <span v-if="record.nowYingyee>=record.lastYingyee">
            <!-- <img src="../../images/arrowup.png" style="width:20px;margin-right:" /> -->
            <a-statistic
            :value="record.floatYingyee"
            :precision="2"
            suffix="%"
            :value-style="{ color: '#cf1322',fontSize:'18px' }"
            >
              <template #prefix>
                <a-icon type="arrow-up" />
              </template>
            </a-statistic>
            <!-- JavaScript 数字格式化（每 3 位逗号隔开，保留 2 位小数） -->
            <!-- <span style="font-weight:400;color:#d81e06;font-size:18px">{{text.toFixed(1).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,')}}</span> -->
          </span>
          <span v-else>
            <!-- <img src="../../images/arrowdown.png" style="width:20px" /> -->
            <a-statistic
            :value="record.floatYingyee"
            :precision="2"
            suffix="%"
            :value-style="{ color: '#3f8600',fontSize:'18px' }"
            >
              <template #prefix>
                <a-icon type="arrow-down" />
              </template>
            </a-statistic>
            <!-- <br /> -->
            <!-- <span style="color:#3f8600;font-weight:700">{{text.toFixed(1).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,')}}</span> -->
          </span>
        </span>
         <!-- 纳税字段的插槽(样式自定义) -->
        <span slot="nowNashui" slot-scope="text,record">
          <span v-if="record.nowNashui>=record.lastNashui">
            <!-- <img src="../../images/arrowup.png" style="width:20px" /> -->
            <!-- <br /> -->
            <a-statistic
            :value="record.floatNashui"
            :precision="2"
            suffix="%"
            :value-style="{ color: '#cf1322',fontSize:'18px' }"
            >
              <template #prefix>
                <a-icon type="arrow-up" />
              </template>
            </a-statistic>
            <!-- <span style="font-weight:700;color:#d81e06">{{text.toFixed(1).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,')}}</span> -->
          </span>
          <span v-else>
            <!-- <img src="../../images/arrowdown.png" style="width:20px" /> -->
            <!-- <br /> -->
            <a-statistic
            :value="record.floatNashui"
            :precision="2"
            suffix="%"
            :value-style="{ color: '#3f8600',fontSize:'18px' }"
            >
              <template #prefix>
                <a-icon type="arrow-down" />
              </template>
            </a-statistic>
            <!-- <span style="color:#3f8600;font-weight:700">{{text.toFixed(1).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,')}}</span> -->
          </span>
        </span>
        <!-- 年份字段的插槽(样式自定义) -->
        <span slot="years" slot-scope="text, record">
          <!-- 
          因为 colorList 是一个长度为 12 的数组，我们获取年份（record.release.split("-")[0]），让它对 12 取余，得到结果值，
          这个结果值作为数组 colorList 的索引；就实现了动态的给 tag 添加颜色
           -->
          <a-tag :color='colorList[(record.release.split("-")[0]%12)]' style="font-weight:600">
            {{record.release.split("-")[0]}}
          </a-tag>
        </span>
        <!-- 月份字段的插槽(样式自定义) -->
        <span slot="release" slot-scope="text, record">
          <a-tag :color="monthColor(text)" style="font-weight:600">
            {{month[monthNum.indexOf(text.split("-")[1])]}}
          </a-tag>
        </span>
        <!-- 操作字段的插槽（样式自定义） -->
        <span slot="action" slot-scope="text, record">
          <a href="#" @click="toDetails(record)"><a-icon type="file-text" /> 详情 </a>
          <!-- <a-divider type="vertical" />
          <a href="#" @click="onEdit(record)"><a-icon type="edit" /> 编辑 </a> -->
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
      >
      </a-pagination>
      <!-- 新增经营信息的弹窗 -->
      <a-modal
      :title="titles"
      width="50%"
      :visible="businessvisible"
      @ok="getOk()"
      @cancel=" () => { businessvisible = false; this.$refs.ruleForm.resetFields(); }"
      >
        <a-form-model
        ref="ruleForm"
        :model="forms"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        >
          <a-form-model-item ref="release" label="上报时间" prop="release">
            <a-month-picker
            v-model="forms.release"
            format="YYYY-MM"
            style="width: 100%"
            placeholder="请选择填报月份"
            :disabled-date="disabledDate"
            @change="onChange_s"
            />
          </a-form-model-item>
        </a-form-model>
        <k-form-build
        :value="jsonData"
        @change="handleChange"
        :config="config"
        :dynamicData = "dynamicDated"
        ref="jsonDatas"
        />
      </a-modal>
    </div>
    <Applications v-if="false"></Applications>
  </div>
</template>
<script>
import Cookie from "js-cookie";
import { mapMutations } from "vuex";
import Applications from "../../../../applications/";
import { form_get } from "@/services/forms";  // 自定义表单接口
import {
manage_admin_paginate,  // 企业经营信息
dict_tree,  // 字典列表
manage_create,  // 新增
manage_edit,  // 编辑
manage_verify,  // 验证
info_list,  // 企业列表
} from "@/services/datacenter"
import moment from "moment";
import { resolveAllPadding } from '@antv/g2plot/lib/utils';
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
          // align: "center",
          width: 250,
          ellipsis: true,
          scopedSlots: { customRender: "titles" },
        },
        {
          title: "法定代表人",
          dataIndex: "legal",
          align: "center",
          width: 100,
          scopedSlots: { customRender: "legal" },
        },
        {
          title: "营业额（同比）",
          dataIndex: "nowYingyee",
          // align: "center",
          width: 120,
          scopedSlots: { customRender: "nowYingyee" },
        },
        {
          title: "公司规模",
          dataIndex: "scale",
          align: "center",
          width: 160,
          scopedSlots: { customRender: "scale" },
        },
        {
          title: "纳税（同比）",
          dataIndex: "nowNashui",
          // align: "center",
          width: 120,
          scopedSlots: { customRender: "nowNashui" },
        },
        {
          title: "年份",
          align: "center",
          width: 120,
          scopedSlots: { customRender: "years" },
        },
        {
          title: "月份",
          dataIndex: "release",
          align: "center",
          width: 120,
          scopedSlots: { customRender: "release" },
        },
        {
          title: "联系电话",
          dataIndex: "rmobile",
          align: "center",
          width: 120,
        },
        {
          title: "公司状态",
          dataIndex: "status",
          align: "center",
          width: 120,
          scopedSlots: { customRender: "status" },
        },
        {
          title: "成立日期",
          dataIndex: "createtime",
          align: "center",
          width: 120,
        },
        {
          title: "操作",
          width: 150,
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" },
          fixed: "right"
        },
      ],
      taskData: {},
      loading: false,
      pageSizeOptions: ["10", "20", "30", "40"],
      show_hide:false,  //查询字段是否全显示，false 表示不全显示(折叠)，true 表示全显示(展开)
      statusList:[],  // 查询字段状态列表
      scaleList:[],  // 查询字段年营业收入列表
      color:['blue','green','red','skyblue','deeppink','#f50','#2db7f5','#87d068','#108ee9','#C66584','#ff00ff','#ff8877','#1f9246'],  // 公司规模字段(以标签形式展示)，对应的颜色数组
      colorList:['skyblue','deeppink','#f50','#2db7f5','#87d068','#108ee9','#C66584','#ff00ff','#ff8877','#1f9246','#4511bf','#bf1145',],  // 月份字段(以标签形式展示)，对应的颜色数组
      // 年营业收入列表，等价于字典中的年营业收入，这个数组主要用来做不同状态的颜色区别
      scaleColor:["1000万以下","1000万~2000万","2000万~5000万","5000万~1亿","1亿以上","小微","中小","规上","中型"],
      // 状态列表，等价于字典中的状态列表，这个数组主要用来做不同状态的颜色区别
      statusColor:["筹建","在建","在营","停业","注销"],
      companyStatus:[],  // 查询字段公司状态选择框的双向绑定值
      month:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],  // 查询字段月份列表
      monthNum:['01','02','03','04','05','06','07','08','09','10','11','12'],
      dataSource:{},  // 承接分页信息返回的参数
      industryLists:[],  // 
      industryList:[],  // 
      jsonData:{},  // 自定义表单的对象
      titles: "经营信息新增",
      businessvisible:false,  // 新增企业经营信息的弹窗默认不显示
      forms: {},  // 上报时间
      // 上报时间的规则
      rules: {
        release: [
          { required: true, message: "请选择填月份", trigger: "change" },
        ],
      },
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      countylist:[],  // data 中新建一个空数组，用于接收接口中返回的数据
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
    console.log('01params',this.params)
    // this.searchform.page = this.params.data?this.params.data.page:1;
    // this.searchform.per_page = this.params.data?this.params.data.per_page:10;
    this.searchform = this.params.data?this.params.data.searchform:this.searchform;
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
      manage_admin_paginate(this.searchform)
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
      form_get({ name: "addenterpriseinfo" })
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
    // 企业经营信息详情页(enterprisedetail)
    toDetails(record) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "managedetails",
          params: {
            record:record,  // 将上面插槽中的内容传递到详情页面里去
            page:this.searchform.page,
            per_page:this.searchform.per_page,
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
    // 查询字段"公司状态"的回调函数
    handleChangeStatus(e) {
    },
    // 验证
    handleChange(key, value) {
      console.log('oooo',key,value)
      if (value == "company"&&this.release) {
        manage_verify({company: key,release: this.release})
        .then((res) => {
          if (!res.data.data) {
            this.$message.error("该企业已创建当前上报时间的企业填报");
            this.$nextTick(() => {
              this.$refs.jsonDatas.setData({
                company: "",
              });
              this.forms.release = undefined;
              this.release = ""
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
      }
    },
    // 填报月份
    disabledDate(current) {
      return (
        new Date(current).getMonth() + 1 >
        new Date(moment().endOf("month")).getMonth()
      );
    },
    // 填报日期的验证
    onChange_s(date, dateString) {
      this.release = dateString
      this.$refs.jsonDatas.getData()
      .then(res => {
        if(res.company&&this.release) {
          manage_verify({company: res.company,release: this.release})
          .then((res) => {
            if (!res.data.data) {
              this.$message.error("该企业已创建当前上报时间的企业填报");
              this.$nextTick(() => {
                this.$refs.jsonDatas.setData({
                  company: "",
                });
                this.forms.release = undefined;
                this.release = "";
              });
            }
          })
          .catch((err) => {
            console.log(err);
            this.$message.error(err.response.data.message);
          });
        }
      })
    },
     // 新增
    onAdd() {
      this.businessvisible = true;
      this.manageid = undefined;
      this.methodes = manage_create;
      this.titles = "经营信息新增";
      this.$nextTick(() => {
        this.forms = {
          release: undefined,
        };
        this.release=undefined
        this.$refs.jsonDatas.show(["last_month"]);
        this.$refs.jsonDatas.reset();
      });
    },
    // 保存
    getOk() {
      this.$refs.jsonDatas.getData()
      .then((res) => {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            var datas = Object.assign(res, {
              // company: this.id,
              comeform: "PC端",
              // id: this.manageid,
              release: this.release,
            });
            this.methodes(datas)
            .then((response) => {
              this.businessvisible = false;
              this.$message.success(response.data.message);
              this.init();
            })
            .catch((err) => {
              console.log(err);
              this.$message.error(err.response.data.message);
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      })
      .catch((err) => {
        console.log(err);
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
/* 
默认情况下，tag 标签会有一个右外边距 8px，这里我们把这个右外边距改成了 0px
*/
.task_table >>> .ant-tag {
  margin-right: 0px !important;
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

.absolutesolution {
  position:absolute;
  top:-23px;
  left:-39px;
  z-index:999;
  color:#fff;
  font-size:13px;
}
.namecustom::before {
  position:absolute;
  content:"";
  top:-25px;
  left:-41px;
  border-top: 16px solid #1f9246;
  border-left: 16px solid #1f9246;
  border-bottom: 16px solid transparent;
  border-right: 16px solid transparent;
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
        display: inline-block;
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
