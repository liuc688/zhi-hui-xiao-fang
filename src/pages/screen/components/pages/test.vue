<template>
  <div class="info_rights">
    <div class="titles">暂无权限！</div>
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
.info_rights {
  height: calc(100% - 40px);
  width: 100%;
  padding: 30px;
  background-image: url('./images/info_bg.png') !important;
  background-size: 100% 100%;
  margin: 20px auto;
}
.titles {
  text-align: center;
  color: #4f819c;
  font-size: 20px;
  margin-top: 10%;
}
</style>
