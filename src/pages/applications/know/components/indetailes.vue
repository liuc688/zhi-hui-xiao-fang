<template>
  <a-spin
    :spinning="spinning"
    style="height: 100%; width: 100%"
    tip="Loading..."
  >
    <div style="padding: 20px; min-height: 100%; background: white">
      <div class="title_back">
        <a @click="back()"><a-icon type="arrow-left" />返回</a>
      </div>

      <div class="questions">
        <h3>问题标题：</h3>
        <div>{{ sourcedata.title }}</div>
      </div>
      <a-table
        ref="table"
        :bordered="true"
        style="margin: 20px 0"
        size="middle"
        rowKey="sole"
        :loading="loading"
        :columns="columns"
        :dataSource="sourcedata.answers"
        :pagination="true"
      >
        <span slot="content" slot-scope="text, record">
          <a
            style="color: #40a9ff; padding-left: 5px"
            @click="todetailes(record)"
            >{{
              record.extension.text.length > 0
                ? record.extension.text
                : "查看回答详情"
            }}</a
          >
        </span>
        <span slot="action" slot-scope="text, record">
          <template v-if="record.choice">
            <a-icon
              type="like"
              style="color: #11d411; font-size: 20px"
              v-if="record.choice"
            />
            最佳
          </template>
          <a
            v-else
            :style="
              record.status
                ? 'color: #ff7875 !important;'
                : 'color: #40a9ff !important;'
            "
            @click="check(record)"
          >
            <a-icon :type="record.status ? 'close' : 'check'" />
            {{ record.status ? "撤回" : "审核" }}
          </a>
        </span>
        <span slot="index" slot-scope="text, record">
          {{ record.index.length }}</span
        >
        <span slot="user" slot-scope="text, record">
          {{ record.extension.user.realname }}
        </span>
      </a-table>
      <a-modal
        title="回答详情"
        :visible="visible"
        :width="900"
        :maskClosable="false"
        @cancel="handleCancel"
      >
        <span slot="footer">
          <a-button @click="handleCancel">关闭</a-button>
        </span>
        <div v-html="content" style="height: 600px; overflow: auto"></div>
      </a-modal>
    </div>
  </a-spin>
</template>
<script>
import { know_get, answer_check } from "@/services/know";
import Templates from "../../templates/Templates.vue";
export default {
  components: { Templates },
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
      visible: false,
      spinning: false,
      loading: true,
      data: {},
      sourcedata: {},
      selectedRowKeys: [],
      columns: [
        {
          title: "回答内容",
          dataIndex: "content",
          scopedSlots: { customRender: "content" },
        },
        {
          title: "用户名称",
          dataIndex: "user",
          align: "center",
          scopedSlots: { customRender: "user" },
        },
        {
          title: "点赞人数",
          dataIndex: "index",
          align: "center",
          scopedSlots: { customRender: "index" },
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
      pageSizeOptions: ["10", "20", "30", "40"],
      content: "",
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      know_get({ id: this.params.id })
        .then((res) => {
          this.sourcedata = res.data.data;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 分页
    changepage(page, pageSize) {
      this.pagination.page = page;
      this.pagination.per_page = pageSize;
      this.loading = true;
      // this.init();
    },
    todetailes(record) {
      this.visible = true;
      this.$nextTick(() => {
        this.content = record.content;
      });
    },
    handleCancel() {
      this.visible = false;
      this.content = "";
    },
    check(record) {
      answer_check({ id: this.params.id, sole: record.sole })
        .then(() => {
          this.loading = true;
          this.init();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    back() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "home",
          params: this.params,
        },
      });
    },
  },
};
</script>
<style scoped>
.title_back {
  padding: 10px;
  background: #daedff;
  border: 1px solid #40a9ff;
  border-radius: 5px;
  margin-bottom: 20px;
}
.questions {
  width: 100%;
  background: #f5f5f5;
  /* border: 1px solid #40a9ff; */
  border-radius: 5px;
  padding: 20px;
}
</style>