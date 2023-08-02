<template>
  <a-card>
    <a-page-header @back="onBack">
      <span slot="title">
        <a @click="onBack" style="color: #000000">返回</a>
      </span>
      <template slot="extra">
        <a-button @click="onSort"><a-icon type="swap" />反序</a-button>
        <a-divider type="vertical" />
        <a-button @click="onReload"><a-icon type="reload" />刷新</a-button>
      </template>
    </a-page-header>
    <a-card :loading="loading" title="处置流程">
      <a-button slot="extra" @click="onReply" type="primary" icon="cloud-upload"
        >回复协同处置</a-button
      >
      <template>
        <a-timeline>
          <template v-for="(item, index) in data">
            <a-timeline-item color="blue" :key="index">
              <a-icon
                slot="dot"
                type="clock-circle-o"
                style="font-size: 16px"
              />

              <a-card
                hoverable
                style="width: 600px"
                :title="'处置时间：' + item.lasttime"
              >
                <template slot="extra">
                  <a @click="onEdit(item)">编辑</a>
                  <a-divider type="vertical" />
                  <a @click="onDelete(item)">删除</a>
                </template>
                <a-card-meta :title="item.hander.realname">
                  <p slot="description">{{ item.hander.username }}</p>
                  <a-avatar
                    slot="avatar"
                    :src="
                      item.hander.avatar.url ? item.hander.avatar.url : avatar
                    "
                  />
                </a-card-meta>
                <p>
                  <a-tag color="cyan"> 处置情况: </a-tag>
                  {{ item.info }}
                </p>
                <p>
                  <a-tag color="blue"> 处置评价: </a-tag>
                  {{ item.evaluate }}
                </p>
                <div v-if="item.files.length">
                  附件:
                  <p v-for="(temp, index) in item.files" :key="index">
                    <a :href="temp.url" :download="temp.name">{{ temp.name }}</a>
                  </p>
                </div>
              </a-card>
            </a-timeline-item>
          </template>
        </a-timeline>
      </template>
    </a-card>
    <a-modal
      v-model="visible"
      :title="title"
      :maskClosable="false"
      ok-text="确认"
      cancel-text="取消"
      @ok="onOk"
      centered
      width="45%"
      :confirmLoading="loading"
      :z-index="1002"
      @cancel="
        () => {
          this.$refs.form.reset();
          visible = false;
        }
      "
    >
      <k-form-build :value="jsonData" ref="form" :dynamicData="dynamicData" />
    </a-modal>
  </a-card>
</template>

<script>
import { form_get } from "@/services/forms";
import {
  risktask_handle_list,
  risktask_handle_add,
  risktask_handle_edit,
  risktask_handle_delete,
} from "@/services/task";

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
      loading: false,
      visible: false,
      title: null,
      jsonData: {},
      avatar: require("@/assets/images/avatar.jpeg"),
      id: null,
      sort: false,
      data: [],
      commit: null,
      currData: {},
    };
  },
  computed: {
    dynamicData() {
      let result = {};
      return result;
    },
  },
  created() {
    this.id = this.params ? this.params.id : null;
    if (this.id) {
      this.init();
    }
  },
  methods: {
    init() {
      this.loading = true;
      this.list();
      Promise.all([
        form_get({
          name: "reply_task",
        }),
      ])
        .then((response) => {
          this.jsonData = response[0].data.data.form;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onReply() {
      this.visible = true;
      this.commit = risktask_handle_add;
      this.$nextTick(() => {
        this.$refs.form.reset();
      });
    },
    onOk() {
      this.loading = true;
      this.$refs.form
        .getData()
        .then((formData) => {
          const params = Object.assign(formData, {
            id: this.id,
          });
          this.commit(params)
            .then((response) => {
              this.$message.success(response.data.message);
              this.init();
              this.loading = false;
              this.visible = false;
            })
            .catch((error) => {
              this.loading = false;
              this.init();
              this.$message.error(error.data.message);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onEdit(record) {
      this.visible = true;
      this.currData = record;
      this.commit = risktask_handle_edit;
      this.$nextTick(() => {
        this.$refs.form.reset();
        let fields = {};
        for (let item in this.$refs.form.form.formItems) {
          fields[item] = record[item];
        }
        this.$refs.form.setData(fields);
      });
    },
    onDelete() {},
    onSort() {
      this.sort = !this.sort;
      this.init();
    },
    onReload() {
      this.init();
    },
    list() {
      this.loading = true;
      risktask_handle_list({
        id: this.id,
        sort: this.sort,
        self: true,
      })
        .then((response) => {
          this.data = response.data.data;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.$message.error(error.data.message);
        });
    },
    onBack() {
      this.$emit("event", {
        method: "onBack",
      });
    },
  },
};
</script>