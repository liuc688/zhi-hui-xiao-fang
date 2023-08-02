<template>
  <!-- 试卷管理 -->
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <div class="title_back">
      <a @click="back()"><a-icon type="arrow-left" />返回</a>
    </div>
    <a-form-model layout="horizontal" :model="searchform" ref="searchform">
      <a-row>
        <a-col :md="6" :sm="24">
          <a-form-model-item
            label="关键词"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-input
              v-model="searchform.keyword"
              placeholder="请输入关键词"
              allowClear
            />
          </a-form-model-item>
        </a-col>
        <a-col :md="6" :sm="24" style="margin-bottom: 10px; padding-left: 6.3%">
          <span
            style="
              float: left;
              margin-top: 3px;
              display: block;
              margin-bottom: 24px;
              white-space: nowrap;
            "
          >
            <a-button type="primary" :loading="loadingsearch" @click="onSearch"
              >查询</a-button
            >
            <a-button style="margin-left: 8px" @click="resetForm()"
              >重置</a-button
            >
          </span>
        </a-col>
      </a-row>
    </a-form-model>
    <a-row style="padding: 20px 0">
      <a-tooltip>
        <a-button
          type="primary"
          icon="plus-circle"
          @click="todetailes"
          style="margin-right: 20px"
        >
          试卷新增
        </a-button>
      </a-tooltip>
    </a-row>

    <div class="alert">
      <a-alert type="info" :show-icon="true">
        <div class="message" slot="message">
          已选择&nbsp;
          <a>{{ selectedRowKeys.length }}</a>
          &nbsp;项
          <a
            class="clear"
            @click="onSelectClear"
            v-if="this.selectedRowKeys.length > 0"
            >清空</a
          >
        </div>
      </a-alert>
    </div>

    <a-table
      ref="table"
      bordered
      class="table_content"
      size="middle"
      rowKey="id"
      :loading="loading"
      :pagination="false"
      :columns="columns"
      :dataSource="dataSource.items"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
    >
      <span slot="action" slot-scope="text, record">
        <a-button icon="edit" @click="edited(record)">编辑</a-button>
        <a-divider type="vertical"></a-divider>
        <a-button icon="delete" @click="deleted(record)">删除</a-button>
        <a-divider type="vertical"></a-divider>
        <a-button icon="plus" @click="examadd(record)">添加入考试</a-button>
      </span>

      <span slot="titless" slot-scope="text, record" class="colorr">
        <a @click="mm(record)" target="_blank">{{ record.title }}</a>
      </span>
      <span slot="Preview" slot-scope="text, record">
        <a type="primary" @click="showModal(record)"> 查看 </a>
      </span>
    </a-table>

    <a-pagination
      size="small"
      style="text-align: right"
      @change="changepage"
      :current="pagination.page"
      :pageSize="pagination.per_page"
      @showSizeChange="changepage"
      :pageSizeOptions="pageSizeOptions"
      :total="dataSource.total"
      show-size-changer
      show-quick-jumper
      :show-total="(total) => `共 ${total} 条`"
    ></a-pagination>

    <a-modal
      v-model="visible"
      on-ok="handleOk"
      :width="1600"
      :maskClosable="false"
      :keyboard="true"
      :closable="false"
      :centered="true"
      class="model"
    >
      <template slot="footer">
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click="handleOk"
        >
          关闭
        </a-button>
      </template>

      <p>{{ titled }}</p>
      <a-card
        class="cards"
        v-for="(item, index) in this.question_bank"
        :key="index"
      >
        <a-descriptions :column="2" style="padding: 0">
          <a-descriptions-item span="2">
            <span slot="label" style="font-weight: 700; font-size: 18px">
              题目{{ index + 1 }}
            </span>
            <span style="font-size: 18px; font-family: 'Microsoft YaHei'">
              {{ item.title }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span v-if="item.types == 0" style="color: red">(要点)</span>
              <span v-if="item.types == 1" style="color: orange">(单选题)</span>
              <span v-if="item.types == 2" style="color: purple">(多选题)</span>
              <span v-if="item.types == 3" style="color: green">(判断题)</span>
              <span v-if="item.types == 4" style="color: blue">(简答题)</span>
            </span>
            <span
              style="
                color: #ff7c2d;
                font-size: 18px;
                font-weight: 400;
                margin-left: 15px;
              "
              >{{ item.score }}分</span
            >
          </a-descriptions-item>
          <a-descriptions-item>
            <span v-if="item.types == 1">
              <span
                ><input
                  type="radio"
                  name="activity"
                  value="index"
                />&nbsp;&nbsp;
                <span
                  v-if="item.answer[0]"
                  style="margin-right: 66px; font-size: 18px"
                  >A: {{ item.answer[0].title }}</span
                >
                <input type="radio" name="activity" value="index" />&nbsp;&nbsp;
                <span
                  v-if="item.answer[1]"
                  style="margin-right: 66px; font-size: 18px"
                  >B: {{ item.answer[1].title }}</span
                ><input
                  type="radio"
                  name="activity"
                  value="index"
                />&nbsp;&nbsp;
                <span
                  v-if="item.answer[2]"
                  style="margin-right: 66px; font-size: 18px"
                  >C: {{ item.answer[2].title }}</span
                ><input
                  type="radio"
                  name="activity"
                  value="index"
                />&nbsp;&nbsp;
                <span
                  v-if="item.answer[3]"
                  style="margin-right: 66px; font-size: 18px"
                  >D: {{ item.answer[3].title }}</span
                >
              </span>
            </span>
            <span v-if="item.types == 2">
              <span>
                <input type="radio" name="activity" value="index" />&nbsp;&nbsp;
                <span
                  v-if="item.answer[0]"
                  style="margin-right: 66px; font-size: 18px"
                  >A: {{ item.answer[0].title }}</span
                >
                <input type="radio" name="activity" value="index" />&nbsp;&nbsp;
                <span
                  v-if="item.answer[1]"
                  style="margin-right: 66px; font-size: 18px"
                  >B: {{ item.answer[1].title }}</span
                >
                <input type="radio" name="activity" value="index" />&nbsp;&nbsp;
                <span
                  v-if="item.answer[2]"
                  style="margin-right: 66px; font-size: 18px"
                  >C: {{ item.answer[2].title }}</span
                >
                <input type="radio" name="activity" value="index" />&nbsp;&nbsp;
                <span
                  v-if="item.answer[3]"
                  style="margin-right: 66px; font-size: 18px"
                  >D: {{ item.answer[3].title }}</span
                >
              </span>
            </span>
            <span v-if="item.types == 3">
              <span>
                <input type="radio" name="activity" value="index" />&nbsp;&nbsp;
                <span
                  v-if="item.answer[0]"
                  style="margin-right: 66px; font-size: 18px"
                  >{{ item.answer[0].title }}</span
                >
                <input type="radio" name="activity" value="index" />&nbsp;&nbsp;
                <span
                  v-if="item.answer[1]"
                  style="margin-right: 66px; font-size: 18px"
                  >{{ item.answer[1].title }}</span
                >
              </span>
            </span>
            <span v-if="item.types == 4">
              <span style="margin: 15px; font-size: 18px">
                <a-textarea
                  placeholder="答题域"
                  style="width: 699px"
                  :rows="4"
                />
              </span>
            </span>
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
      <div></div>
    </a-modal>

    <a-modal
      title="试卷新增"
      :visible="visibletp"
      :width="1200"
      :maskClosable="false"
      @ok="handleOktp"
      @cancel="handleCanceltp"
    >
      <k-form-build
        :value="channelFormtp"
        :dynamicData="dynamicDatatp"
        ref="channelFormtp"
        @change="changetp"
      />
      <!-- <a-button type="primary" @click="sumqq">总分刷新</a-button> -->
      <span style="font-size: 18px; font-weight: 700"
        >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ scoreall }}&nbsp;&nbsp;分</span
      >
    </a-modal>

    <a-modal
      title="考试库添加"
      :visible="visibleex"
      :width="1100"
      :maskClosable="false"
      @ok="handleOkex"
      @cancel="handleCancelex"
    >
      <k-form-build :value="channelFormex" ref="channelFormex" />
    </a-modal>
  </a-card>
</template>

<script>
import {
  papers_add,
  papers_edit,
  papers_delete,
  papers_paginate,
  subjects_list,
  questions_list,
  examinations_add,
} from "@/services/knowledge";
import { form_get } from "@/services/forms";
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
      transitionobj: {},
      loading: false,
      visible: false,
      visibletp: false,
      visibleex: false,
      content: "",
      titled: "",
      type: [],
      domain: [],
      site: [],
      organization: {},
      advanced: false,
      formDialog: false,
      confirmLoading: false,
      loadingsearch: false,
      loadingreset: false,
      status: false,
      searchform: {},
      dataSource: {},
      jsonData: {},
      opinion_status: {
        0: "未开始",
        1: "征集中",
        2: "已结束",
      },
      columns: [
        {
          title: "试卷标题",
          dataIndex: "title",
          align: "center",
          scopedSlots: { customRender: "title" },
          ellipsis: true,
        },
        {
          title: "创建时间",
          dataIndex: "_createtime",
          align: "center",
          scopedSlots: { customRender: "_createtime" },
          ellipsis: true,
        },

        {
          title: "预览",
          dataIndex: "content",
          align: "center",
          scopedSlots: { customRender: "Preview" },
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          width: 500,
          scopedSlots: { customRender: "action" },
        },
      ],
      selectedRowKeys: [],
      pageSizeOptions: ["10", "20", "30", "40"],
      draftId: "",
      siteList: [],
      titles: "新增意见",
      channelFormtp: {},
      channelFormex: {},
      countylist: [],
      id: "",
      tpobjarr: [], //用来临时存放科目类别的id.
      questionsarr: [],
      question_bank: [],
      allquestions: [],
      baseid: "",
      paperid: "",
      sumedit: 0,
      topiclist1: [], //从题目接口获得的单选题列表放入该数组
      topiclist2: [], //从题目接口获得的多选题列表放入该数组
      topiclist3: [], //从题目接口获得的判断题列表放入该数组
      topiclist4: [], //从题目接口获得的简答题列表放入该数组
      arrlist1: [], //准备对接接口试卷新增papers_add字段question，属于过渡（单选）
      arrlist2: [], //准备对接接口试卷新增papers_add字段question，属于过渡（多选）
      arrlist3: [], //准备对接接口试卷新增papers_add字段question，属于过渡（判断）
      arrlist4: [], //准备对接接口试卷新增papers_add字段question，属于过渡（简答）
      arrscore1: [], //准备对接接口试卷新增papers_add字段score，属于过渡（单选）
      arrscore2: [], //准备对接接口试卷新增papers_add字段score，属于过渡（多选）
      arrscore3: [], //准备对接接口试卷新增papers_add字段score，属于过渡（判断）
      arrscore4: [], //准备对接接口试卷新增papers_add字段score，属于过渡（简答）
      arrlista: [], //用来对接编辑的
      arrlistb: [],
      arrlistc: [],
      arrlistd: [],
      arrliste: [],
      scoreall: 0, //算总分
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
    dynamicDatatp() {
      let result = {
        tpobjlist: this.countylist.map((item) => {
          return {
            value: item.id,
            label: item.title,
          };
        }),

        // 匿名取得单选题列表
        selecttopiced1: this.topiclist1.map((item) => {
          return {
            value: item.id,
            label: item.title,
          };
        }),
        // 匿名取得多选题列表
        selecttopiced2: this.topiclist2.map((item) => {
          return {
            value: item.id,
            label: item.title,
          };
        }),
        // 匿名取得判断题列表
        selecttopiced3: this.topiclist3.map((item) => {
          return {
            value: item.id,
            label: item.title,
          };
        }),
        // 匿名取得简答题列表
        selecttopiced4: this.topiclist4.map((item) => {
          return {
            value: item.id,
            label: item.title,
          };
        }),
      };
      return result;
    },
  },
  created() {
    this.transitionobj = this.params;
    this.init();
    this.list();
  },
  methods: {
    //试卷新增
    todetailes() {
      this.scoreall = 0;
      this.visibletp = true;
      this.$nextTick(() => {
        this.method = papers_add;
        this.id = undefined;
        this.$refs.channelFormtp.hide([
          "tpobj",
          "dynamicdataed1",
          "dynamicdataed2",
          "dynamicdataed3",
          "dynamicdataed4",
          "dynamicdataed5",
          "scoreall",
        ]);
      });
    },
    // 试卷新增弹窗的确定按钮
    handleOktp() {
      this.$refs.channelFormtp.getData().then((data) => {
        if (data.dynamicdataed1) {
          for (let i in data.dynamicdataed1) {
            if (data.dynamicdataed1[i].selecttopic1) {
              this.questionsarr.push({
                question: data.dynamicdataed1[i].selecttopic1,
                types: "1",
                score: data.dynamicdataed1[i].numberthis1,
              });
            } else {
              this.questionsarr.push({
                types: "1",
                score: data.dynamicdataed1[i].numberthis1,
              });
            }
          }
        }
        if (data.dynamicdataed5) {
          for (let i in data.dynamicdataed5) {
            if (data.dynamicdataed5[i].types == "a") {
              for (let j = 0; j < data.dynamicdataed5[i].number; j++) {
                this.questionsarr.push({
                  types: "1",
                  score: data.dynamicdataed5[i].score,
                });
              }
            }
          }
        }

        if (data.dynamicdataed2) {
          for (let i in data.dynamicdataed2) {
            if (data.dynamicdataed2[i].selecttopic2) {
              this.questionsarr.push({
                question: data.dynamicdataed2[i].selecttopic2,
                types: "2",
                score: data.dynamicdataed2[i].numberthis2,
              });
            } else {
              this.questionsarr.push({
                types: "2",
                score: data.dynamicdataed2[i].numberthis2,
              });
            }
          }
        }
        if (data.dynamicdataed5) {
          for (let i in data.dynamicdataed5) {
            if (data.dynamicdataed5[i].types == "b") {
              for (let j = 0; j < data.dynamicdataed5[i].number; j++) {
                this.questionsarr.push({
                  types: "2",
                  score: data.dynamicdataed5[i].score,
                });
              }
            }
          }
        }

        if (data.dynamicdataed3) {
          for (let i in data.dynamicdataed3) {
            if (data.dynamicdataed3[i].selecttopic3) {
              this.questionsarr.push({
                question: data.dynamicdataed3[i].selecttopic3,
                types: "3",
                score: data.dynamicdataed3[i].numberthis3,
              });
            } else {
              this.questionsarr.push({
                types: "3",
                score: data.dynamicdataed3[i].numberthis3,
              });
            }
          }
        }
        if (data.dynamicdataed5) {
          for (let i in data.dynamicdataed5) {
            if (data.dynamicdataed5[i].types == "c") {
              for (let j = 0; j < data.dynamicdataed5[i].number; j++) {
                this.questionsarr.push({
                  types: "3",
                  score: data.dynamicdataed5[i].score,
                });
              }
            }
          }
        }

        if (data.dynamicdataed4) {
          for (let i in data.dynamicdataed4) {
            if (data.dynamicdataed4[i].selecttopic4) {
              this.questionsarr.push({
                question: data.dynamicdataed4[i].selecttopic4,
                types: "4",
                score: data.dynamicdataed4[i].numberthis4,
              });
            } else {
              this.questionsarr.push({
                types: "4",
                score: data.dynamicdataed4[i].numberthis4,
              });
            }
          }
        }
        if (data.dynamicdataed5) {
          for (let i in data.dynamicdataed5) {
            if (data.dynamicdataed5[i].types == "d") {
              for (let j = 0; j < data.dynamicdataed5[i].number; j++) {
                this.questionsarr.push({
                  types: "4",
                  score: data.dynamicdataed5[i].score,
                });
              }
            }
          }
        }



        // if(data.dynamicdataed5.length != 0) {
        //   for(let i in data.dynamicdataed5) {
        //     // console.log('i',i);
        //     if(data.dynamicdataed5[i].nimingtopic == 1) {
        //       for(let j = 0;j<data.dynamicdataed5[i].nimingnumbers;j++){
        //         this.questionsarr.push({
        //         types: "1",
        //         score: data.dynamicdataed5[i].nimingscore,
        //       });
        //       }
        //     } else if(data.dynamicdataed5[i].nimingtopic == 2) {
        //       for(let j = 0;j<data.dynamicdataed5[i].nimingnumbers;j++){
        //         this.questionsarr.push({
        //         types: "2",
        //         score: data.dynamicdataed5[i].nimingscore,
        //       });
        //       }
        //     }else if(data.dynamicdataed5[i].nimingtopic == 3) {
        //       for(let j = 0;j<data.dynamicdataed5[i].nimingnumbers;j++){
        //         this.questionsarr.push({
        //         types: "3",
        //         score: data.dynamicdataed5[i].nimingscore,
        //       });
        //       }
        //     }else if(data.dynamicdataed5[i].nimingtopic == 4) {
        //       for(let j = 0;j<data.dynamicdataed5[i].nimingnumbers;j++){
        //         this.questionsarr.push({
        //         types: "4",
        //         score: data.dynamicdataed5[i].nimingscore,
        //       });
        //       }
        //     }
        //   }
        // }
      });

      this.$refs.channelFormtp.getData().then((data) => {
        console.log('this.data',data);
        this.tpobjarr.push(data.tpobj);
        this.method({
          id: this.id,
          base: this.params.mmm.data.id,
          title: data.tpname,
          subject: this.tpobjarr,
          questions: this.questionsarr,
          stochastics:data.dynamicdataed5,

        }).then((res) => {
          this.visibletp = false;
          this.$refs.channelFormtp.reset();
          this.arrlista = [];
          this.arrlistb = [];
          this.arrlistc = [];
          this.arrlistd = [];
          this.arrliste = [];
          this.arrlist1 = [];
          this.arrlist2 = [];
          this.arrlist3 = [];
          this.arrlist4 = [];
          this.questionsarr = [];
          this.init();
        });
      });
    },
    //试卷新增弹窗的取消按钮
    handleCanceltp() {
      this.visibletp = false;
      this.init();
      this.$nextTick(() => {
        this.arrlista = [];
        this.arrlistb = [];
        this.arrlistc = [];
        this.arrlistd = [];
        this.arrliste = [];
        this.arrlist1 = [];
        this.arrlist2 = [];
        this.arrlist3 = [];
        this.arrlist4 = [];
        this.questionsarr = [];
        this.$refs.channelFormtp.reset();
      });
    },
    // 删除
    deleted(item) {
      var that = this;
      this.$confirm({
        title: "你确定删除这条数据吗?",
        icon: "info-circle",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          var params = {
            id: item.id,
          };
          papers_delete(params)
            .then(() => {
              that.$message.success("操作成功!!!!");
              that.list();
            })
            .catch((err) => {
              console.log(err);
            });
        },
        onCancel() {},
      });
    },

    //编辑
    edited(item) {
      console.log('item',item);
      this.visibletp = true;
      this.scoreall = 0;
      this.id = item.id;
      // for (let i in item.questions) {
      //   this.scoreall += item.questions[i].score;
      // }
      this.$nextTick(() => {
        this.$refs.channelFormtp.show([
          "tpobj",
          "dynamicdataed1",
          "dynamicdataed2",
          "dynamicdataed3",
          "dynamicdataed4",
          "dynamicdataed5",
          "scoreall",
        ]);
      });

      this.$nextTick(() => {
        questions_list({
          base: item.base,
          subject: item.subject[0],
          types: 1,
        }).then((res) => {
          this.topiclist1 = res.data.data;
        });
        questions_list({
          base: item.base,
          subject: item.subject[0],
          types: 2,
        }).then((res) => {
          this.topiclist2 = res.data.data;
        });
        questions_list({
          base: item.base,
          subject: item.subject[0],
          types: 3,
        }).then((res) => {
          this.topiclist3 = res.data.data;
        });
        questions_list({
          base: item.base,
          subject: item.subject[0],
          types: 4,
        }).then((res) => {
          this.topiclist4 = res.data.data;
        });
      });

      this.$nextTick(() => {
        console.log("item.questions", item.questions);
        for (let i in item.questions) {
          if (item.questions[i].types == 1 && item.questions[i].question) {
            this.arrlista.push({
              selecttopic1: item.questions[i].question
                ? item.questions[i].question
                : undefined,
              numberthis1: item.questions[i].score,
            });
          } else if (
            item.questions[i].types == 2 &&
            item.questions[i].question
          ) {
            this.arrlistb.push({
              selecttopic2: item.questions[i].question
                ? item.questions[i].question
                : undefined,
              numberthis2: item.questions[i].score,
            });
          } else if (
            item.questions[i].types == 3 &&
            item.questions[i].question
          ) {
            this.arrlistc.push({
              selecttopic3: item.questions[i].question
                ? item.questions[i].question
                : undefined,
              numberthis3: item.questions[i].score,
            });
          } else if (
            item.questions[i].types == 4 &&
            item.questions[i].question
          ) {
            this.arrlistd.push({
              selecttopic4: item.questions[i].question
                ? item.questions[i].question
                : undefined,
              numberthis4: item.questions[i].score,
            });
          } else if (
            item.questions[i].types == 1 &&
            !item.questions[i].question
          ) {
            this.arrliste.push({});
          }
        }
      });

      this.$nextTick(() => {
        this.method = papers_edit;
        this.$refs.channelFormtp.setData({
          tpname: item.title,
          tpobj: item.subject[0],
          dynamicdataed1: this.arrlista,
          dynamicdataed2: this.arrlistb,
          dynamicdataed3: this.arrlistc,
          dynamicdataed4: this.arrlistd,
          dynamicdataed5: item.stochastics,
          scoreall: this.scoreall,
        });
      });
    },

    // 试卷新增弹窗，点击操作触发的函数
    changetp(key, value) {
      this.$refs.channelFormtp.getData().then((res) => {
        console.log("res", res);
      });
      console.log("value", value);
      if (value == "tpname") {
        this.$refs.channelFormtp.show(["tpobj"]);
      }

      // if (value == "dynamicdataed1") {
      //   this.$refs.channelFormtp.getData().then((data) => {
      //     questions_list({
      //       base: this.params.mmm.data.id,
      //       subject: data.tpobj,
      //       types: 1,
      //     }).then((res) => {
      //       this.topiclist1 = res.data.data;
      //     });
      //   });

      //   for (let i in key) {
      //     this.arrlist1[i] = key[i].selecttopic1 ? key[i].selecttopic1 : "";
      //     this.arrscore1[i] = key[i].numberthis1;
      //   }
      // }
      // if (value == "dynamicdataed2") {
      //   this.$refs.channelFormtp.getData().then((data) => {
      //     questions_list({
      //       base: this.params.mmm.data.id,
      //       subject: data.tpobj,
      //       types: 2,
      //     }).then((res) => {
      //       this.topiclist2 = res.data.data;
      //     });
      //   });
      //   for (let i in key) {
      //     this.arrlist2[i] = key[i].selecttopic2 ? key[i].selecttopic2 : "";
      //     this.arrscore2[i] = key[i].numberthis2;
      //   }
      // }
      // if (value == "dynamicdataed3") {
      //   this.$refs.channelFormtp.getData().then((data) => {
      //     questions_list({
      //       base: this.params.mmm.data.id,
      //       subject: data.tpobj,
      //       types: 3,
      //     }).then((res) => {
      //       this.topiclist3 = res.data.data;
      //     });
      //   });
      //   for (let i in key) {
      //     this.arrlist3[i] = key[i].selecttopic3 ? key[i].selecttopic3 : "";
      //     this.arrscore3[i] = key[i].numberthis3;
      //   }
      // }
      // if (value == "dynamicdataed4") {
      //   this.$refs.channelFormtp.getData().then((data) => {
      //     questions_list({
      //       base: this.params.mmm.data.id,
      //       subject: data.tpobj,
      //       types: 4,
      //     }).then((res) => {
      //       this.topiclist4 = res.data.data;
      //     });
      //   });
      //   for (let i in key) {
      //     this.arrlist4[i] = key[i].selecttopic4 ? key[i].selecttopic4 : "";
      //     this.arrscore4[i] = key[i].numberthis4;
      //   }
      // }

      if (value == "tpobj") {
        this.$refs.channelFormtp.setData({
          dynamicdataed1: undefined,
          dynamicdataed2: undefined,
          dynamicdataed3: undefined,
          dynamicdataed4: undefined,
        });

        this.$nextTick(() => {
          this.$refs.channelFormtp.getData().then((data) => {
            console.log("data", data);
            questions_list({
              base: this.params.mmm.data.id,
              subject: data.tpobj,
              types: 1,
            }).then((res) => {
              this.topiclist1 = res.data.data;
            });
            questions_list({
              base: this.params.mmm.data.id,
              subject: data.tpobj,
              types: 2,
            }).then((res) => {
              this.topiclist2 = res.data.data;
            });
            questions_list({
              base: this.params.mmm.data.id,
              subject: data.tpobj,
              types: 3,
            }).then((res) => {
              this.topiclist3 = res.data.data;
            });
            questions_list({
              base: this.params.mmm.data.id,
              subject: data.tpobj,
              types: 4,
            }).then((res) => {
              this.topiclist4 = res.data.data;
            });

            if (key && data.tpname != null) {
              this.$refs.channelFormtp.show([
                "dynamicdataed1",
                "dynamicdataed2",
                "dynamicdataed3",
                "dynamicdataed4",
                "dynamicdataed5",
                "scoreall",
              ]);
            }
          });
        });
      }
    },
    //试卷新增的时候，算总分
    sumqq() {
      this.$nextTick(() => {
        this.$refs.channelFormtp.getData().then((data) => {
          this.scoreall = 0;
          if (data.dynamicdataed1.length != 0) {
            for (let i in data.dynamicdataed1) {
              this.scoreall += data.dynamicdataed1[i].numberthis1;
            }
          }
          if (data.dynamicdataed2.length != 0) {
            for (let i in data.dynamicdataed2) {
              this.scoreall += data.dynamicdataed2[i].numberthis2;
            }
          }
          if (data.dynamicdataed3.length != 0) {
            for (let i in data.dynamicdataed3) {
              this.scoreall += data.dynamicdataed3[i].numberthis3;
            }
          }
          if (data.dynamicdataed4.length != 0) {
            for (let i in data.dynamicdataed4) {
              this.scoreall += data.dynamicdataed4[i].numberthis4;
            }
          }
        });
      });
    },
    //考试库的添加
    examadd(item) {
      this.visibleex = true;
      this.$nextTick(() => {
        this.method = examinations_add;
        this.id = undefined;
        this.baseid = item.base;
        this.paperid = item.id;
      });
    },
    handleOkex() {
      this.$refs.channelFormex.getData().then((data) => {
        this.method(
          Object.assign(data, { base: this.baseid, paper: this.paperid })
        ).then((res) => {
          this.visibleex = false;
          this.refs.channelFormex.reset();
        });
      });
    },
    handleCancelex() {
      this.visibleex = false;
      this.$refs.channelFormex.reset();
    },
    echotp() {},
    //预览弹窗的显示
    showModal(data) {
      this.question_bank = data.questions;
      this.visible = true;
      this.titled = data.title;
      this.content = data.content;
    },
    handleOk() {
      this.loading = true;
      setTimeout(() => {
        this.visible = false;
        this.loading = false;
      });
    },
    handleCancel() {
      this.visible = false;
    },
    //返回
    back() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "info-details",
          params: this.params,
          transitioned: this.transitionobj,
        },
      });
    },
    init() {
      this.searchform = this.params.searchform || this.searchform;
      form_get({ name: "new_testpaper" })
        .then((response) => {
          this.channelFormtp = response.data.data.form;
        })
        .catch((error) => {
          this.$message.error(error);
        });
      form_get({ name: "exam_add" })
        .then((res) => {
          this.channelFormex = res.data.data.form;
        })
        .catch((error) => {
          this.$message.error(error);
        });

      subjects_list({ base: this.params.mmm.data.id }).then((res) => {
        this.countylist = res.data.data.items;
      });

      this.list();
    },
    list() {
      this.searchloading = true;
      this.loading = true;
      papers_paginate(
        Object.assign(this.searchform, { base: this.params.mmm.data.id })
      )
        .then((res) => {
          // this.allquestions = res.data.data.items
          this.dataSource = res.data.data;
          this.searchloading = false;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.searchloading = false;
          this.loading = false;
        });
    },
    // 分页
    changepage(page, pageSize) {
      this.searchform.page = page;
      this.searchform.per_page = pageSize;
      this.list();
    },
    onSearch() {
      this.searchform.page = 1;
      this.searchform.per_page = 10;
      this.list();
    },
    onTimerRangeChange(data, strdate) {
      if (strdate && strdate.length) {
        this.searchform.start = strdate[0];
        this.searchform.end = strdate[1];
      } else {
        this.searchform.start = undefined;
        this.searchform.end = undefined;
      }
    },
    onSelectClear() {
      this.selectedRowKeys = [];
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    resetForm() {
      this.searchform = {};
      this.list();
    },
  },
  mounted() {},
};
</script>

<style >
.ant-card-body {
  padding: 5px 24px;
  zoom: 1;
}
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
<style lang="less" scoped>
body {
  background-color: pink;
}
a {
  color: #00bfff !important;
}
.model p {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
}
.model div {
  min-height: 120px;
  padding: 0 10px;
  overflow: hidden;
}
.search {
  margin-bottom: 54px;
}
.fold {
  width: calc(100% - 216px);
  display: inline-block;
}
.operator {
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
.alert {
  margin-bottom: 16px;
  .message {
    a {
      font-weight: 600;
    }
  }
  .clear {
    float: right;
  }
}
.action_button:hover {
  color: #1890ff;
}
.table_content {
  margin: 20px 0;
}
.title_back {
  padding: 10px;
  background: #daedff;
  border: 1px solid #40a9ff;
  border-radius: 5px;
  margin-bottom: 20px;
}
.cards {
  margin: 15px 79px;
  // min-height: 99px;
  box-shadow: 0 4px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.5s;
  -webkit-transition: all 0.5s;
  cursor: pointer;
}
// .cards:hover {
//   transform: scale(1.1) !important;
// }
</style>