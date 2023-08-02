<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <!-- 基本信息 -->
    <a-card title="留言信息" style="width: 100%">
      <!-- <a slot="extra" v-if="noReplay" href="#">回复</a> -->
      <a-descriptions bordered layout="vertical">
        <a-descriptions-item label="留言标题">
          {{ datas.title }}
        </a-descriptions-item>
        <a-descriptions-item label="留言内容">
          <div v-html="datas.content"></div>
        </a-descriptions-item>
      </a-descriptions>
      <!-- 留言 -->
      <a-list :data-source="leaves" bordered style="margin: 30px 0">
        <a-list-item
          slot="renderItem"
          slot-scope="item, index"
          style="padding: 0 20px"
        >
          <a-comment>
            <a-avatar slot="avatar" src="" icon="user" />
            <span slot="content">
              <div v-html="item.content"></div>
            </span>
            <span slot="author">{{ item._creator }}</span>
            <span slot="datetime">{{ item._createtime }}</span>
          </a-comment>
          <div slot="actions">
            <a-popconfirm
              title="您确定要删除此条信息吗?"
              ok-text="确认"
              placement="topLeft"
              cancel-text="取消"
              @confirm="confirm(index)"
            >
              <a>
                <a-icon
                  type="delete"
                  :style="{ fontSize: '18px', color: '#ccc' }"
                />
              </a>
            </a-popconfirm>
          </div>
        </a-list-item>
      </a-list>
      <k-form-build
        v-if="noReplay"
        style="margin: 30px 0"
        :value="channelForm"
        ref="channelForm"
      />
      <div class="a_button" v-if="noReplay">
        <a-button type="primary" @click="comments">回复</a-button>
      </div>
    </a-card>
  </a-card>
</template>
<script>
import { manual_get, manual_review, review_delete } from "@/services/repository";
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
      datas: {},
      channelForm: {},
      leaves: [],
      noReplay: false,
    };
  },
  computed: {
    dynamicData() {
      let result = {};
      return result;
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.id = this.params.data.id;
      form_get({
        name: "comments",
      })
        .then((response) => {
          this.channelForm = response.data.data.form;
        })
        .catch((error) => {
          this.$message.error(error);
        });
      manual_get({
          id: this.id,
      })
        .then((res) => {
          this.datas = res.data.data;
          this.noReplay = res.data.noReplay;
          this.leaves = res.data.data.leaves;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    comments() {
      this.$refs.channelForm
        .getData()
        .then((data) => {
          manual_review({
              id: this.id,
              content: data.comment,
          })
            .then(() => {
              this.$refs.channelForm.reset();
              this.init();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    confirm(index) {
      review_delete({
          id: this.id,
          index: index,
      })
        .then(() => {
          this.$message.success("操作成功！");
          this.init();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style>
.ant-descriptions-item-label {
  font-weight: 800;
}
</style>
<style scoped>
.title_back {
  padding: 10px;
  background: #daedff;
  border: 1px solid #40a9ff;
  border-radius: 5px;
  margin-bottom: 20px;
}
.a_button {
  width: 100%;
  padding: 3% 0%;
  text-align: right;
}
</style>
