<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <a-spin tip="获取当前站点下目录列表..." :spinning="spinning">
      <div class="title_back">
        <a @click="back"><a-icon type="arrow-left" />返回</a>
      </div>
      <!-- 
      <div style="width: 100%; text-align: right; padding: 20px">
        <a-button type="primary" @click="saveopinion"> 保存</a-button>
      </div> 
      -->
      <div style="margin:20px 10px;border:1px solid #ccc;border-radius:6px">
        <div style="width:800px;margin:10px auto;padding:30px 40px;">
          <k-form-build :value="jsonData" :dynamicData="dynamicData" ref="forms" />
        </div>
      </div>
      <div style="width: 100%; text-align: right; padding: 10px">
        <a-button type="primary" @click="saveopinion"> 保存</a-button>
      </div>
    </a-spin>
  </a-card>
</template>
<script>
import { form_get } from "@/services/forms";
import {
  draft_get,
  draft_update,
  draft_add,
  organization_tree,
} from "@/services/opinion";
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
      jsonData: {},
      sitelists: [],
      mesthods: null,
      opinionid: undefined,
      spinning: true,
      channellist: [],
      moldData: {},
      mold: false,
    };
  },
  created() {
    this.init();
  },
  authorize: {
    // addadvice: "opinion.add",
    // remove: "opinion.remove",
    // check: "opinion.check",
  },
  computed: {
    dynamicData() {
      let result = {
        sitelist: this.sitelists,
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
  methods: {
    init() {
      Promise.all([organization_tree(), form_get({ name: "edit_opinion" })])
        .then((Response) => {
          this.sitelists = Response[0].data.data;
          this.jsonData = Response[1].data.data.form;
          if (this.params.data) {
            this.opinionid = this.params.data.id;
            this.mesthods = draft_update;
            this.getOpinion();
          } else {
            this.mesthods = draft_add;
            this.opinionid = undefined;
            this.spinning = false;
            this.$nextTick(() => {
              this.$refs.forms.setData({
                site: this.params.id || '',
              });
            })
          }
        })
        .catch((error) => {
          console.log("erroe", error);
          this.spinning = false;
        });
    },
    // 获取详情
    getOpinion() {
      draft_get({ id: this.opinionid })
        .then((res) => {
          var data = res.data.data;
          this.spinning = false;
          this.$nextTick(() => {
            this.$refs.forms.setData({
              site: data.site,
              title: data.title,
              range: [data.start, data.end],
              // affiche: data.affiche,
              // content: data.content,
              // basic: data.basic,
            });
          });
        })
        .catch((err) => {
          this.spinning = false;
          this.$message.error(err.$message);
        });
    },
    // 保存
    saveopinion() {
      this.$refs.forms
        .getData()
        .then((res) => {
          var datas = Object.assign({}, res, {
            id: this.opinionid,
            start: res.range[0],
            end: res.range[1],
          });
          this.mesthods(datas)
            .then((response) => {
              this.spinning = false;
              this.$message.success("操作成功！");
              if (response.data.data) this.back();
            })
            .catch((err) => {
              this.spinning = false;
              console.log("err", err);
            });
        })
        .catch((err) => {
          console.log(err);
          for (let i in err) {
            this.$message.warning(err[i].errors[0].message);
          }
        });
    },
    // 返回
    back() {
      this.$emit("event", {
        method: "onLink",
        params: {
          id: this.params.id ? this.params.id : "",
          route: "home",
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
</style>