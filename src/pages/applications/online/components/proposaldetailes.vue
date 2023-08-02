<template>
  <a-card :body-style="{ padding: '24px 5%' }" :bordered="false">
    <div class="title_back">
      <a @click="back"><a-icon type="arrow-left" />返回</a>
    </div>
    <a-card class="basc_info" :loading="spinning">
      <span slot="title" style="font-size: 18px; font-weight: 600">{{
        datas.title
      }}</span>
      <!-- <a slot="extra" href="#" @click="edit_bascinfo" v-if="visble_bascinfo">
        <a-icon type="edit" />编辑
      </a> -->
      <a-descriptions bordered class="describle">
        <a-descriptions-item label="类别">
          {{ datas.category }}
        </a-descriptions-item>
        <a-descriptions-item label="类型">
          {{ datas.type }}
        </a-descriptions-item>
        <a-descriptions-item label="方式">
          <a-tag :color="datas.mobile ? '#87d068' : '#afafaf'">{{
            datas.mobile ? "留名" : "匿名"
          }}</a-tag>
        </a-descriptions-item>
        <template v-if="datas.mobile">
          <a-descriptions-item label="姓名">
            {{ datas.name }}
          </a-descriptions-item>
          <a-descriptions-item label="电话" :span="2">
            {{ datas.mobile }}
          </a-descriptions-item>
          <a-descriptions-item label="联系地址">
            {{ datas.address }}
          </a-descriptions-item>
          <a-descriptions-item label="电子邮箱" :span="2">
            {{ datas.email }}
          </a-descriptions-item>
        </template>
        <a-descriptions-item label="内容" :span="3">
          <div v-html="datas.content" class="htmls"></div>
        </a-descriptions-item>
        <a-descriptions-item v-if="datas.answer" label="回复" :span="3">
          <div v-html="datas.answer"></div>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
  </a-card>
</template>
<script>
import { message_get } from "@/services/infofilling";
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
      spinning: false,
      id: undefined,
      datas: {},
    };
  },
  created() {
    console.log("this.params", this.params);
    this.id = this.params.id;
    this.init();
  },
  methods: {
    init() {
      this.spinning = true;
      message_get({ id: this.id })
        .then((Response) => {
          console.log("Response", Response);
          this.datas = Response.data.data;
          this.spinning = false;
        })
        .catch((err) => {
          console.log("err", err);
          this.$message.error(err.Response.data.message);
        });
    },
    edit_bascinfo() {
      this.visble_bascinfo = false;
    },
    submitbasc() {
      var data = {
        theme: this.id,
        company: this.company,
        content: this.answerdata,
        comeform: "PC端",
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
    },
    back() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "proposal",
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
.htmls >>> img {
  max-width: 100%;
}
.describle >>> .ant-descriptions-item-label {
  font-size: 16px !important;
}
.describle >>> .ant-descriptions-item-content {
  font-size: 16px !important;
}
</style>