<template>
  <a-tabs
    :activeKey="activeKey"
    style="height: 100%; overflow-y: auto"
    @tabClick="onTabClick"
  >
    <a-tab-pane key="info" tab="基本信息">
      <a-card :bordered="false">
        <a-col :span="18">
          <a-form-model
            ref="infoForm"
            :model="infoForm"
            layout="vertical"
            :rules="infoRules"
          >
            <a-form-model-item label="用户名" prop="username">
              <a-input v-model="infoForm.username" disabled />
            </a-form-model-item>
            <a-form-model-item label="用户昵称" prop="nickname">
              <a-input v-model="infoForm.nickname" />
            </a-form-model-item>

            <a-form-model-item label="手机号码" prop="mobile">
              <a-input v-model="infoForm.mobile" />
            </a-form-model-item>
            <a-form-model-item label="真实姓名" prop="realname">
              <a-input v-model="infoForm.realname" />
            </a-form-model-item>
            <a-form-model-item label="身份证号" prop="identity">
              <a-input v-model="infoForm.identity" />
            </a-form-model-item>
            <a-form-model-item label="性别" prop="sex">
              <a-radio-group v-model="infoForm.sex">
                <a-radio-button value="男"> 男 </a-radio-button>
                <a-radio-button value="女"> 女 </a-radio-button>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="户籍地" prop="house">
              <a-input v-model="infoForm.house" />
            </a-form-model-item>
            <a-form-model-item label="家庭住址" prop="address">
              <a-input v-model="infoForm.address" />
            </a-form-model-item>
            <a-form-model-item label="生日" prop="birthday">
              <a-date-picker
                v-model="infoForm.birthday"
                valueFormat="YYYY-MM-DD"
              />
            </a-form-model-item>
            <a-form-model-item label="婚姻状况" prop="marriage">
              <a-input v-model="infoForm.marriage" />
            </a-form-model-item>
            <a-form-model-item label="政治面貌" prop="political">
              <a-select v-model="infoForm.political" defaultValue="普通居民">
                <a-select-option
                  :value="item"
                  v-for="(item, index) in politicals"
                  :key="index"
                  >{{ item }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="邮箱" prop="email">
              <a-input v-model="infoForm.email" />
            </a-form-model-item>
            <a-form-model-item>
              <a-button type="primary" @click="onInfoSubmit">
                保存修改
              </a-button>
            </a-form-model-item>
          </a-form-model>
        </a-col>
        <a-col :offset="1" :span="5">
          <a-upload
            name="file"
            list-type="picture-card"
            :show-upload-list="false"
            :action="action"
            :headers="headers"
            @change="upLoadChange"
          >
            <img
              v-if="avatar.url"
              :src="avatar.url"
              alt="avatar"
              style="width: 120px;height: 120px;border-radius: 50%;object-fit: cover;"
            />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">上传头像</div>
            </div>
          </a-upload>
        </a-col>
      </a-card>
    </a-tab-pane>
    <a-tab-pane key="password" tab="修改密码">
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
      <a-card :bordered="false">
        <a-form-model
          ref="passwordForm"
          :model="passwordForm"
          :rules="passwordRules"
          layout="vertical"
        >
          <a-form-model-item has-feedback label="输入原密码" prop="oldpassword">
            <a-input placeholder="请输入原密码"
              v-model="passwordForm.oldpassword"
              type="password"
              autocomplete="off"
            />
          </a-form-model-item>
          <a-form-model-item has-feedback label="输入新密码" prop="password">
            <a-input placeholder="请输入新密码"
              v-model="passwordForm.password"
              type="password"
              autocomplete="off"
            />
          </a-form-model-item>
          <a-form-model-item
            has-feedback
            label="再次输入新密码"
            prop="checkPass"
          >
            <a-input placeholder="请再次输入新密码"
              v-model="passwordForm.checkPass"
              type="password"
              autocomplete="off"
            />
          </a-form-model-item>

          <a-form-model-item>
            <a-button type="primary" @click="onPasswordSubmit">
              保存提交
            </a-button>
          </a-form-model-item>
        </a-form-model>
      </a-card>
    </a-tab-pane>
    <a-tab-pane key="init" tab="初始化信息" force-render v-if="status > 1">
      <a-card :bordered="false">
        <template v-if="onXOr(16)">
          <a-form-model-item has-feedback label="初始化用户名">
            <a-input v-model="initUsername">
              <a slot="addonAfter" @click="onInitUsername(initUsername)">
                <a-icon type="edit" />
              </a>
            </a-input>
          </a-form-model-item>
        </template>
        <template v-if="onXOr(8)">
          <a-form-model-item has-feedback label="初始密码">
            <a-input v-model="initPassword" type="password">
              <a slot="addonAfter" @click="onInitPassword(initPassword)">
                <a-icon type="edit" />
              </a>
            </a-input>
          </a-form-model-item>
        </template>
        <template v-if="onXOr(2)">
          <a-form-model-item has-feedback label="初始化手机号码">
            <a-input v-model="initMobile">
              <a slot="addonAfter" @click="onInitMobile(initMobile)">
                <a-icon type="edit" />
              </a>
            </a-input>
          </a-form-model-item>
        </template>
        <template v-if="onXOr(32)">
          <a-form-model-item has-feedback label="初始化身份证号">
            <a-input v-model="initIdentity">
              <a slot="addonAfter" @click="onInitIdentity(initIdentity)">
                <a-icon type="edit" />
              </a>
            </a-input>
          </a-form-model-item>
        </template>
        <template v-if="!onXOr(16) && !onXOr(8) && !onXOr(2) && !onXOr(32)">
          <a-result>
            <span slot="title" style="color: #cbcbcb">
              您没有需要初始化的信息
            </span>
            <template #icon>
              <a-icon type="smile" theme="twoTone" />
            </template>
          </a-result>
        </template>
      </a-card>
    </a-tab-pane>
    <!-- <a-tab-pane key="SSO" tab="第三方登录">
      <a-card>
        <a-form-model-item has-feedback label="微信">
          <a @click="onBindWeChat">绑定</a>
          <a-divider type="vertical" />
          <a @click="onUnboundWeChat">解绑</a>
        </a-form-model-item>
        <a-form-model-item has-feedback label="企业微信">
          <a @click="onBindWorkWeChat">绑定</a>
          <a-divider type="vertical" />
          <a @click="onUnboundWorkWeChat">解绑</a>
        </a-form-model-item>
        <SSOBind v-if="false"></SSOBind>
      </a-card>
    </a-tab-pane> -->
  </a-tabs>
</template>

<script>
import { mapState } from "vuex";
import Cookie from "js-cookie";
import md5 from "md5";
import { FormUpload } from "@/services/api";
import {
  user_info,
  user_editinfo,
  user_editpassword,
  user_initusername,
  user_initpassword,
  user_initmobile,
  user_initidentity,
} from "@/services/user";
import SSOBind from "./components/SSOBind";

export default {
  name: "user",
  components: {
    SSOBind,
  },
  props: {
    id: {
      type: String,
    },
    data: {
      //传递的数据
      type: Object,
      default: () => {
        return {};
      },
    },
    refresh: {
      type: Function,
      default: () => {
        console.log("onRefresh");
      },
    },
  },
  computed: {
    ...mapState("setting", ["animate"]),
    headers() {
      return {
        Authorization: Cookie.get("Authorization"),
      };
    },
  },
  data() {
    return {
      user: {},
      activeKey: "info",
      loading: false,
      infoForm: {},
      infoRules: {
        nickname: [
          {
            required: true,
            message: "请填写用户昵称",
            trigger: "blur",
          },
          {
            min: 2,
            message: "昵称长度最小为2",
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            message: "请填手机号码",
            trigger: "blur",
          },
          {
            min: 11,
            max: 11,
            message: "手机长度为11",
            trigger: "blur",
          },
          {
            pattern: "^1[3-9]\\d{9}$",
            message: "请输入正确的手机号",
          },
        ],
        realname: [
          {
            required: true,
            message: "请填写用户真实姓名",
            trigger: "blur",
          },
        ],
      },
      passwordForm: {},
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
      politicals: [
        "中共党员",
        "中共预备党员",
        "共青团员",
        "民革党员",
        "民盟盟员",
        "民建会员",
        "民进会员",
        "农工党党员",
        "致公党党员",
        "九三学社社员",
        "台盟盟员",
        "无党派人士",
        "普通居民",
      ],
      status: 0,
      initPassword: null,
      initMobile: null,
      initUsername: null,
      initIdentity: null,
      avatar: {
        name: null,
        status: null,
        type: null,
        uid: null,
        url: null,
      },
      action: FormUpload,
      layer: undefined,
    };
  },
  created() {
    console.log(this.data);
    this.onLoad();
  },
  mounted() {},
  authorize: {},
  methods: {
    onLoad() {
      user_info()
        .then((response) => {
          const data = response.data.data;
          this.$nextTick(() => {
            this.infoForm = Object.assign(
              {},
              {
                username: data.username,
                nickname: data.nickname,
                realname: data.realname,
                mobile: data.mobile,
                sex: data.sex,
                house: data.house,
                address: data.address,
                identity: data.identity,
                birthday: data.birthday,
                marriage: data.marriage,
                political: data.political,
                email: data.email,
              }
            );
            this.avatar = data.avatar;
            this.status = data.status;
            this.initUsername = data.username;
            this.initMobile = data.mobile;
            this.initIdentity = data.identity;
          });
          this.user = data;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    upLoadChange(info) {
      if (info.file.status === "done") {
        var data = info.file.response.data;
        this.avatar = {
          name: info.file.name,
          status: info.file.status,
          type: info.file.type,
          uid: info.file.uid,
          url: data.url,
        };
      }
    },
    onInfoSubmit() {
      this.$refs.infoForm.validate((valid) => {
        if (valid) {
          const formData = Object.assign(this.infoForm, {
            avatar: this.avatar,
          });
          this.loading = true;
          user_editinfo(formData)
            .then((response) => {
              this.$message.success(response.data.message);
              this.onLoad();
              this.$emit("refresh", {});
              this.loading = false;
            })
            .catch((error) => {
              console.log("error", error);
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
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
              this.onLoad();
              this.$emit("refresh", {});
              this.$refs.passwordForm.resetFields();
              this.loading = false;
            })
            .catch((error) => {
              this.$message.error(error.response.data.message);
            });
        } else {
          return false;
        }
      });
    },
    onXOr(status) {
      const value = (this.status & status) == status;
      return value;
    },
    onInitUsername(username) {
      user_initusername({
        id: this.user.id,
        username: username,
      })
        .then((response) => {
          this.$message.success(response.data.message);
          this.onLoad();
        })
        .catch((error) => {
          this.$message.error(error.response.data.message);
        });
    },
    onInitPassword(password) {
      user_initpassword({
        id: this.user.id,
        password: md5(password),
      })
        .then((response) => {
          this.$message.success(response.data.message);
          this.onLoad();
        })
        .catch((error) => {
          this.$message.error(error.response.data.message);
        });
    },
    onInitMobile(mobile) {
      user_initmobile({
        id: this.user.id,
        mobile: mobile,
      })
        .then((response) => {
          this.$message.success(response.data.message);
          this.onLoad();
        })
        .catch((error) => {
          this.$message.error(error.response.data.message);
        });
    },

    onInitIdentity(identity) {
      user_initidentity({
        id: this.user.id,
        identity: identity,
      })
        .then((response) => {
          this.$message.success(response.data.message);
          this.onLoad();
        })
        .catch((error) => {
          this.$message.error(error.response.data.message);
        });
    },
    onBindWorkWeChat() {
      this.onIFarme("绑定企业微信", { state: "BindWorkWeChat" });
    },
    onUnboundWorkWeChat() {
      this.onIFarme("解绑企业微信", { state: "UnboundWorkWeChat" });
    },
    onBindWeChat() {
      this.onIFarme("绑定微信", { state: "BindWeChat" });
    },
    onUnboundWeChat() {
      this.onIFarme("解绑微信", { state: "UnboundWeChat" });
    },
    onIFarme(title, params) {
      this.layer = this.$layer.iframe({
        type: 2,
        title: title,
        maxmin: false,
        shade: false,
        shadeClose: false,
        resize: false,
        zIndex: 500,
        area: ["auto", "450px"],
        scrollbar: false,
        content: {
          content: SSOBind, //传递的组件对象
          parent: this, //当前的vue对象
          data: {
            router: `/#/sso?userid=${this.user.id}&state=${params.state}`,
          },
        },

        full: function (layero) {
          ////执行最大化
          console.log(layero);
        },
        min: function (layero) {
          //执行最小化
          console.log(layero);
        },
        restore: function (layero) {
          //执行还原
          console.log(layero);
        },
        cancel: () => {
          //关闭弹窗事件
          console.log("关闭iframe");
        },
      });
    },
    onTabClick(e) {
      this.activeKey = e;
    },
    pPattern(string) {
      if (string.length >= 8 && string.length <= 16) {
        var pattern_1 =
          /^.*(?=.{8,16})(?=.*\d)(?=.*[a-z]{1,})(?=.*[!@#$%^&*?\(\)]).*$/;
        var pattern_2 = /^.*(?=.{8,16})(?=.*\d)(?=.*[a-z]{1,}).*$/;
        var pattern_3 = /^.*(?=.{8,16})(?=.*\d)(?=.*[!@#$%^&*?\(\)]).*$/;
        var pattern_4 = /^.*(?=.{8,16})(?=.*[a-z]{1,})(?=.*[!@#$%^&*?\(\)]).*$/;
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

<style>
.alerts {
  margin: 10px 24px;
}
</style>
