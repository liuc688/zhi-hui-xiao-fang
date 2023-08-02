<template>
  <div id="top-header">
    <div class="center-title">
      <img src="../img/logos.png" alt="" class="logos" />
      <img src="../img/title.png" alt="" />
    </div>

    <div class="top_left">
      <a-space :size="-10">
        <div :class="index == 1 ? 'left_long lights' : 'left_long'" @click="topage(1)">
          <img src="../img/home.png" alt="" class="logo_title" />
          首页
        </div>
        <div :class="index == 2 ? 'left_long lights' : 'left_long'" @click="topage(2)">
          <img src="../img/wulianwang.png" alt="" class="logo_title" />
          物联网检测
        </div>
        <div :class="index == 3 ? 'left_long lights' : 'left_long'" @click="topage(3)">
          <img src="../img/weibaoxuncha.png" alt="" class="logo_title" />
          维保巡查
        </div>
      </a-space>
      <div class="left_data">
        <!-- 2023-07-10 13:59:59
        <span>济南 29℃</span> -->
        <iframe
          scrolling="no"
          src="https://tianqiapi.com/api.php?style=tx&skin=pitaya&color=ffffff&fontsize=16"
          frameborder="0"
          width="100%"
          height="30"
          allowtransparency="true"
        ></iframe>
      </div>
    </div>
    <div class="top_right">
      <a-space :size="-10">
        <div :class="index == 4 ? 'right_long lights' : 'right_long'" @click="topage(4)">
          <img src="../img/znfx.png" alt="" class="logo_title" />
          智能分析
        </div>
        <div :class="index == 5 ? 'right_long lights' : 'right_long'" @click="topage(5)">
          <img src="../img/tjfx.png" alt="" class="logo_title" />
          统计分析
        </div>
        <div :class="index == 6 ? 'right_long lights' : 'right_long'" @click="topage(6)">
          <img src="../img/xtsz.png" alt="" class="logo_title" />
          系统设置
        </div>
        <a-dropdown :trigger="['click']" overlayClassName="dropDownClass">
          <div :class="index == 7 ? 'right_short lights' : 'right_short'" @click="e => e.preventDefault()">
            <img src="../img/user.png" alt="" class="logo_title" />
          </div>
          <a-menu slot="overlay" style="background-color: rgb(1, 50, 86)" class="menu">
            <a-menu-item key="1">
              <a class="menu_road" @click="() => (selectData = true)">个人资料</a>
              <a-modal
                v-model="selectData"
                title="个人资料"
                centered
                @ok="() => (selectData = false)"
                wrapClassName="web"
                cancelText="取消"
                okText="确定"
              >
                <input type="text" class="inputText" value="展厅" />
                <input type="text" class="inputText" value="电话" />
                <input type="text" class="inputText" value="邮箱" />
              </a-modal>
            </a-menu-item>
            <a-menu-item key="2">
              <a class="menu_road" @click="() => (alterPwd = true)">修改密码</a>
              <a-modal
                v-model="alterPwd"
                title="修改密码"
                centered
                @ok="() => (alterPwd = false)"
                wrapClassName="web"
                cancelText="取消"
                okText="确定"
              >
                <input type="text" class="inputText" placeholder="请输入您的新密码" />
              </a-modal>
            </a-menu-item>
            <a-menu-item key="3">
              <a class="menu_road" @click="() => (exit = true)">退出登录</a>
              <a-modal
                v-model="exit"
                title="退出云平台？"
                centered
                @ok="() => (exit = false)"
                wrapClassName="web1"
                cancelText="取消"
                okText="确定"
              >
                <span style="color: rgb(201, 215, 224); font-size: 16px">点击"确认"退出,或者点击"取消"返回</span>
              </a-modal>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-space>
      <div class="right_data">
        <img src="../img/tongzhi.png" alt="" />
        <span>通知</span>
        <img src="../img/yanshi.png" alt="" style="margin-left: 25px" />
        <span>演示账号</span>
      </div>
    </div>
    <div></div>
    <!-- <div>123123123</div> -->
  </div>
</template>

<script>
export default {
  name: 'TopHeader',
  params: {
    type: Object,
    default: () => {
      return {};
    },
  },
  event: {
    type: Function,
  },
  onOpen: {
    type: Function,
  },
  data() {
    return {
      index: 1,
      showList: false,

      selectData: false,
      alterPwd: false,
      exit: false,
    };
  },
  methods: {
    topage(value) {
      this.index = value;
      this.$emit('event', {
        method: 'selects',
        params: value,
      });
    },
  },
};
</script>

<style lang="less">
input:-moz-placeholder,
textarea:-moz-placeholder {
  color: rgb(201, 215, 224);
}

input:-ms-input-placeholder,
textarea:-ms-input-placeholder {
  color: rgb(201, 215, 224);
}

input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  color: rgb(201, 215, 224);
}

.dropDownClass {
  .ant-dropdown-menu-item {
    transition: none;
    margin: 10px;
  }
}

.web {
  .ant-modal-content {
    background: rgb(1, 50, 86);
    box-shadow: none;

    .ant-modal-close {
      color: white;
    }

    .ant-modal-header {
      background: rgb(1, 50, 86);
      border-color: rgb(2, 34, 56);
      .ant-modal-title {
        color: white;
        text-align: center;
      }
    }

    .ant-modal-body {
      text-align: center;
    }

    .ant-modal-footer {
      text-align: center;
      border-color: rgb(2, 34, 56);
    }
  }
}

.web1 {
  .ant-modal-content {
    background: rgb(1, 50, 86);
    box-shadow: none;
    padding: 20px 0;
    .ant-modal-close {
      color: white;
    }

    .ant-modal-header {
      background: rgb(1, 50, 86);
      border: none;

      .ant-modal-title {
        color: white;
        font-size: 18px;
      }
    }

    .ant-modal-body {
      text-align: center;
    }

    .ant-modal-footer {
      text-align: center;
      border: none;
      margin-top: 10px;
      .ant-btn,
      ant-btn ant-btn-primary {
        width: 80px;
      }
    }
  }
}

.inputText {
  width: 400px;
  margin-bottom: 10px;
  height: 40px;
  margin-left: 10px;
  background-color: rgb(6, 69, 114);
  border: none;
  color: white;
  padding-left: 20px;
}

.menu {
  transition: all !important;
}

.menu_road {
  color: white !important;
  transition: none !important;
  font-size: 16px;
  text-align: center;
}

.menu_road:hover {
  background: rgb(0, 45, 78) !important;
}
#top-header {
  position: relative;
  width: 100%;
  height: 140px;
  display: flex;
  // background-color: #00020699;
  justify-content: space-between;
  flex-shrink: 0;

  .header-center-decoration {
    width: 40%;
    height: 60px;
    margin-top: 30px;
  }

  .header-left-decoration,
  .header-right-decoration {
    width: 25%;
    height: 60px;
  }

  .center-title {
    position: absolute;
    font-size: 30px;
    font-weight: bold;
    left: 50%;
    top: 15px;
    transform: translateX(-50%);
    .logos {
      width: 37px;
      height: 37px;
      margin-right: 13px;
    }
    img {
      width: 315px;
      height: 25px;
    }
  }
  .top_right {
    width: 50%;
    text-align: left;
    margin-left: 300px;
    margin-top: 45px;
    font-size: 16px;
    margin-right: 12px;
    .right_long {
      display: inline-flex;
      height: 42px;
      padding: 8px 40px;
      background-image: url('../img/right_long.png');
      background-size: 100% 100%;
      cursor: pointer;
    }
    .right_long:hover {
      filter: brightness(2); /* 亮度值为1.2 */
    }
    .right_short:hover {
      filter: brightness(2); /* 亮度值为1.2 */
    }

    .right_short {
      display: inline-flex;
      height: 42px;
      cursor: pointer;
      padding: 8px 35px 8px 49px;
      background-image: url('../img/right_short_f.png');
      background-size: 100% 100%;
      img {
        margin-left: 10px;
      }
    }
    .right_data {
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      width: 100%;
      padding: 27px 40px 0 0;
      img {
        width: 22px;
        height: 22px;
      }
      span {
        height: 22px;
        line-height: 22px;
        font-size: 14px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        color: #eef9ff;
        letter-spacing: 1.4px;
      }
    }
  }
  .top_left {
    width: 50%;
    text-align: right;
    margin-top: 45px;
    font-size: 16px;
    margin-right: 300px;
    .left_long {
      display: inline-flex;
      // width: 186px;
      min-width: 185px;
      height: 42px;
      padding: 8px 40px;
      background-image: url('../img/left_long.png');
      background-size: 100% 100%;
      cursor: pointer;
    }
    .left_long:hover {
      filter: brightness(2); /* 亮度值为1.2 */
    }
    .left_data {
      text-align: left;
      font-size: 14px;
      color: #eef9ff;
      line-height: 20px;
      letter-spacing: 1.4px;
      margin: 27px 0 0 40px;
    }
  }
  .logo_title {
    width: 23px;
    height: 23px;
    margin-right: 9px;
  }
  .lights {
    filter: brightness(2); /* 亮度值为1.2 */
  }
}
</style>
