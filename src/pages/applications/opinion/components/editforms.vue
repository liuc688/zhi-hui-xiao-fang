<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <div class="title_back">
      <a @click="back"><a-icon type="arrow-left" />返回</a>
    </div>
    <a-button
      type="primary"
      style="margin-bottom: 20px"
      v-auth="`opinion.add`"
      v-if="$auth('opinion.add')"
      @click="addadvice()"
    >
      添加意见
    </a-button>
    <a-table
      ref="table"
      bordered
      class="table_content"
      size="middle"
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
    >
      <span slot="action" slot-scope="text, record, index">
        <a-popconfirm
          v-if="record.tag"
          title="您确定要取消此意见审核吗?"
          ok-text="确认"
          cancel-text="取消"
          @confirm="check(record, index)"
          @cancel="cancel"
        >
          <a v-auth="`opinion.check`" style="color:#00aaf0">取消审核</a>
        </a-popconfirm>
        <a-popconfirm
          v-else
          title="您确定要审核此意见吗?"
          ok-text="确认"
          cancel-text="取消"
          @confirm="check(record, index)"
          @cancel="cancel"
        >
          <a v-auth="`opinion.check`" style="color:#00aaf0">审核</a>
        </a-popconfirm>

        <a-divider type="vertical" />
        <a-popconfirm
          title="您确定要移除此意见吗?"
          ok-text="确认"
          cancel-text="取消"
          @confirm="remove(index)"
          @cancel="cancel"
        >
          <a v-auth="`opinion.remove`" style="color:#00aaf0">移除</a>
        </a-popconfirm>
      </span>
      <span slot="tag" slot-scope="text, record">
        <a-tag :color="record.tag ? 'green' : 'orange'">
          {{ record.tag ? "审核通过" : "未审核" }}
        </a-tag>
      </span>
      <span slot="titles" slot-scope="text, record">
        <a @click="toadvice(record)" style="color: #00aaf0">{{
          record.title
        }}</a>
      </span>
    </a-table>
    <a-modal
      :title="titles"
      width="750px"
      :closable="false"
      :confirm-loading="confirmLoading"
      :visible="formDialog"
      @ok="onSubmit"
      @cancel="
        () => {
          formDialog = false;
          this.$refs.forms.reset();
        }
      "
    >
      <template slot="footer" v-if="footers">
        <a-button
          @click="
            () => {
              formDialog = false;
              this.$refs.forms.reset();
            }
          "
        >
          关闭
        </a-button>
      </template>
      <k-form-build :value="jsonData" :disabled="disabled" ref="forms" />
    </a-modal>
  </a-card>
</template>
<script>
import { form_get } from "@/services/forms";
import { draft_get, opinion_add, opinion_check, opinion_remove } from "@/services/opinion";
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
      dataSource: [],
      confirmLoading: false,
      formDialog: false,
      forms: {},
      jsonData: {},
      columns: [
        {
          title: "序号",
          dataIndex: "",
          key: "rowIndex",
          width: 60,
          align: "center",
          customRender: function (t, r, index) {
            return parseInt(index) + 1;
          },
        },
        {
          title: "姓名",
          dataIndex: "name",
          scopedSlots: { customRender: "name" },
        },
        {
          title: "标题",
          dataIndex: "title",
          ellipsis: true,
          scopedSlots: { customRender: "titles" },
        },
        {
          title: "内容",
          dataIndex: "content",
          ellipsis: true,
          scopedSlots: { customRender: "content" },
        },
        {
          title: "手机号",
          dataIndex: "mobile",
          scopedSlots: { customRender: "mobile" },
        },
        {
          title: "地址",
          dataIndex: "address",
          ellipsis: true,
          scopedSlots: { customRender: "address" },
        },
        {
          title: "状态",
          dataIndex: "tag",
          scopedSlots: { customRender: "tag" },
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
      footers: false,
      id: this.$route.query.id,
      titles: "添加意见",
      disabled: false,
    };
  },
  created() {
    this.init();
  },
  authorize: {
    addadvice: "opinion.add",
    remove: "opinion.remove",
    check: "opinion.check",
  },
  methods: {
    // 移除
    remove( index) {
      var parems = {
          id: this.params.data.id,
          index: index+1,
      };
      opinion_remove(parems)
        .then(() => {
          this.$message.success("移除成功！");
          this.init();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    cancel() {},
    // 审核
    check(record, index) {
      var parems = {
          id: this.params.data.id,
          index: index +1,
      };
      opinion_check(parems)
        .then(() => {
          if (!record.tag) {
            this.$message.success("审核完成！");
          } else {
            this.$message.success("取消审核完成！");
          }
          this.init();
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    init() {
      Promise.all([
        draft_get({ id: this.params.data.id }),
        form_get({ name: "opinion_add_edit" }),
      ])
        .then((Response) => {
          this.dataSource = Response[0].data.data.opinions;
          this.jsonData = Response[1].data.data.form;
        })
        .catch((error) => {
          console.log("erroe", error);
        });
    },
    //
    toadvice(record) {
      this.formDialog = true;
      this.footers = true;
      this.titles = "查看意见";
      this.disabled = true;
      this.$nextTick(() => {
        this.$refs.forms.setData({
          title: record.title,
          name: record.name,
          address: record.address,
          mobile: record.mobile,
          email: record.email,
          content: record.content,
        });
      });
    },
    addadvice() {
      this.formDialog = true;
      this.forms = {};
      this.titles = "添加意见";
      this.footers = false;
      this.disabled = false;
    },
    onSubmit() {
      this.$refs.forms
        .getData()
        .then((res) => {
          this.confirmLoading = true;
          var parems = Object.assign(res, { id: this.params.data.id })
          opinion_add(parems)
            .then(() => {
              this.confirmLoading = false;
              this.$message.success("创建完成！");
              this.formDialog = false;
              this.$refs.forms.reset();
              this.init();
            })
            .catch((err) => {
              console.log(err);
              this.confirmLoading = false;
            });
        })
        .catch((error) => {
          for (var i in error) {
            this.$message.warning(error[i].errors[0].message);
          }
        });
    },
    back() {
      this.$emit("event", {
        method: "onLink",
        params: {
          id:this.params.id?this.params.id:'',
          route: "home",
          params: this.params,
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
.title_back {
  padding: 10px;
  background: #daedff;
  border: 1px solid #40a9ff;
  border-radius: 5px;
  margin: 20px 0 !important;
}
</style>