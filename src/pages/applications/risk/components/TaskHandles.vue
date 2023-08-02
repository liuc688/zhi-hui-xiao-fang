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
      <a-timeline>
        <template v-for="(item, index) in data">
          <a-timeline-item color="blue" :key="index">
            <a-icon slot="dot" type="clock-circle-o" style="font-size: 16px" />

            <a-card
              hoverable
              style="width: 600px"
              :title="'处置时间：' + item.lasttime"
            >
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
    </a-card>
  </a-card>
</template>

<script>
import { risktask_handle_list } from "@/services/task";

export default {
  props: {
    params: {
      //传递的数据
      type: Object,
    },
    event: {
      type: Function,
    },
    crumbs: {
      type: Array,
    },
  },
  data() {
    return {
      loading: false,
      avatar: require("@/assets/images/avatar.jpeg"),
      id: null,
      sort: false,
      data: [],
    };
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
    },
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
      const last = this.crumbs.pop();
      last.params.id = last.params.parent;
      this.$emit("event", {
        method: "onLink",
        params: {
          route: last.route,
          params: last.params,
          crumbs: this.crumbs || [],
        },
      });
    },
  },
};
</script>