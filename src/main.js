import Vue from 'vue'
import App from './App.vue'
import {
	initRouter
} from './router'

import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import store from './store';
import 'animate.css/source/animate.css';
import Plugins from '@/plugins';
import {
	initI18n
} from '@/utils/i18n';
import bootstrap from '@/bootstrap';
import 'moment/locale/zh-cn';
import VueContextMenu from 'vue-contextmenujs';
import layer from './components/layer';
import './theme/index.less'
import './components/k-form-extension';

// import 'k-form-design/lib/k-form-design.css'
// import KFormDesign from 'k-form-design';
import KFormDesign from './components/k-form-design/packages'
import './components/k-form-design/styles/form-design.less'
//md编辑器
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import vcolorpicker from 'vcolorpicker'
import Editor from 'vue2-ace-editor';

//hls播放器
import VideoPlayer from 'vue-video-player'
import "video.js/dist/video-js.css"
import "vue-video-player/src/custom-theme.css"
import hls from 'videojs-contrib-hls'

import * as echarts from "echarts";
Vue.use(echarts)
const router = initRouter(store.state.setting.asyncRoutes)
const i18n = initI18n('CN', 'US')

Vue.use(Editor)
Vue.use(layer)
Vue.prototype.$layer = layer(Vue);
Vue.use(VueContextMenu)
Vue.use(Antd)
Vue.config.productionTip = false
Vue.use(Viser)
Vue.use(Plugins)
Vue.use(KFormDesign)
Vue.use(mavonEditor);
Vue.use(vcolorpicker)
Vue.use(hls)
Vue.use(VideoPlayer)

bootstrap({
	router,
	store,
	i18n,
	message: Vue.prototype.$message,
	confirm:Vue.prototype.$confirm
})

new Vue({
	router,
	store,
	i18n,
	render: h => h(App),
}).$mount('#app')
