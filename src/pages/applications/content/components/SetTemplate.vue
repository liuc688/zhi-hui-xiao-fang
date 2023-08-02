<template>
  <a-card
    :body-style="{ padding: '24px 32px', maxHeight: '80vh' }"
    :bordered="false"
  >
    <a-spin tip="Loading..." :spinning="loading">
      <a-page-header
        style="
          border-bottom: 1px solid #ccc;
          margin-bottom: 10px;
          padding-bottom: 10px;
        "
        @back="back"
      >
        <template slot="title">
          <a-button @click="back"><span>返回</span></a-button>
        </template>
      </a-page-header>
      <a-form-model
        :model="form"
        ref="ruleForm"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="唯一ID" prop="id">
          <a-input v-model="form.id" :disabled="true" />
        </a-form-model-item>

        <a-form-model-item label="目录模版">
          <a-select v-model="form.index" placeholder="请选择目录模版" allowClear show-search :filter-option="filterOption">
            <a-select-option
              v-for="item in templates"
              :key="item.id"
              :value="item.id"
              :title="item.title"
            >
              <span style="margin-right: 3px">{{ item.title }}</span>
              <a-tag v-if="item.ishare" color="cyan">享</a-tag>
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="文档模板">
          <a-select v-model="form.document" placeholder="请选择文档模板" allowClear show-search :filter-option="filterOption">
            <a-select-option
              v-for="item in templates"
              :key="item.id"
              :value="item.id"
              :title="item.title"
            >
              <span style="margin-right: 3px">{{ item.title }}</span>
              <a-tag v-if="item.ishare" color="cyan">享</a-tag>
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>

      <div style="text-align: right">
        <a-button type="primary" @click="submint">保存</a-button>
      </div>
    </a-spin>
  </a-card>
</template>
<script>
import { template_list } from "@/services/templates";
import { channel_get, channel_template } from "@/services/content";

export default {
  name: "mountforms",
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
  watch: {
    params(val) {
      this.loading = true;
      this.getcontent();
    },
  },
  data() {
    return {
      form: {},
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      templates: [],
      loading: true,
      rules: {
        id: [
          {
            required: true,
            message: "Please input Activity name",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      template_list({ id: this.params.site })
        .then((res) => {
          this.templates = res.data.data;
          console.log('this.templates ',this.templates)
          this.getcontent();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getcontent() {
      channel_get({ id: this.params.id })
        .then((res) => {
          var datas = {
            id: res.data.data.id,
            index: res.data.data.template ? res.data.data.template.index : undefined,
            document: res.data.data.template ? res.data.data.template.document : undefined,
          };
          console.log('datas', datas)
          this.form = datas;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submint() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          var datas = {
            id: this.form.id,
            template: {
              index: this.form.index,
              document: this.form.document,
            },
          };
          channel_template(datas)
            .then((response) => {
              this.loading = false;
              this.$message.success(response.data.message);
              this.back();
            })
            .catch((err) => {
              this.$message.error(err);
              this.loading = false;
            });
        }
      });
    },
    back() {
      this.$emit("event", {
        method: "treeSelect",
        params: [this.params.id],
      });
    },
    filterOption(input, option) {
      return (
        option.componentOptions.propsData.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
  },
};
</script>