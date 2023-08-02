<template>
  <div id="wx_box"></div>
  
</template>

<script>
import { mapState } from "vuex";
import { SSO } from "@/services/api";
import { getQuery } from "@/utils/util";
const wwLogin = require("@/assets/sso/WorkWeChat/Qrcode/wwLogin.js");
require("@/assets/sso/WeChat/Qrcode/wxLogin.js");
export default {
  name: "forms",
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapState("applications", ["menu", "tabs", "active"]),
    query() {
      return getQuery();
    },
  },
  mounted() {
    if (this.query && this.query.state) {
      var method = `on${this.query.state}`;
      if (this[method] && typeof this[method] == "function") {
        this[method]();
      }
    }
  },

  methods: {
    onBindWorkWeChat() {
      const url = `${window.location.origin}${SSO}?userid=${this.query.userid}`;
      const params = {
        self_redirect: true,
        id: "wx_box",
        appid: "wwa148964e2f824306",
        agentid: "1000006",
        redirect_uri: encodeURIComponent(url),
        state: this.query.state,
      };
      new wwLogin(params);
    },
    onUnboundWorkWeChat() {
      const url = `${window.location.origin}${SSO}?userid=${this.query.userid}`;
      const params = {
        self_redirect: true,
        id: "wx_box",
        appid: "wwa148964e2f824306",
        agentid: "1000006",
        redirect_uri: encodeURIComponent(url),
        state: this.query.state,
      };
      new wwLogin(params);
    },

    onBindWeChat() {
      const url = `${window.location.origin}${SSO}?userid=${this.query.userid}`;
      
      const params = {
        self_redirect: true,
        id: "wx_box",
        appid: "wx8e44853044d1beb0",
        scope: "snsapi_login",
        redirect_uri: url,
        state: this.query.state,
      };
      new window.WxLogin(params);
    },
    onUnboundWeChat() {
      const url = `${window.location.origin}${SSO}?userid=${this.query.userid}`;
      
      const params = {
        self_redirect: true,
        id: "wx_box",
        appid: "wx8e44853044d1beb0",
        scope: "snsapi_login",
        redirect_uri: url,
        state: this.query.state,
      };
      new window.WxLogin(params);
    },


  },
};
</script>

<style></style>
