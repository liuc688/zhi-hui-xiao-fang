<template>
  <a-spin
    :spinning="spinning"
    style="height: 100%; width: 100%"
    tip="Loading..."
    v-if="appdata.status"
  >
    <a-layout style="width: 100%; height: 100%">
      <!-- 左侧列表 -->
      <a-layout-sider style="height: 100%">
        <!-- 站点/组织选择 -->
        <a-tree-select
          @change="changeaorg"
          show-search
          style="width: 100%; padding: 10px 5%; background: #1890ff33"
          v-model="organization"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="organizations"
          placeholder="请选择所在组织"
          :replaceFields="{
            title: undefined,
            key: 'id',
            value: 'id',
          }"
          :filterTreeNode="
            (value, node) => {
              const data = node.componentOptions.propsData.dataRef;
              return (
                data.title.indexOf(value) !== -1 ||
                data.name.indexOf(value) !== -1
              );
            }
          "
        >
          <span
            slot="title"
            slot-scope="record"
            color="#f50"
            class="channel-tree-item"
          >
            {{ record.title }}
            <a-tag color="orange" v-if="record.hidden" style="margin: auto 5px"
              >隐</a-tag
            >
            <a-tag color="orange" v-if="!record.code" style="margin: auto 5px"
              >!</a-tag
            >
          </span>
        </a-tree-select>
        <!-- 目录/目录列表 -->
        <a-tabs
          style=""
          class="tabs_top"
          v-model="activekey"
          @contextmenu.prevent="ondesktopmenu"
          @change="callback"
          :tabBarGutter="80"
          size="large"
          :tabBarStyle="tabBarStyle"
        >
          <!-- 目录列表 -->
          <a-tab-pane key="1" tab="目录">
            <div
              class="tabs_swich"
              v-if="$auth('channel.sort') || $auth('channel.insert')"
            >
              <span v-if="$auth('channel.sort')">拖拽排序： </span>
              <a-switch
                v-if="$auth('channel.sort')"
                v-model="draggables"
                @change="draggableschange"
              >
                <a-icon slot="checkedChildren" type="check" />
                <a-icon slot="unCheckedChildren" type="close" />
              </a-switch>
              <a-button
                style="float: right"
                size="small"
                v-if="$auth('channel.insert')"
                type="primary"
                @click="addchannel"
              >
                <a-icon type="plus" />创建目录</a-button
              >
            </div>
            <!-- 检索目录模块 -->
            <a-tree-select
              show-search
              style="width: 100%; padding: 10px 5%; background: #1890ff33"
              v-model="channelsss"
              @change="researchchannel"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="channelData"
              placeholder="检索目录"
              :replaceFields="{
                title: undefined,
                key: 'id',
                value: 'id',
              }"
              :filterTreeNode="
                (value, node) => {
                  const data = node.componentOptions.propsData.dataRef;
                  return (
                    data.title.indexOf(value) !== -1 ||
                    data.name.indexOf(value) !== -1
                  );
                }
              "
            >
              <span
                slot="title"
                slot-scope="record"
                color="#f50"
                class="channel-tree-item"
              >
                {{ record.title }}
                <a-tag
                  color="orange"
                  v-if="record.hidden"
                  style="margin: auto 5px"
                  >隐</a-tag
                >
                <!-- <a-tag
                  color="blue"
                  v-if="record.maps && record.maps.length"
                  style="max-height: 25px; margin-left:5px"
                  >映</a-tag
                > -->
                <a-tag
                  color="blue"
                  v-if="record.maps && record.maps.length"
                  style="margin: auto 5px"
                >
                  映
                  <span style="color: #1890ff; font-size: 14px">↓</span>
                </a-tag>
                <a-tag
                  color="blue"
                  v-if="record.reflect && record.reflect.length"
                  style="margin: auto 5px"
                >
                  映
                  <span style="color: #1890ff; font-size: 14px">↑</span>
                </a-tag>
                <a-tag color="cyan" v-if="record.link" style="margin: auto 5px"
                  >链</a-tag
                >
                <a-tag
                  color="cyan"
                  v-if="record._extension ? record._extension.i_id : false"
                  style="margin: auto 5px"
                  >原</a-tag
                >
              </span>
            </a-tree-select>
            <!-- 目录树 -->
            <a-tree
              class="draggable-tree"
              :tree-data="channelData"
              :draggable="draggables"
              :default-expand-all="true"
              auto-expand-parent
              :expandedKeys.sync="channelexpandedKeys"
              :selectedKeys.sync="channelselectedKeys"
              :block-node="true"
              :replaceFields="{
                title: undefined,
                key: 'id',
                value: 'id',
              }"
              ref="channelTree"
              @select="treeSelect"
              @expand="onExpand"
              @dragenter="onDragEnter"
              @drop="onDrop"
            >
              <span
                slot="title"
                slot-scope="record"
                color="#f50"
                class="channel-tree-item"
              >
                <div class="channel-tree-item_left">
                  {{ record.title }}
                  <a-tag
                    color="orange"
                    v-if="record.hidden"
                    style="margin: auto 5px"
                    >隐</a-tag
                  >
                  <!-- <a-tag
                    color="blue"
                    v-if="record.maps && record.maps.length"
                    style="max-height: 25px; margin: auto"
                    >映</a-tag
                  > -->
                  <a-tag
                    color="blue"
                    v-if="record.maps && record.maps.length"
                    style="margin: auto 5px"
                  >
                    映
                    <span style="color: #1890ff; font-size: 14px">↓</span>
                  </a-tag>
                  <a-tag
                    color="blue"
                    v-if="record.reflect && record.reflect.length"
                    style="margin: auto 5px"
                  >
                    映
                    <span style="color: #1890ff; font-size: 14px">↑</span>
                  </a-tag>
                  <a-tag
                    color="cyan"
                    v-if="record.link"
                    style="margin: auto 5px"
                    >链</a-tag
                  >
                  <a-tag
                    color="cyan"
                    v-if="record._extension ? record._extension.i_id : false"
                    style="margin: auto 5px"
                    >原</a-tag
                  >
                </div>

                <a-popover v-if="$auth('channel.insert')" placement="left">
                  <template slot="content"> 目录添加 </template>
                  <a-icon
                    type="plus-square"
                    class="icon_more"
                    v-if="$auth('channel.insert')"
                    :style="{
                      fontSize: '16px',
                      paddingTop: '2px',
                      paddingRight: '5px',
                      color: '#8f8f8f',
                    }"
                    @click.stop="(event) => event.stopPropagation()"
                    @click="addchannel(record)"
                  />
                </a-popover>

                <a-dropdown class="icon_more" :trigger="['click']">
                  <a-icon
                    type="bars"
                    :style="{
                      fontSize: '20px',
                      paddingTop: '2px',
                      paddingRight: '5px',
                    }"
                    @click.stop="(event) => event.stopPropagation()"
                  />
                  <a-menu slot="overlay" style="width: 160px">
                    <a-menu-item v-if="$auth('channel.insert')">
                      <a @click="addchannel(record)">
                        <a-icon type="plus-circle" />
                        目录添加
                      </a>
                    </a-menu-item>
                    <a-menu-item class="dividers" v-if="$auth('channel.edit')">
                      <a @click="editchannel(record)">
                        <a-icon type="edit" />
                        目录编辑
                      </a>
                    </a-menu-item>
                    <a-menu-item v-if="!siteinfo.parent">
                      <a @click="channelMappinng(record)">
                        <a-icon type="switcher" />
                        目录映射
                      </a>
                    </a-menu-item>
                    <a-menu-item
                      class="dividers"
                      v-if="
                        $auth('channel.delete') &&
                        !(record.reflect && record.reflect.length)
                      "
                    >
                      <a @click="onDelete(record)">
                        <a-icon type="delete" />
                        目录删除
                      </a>
                    </a-menu-item>
                    <a-menu-item
                      class="dividers"
                      v-if="$auth('site/channel/move')"
                    >
                      <a @click="onmove(record)">
                        <a-icon type="fall" />
                        目录迁移
                      </a>
                    </a-menu-item>
                    <a-menu-item class="dividers" v-if="$auth('channel.forms')">
                      <a @click="onEditForms(record)">
                        <a-icon type="cloud-server" />
                        挂载表单
                      </a>
                    </a-menu-item>
                    <a-menu-item
                      class="dividers"
                      v-if="$auth('channel.sync.maps')"
                    >
                      <a @click="sync_map(record)">
                        <a-icon type="apartment" />
                        同步映射目录表单
                      </a>
                    </a-menu-item>
                    <a-menu-item v-if="$auth('approve.add')">
                      <a @click="onStatus(record, true)">
                        <a-icon type="setting" />
                        设置审批流程
                      </a>
                    </a-menu-item>
                    <a-menu-item
                      class="dividers"
                      v-if="$auth('channel.templates')"
                    >
                      <a @click="settemplate(record)">
                        <a-icon type="setting" />
                        设置模板
                      </a>
                    </a-menu-item>
                    <a-menu-item v-if="$auth('channel.hidden')">
                      <a @click="onHidden(record)">
                        <a-icon type="eye" />
                        显示/隐藏
                      </a>
                    </a-menu-item>
                    <a-menu-item v-if="$auth('channel.excel.template')">
                      <a @click="getmoudle(record)">
                        <a-icon type="download" />
                        文章导入模板
                      </a>
                    </a-menu-item>
                    <a-menu-item class="dividers">
                      <a @click="copyname(record.name)">
                        <a-icon type="copy" />
                        获取目录名称
                      </a>
                    </a-menu-item>
                    <!--  v-if="$auth('render.router')" -->
                    <a-menu-item class="dividers">
                      <a @click="render_routers(record, false)">
                        <a-icon type="copy" />
                        获取目录地址
                      </a>
                    </a-menu-item>
                    <a-sub-menu key="test">
                      <template slot="title">
                        <a-icon type="reload" />发布
                      </template>
                      <a-menu-item>
                        <a @click="Updatecache(record, true)">
                          <a-icon type="sync" />
                          全量发布
                        </a>
                      </a-menu-item>
                      <a-menu-item>
                        <a @click="Updatecache(record, false)">
                          <a-icon type="sync" />
                          发布模板
                        </a>
                      </a-menu-item>
                    </a-sub-menu>
                  </a-menu>
                </a-dropdown>
              </span>
            </a-tree>
          </a-tab-pane>
          <!-- 栏目列表 -->
          <a-tab-pane key="2" tab="栏目">
            <div
              class="tabs_swich"
              v-if="$auth('directory.sort') || $auth('directory.insert')"
            >
              <span v-if="$auth('directory.sort')">拖拽排序： </span>
              <a-switch
                v-if="$auth('directory.sort')"
                v-model="draggabless"
                @change="draggableschanges"
              >
                <a-icon slot="checkedChildren" type="check" />
                <a-icon slot="unCheckedChildren" type="close" />
              </a-switch>
              <div style="float: right" v-if="$auth('directory.insert')">
                <a-button
                  size="small"
                  type="primary"
                  @click="adddirectory"
                  block
                >
                  <a-icon type="plus" />创建栏目
                </a-button>
              </div>
            </div>
            <!-- 检索栏目模块 -->
            <a-tree-select
              show-search
              style="width: 100%; padding: 10px 5%; background: #1890ff33"
              v-model="columnless"
              @change="researchcolumn"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="directoryData"
              placeholder="检索栏目"
              :replaceFields="{
                title: undefined,
                key: 'id',
                value: 'id',
              }"
              :filterTreeNode="
                (value, node) => {
                  const data = node.componentOptions.propsData.dataRef;
                  return (
                    data.title.indexOf(value) !== -1 ||
                    data.name.indexOf(value) !== -1
                  );
                }
              "
            >
              <span
                slot="title"
                slot-scope="record"
                color="#f50"
                class="channel-tree-item"
              >
                {{ record.title }}
                <a-tag
                  color="cyan"
                  v-if="record.link"
                  style="max-height: 25px; margin: auto"
                  >链</a-tag
                >
              </span>
            </a-tree-select>
            <!-- 栏目树 -->
            <a-tree
              class="draggable-tree"
              :tree-data="directoryData"
              :draggable="draggabless"
              :default-expand-all="true"
              auto-expand-parent
              :expandedKeys.sync="expandedKeys"
              :selectedKeys.sync="selectedKeys"
              :block-node="true"
              :replaceFields="{
                title: undefined,
                key: 'id',
                value: 'id',
              }"
              ref="directoryTree"
              @select="treeSelectdire"
              @dragenter="onDragEnter"
              @drop="onDrop"
            >
              <span
                slot="title"
                slot-scope="record"
                color="#f50"
                class="channel-tree-item"
              >
                <div class="channel-tree-item_left">
                  {{ record.title }}
                  <a-tag
                    color="orange"
                    v-if="record.hidden"
                    style="max-height: 25px; margin: auto"
                    >隐</a-tag
                  >
                  <a-tag
                    color="cyan"
                    v-if="record.link"
                    style="max-height: 25px; margin: auto"
                    >链</a-tag
                  >
                </div>

                <a-popover v-if="$auth('directory.insert')" placement="left">
                  <template slot="content"> 添加栏目 </template>
                  <a-icon
                    type="plus-square"
                    class="icon_more"
                    :style="{
                      fontSize: '16px',
                      paddingTop: '2px',
                      paddingRight: '5px',
                      color: '#8f8f8f',
                    }"
                    v-if="$auth('directory.insert')"
                    @click.stop="(event) => event.stopPropagation()"
                    @click="adddirectory(record)"
                  />
                </a-popover>
                <a-dropdown class="icon_more" :trigger="['click']">
                  <a-icon
                    type="bars"
                    :style="{
                      fontSize: '20px',
                      paddingTop: '2px',
                      paddingRight: '5px',
                    }"
                    @click.stop="(event) => event.stopPropagation()"
                  />
                  <a-menu slot="overlay" style="width: 160px">
                    <a-menu-item v-if="$auth('directory.insert')">
                      <a @click="adddirectory(record)">
                        <a-icon type="plus-circle" />
                        添加栏目
                      </a>
                    </a-menu-item>
                    <a-menu-item v-if="$auth('directory.edit')">
                      <a @click="editdirectory(record)">
                        <a-icon type="edit" />
                        编辑栏目
                      </a>
                    </a-menu-item>
                    <a-menu-item v-if="$auth('directory.channel')">
                      <a @click="editchanneldirectory(record)">
                        <a-icon type="edit" />
                        编辑栏目目录
                      </a>
                    </a-menu-item>
                    <a-menu-item v-if="$auth('directory.editname')">
                      <a @click="changedirectory(record)">
                        <a-icon type="edit" />
                        修改名称
                      </a>
                    </a-menu-item>
                    <a-menu-item v-if="$auth('directory.delete')">
                      <a @click="deletedirectory(record)">
                        <a-icon type="delete" />
                        删除栏目
                      </a>
                    </a-menu-item>
                    <a-menu-item
                      v-if="
                        $auth('directory.children.export') &&
                        record.children.length
                      "
                    >
                      <a @click="directoryexport(record)">
                        <a-icon type="download" />
                        下级栏目导出
                      </a>
                    </a-menu-item>
                    <a-menu-item>
                      <a @click="copyname(record.name)">
                        <a-icon type="copy" />
                        获取栏目名称
                      </a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </span>
            </a-tree>
          </a-tab-pane>
        </a-tabs>
      </a-layout-sider>
      <!-- 右侧页面 -->
      <a-layout style="height：100%">
        <!-- 站点详情 -->
        <a-layout-header>
          <div class="header_styles">
            <a-descriptions size="small">
              <a-descriptions-item label="站点名">
                {{ siteinfo.title }}
              </a-descriptions-item>
              <a-descriptions-item label="组织机构代码">
                {{ siteinfo.code }}
              </a-descriptions-item>

              <!-- <a-descriptions-item label="是否隐藏">
                {{ siteinfo.hidden ? "是" : "否" }}
              </a-descriptions-item> -->
              <a-descriptions-item label="站点名称">
                {{ siteinfo.name }}
                <a-icon
                  class="copys"
                  @click="copyname(siteinfo.name)"
                  type="copy"
                />
              </a-descriptions-item>

              <a-descriptions-item label="站点分类">
                {{ statuslist[siteinfo.status] }}
              </a-descriptions-item>
              <a-descriptions-item label="域名">
                <a-tag
                  v-for="item in siteinfo.domain"
                  color="#108ee9"
                  :key="item"
                  @click="copyname(item)"
                  >{{ item }}</a-tag
                >
              </a-descriptions-item>
            </a-descriptions>
            <a-space style="position: absolute; right: 20px; top: 60px">
              <a-button icon="reload" @click="onReload">刷新</a-button>
              <a-dropdown :trigger="['click']">
                <a-button
                  class="ant-dropdown-link"
                  @click="(e) => e.preventDefault()"
                >
                  <a-icon type="more" />
                  站点操作
                </a-button>
                <a-menu slot="overlay" style="width: 160px">
                  <a-menu-item v-if="$auth('approve.add')">
                    <a @click="onStatus(siteinfo)">
                      <a-icon type="retweet" />
                      设置审批流程
                    </a>
                  </a-menu-item>
                  <a-menu-item v-if="$auth('organization.edit')">
                    <a @click="siteEdit(siteinfo)">
                      <a-icon type="edit" />
                      站点编辑
                    </a>
                  </a-menu-item>
                  <a-menu-item v-if="$auth('organization.edit')">
                    <a @click="siteTemplate(siteinfo)">
                      <a-icon type="pic-center" />
                      设置模版
                    </a>
                  </a-menu-item>
                  <a-menu-item v-if="$auth('organization.edit')">
                    <a @click="recordInfo(siteinfo)">
                      <a-icon type="wallet" />
                      备案信息
                    </a>
                  </a-menu-item>
                  <a-menu-item v-if="$auth('site.document.count')">
                    <a @click="exportessitecount">
                      <a-icon type="download" />
                      导出站点发文量
                    </a>
                  </a-menu-item>
                  <!--  v-if="$auth('render.router')" -->
                  <a-menu-item class="dividers">
                    <a @click="render_routers(siteinfo, true)">
                      <a-icon type="copy" />
                      获取站点地址
                    </a>
                  </a-menu-item>
                  <!-- <a-menu-item>
                    <a @click="bindings('wx')">
                      <a-icon type="wallet" />
                      绑定微信公众号
                    </a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="bindings('wb')">
                      <a-icon type="wallet" />
                      绑定微博账号
                    </a>
                  </a-menu-item> -->
                  <a-menu-item v-if="$auth('channel/export')">
                    <a @click="exportes">
                      <a-icon type="download" />
                      导出目录
                    </a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="exportescount">
                      <a-icon type="download" />
                      导出目录发文量
                    </a>
                  </a-menu-item>
                  <a-menu-item v-if="$auth('channel.many.insert')" class="dividers">
                    <a @click="channelmanyinsert">
                      <a-icon type="download" />
                      目录批量创建
                    </a>
                  </a-menu-item>
                  
                  <a-menu-item v-if="$auth('directory.update.import')">
                    <a @click="directoryupdateimport">
                      <a-icon type="download" />
                      栏目批量导入
                    </a>
                  </a-menu-item>
                  
                  <a-menu-item v-if="$auth('directory.many.insert')"  class="dividers">
                    <a @click="directorymanyinsert">
                      <a-icon type="download" />
                      栏目批量创建
                    </a>
                  </a-menu-item>
                  <a-menu-item v-if="$auth('document.excel.import')">
                    <a @click="docbatch">
                      <a-icon type="cloud-upload" />
                      文章批量导入
                    </a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="getbatchresult">
                      <a-icon type="cloud-upload" />
                      查看文章导入结果
                    </a>
                  </a-menu-item>
                  <a-sub-menu key="test">
                    <template slot="title">
                      <a-icon type="reload" />发布
                    </template>
                    <a-menu-item>
                      <a @click="Updatecaches(true)"> 全量发布 </a>
                    </a-menu-item>
                    <a-menu-item>
                      <a @click="Updatecaches(false)"> 发布模板 </a>
                    </a-menu-item>
                  </a-sub-menu>
                </a-menu>
              </a-dropdown>
            </a-space>
          </div>
        </a-layout-header>
        <a-layout-content style="height: 90%; overflow: auto">
          <page-toggle-transition
            :disabled="animate.disabled"
            :animate="animate.name"
            :direction="animate.direction"
          >
            <component
              ref="component"
              :is="router"
              :params="params"
              @event="event"
              @on-open="onOpen"
              :key="params.id || params.channel || params.site || params.parent"
            ></component>
          </page-toggle-transition>
        </a-layout-content>
        <!-- <a-layout-footer>Footer</a-layout-footer> -->
      </a-layout>
    </a-layout>
    <a-modal
      :title="Titles"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      width="50%"
    >
      <k-form-build :value="formDatas" ref="kcompanyForm" />
    </a-modal>
    <a-modal
      :title="titless"
      :visible="visibles"
      :confirm-loading="confirmLoading"
      @ok="handleOks"
      @cancel="handleCancels"
      width="50%"
    >
      <k-form-build :value="formcountDatas" ref="kcompanyForms" />
    </a-modal>
    <a-modal
      title="文章批量导入"
      :visible="docvisibles"
      @ok="dochandleOks"
      @cancel="
        () => {
          docvisibles = false;
        }
      "
      width="50%"
    >
      <k-form-build
        :value="docformDatas"
        :config="config"
        @change="changefiles"
        ref="docformDatas"
      />
    </a-modal>
    <!-- 目录迁移 -->
    <a-modal
      title="目录迁移"
      :visible="movevisibles"
      @ok="movechandleOks"
      @cancel="
        () => {
          movevisibles = false;
          $refs.moveform.resetFields();
        }
      "
      width="50%"
    >
      <a-form-model
        :model="moveform"
        ref="moveform"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :rules="rules"
      >
        <a-form-model-item label="迁移组织" prop="site">
          <a-tree-select
            show-search
            style="width: 100%"
            v-model="moveform.site"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="organizations"
            placeholder="请选择迁移组织"
            :replaceFields="{
              title: undefined,
              key: 'id',
              value: 'id',
            }"
            :filterTreeNode="
              (value, node) => {
                const data = node.componentOptions.propsData.dataRef;
                return (
                  data.title.indexOf(value) !== -1 ||
                  data.name.indexOf(value) !== -1
                );
              }
            "
          >
            <span
              slot="title"
              slot-scope="record"
              color="#f50"
              class="channel-tree-item"
            >
              {{ record.title }}
              <a-tag
                color="orange"
                v-if="record.hidden"
                style="max-height: 25px; margin: auto"
                >隐</a-tag
              >
            </span>
          </a-tree-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 下级栏目导出 -->
    <a-modal
      title="下级栏目导出"
      :visible="direxportvisibles"
      :confirmLoading="dirconfirmLoading"
      @ok="direxportOks"
      @cancel="
        () => {
          direxportvisibles = false;
        }
      "
      width="50%"
    >
      <label>导出文件名称：</label>
      <a-input style="width: 100%" v-model="exporttitle" />
    </a-modal>
    <!-- 栏目批量导入 directoryupdateimport -->
    <a-modal
      title="栏目批量导入"
      :visible="updateimportvisibles"
      :confirmLoading="upconfirmLoading"
      @ok="dirupdataOks"
      @cancel="
        () => {
          updateimportvisibles = false;
          dirupdataOkstr = true;
          this.$refs.dirformDatas.reset();
        }
      "
      width="50%"
    >
      <template slot="footer">
        <div style="text-align: right">
          <a-space>
            <a-button @click="cancels">取消</a-button>
            <a-button v-if="dirupdataOkstr" type="primary" @click="dirupdataOks"
              >确定</a-button
            >
          </a-space>
        </div>
      </template>
      <k-form-build
        :value="dirimportformDatas"
        :config="config"
        @change="changedirfiles"
        ref="dirformDatas"
      />
      <a-table
        v-if="!dirupdataOkstr"
        ref="table"
        :bordered="true"
        style="margin: 20px 0"
        size="middle"
        rowKey="id"
        :loading="loading"
        :columns="columns"
        :dataSource="importlist"
        :pagination="{ pageSize: 10, showQuickJumper: true }"
      >
        <span slot="success" slot-scope="text">
          <a-tag :color="text ? 'green' : 'red'">{{
            text ? "成功" : "失败"
          }}</a-tag>
        </span>
      </a-table>
    </a-modal>
    <!-- 目录批量创建 -->
    <a-modal
      title="目录批量创建"
      :visible="channelmanyvisibles"
      :confirmLoading="channelmanyLoading"
      @ok="channelmanyOks"
      :maskClosable="false"
      @cancel="
        () => {
          channelmanyvisibles = false;
          ruleForm = Object.assign({}, ruleForm, {
            datas: [{ titles: '', sites: [], forms: [], isMap: false }],
          });
          $refs.ruleForm.resetFields();
        }
      "
      width="60%"
    >
      <div style="height: 600px; overflow-y: auto">
        <a-form-model
          ref="ruleForm"
          layout="horizontal"
          :model="ruleForm"
          :rules="ruleForms"
          class="ruleFormes"
        >
          <div
            class="topicArea"
            v-for="(item, index) in ruleForm.datas"
            :key="index"
          >
            <a-tag color="#2db7f5" class="icon_number">
              {{ index + 1 }}
            </a-tag>
            <a-space class="icon_close">
              <a-tooltip v-if="index > 0">
                <template slot="title"> 删除当前数据 </template>
                <a-icon
                  type="close-circle"
                  v-if="index > 0"
                  @click="deletsruleForm(item)"
                />
              </a-tooltip>
              <a-tooltip>
                <template slot="title"> 复制当前数据 </template>
                <a-icon type="copy" @click="copysruleForm(item)" />
              </a-tooltip>
            </a-space>
            <a-form-model-item
              label="目录组(以中文逗号隔开)"
              :prop="'datas.' + index + '.titles'"
              :rules="reslee"
            >
              <a-input
                v-model="ruleForm.datas[index].titles"
                placeholder="请按层级输入目录组(以中文逗号隔开)"
              />
              <!-- <a-select
                mode="tags"
                allowClear
                v-model="ruleForm.datas[index].titles"
                style="width: 100%"
                placeholder="请按层级输入目录组"
                notFoundContent="请按层级输入目录组"
              >
              </a-select> -->
            </a-form-model-item>
            <a-form-model-item
              label="子站点组（若当前站点非一级站点，则该字段禁用）"
            >
              <a-select
                mode="multiple"
                :disabled="siteinfo.parent ? true : false"
                v-model="ruleForm.datas[index].sites"
                style="width: 100%"
                placeholder="请选择子站点组"
                :filter-option="filterOption"
              >
                <a-select-option v-for="i in sitesarrays" :key="i.id">
                  {{ i.title }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-model-item label="挂载表单（仅挂载目录最后一个）">
                  <a-select
                    mode="multiple"
                    v-model="ruleForm.datas[index].forms"
                    style="width: 100%"
                    placeholder="请选择挂载表单"
                    :filter-option="filterOption"
                  >
                    <a-select-option v-for="i in formslist" :key="i.id">
                      {{ i.title }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="是否映射">
                  <a-switch
                    default-checked
                    :disabled="siteinfo.parent ? true : false"
                    v-model="ruleForm.datas[index].isMap"
                  />
                  （若当前站点非一级站点，则该字段禁用）
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
          <div style="width: 100%; text-align: center">
            <a-button
              @click="adddatas"
              type="primary"
              icon="plus"
              style="margin: 20px auto; width: 50%"
            >
              添加目录组
            </a-button>
          </div>
        </a-form-model>
      </div>
    </a-modal>
    <!-- 栏目批量创建 -->
    <a-modal
      title="栏目批量创建"
      :visible="directorymanyvisibles"
      :confirmLoading="directorymanyLoading"
      @ok="directorymanyOks"
      :maskClosable="false"
      @cancel="directorycancel"
      width="60%"
    >
      <template slot="footer" style="width: 100%; text-align: right">
        <a-button disabled style="color:#000000"><a-icon type="warning"/> 必须触发一次验证，才能创建！</a-button>
        <a-button type="primary" @click="verifications">验证</a-button>
        <a-button type="primary" @click="directorymanyOks" :loading="directorymanyLoading" v-if="verifys">确定</a-button>
      </template>
      <div style="height: 600px; overflow-y: auto">
        <a-form-model
          ref="ruleFormes"
          layout="horizontal"
          :model="ruleFormes"
          :rules="ruleForms"
          class="ruleFormes"
        >
          <div
            class="topicArea"
            v-for="(item, index) in ruleFormes.datas"
            :key="index"
          >
            <a-tag color="#2db7f5" class="icon_number">
              {{ index + 1 }}
            </a-tag>
            <a-space class="icon_close">
              <a-tooltip v-if="index > 0">
                <template slot="title"> 删除当前数据 </template>
                <a-icon
                  type="close-circle"
                  v-if="index > 0"
                  @click="deletsruleFormes(item)"
                />
              </a-tooltip>
              <a-tooltip>
                <template slot="title"> 复制当前数据 </template>
                <a-icon type="copy" @click="copysruleFormes(item)" />
              </a-tooltip>
            </a-space>
            <a-form-model-item label="站点组">
              <a-select
                mode="multiple"
                :disabled="siteinfo.parent ? true : false"
                v-model="ruleFormes.datas[index].sites"
                style="width: 100%"
                placeholder="请选择子站点组"
                :filter-option="filterOption"
              >
                <a-select-option v-for="i in sitesarrays" :key="i.id">
                  {{ i.title }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-alert
              message="栏目组（栏目名称不填时后台自动生成24位随机字符串，填写时后台会拼接：站点名称+'_'+栏目名称）"
              type="success"
              style="margin-top: 20px"
            />
            <div
              class="topicAreas"
              v-for="(temps, ind) in ruleFormes.datas[index].titles"
              :key="index + '-' + ind"
            >
              <a-tag color="blue" class="icon_numbers">
                {{ ind + 1 }} 级栏目
              </a-tag>
              <a-space class="icon_close">
                <a-tooltip v-if="ind > 0">
                  <template slot="title"> 删除当前数据 </template>
                  <a-icon
                    type="close-circle"
                    v-if="ind > 0"
                    @click="deletsruleFormesdatas(index, temps)"
                  />
                </a-tooltip>
                <a-tooltip>
                  <template slot="title"> 复制当前数据 </template>
                  <a-icon
                    type="copy"
                    @click="copysruleFormesdatas(index, temps)"
                  />
                </a-tooltip>
              </a-space>

              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-model-item
                    label="栏目标题"
                    :prop="'datas.' + index + '.titles.' + ind + '.title'"
                    :rules="reslees"
                  >
                    <a-input
                      placeholder="请输入栏目标题"
                      v-model="ruleFormes.datas[index].titles[ind].title"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="栏目名称">
                    <a-input
                      placeholder="请输入栏目名称"
                      v-model="ruleFormes.datas[index].titles[ind].name"
                    >
                      <span
                        slot="addonBefore"
                        v-if="ruleFormes.datas[index].titles[ind].name"
                        >站点名称_</span
                      >
                    </a-input>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <div
                v-if="ruleFormes.datas[index].titles[ind].judged"
                style="margin: 10px auto"
              >
                <a-alert banner>
                  <template slot="message">
                    <div>当前栏目名称在下列站点内已存在！</div>
                    <a-tag
                      v-for="its in ruleFormes.datas[index].titles[ind].judge"
                      :key="its"
                      >{{ its }}</a-tag
                    >
                  </template>
                </a-alert>
              </div>
            </div>
            <div style="width: 100%; text-align: center">
              <a-button
                @click="adddirectorysdatas(index)"
                icon="plus"
                style="margin: 20px auto; width: 50%"
              >
                添加栏目组
              </a-button>
            </div>
          </div>
          <div style="width: 100%; text-align: center">
            <a-button
              @click="adddirectorys"
              type="primary"
              icon="plus"
              style="margin: 20px auto; width: 50%"
            >
              添加栏目
            </a-button>
          </div>
        </a-form-model>
      </div>
    </a-modal>
  </a-spin>
  <maintain v-else />
</template>
<script>
import {
  channel_list,
  directory_list,
  channel_hidden,
  channel_delete,
  directory_delete,
  channel_sort,
  directory_sort,
  thirdparty_binding,
  thirdparty_get,
  channel_export,
  channel_documentcount,
  operate_lockopen,
  operate_lockclose,
  render_reset,
  channel_excel_template, //文章导入模板下载
  document_excel_import, //文章批量导入
  download_result_paginate, // 文章结果分页
  site_channel_move,
  sync_maps, // 同步映射目录表单
  render_router, //获取站点、目录、文章地址
  directory_children_export, //下级栏目导出
  directory_update_import, //栏目批量导入
  channel_many_insert, //目录批量创建
  directory_many_verify, //栏目批量验证
  directory_many_insert, //栏目批量创建
} from "@/services/content";
import {
  organization_tree,
  organization_get,
  site_documentcount,
} from "@/services/organization";
import InfoDetails from "./components/InfoDetails.vue";
import InfoSite from "./components/InfoSite.vue";
import EditDocuments from "./components/EditDocuments.vue";
import MountForms from "./components/MountForm.vue";
import SetTemplate from "./components/SetTemplate.vue";
import EditChannel from "./components/EditChannel.vue";
import ChannelMapping from "./components/ChannelMapping.vue";
import SiteTemplate from "./components/SiteTemplates.vue";
import RecordInfo from "./components/RecordInfos.vue";
import InfoDirectory from "./components/InfoDirectory.vue";
import EditDirectory from "./components/EditDirectory.vue";
import DocumentSource from "./components/DocumentSource.vue";
import DocumentMove from "./components/DocumentMove.vue";
import DocumentIssued from "./components/DocumentIssued.vue";
import EditChannelDirectory from "./components/EditChannelDirectory.vue";
import ChangeDirectory from "./components/ChangeDirectory.vue";
import Arttemplate from "./components/Arttemplate.vue";
import { form_get, forms_list } from "@/services/forms";
import BatchCreateCatalog from "./components/BatchCreateCatalog.vue";
import BatchCreateColumns from "./components/BatchCreateColumns.vue";

import { mapState } from "vuex";
import PageToggleTransition from "@/components/transition/PageToggleTransition";
import { FormUpload } from "@/services/api";
import Cookie from "js-cookie";
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import maintain from "@/pages/applications/maintain";
import { application_get } from "@/services/application";
Vue.use(VueClipboard);
export default {
  name: "content",
  props: {
    open: {
      type: Function,
    },
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    appid: {
      type: String,
    },
  },
  components: {
    InfoDetails,
    InfoSite,
    mapState,
    PageToggleTransition,
    EditDocuments,
    MountForms,
    SetTemplate,
    EditChannel,
    ChannelMapping,
    SiteTemplate,
    RecordInfo,
    InfoDirectory,
    EditDirectory,
    DocumentSource,
    DocumentMove,
    DocumentIssued,
    EditChannelDirectory,
    ChangeDirectory,
    Arttemplate,
    maintain,
    BatchCreateCatalog,
    BatchCreateColumns
  },

  computed: {
    ...mapState("setting", ["theme", "animate"]),
    headers() {
      return {
        Authorization: Cookie.get("Authorization"),
      };
    },
    config() {
      return {
        uploadFileHeaders: {
          Authorization: Cookie.get("Authorization"),
        },
        uploadImageHeaders: {
          Authorization: Cookie.get("Authorization"),
        },
      };
    },
  },
  data() {
    return {
      loading: false,
      loadings: false,
      spinning: true,
      organizations: [],
      organization: "",
      tabBarStyle: {
        textAlign: "center",
        background: "#1890ff33",
        padding: " 0px  10px",
      },
      siteinfo: {}, //站点详情
      statuslist: {
        //站点类型字典
        0: "市本级",
        1: "区县",
        2: "市直部门",
        3: "市级企事业单位",
        4: "街道办事处",
        5: "区县部门",
        6: "县级企事业单位",
        7: "市政府派出机构",
        8: "县、区政府派出机构",
      },
      router: null,
      params: {},
      channelData: [],
      directoryData: [],
      channelexpandedKeys: [],
      expandedKeys: [],
      channelselectedKeys: [],
      selectedKeys: [],
      defaultSelectedKeys: [],
      back: {
        route: null,
        params: null,
      },
      activekey: "1",
      visible: false,
      visibles: false,
      docvisibles: false,
      formDatas: {},
      formcountDatas: {},
      platform: "",
      Titles: "绑定微信公众号",
      draggables: false,
      draggabless: false,
      methodes: undefined,
      titless: "导出目录发文量",
      channelsss: undefined,
      columnless: undefined, // 栏目双向绑定
      docformDatas: {},
      dirimportformDatas: {},
      // 目录迁移
      movevisibles: false,
      moveform: {
        site: undefined,
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      movechannelid: undefined,
      rules: {
        site: [
          { required: true, message: "请选择迁移组织", trigger: "change" },
        ],
      },
      confirmLoading: false,
      urltype: "",
      urltext: "",
      exportid: "",
      exportsite: "",
      direxportvisibles: false,
      dirconfirmLoading: false,
      updateimportvisibles: false,
      upconfirmLoading: false,
      exporttitle: undefined,
      action: FormUpload,
      fileList: [],
      importlist: [],
      columns: [
        {
          title: "行数",
          dataIndex: "row",
          align: "center",
          width: "120px",
          scopedSlots: { customRender: "row" },
        },
        {
          title: "备注",
          dataIndex: "reason",
          ellipsis: true,
          scopedSlots: { customRender: "reason" },
        },
        {
          title: "操作状态",
          dataIndex: "success",
          align: "center",
          width: "100px",
          scopedSlots: { customRender: "success" },
        },
      ],
      ruleForm: {
        datas: [{ titles: "", sites: [], isMap: false, forms: [] }],
      },
      sitesarrays: [],
      formslist: [],
      ruleForms: {
        titles: [
          { required: true, message: "请按层级输入目录组", trigger: "blur" },
        ],
      },
      dirupdataOkstr: true,
      channelmanyvisibles: false,
      channelmanyLoading: false,
      reslee: {
        required: true,
        message: "请按层级输入目录组",
        trigger: "blur",
      },
      reslees: {
        required: true,
        message: "请输入栏目标题",
        trigger: "blur",
      },
      directorymanyvisibles: false,
      directorymanyLoading: false,
      ruleFormes: {
        datas: [{ sites: [], titles: [{ title: "", name: "" }] }],
      },
      appdata: {
        status: true,
      },
      verifys: false
    };
  },
  created() {
    if (this.data.yingshe) {
      var datas = {
        data: this.data.channel,
        site: this.data.site,
        document: this.data.document,
      };
      this.refreshsite(datas);
    } else {
      application_get({ id: this.appid })
        .then((res) => {
          this.appdata = res.data.data;
          if (this.appdata.status) {
            this.init();
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(response.data.message);
        });
    }
  },
  authorize: {
    siteEdit: "organization.edit",
    recordInfo: "organization.edit",
    siteTemplate: "organization.edit",
  },

  methods: {
    event({ method, params }) {
      if (this[method] && typeof this[method] === "function") {
        this[method](params);
      }
    },
    onOpen(params) {
      this.$emit("open", params || {});
    },
    onLink({ route, params }) {
      if (params.pagination) {
        this.back.route = this.route;
        this.back.params = this.params;
      } else {
        this.back.route = null;
        this.back.params = null;
      }
      //跳转
      this.router = route;
      this.params = params;
    },
    onReload() {
      const func = this.$refs.component.init;
      if (typeof func == "function") {
        func();
      }
    },
    gets(data) {
      data.filter((item) => {
        item.scopedSlots = { title: "title" };
        if (item.children.length) {
          this.gets(item.children);
        } else {
          return;
        }
      });
    },
    // 页面加载
    init() {
      organization_tree() //站点列表
        .then((response) => {
          this.organizations = response.data.data;
          this.organization = this.data.site
            ? this.data.site
            : this.organizations[0].id;
          this.gets(this.organizations);
          this.OrganizationGet(this.organization);
        })
        .catch((err) => {
          console.log(err);
        });
      form_get({ name: "artic_share" })
        .then((res) => {
          this.formDatas = res.data.data.form;
        })
        .catch((err) => {
          console.log(err);
        });
      form_get({ name: "channel_document_count" })
        .then((res) => {
          this.formcountDatas = res.data.data.form;
        })
        .catch((err) => {
          console.log(err);
        });
      form_get({ name: "document_excel_import" })
        .then((res) => {
          this.docformDatas = res.data.data.form;
        })
        .catch((err) => {
          console.log(err);
        });
      form_get({ name: "directory_update_import" })
        .then((res) => {
          this.dirimportformDatas = res.data.data.form;
        })
        .catch((err) => {
          console.log(err);
        });
      forms_list()
        .then((res) => {
          this.formslist = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 站点选择--目录、栏目获取
    OrganizationGet(data) {
      // this.activekey = "1";
      organization_get({ id: data })
        .then((res) => {
          this.siteinfo = res.data.data;
          this.$nextTick(() => {
            Promise.all([
              channel_list({
                site: data,
                tree: true,
                key: Math.random().toString(36).slice(2),
              }),
              directory_list({
                site: data,
                tree: true,
              }),
            ])
              .then((response) => {
                this.channelData = response[0].data.data;
                this.directoryData = response[1].data.data;
                if (this.data.channel) {
                  this.treeSelect([this.data.channel]);
                  this.spinning = false;
                } else {
                  if (this.activekey == "1") {
                    this.params = {
                      site: data,
                      siteinfo: this.siteinfo,
                      channelData: this.channelData,
                    };
                    this.router = "info-details";
                    this.spinning = false;
                  } else if ((this.activekey = "2")) {
                    this.params = { site: data, channelData: this.channelData };
                    this.router = "info-directory";
                    this.spinning = false;
                  }
                }
              })
              .catch((error) => {
                console.log(error);
              });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 目录刷新
    refresh({ data, site }, datas) {
      organization_tree() //站点列表
        .then((response) => {
          this.organizations = response.data.data;
          this.gets(this.organizations);
          this.organization = site;
          organization_get({ id: site })
            .then((res) => {
              this.siteinfo = res.data.data;
              Promise.all([
                channel_list({
                  site: site,
                  tree: true,
                }),
                directory_list({
                  site: site,
                  tree: true,
                }),
              ])
                .then((response) => {
                  this.channelData = response[0].data.data;
                  this.directoryData = response[1].data.data;
                  this.activekey = "1";
                  if (datas) {
                    this.params = { site: site, siteinfo: this.siteinfo };
                    this.router = "info-details";
                    this.spinning = false;
                  } else {
                    this.channelselectedKeys = [data];
                    this.defaultSelectedKeys = [data];
                    this.channelexpandedKeys = [data];
                    this.treeSelect([data]);
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 重新获取不同站点下的文章
    refreshsite({ data, site, document }) {
      organization_tree() //站点列表
        .then((response) => {
          this.organizations = response.data.data;
          this.gets(this.organizations);
          this.organization = site;
          organization_get({ id: site })
            .then((res) => {
              this.siteinfo = res.data.data;
              Promise.all([
                channel_list({
                  site: site,
                  tree: true,
                }),
                directory_list({
                  site: site,
                  tree: true,
                }),
              ])
                .then((response) => {
                  this.spinning = false;
                  this.channelData = response[0].data.data;
                  this.directoryData = response[1].data.data;
                  this.activekey = "1";
                  this.channelselectedKeys = [data];
                  this.channelexpandedKeys = [data];
                  // this.treeSelect([data]);
                  this.channelsss = data;
                  this.params = Object.assign({}, document, {
                    pagination: {
                      page: 1,
                      per_page: 10,
                    },
                    site: site,
                    channel: data,
                    readonly: false,
                    siteinfo: document.parent,
                    channelData: this.channelData,
                  });
                  this.router = "edit-documents";
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 栏目刷新
    refreshes({ data, site }, datas) {
      organization_tree() //站点列表
        .then((response) => {
          this.organizations = response.data.data;
          this.gets(this.organizations);
          this.organization = site;
          organization_get({ id: site })
            .then((res) => {
              this.siteinfo = res.data.data;
              Promise.all([
                channel_list({
                  site: site,
                  tree: true,
                }),
                directory_list({
                  site: site,
                  tree: true,
                }),
              ])
                .then((response) => {
                  this.channelData = response[0].data.data;
                  this.directoryData = response[1].data.data;
                  this.activekey = "2";
                  if (datas) {
                    this.params = { site: site, channelData: this.channelData };
                    this.router = "info-directory";
                    this.spinning = false;
                  } else {
                    this.selectedKeys = [data];
                    this.defaultSelectedKeys = [data];
                    this.expandedKeys = [data];
                    this.treeSelectdire([data]);
                  }
                  // this.selectedKeys = [data];
                  // this.defaultSelectedKeys = [data];
                  // this.expandedKeys = [data];
                  // this.treeSelectdire([data]);
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 编辑站点
    siteEdit(data) {
      this.params = Object.assign({}, data, {
        channel: this.params.channel,
        key: this.activekey,
      });
      this.router = "info-site";
    },
    // 站点设置模板
    siteTemplate(data) {
      this.params = Object.assign({}, data, {
        channel: this.params.channel,
        key: this.activekey,
      });
      this.router = "site-template";
    },
    // 备案信息
    recordInfo(data) {
      this.params = Object.assign({}, data, {
        channel: this.params.channel,
        key: this.activekey,
      });
      this.router = "record-info";
    },
    // 更换站点
    changeaorg(key) {
      this.draggables = false;
      this.spinning = true;
      this.channelsss = undefined;
      this.columnless = undefined;
      this.channelselectedKeys = [];
      this.channelexpandedKeys = [];
      this.selectedKeys = [];
      this.expandedKeys = [];
      this.OrganizationGet(key);
    },
    // 目录-目录切换
    callback(collapsed) {
      this.activekey = collapsed;
      if (collapsed == "1") {
        if (this.channelselectedKeys.length) {
          this.treeSelect(this.channelselectedKeys);
        } else {
          this.params = {
            site: this.params.site,
            siteinfo: this.siteinfo,
            channelData: this.channelData,
          };
          this.router = "info-details";
        }
      } else if (collapsed == "2") {
        if (this.selectedKeys.length) {
          this.treeSelectdire(this.selectedKeys);
        } else {
          this.params = { site: this.params.site };
          this.router = "info-directory";
        }
      }
    },
    // 目录选择
    treeSelect(selectedKeys) {
      console.log("treeSelect", selectedKeys);
      this.channelsss = selectedKeys[0];
      this.channelselectedKeys = selectedKeys || [];
      this.defaultSelectedKeys = selectedKeys || [];
      this.channelexpandedKeys = selectedKeys || [];
      this.params = Object.assign(
        {},
        {
          site: this.organization,
          channel: selectedKeys[0] || "",
          siteinfo: this.siteinfo,
          pagination: {
            page: 1,
            per_page: 10,
          },
          search: {
            keyword: this.data.search ? this.data.search : undefined,
          },
          channelData: this.channelData,
        }
      );
      this.router = "info-details";
    },
    // 栏目选择
    treeSelectdire(selectedKeys) {
      console.log("treeSelectdire", selectedKeys);
      this.columnless = selectedKeys[0];
      this.selectedKeys = selectedKeys || [];
      this.defaultSelectedKeys = selectedKeys || [];
      this.expandedKeys = selectedKeys || [];
      this.params = {
        site: this.organization,
        channel: selectedKeys[0] || "",
        pagination: {
          page: 1,
          per_page: 10,
        },
      };
      this.router = "info-directory";
    },
    onExpand(expandedKeys, info) {
      if (info.expanded) {
        this.channelexpandedKeys = [];
      } else {
        this.channelexpandedKeys = [expandedKeys];
      }
    },
    onExpanddire(expandedKeys, info) {
      if (info.expanded) {
        this.expandedKeys = [];
      } else {
        this.expandedKeys = [expandedKeys];
      }
    },
    // 空白右键
    ondesktopmenu(event) {
      if (this.activekey == "1") {
        if (!this.channelData.length) {
          this.$contextmenu({
            items: [
              {
                label: "目录添加",
                onClick: () => {
                  this.addchannel();
                },
              },
            ],
            event,
            customClass: "class-a",
            zIndex: 6000,
            minWidth: 230,
          });
          return false;
        }
      } else {
        if (!this.directoryData.length) {
          this.$contextmenu({
            items: [
              {
                label: "添加栏目",
                onClick: () => {
                  this.adddirectory();
                },
              },
            ],
            event,
            customClass: "class-a",
            zIndex: 6000,
            minWidth: 230,
          });
          return false;
        }
      }
    },
    // 目录右键
    onRightClickchannel({ event, node }) {
      event.stopPropagation();
      let record = node.$options.propsData.dataRef;
      if (!record.dir) {
        this.$contextmenu({
          items: [
            {
              label: "目录添加",

              icon: "el-icon-printer",
              onClick: () => {
                this.addchannel(record);
              },
            },
            {
              label: "目录编辑",
              icon: "edit",

              onClick: () => {
                this.editchannel(record);
              },
            },
            {
              label: "目录映射",
              onClick: () => {
                this.channelMappinng(record);
              },
            },
            {
              label: "目录删除",
              divided: true,
              shadow: true,
              onClick: () => {
                this.onDelete(record);
              },
            },
            {
              label: "挂载表单",
              onClick: () => {
                this.onEditForms(record);
              },
            },
            {
              label: "设置审批流程",
              onClick: () => {
                this.onStatus(record, true);
              },
            },
            {
              label: "查看审批流程",
              divided: true,
              onClick: () => {
                this.onCheckStatus(record, true);
              },
            },

            {
              label: "设置模板",
              onClick: () => {
                this.settemplate(record);
              },
            },

            {
              label: "显示/隐藏",
              onClick: () => {
                this.onHidden(record);
              },
            },

            {
              label: "获取目录名称",
              onClick: () => {
                this.copyname(record.name);
              },
            },
            {
              label: "更新目录缓存",
              children: [
                {
                  label: "读取最新数据",
                  onClick: () => {
                    this.Updatecache(record, true);
                  },
                },
                {
                  label: "读取缓存数据",
                  onClick: () => {
                    this.Updatecache(record, false);
                  },
                },
              ],
            },
          ],
          event,
          customClass: "class-a",
          zIndex: 6000,
          minWidth: 230,
        });
        return false;
      }
    },
    // 目录映射
    channelMappinng(record) {
      console.log("recordrecord", record);
      this.params = Object.assign({}, record, { site: this.organization });
      this.channelselectedKeys = [record.id];
      this.defaultSelectedKeys = [record.id];
      this.channelexpandedKeys = [record.id]; //展开父级
      this.router = "channel-mapping";
    },
    //目录添加
    addchannel(record) {
      const parent = record ? record.id : undefined;
      this.params = Object.assign(
        {},
        { site: this.params.site, id: undefined, parent: parent }
      );
      this.channelselectedKeys = [];
      this.defaultSelectedKeys = [];
      this.channelexpandedKeys = [];
      this.router = "edit-channel";
    },
    // 目录编辑
    editchannel(record) {
      this.channelselectedKeys = [record.id];
      this.defaultSelectedKeys = [record.id];
      this.channelexpandedKeys = [record.id]; //展开父级
      this.params = Object.assign({}, this.params, {
        id: record.id,
      });
      this.router = "edit-channel";
    },
    // 目录删除
    onDelete(record) {
      var that = this;
      this.$confirm({
        title: "确定要删除此目录吗?",
        content: "该操作不可逆 !请谨慎操作 !",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          channel_delete({
            id: record.id,
          })
            .then((res) => {
              that.channelselectedKeys = [];
              that.defaultSelectedKeys = [];
              that.refresh({ data: record.id, site: that.organization }, true);
              if (res.data.status) {
                that.$message.success(res.data.message);
              } else {
                that.$message.error(res.data.reason);
              }
              if (that.channelsss == record.id) {
                that.channelsss = undefined;
                that.channelselectedKeys = [];
                that.channelexpandedKeys = [];
              }
            })
            .catch((err) => {
              that.$message.error(err.response.data.message);
              that.loading = false;
            });
        },
        onCancel() {},
      });
    },
    // 目录迁移
    onmove(record) {
      console.log("record", record);
      this.movevisibles = true;
      this.movechannelid = record.id;
      this.$nextTick(() => {
        this.$refs.moveform.resetFields();
      });
    },
    // 目录迁移提交
    movechandleOks() {
      this.$refs.moveform.validate((valid) => {
        if (valid) {
          var datas = {
            site: this.moveform.site,
            channel: this.movechannelid,
          };
          site_channel_move(datas)
            .then((res) => {
              this.$message.success(res.data.data);
              this.movevisibles = false;
              this.refresh({ data: undefined, site: this.organization });
            })
            .catch((err) => {
              console.log(err);
              this.$message.error(err.response.data.message);
            });
        } else {
          this.$message.error("请选择迁移组织!");
        }
      });
    },
    // 目录设置模板
    settemplate(record) {
      this.channelselectedKeys = [record.id];
      this.defaultSelectedKeys = [record.id];
      this.channelexpandedKeys = [record.id];
      this.params = Object.assign({}, this.params, {
        id: record.id,
      });
      this.router = "set-template";
    },
    // 目录挂载表单
    onEditForms(record) {
      this.channelselectedKeys = [record.id];
      this.defaultSelectedKeys = [record.id];
      this.channelexpandedKeys = [record.id];
      this.params = Object.assign({}, this.params, {
        id: record.id,
      });
      this.router = "mount-forms";
      // this.treeSelect([record.id])
    },
    // 目录显隐
    onHidden(record) {
      this.loading = true;
      channel_hidden({
        id: record.id,
      })
        .then((response) => {
          console.log("response", response);
          this.refresh({ data: record.id, site: this.organization });
          this.$message.success(response.data.message);
        })
        .catch((error) => {
          this.$message.error(error.response.data.data.message);
          this.loading = false;
        });
    },
    // 一键同步映射目录表单
    sync_map(record) {
      sync_maps({
        id: record.id,
      })
        .then(() => {
          this.$message.success("操作成功！");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 栏目右键
    onRightClick({ event, node }) {
      event.stopPropagation();
      let record = node.$options.propsData.dataRef;
      if (!record.dir) {
        this.$contextmenu({
          items: [
            {
              label: "添加栏目",
              onClick: () => {
                this.adddirectory(record);
              },
            },
            {
              label: "编辑栏目",
              onClick: () => {
                this.editdirectory(record);
              },
            },
            {
              label: "编辑栏目目录",
              onClick: () => {
                this.editchanneldirectory(record);
              },
            },
            {
              label: "修改名称",
              disabled: false,
              divided: true,
              onClick: () => {
                this.changedirectory(record);
              },
            },
            {
              label: "删除栏目",
              onClick: () => {
                this.deletedirectory(record);
              },
            },
            {
              label: "获取栏目名称",
              onClick: () => {
                this.copyname(record.name);
              },
            },
          ],
          event,
          customClass: "class-a",
          zIndex: 6000,
          minWidth: 230,
        });
        return false;
      }
    },
    // 栏目添加
    adddirectory(record) {
      this.params = {
        organization: this.organization,
      };
      this.params = Object.assign(
        {},
        {
          id: undefined,
          organization: this.organization,
          parent: record ? record.id : "",
        }
      );
      this.selectedKeys = [];
      this.defaultSelectedKeys = [];
      this.expandedKeys = [];
      this.router = "edit-directory";
    },
    // 栏目编辑
    editdirectory(data) {
      this.params = Object.assign({}, data, {
        organization: this.organization,
      });
      this.selectedKeys = [data.id];
      this.defaultSelectedKeys = [data.id];
      this.expandedKeys = [data.id];
      this.router = "edit-directory";
    },
    // 栏目设置目录
    editchanneldirectory(data) {
      this.params = Object.assign({}, data, {
        organization: this.organization,
      });
      this.selectedKeys = [data.id];
      this.defaultSelectedKeys = [data.id];
      this.expandedKeys = [data.id];
      this.router = "edit-channel-directory";
    },
    // 栏目修改
    changedirectory(data) {
      this.params = Object.assign({}, data, {
        organization: this.organization,
      });
      this.selectedKeys = [data.id];
      this.defaultSelectedKeys = [data.id];
      this.expandedKeys = [data.id];
      this.router = "change-directory";
    },
    // 栏目删除
    deletedirectory(record) {
      var that = this;
      this.$confirm({
        title: "确定要删除此栏目吗?",
        content: "该操作不可逆 !请谨慎操作 !",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          directory_delete({
            id: record.id,
          })
            .then((res) => {
              that.selectedKeys = [];
              that.defaultSelectedKeys = [];
              if (that.columnless == record.id) {
                that.columnless = undefined;
                that.selectedKeys = [];
                that.expandedKeys = [];
              }
              that.refreshes(
                { data: record.id, site: that.organization },
                true
              );
              that.$message.success(res.data.message);
            })
            .catch((err) => {
              that.$message.error(err.response.data.message);
              that.loading = false;
            });
        },
        onCancel() {},
      });
    },
    // 树状拖拽
    onDrop(info) {
      const dropKey = info.node.eventKey; //迁移主键
      const dragKey = info.dragNode.eventKey; //目标主键
      const dropPos = info.node.pos.split("-");
      const dropPosition =
        info.dropPosition - Number(dropPos[dropPos.length - 1]); //位置
      var datas = {
        id: dragKey,
        target: dropKey,
        position: dropPosition,
      };
      if (this.activekey == "1") {
        channel_sort(datas)
          .then((res) => {
            this.refresh({ data: dragKey, site: this.organization });
          })
          .catch((err) => {
            console.log(err);
            this.$message.error(err.response.data.message);
          });
      } else if (this.activekey == "2") {
        directory_sort(datas)
          .then((res) => {
            this.refreshes({ data: dragKey, site: this.organization });
          })
          .catch((err) => {
            console.log(err);
            this.$message.error(err.response.data.message);
          });
      }
    },
    // 树状拖拽
    onDragEnter(info) {
      if (this.activekey == "1") {
        this.channelexpandedKeys = [
          ...info.expandedKeys,
          ...this.channelexpandedKeys,
        ];
      } else if (this.activekey == "2") {
        this.expandedKeys = [...info.expandedKeys, ...this.expandedKeys];
      }
    },
    // 获取目录地址
    render_routers(record, type) {
      var data = {};
      if (type) {
        data = {
          site: record.id,
        };
      } else {
        data = {
          channel: record.id,
        };
      }
      render_router(data)
        .then((res) => {
          if (type) {
            this.urltype = "站点地址：";
            this.urltext = res.data.data.site.router;
          } else {
            this.urltype = "目录地址：";
            this.urltext = res.data.data.channel.router;
          }
          var that = this;
          that.$info({
            title: that.urltype,
            content: that.urltext,
            okText: "复制",
            onOk() {
              that
                .$copyText(that.urltext)
                .then((res) => {
                  that.$message.success("复制成功!");
                })
                .catch((err) => {
                  console.log(err);
                  that.$message.error("复制失败！");
                });
            },
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
    },
    // 复制目录名称
    copyname(name) {
      this.$copyText(name)
        .then((res) => {
          this.$message.success("复制成功!");
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("复制失败！");
        });
    },
    //更新目录缓存
    Updatecache(record, bolean) {
      render_reset({
        channel: record.id,
        nocache: bolean,
      })
        .then((response) => {
          if (response.data.status == 200) {
            this.$message.success(response.data.message);
            this.treeSelect([record.id]);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    // 更新首页缓存
    Updatecaches(bolean) {
      render_reset({ site: this.organization, nocache: bolean })
        .then((response) => {
          if (response.data.status == 200) {
            this.$message.success(response.data.message);
            this.loading = true;
            this.spinning = true;
            this.OrganizationGet(this.organization);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    /**
     * 审批流程
     */
    onStatus(record, ischannel) {
      ischannel = ischannel || false;
      this.onOpen({
        id: record.id,
        name: "Approve",
        title: `设置审批流程 -- ${record.title}`,
        status: true,
        location: "top",
        sort: 0,
        type: "system",
        hidden: false,
        width: "75%",
        height: "75%",
        router: "Approve",
        data: {
          isChannel: ischannel,
          params: record,
          site: this.organization,
        },
        cancel: () => {},
      });
    },
    // 绑定
    bindings(name) {
      this.visible = true;
      this.platform = name;
      if (name == "wx") {
        this.Titles = "绑定微信公众号";
      } else {
        this.Titles = "绑定微博帐号";
      }
      thirdparty_get({
        site: this.siteinfo.id,
        platform: this.platform,
      })
        .then((response) => {
          if (response.data.data.appid) {
            this.$nextTick(() => {
              this.$refs.kcompanyForm.setData({
                appid: response.data.data.appid,
                secret: response.data.data.secret,
              });
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
    },
    handleOk() {
      this.$refs.kcompanyForm
        .getData()
        .then((res) => {
          const datas = Object.assign(res, {
            site: this.siteinfo.id,
            platform: this.platform,
          });
          thirdparty_binding(datas)
            .then((res) => {
              if (res.data.status == 200) {
                this.$message.success(res.data.message);
                this.visible = false;
                this.$refs.kcompanyForm.reset();
              } else {
                this.$message.info(res.data.message);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleCancel() {
      this.visible = false;
      this.$refs.kcompanyForm.reset();
    },
    draggableschange(record) {
      if (record) {
        operate_lockclose({
          site: this.organization,
          interface: "channel.sort",
        })
          .then(() => {
            this.draggables = true;
          })
          .catch((error) => {
            this.draggables = false;
            this.$message.error(error.response.data.message);
            console.log(error);
          });
      } else {
        operate_lockopen({
          site: this.organization,
          interface: "channel.sort",
        })
          .then(() => {
            this.draggables = false;
          })
          .catch((error) => {
            console.log(error);
            this.$message.error(error.response.data.message);
            this.draggables = true;
          });
      }
    },
    draggableschanges(record) {
      this.draggabless = record;
    },
    changefiles(key, value) {
      var that = this;
      if (value == "path") {
        for (let item in key) {
          console.log(item);
          if (key[item].name.indexOf(".xlsx") > -1) {
            console.log("文件格式正确");
          } else {
            this.$message.error("请上传指定格式文件!");
            that.$nextTick(() => {
              that.$refs.docformDatas.setData({
                path: [],
              });
            });
          }
        }
      }
    },
    // 文章导入模板
    getmoudle(record) {
      channel_excel_template({ channel: record.id })
        .then((response) => {
          const a = document.createElement("a");
          var bstr = atob(response.data.data),
            n = bstr.length,
            u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const blob = new Blob([u8arr], {
            type: response.data.mimetype,
          });
          a.download = response.data.filename;
          a.href = window.URL.createObjectURL(blob);
          a.click();
          this.$message.success("操作成功！");
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
    },
    // 文章导入
    docbatch() {
      this.docvisibles = true;
      this.$nextTick(() => {
        this.$refs.docformDatas.reset();
      });
    },
    dochandleOks() {
      this.$refs.docformDatas
        .getData()
        .then((res) => {
          document_excel_import({
            path: "/data" + res.path[0].url,
            title: res.title,
          })
            .then((response) => {
              this.$message.success(response.data.data);
              this.docvisibles = false;
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
    },
    // 查看导入结果
    getbatchresult() {
      this.params = Object.assign({}, this.siteinfo, {
        channel: this.params.channel,
        key: this.activekey,
      });
      this.router = "Arttemplate";
    },

    // 导出目录
    exportes() {
      channel_export({ site: this.siteinfo.id })
        .then((response) => {
          var name = "目录文件";
          const a = document.createElement("a");
          var bstr = atob(response.data.data),
            n = bstr.length,
            u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const blob = new Blob([u8arr], {
            type: response.data.mimetype,
          });
          a.download = name;
          a.href = window.URL.createObjectURL(blob);
          a.click();
          this.$message.success("操作成功！");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    exportescount() {
      this.methodes = channel_documentcount;
      this.visibles = true;
      this.titless = "导出目录发文量";
      this.$refs.kcompanyForms.reset();
    },
    exportessitecount() {
      this.visibles = true;
      this.methodes = site_documentcount;
      this.titless = "导出站点发文量";
      this.$refs.kcompanyForms.reset();
    },
    directoryupdateimport() {
      this.updateimportvisibles = true;
    },

    handleOks() {
      this.$refs.kcompanyForms
        .getData()
        .then((response) => {
          this.confirmLoading = true;

          this.methodes({
            site: this.siteinfo.id,
            start: response.ranges[0],
            end: response.ranges[1],
          })
            .then((res) => {
              var name =
                this.methodes == channel_documentcount
                  ? "目录发文量"
                  : "站点发文量";
              const a = document.createElement("a");
              var bstr = atob(res.data.data),
                n = bstr.length,
                u8arr = new Uint8Array(n);
              while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
              }
              const blob = new Blob([u8arr], {
                type: res.data.mimetype,
              });
              a.download = name;
              a.href = window.URL.createObjectURL(blob);
              a.click();
              this.$message.success("操作成功！");
              this.confirmLoading = false;
              this.visibles = false;
            })
            .catch((err) => {
              console.log(err);
              this.confirmLoading = false;
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleCancels() {
      this.visibles = false;
      this.$refs.kcompanyForms.reset();
    },
    /* 检索块功能触发目录树刷新 */
    researchchannel(key) {
      console.log("researchchannel", key);
      this.treeSelect([key]);
    },
    researchcolumn(key) {
      this.treeSelectdire([key]);
    },
    // 下级栏目导出
    directoryexport(data) {
      console.log("data", data);
      this.exportid = data.id;
      this.exportsite = data.site;
      this.direxportvisibles = true;
      this.exporttitle = undefined;
    },
    // 保存
    direxportOks() {
      if (this.exporttitle) {
        this.dirconfirmLoading = true;
        directory_children_export({
          title: this.exporttitle,
          directory: this.exportid,
          site: this.exportsite,
        })
          .then((response) => {
            var name = response.data.title;
            const a = document.createElement("a");
            var bstr = atob(response.data.data),
              n = bstr.length,
              u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            const blob = new Blob([u8arr], {
              type: response.data.mime,
            });
            a.download = name;
            a.href = window.URL.createObjectURL(blob);
            a.click();
            this.$message.success("操作成功！");
            this.dirconfirmLoading = false;
            this.direxportvisibles = false;
          })
          .catch((error) => {
            console.log(error);
            this.dirconfirmLoading = false;
            this.$message.error(error.response.data.message);
          });
      } else {
        this.$message.error("请输入导出文件的名称");
      }
    },
    changedirfiles(key, value) {
      var that = this;
      if (value == "uploadFiles") {
        for (let item in key) {
          console.log(item);
          if (key[item].name.indexOf(".xlsx") > -1) {
            console.log("文件格式正确");
          } else {
            this.$message.error("请上传指定格式文件!");
            that.$nextTick(() => {
              that.$refs.dirformDatas.setData({
                uploadFiles: [],
              });
            });
          }
        }
      }
    },
    cancels() {
      (this.updateimportvisibles = false),
        (this.dirupdataOkstr = true),
        this.$refs.dirformDatas.reset();
    },
    // 栏目批量导入
    dirupdataOks() {
      this.$refs.dirformDatas
        .getData()
        .then((response) => {
          console.log("response", response);
          directory_update_import({
            path: "/data" + response.uploadFiles[0].url,
          })
            .then((res) => {
              console.log("res", res);
              this.$message.success(res.data.message);
              this.importlist = res.data.data;
              this.dirupdataOkstr = false;
              // this.updateimportvisibles = false;
              // this.$refs.dirformDatas.reset();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((error) => {
          console.log(error);
          this.$message.error("请上传文件!");
        });
    },
    // 目录批量创建
    channelmanyinsert() {
      this.params = Object.assign({}, this.siteinfo, 
      { 
        channel: this.channelsss,
        key: this.activekey,
      });
      this.router = "BatchCreateCatalog";
    },
    // 目录批量添加
    adddatas() {
      this.ruleForm.datas.push({
        titles: "",
        sites: [],
        forms: [],
        isMap: false,
      });
    },
    // 保存
    channelmanyOks() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // this.channelmanyLoading = true;
          var arrays = [];
          for (let i in this.ruleForm.datas) {
            console.log("i", i);
            arrays.push({
              titles: this.ruleForm.datas[i].titles.split("，"),
              sites: this.ruleForm.datas[i].sites,
              forms: this.ruleForm.datas[i].forms,
              isMap: this.ruleForm.datas[i].isMap,
            });
          }
          var datas = {
            site: this.siteinfo.id,
            datas: arrays,
          };
          channel_many_insert(datas)
            .then((res) => {
              this.channelmanyvisibles = false;
              this.channelmanyLoading = false;
              this.ruleForm = Object.assign({}, this.ruleForm, {
                datas: [{ titles: "", sites: [], forms: [], isMap: false }],
              });
              this.spinning = true;
              this.init();
            })
            .catch((err) => {
              console.log(err);
              this.channelmanyLoading = false;
              this.$message.error(err.response.data.message);
            });
        }
      });
    },
    // 删除目录
    deletsruleForm(item) {
      let index = this.ruleForm.datas.indexOf(item);
      if (index !== -1) {
        this.ruleForm.datas.splice(index, 1);
      }
    },
    // 复制目录
    copysruleForm(item) {
      this.ruleForm.datas.push({
        titles: item.titles,
        sites: item.sites,
        forms: item.forms,
        isMap: item.isMap,
      });
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.indexOf(input) >= 0;
    },

    // 栏目批量创建
    directorymanyinsert() {
      this.params = Object.assign({}, this.siteinfo, 
      { 
        channel: this.columnless,
        key: this.activekey,
      });
      this.router = 'BatchCreateColumns'
    },
    // 栏目验证
    verifications() {
      this.$refs.ruleFormes.validate((valid) => {
        if (valid) {
          console.log("ruleFormes", this.ruleFormes);
          var datas = {
            site: this.siteinfo.id,
            datas: this.ruleFormes.datas,
          };
          directory_many_verify(datas)
            .then((res) => {
              var datas = res.data.data.datas;
              this.verifys = true;
              console.log("resresres", res);
              this.$nextTick(() => {
                for (let i in datas) {
                  for (let j in datas[i].titles) {
                    this.ruleFormes.datas[i].titles[j].judge = [];
                    this.ruleFormes.datas[i].titles[j].judge =
                      datas[i].titles[j].exists;
                    if (datas[i].titles[j].exists.length) {
                      this.ruleFormes.datas[i].titles[j].judged = true;
                    } else {
                      this.ruleFormes.datas[i].titles[j].judged = false;
                    }
                  }
                }
                console.log("this.ruleFormes", this.ruleFormes);
                this.$forceUpdate();
              });
            })
            .catch((error) => {
              console.log("error", error);
              this.$message.error(error.response.data.message);
            });
        }
      });
    },
    // 栏目保存
    directorymanyOks() {
      this.directorymanyLoading = true
      this.$refs.ruleFormes.validate((valid) => {
        if (valid) {
          var datas = {
            site: this.siteinfo.id,
            datas: this.ruleFormes.datas,
          };
          directory_many_insert(datas)
            .then((res) => {
              console.log('res', res)
              if(res.data.status == 200){
                this.$message.success(res.data.message)
                this.directorymanyvisibles = false;
                this.directorymanyLoading = false;
                this.spinning = true;
                this.directorymanyvisibles = false;
                this.ruleFormes = Object.assign({}, this.ruleFormes, {
                  datas: [{ sites: [], titles: [{ title: "", name: "" }] }],
                });
                this.$refs.ruleFormes.resetFields();
                this.init();
              }
            })
            .catch((error) => {
              console.log("error", error);
              this.directorymanyLoading = false
              this.$message.error(error.response.data.message);
            });
        }
      });
    },
    // 添加栏目
    adddirectorys() {
      this.ruleFormes.datas.push({
        sites: [],
        titles: [{ title: "", name: "" }],
      });
    },
    // 复制栏目
    copysruleFormes(item) {
      var titles=[]
      for(let i in item.titles){
        titles.push({
          title: item.titles[i].title,
          name: item.titles[i].name,
        })
      }
      this.ruleFormes.datas.push({
        sites: item.sites,
        titles: titles,
      });
    },
    // 删除栏目
    deletsruleFormes(item) {
      let index = this.ruleFormes.datas.indexOf(item);
      if (index !== -1) {
        this.ruleFormes.datas.splice(index, 1);
      }
    },
    // 添加栏目组
    adddirectorysdatas(index) {
      this.ruleFormes.datas[index].titles.push({
        title: "",
        name: "",
      });
    },
    // 删除栏目组
    deletsruleFormesdatas(index, temps) {
      let indexs = this.ruleFormes.datas[index].titles.indexOf(temps);
      if (indexs !== -1) {
        this.ruleFormes.datas[index].titles.splice(indexs, 1);
      }
    },
    // 复制栏目组
    copysruleFormesdatas(index, temps) {
      this.ruleFormes.datas[index].titles.push({
        title: temps.title,
        name: temps.name,
      });
    },

    // 取消栏目弹框
    directorycancel() {
      this.directorymanyvisibles = false;
      this.ruleFormes = Object.assign({}, this.ruleFormes, {
        datas: [{ sites: [], titles: [{ title: "", name: "" }] }],
      });
      this.$refs.ruleFormes.resetFields();
    },
  },
};
</script>
<style scoped>
.ruleFormes >>> .ant-form-item {
  margin-bottom: 0px !important;
}
.topicArea {
  position: relative;
  padding: 5px 8% 5px;
  width: 90%;
  margin: 20px auto;
  border-radius: 5px;
  box-shadow: rgb(186 207 233) 0 0 5px;
}
.topicAreas {
  position: relative;
  width: 100%;
  padding: 10px 10% 10px;
  margin: 20px 0;
  border-radius: 5px;
  box-shadow: rgb(186 207 233) 0 0 5px;
}
.topicAreas:hover {
  background: #cef0ff;
}
.tabs_top {
  height: calc(100% - 52px);
}
.tabs_top >>> .ant-tabs-bar {
  margin: 0;
}
.tabs_top >>> .ant-tabs-content {
  height: calc(100% - 55px);
}
.tabs_top >>> .ant-tabs-top-content > .ant-tabs-tabpane {
  height: 100%;
  overflow-y: auto;
}
.tabs_top >>> .ant-tabs-top-content > .ant-tabs-tabpane {
  height: 100%;
  overflow-y: auto;
}
.tabs_swich {
  width: 100%;
  text-align: left;
  padding: 10px 30px;
  background: #e4f5ff;
}
.tabs_swich span {
  /* font-size: 16px; */
  line-height: 20px;
}
.copys {
  cursor: pointer;
  padding: 0 10px;
  color: #1890ff;
}
.ant-layout-sider {
  min-width: 300px !important;
}
.ant-layout-header {
  height: 107px !important;
}
.ant-layout-sider,
.ant-layout-header {
  background: #fafafa !important;
  /* border: 1px solid #fafafa; */
}
.ant-layout-header {
  padding: 0px !important;
}
.draggable-tree {
  height: calc(100% - 95px);
}
.draggable-tree >>> li {
  white-space: pre-line;
}
.draggable-tree >>> .ant-tree-node-content-wrapper,
.draggable-tree >>> .ant-tree-node-content-wrapper-normal {
  height: auto !important;
}
.ant-tree.ant-tree-block-node li .ant-tree-node-content-wrapper {
  height: auto !important;
}
.channel-tree-item {
  display: flex;
}
.channel-tree-item_left {
  width: calc(100% - 30px);
  /* overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; */
}
.channel-tree-item >>> .icon_more {
  width: 30px;
  display: flex;
  justify-items: center;
  align-items: center;
}

.header_styles {
  height: 100%;
  line-height: initial;
  overflow-y: auto;
  background: #1890ff33;
  border-bottom: 1px solid #aaa;
  border-left: 1px solid #fafafa;
}
.dividers {
  border-bottom: 1px solid #eee;
}
.icon_close {
  position: absolute;
  right: 5px;
  top: 0;
  font-size: 20px;
  color: #919191;
  cursor: pointer;
}
.icon_number {
  position: absolute;
  left: 5px;
  top: 5px;
  font-size: 20px;
}
.icon_numbers {
  position: absolute;
  left: 5px;
  top: 5px;
}
</style>
<style>
.ant-descriptions-item {
  padding: 13px !important;
}
.ant-tabs-bar {
  border-bottom: 1px solid #aaa;
}
</style>
