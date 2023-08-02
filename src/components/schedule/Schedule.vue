<template>
  <div :class="`${prefixCls}-wrap schedule`">
    <a-button-group class="btn-group">
      <a-button type="link" @click="refresh">刷新</a-button>
    </a-button-group>
    <a-button-group class="right-btn-group">
      <!-- <a-button type="link" @click="refresh">刷新</a-button> -->
      <!-- <a-button type="link" @click="maximize">全屏</a-button> -->
      <a-button type="link" @click="hidden">隐藏</a-button>
    </a-button-group>
    <FullCalendar
      ref="calendar"
      :options="options"
      class="FullCalendars"
    ></FullCalendar>
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { addLongPress } from "@/utils/util";

import dayjs from "dayjs";

const prefixCls = "ezb-calendar";

export default {
  name: "Calendar",
  components: {
    FullCalendar,
  },
  props: {
    // refresh: {
    //   type: Function,
    //   default: () => {
    //     console.log("refresh");
    //   },
    // },
    maximize: {
      type: Function,
      default: () => {
        console.log("maximize");
      },
    },
    hidden: {
      type: Function,
      default: () => {
        console.log("hidden");
      },
    },
    events: {
      type: Array,
    },
    onItemClick: {
      type: Function,
      default: () => {
        console.log("onItemClick");
      },
    },
    onItemLongClick: {
      type: Function,
      default: () => {
        console.log("onItemLongClick");
      },
    },
  },
  data() {
    return {
      prefixCls,
      isRapid: false,
      addModal: false,
      infoModal: false,
      info: null,
      form: {
        id: "",
        title: "",
        description: "",
        startDay: "",
        startTime: "",
        endDay: "",
        endTime: "",
        textColor: "#000",
        backgroundColor: "#3788d8",
        borderColor: "#3788d8",
      },
    };
  },
  filters: {
    dateFilter(date) {
      return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  computed: {
    options() {
      return {
        // 自定义渲染视图
        views: {
          dayGridMonth: {
            // https://fullcalendar.io/docs/date-formatting
            // titleFormat: { year: 'numeric', month: '2-digit', day: '2-digit' }
          },
        },
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
        // 自定义渲染头部
        headerToolbar: {
          start: "prevYear prev next nextYear today",
          center: "title",
          end: "dayGridMonth timeGridWeek timeGridDay listMonth",
        },
        // 是否可以拖拽
        editable: false,
        // 是否可添加
        selectable: false,
        // 自定义文本
        buttonText: {
          today: "今天",
          month: "月",
          week: "周",
          day: "天",
          list: "日程",
        },
        // 语言
        locale: "zh-cn",
        // 设置周几为第一天
        firstDay: 1,
        // 初始化视图
        initialView: "dayGridMonth",
        // 是否显示周末
        weekends: true,
        // 当事件过多时是否隐藏
        dayMaxEvents: false,
        events: this.events,
        eventDidMount: (info) => {
          addLongPress(info, this.clickEvent, this.longPressEvent);
        },
        //点击事件
        eventClick: (info) => {
          console.log(info);
        },
        // 缩放事件
        eventResize: (info) => {
          console.log(info);
        },
        // 拖拽事件
        eventDrop: (info) => {
          console.log(info);
        },
        // 重新渲染
        handleDatesRender: () => {},
        // 日期选中
        select: () => {
          this.addModal = true;
          this.isRapid = true;
        },
      };
    },
  },
  created() {},
  mounted() {},
  methods: {
    clickEvent(info) {
      this.$emit("onItemClick", info);
    },
    // 刷新
    refresh(info) {
      this.$emit("refresh", info);
    },
    longPressEvent(info) {
      this.$emit("onItemLongClick", info);
    },
    filterDate(day, time) {
      return day + (time ? " " : "") + time;
    },
  },
};
</script>

<style>
.fc-toolbar-title {
  color: #fff;
  padding: 0 10px;
}
.right-btn-group {
  float: right;
}
.right-btn-group button,
.btn-group button {
  color: #fff;
}
.right-btn-group button:focus,
.btn-group button:focus,
.right-btn-group button:active,
.btn-group button:active,
.right-btn-group button:hover,
.btn-group button:hover {
  color: #cccccc;
}
</style>
<style scoped>
.FullCalendars >>> .fc-scrollgrid-section-body,
.fc-scrollgrid-section {
  height: 70%;
}
.FullCalendars >>> .fc-scrollgrid-section-body .fc-scroller-harness {
  overflow: auto;
  height: 100%;
}
</style>
