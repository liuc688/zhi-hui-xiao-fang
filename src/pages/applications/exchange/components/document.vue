<template>
  <div
    style="
      padding: 20px;
      min-height: 100%;
      background: white;
      padding: 50px 10%;
    "
  >
    <a-spin tip="Loading..." :spinning="loading">
      <a-alert type="info" show-icon>
        <span slot="message"><a @click="backs">返回</a></span>
      </a-alert>
      <div style="width: 100%;padding-top:30px">
        <k-form-build :value="jsonData" ref="replyform" />
      </div>
      <div style="text-align: right; padding: 30px ">
        <a-button type="primary" @click="subment">保存</a-button>
      </div>
    </a-spin>
  </div>
</template>
<script>
import {
  good_insert,
  good_edit,
  good_get,
} from "@/services/goods";
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
      loading: true,
      jsonData: {},
      methodes: undefined,
      id: "",
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      form_get({ name: "volunteer_spdh" }).then((res) => {
        this.jsonData = res.data.data.form;
        this.loading = false;
        this.getDocument();
      });
    },
    getDocument() {
      if (this.params.id) {
        good_get({ id: this.params.id })
          .then((res) => {
            this.$nextTick(() => {
              this.$refs.replyform.setData({
                title: res.data.data.title,
                number: res.data.data.number,
                value: res.data.data.value,
                logo: res.data.data.logo,
                content: res.data.data.content,
              });
              this.id = res.data.data.id;
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.id = "";
        this.$refs.replyform.reset();
      }
    },
    subment() {
      this.$refs.replyform
        .getData()
        .then((res) => {
          if (this.params.id) {
            this.methodes = good_edit;
            this.id = this.params.id;
          } else {
            this.methodes = good_insert;
            this.id = undefined;
          }
          this.methodes(Object.assign({ id: this.id }, res))
            .then(() => {
              this.backs();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
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