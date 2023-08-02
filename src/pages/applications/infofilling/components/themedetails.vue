<template>
  <a-card :body-style="{ padding: '24px 5%' }" :bordered="false">
    <div class="title_back">
      <a @click="back"><a-icon type="arrow-left" />返回</a>
    </div>
    <a-card class="basc_info" :loading="spinning">
      <span slot="title" style="font-size: 18px; font-weight: 600">{{
        datas.title
      }}</span>
      <a slot="extra" href="#" @click="edit_bascinfo" v-if="visble_bascinfo">
        <a-icon type="edit" />编辑
      </a>
      <span slot="extra" v-else>
        <a href="#" @click="submitbasc"> 保存 </a>
        <a-divider type="vertical" />
        <a
          href="#"
          @click="
            () => {
              visble_bascinfo = true;
            }
          "
        >
          取消
        </a>
      </span>
      <div class="contents">
        {{ datas.content }}
      </div>
      <a-alert type="info">
        <div slot="message" style="font-size: 18px; font-weight: 600">
          问题描述:
        </div>
        <div slot="description" class="contents">
          {{ datas.subtitle }}
        </div>
      </a-alert>
      <div v-if="visble_bascinfo">
        <div class="answers">
          {{ answerdata }}
        </div>
        <a-card title="附件：">
          <a
            v-for="(item, index) in files"
            :key="index"
            target="_blank"
            rel="noopener noreferrer"
            :title="item.name"
            :href="item.url"
            :download="item.name"
            class="
              ant-upload-list-item-name ant-upload-list-item-name-icon-count-1
            "
          >
            {{ index + 1 }}. &nbsp;{{ item.name }}
          </a>
        </a-card>
      </div>
      <div v-else class="answeres">
        <k-form-build :value="jsonData" :config="config" ref="forms" />
      </div>
    </a-card>
  </a-card>
</template>
<script>
import { theme_info, answer_get, theme_answer } from "@/services/infofilling";
import Cookie from "js-cookie";
import { FormUpload } from "@/services/api";
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
      spinning: true,
      id: undefined,
      company: undefined,
      visble_bascinfo: true,
      answers: undefined,
      datas: {},
      answerdata: "",
      action: FormUpload,
      files: [],
      jsonData: {},
    };
  },
  created() {
    this.id = this.params.ids;
    this.company = this.params.id;
    this.spinning = false;
    form_get({ name: "zdxfg_zttbs" })
      .then((res) => {
        this.jsonData = res.data.data.form;
        this.init();
      })
      .catch((err) => {
        this.$message.error(err.response.data.message);
      });
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
  methods: {
    init() {
      theme_info({ id: this.id , company :this.company})
        .then((Response) => {
          this.datas = Response.data.data.length ? Response.data.data[0] : {};
          if (this.datas.answers && this.datas.answers.length) {
            answer_get({ id: this.datas.answers[0].id  })
              .then((res) => {
                this.answerdata = res.data.data ? res.data.data.content : "";
                this.files = res.data.data ? res.data.data.files : [];
              })
              .catch((err) => {
                console.log("err", err);
                this.$message.error(err.Response.data.message);
              });
          } else {
            this.answerdata = "暂未填报";
            this.files = [];
          }
        })
        .catch((err) => {
          console.log("err", err);
          this.$message.error(err.Response.data.message);
        });
    },
    edit_bascinfo() {
      this.visble_bascinfo = false;
      this.$nextTick(() => {
        this.$refs.forms.setData({
          content: this.answerdata,
          files: this.files,
        });
      });
    },
    submitbasc() {
      this.$refs.forms
        .getData()
        .then((res) => {
          console.log("res", res);
          var data = {
            theme: this.id,
            company: this.company,
            content: res.content,
            comeform: "PC端",
            files: res.files,
          };
          theme_answer(data)
            .then(() => {
              this.visble_bascinfo = true;
              this.init();
            })
            .catch((err) => {
              console.log(err);
              this.$message.error(err.Response.data.message);
            });
        })
        .catch((err) => {
          console.log(err);
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
.contents {
  font-size: 16px;
  text-indent: 2em;
  line-height: 38px;
}
.basc_info >>> a {
  color: #40a9ff;
}
.answers {
  min-height: 220px;
  margin: 30px auto;
  border: 1px solid #c4c4c4;
  overflow-y: auto;
  border-radius: 5px;
  padding: 20px;
  font-size: 16px;
  background: #fffae8;
}
.answeres {
  margin: 30px auto;
  overflow-y: auto;
  border-radius: 5px;
}
</style>