<template>
  <a-card>
    <a-page-header @back="onBack">
      <span slot="title">
        <a @click="onBack" style="color: #000000">返回</a>
      </span>
      <a-descriptions bordered :column="{ xs: 1, sm: 1, md: 2 }">
        <a-descriptions-item label="标题">
          {{ currData.title }}
        </a-descriptions-item>
        <a-descriptions-item label="行业分类">
          <a-tag
            color="blue"
            v-for="item in currData.organization"
            :key="item._id"
          >
            {{ item.title }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="所属标签">
          <a-tag color="purple" v-for="item in currData.tags" :key="item._id">
            {{ item }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="网上传播情况">
          {{ currData.spread }}
        </a-descriptions-item>
        <a-descriptions-item label="事件概况">
          {{ currData.summary }}
        </a-descriptions-item>
      </a-descriptions>
    </a-page-header>
    <a-card>
      <a-card-grid style="width: 50%" title="网民观点">
        <a-card-meta title="网民观点">
          <div slot="description">
            <a-timeline>
              <a-timeline-item
                :key="index"
                v-for="(item, index) in currData.netizen"
              >
                <p>{{ item.nickname }}：{{ item.comment }}</p>
                <p>{{ item.lasttime }}</p>
              </a-timeline-item>
            </a-timeline>
          </div>
        </a-card-meta>
      </a-card-grid>
      <a-card-grid style="width: 50%" title="媒体观点">
        <a-card-meta title="媒体观点">
          <div slot="description">
            <a-timeline>
              <a-timeline-item
                :key="index"
                v-for="(item, index) in currData.media"
              >
                <p>{{ item.nickname }}：{{ item.comment }}</p>
                <p>{{ item.lasttime }}</p>
              </a-timeline-item>
            </a-timeline>
          </div>
        </a-card-meta>
      </a-card-grid>
      <a-card-grid style="width: 100%" title="媒体观点">
        <a-card-meta title="案例总结">
          <div slot="description" v-html="currData.content"></div>
        </a-card-meta>
      </a-card-grid>
    </a-card>
  </a-card>
</template>
<script>
import { sample_get } from "@/services/rumor";
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
      organization: [],
      currData: {},
    };
  },
  created() {
    this.onLoad();
  },
  methods: {
    onLoad() {
      sample_get({
        id: this.params.id,
      }).then((response) => {
        this.currData = response.data.data;
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