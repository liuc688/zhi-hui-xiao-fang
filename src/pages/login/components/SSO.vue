<template>
  <common-layout>
    <div class="top">
      <div class="header">
        <img alt="logo" class="logo" src="@/assets/images/logo.png" />
        <!-- <span class="title">尚可集约化信息管理系统v3.1.1</span> -->
        <span class="title">尚可集约化信息管理系统 v3.1.1</span>
      </div>
      <div class="desc">您正在使用sso第三方登录...</div>
    </div>
    <div class="loading">
      <div class="text">
        <span>{{ message }}</span>
      </div>
      <a-progress
        :stroke-color="{
          from: '#108ee9',
          to: '#87d068',
        }"
        :percent="100"
        status="active"
        :showInfo="false"
      />
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout";
import { getQuery } from "@/utils/util";
import { connect_token, user_info } from "@/services/user";
import { mapMutations } from "vuex";
import { setAuthorization } from "@/utils/request";
import qs from "qs";
export default {
  name: "SSO",
  components: { CommonLayout },
  data() {
    return {
      logging: false,
      message: "登陆中...",
      error: "",
      form: this.$form.createForm(this),
    };
  },
  computed: {
    query() {
      return getQuery();
    },
  },
  created() {
    if (this.query && this.query.state) {
      var method = `on${this.query.state}`;
      if (this[method] && typeof this[method] == "function") {
        this[method]({
          code: this.query.code,
        });
      }
    }
  },
  methods: {
    ...mapMutations("account", ["setUser", "setPermissions", "setRoles"]),
    ...mapMutations("websocket", ["setId"]),
    onWorkWeChatQrCode(query) {
      connect_token(
        qs.stringify({
          client_secret: "Saunk2019",
          client_id: "workwechat",
          grant_type: "WorkWeChatQrCode",
          code: query.code,
          scope: "offline_access workwechat",
        })
      )
        .then((response) => {
          this.message = "登录成功!正在获取用户信息....";
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
            .then((res) => {
              const user = res.data.data;
              this.setUser(user);
              this.setPermissions(user.permissions);
              this.setRoles(user.roles);
              this.setId(user.guid);
              this.$router.push({
                path: "/desktop",
              });
              this.$message.success("登录成功!", 3);
            })
            .catch((error) => {
              this.$message.error(error.message);
              this.$error({
                title: "获取用户信息失败",
                content: "请联系管理员或重新登录..." + error.message,
                onOk: () => {
                  window.location = "/";
                },
              });
            });
        })
        .catch((error) => {
          this.$error({
            title: "登录失败",
            content: "请联系管理员或重新登录...",
            onOk: () => {
              window.location = "/";
            },
          });
        });
    },
    onWeChatQrCode(query) {
      connect_token(
        qs.stringify({
          client_secret: "Saunk2019",
          client_id: "wechat",
          grant_type: "WeChatQrCode",
          code: query.code,
          scope: "offline_access wechat",
        })
      )
        .then((response) => {
          console.log('response',response);
          
          this.message = "登录成功!正在获取用户信息....";
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
            .then((res) => {
              const user = res.data.data;
              this.setUser(user);
              this.setPermissions(user.permissions);
              this.setRoles(user.roles);
              this.setId(user.guid);
              this.$router.push({
                path: "/desktop",
              });
              this.$message.success("登录成功!", 3);
            })
            .catch((error) => {
              this.$message.error(error.message);
              this.$error({
                title: "获取用户信息失败",
                content: "请联系管理员或重新登录..." + error.message,
                onOk: () => {
                  window.location = "/";
                },
              });
            });
        })
        .catch((error) => {
          this.$error({
            title: "登录失败",
            content: `${error.response.data.message},请联系管理员或重新登录...`,
            onOk: () => {
              window.location = "/";
            },
          });
        });
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
        font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica,
          sans-serif;
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
  .loading {
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
    .text {
      text-align: center;
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
