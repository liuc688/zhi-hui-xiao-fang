<template>
  <div class="home">
    <!-- 桌面头部内容 -->
    <div class="headers">
      <ul class="headers-left">
        <li class="iconfont">
          <a target="_blank" :title="VUE_APP_NAME">&#xe602;</a>
        </li>
        <li class="iconfont" style="font-size: 14px">
          {{ VUE_APP_NAME }}
        </li>
        <li class="iconfont" style="font-size: 14px" @click="showModal">壁纸</li>
        <!-- <li class="iconfont" style="font-size: 14px" @click="onSchedule">
          日程
        </li> -->
      </ul>
      <!-- 页面右上角 -->
      <!-- animated fadeInRight -->
      <ul class="headers-right">
        <li class="iconfont" @click="personCenter">
          <span style="font-size: 14px">
            <a-avatar :size="22" icon="user" style="margin: 0 5px 4px 0" :src="userinfo.user.avatar.url || avatar" />
            {{ userinfo.user.nickname }}
          </span>
        </li>
        <li class="iconfont">
          <a-popconfirm title="您确定退出登录?" ok-text="确定" cancel-text="取消" @confirm="signout">&#xe603;</a-popconfirm>
        </li>
        <li class="iconfont" v-if="userinfo.user.role == 'admin'">
          <a-popconfirm title="您确定切换到系统管理吗?" ok-text="确定" cancel-text="取消" @confirm="onGateway"><a-icon type="setting"></a-icon></a-popconfirm>
        </li>
        <!-- 搜索 -->
        <!-- <li class="iconfont">&#xe607;</li> -->
        <!-- 音量 -->
        <!-- <li class="iconfont">&#xe604;</li> -->
        <!-- 蓝牙 -->
        <!-- <li class="iconfont">&#xe606;</li> -->
        <!-- WIFI -->
        <!-- <li class="iconfont">&#xe605;</li> -->
        <!-- 菜单 -->

        <!-- <li class="iconfont">&#xe608;</li> -->
        <li class="iconfont" @click="onSchedule">
          <a-popover placement="bottom" :visible="scheduleVisible">
            <template slot="content">点击此处,查看个人日程任务</template>
            <span>{{ time }}</span>
          </a-popover>
        </li>
      </ul>
    </div>
    <!-- 桌面内容 -->
    <div @contextmenu.prevent="ondesktopmenu" class="content-hone" :style="{ backgroundImage: lisr ? 'url(' + bgSrc + ')' : '' }" @click="weatherHide">
      <ul class="app-list">
        <li class="list-item" v-for="item in desktops" @dblclick="openApplication(item)" :key="item.id">
          <a-badge :count="themes" v-if="item.name == 'infofilling'">
            <img :src="item.icon.url || iconUrl" :alt="item.title" />
          </a-badge>
          <a-badge :count="themese" v-else-if="item.name == 'online'">
            <img :src="item.icon.url || iconUrl" :alt="item.title" />
          </a-badge>
          <img v-else :src="item.icon.url || iconUrl" :alt="item.title" />
          <span class="spans">{{ item.title }}</span>
        </li>
      </ul>
    </div>
    <!-- 页面右下角 -->
    <!-- <div class="desktop" @contextmenu.prevent="onContextmenu"><img class="images" src="../../assets/images/coco.gif" alt="lion" /></div> -->
    <!-- 日程管理 -->
    <div class="desktop_topright" v-if="displays">
      <a-spin tip="Loading..." :spinning="spinning">
        <!-- <a-range-picker
          :placeholder="['初始日期', '结束日期']"
          format="YYYY-MM-DD"
          v-model="valuedates"
          @change="handleChange"
        />
        <a class="button_s" @click="getSchedule">查询</a> -->
        <!-- <a class="button_s" @click="resets">重置</a> -->
        <Schedule :events="events" :maximize="onScheduleMaximize" :hidden="() => (displays = false)" @onItemClick="onScheduleItemClick" @refresh="onScheduleRefresh"></Schedule>
      </a-spin>
    </div>
    <!-- 桌面底部列表 -->
    <div id="container" @click="weatherHide">
      <div id="dock">
        <ul>
          <template v-for="item in bottoms">
            <li @dblclick="openApplication(item)" :key="item.id">
              <span>{{ item.title }}</span>
              <a href="javascript:void(0)"><img :src="item.icon.url || iconUrl" /></a>
            </li>
          </template>
          <a-divider type="vertical" style="height: 45px; background-color: #bbbbbb; width: 2px" v-if="apps && apps.length && bottoms.length" />
          <a-popover placement="rightBottom" v-if="apps && apps.length" style="z-index: 1500">
            <span slot="title">
              <span>应用列表</span>
              <a @click="onCloseAllLayer" style="float: right">全部关闭</a>
            </span>
            <template slot="content">
              <a v-for="(item, index) in apps" :key="index" @click="onShowApp(item)">
                <p>
                  <img :src="item.icon.url || iconUrl" style="width: 35px" />
                  <span>{{ item.title }}</span>
                </p>
              </a>
            </template>
            <a-popover :visible="appsVisible">
              <template slot="content">此处查看已打开的应用程序</template>
              <li>
                <span>应用程序</span>
                <a href="javascript:void(0)"><img :src="iconUrl" /></a>
              </li>
            </a-popover>
          </a-popover>
        </ul>
      </div>
    </div>
    <div class="custorms" v-if="custormes">
      <div>
        <img src="../../assets/images/customer.png" alt="" @click="geturlweixin" />
        <a-icon type="close-circle" class="icon_ss" :style="{ fontSize: '24px' }" @click="hidencustorms" />
      </div>
    </div>
    <!-- 壁纸设置 -->
    <a-modal
      title="壁纸设置"
      :visible="visible"
      width="80%"
      :footer="false"
      @cancel="
        () => {
          this.visible = false;
        }
      "
    >
      <div class="wallpaper">
        <div class="content">
          <!-- 壁纸列表 -->
          <div v-for="(item, index) of backgroundList" :key="index + 1" class="bg-list" @click="choice" :class="[imgNum == index + 1 ? 'active' : '']">
            <img :data-id="index + 1" :src="item.url" />
            <div>{{ index + 1 }}</div>
          </div>
        </div>
      </div>
    </a-modal>
    <Applications v-if="false"></Applications>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';
import Applications from '../applications/';
import { background_list } from '@/services/background';
import { application_list } from '@/services/application';
import Schedule from '@/components/schedule';
import { user_info } from '@/services/user';
import { logout } from '@/services/user';
import { messages_paginate } from '@/services/messages';
import { schedule_list, schedule_risklist } from '@/services/schedule';
import { theme_paginate, message_paginate } from '@/services/infofilling';

export default {
  components: {
    Applications,
    Schedule,
  },
  data() {
    return {
      avatar: require('@/assets/images/avatar.jpeg'),
      loading: false,
      iconUrl: require('../../assets/images/4.png'),
      layer: undefined,
      visible: false,
      visiblePopover: false,
      imgNum: localStorage.getItem('id') || 1,
      imgSrc: '',
      time: '',
      setInter: null,
      weatherShow: false,
      bgSrc: '',
      displays: false,
      backgroundList: [],
      events: [],
      lisr: false,
      applications: [],
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {},
      messages: {},
      scheduleVisible: false,
      appsVisible: false,
      spinning: true,
      themes: 0,
      themese: 0,
      VUE_APP_NAME: process.env.VUE_APP_NAME,
      valuedates: [],
      custormes: false,
      connectInter: null,
    };
  },
  computed: {
    ...mapState('setting', ['theme', 'animate']),
    ...mapState('applications', ['apps']),
    ...mapGetters('websocket', ['client']),
    userinfo() {
      return {
        user: this.$store.getters['account/user'],
        permissions: this.$store.getters['account/permissions'],
        roles: this.$store.getters['account/roles'],
        routesConfig: this.$store.getters['account/routesConfig'],
      };
    },
    desktops() {
      return this.applications.filter(item => {
        return item.location === 'desktop';
      });
    },
    bottoms() {
      return this.applications.filter(item => {
        return item.location === 'bottom';
      });
    },
  },
  created() {
    clearInterval(this.setInter);
    this.setInter = setInterval(() => {
      this.newDate();
    }, 1000);
    this.setBg();
    this.init();
    if (this.userinfo.roles[0].operation.indexOf('infofilling') >= 0) {
      theme_paginate({ status: 0 })
        .then(res => {
          this.themes = res.data.data.total;
        })
        .catch(err => {
          console.log(err);
        });
    }
    if (this.userinfo.roles[0].operation.indexOf('online') >= 0) {
      message_paginate({ status: 0 })
        .then(res => {
          this.themese = res.data.data.total;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    //启动websocket
    this.startWebSocet();
    //轮询日程和消息
    this.startInterval();
  },
  filters: {
    ellipsis(value) {
      if (!value) return '';
      if (value.length > 8) {
        return value.slice(0, 8) + '...';
      }
      return value;
    },
  },
  watch: {
    displays(val) {
      if (!val) {
        this.scheduleVisible = true;
        setTimeout(() => {
          this.scheduleVisible = false;
        }, 1000 * 1.5);
      }
    },
    apps(val) {
      this.appsVisible = val.length ? true : false;
    },
    appsVisible(val) {
      if (val) {
        setTimeout(() => {
          this.appsVisible = false;
        }, 1000 * 1.5);
      }
    },
  },
  destroyed() {
    this.$layer.closeAll();
  },
  methods: {
    handleChange(date, dateString) {
      this.valuedates = dateString;
    },
    ...mapActions('websocket', ['onconnect', 'onopen', 'onclose', 'onmessage', 'onerror', 'joinchan']),
    ...mapMutations('account', ['setUser', 'setPermissions', 'setRoles']),
    ...mapMutations('websocket', ['setId']),
    ...mapMutations('applications', ['addApps', 'removeApps', 'setApps']),

    init() {
      Promise.all([user_info(), background_list(), application_list({ sort: 'sort' })]).then(response => {
        const user = response[0].data.data;
        this.form = user;
        this.setUser(user);
        this.setPermissions(user.permissions);
        this.setRoles(user.roles);
        this.setId(user.guid);
        this.backgroundList = response[1].data.data;
        this.applications = response[2].data.data;
      });
      this.getMessage();
      this.getSchedule();
      this.setApps([]);
      if (!this.events.length) {
        this.scheduleVisible = false;
      }
    },
    startWebSocet() {
      const that = this;
      that.connectInter = null;
      clearInterval(that.connectInter);
      that.connectInter = setInterval(() => {
        if (!this.client || this.client.readyState === 3) {
          that.connectWebSocket();
        }
      }, 1000 * 15);
    },
    connectWebSocket() {
      this.onconnect().then(() => {
        this.onmessage((params, e) => {
          switch (params.type) {
            case 'notification':
              this.openNotification(params.data);
              break;
            case 'application':
              this.popApplication(params.data);
              break;
            case 'message':
              this.getMessage();
              this.openMessage(params);
              break;
            default:
              break;
          }
        });
        this.onopen(() => {
          if (this.client) {
            this.ping = setInterval(() => {
              this.client.send(
                JSON.stringify({
                  type: 'ping',
                })
              );
            }, 15 * 1000);
          }
        });
      });
    },
    onSchedule() {
      this.displays = !this.displays;
    },
    onScheduleMaximize() {},
    onRefresh() {
      this.init();
    },
    openMessage({ title, details, notice, tag, application }) {
      if (notice) {
        const key = `open${Date.now()}`;
        if (tag.title) {
          title = `${title} - [${tag.title}]`;
        }
        this.$notification.info({
          key: key,
          message: title,
          description: details,
          duration: 4.5,
          btn: application
            ? render => {
                return render(
                  'a-button',
                  {
                    props: {
                      type: 'link',
                      size: 'small',
                    },
                    on: {
                      click: () => {
                        this.openApplication(application);
                        this.$notification.close(key);
                      },
                    },
                  },
                  `转到-> ${application.title}` || '查看详情'
                );
              }
            : undefined,
        });
      }
    },
    openNotification({ type, message, description, application, data, btn_title }) {
      const key = `open${Date.now()}`;
      this.$notification[type]({
        key: key,
        message: message,
        description: description,
        duration: 4.5,
        btn: application
          ? render => {
              return render(
                'a-button',
                {
                  props: {
                    type: 'link',
                    size: 'small',
                  },
                  on: {
                    click: () => {
                      this.openApplication(application);
                      this.$notification.close(key);
                    },
                  },
                },
                btn_title || '查看详情'
              );
            }
          : undefined,
      });
    },
    popApplication({ application, data }) {
      const app = this.applications.find(item => item.name == application);
      if (app) {
        const node = Object.assign(app, {
          data: data || {},
        });
        this.openApplication(node);
      }
    },
    openApplications(app) {
      this.layer = this.$layer.iframe({
        id: app.id,
        type: 2,
        title: app.title,
        maxmin: true,
        shade: false,
        shadeClose: false,
        resize: false,
        zIndex: 500,
        icon: app.icon,
        apps: this.apps,
        addApps: this.addApps,
        removeApps: this.removeApps,
        area: [app.width || '70%', app.height || '60%'],
        scrollbar: false,
        content: {
          content: Applications, //传递的组件对象
          parent: this, //当前的vue对象
          data: {
            type: app.type,
            name: app.name,
            router: app.router,
            refresh: this.onRefresh,
            open: this.openApplication,
            data: Object.assign(app.data, { ids: app.data.id }),
            appid: app.id,
          },
        },
        full: () => {
          //关闭弹窗事件
          console.log('关闭iframe');
        },
        min: function (layero) {
          //执行最小化
          console.log(layero);
        },
        restore: function (layero) {
          //执行还原
          console.log(layero);
        },
        cancel: app.cancel
          ? app.cancel
          : () => {
              //关闭弹窗事件
              console.log('关闭iframe');
            },
      });
    },
    openApplication(app) {
      this.layer = this.$layer.iframe({
        id: app.id,
        type: 2,
        title: app.title,
        maxmin: true,
        shade: false,
        shadeClose: false,
        resize: false,
        zIndex: 500,
        icon: app.icon,
        apps: this.apps,
        addApps: this.addApps,
        removeApps: this.removeApps,
        area: [app.width || '70%', app.height || '60%'],
        scrollbar: false,
        content: {
          content: Applications, //传递的组件对象
          parent: this, //当前的vue对象
          data: {
            type: app.type,
            name: app.name,
            router: app.router,
            refresh: this.onRefresh,
            open: this.openApplication,
            data: Object.assign(app.data, { ids: app.data.id }),
            appid: app.id,
          },
        },
        full: () => {
          //关闭弹窗事件
          console.log('关闭iframe');
        },
        min: function (layero) {
          //执行最小化
          console.log(layero);
        },
        restore: function (layero) {
          //执行还原
          console.log(layero);
        },
        cancel: app.cancel
          ? app.cancel
          : () => {
              //关闭弹窗事件
              console.log('关闭iframe');
            },
      });
    },
    onShowApp(app) {
      this.$layer.restore(app.id);
    },
    onCloseAllLayer() {
      const that = this;
      this.$confirm({
        title: '确定要关闭所有应用吗?',
        content: '应用关闭后，应用内的数据与操作将不会被保留，请谨慎操作！',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          that.$layer.closeAll();
          that.setApps([]);
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },
    ondesktopmenu(event) {
      this.$contextmenu({
        items: [
          {
            label: '刷新(R)',
            divided: true,
            icon: 'el-icon-refresh',
            onClick: () => {
              this.init();
            },
          },
        ],
        event,
        customClass: 'class-a',
        zIndex: 3,
        minWidth: 230,
      });
      return false;
    },
    onContextmenu(event) {
      this.$contextmenu({
        items: [
          {
            label: '个人中心',
            onClick: () => {
              this.personCenter();
            },
          },
          {
            label: '日程',
            onClick: () => {
              this.displays = !this.displays;
            },
          },
          {
            label: '壁纸',
            onClick: () => {
              this.showModal();
            },
          },
          {
            label: '退出登录',
            onClick: () => {
              this.signout();
            },
          },
        ],
        event,
        customClass: 'class-a',
        zIndex: 8,
        minWidth: 230,
      });
      return false;
    },
    weather() {
      if (this.weatherShow) {
        this.weatherShow = false;
      } else {
        this.weatherShow = true;
      }
    },
    weatherHide() {
      this.weatherShow = false;
    },
    newDate() {
      let now = new Date();
      let year = now.getFullYear(); // 得到年份
      let month = now.getMonth(); // 得到月份
      let date = now.getDate(); // 得到日期
      let day = now.getDay(); // 得到周几
      let hour = now.getHours(); // 得到小时
      let minu = now.getMinutes(); // 得到分钟
      let sec = now.getSeconds(); // 得到秒
      let MS = now.getMilliseconds(); // 获取毫秒

      month = month + 1;
      if (month < 10) month = '0' + month;
      if (date < 10) date = '0' + date;
      if (hour < 10) hour = '0' + hour;
      if (minu < 10) minu = '0' + minu;
      if (sec < 10) sec = '0' + sec;
      if (MS < 100) MS = '0' + MS;
      const arrweek = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
      let week = arrweek[day];

      this.time = hour + ':' + minu + ':' + sec + ' ' + week;
    },
    setBg() {
      if (localStorage.getItem('bg') != null) {
        this.bgSrc = localStorage.getItem('bg');
        this.lisr = true;
      } else {
        this.lisr = false;
      }
    },
    // 壁纸选择
    choice(e) {
      if (e.target.localName == 'img') {
        this.imgNum = e.srcElement.dataset.id;
        this.imgSrc = e.srcElement.currentSrc;
      } else {
        this.imgNum = e.srcElement.parentElement.childNodes[0].dataset.id;
        this.imgSrc = e.srcElement.parentElement.childNodes[0].currentSrc;
      }
      localStorage.setItem('id', this.imgNum);
      if (this.imgSrc != '') {
        localStorage.setItem('bg', this.imgSrc);
        this.imgNum = localStorage.getItem('id');
        this.setBg();
      }
    },
    showModal() {
      this.visible = true;
    },
    personCenter() {
      this.openApplication({
        name: 'UserInfo',
        title: '个人中心',
        status: true,
        location: 'top',
        sort: 0,
        type: 'system',
        icon: {
          name: 'avatar.png',
          type: 'img',
          url: this.avatar,
          uid: 'vc-upload-1617781880266-2',
          status: 'done',
        },
        hidden: false,
        width: '40%',
        height: '70%',
        router: 'UserInfo',
        data: {
          refresh: this.onRefresh,
        },
      });
    },
    onGateway() {
      this.$router.push('/gateway');
    },
    signout() {
      clearTimeout(this.connectInter);
      logout();
      this.$router.push('/');
    },
    startInterval() {
      const that = this;
      let connectInter = null;
      clearInterval(connectInter);

      // let date = new Date();
      // let monthen = date.getMonth() + 1;
      // let year = date.getFullYear();
      // this.valuedates[0] = year + "-" + (monthen - 2) + "-01"
      // this.valuedates[1] = year + "-" + (monthen + 1) + "-01"
      connectInter = setInterval(() => {
        that.getMessage();
        that.getSchedule();
      }, 1000 * 60 * 5);
    },

    getMessage() {
      messages_paginate({
        per_page: 5,
        unread: true,
      })
        .then(response => {
          this.messages = response.data.data;
        })
        .catch(error => {
          console.log('error', error);
        });
    },
    onMessage() {
      this.openApplication({
        name: 'Message',
        title: '消息',
        status: true,
        location: 'top',
        sort: 0,
        type: 'system',
        hidden: false,
        width: '80%',
        height: '80%',
        router: 'Message',
        data: {
          refresh: this.onRefresh,
          open: this.openApplication,
        },
      });
    },
    onMessageDetails(record) {
      this.visiblePopover = false;
      this.openApplication({
        id: record.id,
        name: 'MessageDetails',
        title: '消息详情',
        status: true,
        location: 'top',
        sort: 0,
        type: 'system',
        hidden: false,
        width: '40%',
        height: '40%',
        router: 'MessageDetails',
        data: {
          data: record,
          open: this.openApplication,
        },
        cancel: () => {
          this.getMessage();
        },
      });
    },
    resets() {},
    getSchedule() {
      this.spinning = true;
      // Promise.all([schedule_risklist(), schedule_list()])
      //   .then((response) => {
      //     this.events = [...response[0].data.data, ...response[1].data.data];
      //     this.events.filter((item, index) => {
      //       this.events[index].start = item.start.substring(0, 10);
      //       this.events[index].end = item.end.substring(0, 10);
      //     });
      //     this.spinning = false;
      //   })
      //   .catch((error) => {
      //     console.log("error", error);
      //     this.spinning = false;
      //   });
      this.events = [];
      //  { start: this.valuedates[0], end: this.valuedates[1] }
      // { start: this.valuedates[0], end: this.valuedates[1] }
      this.$nextTick(() => {
        schedule_risklist()
          .then(response => {
            this.events = [...this.events, ...response.data.data];
            this.events.filter((item, index) => {
              this.events[index].start = item.start.substring(0, 10);
              this.events[index].end = item.end.substring(0, 10);
            });
            this.spinning = false;
          })
          .catch(error => {
            console.log('error', error);
            this.spinning = false;
          });
        schedule_list()
          .then(response => {
            this.events = [...this.events, ...response.data.data];
            this.events.filter((item, index) => {
              this.events[index].start = item.start.substring(0, 10);
              this.events[index].end = item.end.substring(0, 10);
            });
            this.spinning = false;
          })
          .catch(error => {
            console.log('error', error);
            this.spinning = false;
          });
      });
    },
    onScheduleRefresh() {
      this.getSchedule();
    },
    onScheduleItemClick(record) {
      this.openApplication({
        id: record.event.id,
        name: 'ScheduleDetails',
        title: '日程详情',
        status: true,
        location: 'top',
        sort: 0,
        type: 'system',
        hidden: false,
        width: '50%',
        height: '50%',
        router: 'ScheduleDetails',
        data: {
          data: record.event.id,
          open: this.openApplication,
        },
        cancel: () => {},
      });
    },
    Customers() {
      this.custormes = true;
    },
    hidencustorms() {
      this.custormes = false;
    },
    screen() {
      const href = 'http://kshtj.vm42.suncoolnet.cn/';
      window.open(href, '_blank');
    },
    geturlweixin() {
      const hrefs = 'https://work.weixin.qq.com/kfid/kfc42317a4c83938357';
      window.open(hrefs, '_blank');
    },
  },
};
</script>

<style>
@import url('../../assets/css/common.css');
.vl-notify.vl-notify-alert h2.vl-notice-title .icon-remove {
  right: 5px;
}
.vl-notify.vl-notify-alert h2.vl-notice-title .lv-icon-maxmini i {
  margin: 0 5px;
}
.images {
  /* transform: rotate(360deg); */
  width: 200px;
  height: 200px;
  /* animation: loading 3s linear 0s infinite; */
}

@keyframes loading {
  from {
    transform: rotate(360deg);
  }

  to {
    transform: rotate(0deg);
  }
}
.desktop {
  position: absolute;
  right: 25px;
  bottom: 70px;
}
.desktop_topright {
  position: fixed;
  right: 0px;
  top: 30px;
  min-width: 400px;
  min-height: 100px;
  background: #fbfcfb7d;
  padding: 15px;
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
}
.desktop_topright .animated {
  animation-duration: 0.8s !important;
}
.desktop_topright .close {
  position: absolute;
  right: 0px;
  top: 0px;
  color: red;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  cursor: pointer;
}
.desktop_topright_icon {
  position: fixed;
  right: 0px;
  top: 35px;
  width: 35px;
  height: 35px;
  background: #2196f3;
  border-radius: 20%;
  color: #fff;
  -webkit-font-size: 28px;
  font-size: 28px;
  cursor: pointer;
}
.headers {
  position: relative;
  display: flex;
  /* height: 30px; */
  line-height: 30px;
  background: #fbfcfb;
  box-shadow: 0 1px 8px #888888;
  color: #333;
  z-index: 5;
}
::-webkit-scrollbar {
  width: 3px !important;
  height: 5px !important;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.1);
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 5px;
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  background-color: rgba(0, 0, 0, 0.1);
}

.headers-left,
.headers-right {
  flex: 1;
}

.headers-left {
  text-align: left;
  margin-bottom: 0em !important;
}

.headers-right {
  text-align: right;
  margin-bottom: 0em !important;
}

.headers .headers-left li {
  display: inline-block;
  margin: 0 10px;
  cursor: pointer;
}

.headers .headers-left li:first-child {
  margin-left: 20px;
}

.headers .headers-right li {
  display: inline-block;
  margin: 0 5px;
  cursor: pointer;
}

.headers .headers-right li:last-child {
  margin-right: 10px;
}

.content-hone {
  height: calc(100vh - 30px);
  background: url(../../assets/images/bg.jpg) no-repeat no-repeat center;
  background-size: 100% 100%;
  overflow: hidden;
}

.app-list {
  display: flex;
  height: 80vh;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: flex-start;
  padding-left: 20px;
}

.app-list .list-item {
  width: 100px;
  margin-top: 20px;
  margin-left: 25px;
  cursor: pointer;
  padding: 10px;
}
.app-list .list-item:hover {
  background: #ffffff66;
  border-radius: 3px;
}

.app-list .list-item img {
  width: 100%;
}

.app-list .list-item .spans {
  display: block;
  line-height: 21px;
  text-align: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 18px;
  margin-top: 8px;
  font-size: 12px;
  color: #ffffff;
}

#container {
  position: fixed;
  bottom: 0;
  left: calc(50% - 20%);
  width: 40%;
  padding: 16px 0;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 10px 10px 0 0;
  text-align: center;
}
@media screen and (max-width: 1299px) {
  #container {
    left: 15%;
    width: 70%;
  }
}
@media screen and (max-width: 780px) {
  #container {
    left: 0;
    width: 100%;
  }
  .headers {
    display: block;
  }
  .desktop {
    bottom: 120px;
  }
  .desktop_topright_icon,
  .desktop_topright {
    top: 75px;
  }
}
@media screen and (min-width: 1300px) {
  #container {
    left: 25%;
    width: 50%;
  }
}
.vl-notify-iframe {
  color: #2196f3;
}
#container #dock {
  width: 100%;
  text-align: center;
  margin: 0 auto;
}

#container li {
  list-style-type: none;
  display: inline-block;
  position: relative;
  margin: 15px;
}

#container li img {
  width: 60px;
  height: 60px;
  -webkit-box-reflect: below 2px -webkit-gradient(linear, left top, left bottom, from(transparent), color-stop(0.7, transparent), to(rgba(255, 255, 255, 0.5)));
  transition: all 0.3s;
  -webkit-transition: all 0.3s;
  transform-origin: 40% 70%;
  -webkit-transform-origin: 40% 70%;
}

#container li:hover img {
  transform: scale(2);
  -webkit-transform: scale(2);
  /* margin: 0 0.5em 0 -0.5em; */
}

/* #container li:hover + li img,
#container li.prev img {
  transform: scale(1.5);
  -webkit-transform: scale(1.5);
  margin: 0 -0.5em 0 0.5em;
} */

#container li span {
  display: none;
  position: absolute;
  bottom: 100px;
  width: 100px;
  margin-left: -15px;
  left: 0;
  background-color: #5f5f5f8f;
  padding: 4px;
  border-radius: 7px;
}

#container li:hover span {
  display: block;
  color: #fff;
}

.weather {
  position: fixed;
  top: 30px;
  right: 0;
}

.weather iframe {
  height: calc(100vh - 30px);
  border: none;
}

.vl-notify-content {
  height: 100% !important;
}
.ant-popover {
  z-index: 1500;
}
</style>
<style lang="less" scoped>
.app-popover {
  .ant-popover-inner-content {
    padding: 0px;
  }
}
.app-card {
  padding: 0px;
  .ant-card-body {
    padding: 0px;
  }
}
</style>
<style scoped>
.custorms {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #7676768a;
  z-index: 999;
}
.custorms div {
  margin: auto;
}
.custorms .icon_ss {
  position: absolute;
  margin-left: -28px;
  margin-top: 3px;
}
.custorms img {
  width: 400px;
  cursor: pointer;
}
.wallpaper {
  width: 100%;
  height: 600px;
  background: #fff;
  overflow-y: scroll;
  scrollbar-width: none;
}
.wallpaper::-webkit-scrollbar {
  width: 0 !important;
}
.content {
  height: 100%;
  box-sizing: border-box;
}
.button_s {
  border: 1px solid #eee;
  margin: 10px;
  padding: 5px 20px;
  border-radius: 5px;
}
.button_s:hover {
  background: #eee;
}

.active {
  cursor: pointer;
  box-shadow: 2px 2px 10px 10px #84858670;
  -webkit-box-shadow: 2px 2px 10px 10px #84858670;
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.bg-list {
  width: 150px;
  display: inline-block;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  margin: 20px;
}
.addimage {
  width: 150px;
  display: inline-block;
  border-radius: 5px;
  margin: 20px;
  text-align: center;
  border: 1px solid #d9d9d9;
  cursor: pointer;
  position: absolute;
}
.addimage:hover {
  cursor: pointer;
  box-shadow: 2px 2px 10px 10px #84858670;
  -webkit-box-shadow: 2px 2px 10px 10px #84858670;
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.bg-list img {
  width: 100%;
  padding: 15px 15px 5px;
  height: 90px;
}
.bg-list div {
  text-align: center;
  background: #0000000d;
}
.bg-list:hover {
  cursor: pointer;
  box-shadow: 2px 2px 10px 10px #84858670;
  -webkit-box-shadow: 2px 2px 10px 10px #84858670;
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.wallpaperes {
  width: 100%;
  height: 500px;
  border-radius: 0.2;
  background: #fff;
  overflow-y: scroll;
  scrollbar-width: none;
}
.contentes {
  height: 100%;
  box-sizing: border-box;
}
.clearfix >>> .ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.clearfix >>> .ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.clearfix >>> .ant-upload.ant-upload-select-picture-card,
.clearfix >>> .ant-upload-list-picture-card .ant-upload-list-item,
.clearfix >>> .ant-upload-list-item-info {
  padding: 0;
  zoom: 2;
  border-radius: 50%;
}
</style>
