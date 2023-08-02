<template>
  <common-layout>
    <div class="top">
      <div class="header">
        <img alt="logo" class="logo" src="@/assets/images/logo.png" />
        <span class="title">{{ systemName }}</span>
      </div>
      <div class="desc">{{ copyright }}</div>
    </div>
    <div class="mainsd">
      <a-alert
        message="密码中必须字母开头、包含数字或下划线，且在8~16位"
        class="alerts"
        type="warning"
        show-icon
      >
        <!-- <div slot="description">
          <div>-- 英文数字特殊字符</div>
          <div>-- 英文数字</div>
          <div>-- 英文特殊字符</div>
        </div> -->
      </a-alert>
      <a-form-model
        ref="passwordForm"
        :model="passwordForm"
        :rules="passwordRules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item has-feedback label="输入原密码" prop="oldpassword">
          <a-input
            v-model="passwordForm.oldpassword"
            type="password"
            placeholder="请输入原密码"
            allowClear
            autocomplete="off"
          />
        </a-form-model-item>
        <a-form-model-item has-feedback label="输入新密码" prop="password">
          <a-input
            v-model="passwordForm.password"
            type="password"
            placeholder="请输入新密码"
            allowClear
            autocomplete="off"
          />
        </a-form-model-item>
        <a-form-model-item has-feedback label="再次输入新密码" prop="checkPass">
          <a-input
            v-model="passwordForm.checkPass"
            type="password"
            placeholder="请再次输入新密码"
            allowClear
            autocomplete="off"
          />
        </a-form-model-item>
        <div class="buttons">
          <a-button type="primary" :loading="loading" @click="onPasswordSubmit">
            保存提交
          </a-button>
        </div>
      </a-form-model>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout";
// import Cookie from "js-cookie";
import md5 from "md5";
import { logout } from "@/services/user";
import { user_editpassword } from "@/services/user";
export default {
  name: "Login",
  components: { CommonLayout },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      passwordForm: {},
      loading: false,
      passwordRules: {
        oldpassword: [
          {
            required: true,
            message: "请输入原密码",
            trigger: "blur",
          },
          {
            min: 4,
            message: "原密码长度最小为4",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入新密码",
            trigger: "change",
          },
          {
            min: 8,
            message: "新密码长度最小为8",
            trigger: "change",
          },
          {
            max: 16,
            message: "新密码长度最长为16",
            trigger: "change",
          },
          {
            required: true,
            validator: this.validators,
          },
        ],
        checkPass: [
          {
            validator: (rule, value, callback) => {
              if (value !== this.passwordForm.password) {
                callback(new Error("两次输入的密码不一致!"));
              } else {
                callback();
              }
            },
            trigger: "change",
          },
        ],
      },
    };
  },
  computed: {
    systemName() {
      return this.$store.state.setting.systemName;
    },
    copyright() {
      return this.$store.state.setting.copyright;
    },
  },
  created() {},
  mounted() {},
  methods: {
    onPasswordSubmit() {
      this.$refs.passwordForm.validate((valid) => {
        if (valid) {
          const formData = Object.assign(
            {},
            {
              oldpassword: md5(this.passwordForm.oldpassword),
              password: md5(this.passwordForm.password),
            }
          );
          this.loading = true;
          user_editpassword(formData)
            .then((response) => {
              this.$message.success(response.data.message);
              this.loading = false;
              logout();
              this.$router.push("/");
            })
            .catch((error) => {
              this.loading = false;
              this.$message.error(error.response.data.message);
            });
        } else {
          return false;
        }
      });
    },
    pPattern(string) {
      if (string.length >= 8 && string.length <= 16) {
        var pattern_1 =
          /^.*(?=.{8,16})(?=.*\d)(?=.*[a-zA-Z]{1,})(?=.*[!@#$%^&*?\(\)]).*$/;
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
    validators(rule, value, callback) {
      if (!value) {
        callback();
      } else {
        var datas = this.pPattern(value);
        if (datas) {
          callback("请按照密码规则填写新密码！");
        } else {
          callback();
        }
      }
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
  .mainsd {
    margin: 50px 30%;
  }
  .alerts {
    margin: 20px 0;
  }
  .buttons {
    width: 100%;
    text-align: center;
  }
}
</style>
<style scoped>
.mainsd >>> .ant-col-6 {
  text-align: center;
}
</style>
