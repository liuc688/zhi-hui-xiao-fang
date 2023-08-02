<template>
  <div>
    <div class="title_back">
      <a @click="backs"><a-icon type="arrow-left" />返回</a>
    </div> 
  
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false" class="tableDetails">
      <!-- 详情页面 -->
      <div class="emaildetail">
        <a-spin tip="Loading..." :spinning="loaading">
        <div class="action_button">
          <!-- <a-button type="primary" @click="onReply" :disabled = 'detailsList.status!==2 ? false : true'>回复</a-button> -->
        </div>
        <a-row :gutter="24">
          <a-col :span="24">
            <table class="table_border">
              <tr>
                <td colspan="4">发件人信息</td>
              </tr>
              <tr>
                <th style="width: 80px">姓名:</th>
                <td>{{ detailsList.name }}</td>
                <th style="width: 120px">联系方式:</th>
                <td>{{ detailsList.mobile }}</td>
              </tr>
              <tr>
                <th>现居住地:</th>
                <td>{{ detailsList.address }}</td>
                <th>邮箱:</th>
                <td>{{ detailsList.email }}</td>
              </tr>
              <tr>
                <th colspan="4">信件信息</th>
              </tr>
              <tr>
                <th>主题:</th>
                <td colspan="3">{{ detailsList.title }}</td>
                <!-- <th>信件状态:</th>
                <td>
                  <a-tag v-if="detailsList.status==0" color='red'> 未读 </a-tag>
                  <a-tag v-if="detailsList.status==1" color='red'> 待回复 </a-tag>
                  <a-tag v-if="detailsList.status==2" color='skyblue'> 已回复 </a-tag>
                </td> -->
              </tr>
              <tr>
                <th>信件类型:</th>
                <td>{{ detailsList.type }}</td>
                <th>信件分类</th>
                <td>{{ detailsList.category }}</td>
              </tr>
              <tr>
                <th>创建时间:</th>
                <td>{{ detailsList._createtime.split(" ")[0] }}</td>
                <th>修改时间:</th>
                <td>{{ detailsList._modifytime.split(" ")[0] }}</td>
              </tr>
              <tr>
                <th>信件内容:</th>
                <td colspan="3">
                  <span v-html="detailsList.content"></span>
                </td>
              </tr>
              <!-- <tr>
                <th colspan="4">回复信息:</th>
              </tr>
              <tr>
                <th>回复内容:</th>
                <td colspan="3">
                  <div v-if="detailsList.answer">
                    <span v-html="detailsList.answer"></span>
                  </div>
                  <div v-else>
                    暂无回复
                  </div>
                </td>
              </tr> -->
              <!-- <tr>
                <th>回复附件:</th>
                <td colspan="3">
                  <span v-if="emailDetails.status == 3">
                    <span
                      v-for="(temp, index) in emailDetails.reply.attachment"
                      :key="index"
                    >
                      <a
                        target="_blank" 
                        rel="noopener noreferrer"
                        :title="temp.name"
                        :href="temp.url"
                        :download="temp.name" style="color:#00aaf0"
                        class="ant-upload-list-item-name ant-upload-list-item-name-icon-count-1"
                        >{{ temp.name }}</a
                      >
                    </span>
                  </span>
                  <span v-else>无</span>
                </td>
              </tr>  -->
            </table>
          </a-col>
        </a-row>
        </a-spin>
      </div>
      <!-- 回复弹窗 -->
      <a-modal
        title="回复"
        :visible="visible"
        :width="800"
        :confirm-loading="replyLoading"
        @ok="handleOk"
        @cancel="
          () => {
            visible = false;
            this.$refs.channelForm.reset();
          }
        "
      >
        <k-form-build
          :value="channelForm"
          ref="channelForm"
          :config="config"
        />
      </a-modal>
    </a-card>
  </div>
</template>
<script>
import { form_get } from "@/services/forms";
import Cookie from "js-cookie";
import {
  qy_message_reply,
  qy_message_get,  // 沟通详情接口
} from "@/services/datacenter";

export default {
  props: {
    params: {
      type: Object,
      default: () => {
        return {};
      },
    },
    event: {
      type: Function,
    },
  },
  data() {
    return {
      loaading:true,
      id: "",
      emailDetails: {},
      form: {},
      jsonData: {},
      backforms: {},
      contact: {},
      forward: false,
      back: false,
      replymodal: false,
      transpondId: "",
      replyId: "",
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      confirmLoading: false,
      replyLoading: false,
      backLoading: false,
      nexts: [],
      rules: {
        name: [{ required: true, message: "请输入名称" }],
        organization: [{ required: true, message: "请选择转发部门" }],
        content: [{ required: true, message: "请输入回复内容" }],
        remark: [{ required: true, message: "请输入备注内容" }],
      },
      transpond: [],
      organizations: {},
      type: {
        1: "建议",
        2: "表扬",
        3: "咨询",
        4: "投诉",
      },
      // 状态
      status: {
        1: "提交",
        2: "转发",
        3: "已回复",
        4: "查看",
        5: "退回",
        6: "不予处理",
      },
      // 按钮名称
      button: {
        1: { name: "提交" },
        2: { name: "转发" },
        3: { name: "回复" },
        4: { name: "查看" },
        5: { name: "驳回" },
        6: { name: "不予处理" },
      },
      channelForm:{},
      visible:false,
      detailsList:{},  // 用来承接沟通信息分页页面传递过来的数据
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
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化方法，第一个执行的方法
    init() {
      
      this.detailsList = this.params.record
      this.id = this.params.record.id
      if(this.detailsList) {
        this.loaading = false;
      }
      form_get({name:'communicationReply'})  //引入对应的自定义表单
      .then((response) => {
        this.channelForm = response.data.data.form; //这里的channelForm是在弹窗中定义的:value值
      }).catch((error) => {
        this.$message.error(error);
      });
      qy_message_get({id:this.id})
      .then(res=> {
      })
    },
    // 回复
    onReply(){
      this.visible = true;
    },
    // 回复弹窗的确定按钮
    handleOk() {
      this.$refs.channelForm.getData()  // 获取添加的数据,从表单中获取最后一次的数据
      .then((data) => {
        qy_message_reply(Object.assign(data,{id:this.id}))
        .then((res) => {
          this.detailsList = res.data.data
          this.visible = false; // 弹窗关闭
          this.$refs.channelForm.reset(); // 重置表单数据
          // this.init();  // 调用init()函数，用来刷新页面
        });
      });
    },
    // 返回功能，返回到沟通信息分页页面
    backs(){
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "communicationPagination",
          params: {
            menus: ["communicationPagination"],
            searchform:this.params.searchform,
          },
        },
      });
    }
  },
};
</script>

<style scoped>
.tableDetails {
  margin: 32px;
  border-radius: 10px;
  box-shadow: #cdcdcd  0 0 10px;
}
.table_border {
  border-collapse: collapse;
  border-spacing: 0;
  
  width: 100%;
}
.table_border > tr , th, td {
  border: 1px solid #808080;
  padding: 5px;
}
.action_button button {
  margin: 0px 10px 10px 0;
}
.title_back {
  margin: 10px 32px 10px;
  padding: 10px;
  background: #daedff;
  border: 1px solid #40a9ff;
  border-radius: 5px;
}
.emaildetail {
  padding: 50px;
  background: #f7f7f7;
}
</style>
