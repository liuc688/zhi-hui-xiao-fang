<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false" :loading = 'loaading'>
    <div>
      <div class="title_back">
        <a @click="backs"><a-icon type="arrow-left" />返回</a>
      </div>
    </div>
    <!-- 详情页面 -->
    <div>
      <div class="emaildetail">
        <a-spin tip="Loading..." :spinning="loaading">
          <div class="action_button">
            <a-button
              v-for="item in nexts"
              @click="operation(item)"
              :key="item"
              type="primary"
            >
              {{ button[item].name }}</a-button
            >
          </div>
          <a-row :gutter="24">
            <a-col :span="16">
              <table class="table_border">
                <tr>
                  <td colspan="4">发件人信息</td>
                </tr>
                <tr>
                  <th style="width: 80px">姓名:</th>
                  <td>{{ contact.name }}</td>
                  <th style="width: 80px">性别:</th>
                  <td>{{ contact.sex ? "男" : "女" }}</td>
                </tr>
                <tr>
                  <th>联系方式:</th>
                  <td>{{ contact.mobile }}</td>
                  <th>籍贯:</th>
                  <td>{{ contact.place }}</td>
                </tr>
                <tr>
                  <th>现居住地:</th>
                  <td>{{ contact.address }}</td>
                  <th>邮箱:</th>
                  <td>{{ contact.email }}</td>
                </tr>
                <tr>
                  <th colspan="4">信件信息</th>
                </tr>

                <tr>
                  <th>主题:</th>
                  <td>{{ emailDetails.title }}</td>
                  <th>是否公开:</th>
                  <td>{{ emailDetails.public ? "是" : "否" }}</td>
                </tr>
                <tr>
                  <th style="width: 120px">是否接受联系:</th>
                  <td>{{ emailDetails.relation ? "是" : "否" }}</td>
                  <th>信件密文:</th>
                  <td>{{ emailDetails.secret }}</td>
                </tr>
                <tr>
                  <th>信件类型:</th>
                  <!--  -->
                  <td>{{ type[emailDetails.type] }}</td>
                  <th>信件编码:</th>
                  <td>{{ emailDetails.select }}</td>
                </tr>
                <tr>
                  <th>创建时间:</th>
                  <td>{{ emailDetails._createtime }}</td>
                  <th>信件状态:</th>
                  <!--  -->
                  <td>{{ status[emailDetails.status] }}</td>
                </tr>
                <tr>
                  <th>信件内容:</th>
                  <td colspan="3">
                    {{ emailDetails.content }}
                  </td>
                </tr>
                <tr>
                  <th colspan="4">回复信息:</th>
                </tr>
                <tr>
                  <th>回复时间:</th>
                  <td colspan="3">
                    {{
                      emailDetails.status == 3
                        ? emailDetails.reply._createtime
                        : "无"
                    }}
                  </td>
                </tr>
                <tr>
                  <th>回复内容:</th>
                  <td colspan="3">
                    {{
                      emailDetails.status == 3 ? emailDetails.reply.content : "无"
                    }}
                  </td>
                </tr>
                <tr>
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
                        >
                          {{ temp.name }}
                        </a>
                      </span>
                    </span>
                    <span v-else> 无 </span>
                  </td>
                </tr>
              </table>
            </a-col>
            <a-col :span="8" style="padding-left: 5%">
              <h4>信件转发流程</h4>
              <br />
              <a-timeline>
                <a-timeline-item v-for="(item, index) in transpond" :key="index">
                  <span> {{ item._createtime }} {{ status[item.status] }} </span>
                  <span v-if="item.status == 2">{{ item.organization.title }}</span>
                  <p v-if="item.status == 2">备注:{{ item.remark }}</p>
                  <p v-if="item.status == 5">原因:{{ item.remark }}</p>
                </a-timeline-item>
              </a-timeline>
            </a-col>
          </a-row>
        </a-spin>
      </div>
    </div>
    <!-- 转发弹窗 -->
    <a-modal
      title="转发"
      :visible="forward"
      :width="800"
      :confirm-loading="confirmLoading"
      @ok="transpondHandle"
      @cancel="
        () => {
          forward = false;
          this.$refs.form.resetFields();
        }
      "
    >
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="接收部门" prop="organization">
          <a-tree-select
            style="width: 100%"
            show-search
            v-model="form.organization"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="organizations"
            placeholder="请选择搜索站点"
            :replaceFields="{
              title: 'title',
              key: 'id',
              value: 'id',
            }"
            :filterTreeNode="
              (value, node) => {
                const data = node.componentOptions.propsData.dataRef;
                return (
                  data.title.indexOf(value) !== -1 ||
                  data.name.indexOf(value) !== -1
                );
              }
            "
          >
            <span slot="title" slot-scope="{ key, value }" style="color: #08c">
              Child Node1 {{ value }}
            </span>
          </a-tree-select>
        </a-form-model-item>
        <a-form-model-item label="备注" prop="remark">
          <a-input
          placeholder="请输入备注信息"
          v-model="form.remark"
          type="textarea"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 驳回弹窗 -->
    <a-modal
      title="驳回"
      :visible="back"
      :width="800"
      :confirm-loading="backLoading"
      @ok="backHandle"
      @cancel="
        () => {
          back = false;
          this.$refs.backforms.resetFields();
        }
      "
    >
      <a-form-model
        ref="backforms"
        :model="backforms"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="备注" prop="remark">
          <a-input
          placeholder="请输入备注信息"
          v-model="backforms.remark"
          type="textarea"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 回复弹窗 -->
    <a-modal
      title="回复"
      :visible="replymodal"
      :width="800"
      :confirm-loading="replyLoading"
      @ok="replyHandle"
      @cancel="
        () => {
          replymodal = false;
          this.$refs.replyform.reset();
        }
      "
    >
      <k-form-build
        :value="jsonData"
        ref="replyform"
        :dynamicData="dynamicData"
        :config="config"
      />
    </a-modal>
  </a-card>
</template>
<script>
import { form_get } from "@/services/forms";
import { organization_tree } from "@/services/organization";
import Cookie from "js-cookie";
import {
  email_refuse,
  email_transpond,
  email_get,
  email_reply,
  email_back,
} from "@/services/email";

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
    };
  },
  computed: {
    dynamicData() {
      let result = {
        scope: {
          1: "今天",
          2: "本周",
          3: "上周",
          4: "本月",
          5: "上月",
        },
      };
      return result;
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
  authorize: {
    onEnter: "inquire.update",
    onAdd: "inquire.add",
  },
  created() {
    console.log('this.params',this.params)
    this.id = this.params.data.id;
  },

  mounted() {
    this.init();
  },
  methods: {
    operation(item) {
      if (item == 2) {
        this.transponds();
      } else if (item == 3) {
        this.replys();
      } else if (item == 6) {
        this.refuse();
      }
      if (item == 5) {
        this.reback();
      }
    },
    // 退回 弹窗
    reback() {
      this.back = true;
    },
    // 回退 保存
    backHandle() {
      this.$refs.backforms.validate((valid) => {
        if (valid) {
          this.backLoading = true;
          var parems = {
              id: this.id,
              remark: this.backforms.remark,
          };
          email_back(parems)
            .then(() => {
              this.$refs.backforms.resetFields();
              this.backLoading = false;
              this.back = false;
              this.$message.success("操作成功！");
              this.loaading=true
              this.documentget();
            })
            .catch((err) => {
              console.log("err", err);
              this.backLoading = false;
            });
        }
      });
    },
    // 回复 弹窗
    replys() {
      this.replyId = this.id;
      this.replymodal = true;
    },
    // 回复 提交
    replyHandle() {
      this.$refs.replyform
        .getData()
        .then((values) => {
          this.replyLoading = true;
          var parems = {
              id: this.replyId,
              content: values.content,
              attachment: values.attachment,
          };
          email_reply(parems)
            .then(() => {
              this.$refs.replyform.reset();
              this.replyLoading = false;
              this.replymodal = false;
              this.$message.success("操作成功！");
              this.loaading=true
              this.documentget();
            })
            .catch((err) => {
              this.replyLoading = false;
              console.log("err", err);
            });
        })
        .catch((err) => {
          console.log("err", err);
          return false;
        });
    },
    // 不予处理
    refuse() {
      var id = this.id;
      var that = this;
      this.$confirm({
        title: "您确定不予处理此信件吗?",
        okText: '确定',
        cancelText: '取消',
        icon: "info-circle",
        onOk() {
          email_refuse({
              id: id,
          })
            .then(() => {
              that.$message.success("操作成功！");
              that.loaading=true
              that.documentget();
            })
            .catch((err) => {
              console.log("err", err);
              that.loaading=true
              // that.$message.fail("操作失败！");
            });
        },
        onCancel() {},
      });
    },
    // 转发 弹窗
    transponds() {
      this.transpondId = this.id;
      this.forward = true;
    },
    // 转发 提交
    transpondHandle() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.confirmLoading = true;
          var parems = {
              id: this.transpondId,
              organization: this.form.organization,
              remark: this.form.remark,
          };
          email_transpond(parems)
            .then(() => {
              this.$refs.form.resetFields();
              this.confirmLoading = false;
              this.forward = false;
              this.$message.success("操作成功！");
              this.loaading=true
              this.documentget();
            })
            .catch((err) => {
              console.log("err", err);
              this.confirmLoading = false;
            });
        } else {
          return false;
        }
      });
    },
    init() {
      Promise.all([
        organization_tree(),
        form_get({ name: "email_repalys" })
      ]).then((res) => {
          this.organizations = res[0].data.data;
          this.jsonData = res[1].data.data.form;
          this.documentget()
        })
        .catch((err) => {
          this.loaading=false
          console.log("err", err);
        });
    },
    documentget(){
        email_get({ id: this.id }).then((res) => {
          this.emailDetails = res.data.data;
          this.transpond = res.data.data.transpond;
          this.contact = res.data.data.contact;
          this.nexts = res.data.data._extension.next;
          this.loaading=false
        })
        .catch((err) => {
          this.loaading=false
          console.log("err", err);
        });
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.indexOf(input) >= 0;
    },
    backs() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "home",
          params: this.params,
        },
      });
    },
  },
};
</script>

<style >

</style>
<style scoped>
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
  padding: 10px;
  background: #daedff;
  border: 1px solid #40a9ff;
  border-radius: 5px;
  /* margin-bottom: 20px; */
  margin: 20px 0;
}
.emaildetail {
  background: #fff !important;
  padding: 35px !important;
  border-radius: 8px !important;
  box-shadow: #d8d8d8 0 0 6px !important;
  margin-bottom: 30px !important;
}
</style>
