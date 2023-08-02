<template>
  <div class="mains">
    <div
      v-for="i in 12"
      :key="i"
      class="main_item"
      :style="{ paddingTop: 25 * (12 - i) + 'px' }"
    >
      <div style="text-align: center; height: 20px">
        <span v-show="i == 3">周期完成情况：</span>
        <span v-show="i == 3" style="color: #1890ff">1/4</span>
      </div>
      <a-progress v-if="i < 4" :percent="30" />
      <a-skeleton v-else :paragraph="{ rows: 0 }" class="skeleton_an" />
      <div class="times">
        <span>2022-06-18</span>
        <span style="margin: 0 20px">~</span>
        <span>2022-06-20</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>
<style lang="less" scoped>
.mains {
  width: 100%;
  overflow-x: auto;
  padding: 30px 60px;
  display: -webkit-box;
  .main_item {
    // border: 1px solid #aaa;
    width: 17%;
    border-left: 2px dashed #ebebeb;
    position: relative;
    padding-bottom: 45px;

    .times {
      position: absolute;
      width: calc(100% - 20px);
      margin: 0 10px;
      bottom: 0px;
      font-size: 16px;
      text-align: center;
      font-weight: 500;
    }
  }
  .main_item:last-child {
    border-right: 2px dashed #ebebeb;
  }
}
</style>
<style scoped>
.main_item >>> .ant-progress-bg {
  border-radius: 0 !important;
  height: 20px !important;
  border: 1px solid #1890ff;
}
.main_item >>> .ant-progress-inner {
  border-radius: 0 !important;
  height: 20px !important;
  border: 1px solid #1890ff;
}
.skeleton_an >>> .ant-skeleton-title {
  width: 100% !important;
  height: 20px;
  margin-top: 5px;
}
</style>
