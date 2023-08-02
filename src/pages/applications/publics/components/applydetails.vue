<template>
  <div class="main">
    <a-spin tip="Loading..." :spinning="loadings">
      <a-back-top />
      <!-- 基本信息 -->
      <div class="basic_info">
        <a-row>
          <a-col :span="16">
            <a-row>
              <a-col :span="12">
                <p>
                  <span class="title_lable">姓名: </span>
                  <span class="title_content"> {{ datalist.realname }}</span>
                </p>
              </a-col>
              <a-col :span="12">
                <p>
                  <span class="title_lable">受理时间: </span>
                  <span class="title_content">{{ datalist.remedy }}</span>
                </p>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <p>
                  <span class="title_lable">手机号: </span>
                  <span class="title_content"> {{ datalist.mobile }}</span>
                </p>
              </a-col>
              <a-col :span="12">
                <p>
                  <span class="title_lable">申请单位: </span>
                  <span class="title_content"> {{ organization }}</span>
                </p>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <p>
                  <span class="title_lable">查询码: </span>
                  <span class="title_content"> {{ datalist.secret }}</span>
                </p>
              </a-col>
              <a-col :span="12">
                <p>
                  <span class="title_lable">查询编号: </span>
                  <span class="title_content"> {{ datalist.select }}</span>
                </p>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <p>
                  <span class="title_lable">证件号: </span>
                  <span class="title_content"> {{ datalist.passport }}</span>
                </p>
              </a-col>
              <a-col :span="12">
                <p>
                  <span class="title_lable"
                    >标签
                    <a
                      ><a-icon
                        type="edit"
                        @click="edict(keywordlists)"
                        v-auth="`public.keywords`"
                    /></a>
                  </span>
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
            </a-row>
          </a-col>
          <a-col :span="8">
            <a-row>
              <a-col :span="24" style="text-align: right">
                <p>状态</p>
                <a-tag
                  v-for="item in datalist.status"
                  :key="item"
                  :color="status[item].color"
                  class="status"
                  >{{ status[item].title }}</a-tag
                >
              </a-col>
            </a-row>
            <!-- <a-row>
            <a-col :span="24" style="text-align:right;margin-top:40px">
              <a-button type="primary" @click="templatedownload"
                >下载模板</a-button
              >
            </a-col>
          </a-row> -->
          </a-col>
        </a-row>
      </div>
      <!-- 步骤条 -->
      <div class="progress">
        <p
          style="
            padding: 10px 10%;
            margin: 0;
            font-size: 18px;
            font-weight: 600;
          "
        >
          进度流程
        </p>
        <hr style="margin: 0" />
        <div class="all_actions">
          <a-steps :current="initial" class="steps" size="small">
            <!-- <a-popover slot="progressDot" slot-scope="{ status, prefixCls }">
            <template slot="content">
              <div v-if="status == 'finish'">
                <p>已完成!</p>
              </div>
              <div v-if="status == 'process'">
                <p>正在进行中!!!</p>
              </div>
              <div v-if="status == 'wait'">
                <p>下一里程碑</p>
                <p style="color:#b6daaa;font-size:16px">剩余时间: {{}}</p>
              </div>
            </template>
            <span :class="`${prefixCls}-icon-dot`" />
          </a-popover> -->
            <a-step
              v-for="(item, index) in progress"
              :key="index"
              style="min-width: 200px"
            >
              <!-- 标题 -->
              <template slot="title">
                <!-- <a-icon
                slot="icon"
                :type="
                  item.status == 60 || index == progress.length - 1
                    ? 'check'
                    : 'arrow-right'
                "
                :style="{ color: item.status == 60 ? 'green' : 'gray' }"
              /> -->
                {{ status[item.status].title }}
              </template>
              <!-- 详情描述 -->
              <span slot="description">
                <p class="description">
                  {{
                    JSON.stringify(item._extension) !== "{}"
                      ? "截止日期："
                      : index == initial
                      ? index == progress.length - 1
                        ? "生成日期："
                        : "当前日期："
                      : "生成日期："
                  }}
                  {{ item._createtime.substring(0, 10) }}
                </p>
                <a
                  v-if="
                    JSON.stringify(item._extension) == '{}' &&
                    item.status !== 200
                  "
                  @click="todetile(item, index)"
                  >查看详情</a
                >
                <a-dropdown v-if="item.status == 200 && detile.next.length > 0">
                  <a class="ant-dropdown-link">
                    快捷操作
                    <a-icon type="down" />
                  </a>
                  <a-menu slot="overlay">
                    <a-menu-item v-for="item in detile.next" :key="item">
                      <a href="javascript:;" @click="todetile(item)">{{
                        button[item].title
                      }}</a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </span>
            </a-step>
          </a-steps>
        </div>
        <a-modal
          title="模板下载"
          :visible="templates"
          :footer="null"
          @cancel="
            () => {
              templates = false;
              this.$refs.loadforms.reset();
              this.modalId = '';
            }
          "
        >
          <k-form-build
            style="min-height: 200px"
            :value="templateload"
            @change="modalChange"
            :dynamicData="dynamicData"
            ref="loadforms"
          />
        </a-modal>
        <!-- 详情弹窗 -->
        <a-modal
          :title="detiletitle"
          width="50%"
          :visible="visibles"
          footer=""
          @cancel="
            () => {
              (visibles = false), this.$refs.forms.reset();
            }
          "
        >
          <k-form-build
            :value="listData"
            disabled
            :dynamicData="dynamicData"
            ref="forms"
          />
        </a-modal>
        <!-- 操作弹窗 -->
        <a-modal
          :title="titleStr"
          width="50%"
          :confirm-loading="subloading"
          :visible="isvisibles"
          @ok="statusSubmit()"
          @cancel="
            () => {
              (isvisibles = false), this.$refs.form.reset();
            }
          "
        >
          <k-form-build
            :value="listDatas"
            @change="modalChange"
            :dynamicData="dynamicData"
            ref="form"
          />
        </a-modal>
        <!-- 输入标签 -->
        <a-modal
          title="输入标签"
          width="50%"
          :confirm-loading="subloading"
          :visible="keywords"
          @ok="keyformsSubmit()"
          @cancel="
            () => {
              this.keywords = false;
              this.$refs.keyforms.resetFields();
            }
          "
        >
          <a-form-model ref="keyforms" :model="keyforms" :rules="rules">
            <a-form-model-item
              label="标签"
              prop="keywords"
              :labelCol="{ span: 4 }"
              :wrapperCol="{ span: 18 }"
            >
              <a-select
                mode="tags"
                placeholder="请输入有关此申请内容的标签"
                style="width: 100%"
                v-model="keyforms.keywords"
              >
                <a-select-option v-for="items in keywordsList" :key="items">{{
                  items
                }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-form-model>
        </a-modal>
        <!-- 折叠面板 -->
        <div class="collapse_list">
          <div class="alert" v-for="(item, index) in detile.next" :key="index">
            <a-alert type="info" :show-icon="true">
              <div class="message" slot="message">
                {{ redates(item) }}需要对申请进行{{
                  button[item].title
                }}。&nbsp;
                <a class="clear" @click="todetile(item)"
                  >{{ button[item].title }}>></a
                >
                <a @click="changerepair(index)"
                  >&nbsp;{{ listrs[index].title }}</a
                >
              </div>
            </a-alert>
            <div class="backcolors" v-if="listrs[index].visible == true">
              <ul>
                <li style="color: #00bfff; font-weight: 600">
                  <p>中华人民共和国政府信息公开条例</p>
                </li>
                <p style="margin-left: 0px; text-indent: 30px">
                  {{ button[item].content || "暂无" }}
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
    </a-spin>
  </div>
</template>
<script>
import { form_get } from "@/services/forms";
import {
  public_get,
  defer, //延期
  repair, //待补证
  reply, //答复
  restore, //答复复议
  addition, //补证资料
  opinion, // 待征求第三方意见
  opinioned, //录入第三方意见
  teamwork, //待补充协办信息
  teamworked, //录入协办信息
  reconsider, //行政复议
  uploadlist,
  replace,
  lawsuit,
  keywords,
  keywordslist,
} from "@/services/public";
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
      loadings: true,
      organization: "",
      status: {
        20: { title: "待答复", color: "red" },
        25: { title: "待补证", color: "orange" },
        30: { title: "补证资料", color: "pink" },
        31: { title: "待补充第三方意见", color: "pink" },
        32: { title: "待补充协办信息", color: "pink" },
        40: { title: "第三方意见", color: "green" },
        45: { title: "协办信息", color: "green" },
        50: { title: "延期信息", color: "green" },
        60: { title: "已答复", color: "green" },
        65: { title: "补充答复", color: "green" },
        70: { title: "行政复议", color: "blue" },
        75: { title: "诉讼", color: "blue" },
        80: { title: "答复复议", color: "purple" },
        90: { title: "已答复复议", color: "purple" },
        100: { title: "已失效", color: "gray" },
        110: { title: "已撤销", color: "gray" },
        200: { title: "当前", color: "green" },
      },
      id: "",
      titles: "展开知识点",
      repair: false,
      repairtitle: "展开知识点",
      initial: 0,
      titleStr: "",
      detiletitle: "",
      listData: {},
      listDatas: {},
      visibles: false,
      isvisibles: false,
      templates: false,
      subloading: false,
      keywords: false,
      keywordsid: "",
      keywordsList: [],
      keywordlists: [],
      keyforms: {
        keywords: [],
      },
      rules: {
        keywords: [{ required: true, message: "请输入标签" }],
      },
      modalId: "",
      // 表单
      teamworkedData: {}, //录入协办信息
      teamworkData: {}, //征求协办信息
      opinionedData: {},
      opinionsData: {},
      restoreData: {},
      replyData: {},
      repairData: {},
      deferData: {},
      companyData: {},
      citizenData: {},
      citizenEditorData: {},
      companyEditorData: {},
      templateload: {}, //答复模板下载
      lawsuitData: {},
      reconsiderData: {},
      repealData: {},
      editmethod: "",
      detile: {},
      datalist: {},
      progress: [],
      infolist: {},
      listrs: [],
      modalList: [],
      button: {
        25: {
          title: "待补证",
          color: "pink",
          interface: "repair",
          name: "补证原因",
        },
        30: {
          title: "补正资料",
          color: "orange",
          interface: "addition",
          name: "补正资料",
          content:
            "第三十条      政府信息公开申请内容不明确的，行政机关应当给予指导和释明，并自收到申请之日起7个工作日内一次性告知申请人作出补正，说明需要补正的事项和合理的补正期限。答复期限自行政机关收到补正的申请之日起计算。申请人无正当理由逾期不补正的，视为放弃申请，行政机关不再处理该政府信息公开申请。",
        },
        31: {
          title: "待征求第三方意见",
          color: "orange",
          interface: "opinion",
          name: "征求第三方意见",
          content:
            "第三十二条   依申请公开的政府信息公开会损害第三方合法权益的，行政机关应当书面征求第三方的意见。第三方应当自收到征求意见书之日起15个工作日内提出意见。第三方逾期未提出意见的，由行政机关依照本条例的规定决定是否公开。第三方不同意公开且有合理理由的，行政机关不予公开。行政机关认为不公开可能对公共利益造成重大影响的，可以决定予以公开，并将决定公开的政府信息内容和理由书面告知第三方。",
        },
        32: {
          title: "待补充协办信息",
          color: "orange",
          interface: "teamwork",
          name: "补充协办信息",
          content:
            "第三十四条　申请公开的政府信息由两个以上行政机关共同制作的，牵头制作的行政机关收到政府信息公开申请后可以征求相关行政机关的意见，被征求意见机关应当自收到征求意见书之日起15个工作日内提出意见，逾期未提出意见的视为同意公开。",
        },
        40: {
          title: "录入第三方意见",
          color: "green",
          interface: "opinioned",
          name: "第三方意见",
          content:
            "	第三十二条　依申请公开的政府信息公开会损害第三方合法权益的，行政机关应当书面征求第三方的意见。第三方应当自收到征求意见书之日起15个工作日内提出意见。第三方逾期未提出意见的，由行政机关依照本条例的规定决定是否公开。第三方不同意公开且有合理理由的，行政机关不予公开。行政机关认为不公开可能对公共利益造成重大影响的，可以决定予以公开，并将决定公开的政府信息内容和理由书面告知第三方。",
        },
        45: {
          title: "录入协办信息",
          color: "green",
          interface: "teamworked",
          name: "协办信息",
        },
        50: {
          title: "申请延期",
          color: "red",
          interface: "defer",
          name: "延期",
          content:
            "第三十三条   需要延长答复期限的，应当经政府信息公开工作机构负责人同意并告知申请人，延长的期限最长不得超过20个工作日。 行政机关征求第三方和其他机关意见所需时间不计算在前款规定的期限内。",
        },
        60: {
          title: "答复",
          color: "cyan",
          interface: "reply",
          name: "办结答复",
          content:
            "第三十三条   行政机关收到政府信息公开申请，能够当场答复的，应当当场予以答复。行政机关不能当场答复的，应当自收到申请之日起20个工作日内予以答复。",
        },
        65: {
          title: "补充答复",
          color: "cyan",
          interface: "restore",
          name: "补充答复",
        },
        70: {
          title: "行政复议",
          color: "blue",
          interface: "reconsider",
          name: "行政复议",
        },
        75: {
          title: "诉讼",
          color: "blue",
          interface: "lawsuit",
          name: "行政诉讼",
        },
        // 80: {
        //   title: "答复复议",
        //   color: "purple",
        //   interface: "restore",
        //   name: "答复复议"
        // }
      },
    };
  },
  authorize: {
    edict: "public.keywords",
  },
  computed: {
    userinfo() {
      return this.$store.getters["account/user"];
    },
    dynamicData() {
      let result = {
        organizations: [],
        provide: [
          {
            label: "纸面",
            value: 1,
          },
          {
            label: "电子邮件",
            value: 2,
          },
          {
            label: "光盘",
            value: 3,
          },
          {
            label: "磁盘",
            value: 4,
          },
        ],
        purpose: [
          {
            label: "自身生活需要",
            value: 1,
          },
          {
            label: "自身生产需要",
            value: 2,
          },
          {
            label: "自身科研需要",
            value: 3,
          },
          {
            label: "查验自身信息",
            value: 4,
          },
        ],
        mode: [
          {
            label: "网络",
            value: 1,
          },
          {
            label: "当面",
            value: 2,
          },
          {
            label: "邮寄",
            value: 3,
          },
          {
            label: "传真",
            value: 4,
          },
        ],
        modalList: [],
        download: this.download,
      };
      for (let item in this.modalList) {
        result.modalList.push({
          value: this.modalList[item].id,
          label: this.modalList[item].title,
        });
      }
      for (let item in this.userinfo.organization) {
        result.organizations.push({
          value: this.userinfo.organization[item].id,
          label: this.userinfo.organization[item].title,
        });
      }
      return result;
    },
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    first() {
      public_get({ id: this.id }).then((Response) => {
        this.loadings = false;
        this.detile = Response.data;
        this.datalist = Response.data.data;
        this.keywordlists = Response.data.data.keywords;
        this.progress = Response.data.data.flow;
        this.organization = this.datalist.organization.title;
        this.detile.next.filter(() => {
          this.listrs.push({
            title: "展开知识点",
            visible: false,
          });
        });
        let number = this.progress.filter((item) => {
          return JSON.stringify(item._extension) == "{}";
        });
        this.initial = number.length - 1;
      });
    },
    init() {
      this.id = this.params.data.id;
      this.loadings = true;
      Promise.all([
        form_get({ name: "citizen_y" }),
        form_get({ name: "company_y" }),
        form_get({ name: "citizenEditor_y" }),
        form_get({ name: "companyEditor_y" }),
        form_get({ name: "defer_y" }),
        form_get({ name: "repair_y" }),
        form_get({ name: "reply_y" }),
        form_get({ name: "restore_y" }),
        form_get({ name: "opinions_y" }),
        form_get({ name: "opinioned_y" }),
        form_get({ name: "teamwork_y" }),
        form_get({ name: "teamworked_y" }),
        form_get({ name: "template_download_y" }),
        form_get({ name: "repeal_y" }),
        form_get({ name: "lawsuit_y" }),
        form_get({ name: "reconsider_y" }),
        keywordslist(),
      ])
        .then((Response) => {
          this.citizenData = Response[0].data.data.form;
          this.companyData = Response[1].data.data.form;
          this.citizenEditorData = Response[2].data.data.form;
          this.companyEditorData = Response[3].data.data.form;
          this.deferData = Response[4].data.data.form;
          this.repairData = Response[5].data.data.form;
          this.replyData = Response[6].data.data.form;
          this.restoreData = Response[7].data.data.form;
          this.opinionsData = Response[8].data.data.form;
          this.opinionedData = Response[9].data.data.form;
          this.teamworkData = Response[10].data.data.form;
          this.teamworkedData = Response[11].data.data.form;
          this.templateload = Response[12].data.data.form;
          this.repealData = Response[13].data.data.form;
          this.lawsuitData = Response[14].data.data.form;
          this.reconsiderData = Response[15].data.data.form;
          this.keywordsList = Response[16].data.data;
          this.first();
        })
        .catch((error) => {
          console.log("erroe", error);
        });
    },
    // 详情--操作
    todetile(data, index) {
      if (index !== undefined) {
        this.detiletitle = this.status[data.status].title + "详情";
        this.visibles = true;
        this.editmethod = data.status;
        if (this.editmethod == "20") {
          //待答复
          if (this.datalist.type == "2") {
            this.listData = this.companyEditorData;
            setTimeout(() => {
              this.$refs.forms.setData({
                address: data.form.address,
                email: data.form.email,
                corporation: data.form.corporation,
                postcode: data.form.postcode,
                project: data.form.project,
                content: data.form.content,
                provide: data.form.provide,
                mode: data.form.mode,
                boardshow: data.form.boardshow,
                purpose: data.form.purpose,
                attachment: data.form.attachment,
                linkman: data.form.linkman,
                corporationNo: data.form.corporationNo,
              });
            }, 50);
          } else {
            this.listData = this.citizenEditorData;
            setTimeout(() => {
              this.$refs.forms.setData({
                address: data.form.address,
                email: data.form.email,
                corporation: data.form.corporation,
                postcode: data.form.postcode,
                project: data.form.project,
                content: data.form.content,
                provide: data.form.provide,
                mode: data.form.mode,
                boardshow: data.form.boardshow,
                purpose: data.form.purpose,
                attachment: data.form.attachment,
              });
            }, 50);
          }
        } else if (this.editmethod == "25") {
          //待补证
          this.listData = this.repairData;
          setTimeout(() => {
            this.$refs.forms.setData({
              attachment: data.attachment,
              day: data.days,
              content: data.content,
            });
          }, 50);
        } else if (this.editmethod == "50") {
          //延期
          this.listData = this.deferData;
          setTimeout(() => {
            this.$refs.forms.setData({
              content: data.content,
              attachment: data.attachment,
            });
          }, 50);
        } else if (this.editmethod == "60") {
          //答复
          this.listData = this.replyData;
          setTimeout(() => {
            this.$refs.forms.setData({
              content: data.content,
              isPublic: this.datalist.isPublic,
              attachment: data.attachment,
            });
          }, 50);
        } else if (this.editmethod == "65") {
          this.listData = this.restoreData;
          setTimeout(() => {
            this.$refs.forms.setData({
              content: data.content,
              attachment: data.attachment,
            });
          }, 50);
        } else if (this.editmethod == "70") {
          this.listData = this.reconsiderData;
          setTimeout(() => {
            this.$refs.forms.setData({
              content: data.content,
              attachment: data.attachment,
            });
          }, 50);
        } else if (this.editmethod == "30") {
          //补正资料
          if (this.datalist.type == 1) {
            this.listData = this.citizenEditorData;
            setTimeout(() => {
              this.$refs.forms.setData({
                address: data.form.address,
                email: data.form.email,
                corporation: data.form.corporation,
                postcode: data.form.postcode,
                project: data.form.project,
                content: data.form.content,
                provide: data.form.provide,
                mode: data.form.mode,
                boardshow: data.form.boardshow,
                purpose: data.form.purpose,
                attachment: data.form.attachment,
                linkman: data.form.linkman,
                corporationNo: data.form.corporationNo,
              });
            }, 50);
          } else {
            this.listData = this.companyEditorData;
            setTimeout(() => {
              this.$refs.forms.setData({
                address: data.form.address,
                email: data.form.email,
                corporation: data.form.corporation,
                postcode: data.form.postcode,
                project: data.form.project,
                content: data.form.content,
                provide: data.form.provide,
                mode: data.form.mode,
                boardshow: data.form.boardshow,
                purpose: data.form.purpose,
                attachment: data.form.attachment,
              });
            }, 50);
          }
        } else if (this.editmethod == "31") {
          //待补充第三方信息
          this.listData = this.opinionsData;
          setTimeout(() => {
            this.$refs.forms.setData({
              content: data.content,
              attachment: data.attachment,
            });
          }, 50);
        } else if (this.editmethod == "40") {
          //录入第三方信息
          this.listData = this.opinionedData;
          setTimeout(() => {
            this.$refs.forms.setData({
              content: data.content,
              attachment: data.attachment,
            });
          }, 50);
        } else if (this.editmethod == "32") {
          //待补充协办信息
          this.listData = this.teamworkData;
          setTimeout(() => {
            this.$refs.forms.setData({
              content: data.content,
              attachment: data.attachment,
            });
          }, 50);
        } else if (this.editmethod == "45") {
          //录入协办信息
          this.listData = this.teamworkedData;
          setTimeout(() => {
            this.$refs.forms.setData({
              content: data.content,
              attachment: data.attachment,
            });
          }, 50);
        } else if (this.editmethod == "75") {
          //诉讼信息
          this.listData = this.lawsuitData;
          setTimeout(() => {
            this.$refs.forms.setData({
              content: data.content,
              attachment: data.attachment,
            });
          }, 50);
        } else if (this.editmethod == "110") {
          this.listData = this.repealData;
          setTimeout(() => {
            this.$refs.forms.setData({
              content: data.content,
              attachment: data.attachment,
            });
          }, 50);
        }
      } else {
        if (this.detile.keyword) {
          this.titleStr = this.button[data].name;
          this.isvisibles = true;
          this.editmethod = data;
          if (this.editmethod == "20") {
            //待答复
            if (this.datalist.type == "2") {
              this.listDatas = this.companyEditorData;
            } else {
              this.listDatas = this.citizenEditorData;
            }
          } else if (this.editmethod == "25") {
            //待补证
            this.listDatas = this.repairData;
            this.uploadlist(data);
          } else if (this.editmethod == "50") {
            //延期
            this.listDatas = this.deferData;
            this.uploadlist(data);
          } else if (this.editmethod == "60") {
            //答复
            this.listDatas = this.replyData;
            this.uploadlist(data);
          } else if (this.editmethod == "65") {
            this.listDatas = this.restoreData;
            this.uploadlist(data);
          } else if (this.editmethod == "70") {
            this.listDatas = this.reconsiderData;
            this.uploadlist(data);
          } else if (this.editmethod == "30") {
            //补正资料
            if (this.datalist.type == 1) {
              this.listDatas = this.citizenEditorData;
              this.$nextTick(() => {
                setTimeout(() => {
                  this.$refs.form.setData({
                    address: this.datalist.flow[0].form.address,
                    email: this.datalist.flow[0].form.email,
                    corporation: this.datalist.flow[0].form.corporation,
                    postcode: this.datalist.flow[0].form.postcode,
                    project: this.datalist.flow[0].form.project,
                    content: this.datalist.flow[0].form.content,
                    provide: this.datalist.flow[0].form.provide,
                    mode: this.datalist.flow[0].form.mode,
                    boardshow: this.datalist.flow[0].form.boardshow,
                    purpose: this.datalist.flow[0].form.purpose,
                    attachment: this.datalist.flow[0].form.attachment,
                  });
                }, 50);
              });
            } else {
              this.listDatas = this.companyEditorData;
              this.$nextTick(() => {
                setTimeout(() => {
                  this.$refs.form.setData({
                    address: this.datalist.flow[0].form.address,
                    email: this.datalist.flow[0].form.email,
                    corporation: this.datalist.flow[0].form.corporation,
                    postcode: this.datalist.flow[0].form.postcode,
                    project: this.datalist.flow[0].form.project,
                    content: this.datalist.flow[0].form.content,
                    provide: this.datalist.flow[0].form.provide,
                    mode: this.datalist.flow[0].form.mode,
                    boardshow: this.datalist.flow[0].form.boardshow,
                    purpose: this.datalist.flow[0].form.purpose,
                    attachment: this.datalist.flow[0].form.attachment,
                    linkman: this.datalist.flow[0].form.linkman,
                    corporationNo: this.datalist.flow[0].form.corporationNo,
                  });
                }, 50);
              });
            }
          } else if (this.editmethod == "31") {
            //待补充第三方信息
            this.listDatas = this.opinionsData;
            this.uploadlist(data);
          } else if (this.editmethod == "40") {
            //录入第三方信息
            this.listDatas = this.opinionedData;
          } else if (this.editmethod == "32") {
            //待补充协办信息
            this.listDatas = this.teamworkData;
            this.uploadlist(data);
          } else if (this.editmethod == "45") {
            //录入协办信息
            this.listDatas = this.teamworkedData;
          } else if (this.editmethod == "75") {
            //诉讼信息
            this.listDatas = this.lawsuitData;
            this.uploadlist(data);
          }
        } else {
          this.$message.warning("请先添加标签再进行操作！");
          this.keywords = true;
          this.keywordsid = this.id;
        }
      }
    },
    changerepair(index) {
      this.listrs[index].visible = !this.listrs[index].visible;
      this.listrs[index].title = this.listrs[index].visible
        ? "收起知识点"
        : "展开知识点";
    },
    // 获取模板列表
    uploadlist(data) {
      uploadlist({ status: [data] })
        .then((res) => {
          this.modalList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 标签表单提交
    keyformsSubmit() {
      this.loadings = true;
      this.$refs.keyforms.validate((valid) => {
        if (valid) {
          this.subloading = true;
          var parems = {
            id: this.keywordsid,
            keywords: this.keyforms.keywords,
          };
          keywords(parems)
            .then(() => {
              this.keywords = false;
              this.$refs.keyforms.resetFields();
              this.subloading = false;
              this.$message.success("提交成功！");
              this.first();
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    },
    templatedownload() {
      this.templates = true;
    },
    //答复-选择模板
    modalChange(key, value) {
      if (value == "modal") {
        this.modalId = key;
      }
    },
    //答复-模板下载
    download() {
      var params = {
        id: this.id,
        module: this.modalId,
      };
      if (this.modalId) {
        var name = this.modalList.filter((item) => {
          return this.modalId == item.id;
        });
        replace(params)
          .then((res) => {
            const a = document.createElement("a");
            var bstr = atob(res.data.data),
              n = bstr.length,
              u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            const blob = new Blob([u8arr], {
              type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });
            a.download = name[0].title;
            a.href = window.URL.createObjectURL(blob);
            a.click();
            this.$message.success("操作成功！");
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("下载文档失败");
          });
      } else {
        this.$message.warning("请选择模板！");
      }
    },
    statusSubmit() {
      this.$refs.form
        .getData()
        .then((data) => {
          data.id = this.id;
          const params = data;
          this.subloading = true;
          this.loadings = true;
          var method = this.editmethod;
          if (method == "50") {
            defer(params)
              .then(() => {
                this.$refs.form.reset();
                this.isvisibles = false;
                this.subloading = false;
                this.$message.success("提交成功！");
                this.first();
              })
              .catch((error) => {
                this.subloading = false;
                console.log(error);
              });
          } else if (method == "25") {
            repair(params)
              .then(() => {
                this.$refs.form.reset();
                this.isvisibles = false;
                this.subloading = false;
                this.$message.success("提交成功！");
                this.first();
              })
              .catch((error) => {
                console.log(error);
                this.subloading = false;
              });
          } else if (method == "60") {
            reply(params)
              .then(() => {
                this.$refs.form.reset();
                this.isvisibles = false;
                this.subloading = false;
                this.$message.success("提交成功！");
                this.first();
              })
              .catch((error) => {
                console.log(error);
                this.subloading = false;
              });
          } else if (method == "65") {
            restore(params)
              .then(() => {
                this.$refs.form.reset();
                this.isvisibles = false;
                this.subloading = false;
                this.$message.success("提交成功！");
                this.first();
              })
              .catch((error) => {
                console.log(error);
                this.subloading = false;
              });
          } else if (method == "30") {
            addition(params)
              .then(() => {
                this.$refs.form.reset();
                this.isvisibles = false;
                this.subloading = false;
                this.$message.success("提交成功！");
                this.first();
              })
              .catch((error) => {
                console.log(error);
                this.subloading = false;
              });
          } else if (method == "31") {
            opinion(params)
              .then(() => {
                this.$refs.form.reset();
                this.isvisibles = false;
                this.subloading = false;
                this.$message.success("提交成功！");
                this.first();
              })
              .catch((error) => {
                console.log(error);
                this.subloading = false;
              });
          } else if (method == "40") {
            opinioned(params)
              .then(() => {
                this.$refs.form.reset();
                this.isvisibles = false;
                this.subloading = false;
                this.$message.success("提交成功！");
                this.first();
              })
              .catch((error) => {
                console.log(error);
                this.subloading = false;
              });
          } else if (method == "32") {
            teamwork(params)
              .then(() => {
                this.$refs.form.reset();
                this.isvisibles = false;
                this.subloading = false;
                this.$message.success("提交成功！");
                this.first();
              })
              .catch((error) => {
                console.log(error);
                this.subloading = false;
              });
          } else if (method == "45") {
            teamworked(params)
              .then(() => {
                this.$refs.form.reset();
                this.isvisibles = false;
                this.subloading = false;
                this.$message.success("提交成功！");
                this.first();
              })
              .catch((error) => {
                console.log(error);
                this.subloading = false;
              });
          } else if (method == "70") {
            reconsider(params)
              .then(() => {
                this.$refs.form.reset();
                this.isvisibles = false;
                this.subloading = false;
                this.$message.success("提交成功！");
                this.first();
              })
              .catch((error) => {
                console.log(error);
                this.subloading = false;
              });
          } else if (method == "75") {
            lawsuit(params)
              .then(() => {
                this.$refs.form.reset();
                this.isvisibles = false;
                this.subloading = false;
                this.$message.success("提交成功！");
                this.first();
              })
              .catch((error) => {
                console.log(error);
                this.subloading = false;
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 标签编辑
    edict(data) {
      this.keywords = true;
      this.keyforms = { keywords: data };
      this.keywordsid = this.id;
    },
    //状态截止时间
    redates(data) {
      var rejects = this.progress.filter((item) => {
        return item.status == data;
      });
      return rejects.length
        ? rejects[0]._createtime.substring(0, 10) + " 前"
        : "";
    },
    onReset() {
      this.init();
    },
  },
};
</script>
<style>
.admin-layout .admin-layout-content[data-v-9fbb962c] {
  padding: 0;
}
</style>
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
.all_actions {
  width: 80%;
  overflow-x: scroll;
  margin: 0 10%;
}
.all_actions::-webkit-scrollbar {
  height: 8px !important;
}
/* .all_actions::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px #5555551a !important;
  background: #3333331a !important;
}
.all_actions::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px #2e2e2e1a !important;
  border-radius: 0;
  background: #4646461a !important;
} */
.description {
  margin-left: -30px;
  margin-top: 20px;
}
a {
  color: #00bfff;
}
.backcolors {
  background: #f5f5f5;
  padding: 20px;
}
.main {
  padding: 24px 24px;
  min-height: 100%;
  background: #f0f0f0;
}
.status {
  font-size: 16px;
  size: large;
  font-weight: 800;
  margin: 0 0 5px 10px;
  padding: 3px 10px;
}
.title_lable {
  font-weight: 600;
  font-size: 16px;
}
.title_content {
  font-weight: 500;
  font-size: 16px;
}
.basic_info {
  padding: 50px 10%;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 20px;
}
.progress {
  background: #fff;
  border-radius: 4px;
}
.steps {
  padding: 100px 0;
  width: 100%;
}
.collapse_list {
  padding: 30px 10%;
}
.collapse_panel {
  background: #e5f7fe;
  border: none;
  box-shadow: 1px 1px 1px 1px #999;
}
</style>