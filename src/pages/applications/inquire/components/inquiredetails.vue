<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false" :loading = "loading">
    <div>
      <div class="title_backed">
        <a @click="backs"><a-icon type="arrow-left" />返回</a>
      </div>
    </div>
    <div v-if="isShow">
      <a-button
        style="margin-right:10px"
        @click="start"
        :disabled="constsdisabled"
        type="primary"
      >
        {{ consts }}
      </a-button>
      <a-button
        style="margin-right:10px"
        :disabled="disabled"
        @click="hostspeech"
        type="primary"
      >
        主持人发言
      </a-button>
      <a-button
        style="margin-right:10px"
        :disabled="disabled || selectedRowKeys.length != 1"
        @click="guestspeech"
        type="primary"
      >
        嘉宾发言
      </a-button>
      <a-button
        style="margin-right:10px"
        :disabled="disabled"
        @click="scenefile"
        type="primary"
      >
        现场图片上传
      </a-button>
    </div>
    <!-- 列表 -->
    <!-- 
      a-table 去掉了：
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange
      }"
    -->
    <!-- 
      childrenColumnName="answer"
      :defaultExpandAllRows="true"
      :expandedRowRender="(record, index)=>{
          return record.answer ? record.answer.answer :'暂无回复'
      }"
     -->
    <a-table
      ref="table"
      bordered
      class="table_content"
      size="middle"
      :rowKey="rowKeys"
      :columns="columns"
      :dataSource="dataSource"
      :row-selection="rowSelection"
      :pagination="pagination"
    >
      <span slot="question" slot-scope="text, record, index">
        <a-tooltip placement="topLeft">
          <template slot="title">
            {{ record.question }}
          </template>
          <a @click="onEnter(record, index)">{{ record.question }}</a>
        </a-tooltip>
      </span>
      <!-- <span slot="expandedRowRender" slot-scope="text, record">
        {{ record.answer ? record.answer.answer :'暂无回复' }}
      </span> -->
      <span slot="action" slot-scope="text, record, index">
        <a v-if="record.answer == null" @click="reply(record, index + (page-1)*10)" >答复</a>
        <a v-else @click="reply(record, index + (page-1)*10)">编辑答复</a>
      </span>
      <span slot="indesx" slot-scope="text, record">
        {{ record.prologue ? "主持人" : record._extension.name }}
      </span>
      <template slot="title">
        提问列表
      </template>
    </a-table>
    <!-- 问题查看 -->
    <a-modal
      title="问题查看"
      width="50%"
      :visible="visible"
      @cancel="
        () => {
          visible = false;
          this.forms = {};
        }
      "
    >
      <template slot="footer">
        <a-button @click="() => { visible = false; }">
          关闭
        </a-button>
      </template>
      <a-form-model
        layout="horizontal"
        :model="forms"
        ref="forms"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="提问用户名称">
          <a-input v-model="forms.name" />
        </a-form-model-item>
        <a-form-model-item label="提问内容">
          <a-input type="textarea" v-model="forms.question" :rows="4" />
        </a-form-model-item>
        <a-form-model-item label="提问时间">
          <a-date-picker
            style="width:100%"
            v-model="forms._createtime"
            show-time
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 问题回复 -->
    <a-modal
      title="问题回复"
      width="50%"
      :visible="replys"
      @ok="replySubmit"
      @cancel="
        () => {
          replys = false;
          this.$refs.replysforms.reset();
        }
      "
    >
      <a-form-model-item
        label="问题内容"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 18 }"
      >
        <div class="add_back ">{{ questions }}</div>
      </a-form-model-item>
      <k-form-build :value="jsonDatas" ref="replysforms" />
    </a-modal>
    <!-- 主持人、嘉宾 发言 -->
    <a-modal
      :title="hosttitle"
      width="50%"
      :visible="hosts"
      @ok="handleOk"
      @cancel="
        () => {
          hosts = false;
          this.$refs.hostsforms.resetFields();
        }
      "
    >
      <a-form-model
        layout="horizontal"
        :model="hostsforms"
        ref="hostsforms"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="发言内容" prop="content">
          <a-input type="textarea" v-model="hostsforms.content" :rows="4" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 现场图片、文件 上传 -->
    <a-modal
      title="现场图片上传"
      width="50%"
      :visible="scenefiles"
      @ok="handlepicture"
      @cancel="
        () => {
          scenefiles = false;
          this.$refs.sceneforms.reset();
        }
      "
    >
      <k-form-build :value="jsonData" :config="config" ref="sceneforms" />
    </a-modal>
    <!-- 开始、结束 -->
    <a-modal
      :title="starts"
      width="50%"
      :visible="addressed"
      :confirm-loading="politicsLoading"
      @ok="handlestart"
      @cancel="
        () => {
          addressed = false;
          this.$refs.addressedforms.reset();
        }
      "
    >
      <k-form-build :value="jsonDatastart" ref="addressedforms" />
    </a-modal>
  </a-card>
</template>
<script>
import {
  inquire_get,
  question_answer,
  prologue_insert,
  inquire_banner,
  inquire_start
} from "@/services/inquire";
import { form_get } from "@/services/forms";
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
  },

  data() {
    return {
      dataSource: [],
      datalist: {},
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      loading:true,
      politicsLoading: false,
      isShow:true,  // 四个按钮整体的显示与隐藏，v-if 中 true 为显示，false 为隐藏
      constsdisabled: false,  // “开始/结束”按钮的显示
      disabled: true,  // 操作按钮显示
      selectedRowKeys: [],
      jsonData: {},
      jsonDatas: {},
      jsonDatastart: {},
      id: this.$route.query.id,
      visible: false,
      replys: false,
      forms: {},
      replysforms: {},
      sceneforms: {},
      scenefiles: false,
      consts: "开始",
      hosttitle: "主持人发言",
      starts: "开场",
      addressed: false, //开场白弹窗
      addressedforms: {},
      hostscontent: "主持人开场白",
      guestcontent: "嘉宾开场白",
      questions: "",
      pepole: "",
      hostsforms: {
        content: undefined
      },
      hosts: false,
      questingdex: "",
      columns: [
        {
          title: "网友序号",
          width: 120,
          scopedSlots: { customRender: "indesx" }
        },
        {
          title: "问题",
          dataIndex: "question",
          ellipsis:true,
          scopedSlots: { customRender: "question" }
        },
        {
          title: "提问日期",
          dataIndex: "_createtime",
          width: 180,
          scopedSlots: { customRender: "_createtime" }
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 100,
          scopedSlots: { customRender: "action" }
        }
      ],
      rules: {
        question: [{ required: true, message: "请输入回复内容" }],
        content: [{ required: true, message: "请输入发言内容" }],
        guestcontent: [{ required: true, message: "请输入内容" }],
        hostscontent: [{ required: true, message: "请输入内容" }]
      },
      // expandedRowRender:[],
      pagination: {
        onChange: (page) => {
          this.page = page;
        },
        pageSize: 10,
      },
      page: 1,
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
    rowSelection:{
      get(){
        if(this.isShow) {  // 如果 isShow 为真，展示“四个按钮”的同时也会展示 a-table 左侧的选择框，否则不会再展示“四个按钮”，也不会再展示 a-table 左侧的选择框
          return {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange
          }
        } else {
          return undefined
        }
      },
      set(value) {  // 未用到
        
      }
    }
  },
  created() {
    window.scrollTo(0, 0);
    this.init();
  },
  methods: {
    init() {
      Promise.all([
        form_get({name:"scenes"}),
        form_get({name:"politics_reply"}),
        form_get({name:"politics_start"}),
      ])
      .then(Response => {
        this.jsonData = Response[0].data.data.form;
        this.jsonDatas = Response[1].data.data.form;
        this.jsonDatastart = Response[2].data.data.form;
        this.list();
      })
      .catch(error => {
        console.log("erroe", error);
      });
    },
    list() {
      inquire_get({id: this.params.data.id})
      .then(res => {
        this.datalist = res.data.data;
        this.dataSource = res.data.data.questions;
        if (this.datalist.status == 1) {
          this.consts = "开始";
          this.disabled = true;
        } else if (this.datalist.status == 2) {
          this.consts = "结束";
          this.disabled = false;
        } else {  // 这时候表示问政状态为结束的状态，所有的按钮都不可以操作了
          this.disabled = true;
          this.constsdisabled = true;
          this.isShow = false  // 所有操作按钮不展示
        }
        this.loading = false  // 关闭加载效果（蒙层）
      })
      .catch(err => {
        console.log("err", err);
      });
    },
    // 开始
    start() {
      this.addressed = true;
      if (this.datalist.status == 1) {
        this.starts="开场"
        this.$nextTick(() => {
          var host =
            "各位网友朋友大家好！欢迎参与“网络在线问政”活动。今天我们很高兴邀请到" +
            this.datalist.organization.title +
            "的" +
            this.datalist.name +
            "同志，就“" +
            this.datalist.title +
            "”相关内容与广大网友进行交流，解答市民的疑问，倾听意见和建议，欢迎社会各界人士积极参与。" +
            this.datalist.name +
            "同志，欢迎您做客“网络在线问政”栏目，请先跟各位网友打个招呼吧。";
          var guest =
            "网民朋友们,大家好！非常高兴来到“网络在线问政”栏目与广大网友进行交流。真诚欢迎大家畅所欲言，针对我们“" +
            this.datalist.title +
            "”工作提出宝贵意见与建议，我们将认真解答大家的提问，虚心听取意见和建议，积极改进工作。谢谢！";
          this.$refs.addressedforms.setData({
            hostscontent: host,
            guestcontent: guest
          });
        });
      } else {
        this.starts="结尾"
        this.$nextTick(() => {
          var start =
            "各位市民朋友，今天的访谈活动到此结束！谢谢您的参与，谢谢" +
            this.datalist.name +
            "的解读。";
          var end =
            "各位网民朋友们！今天的问题已经全部答复完毕。衷心感谢广大网友对我市统计工作的关心与支持。对于提出的意见和建议，我们将认真研究，努力改进。大家如果对“" +
            this.datalist.title +
            "”问题还有其他问题，可以拨打我局咨询电话（0532—85913405、85913408）咨询。再次感谢大家的参与，再见！";
          this.$refs.addressedforms.setData({
            hostscontent: start,
            guestcontent: end
          });
        });
      }
    },
    //开始、结束  提交
    handlestart() {
      if (this.datalist.status == 1) {
        this.$refs.addressedforms.getData().then(res=>{
          var parems = {
            id: this.params.data.id,
            question: res.hostscontent,
            answer: res.guestcontent
          };
          inquire_start(parems)
          .then(() => {
            this.politicsLoading = false;
            this.$refs.addressedforms.reset();
            this.$message.success("操作成功！");
            this.addressed = false; //弹窗消失
            this.disabled = false; //操作按钮显示
            this.list();
          })
          .catch(err => {
            console.log(err);
            this.politicsLoading = false;
          });
        }).catch(err=>{
          console.log(err)
        })
      } else if (this.datalist.status == 2) {
        this.$refs.addressedforms.getData().then(res=>{
          var parems = {
            id: this.params.data.id,
            question: res.hostscontent,
            answer: res.guestcontent
          };
          inquire_start(parems)
          .then(() => {
            this.politicsLoading = false;
            this.$refs.addressedforms.reset();
            this.$message.success("操作成功！");
            this.addressed = false;  // 弹窗消失
            this.disabled = true;  // 操作按钮置灰
            this.constsdisabled = true;  // 开始按钮置灰
            this.list();
          })
          .catch(err => {
            console.log(err);
            this.politicsLoading = false;
          });
        }).catch(err=>{
          console.log(err)
        })
      }
    },
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys',selectedRowKeys )

      this.selectedRowKeys = selectedRowKeys;
    },
    // 问题查看
    onEnter(record, index) {
      this.visible = true;
      this.$nextTick(() => {
        this.forms = record;
        this.forms.name = "网友" + (index + 1);
      });
    },
    // 主持人发言
    hostspeech() {
      this.hosttitle = "主持人发言";
      this.hosts = true;
      this.pepole = 1;
      this.$nextTick(()=>{
          this.$refs.hostsforms.resetFields()
      })
    },
    // 嘉宾发言
    guestspeech() {
      if (this.selectedRowKeys.length == 1) {
        this.hosttitle = "嘉宾发言";
        this.hosts = true;
        this.pepole = 2;
        this.$nextTick(()=>{
          this.$refs.hostsforms.resetFields()
        })
      } else {
        this.$message.warning("请选择一条问题再回复！");
      }
    },
    // 发言提交
    handleOk() {
      if (this.pepole == 1) {
        this.$refs.hostsforms.validate(valid => {
          if (valid) {
            var data = {
              question: this.hostsforms.content,
              id: this.params.data.id
            };
            prologue_insert(data)
            .then((res) => {
              this.hosts = false;
              this.$refs.hostsforms.resetFields()
              this.$message.success("操作成功！");
              this.list();
            })
            .catch(err => {
              console.log(err);
            });
          } else {
            console.log("请输入必填内容");
          }
        });
      } else if (this.pepole == 2) {
        if (this.selectedRowKeys.length == 1) {
          this.$refs.hostsforms.validate(valid => {
            if (valid) {
              var perams = {
                index: this.selectedRowKeys[0],
                answer: this.hostsforms.content,
                id: this.params.data.id
              };
              question_answer(perams)
              .then(() => {
                this.hosts = false;
                this.$refs.hostsforms.resetFields()
                this.selectedRowKeys=[]
                this.$message.success("操作成功！");
                this.list();
              })
              .catch(err => {
                console.log("err", err);
                this.hosts = false;
              });
            }
          });
        }
      }
    },
    // 现场文件上传
    scenefile() {
      this.scenefiles = true;
      this.$nextTick(() => {
        this.$refs.sceneforms.setData({
          pictures: this.datalist.banners
        });
      });
    },
    // 文件上传提交
    handlepicture() {
      this.$nextTick(() => {
        this.$refs.sceneforms.getData()
        .then(res => {
          var parems = {
            id: this.params.data.id,
            banner: res.pictures
          };
          inquire_banner(parems);
        })
        .then(() => {
          this.scenefiles = false;
          this.$message.success("操作成功！");
          this.list();
        })
        .catch(err => {
          console.log(err);
        });
      });
    },

    // 答复
    reply(record, index) {
      this.questions = record.question;
      this.questingdex = index;
      this.replys = true;
      if (record.answer) {
        this.$nextTick(() => {
          this.$refs.replysforms.setData({
            answer: record.answer.answer
          });
        });
      } else {
        this.$nextTick(() => {
          this.$refs.replysforms.reset();
        });
      }
    },
    // 回复提交
    replySubmit() {
      this.$refs.replysforms
        .getData()
        .then(res => {
          var perams = {
            index: this.questingdex,
            answer: res.answer,
            id: this.params.data.id
          };
          question_answer(perams)
          .then(res => {
            this.replys = false;
            this.$message.success("操作成功！");
            this.list();
          })
          .catch(err => {
            console.log("err", err);
            this.replys = false;
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    rowKeys(e,index ){
      return index+ (this.page-1)*10
    },
    onSelectClear() {
      this.selectedRowKeys = [];
    },
    deleteDraft() {
    },
    backs() {
      this.$emit("event", {
        method: "onLink",
        params: {
          id:this.params.id?this.params.id:'',
          route: "home",
          params: this.params,
        },
      });
    },
  }
};
</script>
<style>
.ant-table table {
  border-collapse: collapse;
  border-spacing: 0;
}
.ant-table-thead > tr > th,
.ant-table-tbody > tr > td {
  border-left: 1px solid #f0f0f0;
  border-top: 1px solid #f0f0f0;
}
</style>
<style scoped>
a{
  color: #00aaf0  !important;
}
.title_backed {
  padding: 10px;
  background: #daedff;
  border: 1px solid #40a9ff;
  border-radius: 5px;
  margin:10px 0px 20px !important;
}
.add_back {
  margin-bottom: 0;
  padding: 0px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color:rgb(252, 232, 193)
}
.table_content {
  margin: 20px 0;
}
</style>