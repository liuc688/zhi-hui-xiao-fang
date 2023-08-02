// 供考试人员查看自己的卷子
<template>
  <!-- 试卷管理 -->
  <div>
    <div style="text-align: center; margin: 15px 0 25px 0; font-size: 22px">
      {{ this.params.data.title }}
    </div>
    <a-card
      v-for="(item, index) in this.paperobj"
      :key="item.id"
      style="min-height: 90px; margin-bottom: 15px"
      class="cards"
    >
      <a-descriptions :column="2">
        <a-descriptions-item span="2">
          <span slot="label" style="font-size: 18px; font-weight: 500"
            >题目{{ index + 1 }}&nbsp;&nbsp;{{ item.question.title }}</span
          >
          <span style="font-size: 18px; font-family: 'Microsoft YaHei'">
            {{ item.title }}&nbsp;&nbsp;
            <span v-if="item.types == 1">[单选题]</span>
            <span v-if="item.types == 2">[多选题]</span>
            <span v-if="item.types == 3">[判断题]</span>
            <span v-if="item.types == 4">[简答题]</span>
          </span>
          <span style="font-weight: 700; font-size: 18px; color: #13c2c2"
            >&nbsp;&nbsp;&nbsp;&nbsp;({{ item.score }} 分)</span
          >
        </a-descriptions-item>
        <a-descriptions-item span="2">
          <span v-if="item.types == 1">
            <a-radio-group
              name="radioGroup"
              @change="onChange"
              v-model="values[index]"
              :default-value="item.answer"
            >
              <a-radio :value="0" disabled>
                A:{{ item.question.answers[0].title }}
              </a-radio>
              <a-radio :value="1" disabled>
                B:{{ item.question.answers[1].title }}
              </a-radio>
              <a-radio :value="2" disabled>
                C:{{ item.question.answers[2].title }}
              </a-radio>
              <a-radio :value="3" disabled>
                D:{{ item.question.answers[3].title }}
              </a-radio>
            </a-radio-group>
          </span>
          <span v-if="item.types == 2">
             <a-checkbox-group :default-value="item.answer" >
              <a-row>
            <a-checkbox :value="0" disabled>
              A:{{ item.question.answers[0].title }}
            </a-checkbox>
            <a-checkbox :value="1" disabled>
              B:{{ item.question.answers[1].title }}
            </a-checkbox>
            <a-checkbox :value="2" disabled>
              C:{{ item.question.answers[2].title }}
            </a-checkbox>
            <a-checkbox :value="3" disabled>
              D:{{ item.question.answers[3].title }}
            </a-checkbox>
             </a-row>
            </a-checkbox-group>
          </span>
          <span v-if="item.types == 3">
            <span v-for="(i, j) in item.question.answers" :key="j">
              <span v-if="i.right == true">
                <a-radio-group
                  name="radioGroup"
                  v-model="values[index]"
                  :default-value="j"
                >
                  <a-radio :value="0" disabled>
                    {{ item.question.answers[0].title }}
                  </a-radio>
                  <a-radio :value="1" disabled>
                    {{ item.question.answers[1].title }}
                  </a-radio>
                </a-radio-group>
              </span>
            </span>
          </span>
          <span v-if="item.types == 4">
            <a-textarea
              :placeholder="item.answer"
              style="width: 699px"
              :rows="4"
              v-model="values[index]"
              disabled
            />
            
          </span>
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions :column="1" style="padding: 0">
        <a-descriptions-item label="答案">
          <span v-if="item.types == 1" style="font-size: 18px">
            <span
              v-for="(itemss, indexss) in item.question.answers"
              :key="indexss"
            >
              <span v-if="itemss.right == true">
                {{ itemss.title }}&nbsp;&nbsp;
              </span>
            </span>
          </span>
          <span v-if="item.types == 2" style="font-size: 18px">
            <span
              v-for="(itemss, indexss) in item.question.answers"
              :key="indexss"
            >
              <span v-if="itemss.right == true">
                {{ itemss.title }}&nbsp;&nbsp;
              </span>
            </span>
          </span>
          <span v-if="item.types == 3" style="font-size: 18px">
            <span
              v-for="(itemss, indexss) in item.question.answers"
              :key="itemss.id"
            >
              <span v-if="itemss.right == true">
                {{ itemss.title }}
              </span>
            </span>
          </span>
          <span v-if="item.types == 4" style="font-size: 18px">
            <span
              v-for="(itemss, indexss) in item.question.answers"
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
    <div v-if="showCard">
      <a-button @click="back()" class="logo"
        ><a-icon type="arrow-left" />返回</a-button
      >
    </div>
    <div style="margin-top: 100px">
      <a-row></a-row>
    </div>
  </div>
</template>

<script>
import {
  examinees_get,
  examinees_chitotal,
  examinees_case,
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
      showCard: false,
      transitionobj: {},
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
      status: false,
      searchform: {},
      dataSource: {},
      jsonData: {},
      draftId: "",
      siteList: [],
      channelFormtp: {},
      channelFormex: {},
      countylist: [],
      id: "",
      tpobjarr: [], //用来临时存放科目类别的id.
      sinselectlist: [],
      someselectlist: [],
      judgeselectlist: [],
      shortanswerlist: [],
      tpobjstr: "",
      questionsarr: [],
      numberall: 0,
      sclen: 0,
      mclen: 0,
      judelen: 0,
      salen: 0,
      scsco: 0,
      mcsco: 0,
      judesco: 0,
      sasco: 0,
      sineditarr: [],
      someeditarr: [],
      judeeditarr: [],
      shaneditarr: [],
      sineditsco: 0,
      someeditsco: 0,
      judeeditsco: 0,
      shaneditsco: 0,
      question_bank: [],
      allquestions: [],
      baseid: "",
      paperid: "",
      paperobj: {},
      values: {},
    };
  },
  created() {
    console.log("this.params", this.params);
    this.init();
  },
  methods: {
    //返回
    back() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "texamranking",
          params: this.params,
        },
      });
    },
    init() {
      this.searchform = this.params.searchform || this.searchform;
      this.list();
    },
    list() {
      examinees_case({
        user: this.params.ids,
        examination: this.params.data.id,
      }).then((res) => {
        this.paperobj = res.data.data.questions;
        console.log("this.paperobj", this.paperobj);
        this.showCard = true;
      });
    },
  },
};
</script>

<style>
span .ant-radio + * {
  padding-right: 69px;
}
.ant-radio-wrapper {
  font-size: 18px;
}
.ant-radio-inner {
  top: -3px;
  width: 18px;
  height: 18px;
  border-width: 2px;
}
.ant-checkbox-wrapper {
  font-size: 18px;
}
.ant-checkbox + span {
  padding-right: 50px;
}
.ant-checkbox-inner {
  top: -1.5px;
  width: 18px;
  height: 18px;
}
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
  margin: 0 28px;
  padding: 10px;
  background: #daedff;
  border: 1px solid #40a9ff;
  border-radius: 5px;
}
.cards {
  margin: 15px 79px;
  // min-height: 99px;
  box-shadow: 0 4px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.5s;
  -webkit-transition: all 0.5s;
  cursor: pointer;
}
.logo {
  margin: 60px 0 0 78px;
  width: 120px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #fff;
  text-decoration: none;
  background: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4);
  border-radius: 20px;
  background-size: 400%;
  font-size: 18px;
  text-transform: uppercase;
}
.logo:hover {
  animation: animate 8s linear infinite;
}
@keyframes animate {
  0% {
    background-position: 0%;
  }
  100% {
    background-position: 400%;
  }
}
.logo::before {
  content: "";
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  z-index: -1;
  border-radius: 40px;
  background-size: 400%;
  opacity: -1;
  transition: 0.5s;
}
.logo:hover::before {
  filter: blur(20px);
  opacity: 1;
}
.cards {
  box-shadow: 0 3px 2px 2px rgba(0, 0, 0, 0.3);
}
</style>
