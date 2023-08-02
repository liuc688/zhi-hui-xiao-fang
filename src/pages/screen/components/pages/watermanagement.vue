<template>
  <div class="info_rights_img">
    <div class="waterReport">
      <div class="left_top">
        设备数量：
        <span class="withe_spans">0</span>
        报警数量：
        <span class="red_spans">0</span>
      </div>

      <div class="right_top">
        设备数量：
        <span class="withe_spans">0</span>
        报警数量：
        <span class="red_spans">0</span>
      </div>

      <div class="left_bottom">
        设备数量：
        <span class="withe_spans">0</span>
        报警数量：
        <span class="red_spans">0</span>
      </div>

      <div class="right_bottom">
        设备数量：
        <span class="withe_spans">0</span>
        报警数量：
        <span class="red_spans">0</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
};
</script>
<style scoped>
.info_rights_img {
  height: 100%;
  width: 100%;
  padding: 30px;
  background-image: url('./images/info_bg.png') !important;
  background-size: 100% 100% !important;
  padding: 5% 15%;
}
</style>
<style lang="less">
.waterReport {
  width: 100%;
  height: 100%;
  background-image: url('./images/waterReport.png') !important;
  background-size: 100% 100% !important;
  position: relative;
  font-size: 16px;
  font-family: PingFang SC, PingFang SC-Regular;
  font-weight: 400;
  text-align: left;
  color: #e1e1e1;
  line-height: 22px;
  .red_spans {
    font-size: 28px;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    text-align: left;
    color: #fa4239;
    line-height: 40px;
  }
  .withe_spans {
    font-size: 28px;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    text-align: left;
    color: #e1e1e1;
    line-height: 40px;
    margin-right: 10px;
  }
  .left_top {
    position: absolute;
    top: 5%;
    left: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .right_top {
    position: absolute;
    top: 5%;
    right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .left_bottom {
    position: absolute;
    bottom: calc(50% - 30px);
    left: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .right_bottom {
    position: absolute;
    bottom: calc(50% - 30px);
    right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
