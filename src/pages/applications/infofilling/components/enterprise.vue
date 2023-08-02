<template>
  <div class="mains_page">
    <!-- 企业基本信息 -->
    <a-card class="basc_info" :loading="loading">
      <span slot="title" style="font-size: 18px; font-weight: 600"
        >基本信息</span
      >
      <a slot="extra" href="#" @click="edit_bascinfo" v-if="visble_bascinfo">
        <a-icon type="edit" />编辑
      </a>
      <span slot="extra" v-else>
        <a href="#" @click="submitbasc"> 保存 </a>
        <a-divider type="vertical" />
        <a
          href="#"
          @click="
            () => {
              visble_bascinfo = true;
              getinfo();
            }
          "
        >
          取消
        </a>
      </span>

      <div v-if="visble_bascinfo" style="padding-top: 20px">
        <a-row :gutter="24">
          <a-col :span="4" style="text-align: end" class="logo_s">
            <img
              :src="
                bascform.logo.length
                  ? bascform.logo[0].url
                  : '/resources/public/20220906/6316e717d4363cd8d75cff75.jpg'
              "
              @click="
                onPicPreviews(
                  bascform.logo,
                  bascform.logo.length
                    ? bascform.logo[0].url
                    : '/resources/public/20220906/6316e717d4363cd8d75cff75.jpg'
                )
              "
            />
          </a-col>
          <a-col :span="20">
            <a-descriptions class="descriptions_s">
              <span slot="title">
                <a-tag
                  :color="
                    getcolor(
                      statuslist,
                      bascform.industry.length ? bascform.industry[0] : '',
                      'status'
                    )
                  "
                  >{{
                    bascform.industry.length ? bascform.industry[0].status : ""
                  }}</a-tag
                >
                {{ bascform.title }}
              </span>
              <a-descriptions-item label="联系人">
                {{ bascform.rperson }}
              </a-descriptions-item>
              <a-descriptions-item label="联系电话">
                {{ bascform.rmobile }}
              </a-descriptions-item>
              <a-descriptions-item label="数据来源">
                <a-tag
                  :color="bascform.comeform == 'PC端' ? 'orange' : 'cyan'"
                  >{{ bascform.comeform }}</a-tag
                >
              </a-descriptions-item>
              <a-descriptions-item label="电子邮件">
                {{ bascform.email }}
              </a-descriptions-item>
              <a-descriptions-item label="企业地址" span="2">
                {{ bascform.address }}
              </a-descriptions-item>
              <a-descriptions-item label="企业简介">
                {{ bascform.content }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
        </a-row>
      </div>
      <div v-else style="padding-top: 20px">
        <a-form-model
          ref="bascform"
          :model="bascform"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="企业名称" prop="title">
                <a-input
                  v-model="bascform.title"
                  placeholder="请输入企业名称"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="联系人" prop="rperson">
                <a-input
                  v-model="bascform.rperson"
                  placeholder="请输入企业联系人"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="联系电话" prop="rmobile">
                <a-input
                  v-model="bascform.rmobile"
                  placeholder="请输入企业联系电话(座机或手机)"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="电子邮件">
                <a-input
                  v-model="bascform.email"
                  placeholder="请输入企业电子邮件"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="企业地址" prop="address">
                <a-input
                  v-model="bascform.address"
                  placeholder="请输入企业地址"
                />
              </a-form-model-item>
            </a-col>

            <a-col :span="12">
              <a-form-model-item label="企业简介" prop="content">
                <a-textarea
                  v-model="bascform.content"
                  placeholder="请输入企业简介"
                />
              </a-form-model-item>
            </a-col>
            <!-- <a-col :span="12">
              <a-form-model-item label="数据来源" prop="comeform">
                <a-select
                  v-model="bascform.comeform"
                  allowClear
                  style="width: 100%"
                  placeholder="请选择数据来源"
                >
                  <a-select-option key="PC端">PC端</a-select-option>
                  <a-select-option key="小程序端">小程序端</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col> -->
            <a-col :span="12">
              <a-form-model-item label="企业LOGO">
                <a-upload
                  name="file"
                  list-type="picture-card"
                  :show-upload-list="false"
                  :action="action"
                  :headers="headers"
                  @change="upLoadChange"
                >
                  <img
                    v-if="bascform.logo.length"
                    :src="bascform.logo[0].url"
                    alt="avatar"
                    style="
                      width: 120px;
                      height: 120px;
                      border-radius: 50%;
                      object-fit: cover;
                    "
                  />
                  <div v-else>
                    <div class="ant-upload-text">上传LOGO</div>
                  </div>
                </a-upload>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <!-- 用地情况 -->
    <a-card class="business_info" :loading="loading">
      <span slot="title" style="font-size: 18px; font-weight: 600"
        >用地信息</span
      >
      <a slot="extra" href="#" @click="edit_land" v-if="visble_land">
        <a-icon type="edit" />编辑
      </a>
      <span slot="extra" v-else>
        <a href="#" @click="submitland"> 保存 </a>
        <a-divider type="vertical" />
        <a
          href="#"
          @click="
            () => {
              visble_land = true;
              getinfo();
            }
          "
        >
          取消
        </a>
      </span>
      <div v-if="visble_land" style="padding-top: 20px">
        <div v-for="(item, index) in lands" :key="'lands' + index">
          <a-col :span="6">
            <a-form-model-item
              class="fontsize_label"
              :label-col="{ span: '8' }"
              :wrapper-col="{ span: '16' }"
            >
              <span slot="label" class="fontsize_label">用地性质</span>
              {{ item.attribute }}
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              class="fontsize_label"
              :label-col="{ span: '8' }"
              :wrapper-col="{ span: '16' }"
            >
              <span slot="label" class="fontsize_label">用地面积</span>
              {{ item.area }}亩
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              class="fontsize_label"
              :label-col="{ span: '8' }"
              :wrapper-col="{ span: '16' }"
            >
              <span slot="label" class="fontsize_label">亩产效益</span>
              {{ item.price }}万元
            </a-form-model-item>
          </a-col>
          <a-divider dashed style="margin: 0"></a-divider>
        </div>
      </div>
      <div v-else style="padding-top: 20px">
        <k-form-build
          :value="formlands"
          :dynamicData="dynamicData"
          :config="config"
          ref="formlands"
        />
      </div>
    </a-card>
    <!-- 企业工商信息 -->
    <a-card class="business_info" :loading="loading">
      <span slot="title" style="font-size: 18px; font-weight: 600"
        >工商信息(必填)</span
      >
      <a slot="extra" href="#" @click="edit_business" v-if="visble_business">
        <a-icon type="edit" />编辑
      </a>
      <span slot="extra" v-else>
        <a href="#" @click="submitbusiness"> 保存 </a>
        <a-divider type="vertical" />
        <a
          href="#"
          @click="
            () => {
              visble_business = true;
              getinfo();
            }
          "
        >
          取消
        </a>
      </span>
      <div v-if="visble_business" style="padding-top: 20px">
        <a-descriptions class="descriptions_es descriptions_s">
          <a-descriptions-item label="法定代表人" span="2">
            {{ businessform.legal }}
          </a-descriptions-item>
          <a-descriptions-item label="成立日期">
            {{ releases(businessform.release) }}
          </a-descriptions-item>
          <a-descriptions-item label="公司状态" span="2">
            <a-tag :color="getcolor(statuslist, businessform, 'status')">{{
              businessform.status
            }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="年营业收入">
            <a-tag :color="getcolor(scalelist, businessform, 'scale')">{{
              businessform.scale
            }}</a-tag>
          </a-descriptions-item>

          <a-descriptions-item label="统一信用代码" span="2">
            {{ businessform.code }}
            <a-tooltip>
              <template slot="title">
                <p>
                  一般指法人和其他组织统一社会信用代码，相当于让法人和其他组织拥有了一个全国统一的“身份证号”。
                </p>
              </template>
              <a-icon type="question-circle" />
            </a-tooltip>
          </a-descriptions-item>
          <a-descriptions-item label="是否统计库规上企业">
            {{ businessform.isHighCompany ? "是" : "否" }}
          </a-descriptions-item>
          <a-descriptions-item label="GIS标点" span="2">
            {{
              businessform.longitude +
              "&nbsp;，&nbsp;&nbsp;" +
              businessform.latitude
            }}
          </a-descriptions-item>
          <a-descriptions-item label="行业">
            <a-tag v-for="item in businessform.oneIndustry" :key="item">{{
              item
            }}</a-tag>
          </a-descriptions-item>
        </a-descriptions>
      </div>
      <div v-else style="margin-top: 20px">
        <a-form-model
          ref="businessform"
          :model="businessform"
          :rules="rulees"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-row>
            <a-col :span="12">
              <a-form-model-item class="fontsize_label" prop="legal">
                <span slot="label" class="fontsize_label">法定代表人</span>
                <a-input
                  v-model="businessform.legal"
                  allowClear
                  placeholder="请输入企业法定代表人"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item class="fontsize_label" prop="release">
                <span slot="label" class="fontsize_label">成立日期</span>
                <a-date-picker
                  style="width: 100%"
                  @change="changedatas"
                  allowClear
                  v-model="businessform.release"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item class="fontsize_label" prop="status">
                <span slot="label" class="fontsize_label"> 公司状态</span>
                <a-select
                  style="width: 100%"
                  placeholder="请选择公司公司状态"
                  allowClear
                  v-model="businessform.status"
                >
                  <a-select-option v-for="item in statuslist" :key="item.title">
                    {{ item.title }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item class="fontsize_label" prop="scale">
                <span slot="label" class="fontsize_label"> 年营业收入</span>
                <a-select
                  style="width: 100%"
                  placeholder="请选择公司年营业收入"
                  v-model="businessform.scale"
                  allowClear
                >
                  <a-select-option v-for="item in scalelist" :key="item.title">
                    {{ item.title }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item class="fontsize_label" prop="code">
                <span slot="label" class="fontsize_label">统一信用代码</span>
                <a-input
                  allowClear
                  v-model="businessform.code"
                  placeholder="请输入企业统一信用代码"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item class="fontsize_label" prop="isHighCompany">
                <span slot="label" class="fontsize_label"
                  >是否统计库规上企业</span
                >
                <a-radio-group
                  name="radioGroup"
                  v-model="businessform.isHighCompany"
                >
                  <a-radio :value="true"> 是 </a-radio>
                  <a-radio :value="false"> 否 </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item class="fontsize_label">
                <span slot="label" class="fontsize_label">GIS标点</span>
                <a-input-group compact>
                  <a-input
                    style="width: 25%"
                    placeholder="请选择经纬度"
                    v-model="businessform.longitude"
                  />
                  <a-input
                    style="width: 25%"
                    placeholder="请选择经纬度"
                    v-model="businessform.latitude"
                  />
                  <a-button
                    type="primary"
                    @click="
                      getgis([
                        businessform.longitude || null,
                        businessform.latitude || null,
                      ])
                    "
                    >标点</a-button
                  >
                </a-input-group>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item class="fontsize_label">
                <span slot="label" class="fontsize_label"
                  ><span style="color: #f5222d">*</span> 行业</span
                >
                <a-tree-select
                  v-model="businessform.oneIndustry"
                  multiple
                  allowClear
                  :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
                  :treeData="industrytree"
                  placeholder="请选择搜索行业"
                  @change="changes"
                  :replaceFields="{
                    value: 'title',
                    title: 'title',
                  }"
                  :filterTreeNode="
                    (value, node) => {
                      const data = node.componentOptions.propsData.dataRef;
                      return data.title.indexOf(value) !== -1;
                    }
                  "
                >
                </a-tree-select>
              </a-form-model-item>
            </a-col>
            <!-- <a-divider orientation="left"> 资质荣誉 </a-divider>
            <a-checkbox-group
              style="
                text-align: center;
                display: flex;
                flex-wrap: wrap;
                justify-content: left;
              "
              v-model="checkboxs"
              @change="onchanges"
            >
              <a-card
                hoverable
                style="width: 240px"
                v-for="i in honorlist"
                :key="i.id"
                class="carfff"
                @click="onclicks(i.id)"
              >
                <img
                  alt="example"
                  :src="i.url"
                  style="width: 100%; height: 120px"
                />
                <a-card-meta>
                  <div slot="title" style="text-align: center">
                    {{ i.name }}
                  </div>
                  <div slot="description" style="text-align: center">
                    <a-checkbox
                      :value="i.id"
                      @click="(e) => e.preventDefault()"
                    >
                    </a-checkbox>
                  </div>
                </a-card-meta>
              </a-card>
            </a-checkbox-group> -->
            <!-- <k-form-build
              :value="formqualifications"
              :config="config"
              ref="formqualifications"
            /> -->
            <!-- <a-divider orientation="left"> 专利信息 </a-divider>
            <k-form-build
              :value="formpatent"
              :config="config"
              ref="formpatent"
            /> -->
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <!-- 企业资质荣誉 -->
    <a-card class="business_info" :loading="loading">
      <span slot="title" style="font-size: 18px; font-weight: 600"
        >资质荣誉</span
      >
      <a slot="extra" href="#" @click="edit_honor" v-if="visble_honor">
        <a-icon type="edit" />编辑
      </a>
      <span slot="extra" v-else>
        <a href="#" @click="submithonor"> 保存 </a>
        <a-divider type="vertical" />
        <a
          href="#"
          @click="
            () => {
              visble_honor = true;
              getinfo();
            }
          "
        >
          取消
        </a>
      </span>
      <div v-if="visble_honor">
        <div style="margin: 20px 5%">
          <div
            class="imgwalls"
            v-for="(itm, index) in qyzzry"
            :key="'qyzzry' + index"
          >
            <img :src="itm.url" @click="onPicPreviewes(itm, qyzzry)" />
            <div>{{ itm.title }}</div>
          </div>
        </div>
      </div>
      <div v-else>
        <k-form-build
          class="honor_list"
          :value="formqualifications"
          :config="config"
          :dynamicData="dynamicData"
          ref="formqualifications"
        />
      </div>
    </a-card>
    <!-- 企业专利 -->
    <a-card class="business_info" :loading="loading">
      <span slot="title" style="font-size: 18px; font-weight: 600"
        >企业专利</span
      >
      <a slot="extra" href="#" @click="edit_patent" v-if="visble_patent">
        <a-icon type="edit" />编辑
      </a>
      <span slot="extra" v-else>
        <a href="#" @click="submitpatent"> 保存 </a>
        <a-divider type="vertical" />
        <a
          href="#"
          @click="
            () => {
              visble_patent = true;
              getinfo();
            }
          "
        >
          取消
        </a>
      </span>
      <div v-if="visble_patent">
        <div style="margin: 20px 5%">
          <div
            class="imgwalls"
            v-for="(itm, index) in qyzl"
            :key="'qyzl' + index"
          >
            <img :src="itm.url" @click="onPicPreviewes(itm, qyzl)" />
            <div>{{ itm.name }}</div>
          </div>
        </div>
      </div>
      <div v-else>
        <k-form-build :value="formpatent" :config="config" ref="formpatents" />
      </div>
    </a-card>
    <!-- 形象墙照片 -->
    <a-card class="business_info" :loading="loading">
      <span slot="title" style="font-size: 18px; font-weight: 600"
        >形象墙照片</span
      >
      <a slot="extra" href="#" @click="edit_imagewall" v-if="visble_imagewall">
        <a-icon type="edit" />编辑
      </a>
      <span slot="extra" v-else>
        <a href="#" @click="submitimagewall"> 保存 </a>
        <a-divider type="vertical" />
        <a
          href="#"
          @click="
            () => {
              visble_imagewall = true;
              getinfo();
            }
          "
        >
          取消
        </a>
      </span>
      <div v-if="visble_imagewall">
        <div style="margin: 20px 5%">
          <div
            class="imgwalls"
            v-for="(itm, index) in xxqzp"
            :key="'xxqzp' + index"
          >
            <img :src="itm.url" @click="onPicPreviewes(itm, xxqzp)" />
            <div>{{ itm.name }}</div>
          </div>
        </div>
      </div>
      <div v-else>
        <k-form-build
          :value="formImagewall"
          :config="config"
          ref="formImagewall"
        />
      </div>
    </a-card>
    <!-- 形象墙视频 -->
    <a-card class="business_info" :loading="loading">
      <span slot="title" style="font-size: 18px; font-weight: 600"
        >形象墙视频</span
      >
      <a slot="extra" href="#" @click="edit_viedowall" v-if="visble_viedowall">
        <a-icon type="edit" />编辑
      </a>
      <span slot="extra" v-else>
        <a href="#" @click="submitviedowall"> 保存 </a>
        <a-divider type="vertical" />
        <a
          href="#"
          @click="
            () => {
              visble_viedowall = true;
              getinfo();
            }
          "
        >
          取消
        </a>
      </span>
      <div v-if="visble_viedowall">
        <div style="margin: 20px 5%">
          <div
            class="imgwalls_video"
            v-for="(itm, index) in xxqsp"
            :key="'xxqsp' + index"
          >
            <video controls :src="itm.url" @click="handleFullScreen"></video>
            <div>{{ itm.name }}</div>
          </div>
        </div>
      </div>
      <div v-else>
        <k-form-build
          :value="formviedowall"
          :config="config"
          ref="formviedowall"
        />
      </div>
    </a-card>

    <pic-preview
      :file-preview-show="previewShow"
      :img-list="preImages"
      :current-img="currentImg"
      style="width: 1200px"
      @close="() => (previewShow = false)"
    ></pic-preview>
    <a-modal
      title="获取经纬度"
      width="50%"
      :visible="mapvisible"
      @ok="getOk()"
      @cancel="
        () => {
          mapvisible = false;
        }
      "
    >
      <div style="width: 100%; height: 600px">
        <div style="height: 50px">
          <a-row :gutter="24">
            <a-col :span="10">
              <a-form-model-item
                label="经纬度"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
              >
                <a-input-number
                  v-model="center.lng"
                  :disabled="true"
                  style="width: 50%"
                />
                <a-input-number
                  v-model="center.lat"
                  :disabled="true"
                  style="width: 50%"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="7">
              <a-form-model-item
                label="区域"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
              >
                <a-input
                  style="width: 100%"
                  @change="changed"
                  v-model="location"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="7">
              <a-form-model-item
                label="关键词"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
              >
                <a-input style="width: 100%" v-model="keyword" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <baidu-map
          class="bm-view"
          :center="center"
          scroll-wheel-zoom
          :zoom="zoom"
          @click="clickes"
          ak="NCy3L8EKCdf4QgHF8cNdNbOQADq7xx34"
          keyboard
          CityListControl
          auto-resize
        >
          <bm-local-search
            :keyword="keyword"
            :auto-viewport="true"
            :panel="false"
            :selectFirstResult="true"
            @searchcomplete="resultshtmlset"
            :location="location"
          ></bm-local-search>
          <bm-marker :position="center" @click="checkDetail"> </bm-marker>
        </baidu-map>
      </div>
    </a-modal>
  </div>
</template>
<script>
import PicPreview from "@/components/PicPreview";
import BaiduMap from "vue-baidu-map/components/map/Map.vue";
import BmLocalSearch from "vue-baidu-map/components/search/LocalSearch.vue";
import BmMarker from "vue-baidu-map/components/overlays/Marker.vue";
import { form_get } from "@/services/forms";
import Cookie from "js-cookie";
import {
  info_get,
  info_edit,
  info_land,
  industry_create,
  land_certificate,
} from "@/services/infofilling";
import { FormUpload } from "@/services/api";
import { dictmap_tree } from "@/services/dictmap";
export default {
  props: {
    params: {
      //传递的数据
      type: Object,
    },
    event: {
      type: Function,
    },
    onOpen: {
      type: Function,
    },
  },
  components: {
    PicPreview,
    BaiduMap,
    BmLocalSearch,
    BmMarker,
  },
  data() {
    return {
      loading: false,
      visble_bascinfo: true,
      bascform: {},
      id: undefined,
      rules: {
        title: [
          {
            required: true,
            message: "请输入企业名称",
            whitespace: true,
            trigger: "blur",
          },
          {
            required: true,
            validator: this.validators,
          },
        ],
        rperson: [
          {
            required: false,
            message: "请输入企业联系人",
            whitespace: true,
            trigger: "blur",
          },
          {
            required: false,
            validator: this.validators,
          },
        ],
        comeform: [
          {
            required: true,
            message: "请选择数据来源",
            whitespace: true,
            trigger: "blur",
          },
        ],
        address: [
          {
            required: false,
            message: "请输入企业地址",
            whitespace: true,
            trigger: "blur",
          },
          {
            required: false,
            validator: this.validators,
          },
        ],
        content: [
          {
            required: false,
            message: "请输入企业简介",
            trigger: "blur",
          },
          {
            required: false,
            validator: this.validators,
          },
        ],
        rmobile: [
          {
            required: false,
            message: "请填手机号码",
            trigger: "blur",
          },
          {
            required: false,
            validator: this.telRules,
          },
        ],
        email: [
          {
            required: false,
            message: "请输入企业电子邮箱",
            trigger: "blur",
          },
          {
            required: false,
            validator: this.emailRules,
          },
        ],
      },
      rulees: {
        legal: [
          {
            required: true,
            message: "请输入企业法定代表人",
          },
          {
            required: true,
            validator: this.validators,
          },
        ],
        release: [
          {
            required: true,
            message: "请输入企业成立日期",
          },
        ],
        status: [
          {
            required: true,
            message: "请选择公司状态",
          },
        ],
        scale: [
          {
            required: true,
            message: "请选择公司年营业收入",
          },
        ],
        code: [
          {
            required: true,
            message: "请输入企业统一信用代码",
          },
        ],
        isHighCompany: [
          {
            required: true,
            message: "请选择公司是否统计库规上企业",
          },
        ],
        oneIndustry: [
          {
            required: true,
            message: "请选择公司行业",
            trigger: "change",
          },
        ],
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      visble_business: true,
      statuslist: [],
      scalelist: [],
      industrytree: [],
      landslist: [],
      // 用地情况
      lands: [],
      businessform: {},
      currentImg: "",
      preImages: [],
      previewShow: false,
      mapvisible: false,
      center: {},
      keyword: "",
      location: "聊城市",
      zoom: 15,
      formlands: {},
      formqualifications: {},
      formpatent: {},
      checkboxs: [3, 6],
      honorlist: [],
      //
      action: FormUpload,
      // 用地
      visble_land: true,
      // 资质荣誉
      visble_honor: true,
      qyzzry: [],
      // 企业专利
      visble_patent: true,
      qyzl: [],
      //图片墙
      visble_imagewall: true,
      xxqzp: [],
      xxqsp: [],
      formImagewall: {},
      formviedowall: {},
      visble_viedowall: true,
    };
  },

  computed: {
    userinfo() {
      return this.$store.getters["account/user"];
    },
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
    dynamicData() {
      let result = {
        landslist: [],
        honorlist: [],
      };
      this.landslist.filter((item) => {
        result.landslist.push({
          label: item.title,
          value: item.title,
        });
      });
      this.honorlist.filter((item) => {
        result.honorlist.push({
          label: item.title,
          value: item.title,
        });
      });
      return result;
    },
  },
  created() {
    console.log("params", this.params);
    this.id = this.params.id || undefined;
    this.init();
  },
  methods: {
    upLoadChange(info) {
      if (info.file.status === "done") {
        var data = info.file.response.data;
        this.bascform.logo = [
          {
            name: info.file.name,
            status: info.file.status,
            type: info.file.type,
            uid: info.file.uid,
            url: data.url,
          },
        ];
      }
    },
    init() {
      Promise.all([
        form_get({ name: "zjxf_lands" }),
        form_get({ name: "zdxf_zzryfiles" }),
        form_get({ name: "zdxf_patent" }),
        form_get({ name: "zdxf_Imagewall" }),
        form_get({ name: "zdxf_viedowall" }),
        dictmap_tree({ name: "lands_info" }), //用地情况列表
        dictmap_tree({ name: "qiyezhuangtai" }), //企业状态列表
        dictmap_tree({ name: "scale" }), //企业规模列表
        dictmap_tree({ name: "industry_list" }), //行业列表  zdxf_Imagewall
        dictmap_tree({ name: "honor_list" }), // 荣誉列表
      ])
        .then((Response) => {
          this.formlands = Response[0].data.data.form;
          this.formqualifications = Response[1].data.data.form;
          this.formpatent = Response[2].data.data.form;
          this.formImagewall = Response[3].data.data.form;
          this.formviedowall = Response[4].data.data.form;
          this.landslist = Response[5].data.data;
          this.statuslist = Response[6].data.data;
          this.scalelist = Response[7].data.data;
          this.industrytree = Response[8].data.data;
          this.honorlist = Response[9].data.data;
          this.getinfo();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getinfo() {
      this.loading = true;
      info_get({ id: this.id })
        .then((Response) => {
          console.log("getinfo", Response);
          this.bascform = Response.data.data;
          this.lands = Response.data.data.lands;
          this.businessform = Response.data.data.industry.length
            ? Response.data.data.industry[0]
            : {};
          this.businessform.oneIndustry = Response.data.data.industry.length
            ? Response.data.data.industry[0].oneIndustry.length
              ? Response.data.data.industry[0].oneIndustry.split(",")
              : undefined
            : undefined;
          this.qyzzry = Response.data.data.qyzzry;
          this.qyzl = Response.data.data.qyzl;
          this.xxqzp = Response.data.data.xxqzp;
          this.xxqsp = Response.data.data.xxqsp;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.$message.error(error.response.data.message);
        });
    },
    edit_bascinfo() {
      this.visble_bascinfo = false;
    },
    edit_land() {
      this.visble_land = false;
      this.$nextTick(() => {
        this.$refs.formlands.setData({
          lands: this.lands,
        });
      });
    },
    // 基础信息保存
    submitbasc() {
      this.$refs.bascform.validate((valid) => {
        if (valid) {
          var datas = {
            id: this.bascform.id,
            logo: this.bascform.logo,
            title: this.bascform.title,
            rperson: this.bascform.rperson,
            rmobile: this.bascform.rmobile,
            email: this.bascform.email,
            address: this.bascform.address,
            content: this.bascform.content,
            comeform: "PC端",
          };
          info_edit(datas)
            .then((res) => {
              console.log("res", res);
              this.getinfo();
            })
            .catch((err) => {
              console.log(err);
            });
          this.visble_bascinfo = true;
        }
      });
    },
    // 用地信息保存
    submitland() {
      this.$refs.formlands
        .getData()
        .then((response) => {
          console.log("response", response);
          var datas = {
            company: this.id,
            lands: response.lands,
            comeform: "PC端",
          };
          console.log("datas", datas);
          info_land(datas)
            .then((res) => {
              console.log("res", res);
              this.$message.success(res.data.message);
              this.visble_land = true;
              this.getinfo();
            })
            .catch((err) => {
              console.log(err);
              this.$message.error(err.response.data.message);
            });
        })
        .catch((error) => {
          console.log(error);
          this.$message.error(error.response.data.message);
        });
    },
    // 商务信息保存
    submitbusiness() {
      this.$refs.businessform.validate((valid) => {
        if (valid) {
          if (
            this.businessform.oneIndustry &&
            this.businessform.oneIndustry.length
          ) {
            var datas = Object.assign(this.businessform, {
              oneIndustry: this.businessform.oneIndustry.length
                ? this.businessform.oneIndustry.join(",")
                : undefined,
              company: this.id,
              comeform: "PC端",
            });
            industry_create(datas)
              .then((res) => {
                console.log("res", res);
                this.visble_business = true;
                this.getinfo();
              })
              .catch((err) => {
                console.log(err);
                this.$message.error(err.response.data.message);
              });
          } else {
            this.$message.error("请选择行业");
          }
        }
      });
    },
    edit_business() {
      this.visble_business = false;
    },
    onvideos(record, currentImg) {
      console.log(record, currentImg);
    },
    onPicPreviews(record, currentImg) {
      console.log(record, currentImg);
      if (record.length) {
        this.preImages = record.map((item) => item.url);
      } else {
        this.preImages = [
          "/resources/public/20220906/6316e717d4363cd8d75cff75.jpg",
        ];
      }

      this.currentImg = currentImg;
      this.previewShow = true;
    },
    onPicPreviewes(id, data) {
      this.preImages = data.map((item) => item.url);
      this.currentImg = id.url;
      this.previewShow = true;
    },
    // 获取标点
    getgis(data) {
      console.log("data", data);
      this.mapvisible = true;
      this.center = {
        lng: data[0],
        lat: data[1],
      };
    },
    changed(e) {
      this.location = e.srcElement.value;
    },
    clickes(e) {
      this.center.lng = e.point.lng;
      this.center.lat = e.point.lat;
      this.businessform.longitude = e.point.lng;
      this.businessform.latitude = e.point.lat;
    },
    checkDetail(e) {
      console.log("e11111", e);
    },
    resultshtmlset() {},
    getOk() {
      this.mapvisible = false;
    },
    onchanges(e) {
      console.log("e1", e);
    },
    changes(value) {
      if (value) {
        this.$nextTick(() => {
          this.businessform = Object.assign(this.businessform, {
            oneIndustry: value,
          });
          this.$forceUpdate();
        });
      } else {
        this.$message.error("请选择行业");
      }
    },
    onclicks(e) {
      var lis = this.checkboxs.filter((item) => {
        return item == e;
      });
      if (lis.length) {
        this.checkboxs.filter((item, index) => {
          if (item == lis[0]) {
            this.checkboxs.splice(index, 1);
          }
        });
      } else {
        this.checkboxs.push(e);
      }
    },
    // 视频播放全屏
    handleFullScreen(e) {
      this.launchFullscreen(e.target);
    },
    // 进入全屏
    launchFullscreen(element) {
      //此方法不可以在異步任務中執行，否則火狐無法全屏
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      } else if (element.oRequestFullscreen) {
        element.oRequestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullScreen();
      } else {
        var docHtml = document.documentElement;
        var docBody = document.body;
        var videobox = element;
        var cssText = "width:100%;height:100%;overflow:hidden;";
        docHtml.style.cssText = cssText;
        docBody.style.cssText = cssText;
        videobox.style.cssText = cssText + ";" + "margin:0px;padding:0px;";
        document.IsFullScreen = true;
      }
    },
    // 视频播放完毕退出全屏
    handleExitFullScreen(e) {
      this.exitFullscreen(e.target);
    },
    // 退出全屏
    exitFullscreen(element) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.oRequestFullscreen) {
        document.oCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else {
        var docHtml = document.documentElement;
        var docBody = document.body;
        var videobox = element;
        docHtml.style.cssText = "";
        docBody.style.cssText = "";
        videobox.style.cssText = "";
        document.IsFullScreen = false;
      }
    },
    /***资质荣誉 编辑 保存 */
    edit_honor() {
      this.visble_honor = false;
      var honors = [];
      for (let index = 0; index < this.qyzzry.length; index++) {
        honors.push({
          title: this.qyzzry[index]["title"],
          files: [this.qyzzry[index]],
        });
      }

      this.$nextTick(() => {
        this.$refs.formqualifications.setData({
          honors: honors,
        });
      });
    },
    submithonor() {
      this.$refs.formqualifications
        .getData()
        .then((res) => {
          if (res.honors) {
            var files = [];
            for (let i = 0; i < res.honors.length; i++) {
              for (let j = 0; j < res.honors[i]["files"].length; j++) {
                res.honors[i]["files"][j].title = res.honors[i].title;
                files.push(res.honors[i]["files"][j]);
              }
            }
          }
          var datas = {
            company: this.id,
            files: files,
            category: "企业资质荣誉",
            comeform: "PC端",
          };
          land_certificate(datas)
            .then(() => {
              this.visble_honor = true;
              this.getinfo();
            })
            .catch((err) => {
              console.log(err);
              this.$message.error(err.response.data.message);
            });
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
    },
    /*** 企业专利 */
    edit_patent() {
      this.visble_patent = false;
      this.$nextTick(() => {
        this.$refs.formpatents.setData({
          files: this.qyzl,
        });
      });
    },
    submitpatent() {
      this.$refs.formpatents
        .getData()
        .then((res) => {
          console.log("res", res);
          var datas = {
            company: this.id,
            files: res.files,
            category: "企业专利",
            comeform: "PC端",
          };
          land_certificate(datas)
            .then(() => {
              this.visble_patent = true;
              this.getinfo();
            })
            .catch((err) => {
              console.log(err);
              this.$message.error(err.response.data.message);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /** edit_imagewall */
    edit_imagewall() {
      this.visble_imagewall = false;
      this.$nextTick(() => {
        this.$refs.formImagewall.setData({
          files: this.xxqzp,
        });
      });
    },
    submitimagewall() {
      this.$refs.formImagewall
        .getData()
        .then((res) => {
          console.log("res", res);
          var datas = {
            company: this.id,
            files: res.files,
            category: "形象墙照片",
            comeform: "PC端",
          };
          land_certificate(datas)
            .then(() => {
              this.visble_imagewall = true;
              this.getinfo();
            })
            .catch((err) => {
              console.log(err);
              this.$message.error(err.response.data.message);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /** edit_viedowall */
    edit_viedowall() {
      this.visble_viedowall = false;
      this.$nextTick(() => {
        this.$refs.formviedowall.setData({
          files: this.xxqsp,
        });
      });
    },
    submitviedowall() {
      this.$refs.formviedowall
        .getData()
        .then((res) => {
          console.log("res", res);
          var datas = {
            company: this.id,
            files: res.files,
            category: "形象墙视频",
            comeform: "PC端",
          };
          land_certificate(datas)
            .then(() => {
              this.visble_viedowall = true;
              this.getinfo();
            })
            .catch((err) => {
              console.log(err);
              this.$message.error(err.response.data.message);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 时间格式
    changedatas(data, filedata) {
      this.businessform.release = filedata;
    },
    // 时间截取
    releases(time) {
      var date = "";
      if (time) {
        date = time.substring(0, 10);
      }
      return date;
    },
    // 获取企业状态
    getcolor(datalist, data, code) {
      if (data) {
        var list = datalist.filter((item) => {
          return item.title == data[code];
        });
        return list.length ? list[0].color : "";
      } else {
        return "";
      }
    },
    // 手机号判断
    telRules(rule, value, callback) {
      if (!/^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/.test(value)) {
        callback("请输入正确格式的座机(如：0310-1234567)、手机号");
      } else {
        callback();
      }
    },
    // 非纯数字
    validators(rule, value, callback) {
      if (/^\d+$/.test(value)) {
        callback("请输入非纯数字的字符串！");
      } else {
        callback();
      }
    },
    // 邮箱
    emailRules(rule, value, callback) {
      if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
        callback("请输入正确的电子邮箱！");
      } else {
        callback();
      }
    },
  },
};
</script>
<style scoped lang="less">
.mains_page {
  height: 100%;
  padding: 24px;
  overflow: auto;
  a {
    color: #2196f3;
  }
  .logo_s {
    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      object-fit: over;
      cursor: pointer;
      border: 1px solid #d9d9d9;
    }
  }

  .basc_info {
    width: 100%;
    font-size: 20px;
  }
  .business_info {
    margin-top: 24px;
  }
  .imgwalls {
    width: 150px;
    height: 150px;
    display: inline-flex;
    margin: 0 10px;
    margin-bottom: 0px;
    // object-fit: cover;
    position: relative;
    cursor: pointer;
    img {
      border-radius: 5px;
      width: 150px;
      height: 150px;
      object-fit: cover;
      background: #cdcdcd;
    }
    div {
      position: absolute;
      bottom: 5px;
      background: #000000cc;
      width: 100%;
      text-align: center;
      color: #ffffff;
      overflow: hidden;
    }
  }
  // .imgwalls img:hover {
  //   background: #888888;
  //   cursor: pointer;
  // }
  .imgwalls_video {
    width: 300px;
    height: 150px;
    position: relative;
    margin: 0 10px;
    display: inline-flex;
    cursor: pointer;
    video {
      width: 100%;
      background: #c7c7c7;
      border-radius: 5px;
    }
    div {
      position: absolute;
      bottom: 5px;
      background: #000000cc;
      width: 100%;
      text-align: center;
      color: #ffffff;
      overflow: hidden;
    }
  }
}
</style>
<style scoped>
.bm-view {
  width: 100%;
  height: 550px;
}
.carfff {
  display: inline-flex;
  margin: 10px;
}
.carfff >>> .ant-card-body {
  width: 100%;
  padding: 5px 15px 10px;
}
.descriptions_s >>> .ant-descriptions-item-label {
  font-size: 17px !important;
  font-weight: 500;
}
.descriptions_s >>> .ant-descriptions-item-content {
  font-size: 17px !important;
  font-weight: 500;
}
.descriptions_s >>> .ant-descriptions-title {
  font-size: 19px !important;
}
.descriptions_es {
  width: 90%;
  margin: 20px auto 50px;
}
.honor_list >>> .ant-form-item {
  width: 100% !important;
}

.honor_list >>> .ant-form-item-control-wrapper {
  width: 100% !important;
}
</style>