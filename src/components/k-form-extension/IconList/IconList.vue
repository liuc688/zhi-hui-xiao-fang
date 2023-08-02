<template>
  <a-popover v-model="visible" trigger="click" :placement="'rightBottom'">
    <span slot="title">icon列表</span>
    <a-card slot="content" :bordered="false">
      <template v-if="dataSrouce.length">
        <a
          :key="item.uid"
          v-for="item in dataSrouce"
          @click="onClickItem(item)"
        >
          <a-card-grid style="width: 10%; text-align: center">
            <img :src="item.url" width="60" />
          </a-card-grid>
        </a>
      </template>
      <template v-else> 暂无Icon请上传 </template>
    </a-card>
    <a @click="onClick">
      <img :src="value.url || Coo.url" width="100%" style="max-width: 80px" />
    </a>
  </a-popover>
</template>
<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          name: "Occ.png",
          type: "img",
          url: require("@/assets/images/4.png"),
          uid: "vc-upload-1619607217477-2",
          status: "done",
        };
      },
    },
    record: {
      type: Object,
      required: true,
    },
    formConfig: {
      type: Object,
      required: false,
    },
    dynamicData: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    dataSrouce() {
      if (this.record.options.dynamic) {
        return this.dynamicData[this.record.options.dynamicKey].map((x) => {
          return {
            name: x.file,
            type: "img",
            url: x.url,
            uid: x.id,
            status: "done",
          };
        });
      } else {
        return [];
      }
    },
  },
  data() {
    return {
      Coo: {
        name: "Occ.png",
        type: "img",
        url: require("@/assets/images/4.png"),
        uid: "vc-upload-1619607217477-2",
        status: "done",
      },
      visible: false,
    };
  },
  methods: {
    onClick() {
      this.visible = true;
    },
    onClickItem(item) {
      this.$emit("change", item);
      this.visible = false;
    },
  },
};
</script>
