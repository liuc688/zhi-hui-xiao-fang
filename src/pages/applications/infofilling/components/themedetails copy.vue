<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <div class="title_back">
      <a @click="back"><a-icon type="arrow-left" />返回</a>
    </div>
    <a-spin tip="Loading..." :spinning="spinning">
      <a-row :gutter="24" class="page_paper">
        <h3>填报编辑：</h3>
        <a-col :span="14" :offset="4">
          <a-form-model
            ref="forms"
            :model="forms"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-form-model-item label="填报标题" prop="title">
              <a-input v-model="forms.title" placeholder="请输入填报标题" />
            </a-form-model-item>

            <a-form-model-item label="填报描述" prop="content">
              <a-input
                type="textarea"
                :rows="4"
                v-model="forms.content"
                placeholder="请输入填报描述"
              />
            </a-form-model-item>
            <a-form-model-item label="填报类别" prop="category">
              <a-select
                placeholder="请输入填报类型查询"
                v-model="forms.category"
                allowClear
              >
                <a-select-option value="建设审批">建设审批</a-select-option>
                <a-select-option value="安全生产">安全生产</a-select-option>
                <a-select-option value="环保治污">环保治污</a-select-option>
                <a-select-option value="其他">其他</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item
              label="起止日期"
              format="YYYY-MM-DD"
              prop="range"
            >
              <a-range-picker
                v-model="forms.range"
                @change="onChange"
                style="width: 100%"
              />
            </a-form-model-item>
            <div v-for="(item, index) in choices" :key="index">
              <!-- 属性内容 -->
              <a-form-model-item
                :label="
                  index === 0
                    ? '属性内容(1)'
                    : '属性内容' + '(' + (index + 1) + ')'
                "
              >
                <a-input
                  placeholder="请选择属性内容"
                  v-model="choices[index].title"
                  style="width: 100%"
                >
                </a-input>
              </a-form-model-item>
              <a-form-model-item label="类型">
                <a-select v-model="choices[index].type" placeholder="类型">
                  <a-select-option value="radio"> 单选 </a-select-option>
                  <a-select-option value="checkbox"> 多选 </a-select-option>
                  <a-select-option value="input"> 问答 </a-select-option>
                </a-select>
              </a-form-model-item>

              <a-form-model-item label="是否必填">
                <a-radio-group v-model="choices[index].fill">
                  <a-radio :value="true"> 是 </a-radio>
                  <a-radio :value="false"> 否 </a-radio>
                </a-radio-group>
              </a-form-model-item>

              <a-form-model-item
                v-if="choices[index].type !== 'input'"
                label="属性选项"
              >
                <a-select
                  mode="tags"
                  placeholder="属性选项"
                  style="width: 80%"
                  v-model="choices[index].options"
                >
                </a-select>
                <!-- 删除属性按钮 -->
                <a-button
                  style="margin-left: 5%"
                  v-if="choices.length > 0"
                  icon="delete"
                  :disabled="choices.length === 0"
                  @click="removeDomain(item)"
                ></a-button>
              </a-form-model-item>
            </div>
            <a-form-model-item :wrapperCol="{ span: 18, offset: 6 }">
              <a-button
                @click="addDomain"
                type="dashed"
                icon="plus"
                style="margin: 5px 8px 5px 0; width: 100%"
                >添加属性</a-button
              >
            </a-form-model-item>
          </a-form-model>
          <div style="text-align: center; margin-bottom: 150px">
            <a-button @click="submint" :loading="loading" type="primary"
              >保存</a-button
            >
            <a-button
              type="primary"
              style="margin-left: 10px"
              v-if="id"
              @click="Statistics"
              >答案统计</a-button
            >
          </div>
        </a-col>
      </a-row>
    </a-spin>
  </a-card>
</template>
<script>
// import { site_list } from "@/services/opinion";
import { organization_tree } from "@/services/organization";
import { survey_get, survey_update, survey_add } from "@/services/survey";
// import pick from "lodash.pick";
import { enterpriselist } from "./data.json";
import { theme_info, answer_get, theme_answer } from "@/services/infofilling";
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
      extension: [],
      fields: [],
      spinning: true,
      loading: false,
      id: undefined,
      checkedNames: true,
      siteList: [],
      forms: {},
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      choices: [],
      start: "",
      end: "",
      rules: {
        title: [{ required: true, message: "请输入填报标题" }],
        content: [{ required: true, message: "请输入填报描述" }],
        range: [{ required: true, message: "请输入起止时间" }],
        category: [{ required: true, message: "请输入填报类别" }],
        titles: [{ required: true, message: "请输入属性" }],
        type: [{ required: true, message: "请输入属性类型" }],
        options: [{ required: true, message: "请输入属性选项" }],
      },
      methodes: undefined,
      enterpriselist,
    };
  },
  computed: {
    dynamicData() {
      let result = {
        organizations: [],
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
  },
  created() {
    console.log("this.params1111", this.params);
    this.id = this.params.ids;
    this.spinning = false;
    this.init();
  },
  methods: {
    onChange(data, range) {
      if (range && range.length) {
        this.start = range[0];
        this.end = range[1];
      } else {
        this.start = undefined;
        this.end = undefined;
      }
    },
    /*表单项添加*/
    addDomain() {
      this.choices.push({
        title: "",
        type: "",
        fill: true,
        options: [],
      });
    },
    /*表单项删除*/
    removeDomain(item) {
      let index = this.choices.indexOf(item);
      if (index !== -1) {
        this.choices.splice(index, 1);
      }
    },
    init() {
      answer_get({ id: this.id })
        .then((Response) => {
          console.log("Response", Response);
        })
        .catch((err) => {
          console.log("err", err);
          this.$message.error(err.Response.data.message);
        });
    },
    Statistics() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "themestatistics",
          params: this.params,
        },
      });
    },
    submint() {
      this.forms.choices = this.choices;
      this.$refs.forms.validate((valid) => {
        if (valid) {
          this.loading = true;
          var parems = {
            start: this.start,
            end: this.end,
            organization: this.forms.organization,
            title: this.forms.title,
            content: this.forms.content,
            choices: this.forms.choices,
            id: this.id,
          };
          this.methodes(parems)
            .then(() => {
              this.loading = false;
              this.$message.success("操作成功！");
              this.back();
            })
            .catch((err) => {
              this.loading = false;
              console.log(err);
            });
        }
      });
    },
    back() {
      this.$emit("event", {
        method: "onLink",
        params: {
          id: this.params.id ? this.params.id : "",
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
  padding: 10px;
  background: #daedff;
  border: 1px solid #40a9ff;
  border-radius: 5px;
  margin-bottom: 20px;
}
.page_paper {
  background: #f0f8ff;
  padding: 20px;
}
</style>