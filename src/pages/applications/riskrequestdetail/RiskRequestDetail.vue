<template>
  <a-card>
    <a-page-header>
      <a-descriptions bordered :column="{ xs: 1, sm: 1, md: 2 }">
        <a-descriptions-item label="标题">
          {{ currData.title }}
        </a-descriptions-item>
        <a-descriptions-item label="行业分类">
          <a-tag color="blue">
            {{ currData.organization.title }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="所属标签">
          <a-tag color="purple" v-for="item in currData.tags" :key="item._id">
            {{ item }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="申请人">
          {{ currData.requester.realname }}
        </a-descriptions-item>
        <a-descriptions-item label="处置人" v-if="currData.hander">
          {{ currData.hander.realname }}
        </a-descriptions-item>
        <a-descriptions-item label="处置状态" >
          <template v-if="currData.accept === undefined">
            <span style="color: #faad14">
              <a-icon type="inbox" />
              未处理
            </span>
          </template>
          <template v-else>
            <span v-if="currData.accept" style="color: #40a9ff">
              <a-icon type="select" />
              已接受
            </span>
            <span v-else style="color: #ff7575">
              <a-icon type="import" />
              已退回
            </span>
          </template>
        </a-descriptions-item>
      </a-descriptions>
    </a-page-header>
    <a-card>
      <a-card-grid style="width: 100%">
        <a-card-meta title="内容详情">
          <div slot="description" v-html="currData.content"></div>
        </a-card-meta>
      </a-card-grid>
    </a-card>
  </a-card>
</template>
<script>
import { riskrequest_detail } from "@/services/riskrequest";
export default {
  props: {
    params: {
      //传递的数据
      type: Object,
    },
    data: {
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
      currData: {
        organization:{},
        requester:{}
      },
    };
  },
  created() {
    this.onLoad();
  },
  methods: {
    onLoad() {
      riskrequest_detail({
        id: this.data.id,
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