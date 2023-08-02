<template>
  <a-card>
    <a-page-header>
      <template slot="extra">
        <a-button
          type="primary"
          icon="reload"
          :loading="loading"
          @click="onReload"
        >
          刷新
        </a-button>
      </template>
    </a-page-header>
    <template>
      <a-timeline>
        <template v-for="(item, index) in flows">
          <a-timeline-item :key="index">
            <p>
              <span style="font-weight: bold;">步骤条件：</span>
              <span>
                <a-tag v-if="item.model == 0">
                  任意管理员
                </a-tag>
                <a-tag v-else-if="item.model == 1">
                  所有审核人员
                </a-tag>
                <a-tag v-else-if="item.model == 2">
                  任意审核人员
                </a-tag>
              </span>
            </p>
            <p v-if="item.ids && item.ids.length">
              <span style="font-weight: bold;">审核人：</span>
              <template v-for="record in item.ids">
                <a-tag :key="record.id">{{ record.realname }}</a-tag>
              </template>
            </p>
          </a-timeline-item>
        </template>
      </a-timeline>
    </template>
  </a-card>
</template>
<script>
import { approve_get } from "@/services/approve";

export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {},
  data() {
    return {
      loading: false,
      flows: [],
    };
  },
  created() {
    this.onLoad();
  },
  methods: {
    onLoad() {
      this.loading = true;

      this.id = this.data.id;
      approve_get({
        id: this.id,
      })
        .then((response) => {
          this.flows = response.data.data;
          this.loading = false;
        })
        .catch((error) => {
          console.log("error", error);

          this.loading = false;
        });
    },
    onReload() {
      this.loading = true;
      this.onLoad();
    },
  },
};
</script>
