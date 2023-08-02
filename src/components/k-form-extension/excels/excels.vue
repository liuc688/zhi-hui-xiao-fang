<template>
  <div v-if="!record.options.hidden">
    <!-- <a-button @click="onTest()" :disabled="record.options.disabled">文件上传</a-button> -->
    <a-input
      :disabled="record.options.disabled"
      type="file"
      id="excel-file"
      class="excels"
      @change="updateFile"
      accept=".xlsx, .xls"
    ></a-input>
    <!-- <input
      :disabled="record.options.disabled"
      type="file" class="inpuste"
      id="excel-file"
      @change="updateFile"
      accept=".xlsx, .xls"
    /> -->
    <a-alert type="warning">
      <span slot="message">
        文件大小：小于{{ size }} k ， 文件格式：.xlsx/ .xls ，
        文件行数：小于1000行 ， 文件列数：小于20列， 文件首行：必须是表头
      </span>
    </a-alert>
    <div style="width: 100%">
      <a-table
        rowKey="index"
        :columns="columns"
        :data-source="arrays"
        :pagination="{ pageSize: 5 }"
        :scroll="{ x: 'calc(1000px + 50%)' }"
      >
      </a-table>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => {
        return [];
      },
    },
    record: {
      type: Object,
      required: true,
    },
    formConfig: {
      type: Object,
      required: false,
    },
    dynamicData: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    arrays: {
      get() {
        return this.value || this.arrays;
      },
      set(value) {
        this.$emit("change", value);
      },
    },
  },
  data() {
    return {
      size: 300,
      columns: [],
    };
  },
  methods: {
    onTest() {
      this.updateFile();
      // console.log(this.$el);
      // var input = document.createElement("input")
      // input.type="file"
      // input.id="excel-file"
      // input.accept=".xlsx, .xls"
      // this.$el.appendChild(input);
      // input.onchange = this.updateFile
    },
    change(value) {
      this.$emit("update:value", value);
    },
    updateFile(e) {
      let that = this;
      this.cardList = [];
      let files = e.target.files || [];
      let file;
      if (files.length > 0) {
        file = files[0];
      } else {
        this.$message.error("请选择导入内容!");
        return;
      }
      if (file && file.name.match(/xls|xlsx/)) {
        var sizes = file.size / 1024 < that.size;
        if (sizes) {
          that
            .xlsxToJson(file)
            .then((res) => {
              that.columns = [];
              for (var key in res[0]) {
                that.columns.push({
                  title: key,
                  dataIndex: key,
                  align: "center",
                  with: "200",
                  ellipsis: true,
                });
              }
              that.arrays = res;
            })
            .catch((error) => {
              console.log("error", error);
              that.$message.error("数据获取失败!");
            })
            .finally(() => {
              // this.$message.error("数据获取失败!");
            });
        } else {
          that.$message.error("请选择" + that.size + "k以下的文件");
        }
      } else {
        that.$message.error("请选择正确的模板!");
        return;
      }
    },

    // 表格文件转json
    xlsxToJson(file) {
      return new Promise((resolve, reject) => {
        const XLSX = require("xlsx");
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          try {
            const data = e.target.result; // 获取的数据
            const workBook = XLSX.read(data, { type: "binary" }); // data转xlsx数据对象
            let sheetNames = workBook.SheetNames || [];
            let sheetDatas = workBook.Sheets || [];
            let datas = sheetDatas[sheetNames[0]];
            var words = datas["!ref"]
              .substring(datas["!ref"].indexOf(":") + 1)
              .substring(0, 1);
            if (words >= "T") {
              datas["!ref"] = "A1:T1001";
            } else {
              datas["!ref"] = "A1:" + words + "1001";
            }
            let result = XLSX.utils.sheet_to_json(datas, {
              range: 0,
              defval: " ",
            }); // range: 0代表从第几行开始读取，defval是为空属性设置默认值
            resolve(result);
          } catch (error) {
            reject(error);
            this.$message.error("数据获取失败!");
          }
        };
        fileReader.readAsBinaryString(file);
      });
    },
  },
};
</script>
<style scoped>
.datasource {
  max-height: 200px;
  overflow: auto;
}
#excel-file {
  margin: 5px 0;
  border: none;
  outline: none;
  box-shadow:none
}
#excel-file:hover {
  border: none;
  outline: none;
}
</style>
