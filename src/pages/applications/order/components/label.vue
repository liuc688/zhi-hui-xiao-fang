<template>
  <div style="height: 90vh; background: #f1f1f1">
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-row style="padding: 10px 0px">
        <a-col :span="12" style="text-align: left">
          <a-button type="primary" @click="addOrder()" v-auth="`label.insert`">
            <a-icon type="plus" />
            <span>创建标签</span>
          </a-button>
        </a-col>
      </a-row>
      <div class="alert">
        <a-alert type="info" :show-icon="true">
          <div class="message" slot="message">
            已选择&nbsp;
            <a>{{ selectedRowKeys.length }}</a>
            &nbsp;项
            <div class="clear" v-if="this.selectedRowKeys.length > 0">
              <a @click="onSelectClear">清空</a>
              <!-- <a-divider type="vertical" />
              <a @click="remove()">移除</a> -->
            </div>
          </div>
        </a-alert>
      </div>
      <!-- 表格 -->
      <a-table
        ref="table"
        bordered
        class="table_content"
        size="middle"
        :loading="searchloading"
        rowKey="id"
        :pagination="false"
        :columns="columns"
        :dataSource="dataSource.items"
        @selectedRowChange="onSelectChange"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
      >
        <!-- <span slot="name" slot-scope="text, record">
          <a @click="addOrder(record)">{{ record.name }}</a>
        </span> -->
        <span slot="action" slot-scope="text, record">
          <a @click="addOrder(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="你确定要删除此标签吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="confirmOk(record)"
            @cancel="cancel"
            v-auth="`label.remove`"
          >
            <a>移除</a>
          </a-popconfirm>
        </span>
        <span slot="keywords" slot-scope="record">
          <span v-for="(item, index) in record" :key="index">
            <a-tag>{{ item }}</a-tag>
          </span>
        </span>
        <span slot="color" slot-scope="text, record">
          <a-tag :color="record.color">{{ record.name }}</a-tag>
        </span>
      </a-table>
      <a-pagination
        size="small"
        style="text-align: right"
        @change="changepage"
        v-model="current"
        @showSizeChange="changepage"
        :pageSizeOptions="pageSizeOptions"
        :total="dataSource.total"
        show-size-changer
        show-quick-jumper
        :show-total="(total) => `共 ${total} 条`"
      ></a-pagination>
    </a-card>
    <a-modal
      title="标签增编"
      width="30%"
      :confirm-loading="subloading"
      :visible="orderedit"
      @ok="onEditSubmit()"
      @cancel="
        () => {
          this.$refs.keyforms.resetFields();
          orderedit = false;
        }
      "
    >
      <a-form-model ref="keyforms" :model="keyforms" :rules="rules">
        <!-- 名称 -->
        <a-form-model-item
          label="标签名称"
          prop="name"
          :labelCol="{ span: 4 }"
          :wrapperCol="{ span: 18 }"
        >
          <a-input
            placeholder="请输入标签名称"
            style="width: 100%"
            v-model="keyforms.name"
          >
          </a-input>
        </a-form-model-item>
        <!-- 字体颜色 -->
        <a-form-model-item
          label="颜色"
          :labelCol="{ span: 4 }"
          :wrapperCol="{ span: 18 }"
        >
          <a-input v-model="keyforms.color"> </a-input>
          <colorPicker
            v-model="keyforms.color"
            class="color_style"
          ></colorPicker>
        </a-form-model-item>
        <a-form-model-item
          label="标签样式"
          :labelCol="{ span: 4 }"
          :wrapperCol="{ span: 18 }"
        >
          <div style="text-align: center">
            <a-tag :color="keyforms.color">{{ keyforms.name }}</a-tag>
          </div>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { list, label_Insert, remove, label_save } from "@/services/order";
export default {
  data() {
    return {
      dataSource: {},
      selectedRowKeys: [], //选中数组
      pageSizeOptions: ["10", "20", "30", "40"],
      page: 1,
      per_page: 10,
      total: 0,
      searchform: {
        page: 1,
        per_page: 10,
      },
      current: 1,
      searchloading: false, //表格加载
      subloading: false,
      orderedit: false,
      columns: [
        // {
        //   title: "标签标题",
        //   dataIndex: "name",
        //   scopedSlots: { customRender: "name" },
        // },
        {
          title: "标签",
          dataIndex: "color",
          align: "center",
          scopedSlots: { customRender: "color" },
        },
        {
          title: "创建时间",
          align: "center",
          dataIndex: "_createtime",
          scopedSlots: { customRender: "_createtime" },
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
      rules: {
        color: [{ required: true, message: "请输入图标颜色" }],
        name: [{ required: true, message: "请输入标签名称" }],
      },
      keyforms: {
        name: "",
        color: "",
      },
      tubId: "",
      iconlist: ["bug", "alert", "frown"],
      methods: label_save,
    };
  },
  computed: {
    dynamicData() {
      let result = {
        modalList: [],
        departments: [],
        labellist: [],
        scope: {
          1: "今天",
          2: "本周",
          3: "上周",
          4: "本月",
          5: "上月",
        },
        status: {
          0: "关闭",
          10: "已处理",
          15: "待转发",
          25: "待处理",
          40: "处理中",
        },
      };
      // for (let item in this.datapart) {
      //   result.departments.push({
      //     value: this.datapart[item].id,
      //     label: this.datapart[item].name,
      //   });
      // }
      // for (let item in this.labellists) {
      //   result.labellist.push({
      //     value: this.labellists[item].id,
      //     label: this.labellists[item].name,
      //   });
      // }
      return result;
    }
  },
  created() {
    this.list();
  },
  authorize: {
    addOrder: "label.insert",
    confirmOk: "label.remove",
  },
  methods: {
    // 页面获取
    list() {
      list({
        page: this.page,
        per_page: this.per_page,
        ...this.searchform
      })
        .then((res) => {
          this.dataSource = res.data.data;
          this.total = res.data.total || res.data.length;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    confirmOk(record) {
      remove({
        id: record.id,
      })
        .then(() => {
          this.list();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    cancel() {},

    addOrder(record) {
      this.orderedit = true;
      if (record) {
        this.tubId = record.id;
        this.methods = label_save;
        this.$nextTick(() => {
          this.keyforms.name = record.name;
          this.keyforms.color = record.color;
        });
      } else {
        this.tubId = undefined;
        this.methods = label_Insert;
        this.$nextTick(() => {
          this.keyforms.name = "";
          this.keyforms.color = "#000000";
        });
      }
    },
    onEditSubmit() {
      this.$refs.keyforms.validate((valid) => {
        if (valid) {
          this.subloading = true;
          this.keyforms.id = this.tubId;
          this.methods({
            id: this.tubId,
            name: this.keyforms.name,
            color: this.keyforms.color,
          })
            .then((res) => {
              console.log(res);
              this.orderedit = false;
              this.subloading = false;
              this.$message.success("操作成功!");
              this.list();
            })
            .catch(() => {
              this.subloading = false;
              this.$message.fail("操作失败!");
            });
        }
      });
    },
    // 选中清空
    onSelectClear() {
      this.selectedRowKeys = [];
    },
    // 选中项
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 分页
    changepage(page, pageSize) {
      this.searchform.page = page;
      this.searchform.per_page = pageSize;
      this.list();
    },
  },
};
</script>
<style>
.ant-table table {
  border-collapse: collapse;
  border-spacing: 0;
}
.ant-table-thead > tr > th,
.ant-table-tbody > tr > td {
  border-left: 1px solid #f0f0f0;
  border-top: 1px solid #f0f0f0;
}
</style>
<style scoped>
.alert {
  margin-bottom: 16px;
}
.alert .message a {
  font-weight: 600;
}
.alert .clear {
  float: right;
}
.table_content {
  margin: 20px 0;
}
.demo-loading {
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
}
/* 颜色选择器样式 */
.color_style {
  position: absolute;
  top: 0px;
  right: 10px;
  border: outset;
}
</style>
