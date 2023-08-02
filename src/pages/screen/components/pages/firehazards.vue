<template>
  <div class="info_rights_alls">
    <!-- <div class="titles">消防隐患</div> -->
    <div class="search_tops_alls">
      <a-date-picker @change="onChange" class="selectes" style="width: 140px" placeholder="开始时间" />
      <a-date-picker @change="onChange" class="selectes" style="width: 140px" placeholder="结束时间" />
      <a-select v-model="type" style="width: 120px; margin-right: 10px" class="selectes" placeholder="请选择">
        <a-select-option v-for="item in list" :key="item">{{ item }}</a-select-option>
      </a-select>
      <a-select v-model="types" style="width: 120px; margin-right: 10px" class="selectes" placeholder="请选择">
        <a-select-option v-for="item in lists" :key="item">{{ item }}</a-select-option>
      </a-select>
      <div class="search_bgs">
        <img src="./images/search.png" alt="" />
        查询
      </div>
      <div class="search_bgs" style="margin-left: 10px">
        <a-icon type="sync" />
        重置
      </div>
    </div>
    <div class="search_datas_alls">
      <div style="width: 100%" class="table_top">
        <span style="width: 20%">隐患描述</span>
        <span style="width: 20%">发现时间</span>
        <span style="width: 20%">隐患等级</span>
        <span style="width: 10%">状态</span>
        <span style="width: 30%">操作</span>
      </div>
      <div class="table_datas">无数据</div>
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
.info_rights_alls {
  height: calc(100% - 50px);
  width: 100%;
  padding: 12px;
  background-image: url('./images/info_bg.png');
  background-size: 100% 100%;
  margin: 20px auto;
}
.titles {
  text-align: center;
  color: #4f819c;
  font-size: 20px;
  margin-top: 10%;
}

.search_tops_alls >>> .ant-select-arrow {
  color: #bde1f9;
}
.search_tops_alls >>> .ant-select-selection {
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
.search_datas_alls >>> table {
  border: 1px solid #08578f;
}
.search_datas_alls >>> th {
  background-color: #002038;
  color: #fff;
}
.search_datas_alls >>> .ant-table-placeholder {
  background-color: #002038;
  color: #2f82ba !important;
  border-bottom: 1px solid #2f82ba;
}
</style>
<style lang="less">
.search_tops_alls {
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
.search_datas_alls {
  height: calc(100% - 84px);
  .table_top {
    height: 40px;
    line-height: 40px;
    border: 1px solid #08578f;
    span {
      display: inline-block;
      padding: 0 10px;
    }
  }
  .table_datas {
    color: #2f82ba;
    text-align: center;
    padding-top: 50px;
  }
}
</style>
