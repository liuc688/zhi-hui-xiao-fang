<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <div class="title_back">
      <a @click="back"><a-icon type="arrow-left" />返回</a>
    </div>
    <div>
      <h3>问卷标题：{{ paper.title }}</h3>
      <a-row :gutter="24">
        <a-col
          :span="12"
          :xxl="{ span: 12 }"
          :xl="{ span: 12 }"
          :xs="{ span: 24 }"
          v-for="(item, index) in question"
          :key="index"
        >
          <a-card
            v-if="item.choice"
            :title="item.title"
            style="padding: 20px; background: #f0f8ff; margin-bottom: 20px"
          >
            <div>
              <a-col :span="10">
                <div v-for="(temp, ind) in item.choices" :key="ind">
                  <p>
                    选项{{ ind + 1 }}: {{ temp.item }}
                    <span style="margin-left: 10px; color: #aaa"
                      >（{{ temp.count }}）</span
                    >
                  </p>
                </div>
              </a-col>
              <a-col :span="14">
                <div style="width: 100%; text-align: center">
                  <pie :title="paper.title" :dataSource="item.choices" />
                </div>
              </a-col>
            </div>
          </a-card>
          <a-card
            v-else
            :title="item.title"
            style="padding: 20px; background: #f0f8ff; margin-bottom: 20px"
          >
            <div>
              <a-col :span="10">
                <div v-for="(temp, ind) in item.choices" :key="ind">
                  <p>
                    选项{{ ind + 1 }}: {{ temp.item }}
                    <span style="margin-left: 10px; color: #aaa"
                      >（{{ temp.count }}）</span
                    >
                  </p>
                </div>
                <a @click="anwser(item)">查看全部回答</a>
              </a-col>
              <a-col :span="14">
                <div style="width: 100%; text-align: center">
                  <pie :title="paper.title" :dataSource="item.choices" />
                </div>
              </a-col>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
    <a-modal
      title="回复统计"
      width="60%"
      :closable="false"
      :visible="formDialog"
      @cancel="
        () => {
          formDialog = false;
        }
      "
    >
      <div class="title_back">问题 ：{{ datass.title }}</div>
      <a-list bordered :data-source="datass.replys" class="listreply">
        <a-list-item slot="renderItem" slot-scope="item, index">
          回答{{ index + 1 }} : {{ item }}
        </a-list-item>
        <div slot="header">
          <h4>回复列表</h4>
        </div>
      </a-list>
      <template slot="footer">
        <a-button
          @click="
            () => {
              formDialog = false;
            }
          "
          >关闭</a-button
        >
      </template>
    </a-modal>
  </a-card>
</template>
<script>
import Pie from "@/components/chart/Pie";
import { survey_get } from "@/services/survey";
import { enterpriselist } from "./data.json";
import { BarChart } from "echarts/charts";
export default {
  components: {
    Pie,
  },
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
      id: undefined,
      paper: {}, //试卷返回信息
      question: [],
      datass: [],
      formDialog: false,
      enterpriselist,
    };
  },
  computed: {},
  created() {
    console.log("params11111", this.params);
    this.id = this.params.id ? this.params.id : undefined;
    this.init();
  },
  methods: {
    init() {
      var data = this.enterpriselist.filter((item) => {
        return item.id == this.id;
      });
      console.log("data", data);
      this.paper = data[0];
      this.question = this.paper.data;
    },
    anwser(item) {
      this.datass = item;
      this.formDialog = true;
    },
    back() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "theme",
          params: this.params,
        },
      });
    },
  },
};
</script>
<style scoped>
.title_back {
  padding: 10px 24px;
  background: #daedff;
  border: 1px solid #40a9ff;
  border-radius: 5px;
  margin-bottom: 20px;
}
.listreply {
  max-height: 500px;
  overflow: scroll;
}
</style>