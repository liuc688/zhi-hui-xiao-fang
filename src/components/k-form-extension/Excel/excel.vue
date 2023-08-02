<template>
  <div>
    <a-table bordered :data-source="dataSource" :columns="columns">
      <template v-for="item in columns" :slot="item.dataIndex" slot-scope="text, record">
        <editable-cell :text="text" @change="onCellChange(record.key, item.dataIndex, $event)" :key="item.dataIndex" />
      </template>
    </a-table>
    <a-button type="dashed" @click="addKeys">
      <a-icon type="plus" />
    </a-button>
     <a-upload :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload">
      <a-button> <a-icon type="upload" /> excel上传 </a-button>
    </a-upload>
  </div>
</template>

<script>
const EditableCell = {
  template: `
      <div class="editable-cell">
        <div v-if="editable" class="editable-cell-input-wrapper">
          <a-input :value="value" @change="handleChange" @pressEnter="check" /><a-icon
            type="check"
            class="editable-cell-icon-check"
            @click="check"
          />
        </div>
        <div v-else class="editable-cell-text-wrapper">
          {{ value || ' ' }}
          <a-icon type="edit" class="editable-cell-icon" @click="edit" />
        </div>
      </div>
    `,
  props: {
    text: String,
  },
  data() {
    return {
      value: this.text,
      editable: false,
    };
  },
  methods: {
    handleChange(e) {
      const value = e.target.value;
      this.value = value;
    },
    check() {
      this.editable = false;
      this.$emit('change', this.value);
    },
    edit() {
      this.editable = true;
    },
  },
};
import * as XLSX from "xlsx";
export default {
  name: "excel",
  components: {
    EditableCell
  },
  props: {
    value: {
      type: Object
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
    config() {
      return this.dynamicData.config || {};
    },
  },
  watch: {
    value: {
      handler(value) {
        if (value) {
          this.dataSource = value.dataSource
          this.columns = value.columns
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      fileList: [],
      dataSource: [
        // {
        //   key: 1,
        //   A: 'Edward King 0',
        //   B: '32',
        //   C: 'London, Park Lane no. 0',
        // }, {
        //   key: 2,
        //   A: 'Edward King 0',
        //   B: '32',
        //   C: 'London, Park Lane no. 0',
        // }
      ],
      columns: [
        {
          title: "A",
          dataIndex: "A",
          key: "A",
          scopedSlots: { customRender: 'A' }
        },
        {
          title: "B",
          dataIndex: "B",
          key: "B",
          scopedSlots: { customRender: 'B' }
        },
        {
          title: "C",
          dataIndex: "C",
          key: "C",
          scopedSlots: { customRender: 'C' }
        },
      ],
    };
  },
  created() {
    var that = this;
    that.$emit("change", { dataSource: that.dataSource, columns: that.columns });
  },
  methods: {
    tableDataInit() {
      const that = this;
      const initColumnsArr = [
        {
          title: "A",
          dataIndex: "A",
          key: "A",
          scopedSlots: { customRender: 'A' }
        },
        {
          title: "B",
          dataIndex: "B",
          key: "B",
          scopedSlots: { customRender: 'B' }
        },
        {
          title: "C",
          dataIndex: "C",
          key: "C",
          scopedSlots: { customRender: 'C' }
        },
      ];
      that.dataSource = [];
      that.columns = initColumnsArr;
    },
    handleRemove(file) {
      const that = this;
      const index = that.fileList.indexOf(file);
      const newFileList = that.fileList.slice();
      newFileList.splice(index, 1);
      that.fileList = newFileList;
      that.tableDataInit();
    },
    beforeUpload(file) {
      const that = this;
      that.fileList = [file];
      const fileReader = new FileReader();
      fileReader.onload = ev => {
        try {
          const fileData = ev.target.result,
            tableLen = that.columns.length,
            workbook = XLSX.read(fileData, {
              type: 'binary'
            }),
            wsname = workbook.SheetNames[0], // 取第一张表
            headerData = XLSX.utils.sheet_to_json(workbook.Sheets[wsname], { header: 1 }), //取表头数据
            headerData2 = headerData[0].slice(0, tableLen);
          that.columns = [];
          that.dataSource = [];
          var tableColumns = {};
          for (let i = 0; i < headerData2.length; i++) {
            tableColumns = {};
            tableColumns['title'] = headerData2[i];
            tableColumns['dataIndex'] = that.convertToTitle(i+1);
            tableColumns['scopedSlots'] = { customRender: that.convertToTitle(i+1) };
            that.columns.push(tableColumns)
          }
          var items = {};
          var itemsKey = 0;
          for (let i = 1; i < headerData.length; i++) {
            items = {};
            itemsKey++;
            items['key'] = itemsKey;
            for (var j in headerData[0]) {
              items[that.convertToTitle(parseInt(j)+1)] = headerData[i][j] || '';
            }

            that.dataSource.push(items)
          }
          that.$emit("change", { dataSource: that.dataSource, columns: that.columns });
        } catch (e) {
          console.log("error:" + e);
        }

      };
      fileReader.readAsBinaryString(file);
      return false;
    },
    convertToTitle(columnNumber) {
      // 构建字典，便于查询
      const num_set = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
      // 存放结果
      let result = [];
      // 初始化数据
      let num = columnNumber;
      let index;
      // 循环判断，并在结果列前插入，直到小于等于26再退出循环
      while (num > 26) {
        index = num % 26;
        num = Math.floor(num / 26);
        if (index === 0) {
          result.unshift(num_set[25]);
          num = num - 1;
        } else {
          result.unshift(num_set[index - 1]);
        }
      }
      // 将最后一个值插入
      result.unshift(num_set[num - 1]);
      // 输出字符串结果
      return result.join("");
    },
    addKeys() {
      var that = this;
      that.columns.push({
        title: that.convertToTitle(that.columns.length + 1),
        dataIndex: that.convertToTitle(that.columns.length + 1),
        key: that.convertToTitle(that.columns.length + 1),
      })
    },
    onCellChange(key, dataIndex, value) {
      const dataSource = [...this.dataSource];
      const target = dataSource.find(item => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.dataSource = dataSource;
      }
    },
  },
};
</script>
<style>
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}
