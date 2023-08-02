<template>
  <div>
    <a-button
      type="primary"
      style="margin: 20px 0"
      v-auth="`mold.add`"
      @click="addmold()"
    >
      <a-icon type="plus" />新增</a-button
    >
    <a-table
      ref="table"
      bordered
      class="table_content"
      size="middle"
      :loading="searchloading"
      rowKey="_id"
      :pagination="false"
      :columns="columns"
      :dataSource="dataSource.items"
    >
      <span slot="read" slot-scope="text">
        {{ text ? "是" : "否" }}
      </span>
      <span slot="titles" slot-scope="text">
        {{ text }}
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="editmold(record)" v-auth="`mold.update`" style="color: #1890ff">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm
          placement="topRight"
          title="是否确定要删除此草案类别?"
          ok-text="确定"
          cancel-text="取消"  v-auth="`mold.delete`"
          @confirm="confirm(record)"
        >
          <a href="#" style="color: #1890ff">删除</a>
        </a-popconfirm>
      </span>
    </a-table>
    <a-pagination
      size="small"
      style="text-align: right; margin: 20px 0"
      @change="changepage"
      :current="pagination.page"
      :pageSize="pagination.per_page"
      @showSizeChange="changepage"
      :pageSizeOptions="pageSizeOptions"
      :total="pagination.total"
      show-size-changer
      show-quick-jumper
      :show-total="(total) => `共 ${total} 条`"
    ></a-pagination>
    <!-- 增编 -->
    <a-modal
      :title="titles"
      width="60%"
      :visible="molds"
      :maskClosable="false"
      @ok="onSubmit"
      @cancel="
        () => {
          this.molds = false;
          this.$refs.ruleForm.resetFields();
        }
      "
    >
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item ref="title" label="草案标题" prop="title">
          <a-input v-model="form.title" placeholder="请输入草案标题" />
        </a-form-model-item>
        <a-form-model-item label="是否解读">
          <a-switch v-model="form.read" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import {
  mold_paginate,
  mold_add,
  mold_update,
  mold_delete,
} from "@/services/opinion";
export default {
  data() {
    return {
      searchloading: true,
      dataSource: {},
      pageSizeOptions: ["10", "20", "30", "40"],
      columns: [
        {
          title: "标题",
          dataIndex: "title",
          scopedSlots: { customRender: "titles" },
        },
        {
          title: "是否解读",
          dataIndex: "read",
          align: "center",
          width: 80,
          scopedSlots: { customRender: "read" },
        },
        {
          title: "操作",
          width: 120,
          align: "center",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
      moldid: "",
      titles: "草案新增",
      molds: false,
      form: {
        title: undefined,
        read: false,
      },
      rules: {
        title: [{ required: true, message: "请输入草案标题" }],
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      metheds: undefined,
    };
  },
  authorize: {
    addmold: "mold.add",
    editmold: 'mold.update',
    confirm: "mold.delete"
  },
  computed: {
    pagination: {
      get() {
        return {
          page: this.dataSource.page || 1,
          per_page: this.dataSource.per_page || 10,
          total: this.dataSource.total || 0,
        };
      },
      set(val) {
        this.dataSource.page = val.page;
        this.dataSource.total = val.total;
        this.dataSource.per_page = val.per_page;
      },
    },
  },
  created() {},
  methods: {
    loadDataSrouce() {
      this.searchloading = true;
      mold_paginate(this.pagination)
        .then((res) => {
          console.log("re", res);
          this.dataSource = res.data.data;
          this.searchloading = false;
        })
        .catch((err) => {
          console.log(err);
          this.searchloading = false;
        });
    },
    // 分页
    changepage(page, pageSize) {
      this.pagination.page = page;
      this.pagination.per_page = pageSize;
      this.loadDataSrouce();
    },
    // 增编
    addmold() {
      this.molds = true;
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields();
        this.moldid = undefined;
        this.metheds = mold_add;
      });
    },
    // 编辑
    editmold(data) {
      this.molds = true;
      this.$nextTick(() => {
        this.form.title = data.title;
        this.form.read = data.read;
        this.moldid = data._id;
        this.metheds = mold_update;
      });
    },
    // 保存
    onSubmit() {
      console.log("this.form", this.form);
      this.$refs.ruleForm.validate((valid) => {
        console.log("valid", valid);
        if (valid) {
          this.metheds(Object.assign(this.form, { id: this.moldid }))
            .then(() => {
              this.molds = false;
              this.loadDataSrouce();
            })
            .catch((error) => {
              this.$message.error(error.response.data.message);
              console.log(error);
            });
        } else {
          return false;
        }
      });
    },
    // 删除
    confirm(data) {
      mold_delete({
        id: data._id,
      })
        .then(() => {
          this.loadDataSrouce();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.loadDataSrouce();
  },
};
</script>