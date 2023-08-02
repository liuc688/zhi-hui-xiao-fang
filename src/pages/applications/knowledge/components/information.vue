<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <div class="title_back">
      <a @click="back()"><a-icon type="arrow-left" />返回</a>
    </div>
    <a-row style="padding: 10px 0px">
      <a-col :span="12" style="text-align: left">
         <!-- v-auth="`label.insert`" -->
        <a-button type="primary" @click="addOrder()">
          <a-icon type="plus" />
          <span>创建科目</span>
        </a-button>
      </a-col>
    </a-row>

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
    >
      <span slot="action" slot-scope="text, record">
        <a @click="edit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="deletes(record)">移除</a>
      </span>
      <span slot="titles" slot-scope="text, record">
        <a-tag :color="dynamicData.colors[record._index % 8]">{{
          record.title
        }}</a-tag>
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

    <a-modal
      title="科目新增"
      :visible="visible"
      :width="900"
      :maskClosable="false"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <k-form-build :value="channelForm" ref="channelForm" />
    </a-modal>
  </a-card>
</template>

<script>
// import { list, label_Insert, remove, label_save } from "@/services/order";
import {
  subjects_add,
  subjects_edit,
  subjects_delete,
  subjects_paginate,
} from "@/services/knowledge";
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
      id: "",
      visible: false,
      dataSource: {},
      channelForm: {},
      transitionobj: {},
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
        {
          title: "科目标题",
          dataIndex: "titles",
          align: "center",
          scopedSlots: { customRender: "titles" },
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
        colors: {
          0: "pink",
          1: "red",
          2: "orange",
          3: "geekblue",
          4: "green",
          5: "cyan",
          6: "blue",
          7: "purple",
        },
      };
      return result;
    },
  },
  created() {
    this.list();
    this.transitionobj = this.params;
  },

  methods: {
    // 页面获取
    list() {
      subjects_paginate({ base: this.params.mmm.data.id })
        .then((res) => {
          this.dataSource = res.data.data;
          this.total = res.data.total || res.data.length;
        })
        .catch((err) => {
          console.log(err);
        });
      form_get({ name: "new_subjects" })
        .then((response) => {
          this.channelForm = response.data.data.form;
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    addOrder(record) {
      this.visible = true;
      this.$nextTick(() => {
        this.mothed = subjects_add;
        this.id = undefined;
      });
    },
    handleOk() {
      this.$refs.channelForm.getData().then((data) => {
        this.mothed(
          Object.assign(data, { base: this.params.mmm.data.id, id: this.id })
        ).then((res) => {
          this.visible = false;
          this.$refs.channelForm.reset();
          this.list();
        });
      });
    },
    handleCancel() {
      this.visible = false;
      this.$refs.channelForm.reset();
    },
    edit(item) {
      this.visible = true;
      this.id = item.id;
      this.$nextTick(() => {
        this.mothed = subjects_edit;
        this.$refs.channelForm.setData({
          title: item.title,
          name: item.name,
        });
      });
    },
    deletes(item) {
      var that = this;
      this.$confirm({
        title: "您确定要删除此科目类别吗?",
        icon: "info-circle",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          var parems = {
            id: item.id,
          };
          subjects_delete(parems)
            .then(() => {
              that.$message.success("操作成功！");
              that.list();
            })
            .catch((err) => {
              console.log(err);
            });
        },
        onCancel() {},
      });
    },

    // 分页
    changepage(page, pageSize) {
      this.searchform.page = page;
      this.searchform.per_page = pageSize;
      this.list();
    },
    //返回
    back() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "info-details",
          params: this.params,
          transitioned: this.transitionobj,
        },
      });
    },
  },
};
</script>
<style >
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
a {
  color: #00bfff !important;
}
.model p {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
}
.model div {
  height: 600px;
  padding: 0 99px;
  overflow: auto;
}
.search {
  margin-bottom: 54px;
}
.fold {
  width: calc(100% - 216px);
  display: inline-block;
}
.operator {
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
.alert {
  margin-bottom: 16px;
  .message {
    a {
      font-weight: 600;
    }
  }
  .clear {
    float: right;
  }
}
.action_button:hover {
  color: #1890ff;
}
.table_content {
  margin: 20px 0;
}
.title_back {
  padding: 10px;
  background: #daedff;
  border: 1px solid #40a9ff;
  border-radius: 5px;
  margin-bottom: 20px;
}
</style>