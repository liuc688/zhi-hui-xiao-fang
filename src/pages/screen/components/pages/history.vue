<template>
  <div class="history_page">
    <div class="history_page_header">
      <!-- <form action=""> -->
      <input type="date" value="2023-07-17" class="history_page_header_inputArea" />
      <select class="history_page_header_inputArea">
        <option value="所有系统" style="display: none">所有系统</option>
        <option value="系统1">系统1</option>
        <option value="系统2">系统2</option>
        <option value="系统3">系统3</option>
      </select>
      <select class="history_page_header_inputArea">
        <option value="是否处置" style="display: none">是否处置</option>
        <option value="已处置">已处置</option>
        <option value="未处置">未处置</option>
      </select>
      <input type="text" value="设备编号" class="history_page_header_inputArea" />
      <input type="text" value="单位名称" class="history_page_header_inputArea" />

      <button type="submit" class="history_page_header_btn">
        <a-icon type="search" style="margin-right: 5px" />
        搜索
      </button>
      <button class="history_page_header_btn">
        <a-icon type="upload" style="margin-right: 5px" />
        导出
      </button>

      <!-- </form> -->
    </div>
    <div class="history_page_content">
      <div class="history_page_content_title">
        <span style="width: 8%; height: 40px; float: left">所属部门</span>
        <span style="width: 8%; height: 40px; float: left">报警类型</span>
        <span style="width: 11%; height: 40px; float: left">设备编号</span>
        <span style="width: 12%; height: 40px; float: left">报警内容</span>
        <span style="width: 11%; height: 40px; float: left">报警时间</span>
        <span style="width: 7%; height: 40px; float: left">是否处置</span>
        <span style="width: 14%; height: 40px; float: left">处置时间</span>
        <span style="width: 7%; height: 40px; float: left">处置人员</span>
        <span style="width: 7%; height: 40px; float: left">备注</span>
        <span style="width: 15%; height: 40px; float: left">操作</span>
      </div>
      <div class="history_page_content_list" v-for="item in items">
        <span style="width: 8%; height: 40px; float: left" name="departmentName">{{ item.departmentName }}</span>
        <span style="width: 8%; height: 40px; float: left" name="alarmType">{{ item.alarmType }}</span>
        <span style="width: 11%; height: 40px; float: left" name="deviceId">{{ item.deviceId }}</span>
        <span style="width: 12%; height: 40px; float: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap" name="alarmContent">{{ item.alarmContent }}</span>
        <span style="width: 11%; height: 40px; float: left" name="alarmTime">{{ item.alarmTime }}</span>
        <span style="width: 7%; height: 40px; float: left" name="manage">{{ item.manage }}</span>
        <span style="width: 14%; height: 40px; float: left" name="manageTime">{{ item.manageTime }}</span>
        <span style="width: 7%; height: 40px; float: left" name="manageName">{{ item.manageName }}</span>
        <span style="width: 7%; height: 40px; float: left" name="notes">{{ item.notes }}</span>
        <span style="width: 15%; height: 40px; float: left">
          <button class="history_page_content_list_btn1">处置</button>
          <button class="history_page_content_list_btn2">详情</button>
        </span>
      </div>
    </div>
    <div class="history_page_fotter">
      <div class="pagination">
        <a-pagination show-quick-jumper :default-current="2" :total="100" @change="onChange" class="menu_1" :show-total="total => `共 ${total} 条信息`" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      items: [
        {
          key: '1',
          departmentName: '演示账号',
          alarmType: '水位报警',
          deviceId: 'HJV64328621111',
          alarmContent: '可燃水位低位报警可燃水位低位报警可燃水位低位报警可燃水位低位报警',
          alarmTime: '2019-10-30 15:03:12',
          manage: '未处置',
          manageTime: '2019-10-30 15:03:12',
          manageName: '1',
          notes: '1',
        },
        {
          key: '2',
          departmentName: '演示账号',
          alarmType: '水位报警',
          deviceId: 'HJV64328621111',
          alarmContent: '可燃水位低位报警可燃水位低位报警可燃水位低位报警可燃水位低位报警',
          alarmTime: '2019-10-30 15:03:12',
          manage: '未处置',
          manageTime: '2019-10-30 15:03:12',
          manageName: '1',
          notes: '1',
        },
        {
          key: '3',
          departmentName: '演示账号',
          alarmType: '水位报警',
          deviceId: 'HJV64328621111',
          alarmContent: '可燃水位低位报警可燃水位低位报警可燃水位低位报警可燃水位低位报警',
          alarmTime: '2019-10-30 15:03:12',
          manage: '未处置',
          manageTime: '2019-10-30 15:03:12',
          manageName: '1',
          notes: '1',
        },
        {
          key: '4',
          departmentName: '演示账号',
          alarmType: '水位报警',
          deviceId: 'HJV64328621111',
          alarmContent: '可燃水位低位报警可燃水位低位报警可燃水位低位报警可燃水位低位报警',
          alarmTime: '2019-10-30 15:03:12',
          manage: '未处置',
          manageTime: '2019-10-30 15:03:12',
          manageName: '1',
          notes: '1',
        },
        {
          key: '5',
          departmentName: '演示账号',
          alarmType: '水位报警',
          deviceId: 'HJV64328621111',
          alarmContent: '可燃水位低位报警可燃水位低位报警可燃水位低位报警可燃水位低位报警',
          alarmTime: '2019-10-30 15:03:12',
          manage: '未处置',
          manageTime: '2019-10-30 15:03:12',
          manageName: '1',
          notes: '1',
        },
        {
          key: '6',
          departmentName: '演示账号',
          alarmType: '水位报警',
          deviceId: 'HJV64328621111',
          alarmContent: '可燃水位低位报警可燃水位低位报警可燃水位低位报警可燃水位低位报警',
          alarmTime: '2019-10-30 15:03:12',
          manage: '未处置',
          manageTime: '2019-10-30 15:03:12',
          manageName: '1',
          notes: '1',
        },
      ],
    };
  },

  methods: {
    onChange(pageNumber) {
      console.log('Page: ', pageNumber);
    },
  },
};
</script>
<style lang="less">
.history_page {
  width: 100%;
  height: calc(100% - 45px);
  margin: 20px auto;
  padding: 12px;
  background-color: rgb(2, 35, 58) !important;

  .history_page_header {
    width: 100%;
    height: 9%;

    .history_page_header_inputArea {
      background-color: rgb(8, 60, 98);
      color: rgb(102, 159, 198);
      border: none;
      height: 34px;
      width: 160px;
      font-size: 16px;
      padding-left: 10px;
      margin-right: 20px;
    }

    .history_page_header_btn {
      width: 80px;
      height: 34px;
      margin-left: 10px;
      background-color: rgb(12, 81, 154);
      color: rgb(246, 249, 252);
      border: none;
      font-size: 16px;
    }
  }

  .history_page_content {
    width: 100%;
    height: 86%;

    .history_page_content_title {
      width: 100%;
      height: 40px;
      line-height: 40px;
      border: 1px solid rgb(8, 87, 143);
      text-align: left;
      font-size: 16px;
      margin-bottom: 10px;
      padding-left: 10px;
    }

    .history_page_content_list {
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: left;
      font-size: 14px;
      margin: 5px 0;
      background-color: rgb(0, 45, 78);
      padding-left: 10px;

      .history_page_content_list_btn1 {
        background-color: #e19c43;
        margin-right: 10px;
        border-radius: 5px;
        border: none;
        height: 25px;
        line-height: 25px;
        width: 60px;
      }

      .history_page_content_list_btn2 {
        background-color: #018b91;
        border-radius: 5px;
        border: none;
        height: 25px;
        line-height: 25px;
        width: 60px;
      }
    }
  }

  .history_page_fotter {
    width: 100%;
    height: 5%;
    padding-top: 5px;
    text-align: center;

    .pagination {
      .menu_1 {
        color: white;
      }
    }
  }
}
</style>
<style scoped>
.menu_1 >>> .ant-pagination-jump-next {
  border: 1px solid rgb(204, 204, 204);
}

.menu_1 >>> .ant-pagination-jump-prev {
  border: 1px solid rgb(204, 204, 204);
}

.menu_1 >>> .ant-pagination-item {
  border: 1px solid rgb(204, 204, 204);
  background-color: rgb(2, 35, 58);
}

.menu_1 >>> .ant-pagination-item a {
  color: white;
}

.menu_1 >>> .ant-pagination-item-active a {
  color: white;
  background-color: rgb(11, 62, 117);
}
.menu_1 >>> .ant-pagination-item-active {
  border: none;
}
.menu_1 >>> .anticon {
  color: rgb(204, 204, 204);
}
.menu_1 >>> .ant-pagination-jump-next .ant-pagination-item-container .ant-pagination-item-ellipsis {
  color: rgb(204, 204, 204);
}
.menu_1 >>> .ant-pagination-jump-prev .ant-pagination-item-container .ant-pagination-item-ellipsis {
  color: rgb(204, 204, 204);
}
.menu_1 >>> .ant-pagination-prev .ant-pagination-item-link {
  background-color: rgb(2, 35, 58) !important;
}
.menu_1 >>> .ant-pagination-prev:hover .ant-pagination-item-link {
  color: none;
  border-color: none;
}
.menu_1 >>> .ant-pagination-next .ant-pagination-item-link {
  background-color: rgb(2, 35, 58) !important;
  color: none;
  border-color: none;
}
.menu_1 >>> .ant-pagination-options-quick-jumper input {
  color: rgb(204, 204, 204);
  background-color: rgb(2, 35, 58);
}
</style>
