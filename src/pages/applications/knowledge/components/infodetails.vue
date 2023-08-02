<template>
  <div class="infobody">
    <a-card :bordered="false" style="margin-bottom: 24px">
      <a-row>
        <div class="title_back">
          <a @click="back()"><a-icon type="arrow-left" />返回</a>
        </div>
        <a-col :span="11">
          <div>
            <img :src="datas.images[0].url" class="list_img" />
          </div>
        </a-col>
        <a-col :span="11">
          <a-descriptions title="考试信息" :column="2">
            <a-descriptions-item label="名称">{{
              datas.title
            }}</a-descriptions-item>

            <a-descriptions-item label="所属类目">{{
              datas.name
            }}</a-descriptions-item>
            <a-descriptions-item label="创建日期">{{
              datas._createtime
            }}</a-descriptions-item>
            <a-descriptions-item label="所属标签">{{
              tags
            }}</a-descriptions-item>
            <a-descriptions-item label="介绍" :column="2">{{
              datas.abstrac
            }}</a-descriptions-item>
          </a-descriptions>
          <a-row style="padding: 60px 20px 0">
            <a-tooltip>
              <a-button
                type="primary"
                icon="plus-circle"
                @click="todetailes"
                style="margin-right: 20px"
              >
                科目类别
              </a-button>
            </a-tooltip>
            <a-tooltip>
              <a-button type="primary" icon="edit" @click="showModal">
                试卷管理
              </a-button>
            </a-tooltip>
          </a-row>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 100px" />
      <a-row>
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="简介">
            <div v-html="datas.synopsis"></div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="知识库(题库)" force-render>
            <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
              <a-form-model
                layout="horizontal"
                :model="dataSource"
                ref="dataSource"
              >
                <a-row>
                  <a-col :md="6" :sm="24">
                    <a-form-model-item
                      label="关键词"
                      :labelCol="{ span: 5 }"
                      :wrapperCol="{ span: 18, offset: 1 }"
                    >
                      <a-input
                        v-model="keyword"
                        placeholder="请输入关键词"
                        allowClear
                      />
                    </a-form-model-item>
                  </a-col>

                  <a-col
                    :md="6"
                    :sm="24"
                    style="margin-bottom: 10px; padding-left: 6.3%"
                  >
                    <span
                      style="
                        float: left;
                        margin-top: 3px;
                        display: block;
                        margin-bottom: 24px;
                        white-space: nowrap;
                      "
                    >
                      <a-button
                        type="primary"
                        :loading="loadingsearch"
                        @click="onSearch"
                        >查询</a-button
                      >
                      <a-button style="margin-left: 8px" @click="resetForm()"
                        >重置</a-button
                      >
                    </span>
                  </a-col>

                  <a-col
                    :md="11"
                    style="
                      margin-bottom: 10px;
                      padding-left: 6.3%;
                      margin-top: -3.7px;
                    "
                  >
                    <span
                      style="
                        float: right;
                        margin-top: 3px;
                        display: block;
                        margin-bottom: 24px;
                        white-space: nowrap;
                      "
                    >
                      <a-button
                        type="primary"
                        :loading="loadingsearch"
                        @click="onAdd"
                        icon="plus"
                        >新增</a-button
                      >
                    </span>
                  </a-col>
                </a-row>
              </a-form-model>

              <div>
                <a-card
                  style="margin-bottom: 15px"
                  v-for="(item, index) in this.datad"
                  :key="index"
                  class="cards"
                >
                  <a-descriptions :column="2" style="padding: 0">
                    <a-descriptions-item>
                      <span slot="label" style="font-size: 18px"
                        >题目{{ index + 1 }}</span
                      >

                      <span
                        style="font-size: 18px; font-family: 'Microsoft YaHei'"
                      >
                        &nbsp;&nbsp;{{ item.title }}&nbsp;&nbsp;
                        <span v-if="item.types == 0" style="color: red"
                          >(要点)</span
                        >
                        <span v-if="item.types == 1" style="color: orange"
                          >(单选题)</span
                        >
                        <span v-if="item.types == 2" style="color: purple"
                          >(多选题)</span
                        >
                        <span v-if="item.types == 3" style="color: green"
                          >(判断题)</span
                        >
                        <span v-if="item.types == 4" style="color: blue"
                          >(简答题)</span
                        >
                      </span>
                    </a-descriptions-item>
                    <a-descriptions-item>
                      <span style="margin-left: 390px">
                        <a-button icon="edit" @click="editing(item)">
                          编辑
                        </a-button>
                        <a-divider type="vertical" />
                        <a-button icon="delete" danger @click="deletess(item)">
                          移除
                        </a-button>
                      </span>
                    </a-descriptions-item>
                  </a-descriptions>
                  <a-descriptions
                    v-if="item.types == 1"
                    :column="1"
                    style="padding: 0"
                  >
                    <a-descriptions-item>
                      <span
                        style="font-size: 18px; font-family: 'Microsoft YaHei'"
                      >
                        <span v-if="item.types == 1">
                          <span
                            v-if="item.answers[0]"
                            style="margin-right: 66px"
                            >A: {{ item.answers[0].title }}</span
                          >
                          <span
                            v-if="item.answers[1]"
                            style="margin-right: 66px"
                            >B: {{ item.answers[1].title }}</span
                          >
                          <span
                            v-if="item.answers[2]"
                            style="margin-right: 66px"
                            >C: {{ item.answers[2].title }}</span
                          >
                          <span
                            v-if="item.answers[3]"
                            style="margin-right: 66px"
                            >D: {{ item.answers[3].title }}</span
                          >
                        </span>
                      </span>
                    </a-descriptions-item>
                  </a-descriptions>
                  <a-descriptions
                    v-if="item.types == 2"
                    :column="1"
                    style="padding: 0"
                  >
                    <a-descriptions-item>
                      <span
                        style="font-size: 18px; font-family: 'Microsoft YaHei'"
                      >
                        <span v-if="item.types == 2">
                          <span
                            v-if="item.answers[0]"
                            style="margin-right: 66px"
                            >A: {{ item.answers[0].title }}</span
                          >
                          <span
                            v-if="item.answers[1]"
                            style="margin-right: 66px"
                            >B: {{ item.answers[1].title }}</span
                          >
                          <span
                            v-if="item.answers[2]"
                            style="margin-right: 66px"
                            >C: {{ item.answers[2].title }}</span
                          >
                          <span
                            v-if="item.answers[3]"
                            style="margin-right: 66px"
                            >D: {{ item.answers[3].title }}</span
                          >
                        </span>
                      </span>
                    </a-descriptions-item>
                  </a-descriptions>
                  <a-descriptions :column="1" style="padding: 0">
                    <a-descriptions-item label="答案">
                      <span v-if="item.types == 1" style="font-size: 18px">
                        <span
                          v-for="(itemss, indexss) in item.answers"
                          :key="indexss"
                        >
                          <span v-if="itemss.right == true">
                            {{ itemss.title }}&nbsp;&nbsp;
                          </span>
                        </span>
                      </span>
                      <span v-if="item.types == 2" style="font-size: 18px">
                        <span
                          v-for="(itemss, indexss) in item.answers"
                          :key="indexss"
                        >
                          <span v-if="itemss.right == true">
                            {{ itemss.title }}&nbsp;&nbsp;
                          </span>
                        </span>
                      </span>
                      <span v-if="item.types == 3" style="font-size: 18px">
                        <span
                          v-for="(itemss, indexss) in item.answers"
                          :key="itemss.id"
                        >
                          <span v-if="itemss.right == true">
                            {{ itemss.title }}
                          </span>
                        </span>
                      </span>
                      <span v-if="item.types == 4" style="font-size: 18px">
                        <span
                          v-for="(itemss, indexss) in item.answers"
                          :key="itemss.id"
                        >
                          <span>
                            {{ itemss.title }}
                          </span>
                        </span>
                      </span>
                      <span v-if="item.types == 0" style="font-size: 18px">
                        <span
                          v-for="(itemss, indexss) in item.answers"
                          :key="itemss.id"
                        >
                          <span>
                            {{ itemss.title }}
                          </span>
                        </span>
                      </span>
                    </a-descriptions-item>
                  </a-descriptions>
                </a-card>
              </div>

              <a-pagination
                size="small"
                style="text-align: right"
                @change="changepage"
                :current="pagination.page"
                :pageSize="pagination.per_page"
                @showSizeChange="changepage"
                :total="dataSource.total"
                show-size-changer
                show-quick-jumper
                :show-total="(total) => `共 ${total} 条`"
              ></a-pagination>
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </a-row>
      <a-modal
        title="题目新增"
        :visible="visibles"
        :width="900"
        :maskClosable="false"
        @ok="submit"
        @cancel="handleCancel"
      >
        <k-form-build
          :value="channelForm"
          :dynamicData="dynamicData"
          ref="kbf"
          @change="handlechange"
        />
      </a-modal>
    </a-card>
  </div>
</template>

<script>
import { form_get } from "@/services/forms";
import {
  questions_add,
  questions_edit,
  questions_delete,
  questions_paginate,
  subjects_list,
} from "@/services/knowledge";
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
      loading: false,
      visible: false,
      drawervisible: false,
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
      showd: false,
      columns: [
        {
          title: "题库(双击题目可以查看答案)",
          dataIndex: "title",
          scopedSlots: { customRender: "titless" },
          ellipsis: true,
        },
      ],
      selectedRowKeys: [],
      draftId: "",
      siteList: [],
      searchLoading: false,
      page: 1,
      per_page: 10,
      id: "",
      subject_list: [], //数组，存放科目类别
      datadetiles: {}, //详情信息
      categorys: [], //所属类目列表
      crowds: [], //所属标签列表
      types: "", //所属类型
      tags: "", //所属标签
      bannerslist: [], //图片列表
      resource_vis: false, //资源弹窗
      downloadlist: [], //资源列表
      hasDelete: false,
      hasDownload: false,
      hasInsert: false,
      channelForm: {}, //表单
      channelDialog: false, //编辑弹窗
      confirmLoading: false, //编辑提交按钮
      logo: "",
      loading: false,
      datas: {},
      visibles: false,
      datad: [],
      only: {},
      some: {},
      short: {},
      porpobject: {},
      channelFormss: {},
      _idss: "",
      answerslist: [],
      keyword: "",
      num2: 0,
    };
  },
  created() {
    this.params = this.params.mmm ? this.params.mmm : this.params;
    this.porpobject = this.params;
    this.datas = this.params.mmm ? this.params.mmm.data : this.params.data;
    this.searchform.base =
      typeof this.datas._id == undefined
        ? this.params.mmm.data.id
        : this.datas._id;
    this.init();
    this._idss = this.params.data.id;
  },
  watch: {
    activeKey(key) {
      console.log(key);
    },
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
    dynamicData() {
      let result = {
        subjectlist: [],
      };
      for (let item in this.subject_list) {
        result.subjectlist.push({
          value: this.subject_list[item].id,
          label: this.subject_list[item].title,
        });
      }
      return result;
    },
  },
  methods: {
    //题目删除
    deletess(item) {
      var that = this;
      this.$confirm({
        title: "你确定要删除这道题目吗？",
        icon: "info-circle",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          var parems = {
            id: item.id,
          };
          questions_delete(parems)
            .then(() => {
              that.$message.success("操作成功!!");
              that.init();
            })
            .catch((err) => {
              console.log(err);
            });
        },
        oncancel() {},
      });
    },
    //题目编辑
    editing(item) {
      this.visibles = true;
      this.id = item.id;
      if (item.types == 1) {
        this.$nextTick(() => {
          this.$refs.kbf.show(["singleselect"]);
          this.$refs.kbf.hide([
            "keypoints",
            "someselect",
            "judge",
            "shortanswer",
          ]);
        });
        // 新建一个数组和一个字典，用于编辑回显的
        var sinlist = [];
        var sinnum = {};
        for (let i in item.answers) {
          sinnum = {
            title: item.answers[i].title,
            right: item.answers[i].right ? 1 : 2,
          };
          sinlist.push(sinnum);
        }
      }
      if (item.types == 2) {
        this.$nextTick(() => {
          this.$refs.kbf.show(["someselect"]);
          this.$refs.kbf.hide([
            "keypoints",
            "singleselect",
            "judge",
            "shortanswer",
          ]);
        });
        // 新建一个数组和一个字典，用于编辑回显的
        var somlist = [];
        var somnum = {};
        for (let i in item.answers) {
          somnum = {
            title: item.answers[i].title,
            right: item.answers[i].right ? 1 : 2,
          };
          somlist.push(somnum);
        }
      }
      if (item.types == 3) {
        this.$nextTick(() => {
          this.$refs.kbf.show(["judge"]);
          this.$refs.kbf.hide([
            "keypoints",
            "singleselect",
            "someselect",
            "shortanswer",
          ]);
        });
      }
      if (item.types == 4) {
        this.$nextTick(() => {
          this.$refs.kbf.show(["shortanswer"]);
          this.$refs.kbf.hide([
            "keypoints",
            "singleselect",
            "judge",
            "someselect",
          ]);
        });
      }
      this.$nextTick(() => {
        this.mothed = questions_edit;
        this.$refs.kbf.setData({
          title: item.title,
          subject: item.subject,
          types: item.types,
          singleselect: sinlist,
          someselect: somlist,
          shortanswer: item.answers[0].title,
        });
      });
    },
    //新增
    onAdd() {
      (this.visibles = true),
        this.$nextTick(() => {
          this.mothed = questions_add;
          this.id = undefined;
          this.$refs.kbf.hide([
            "keypoints",
            "singleselect",
            "someselect",
            "judge",
            "shortanswer",
          ]);
        });
    },

    //自定义表单弹出框的取消
    handleCancel() {
      this.visibles = false;
      this.$refs.kbf.reset();
      this.init();
    },
    //自定义表单弹出框的确定
    submit() {
      this.$refs.kbf.getData().then((data) => {
        if (data.types == 1) {
          let that = this;
          if (data.singleselect.length > 4) {
            alert("选项超过了四个?");
            return;
          }
          let num1 = 0;
          that.answerslist = [];
          for (let i = 0; i < data.singleselect.length; i++) {
            that.answerslist.push({
              title: data.singleselect[i].title,
              right: data.singleselect[i].right == 1 ? true : false,
            });
            if (data.singleselect[i].right == 1) {
              num1++;
            }
          }
          if (num1 != 1) {
            alert("正确选项的个数应该为1");
            that.answerslist = [];
            return;
          }
          that.$refs.kbf.getData().then((res) => {
            that
              .mothed(
                Object.assign({
                  id: that.id,
                  base: that.datas.id,
                  subject: res.subject,
                  title: res.title,
                  types: res.types,
                  answers: that.answerslist,
                })
              )
              .then((ress) => {
                that.visibles = false;
                that.$message.success("操作成功！！");
                this.$refs.kbf.reset();
                that.init();
              })
              .catch((res) => {
                that.visibles = false;
                this.$refs.kbf.reset();
              });
          });
        } else if (data.types == 2) {
          let that = this;
          if (data.someselect.length > 4) {
            alert("选项超过了四个?");
            return;
          }
          this.num2 = 0;
          that.answerslist = [];
          for (let i = 0; i < data.someselect.length; i++) {
            that.answerslist.push({
              title: data.someselect[i].title,
              right: data.someselect[i].right == 1 ? true : false,
            });
            console.log("data.someselect", data);
            if (data.someselect[i].right == 1) {
              this.num2++;
            }
            console.log("this.num2", this.num2);
          }
          if (this.num2 == 0) {
            alert("请判断正确选项的个数");
            that.answerslist = [];
            return;
          }
          that.$refs.kbf.getData().then((res) => {
            that
              .mothed(
                Object.assign({
                  id: that.id,
                  base: that.datas.id,
                  subject: res.subject,
                  title: res.title,
                  types: res.types,
                  answers: that.answerslist,
                })
              )
              .then((ress) => {
                that.visibles = false;
                that.$message.success("操作成功！！");
                this.$refs.kbf.reset();
                that.init();
              })
              .catch((res) => {
                that.visibles = false;
                this.$refs.kbf.reset();
              });
          });
        } else if (data.types == 3) {
          let that = this;
          that.answerslist = [];
          if (data.judge == 1) {
            that.answerslist.push(
              {
                title: "正确",
                right: true,
              },
              {
                title: "错误",
                right: false,
              }
            );
          } else if (data.judge == 2) {
            that.answerslist.push(
              {
                title: "正确",
                right: false,
              },
              {
                title: "错误",
                right: true,
              }
            );
          }
          that.$refs.kbf.getData().then((res) => {
            that
              .mothed(
                Object.assign({
                  id: that.id,
                  base: that.datas.id,
                  subject: res.subject,
                  title: res.title,
                  types: res.types,
                  answers: that.answerslist,
                })
              )
              .then((ress) => {
                that.visibles = false;
                that.$message.success("操作成功！！");
                this.$refs.kbf.reset();
                that.init();
              })
              .catch((res) => {
                that.visibles = false;
                this.$refs.kbf.reset();
              });
          });
        } else if (data.types == 4) {
          let that = this;
          that.answerslist = [];
          that.answerslist.push({
            title: data.shortanswer,
          });
          that.$refs.kbf.getData().then((res) => {
            that
              .mothed(
                Object.assign({
                  id: that.id,
                  base: that.datas.id,
                  subject: res.subject,
                  title: res.title,
                  types: res.types,
                  answers: that.answerslist,
                })
              )
              .then((ress) => {
                that.visibles = false;
                that.$message.success("操作成功！！");
                this.$refs.kbf.reset();
                that.init();
              })
              .catch((res) => {
                that.visibles = false;
                this.$refs.kbf.reset();
              });
          });
        } else if (data.types == 0) {
          let that = this;
          that.answerslist = [];
          that.answerslist.push({
            title: data.keypoints,
          });
          that.$refs.kbf.getData().then((res) => {
            that
              .mothed(
                Object.assign({
                  id: that.id,
                  base: that.datas.id,
                  subject: res.subject,
                  title: res.title,
                  types: res.types,
                  answers: that.answerslist,
                })
              )
              .then((ress) => {
                that.visibles = false;
                that.$message.success("操作成功！！");
                this.$refs.kbf.reset();
                that.init();
              })
              .catch((res) => {
                that.visibles = false;
                this.$refs.kbf.reset();
              });
          });
        }
      });
    },

    // edit(item) {
    //   this.visibles = true;
    //   this.id = item.id;
    //   this.$nextTick(() => {
    //     this.mothed = questions_edit;
    //     this.$refs.channelForm.setData({});
    //   });
    // },
    showModal(item) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "testpaper",
          params: {
            data: item,
            mmm: this.porpobject,
          },
        },
      });
    },

    init() {
      form_get({ name: "topic_increase" })
        .then((response) => {
          this.channelForm = response.data.data.form;
        })
        .catch((error) => {
          this.$message.error(error);
        });
      questions_paginate({
        keyword: this.keyword,
        base: this.datas._id,
        page: this.page,
        per_page: this.per_page,
      }).then((res) => {
        this.datad = res.data.data.items;
        this.dataSource = res.data.data;
        this.forwards = res.data.data.forward;
        this.total = res.data.data.total;
        this.searchloading = false;
        this.loading = false;
      });
      subjects_list({ base: this.datas.id }).then((res) => {
        this.subject_list = res.data.data.items;
      });
    },
    list() {
      this.searchloading = true;
      this.loading = true;
    },
    // 分页
    changepage(page, pageSize) {
      this.page = page;
      this.per_page = pageSize;
      this.init();
    },

    //科目类别详情
    todetailess(item) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "information",
          params: {
            data: item,
            channelForm: Object.assign(this.channelForm),
            pagination: this.pagination,
          },
        },
      });
    },
    onSearch() {
      this.page = 1;
      this.per_page = 10;
      this.init();
    },
    onSelectClear() {
      this.selectedRowKeys = [];
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    resetForm() {
      (this.keyword = ""), (this.page = 1);
      this.per_page = 10;
      this.init();
    },

    //返回
    back() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "home",
          params: this.params,
        },
      });
    },
    // 跳转页面
    todetailes(item) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "information",
          params: {
            data: item,
            mmm: this.porpobject,
          },
        },
      });
    },
    // 删除
    confirm() {
      deletes({
        id: this.id,
      })
        .then(() => {
          this.$message.success("操作成功！");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //拼接自定义表单
    handlechange(key, value) {
      if (value == "types") {
        if (key == 0) {
          this.$nextTick(() => {
            this.$refs.kbf.show(["keypoints"]);
            this.$refs.kbf.hide([
              "singleselect",
              "someselect",
              "judge",
              "shortanswer",
            ]);
          });
        } else if (key == 1) {
          this.$nextTick(() => {
            this.$refs.kbf.show(["singleselect"]);
            this.$refs.kbf.hide([
              "keypoints",
              "someselect",
              "judge",
              "shortanswer",
            ]);
          });
        } else if (key == 2) {
          this.$nextTick(() => {
            this.$refs.kbf.show(["someselect"]);
            this.$refs.kbf.hide([
              "keypoints",
              "singleselect",
              "judge",
              "shortanswer",
            ]);
          });
        } else if (key == 3) {
          this.$nextTick(() => {
            this.$refs.kbf.show(["judge"]);
            this.$refs.kbf.hide([
              "keypoints",
              "singleselect",
              "someselect",
              "shortanswer",
            ]);
          });
        } else if (key == 4) {
          this.$nextTick(() => {
            this.$refs.kbf.show(["shortanswer"]);
            this.$refs.kbf.hide([
              "keypoints",
              "singleselect",
              "someselect",
              "judge",
            ]);
          });
        }
      }
    },
  },
};
</script>
<style>
.ant-descriptions-item {
  border: none;
}
.ant-descriptions-item-label {
  font-weight: 700;
}
.ant-carousel .slick-slide img {
  width: 100%;
  height: 25vw;
  object-fit: cover;
  -o-object-fit: cover;
  padding: 30px;
}
</style>

<style scoped>
/* For demo */
.ant-carousel >>> .slick-dots {
  height: auto;
}
.ant-carousel >>> .slick-slide img {
  border: 5px solid #fff;
  display: block;
  margin: auto;
  max-width: 80%;
}
.ant-carousel >>> .slick-thumb {
  bottom: -45px;
}
.ant-carousel >>> .slick-thumb li {
  width: 60px;
  height: 45px;
}
.ant-carousel >>> .slick-thumb li img {
  width: 100%;
  height: 100%;
  filter: grayscale(100%);
}
.ant-carousel >>> .slick-thumb li.slick-active img {
  filter: grayscale(0%);
}
.scroll_list {
  min-height: 180px;
}
.list_img {
  width: 80%;
  height: 25vw;
  object-fit: cover;
  -o-object-fit: cover;
  padding: 30px;
  margin: auto 10%;
}
</style>
<style scoped>
.title_back {
  padding: 10px;
  background: #daedff;
  border: 1px solid #40a9ff;
  border-radius: 5px;
  margin-bottom: 20px;
}
.model p {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
}
.model div {
  height: 700px;
  padding: 0 99px;
  overflow: auto;
}
</style>

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
<style lang="less" scoped>
.infobody {
  height: 100vh;
  overflow: auto;
}
.title_back {
  padding: 10px;
  background: #daedff;
  border: 1px solid #40a9ff;
  border-radius: 5px;
  margin-bottom: 20px;
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
  height: 600px;
  padding: 0 99px;
  overflow: auto;
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
img {
  transition: all 0.5s;
  -webkit-transition: all 0.5s; //-webkit-是谷歌浏览器厂商的前缀
  -o-transition: all 0.5s; //-o-是opera浏览器厂商的前缀
  cursor: pointer;
}
img:hover {
  transform: scale(1.1);
}
.cards {
  margin: 15px 79px;
  // min-height: 99px;
  box-shadow: 0 4px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.5s;
  -webkit-transition: all 0.5s;
  cursor: pointer;
}
.cards:hover {
  transform: scale(1.1) !important;
}
.introduction_format {
  margin: 15px auto;
  width: 824px;
  color: #666;
  font-size: 18px;
  text-align: center;
  letter-spacing: 3px;
  line-height: 50px;
  border: 1px dashed #000;
  padding: 10px 15px;
  text-indent: 2em;
}
</style>
