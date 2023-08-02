<template>
  <div style="background: #f1f1f1">
    <!-- 返回 -->
    <!-- <div class="title_back">
      <a
        v-on:click="
          () => {
            this.$router.go(-1);
          }
        "
        ><a-icon type="arrow-left" />返回</a
      >
      <a-back-top />
    </div> -->
    <!-- :body-style="{ padding: '24px 32px' }"  -->
    <a-card :bordered="false">
      <!-- 步骤条 -->
      <div class="progress">
        <!-- <span class="progress_title">进度流程</span>
        <hr style="margin: 0" /> -->
        <div class="progress_border">
          <a-steps :current="initial" class="steps" size="small">
            <a-step
              v-for="(item, index) in forwards"
              :key="index"
              style="min-width: 200px"
            >
              <!-- 标题 -->
              <template slot="title">
                <a-tag :color="dynamicData.colors[item.status]">{{
                  dynamicData.status[item.status]
                }}</a-tag>
              </template>
              <!-- 详情描述 -->
              <span slot="description">
                <p style="margin-bottom: 0">
                  操作：{{ item._creator.realname }}
                </p>
                <!-- 执行人 -->
                <p style="margin-bottom: 0" v-if="item.accept != null">
                  执行人：{{ item.accept.realname }}
                </p>
                <!-- 执行人 -->
                <a
                  @click="todetiles(index)"
                  :class="index == totolis ? 'active' : ''"
                  v-auth="`forward.get`"
                  >查看详情</a
                >
              </span>
              <span slot="titles" slot-scope="{ record }">
                <a
                  style="margin-right: 8px"
                  @click="onEdit(record)"
                  v-auth="`forms.user.edit`"
                >
                  {{ record.title }}</a
                >
              </span>
            </a-step>
          </a-steps>
        </div>
        <!-- 操作 -->
        <div style="padding: 50px 10%">
          <div class="alert" v-for="(stemp, index) in next" :key="index">
            <a-alert type="info" :show-icon="true">
              <div class="message" slot="message">
                {{ stemp == 10 ? "完成" : dynamicData.botton[stemp] }} &nbsp;
                <a style="float: right" @click="actionOrder(stemp)"
                  >{{ dynamicData.botton[stemp] }}>></a
                >
                <a @click="changerepair(index)"
                  >&nbsp;{{ listrs[index].title }}</a
                >
              </div>
            </a-alert>
            <div class="backcolors" v-if="listrs[index].visible == true">
              <ul>
                <li style="color: #00bfff; font-weight: 600">
                  <p>{{ contents[stemp].title }}</p>
                </li>
                <p style="margin-left: -20px; text-indent: 30px">
                  {{ contents[stemp].text }}
                </p>
              </ul>
              <!-- <ul>
                <li style="color: #ffbe05; font-weight: 600">
                  <p>市政府要求</p>
                </li>
                <p style="margin-left: -20px; text-indent: 30px">
                  地铁规划的肉肉都给他发货当然他也是人体高度认同与对于他一定会大姐夫阿斯顿发生的否认他是广东分公司答复阿斯顿法师打发海景房
                  法规和技术的让他十分独孤皇后跟对方过后很反感法规和豆腐干红烧豆腐嘎达奉公守法换个地方
                </p>
              </ul> -->
            </div>
          </div>
        </div>
      </div>
    </a-card>

    <!-- 工单详情 -->
    <div class="basic_info">
      <span class="progress_title"
        >操作详情:{{ dynamicData.status[details.status] }}</span
      >
      <hr style="margin: 20px 0" />
      <a-row>
        <a-col :span="12">
          <p>
            <span class="title_lable">工单名称：</span>
            <span class="title_content"> {{ worktitle }}</span>
          </p>
        </a-col>

        <a-col :span="6">
          <p>
            <span class="title_lable">工单来源： </span>
            <span class="title_content">{{ workresource }}</span>
          </p>
        </a-col>

        <a-col :span="6">
          <p>
            <span class="title_lable">工单标签: </span>
            <span class="title_content">
              <a-tag :color="labelstyle.color">
                {{ labelstyle.name }}
              </a-tag>
            </span>
          </p>
        </a-col>
        <a-col :span="6">
          <p>
            <span class="title_lable">创建时间：</span>
            <span class="title_content">{{ details._createtime }}</span>
          </p>
        </a-col>
        <a-col :span="6">
          <p>
            <span class="title_lable">执行人员：</span>
            <span class="title_content">{{ accept }}</span>
          </p>
        </a-col>
        <a-col :span="6">
          <p>
            <span class="title_lable">操作人员：</span>
            <span class="title_content">{{ realname }}</span>
          </p>
        </a-col>

        <a-col :span="6">
          <p>
            <span class="title_lable">工单状态：</span>
            <a-tag
              class="title_content"
              :color="dynamicData.colors[details.status]"
              >{{ dynamicData.status[details.status] }}</a-tag
            >
          </p>
        </a-col>
        <!-- <a-col :span="8" v-if="sites !== null ? true : false">
          <p>
            <span class="title_lable">部门名称: </span>
            <span class="title_content">{{ sites.title }}</span>
          </p>
        </a-col> -->
        <a-col :span="24" v-if="keywordlists ? true : false">
          <p>
            <span class="title_lable">关键词: </span>
            <span v-if="keywordlists.length > 0">
              <a-tag
                class="title_content"
                v-for="item in keywordlists"
                :key="item"
                color="green"
                >{{ item }}</a-tag
              >
            </span>
            <span class="title_content" v-else> 无 </span>
          </p>
        </a-col>
        <a-col :span="24">
          <div class="fuwenben">
            <p class="title_lable">工单信息：</p>
            <div v-html="remarks" class="html_style"></div>
          </div>
        </a-col>
      </a-row>
    </div>
    <!-- 状态操作-转发、处理、已完成、驳回、关闭、激活、编辑 -->
    <a-modal
      :title="actionName"
      width="80%"
      :ok-button-props="{ props: { disabled: dis } }"
      :cancel-button-props="{ props: { disabled: dis } }"
      :confirm-loading="subloading"
      :visible="orderaction"
      @ok="orderactionSubmit()"
      v-auth="`order.reject`"
      @cancel="
        () => {
          orderaction = false;
          this.$refs.orderactionforms.reset();
          if (biaodan) {
            this.$refs.actionforms.resetFields();
          }
        }
      "
    >
      <k-form-build
        :value="formData"
        ref="orderactionforms"
        :dynamicData="dynamicData"
      />
      <a-form-model
        ref="actionforms"
        v-if="biaodan"
        :model="actionforms"
        :rules="rules"
      >
        <a-form-model-item
          label="标签"
          prop="label"
          v-if="labelss"
          :labelCol="{ span: 4 }"
          :wrapperCol="{ span: 18 }"
        >
          <a-select
            placeholder="请选择工单标签"
            style="width: 100%"
            allow-clear
            v-model="actionforms.label"
          >
            <a-select-option v-for="i in labellists" :key="i.id">
              <a-tag :color="i.color">{{ i.name }}</a-tag>
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          label="关键词"
          :labelCol="{ span: 4 }"
          :wrapperCol="{ span: 18 }"
        >
          <a-select
            allow-clear
            mode="tags"
            placeholder="请输入有关此工单的关键词"
            style="width: 100%"
            v-model="actionforms.keywords"
          >
          </a-select>
        </a-form-model-item>
        <!-- 部门人员列表 -->
        <a-form-model-item
          v-if="hasForward(predicts)"
          label="执行人员"
          :labelCol="{ span: 4 }"
          :wrapperCol="{ span: 18 }"
        >
          <a-select
            placeholder="请选择执行人员"
            style="width: 100%"
            allow-clear
            v-model="actionforms.accept"
          >
            <a-select-option v-for="i in userlists" :key="i.id">{{
              i.nickname
            }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          label="预计时间"
          prop="predict"
          v-if="predicts"
          :labelCol="{ span: 4 }"
          :wrapperCol="{ span: 18 }"
        >
          <a-date-picker
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            @change="onChange"
            v-model="actionforms.predict"
            style="width: 100%"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 视频上传中 -->
    <div class="loadings">
      <div style="width: 400px; margin: auto; margin-top: 20%">
        <a-spin class="span_loading" tip="文件上传中..." size="large" />
        <a-progress
          :stroke-color="{
            from: '#108ee9',
            to: '#87d068',
          }"
          :percent="100"
          status="active"
          :showInfo="false"
        />
      </div>
    </div>
  </div>
</template>
<script>
import {
  orders,
  forwardget,
  dispose,
  disposed,
  orderclose,
  activate,
  reject,
  insert,
} from "@/services/order";
import { getform } from "@/services/order";
import { depart, forward, labelall } from "@/services/order";
import { project_list as projectlist } from "@/services/project";

import { workerlis } from "@/services/order";
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
      datapart: [], //部门
      formData: {}, //公用表单
      forwardData: {}, //转发表单
      rejectData: {}, //驳回表单
      workorderData: {}, //编辑表单
      details: {}, //详情信息
      forwards: [],
      keywordlists: [],
      next: [],
      initial: 0,
      realname: "",
      actionName: "工单处理",
      // 操作
      subloading: false,
      orderedit: false,
      orderaction: false,
      dis: false,
      actionforms: {},
      orders: false,
      labelss: false,
      biaodan: true,
      datacode: "",
      //
      listrs: [],
      rules: {
        keywords: [{ required: true, message: "请输入关键词" }],
        remark: [{ required: true, message: "请输入备注内容" }],
        label: [{ required: true, message: "请选择工单标签" }],
        predict: [{ required: true, message: "请输入预计时间" }],
      },
      labellists: [],
      labelstyle: {},
      dislabel: false,
      contents: {
        0: {
          title: "关闭",
          text:
            '关闭操作是由创建工单人执行的操作，对工单处理效果与自己提出效果相符，切换到"关闭"状态。',
        }, //
        1: {
          title: "激活",
          text:
            '激活状态是由创建工单人执行的操作，对已关闭工单进行的操作，该工单处理不是很完善，需要工作人员重新处理，将该工单切换到"待转发"状态。',
        }, //
        2: {
          title: "驳回",
          text:
            '驳回操作是由创建工单人执行的操作，对工单处理效果与自己提出效果不相符，切换到"待转发"状态。',
        }, //
        17: {
          title: "编辑",
          text:
            "编辑操作是对已创建的工单信息进行修改，以确保工单内容的准确性。",
        },
        25: {
          title: "转发",
          text:
            '转发操作是由转发人员将工单转发到能处理该工单的指定部门，并将工单状态切换到"转发"状态',
        }, //
        40: {
          title: "处理",
          text:
            '处理操作是由部门能处理该工单的工作人员进行处理，将工单状态切换到"处理中"状态。',
        }, //
        10: {
          title: "已完成",
          text:
            '完成操作是由处理工单的工作人员将工单处理完成，工单状态 切换到"已完成"状态。',
        },
      },
      sites: {},
      predicts: false, //处理操作-预计时间是否显示
      predictformart: "",
      totolis: 0,
      worktitle: "",
      workresource: "",
      remarks: "",
      actions: "",
      id: "",
      sourceid: "",
      sourcelist: [],
      reedit: {},
      accept: "",
    };
  },
  computed: {
    userinfo() {
      return this.$store.getters["account/user"];
    },
    dynamicData() {
      let result = {
        modalList: [],
        sourcelist: [],
        labellist: [],
        departments: [],
        status: {
          0: "关闭",
          1: "激活",
          2: "驳回",
          10: "已完成",
          15: "待转发",
          17: "编辑",
          25: "转发",
          40: "处理中",
        },
        botton: {
          0: "关闭", //
          1: "激活", //
          2: "驳回", //
          17: "编辑",
          25: "转发", //
          40: "处理", //
          10: "已完成",
        },
        colors: {
          0: "pink",
          1: "red",
          2: "orange",
          15: "geekblue",
          17: "green",
          25: "cyan",
          40: "blue",
          10: "purple",
        },
      };
      for (let item in this.datapart) {
        result.departments.push({
          value: this.datapart[item].id,
          label: this.datapart[item].title,
        });
      }
      for (let item in this.labellists) {
        result.labellist.push({
          value: this.labellists[item].id,
          label: this.labellists[item].name,
        });
      }
      for (let item in this.sourcelist) {
        result.sourcelist.push({
          value: this.sourcelist[item].id,
          label: this.sourcelist[item].title,
        });
      }
      return result;
    },
  },
  created() {
    projectlist().then((res) => {
      this.sourcelist = res.data.data;
    });
    this.init();
  },
  authorize: {
    onEdit: "forms.user.edit",
    todetiles:"forward.get",
    orderactionSubmit:"order.reject",
  },
  methods: {
    onChange(date, dateString) {
      this.predictformart = dateString;
    },
    init() {
      this.id = this.params.id;
      //获取部门
      depart({
        exclude: ["workers"],
      })
        .then((res) => {
          this.datapart = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
      // 转发表单获取
      var data = {
        name: "forward",
      };
      getform(data)
        .then((res) => {
          this.forwardData = res.data.data.form;
        })
        .catch((err) => {
          console.log(err);
        });

      // 驳回表单 rejected
      getform({
        name: "rejected",
      })
        .then((res) => {
          this.rejectData = res.data.data.form;
        })
        .catch((err) => {
          console.log(err);
        });

      // 工单编辑 workorder
      getform({
        name: "workorder",
      })
        .then((res) => {
          this.workorderData = res.data.data.form;
        })
        .catch((err) => {
          console.log(err);
        });
      // 工单列表获取
      labelall()
        .then((res) => {
          this.labellists = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
      this.list();
    },
    list() {
      var perams = {
        id: this.id,
      };
      orders(perams)
        .then((res) => {
          this.reedit = res.data.data;
          this.details = res.data.data;
          this.worktitle = res.data.data.title;
          this.workresource = res.data.data.source
            ? res.data.data.source.title
            : "";
          this.labelstyle = res.data.data.label ? res.data.data.label : ""; //工单标签
          this.forwards = res.data.data.forwards; // 流程操作
          console.log()
          this.keywordlists = res.data.data.keywords; //关键词
          this.next = res.data.data._extension.next; //工单操作
          // this.sites = res.data.data.department; //部门名称
          this.remarks = res.data.data.content;
          // this.remarks= this.remarks.replace("title","download")
          //   console.log('this.remarks',this.remarks);

          this.next.filter(() => {
            this.listrs.push({
              title: "展开知识点",
              visible: false,
            });
          }); //展开知识点
          this.realname = res.data.data._creator.realname
            ? res.data.data._creator.realname
            : "无"; //操作人员
          this.initial = this.forwards.length;
          this.todetiles(this.forwards.length - 1);
          // 获取用户列表
          if (
            this.$store.getters["account/user"]._extension["forward"] == true &&
            this.sites != null
          ) {
            if (this.sites.id) {
              let data = { organization: this.sites.id };
              workerlis(data)
                .then((res) => {
                  this.userlists = res.data.data;
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 解析人员权限
    hasForward(predicts) {
      return (
        predicts && this.$store.getters["account/user"]._extension["forward"]
      );
    },
    changerepair(index) {
      this.listrs[index].visible = !this.listrs[index].visible;
      this.listrs[index].title = this.listrs[index].visible
        ? "收起知识点"
        : "展开知识点";
    },
    // 转发、驳回 、编辑； 关闭、激活、处理、已完成  -操作
    actionOrder(data) {
      this.datacode = data;
      this.dis = false;
      this.predicts = false;
      if (data == 25) {
        //转发
        this.formData = this.forwardData;
        this.actionName = "工单转发";
        this.orderaction = true;
        this.labelss = false;
        this.biaodan = false;
      } else if (data == 17) {
        // 编辑
        this.orderaction = true;
        this.labelss = true;
        this.biaodan = true;
        this.formData = this.workorderData;
        this.actionName = "工单编辑";
        this.$nextTick(() => {
          this.$refs.orderactionforms.setData({
            title: this.reedit.title,
            content: this.reedit.content,
            project: this.reedit.source?this.reedit.source.id:undefined,
          });
          var dileas = {
            label: "",
            keywords: "",
          };
          dileas.label = this.reedit.label.id;
          dileas.keywords = this.reedit.keywords;
          this.actionforms = dileas;
        });
      } else {
        //关闭、激活、处理、已完成  驳回
        this.orderaction = true;
        this.biaodan = true;
        this.labelss = false;
        this.formData = this.rejectData;
        this.actionforms = {};
        if (data == 0) {
          this.actionName = "工单关闭";
          this.biaodan = false;
        } else if (data == 1) {
          this.actionName = "工单激活";
        } else if (data == 40) {
          this.actionName = "工单处理";
          this.predicts = true;
        } else if (data == 10) {
          this.actionName = "工单已完成";
        } else if (data == 2) {
          this.actionName = "工单驳回";
        }
      }
    },
    // 转发 、驳回  提交
    orderactionSubmit() {
      this.$refs.orderactionforms
        .getData()
        .then((res) => {
          if (this.datacode == 25) {
            //转发
            this.subloading = true;
            var datass = {
              id: this.id,
              site: res.depart,
              remark: res.remark,
            };
            forward(datass)
              .then(() => {
                this.subloading = false;
                this.$refs.orderactionforms.reset();
                this.orderaction = false;
                this.list();
                this.$message.success("转发成功！");
              })
              .catch((err) => {
                console.log(err);
                this.subloading = false;
              });
          } else if (this.datacode == 17) {
            //编辑
            this.$refs.actionforms.validate((valid) => {
              if (valid) {
                this.subloading = true;
                var datas = {
                  id: this.id,
                  title: res.title,
                  content: res.content,
                  label: this.actionforms.label,
                  keywords: this.actionforms.keywords,
                  source: res.project,
                };
                insert(datas)
                  .then(() => {
                    this.subloading = false;
                    this.$refs.orderactionforms.reset();
                    this.orderaction = false;
                    this.list();
                    this.$message.success("编辑成功！");
                  })
                  .catch((err) => {
                    console.log(err);
                    this.subloading = false;
                  });
              }
            });
          } else if (this.datacode == 0) {
            //  关闭
            this.subloading = true;
            var datases = {
              id: this.id,
              remark: res.remark,
            };
            orderclose(datases)
              .then(() => {
                this.orderaction = false;
                this.subloading = false;
                this.$refs.orderactionforms.reset();
                this.$message.success("关闭完成！");
                this.list();
              })
              .catch((err) => {
                console.log(err);
                this.subloading = false;
              });
          } else {
            this.$refs.actionforms.validate((valid) => {
              if (valid) {
                var paremss = {
                  id: this.id,
                  remark: res.remark,
                  keywords: this.actionforms.keywords,
                };
                this.subloading = true;
                if (this.datacode == 40) {
                  var disposess = {
                    id: this.id,
                    remark: res.remark,
                    keywords: this.actionforms.keywords,
                    predict: this.predictformart,
                    accept: this.actionforms.accept,
                  };
                  //处理
                  dispose(disposess)
                    .then(() => {
                      this.orderaction = false;
                      this.subloading = false;
                      this.$refs.orderactionforms.reset();
                      this.$refs.actionforms.resetFields();
                      this.$message.success("处理完成！");
                      this.list();
                    })
                    .catch((err) => {
                      this.subloading = false;
                      console.log(err);
                    });
                } else if (this.datacode == 10) {
                  //已完成
                  disposed(paremss)
                    .then(() => {
                      this.orderaction = false;
                      this.subloading = false;
                      this.$refs.orderactionforms.reset();
                      this.$refs.actionforms.resetFields();
                      this.$message.success("已完成完成！");
                      this.list();
                    })
                    .catch((err) => {
                      this.subloading = false;
                      console.log(err);
                    });
                } else if (this.datacode == 2) {
                  //驳回
                  reject(paremss)
                    .then(() => {
                      this.orderaction = false;
                      this.subloading = false;
                      this.$refs.orderactionforms.reset();
                      this.$refs.actionforms.resetFields();
                      this.$message.success("驳回完成！");
                      this.list();
                    })
                    .catch((err) => {
                      console.log(err);
                      this.subloading = false;
                    });
                } else if (this.datacode == 1) {
                  //  激活
                  activate(paremss)
                    .then(() => {
                      this.orderaction = false;
                      this.subloading = false;
                      this.$refs.orderactionforms.reset();
                      this.$refs.actionforms.resetFields();
                      this.$message.success("激活完成！");
                      this.list();
                    })
                    .catch((err) => {
                      console.log(err);
                      this.subloading = false;
                    });
                }
              }
            });
          }
        })
        .catch((err) => console.log(err));
    },
    // 查看详情
    todetiles(index) {
      this.totolis = index;
      var datas = {
        id: this.id,
        index: index,
      };
      forwardget(datas)
        .then((res) => {
          this.details = res.data.data;
          // this.actions = dynamicData.status[this.details.status];
          this.keywordlists = res.data.data.keywords;
          this.sites = res.data.data.department;
          this.realname = res.data.data._creator
            ? res.data.data._creator.realname
            : "无";
          this.accept = res.data.data.accept
            ? res.data.data.accept.realname
            : "无";
          this.remarks =
            this.forwards[index].status == 15 ||
            this.forwards[index].status == 17
              ? res.data.data._extension.content
              : res.data.data.remark;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style scoped  lang="less" >
.alert {
  margin-top: 20px;
  .message {
    a {
      font-weight: 600;
    }
  }
  .clear {
    float: right;
  }
}
</style>
<style scoped>
a {
  color: #00bfff;
}
.html_style {
  padding: 20px;
  background: #ffffff;
  word-break: break-all;
  word-wrap: break-word;
}
.html_style >>> img {
  max-width: 100% !important;
}
.active {
  border: 1px solid #00bfff;
  background: #00bfff;
  color: #ffffff !important;
  border-radius: 5px;
}
.title_back {
  padding: 10px;
  background: #daedff;
  border: 1px solid #40a9ff;
  border-radius: 5px;
  margin-bottom: 20px;
}
.fuwenben {
  background: #ececec;
  padding: 20px;
  min-height: 200px;
  border-radius: 5px;
  line-height: 1.6;
  margin: 0px;
  /* text-indent: 2em; */
}
.basic_info {
  padding: 50px 10%;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 20px;
}
.title_lable {
  font-weight: 600;
  font-size: 16px;
}
.title_content {
  font-weight: 500;
  font-size: 16px;
}

.progress {
  background: #fff;
  border-radius: 4px;
}
.progress_title {
  /* padding: 10px 10%; */
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}
.progress_border {
  width: 80%;
  overflow-x: scroll;
  margin: 0 10%;
}

.description {
  margin-left: -30px;
  margin-top: 20px;
}

.status {
  font-size: 16px;
  size: large;
  font-weight: 800;
  margin: 0 0 5px 10px;
  padding: 3px 10px;
}
.progress {
  background: #fff;
  border-radius: 4px;
}
.steps {
  padding: 60px 0;
  width: 100%;
}
.backcolors {
  background: #f5f5f5;
  padding: 20px;
}

.loadings {
  position: fixed;
  left: 0;
  top: 0;
  display: none;
  width: 100vw;
  height: 100%;
  z-index: 990;
  background: #ffffff99;
}
@media screen and (max-width: 576px) {
  .loadings {
    width: 100%;
  }
}
.span_loading {
  align-items: center;
  display: block;
}
</style>