<template>
  <a-layout class="route-layout">
    <a-layout-sider
      v-model="collapsed"
      :trigger="null"
      collapsible
      v-if="Memus.length"
    >
      <a-menu
        :theme="mode || theme.mode"
        mode="inline"
        :inline-collapsed="collapsed"
        :collapsed="false"
        :collapsible="false"
        :setting="setting"
        :default-selected-keys="[Memus[0] ? Memus[0].records[0].parent : '']"
        :default-open-keys="[Memus[0] ? Memus[0].group || Memus[0]._id : '']"
        :style="{ overflowY: 'scroll', height: '100%', position: 'relative' }"
      >
        <template v-for="item in Memus">
          <a-sub-menu
            v-if="item.meta ? !item.meta.invisible : true"
            :theme="theme.mode"
            :class="'fixed-side'"
            :key="item.group || item._id"
            :collapsed="collapsed"
            :collapsible="true"
          >
            <span slot="title">
              <a-icon type="menu-unfold" />
              <span>{{ item.group || item._id }}</span>
            </span>
            <template v-for="record in item.records">
              <a-menu-item
                :key="record.parent"
                @click="MenuItemCallBack(record)"
                @contextmenu.prevent="onRightClickMenu(record)"
                v-if="record.meta ? !record.meta.invisible : true"
              >
                <span>{{ record.title || record.route.key }}</span>
                <slot name="menu-item-button"></slot>
                <a-icon
                  v-if="setting"
                  type="setting"
                  class="icon_to_see"
                  size="large"
                  @click="EditAddRoute(record)"
                ></a-icon>
              </a-menu-item>
            </template>
          </a-sub-menu>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header>
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="() => (collapsed = !collapsed)"
        />
        <slot name="header"></slot>
        <div style="float: right"><slot name="header-right"></slot></div>
      </a-layout-header>
      <a-layout-content
        class="conter"
        :style="{
          margin: '10px 10px',
          padding: '10px',
          background: '#fff',
          overflowY: 'scroll',
          height: '100%',
          position: 'relative',
        }"
      >
        <page-toggle-transition
          :disabled="animate.disabled"
          :animate="animate.name"
          :direction="animate.direction"
          ><slot name="content"></slot
        ></page-toggle-transition>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import { mapState } from "vuex";
import PageToggleTransition from "@/components/transition/PageToggleTransition";
export default {
  name: "system-views",
  components: {
    PageToggleTransition,
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
    onRefresh: {
      type: Function,
      default: () => {
        console.log("onRefresh");
      },
    },
    Memus: {
      type: Array,
      default: () => {
        return [];
      },
    },
    active: {
      type: String,
      default: "",
    },
    onMenuItem: {
      type: Function,
      default: () => {
        console.log("onMenuItem");
      },
    },
    onRightClick: {
      type: Function,
      default: () => {
        console.log("onRightClick");
      },
    },
    loading: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    setting: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    mode: {
      type: String,
      default: () => {
        return null;
      },
    },
  },
  data() {
    return {
      collapsed: false,
      parents: "",
      selectspage: "",
    };
  },
  computed: {
    ...mapState("setting", ["theme", "animate"]),
  },
  created() {},
  methods: {
    MenuItemCallBack(record) {
      this.$emit("on-menu-item", record);
    },
    EditAddRoute(record) {
      this.$emit("edit-add-route", record);
    },
    onRightClickMenu(record) {
      this.$emit("on-right-click", record);
    },
  },
};
</script>
<style scoped="lang">
.route-layout .trigger {
  color: #000000;
  font-size: 18px;
  line-height: 64px;
  cursor: pointer;
  padding: 0 5px;
  transition: color 0.3s;
}
.ant-layout-header {
  padding: 0 20px;
}
</style>
<style scoped>
.conter {
  scrollbar-color: #e5e5e5 #f7f7f9; /* 滑块颜色  滚动条背景颜色 */
  scrollbar-width: thin; /* 滚动条宽度有三种：thin、auto、none */
}
.icon_to_see {
  padding: 12px;
  right: 0px;
  margin: auto;
  position: absolute;
}
</style>
