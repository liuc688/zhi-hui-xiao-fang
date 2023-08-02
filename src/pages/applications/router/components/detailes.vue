<template>
  <div>
    <a-spin :spinning="spinning" tip="Loading...">
      <a-card :key="data.id" style="border-top: 0px; border-bottom: 0px">
        <a-back-top />
        <h2 slot="title">{{ data.title || params.route.key }}</h2>
        <h3>认证标识：v-auth="`{{ params.route.key }}`"</h3>
        <a-button
          type="link"
          icon="edit"
          slot="extra"
          v-if="data.document"
          @click="onEditRouteInfo(params)"
          >编辑</a-button
        >
        <div>
          <a-empty v-if="!data.document">
            <div slot="description">
              <div>无描述信息</div>
              <a-button @click="OnAddRouteInfo(params)">点击添加</a-button>
            </div>
          </a-empty>
          <div v-else>
            <mark-down-editor
              v-model="data.document"
              :readonly="true"
            ></mark-down-editor>
          </div>
        </div>
      </a-card>
    </a-spin>
    <!-- 弹窗 -->
    <a-modal
      v-model="visible"
      :title="title"
      ok-text="确认"
      cancel-text="取消"
      @ok="onOk"
      @cancel="
        () => {
          this.visible = false;
          this.$refs.form.reset();
        }
      "
      centered
      width="75%"
      :confirmLoading="okloading"
      :z-index="1002"
    >
      <k-form-build :value="jsonData" ref="form" :dynamicData="dynamicData" />
    </a-modal>
  </div>
</template>

<script>
import MarkDownEditor from "@/components/MarkDownEditor";
import { routeinfo_edit, routeinfo_get } from "@/services/routes";
import { form_get } from "@/services/forms";
export default {
  namm: "detailes",
  components: { MarkDownEditor },
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
      item: {},
      visible: false,
      title: null,
      okloading: false,
      jsonData: {},
      dynamicData: {
        config: {},
      },
      data: {},
      commit: null,
      currendParent: null,
      spinning: true,
    };
  },
  watch: {
    params: {
      handler(value) {
        if (value) {
          this.init();
        }
      },
      deep: true,
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.spinning = true;
      Promise.all([
        routeinfo_get({ id: this.params.id }),
        form_get({ name: "router_info" }),
      ])
        .then((res) => {
          this.data = res[0].data.data;
          this.jsonData = res[1].data.data.form;
          this.spinning = false;
        })
        .catch((err) => {
        });
    },
    // 表单回显
    setData() {
      let formData = {};
      for (let key in this.$refs.form.form.formItems) {
        formData[key] = this.currentRoute[key];
      }
      this.$refs.form.setData(formData);
    },
    OnAddRouteInfo(record) {
      this.visible = true;
      this.currendId = record.id;
      this.currendParent = record.parent;
      this.commit = routeinfo_edit;
    },
    onEditRouteInfo(params) {
      this.visible = true;
      routeinfo_get({ id: params.id }).then((res) => {
        this.currendId = res.data.data.id;
        this.currendParent = params.parent;
        this.currentRoute = res.data.data;
        this.$nextTick(() => {
          this.$refs.form.reset();
          this.commit = routeinfo_edit;
          this.setData();
        });
      });
    },
    onOk() {
      this.$nextTick(() => {
        this.$refs.form
          .getData()
          .then((formData) => {
            this.okloading = true;
            if (this.currendId) {
              formData.id = this.currendId;
            }
            if (this.currendParent) {
              formData.parent = this.currendParent;
            }
            this.commit(formData)
              .then(() => {
                this.visible = false;
                this.okloading = false;
                this.$refs.form.reset();
                this.init();
                this.onRefresh();
              })
              .catch((error) => {
                console.log(error);
                this.okloading = false;
              });
          })
          .catch((error) => {
            console.log(error);
          });
      });
    },
    onRefresh() {
      this.$emit("event", {
        method: "refrsh",
        params: this.params,
      });
    },
  },
};
</script>
