<template>
  <div v-if="!record.options.hidden">
    <input
      :disabled="record.options.disabled"
      type="file"
      id="excel-file"
      @change="updateFile"
      accept=".xlsx, .xls"
    />
    <div class="datasource">
      <div v-for="(item, index) in arrays" :key="index">
        {{ item }}
      </div>
    </div>
    <!-- <a-upload
      list-type="picture"
      :action="action" :accept="accepts"
      :headers="headers"
      @change="upLoadChange"
    >
      <a-button> <a-icon type="upload" /> Upload </a-button>
    </a-upload> -->
  </div>
</template>
<script>
// import { FormUpload } from "@/services/api";
// import Cookie from "js-cookie";
export default {
  props: {
    value: {
      type: Object,
      default: () => {
        return {};
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
  // computed: {
  //   headers() {
  //     return {
  //       Authorization: Cookie.get("Authorization"),
  //     };
  //   },
  // },
  data() {
    return {
      // action: FormUpload,
      arrays: [],
      // accepts: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel",
      size: 300,
    };
  },
  methods: {
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
              console.log("res", res);
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
          that.$message.error("请选择300k以下的文件");
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
          console.log("e", e);
          try {
            const data = e.target.result; // 获取的数据
            const workBook = XLSX.read(data, { type: "binary" }); // data转xlsx数据对象
            let sheetNames = workBook.SheetNames || [];
            let sheetDatas = workBook.Sheets || [];
            let datas = sheetDatas[sheetNames[0]];
            console.log("datas,", datas);
            let result = XLSX.utils.sheet_to_json(datas, {
              range: 0,
              defval: " ",
            }); // range: 2代表从第几行开始读取，defval是为空属性设置默认值
            resolve(result);
          } catch (error) {
            reject(error);
            Toast(error);
          }
        };
        fileReader.readAsBinaryString(file);
      });
    },
    //
    upLoadChange(info) {
      if (info.file.status === "done") {
        console.log("info", info);
        var data = info.fileList;
        var arrys = [];
        for (let index = 0; index < data.length; index++) {
          arrys.push({
            name: data[index].name,
            status: data[index].status,
            type: data[index].type,
            uid: data[index].uid,
            url: data[index].response.data.url,
          });
        }
        console.log("arrys", arrys);
        this.arrays = arrys;

        let file = info.file.originFileObj;
        if (file && file.name.match(/xls|xlsx/)) {
          console.log("file", file);
          this.xlsxToJson(file)
            .then((res) => {
              console.log("res", res);
              this.arrays = res;
            })
            .catch((error) => {
              console.log("error", error);
              this.$message.error("数据获取失败!");
            })
            .finally(() => {
              // e.target.value = "";
            });
        } else {
          this.$message.error("请选择正确的模板!");
          return;
        }
      }
    },
  },
};
</script>
<style scoped>
.datasource {
  max-height: 200px;
  overflow: auto;
}
</style>
