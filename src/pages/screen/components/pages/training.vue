<template>
  <div class="info_rights">
    <a-row style="height: 100%">
      <a-col :span="4" style="height: 100%; border-right: 1px dashed #15527b">
        <div class="left_channel">
          <div :class="index == select ? 'selects channel_item' : 'channel_item'" v-for="(items, index) in channel" :key="index" @click="selectchannel(index)">{{ items }}</div>
        </div>
      </a-col>
      <a-col :span="20" style="height: 100%">
        <div class="right_channel">
          <div class="right_channel_header">
            <input type="text" placeholder="请输入搜索的内容" class="right_channel_header_inputArea" />
            <button type="submit" class="right_channel_header_btn">
              <a-icon type="search" style="margin-right: 5px" />
              搜索
            </button>
            <button class="right_channel_header_btn">
              <a-icon type="upload" style="margin-right: 5px" />
              导出
            </button>
            <button class="right_channel_header_btn">
              <a-icon type="plus-circle" style="margin-right: 5px" />
              添加
            </button>
          </div>
          <div class="right_channel_content">
            <div class="right_channel_content_title">
              <span style="width: 15%; height: 40px; float: left">名称</span>
              <span style="width: 10%; height: 40px; float: left">是否公开</span>
              <span style="width: 25%; height: 40px; float: left">创建时间</span>
              <span style="width: 20%; height: 40px; float: left">更新时间</span>
              <span style="width: 10%; height: 40px; float: left">备注</span>
              <span style="width: 20%; height: 40px; float: left">操作</span>
            </div>
            <div class="right_channel_content_list" v-for="item in items">
              <span style="width: 15%; height: 40px; float: left" name="deviceId">{{ item.deviceId }}</span>
              <span style="width: 10%; height: 40px; float: left" name="deviceName">{{ item.deviceName }}</span>
              <span style="width: 25%; height: 40px; float: left" name="deviceType">{{ item.date }}</span>
              <span style="width: 20%; height: 40px; float: left" name="deviceState">{{ item.deviceType }}</span>
              <span style="width: 10%; height: 40px; float: left" name="date">{{ item.sort }}</span>
              <span style="width: 20%; height: 40px; float: left" name="position">
                <button class="right_channel_content_list_btn">查看</button>
                <button class="right_channel_content_list_btn1">设置</button>
                <button class="right_channel_content_list_btn2">删除</button>
              </span>
            </div>
          </div>
          <div class="right_channel_fotter">
            <div class="pagination">
              <a-pagination show-quick-jumper :default-current="2" :total="100" @change="onChange" class="menu_1" :show-total="total => `共 ${total} 条信息`" />
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script>
export default {
  name: 'Cards',
  data() {
    return {
      channel: ['题库类别', '单选题库', '多选题库', '判断题库', '试卷配置', '成绩查询'],
      select: 0,
      selectAll: false,
      selectedList: [],

      items: [
        {
          key: '1',
          deviceId: '工作培训考核',
          deviceName: '是',
          deviceType: '2020-10-07 12:06:12',
          date: '2020-10-07 12:06:12',
          sort: '考核',
        },
        {
          key: '2',
          deviceId: '工作培训考核',
          deviceName: '是',
          deviceType: '2020-10-07 12:06:12',
          date: '2020-10-07 12:06:12',
          sort: '考核',
        },
        {
          key: '3',
          deviceId: '工作培训考核',
          deviceName: '是',
          deviceType: '2020-10-07 12:06:12',
          date: '2020-10-07 12:06:12',
          sort: '考核',
        },
        {
          key: '4',
          deviceId: '工作培训考核',
          deviceName: '是',
          deviceType: '2020-10-07 12:06:12',
          date: '2020-10-07 12:06:12',
          sort: '考核',
        },
      ],
    };
  },
  created() {},
  methods: {
    selectchannel(value) {
      console.log('value', value);
      this.select = value;
    },
    onChange(pageNumber) {
      console.log('Page: ', pageNumber);
    },
  },

  watch: {
    selectAll: function (value) {
      if (value) {
        this.selectedList = this.items.slice();
      } else {
        this.selectedList = [];
      }
    },
  },
};
</script>
<style lang="less">
.right_channel_header {
  width: 100%;
  height: 9%;

  .right_channel_header_inputArea {
    background-color: rgb(8, 60, 98);
    color: rgb(102, 159, 198);
    border: none;
    height: 34px;
    width: 250px;
    font-size: 16px;
    padding-left: 10px;
    margin-right: 20px;
  }

  .right_channel_header_btn {
    width: 80px;
    height: 34px;
    margin-left: 10px;
    background-color: rgb(12, 81, 154);
    color: rgb(246, 249, 252);
    border: none;
    font-size: 16px;
  }
}

.right_channel_content {
  width: 100%;
  height: 86%;

  .right_channel_content_title {
    width: 100%;
    height: 40px;
    line-height: 40px;
    border: 1px solid rgb(8, 87, 143);
    text-align: left;
    font-size: 16px;
    margin-bottom: 10px;
    padding-left: 10px;
  }

  .right_channel_content_list {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: left;
    font-size: 14px;
    margin: 5px 0;
    background-color: rgb(0, 45, 78);
    padding-left: 10px;
    clear: both;

    .right_channel_content_list_btn {
      background-color: rgb(1, 139, 145);
      margin-right: 10px;
      // border-radius: 5px;
      border: none;
      height: 30px;
      line-height: 30px;
      width: 60px;
    }

    .right_channel_content_list_btn1 {
      background-color: rgb(59, 137, 233);
      margin-right: 10px;
      // border-radius: 5px;
      border: none;
      height: 30px;
      line-height: 30px;
      width: 60px;
    }

    .right_channel_content_list_btn2 {
      background-color: rgb(225, 156, 67);
      // border-radius: 5px;
      border: none;
      height: 30px;
      line-height: 30px;
      width: 60px;
    }
  }
}

.right_channel_fotter {
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

.anquanzhishu {
  display: flex;
  height: calc(6% - 5px);

  img {
    width: 30px;
    height: 52px;
    margin-left: -5px;
  }

  div {
    width: calc(100% - 25px);
    height: 40px;
    font-size: 16px;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 500;
    text-align: left;
    color: #ffffff;
    line-height: 40px;
    letter-spacing: 1px;
    padding-left: 20px;
    margin: 5px 0;
    background-image: url('../../img/baojinleibie.png');
    background-size: 100% 100%;
  }
}
</style>
<style scoped>
.info_rights {
  height: calc(100% - 40px);
  width: 100%;
  padding: 30px;
  background-image: url('./images/info_bg.png') !important;
  background-size: 100% 100%;
  margin: 20px auto;
}

.left_channel {
  width: 100%;
  height: 100%;
  padding-right: 30px;
}

.channel_item {
  padding: 5px 15px;
  font-size: 16px;
  font-family: PingFang SC, PingFang SC-Regular;
  font-weight: 400;
  color: #eef9ff;
  line-height: 33px;
  letter-spacing: 1px;
  cursor: pointer;
  margin-bottom: 12px;
}

.selects {
  background-image: url('./images/files_channel.png') !important;
  background-size: 100% 100%;
}

.right_channel {
  width: 100%;
  height: 100%;
  padding-left: 30px;
}

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
