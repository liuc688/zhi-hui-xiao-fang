<template>
  <common-layout>
    <div class="top">
      <div class="header">
        <img alt="logo" class="logo" src="@/assets/images/logo.png" />
        <span class="title">{{ systemName }}</span>
      </div>
      <div class="desc">{{ VUE_APP_NAME }}</div>
    </div>
    <div class="login">
      <a-form @submit="onSubmit" :form="form">
        <a-tabs size="large" :tabBarStyle="{ textAlign: 'center' }" style="padding: 0 2px" :activeKey="activeKey" @tabClick="onTabClick">
          <a-tab-pane tab="账户密码登录" key="Default">
            <a-alert type="error" :closable="true" v-if="error" :message="error" @close="onClose" showIcon style="margin-bottom: 24px" />
            <a-form-item>
              <a-input
                autocomplete="autocomplete"
                size="large"
                placeholder="请输入账户"
                v-decorator="[
                  'name',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入账户名',
                        whitespace: true,
                      },
                    ],
                  },
                ]"
              >
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                size="large"
                placeholder="请输入密码"
                autocomplete="autocomplete"
                type="password"
                v-decorator="[
                  'password',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入密码',
                        whitespace: true,
                      },
                    ],
                  },
                ]"
              >
                <a-icon slot="prefix" type="lock" />
              </a-input>
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane tab="微信登录" key="WeChatQrCode" v-if="!VUE_APP_WAY">
            <div id="wx_box" style="text-align: center"></div>
          </a-tab-pane>
          <a-tab-pane tab="企业微信登录" key="WorkWeChatQrCode" v-if="!VUE_APP_WAY">
            <div id="ww_box" style="text-align: center"></div>
          </a-tab-pane>
          <!-- <a-tab-pane tab="手机号登录" key="Mobile">
            <a-form-item>
              <a-input size="large" placeholder="请输入手机号码"
                ><a-icon slot="prefix" type="mobile"
              /></a-input>
            </a-form-item>
            <a-form-item>
              <a-row :gutter="8" style="margin: 0 -4px">
                <a-col :span="16">
                  <a-input size="large" placeholder="请输入验证码"
                    ><a-icon slot="prefix" type="mail"
                  /></a-input>
                </a-col>
                <a-col :span="8" style="padding-left: 4px"
                  ><a-button
                    style="width: 100%"
                    class="captcha-button"
                    size="large"
                    >获取验证码</a-button
                  ></a-col
                >
              </a-row>
            </a-form-item>
          </a-tab-pane> -->
        </a-tabs>

        <!-- <div v-if="activeKey == 'Default'">
          <a-checkbox :checked="autologin" @change="onChange"
            >自动登录</a-checkbox
          >
          <a style="float: right">忘记密码</a>
        </div> -->
        <a-form-item v-if="activeKey == 'Default'">
          <a-button :loading="loading" style="width: 100%; margin-top: 24px" size="large" htmlType="submit" type="primary">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </common-layout>
</template>

<script>
import { SSO } from '@/services/api';
import CommonLayout from '@/layouts/CommonLayout';
import { connect_token, user_info } from '@/services/user';
import { setAuthorization } from '@/utils/request';
import { mapMutations } from 'vuex';
import md5 from 'md5';
import qs from 'qs';
const wwLogin = require('@/assets/sso/WorkWeChat/Qrcode/wwLogin.js');
require('@/assets/sso/WeChat/Qrcode/wxLogin.js');

export default {
  name: 'Login',
  components: { CommonLayout },
  data() {
    return {
      autologin: false,
      loading: false,
      error: '',
      activeKey: 'Default',
      VUE_APP_NAME: process.env.VUE_APP_NAME,
      VUE_APP_WAY: process.env.VUE_APP_WAY ? true : false,
      form: this.$form.createForm(this),
    };
  },
  computed: {
    systemName() {
      return this.$store.state.setting.systemName;
    },
  },
  created() {
    this.$router.push('/screen');
  },
  mounted() {},
  methods: {
    ...mapMutations('account', ['setUser', 'setPermissions', 'setRoles']),
    ...mapMutations('websocket', ['setId']),
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields(err => {
        if (!err) {
          this.loading = true;
          const username = this.form.getFieldValue('name');
          var passwords = this.form.getFieldValue('password');
          const password = md5(passwords);
          connect_token(
            qs.stringify({
              client_secret: 'Saunk2019',
              client_id: 'suncool',
              grant_type: 'password',
              username: username,
              password: password,
              scope: 'offline_access transfer',
            })
          )
            .then(response => {
              var millisecond = new Date().getTime();
              var expire_At = millisecond + response.data.expires_in * 1000;
              var expireAt = new Date(expire_At);
              var auth = {
                token: response.data.access_token,
                expireAt: expireAt,
                refresh_token: response.data.refresh_token,
                expires_in: expireAt.getTime(),
              };
              setAuthorization(auth);
              user_info()
                .then(response => {
                  const user = response.data.data;
                  this.setUser(user);
                  this.setPermissions(user.permissions);
                  this.setRoles(user.roles);
                  this.setId(user.guid);
                  var passwordes = this.pPattern(passwords);
                  if (passwordes) {
                    this.$message.error('密码格式简单,请修改密码！');
                    this.$router.push('/changepasswordes');
                  } else {
                    this.$router.push('/desktop');
                    this.$message.success(response.data.message, 3);
                    // this.$notification.open({
                    //   description: response.data.message,
                    //   icon: <a-icon type="check-circle" style="color: #00aaf0"/>,
                    // });
                  }
                })
                .catch(err => {
                  console.log(err.response);
                  // this.$message.error(err.response.data.message);
                  this.$notification.open({
                    message: '提示',
                    description: err.response.data.message,
                    icon: <a-icon type="exclamation-circle" style="color: red" />,
                  });
                });
              this.loading = false;
            })
            .catch(error => {
              // this.$message.error(error.response.data.message);
              this.$notification.open({
                message: '提示',
                description: error.response.data.message,
                icon: <a-icon type="exclamation-circle" style="color: red" />,
              });
              this.loading = false;
            });
        }
      });
    },
    pPattern(string) {
      if (string.length >= 8 && string.length <= 16) {
        var pattern_1 = /^.*(?=.{8,16})(?=.*\d)(?=.*[a-zA-Z]{1,})(?=.*[!@#$%^&*?\(\)]).*$/;
        var pattern_2 = /^.*(?=.{8,16})(?=.*\d)(?=.*[a-zA-Z]{1,}).*$/;
        var pattern_3 = /^.*(?=.{8,16})(?=.*\d)(?=.*[!@#$%^&*?\(\)]).*$/;
        var pattern_4 = /^.*(?=.{8,16})(?=.*[a-zA-Z]{1,})(?=.*[!@#$%^&*?\(\)]).*$/;
        if (pattern_1.test(string)) {
          //英文数字特殊字符
          return false;
        } else if (pattern_2.test(string)) {
          //英文数字
          return false;
        } else if (pattern_3.test(string)) {
          //数字特殊字符
          return false;
        } else if (pattern_4.test(string)) {
          //英文特殊字符
          return false;
        }
      }
      return true;
    },
    onInitWWLogin() {
      const url = `${window.location.origin}${SSO}?status=0`;
      const params = {
        id: 'ww_box',
        // appid: "wwa148964e2f824306",
        appid: 'wx442d943047428fb0',
        agentid: '1000006',
        redirect_uri: encodeURIComponent(url),
        state: 'WorkWeChatQrCode',
      };
      new wwLogin(params);
    },
    onInitWxLogin() {
      const url = `${window.location.origin}${SSO}?status=3`;
      const params = {
        id: 'wx_box',
        // appid: "wx8e44853044d1beb0",
        appid: 'wx442d943047428fb0',
        scope: 'snsapi_login',
        redirect_uri: url,
        state: 'WeChatQrCode',
      };
      new window.WxLogin(params);
    },
    onTabClick(e) {
      this.activeKey = e;
      if (this.activeKey == 'WeChatQrCode') {
        this.$nextTick(() => {
          this.onInitWxLogin();
        });
      }
      if (this.activeKey == 'WorkWeChatQrCode') {
        this.$nextTick(() => {
          this.onInitWWLogin();
        });
      }
    },
    onWeChatLogin() {
      this.activeKey = 'WorkWeChatQrCode';
      this.$nextTick(() => {
        this.onInitWWLogin();
      });
    },
    onClose() {
      this.error = false;
    },
    onChange() {
      this.autologin = !this.autologin;
    },
  },
};
</script>

<style lang="less" scoped>
.common-layout {
  .top {
    text-align: center;
    .header {
      height: 44px;
      line-height: 44px;
      a {
        text-decoration: none;
      }
      .logo {
        height: 44px;
        vertical-align: top;
        margin-right: 16px;
      }
      .title {
        font-size: 33px;
        color: @title-color;
        font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
        font-weight: 600;
        position: relative;
        top: 2px;
      }
    }
    .desc {
      font-size: 14px;
      color: @text-color-second;
      margin-top: 12px;
      margin-bottom: 40px;
    }
  }
  .login {
    width: 368px;
    margin: 0 auto;
    @media screen and (max-width: 576px) {
      width: 95%;
    }
    @media screen and (max-width: 320px) {
      .captcha-button {
        font-size: 14px;
      }
    }
    .icon {
      font-size: 24px;
      color: @text-color-second;
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: @primary-color;
      }
    }
  }
}
</style>
