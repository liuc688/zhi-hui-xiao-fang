<template>
  <a-card>
    <div>
      <a-page-header @back="onBack">
        <span slot="title">
          <a @click="onBack" style="color:#000000;">返回</a>
        </span>
      </a-page-header>
    </div>
    <a-form-item label="列表字段">
      <a-select
        style="width: 100%"
        mode="multiple"
        v-model="currTableFields"
        :labelInValue="true"
        allowClear
      >
        <template v-for="item in tableFields">
          <a-select-option :key="item.key">
            {{ item.label }}
          </a-select-option>
        </template>
      </a-select>
    </a-form-item>
    <a-form-item label="统计字段">
      <a-select
        style="width: 100%"
        mode="multiple"
        v-model="currGroupFields"
        :labelInValue="true"
        allowClear
      >
        <template v-for="item in groupFields">
          <a-select-option :key="item.key">
            {{ item.label }}
          </a-select-option>
        </template>
      </a-select>
    </a-form-item>
    <k-form-design
      title="表单编辑"
      :toolbarsTop="false"
      :showToolbarsText="true"
      :value="jsonData"
      ref="formdesign"
      :fields="fields"
      :toolbars="[
        'preview',
        'save',
        'importJson',
        'exportJson',
        'exportCode',
        'reset',
      ]"
      :showHead="false"
      @save="onSubmit"
    >
    </k-form-design>
  </a-card>
</template>

<script>
import { table_form, table_form_get } from "@/services/table";
export default {
  components: {},
  props: {
    params: {
      //传递的数据
      type: Object,
    },
    event: {
      type: Function,
    },
    crumbs: {
      type: Array,
    },
  },
  data() {
    return {
      fields: [
        "input",
        "textarea",
        "number",
        "select",
        "checkbox",
        "radio",
        "date",
        "time",
        "rate",
        "slider",
        "uploadFile",
        "uploadImg",
        "cascader",
        "treeSelect",
        "batch",
        "selectInputList",
        "editor",
        "switch",
        "button",
        "alert",
        "text",
        "html",
        "divider",
        "card",
        "tabs",
        "grid",
        "table",
      ],
      fieldTypes: [
        "input",
        "textarea",
        "number",
        "select",
        "radio",
        "date",
        "time",
        "rate",
        "slider",
      ],
      groupFieldTypes: ["number"],
      jsonData: {
        list: [],
        config: {
          layout: "vertical",
          labelCol: {
            xs: 4,
            sm: 4,
            md: 4,
            lg: 4,
            xl: 4,
            xxl: 4,
          },
          labelWidth: 100,
          labelLayout: "flex",
          wrapperCol: {
            xs: 18,
            sm: 18,
            md: 18,
            lg: 18,
            xl: 18,
            xxl: 18,
          },
          hideRequiredMark: false,
          customStyle: "",
        },
      },
      tableFields: [],
      currTableFields: [],
      groupFields: [],
      currGroupFields: [],
    };
  },
  watch: {
    jsonData: {
      handler() {
        this.$nextTick(() => {
          if (this.$refs.formdesign) {
            const fields = this.$refs.formdesign.getFieldSchema();
            const ofields = this.tableFields;
            const nfields = fields
              .filter((item) => {
                return this.fieldTypes.includes(item.type);
              })
              .map((item) => {
                return {
                  label: item.label,
                  key: item.model,
                };
              });
            if (ofields.length > nfields.length) {
              const field = ofields.find((item) => {
                return !nfields.map((x) => x.key).includes(item.key);
              });
              const cfield = this.currTableFields.find((temp) => {
                return temp.key == field.key;
              });
              if (cfield) {
                this.currTableFields = [
                  ...this.currTableFields.filter((x) => x.key != cfield.key),
                ];
              }
            }
            this.tableFields = nfields;
            const ogrpup = this.groupFields;
            const ngroup = fields
              .filter((item) => {
                return this.groupFieldTypes.includes(item.type);
              })
              .map((item) => {
                return {
                  label: item.label,
                  key: item.model,
                };
              });
            if (ogrpup.length > ngroup.length) {
              const group = ogrpup.find((item) => {
                return !ngroup.map((x) => x.key).includes(item.key);
              });
              const cgroup = this.currGroupFields.find((temp) => {
                return temp.key == group.key;
              });
              if (cgroup) {
                this.currGroupFields = [
                  ...this.currGroupFields.filter((x) => x.key != cgroup.key),
                ];
              }
            }
            this.groupFields = ngroup;
          }
        });
      },
      deep: true,
    },
  },
  mounted() {},
  created() {
    this.onLoad();
  },
  methods: {
    onLoad() {
      table_form_get({
        parent: this.params.id,
      })
        .then((response) => {
          this.$nextTick(() => {
            if (response.data.data) {
              this.jsonData = response.data.data.form;
              this.$refs.formdesign.handleSetData(this.jsonData);
              this.currTableFields = response.data.data.fields;
              this.currGroupFields = response.data.data.groups;
            } else {
              this.$refs.formdesign.handleSetData(this.jsonData);
            }
          });
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    //   保存
    onSubmit(jsonString) {
      const form = JSON.parse(jsonString);
      table_form({
        parent: this.params.id,
        form: form,
        fields: this.currTableFields,
        groups: this.currGroupFields,
      })
        .then((response) => {
          this.$message.success(response.data.message);
          this.onBack();
        })
        .catch((error) => {
          this.$message.error(error.response.data.message);
        });
    },
    onBack() {
      const last = this.crumbs.pop();
      console.log('last',last);
      
      this.$emit("event", {
        method: "onLink",
        params: {
          route: last.route,
          params: last.params,
          crumbs: this.crumbs || [],
        },
      });
    },
  },
};
</script>
