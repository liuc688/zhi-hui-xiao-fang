<template>
  <div class="info_rights_all">
    <div class="titles">分区位置详情</div>
    <div class="search_tops">
      <a-date-picker @change="onChange" class="selectes" style="width: 140px" placeholder="开始时间" />
      <a-date-picker @change="onChange" class="selectes" style="width: 140px" placeholder="结束时间" />
      <div class="search_bgs">
        <img src="./images/search.png" alt="" />
        查询
      </div>
    </div>
    <div class="search_datas">
      <div class="table_top">铭盛大厦：三楼301</div>
      <div class="cards_all">
        <div class="card_item">
          <img src="./images/xchj_01.png" alt="" />
          <div style="width: 100%; text-align: center">三楼配电箱1008</div>
        </div>
        <div class="card_item">
          <img src="./images/xchj_02.png" alt="" />
          <div style="width: 100%; text-align: center">三楼100089</div>
        </div>
        <div class="card_item">
          <img src="./images/xchj_02.png" alt="" />
          <div style="width: 100%; text-align: center">展厅门头消火栓</div>
        </div>
        <div class="card_item">
          <img src="./images/xchj_03.png" alt="" />
          <div style="width: 100%; text-align: center">展厅</div>
        </div>
      </div>
      <div class="table_top">展厅：展厅东1-1</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      type: '全部整改',
      list: ['全部整改', '未整改', '整改中', '整改完成'],
      types: '全部隐患',
      lists: ['全部隐患', '待定', '未定级', '一般隐患', '重大隐患'],
      data: [],
    };
  },
  methods: {
    onChange() {},
  },
};
</script>
<style scoped>
.info_rights_all {
  height: calc(100% - 50px);
  width: 100%;
  padding: 12px;
  background-image: url('./images/info_bg.png');
  background-size: 100% 100%;
  margin: 20px auto;
}
.titles {
  text-align: left;
  color: #4f819c;
  font-size: 16px;
  padding: 10px 0;
  border-bottom: 1px dashed #67a0c7;
}

.search_tops >>> .ant-select-arrow {
  color: #bde1f9;
}
.search_tops >>> .ant-select-selection {
  background: #083c62 !important;
  border: 1px solid #175a88;
  box-shadow: 0px 1px 4px 0px #002038 inset;
}
.selectes >>> .ant-select-dropdown-menu-item {
  background: #083c62 !important;
  border: 1px solid #175a88;
  color: #67a0c7;
  box-shadow: 0px 1px 4px 0px #002038 inset;
}

.selectes >>> .ant-input {
  background: #083c62 !important;
  border: 1px solid #175a88;
  color: #67a0c7;
  box-shadow: 0px 1px 4px 0px #002038 inset;
}
</style>
<style lang="less">
.search_tops {
  display: flex;
  margin: 24px auto;
  .selectes {
    background: #083c62 !important;
    color: #ffffff;
    width: 100px;
    border: 1px solid #175a88;
    box-shadow: 0px 1px 4px 0px #002038 inset;
    font-size: 14px;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    color: #67a0c7;
    line-height: 20px;
    letter-spacing: 0.88px;
    margin-right: 10px;
  }
  .search_bgs {
    background-image: url('./images/search_bg.png') !important;
    background-size: 100% 100%;
    padding: 5px 10px;
    margin-left: 32px;
    cursor: pointer;
    img {
      width: 17px;
      height: 17px;
    }
  }
}
.search_datas {
  height: calc(100% - 130px);
  width: 100%;
  .table_top {
    width: 100%;
    border: 1px solid #08578f;
    padding: 8px 10px;
    font-size: 16px;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    color: #eef9ff;
    line-height: 22px;
    letter-spacing: 1px;
  }
  .cards_all {
    width: 100%;
    display: flex;
    .card_item {
      width: 120px;
      margin: 20px;
      text-align: center;
      img {
        width: 92px;
        height: 111px;
        margin-bottom: 14px;
      }
    }
  }
}
</style>
