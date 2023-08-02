<template>
  <div class="mains_page">
    <!-- <a-row class="basc_info" :gutter="24">
      <a-col :span="12">
        <a-card class="business_info">
          <span slot="title" style="font-size: 18px; font-weight: 600"
            >营业额（万元）</span
          >
          <div id="yingyee" class="tubiao_style"></div>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card class="business_info">
          <span slot="title" style="font-size: 18px; font-weight: 600"
            >纳税额（万元）</span
          >
          <div id="nashuie" class="tubiao_style"></div>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card class="business_info">
          <span slot="title" style="font-size: 18px; font-weight: 600"
            >能耗（水电气）</span
          >
        </a-card>
        <div id="nenghao" class="tubiao_style"></div>
      </a-col>
      <a-col :span="12">
        <a-card class="business_info">
          <span slot="title" style="font-size: 18px; font-weight: 600"
            >用工情况</span
          >
          <div id="yonggong" class="tubiao_style"></div>
        </a-card>
      </a-col>
    </a-row> -->
    <!-- 生产情况 -->
    <a-card class="basc_info" :loading="loading">
      <span slot="title" style="font-size: 18px; font-weight: 600"
        >生产情况</span
      >
      <div v-if="edicts" slot="extra">
        <a href="#" @click="edit_product" v-if="visble_product">
          <a-icon type="edit" />编辑
        </a>
        <span v-else>
          <a href="#" @click="submitbasc"> 保存 </a>
          <a-divider type="vertical" />
          <a
            href="#"
            @click="
              () => {
                visble_product = true;
              }
            "
          >
            取消
          </a>
        </span>
      </div>

      <div v-if="visble_product" style="padding-top: 20px">
        <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row>
            <div
              v-for="(item, index) in formproduction.prostatus"
              :key="'production' + index"
            >
              <a-col :span="6">
                <a-form-model-item
                  class="fontsize_label"
                  :label-col="{ span: '8' }"
                  :wrapper-col="{ span: '16' }"
                >
                  <span slot="label" class="fontsize_label">产品名称</span>
                  {{ getproduct(item.product) }}
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  class="fontsize_label"
                  :label-col="{ span: '8' }"
                  :wrapper-col="{ span: '16' }"
                >
                  <span slot="label" class="fontsize_label">产量</span>
                  {{ item.number }}KG
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  class="fontsize_label"
                  :label-col="{ span: '8' }"
                  :wrapper-col="{ span: '16' }"
                >
                  <span slot="label" class="fontsize_label">产值</span>
                  {{ item.value }}万元
                </a-form-model-item>
              </a-col>
              <a-divider dashed style="margin: 0"></a-divider>
            </div>
            <a-divider orientation="left"> 消耗 </a-divider>
            <a-col :span="8">
              <a-form-model-item
                class="fontsize_label"
                :label-col="{ span: '6' }"
                :wrapper-col="{ span: '16' }"
              >
                <span slot="label" class="fontsize_label">水（吨）</span>
                {{ formproduction.water }}
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item
                class="fontsize_label"
                :label-col="{ span: '6' }"
                :wrapper-col="{ span: '16' }"
              >
                <span slot="label" class="fontsize_label">电（千瓦时）</span>
                {{ formproduction.electricity }}
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item
                class="fontsize_label"
                :label-col="{ span: '6' }"
                :wrapper-col="{ span: '16' }"
              >
                <span slot="label" class="fontsize_label">气（立方）</span>
                {{ formproduction.natgas }}
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <div v-else style="padding-top: 20px">
        <k-form-build
          :value="productionData"
          :config="config"
          :dynamicData="dynamicData"
          ref="formproduction"
        />
      </div>
    </a-card>

    <!-- 经营情况 -->
    <a-card class="business_info" :loading="loading">
      <span slot="title" style="font-size: 18px; font-weight: 600"
        >经营情况</span
      >
      <div v-if="edicts" slot="extra">
        <a href="#" @click="edit_manage" v-if="visble_manage">
          <a-icon type="edit" />编辑
        </a>
        <span v-else>
          <a href="#" @click="submitmanage"> 保存 </a>
          <a-divider type="vertical" />
          <a
            href="#"
            @click="
              () => {
                visble_manage = true;
              }
            "
          >
            取消
          </a>
        </span>
      </div>

      <div v-if="visble_manage" style="padding-top: 20px">
        <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row>
            <a-col :span="12">
              <a-form-model-item class="fontsize_label">
                <span slot="label" class="fontsize_label">营业收入（万元）</span>
                {{ formmanage.yingyee }}
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item class="fontsize_label">
                <span slot="label" class="fontsize_label">纳税总额（万元）</span>
                {{ formmanage.nashui }}
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item class="fontsize_label">
                <span slot="label" class="fontsize_label">利润总额（万元）</span>
                {{ formmanage.lirun }}
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item class="fontsize_label">
                <span slot="label" class="fontsize_label">研发费用（万元）</span>
                {{ formmanage.yanfa }}
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item class="fontsize_label">
                <span slot="label" class="fontsize_label">工业总产值（万元）</span>
                {{ formmanage.chanzhi }}
              </a-form-model-item>
            </a-col>
            <a-divider orientation="left"> 投资情况</a-divider>
            <a-col :span="12">
              <a-form-model-item class="fontsize_label">
                <span slot="label" class="fontsize_label"
                  >固定资产（万元）</span
                >
                {{ formmanage.gudingzichan }}
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item class="fontsize_label">
                <span slot="label" class="fontsize_label"
                  >对外投资（万元）</span
                >
                {{ formmanage.duiwaitouzi }}
              </a-form-model-item>
            </a-col>
            <a-divider orientation="left"> 融资</a-divider>
            <a-col :span="12">
              <a-form-model-item class="fontsize_label">
                <span slot="label" class="fontsize_label">股权（万元）</span>
                {{ formmanage.guquan }}
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item class="fontsize_label">
                <span slot="label" class="fontsize_label">国资（万元）</span>
                {{ formmanage.guozi }}
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item class="fontsize_label">
                <span slot="label" class="fontsize_label">贷款（万元）</span>
                {{ formmanage.daikuan }}
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item class="fontsize_label">
                <span slot="label" class="fontsize_label">民间（万元）</span>
                {{ formmanage.minjian }}
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <div v-else style="padding-top: 20px">
        <k-form-build :value="manageData" :config="config" ref="formmanage" />
      </div>
    </a-card>
    <!-- 企业重大信息 -->
    <a-card class="business_info">
      <div slot="title" style="font-size: 18px; font-weight: 600">
        企业重大信息
      </div>
      <div v-if="edicts" slot="extra">
        <a href="#" @click="add_import"><a-icon type="edit" />添加事件 </a>
      </div>
      <a-list
        :data-source="events"
        :pagination="{
          total: events.length,
          showQuickJumper: true,
          pageSize: 10,
          showTotal: (total, range) => {
            return '共 ' + total + ' 条';
          },
        }"
      >
        <a-list-item slot="renderItem" class="imports_items" slot-scope="item">
          <div class="imports_item" @click="edit_import(item)">
            {{ item.content }}
          </div>
          <a slot="actions">
            <a-popconfirm
              placement="topRight"
              title="您确定要删除这条信息吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="confirmdeletes(item)"
            >
              <a-icon type="close-square" class="imports_icon" />
            </a-popconfirm>
          </a>
        </a-list-item>
      </a-list>
    </a-card>
    <!-- 用工情况 -->
    <a-card class="business_info" :loading="loading">
      <span slot="title" style="font-size: 18px; font-weight: 600"
        >用工情况</span
      >
      <!-- 普通用工 -->
      <a-card>
        <span slot="title">普通用工</span>
        <span slot="extra" v-if="edicts">
          <a href="#" @click="edit_employment" v-if="visble_employment">
            <a-icon type="edit" />编辑
          </a>
          <span v-else>
            <a href="#" @click="submitemployment"> 保存 </a>
            <a-divider type="vertical" />
            <a
              href="#"
              @click="
                () => {
                  visble_employment = true;
                }
              "
            >
              取消
            </a>
          </span>
        </span>
        <div v-if="visble_employment" style="padding-top: 20px">
          <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-row>
              <div
                v-for="(item, index) in formemployment.commons"
                :key="'commons' + index"
              >
                <a-col :span="8">
                  <a-form-model-item
                    class="fontsize_label"
                    :label-col="{ span: '8' }"
                    :wrapper-col="{ span: '16' }"
                  >
                    <span slot="label" class="fontsize_label">工种</span>
                    {{ item.worktype }}
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    class="fontsize_label"
                    :label-col="{ span: '8' }"
                    :wrapper-col="{ span: '16' }"
                  >
                    <span slot="label" class="fontsize_label">人数</span>
                    {{ item.number }}
                  </a-form-model-item>
                </a-col>
                <a-divider dashed style="margin: 0"></a-divider>
              </div>
              <a-col :span="12">
                <a-form-model-item
                  class="fontsize_label"
                  :label-col="{ span: '5' }"
                  :wrapper-col="{ span: '16' }"
                >
                  <span slot="label" class="fontsize_label">党员人数</span>
                  {{ formemployment.dangyuan }}
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  class="fontsize_label"
                  :label-col="{ span: '5' }"
                  :wrapper-col="{ span: '16' }"
                >
                  <span slot="label" class="fontsize_label">总人数</span>
                  {{ formemployment.number }}
                </a-form-model-item>
              </a-col>
              <a-divider orientation="left"> 用工需求 </a-divider>
              <div
                v-for="(item, index) in formemployment.needworks"
                :key="'needworks' + index"
              >
                <a-col :span="6">
                  <a-form-model-item
                    class="fontsize_label"
                    :label-col="{ span: '10' }"
                    :wrapper-col="{ span: '8' }"
                  >
                    <span slot="label" class="fontsize_label">需求工种</span>
                    {{ item.worktype }}
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    class="fontsize_label"
                    :label-col="{ span: '6' }"
                    :wrapper-col="{ span: '4' }"
                  >
                    <span slot="label" class="fontsize_label">需求人数</span>
                    {{ item.number }}
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item
                    class="fontsize_label"
                    :label-col="{ span: '4' }"
                    :wrapper-col="{ span: '16' }"
                  >
                    <span slot="label" class="fontsize_label">用工要求</span>
                    <div>{{ item.content }}</div>
                  </a-form-model-item>
                </a-col>
                <a-divider dashed style="margin: 0"></a-divider>
              </div>
            </a-row>
          </a-form-model>
        </div>
        <div v-else style="padding-top: 20px">
          <k-form-build
            :value="employmentData"
            :config="config"
            :dynamicData="dynamicData"
            ref="formemployments"
          />
        </div>
      </a-card>

      <a-card class="business_info" :loading="loading">
        <span slot="title"> 管理岗位</span>
        <a-form-model
          layout="horizontal"
          :model="searchform"
          ref="searchform"
          style="margin-top: 20px"
        >
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-model-item
                label="关键词"
                :labelCol="{ span: 7 }"
                :wrapperCol="{ span: 17 }"
              >
                <a-input
                  v-model="searchform.keyword"
                  style="width: 100%"
                  placeholder="请输入关键词搜索"
                />
              </a-form-model-item>
            </a-col>

            <a-col :md="6" :sm="24" :offset="1">
              <span
                style="
                  float: left;
                  margin-top: 3px;
                  display: block;
                  margin-bottom: 24px;
                  white-space: nowrap;
                "
              >
                <a-button type="primary" @click="onSearch">查询</a-button>
                <a-button style="margin-left: 8px" @click="resetForm()"
                  >重置</a-button
                >
              </span>
            </a-col>
          </a-row>
        </a-form-model>
        <a-space>
          <a-button type="primary" @click="onAdd" style="margin: 0px 0px 20px">
            <a-icon type="plus" />新增
          </a-button>
          <a-button style="margin: 0px 0px 20px">
            <a-checkbox v-model="searchform.delete" @change="onRecycles"
              >回收站</a-checkbox
            >
          </a-button>
        </a-space>
        <a-table
          :data-source="managedatas.items"
          :columns="postcolumns"
          rowKey="id"
          :loading="table_loading"
          :pagination="false"
        >
          <span slot="action" slot-scope="text, record">
            <a href="#" v-if="!record._delete" @click="editpost(record)"
              >编辑</a
            >
            <a-popconfirm
              v-else
              title="确认还原此员工信息吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="restore_post(record)"
            >
              <a href="#">还原</a>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a-popconfirm
              title="确认删除此员工信息吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="deletes_post(record)"
            >
              <a href="#">删除</a>
            </a-popconfirm>
          </span>
        </a-table>
        <a-pagination
          size="small"
          style="text-align: right; margin: 20px 0 20px"
          @change="changepage"
          :current="pagination.page"
          :pageSize="pagination.per_page"
          @showSizeChange="changepage"
          :pageSizeOptions="pageSizeOptions"
          :total="managedatas.total"
          show-size-changer
          show-quick-jumper
          :show-total="(total) => `共 ${total} 条`"
        ></a-pagination>
      </a-card>

      <a-card class="business_info" :loading="loading">
        <span slot="title"> 高端人才</span>
        <a-form-model
          layout="horizontal"
          :model="searchforms"
          ref="searchforms"
          style="margin-top: 20px"
        >
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-model-item
                label="关键词"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18 }"
              >
                <a-input
                  v-model="searchforms.keyword"
                  style="width: 100%"
                  placeholder="请输入关键词搜索"
                />
              </a-form-model-item>
            </a-col>

            <a-col :md="6" :sm="24" :offset="1">
              <span
                style="
                  float: left;
                  margin-top: 3px;
                  display: block;
                  margin-bottom: 24px;
                  white-space: nowrap;
                "
              >
                <a-button type="primary" @click="onSearchs">查询</a-button>
                <a-button style="margin-left: 8px" @click="resetForms()"
                  >重置</a-button
                >
              </span>
            </a-col>
          </a-row>
        </a-form-model>
        <a-space>
          <a-button type="primary" @click="onAdds" style="margin: 0px 0px 20px">
            <a-icon type="plus" />新增
          </a-button>
          <a-button style="margin: 0px 0px 20px">
            <a-checkbox v-model="searchforms.delete" @change="Recycles"
              >回收站</a-checkbox
            >
          </a-button>
        </a-space>
        <a-table
          :data-source="highpersondatas.items"
          :columns="upscalecolumns"
          rowKey="id"
          :loading="highperson_loading"
          :pagination="false"
        >
          <span slot="action" slot-scope="text, record">
            <a href="#" v-if="!record._delete" @click="editheight(record)"
              >编辑</a
            >
            <a-popconfirm
              v-else
              title="确认还原此员工信息吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="restore_height(record)"
            >
              <a href="#">还原</a>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a-popconfirm
              title="确认删除此员工信息吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="deletes_height(record)"
            >
              <a href="#">删除</a>
            </a-popconfirm>
          </span>
          <span slot="employment" slot-scope="text, record">
            {{
              record.start.substring(0, 10) + "~" + record.end.substring(0, 10)
            }}
          </span>
        </a-table>
        <a-pagination
          size="small"
          style="text-align: right; margin: 20px 0 20px"
          @change="changepages"
          :current="paginations.page"
          :pageSize="paginations.per_page"
          @showSizeChange="changepages"
          :pageSizeOptions="pageSizeOptions"
          :total="highpersondatas.total"
          show-size-changer
          show-quick-jumper
          :show-total="(total) => `共 ${total} 条`"
        ></a-pagination>
      </a-card>
    </a-card>

    <a-modal
      :title="titles"
      width="50%"
      :visible="movisible"
      @ok="getOk"
      :ok-button-props="{ props: { disabled: !edicts } }"
      @cancel="
        () => {
          movisible = false;
        }
      "
    >
      <k-form-build
        :value="jsonData"
        :dynamicData="dynamicData"
        :config="config"
        ref="forms"
      />
    </a-modal>
    <a-modal
      title="事件增编"
      width="50%"
      :visible="visble_import"
      @ok="getOkes"
      @cancel="
        () => {
          visble_import = false;
        }
      "
    >
      <a-form-model-item
        label="事件描述"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-textarea v-model="texts" :auto-size="{ minRows: 5, maxRows: 8 }" />
      </a-form-model-item>
    </a-modal>
  </div>
</template>
<script>
import { form_get } from "@/services/forms";
import Cookie from "js-cookie";
import { upscalelist } from "./data.json";
import {
  manage_get, //获取详情
  product_list, //产品列表
  manage_production, //生产情况编辑
  manage_run, // 经营情况编辑
  manage_work, //用工情况编辑
  regulate_paginate, //管理岗位分页
  regulate_edit, //管理岗位编辑
  regulate_create, //管理岗位新增
  regulate_delete, //管理岗位删除
  regulate_restore, //管理岗位还原
  highperson_paginate, //高端人才分页
  highperson_edit, //高端人才编辑
  highperson_create, //高端人才新增
  highperson_delete, //高端人才删除
  highperson_restore, //高端人才还原
  manage_event_delete,
  manage_event,
  // company_yingyee_enterprise,
  // company_nashui_enterprise,
} from "@/services/infofilling";
import { dictmap_tree } from "@/services/dictmap";
// import { Line } from "@antv/g2plot";
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
  components: {},
  data() {
    return {
      id: undefined,
      company: undefined,
      loading: false,
      datas: {},
      activeKey: "1",
      edicts: false,
      // shedows: false,
      visble_product: true,
      visble_manage: true,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      // 生产情况
      productlist: [], //产品列表
      productionData: {},
      formproduction: {
        prostatus: [],
        water: 0,
        electricity: 0,
        natgas: 0,
      },
      //   经营情况
      manageData: {},
      formmanage: {
        yingyee: 0,
        nashui: 0,
        lirun: 0,
        yanfa: 0,
        chanzhi: 0,
        gudingzichan: 0,
        duiwaitouzi: 0,
        guquan: 0,
        guozi: 0,
        daikuan: 0,
        minjian: 0,
      },
      jsonData: {},
      titles: "管理岗位",
      movisible: false,
      upscalelist,
      postcolumns: [
        {
          title: "姓名",
          dataIndex: "name",
          scopedSlots: { customRender: "name" },
        },
        {
          title: "性别",
          dataIndex: "sex",
          scopedSlots: { customRender: "sex" },
        },
        {
          title: "年龄",
          dataIndex: "age",
          scopedSlots: { customRender: "age" },
        },
        {
          title: "职务",
          dataIndex: "job",
          scopedSlots: { customRender: "job" },
        },
        {
          title: "联系方式",
          dataIndex: "mobile",
          scopedSlots: { customRender: "mobile" },
        },
        {
          title: "政治面貌",
          dataIndex: "face",
          scopedSlots: { customRender: "face" },
        },
        {
          title: "简介",
          dataIndex: "content",
          ellipsis: true,
          scopedSlots: { customRender: "content" },
        },
        {
          title: "操作",
          dataIndex: "action",
          width: "120px",
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
      upscalecolumns: [
        {
          title: "姓名",
          dataIndex: "name",
          width: "120px",
          align: "center",
          scopedSlots: { customRender: "name" },
        },
        {
          title: "姓别",
          dataIndex: "sex",
          width: "80px",
          align: "center",
          scopedSlots: { customRender: "sex" },
        },
        {
          title: "年龄",
          dataIndex: "age",
          width: "80px",
          align: "center",
          scopedSlots: { customRender: "age" },
        },
        {
          title: "职务",
          dataIndex: "job",
          scopedSlots: { customRender: "job" },
        },
        {
          title: "联系方式",
          dataIndex: "mobile",
          scopedSlots: { customRender: "mobile" },
        },
        {
          title: "聘期",
          dataIndex: "employment",
          width: "200px",
          scopedSlots: { customRender: "employment" },
        },
        {
          title: "身份荣誉",
          dataIndex: "honor",
          scopedSlots: { customRender: "honor" },
        },

        {
          title: "政治面貌",
          dataIndex: "face",
          scopedSlots: { customRender: "face" },
        },
        {
          title: "简介",
          dataIndex: "content",
          ellipsis: true,
          scopedSlots: { customRender: "content" },
        },
        {
          title: "操作",
          dataIndex: "action",
          width: "120px",
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
      postData: {},
      upscaleData: {},
      employmentData: {},
      //   用工情况
      formemployment: {
        needworks: [],
        dangyuan: 0,
        number: 0,
        commons: [],
      },
      visble_employment: true,
      workslist: [],
      pageSizeOptions: ["10", "20", "30", "40"],
      postlist: [],
      facelist: [],
      honorlist: [],
      // 管理岗位
      methodes: undefined,
      searchform: {
        per_page: 10,
        page: 1,
        keyword: undefined,
        delete: false,
      },
      table_loading: false,
      managedatas: {},
      // 高端人才
      highpersondatas: {},
      highperson_loading: false,
      searchforms: {
        per_page: 10,
        page: 1,
        keyword: undefined,
        delete: false,
      },
      // 企业重大事情
      visble_import: false,
      events: [],
      eventid: undefined,
      texts: "",
      // 统计图数据
      // indext: 0,
      // nashuilist: [],
      // yingyeelist: [],
      // yingyeeData: {},
      // nashuieData: {},
    };
  },
  computed: {
    userinfo() {
      return this.$store.getters["account/user"];
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
        productlist: [],
      };
      this.productlist.filter((item) => {
        result.productlist.push({
          label: item.title,
          value: item.id,
        });
      });
      return result;
    },
    pagination: {
      get() {
        return {
          page: this.managedatas.page || 1,
          per_page: this.managedatas.per_page || 10,
        };
      },
      set(val) {
        this.managedatas.page = val.page || 1;
        this.managedatas.per_page = val.per_page || 10;
      },
    },
    paginations: {
      get() {
        return {
          page: this.highpersondatas.page || 1,
          per_page: this.highpersondatas.per_page || 10,
        };
      },
      set(val) {
        this.highpersondatas.page = val.page || 1;
        this.highpersondatas.per_page = val.per_page || 10;
      },
    },
  },
  created() {
    this.id = this.params.ids;
    this.company = this.params.id;
    this.init();
  },
  methods: {
    init() {
      Promise.all([
        form_get({ name: "zdxf_production" }),
        form_get({ name: "zdxf_manage" }),
        form_get({ name: "zdxf_post" }),
        form_get({ name: "zdxf_upscale" }),
        form_get({ name: "zdxf_employment" }),
        product_list({ company: this.company }),
        dictmap_tree({ name: "type_work" }),
        dictmap_tree({ name: "company_post" }), //职务列表
        dictmap_tree({ name: "Politicals" }), //政治面貌列表
        dictmap_tree({ name: "Status_honor_list" }), //身份荣誉列表
      ])
        .then((Response) => {
          this.productionData = Response[0].data.data.form;
          this.manageData = Response[1].data.data.form;
          this.postData = Response[2].data.data.form;
          this.upscaleData = Response[3].data.data.form;
          this.employmentData = Response[4].data.data.form;
          this.jsonData = this.postData;
          this.productlist = Response[5].data.data;
          this.workslist = Response[6].data.data;
          this.postlist = Response[7].data.data;
          this.facelist = Response[8].data.data;
          this.honorlist = Response[9].data.data;
          this.resetinfo();
          this.getmanagedata();
          this.gethighperson();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onRecycles() {
      this.getmanagedata();
    },
    Recycles() {
      this.gethighperson();
    },
    // 获取管理岗位数据
    getmanagedata() {
      this.table_loading = true;
      regulate_paginate(Object.assign(this.searchform, { manage: this.id }))
        .then((Response) => {
          this.managedatas = Response.data.data;
          this.table_loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.table_loading = false;
        });
    },
    // 获取高端人才数据
    gethighperson() {
      this.highperson_loading = true;
      highperson_paginate(Object.assign(this.searchforms, { manage: this.id }))
        .then((Response) => {
          this.highpersondatas = Response.data.data;
          this.highperson_loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.highperson_loading = false;
        });
    },
    // 分页
    changepage(page, pageSize) {
      this.searchform.page = page;
      this.searchform.per_page = pageSize;
      this.pagination.page = page;
      this.pagination.per_page = pageSize;
      this.getmanagedata();
    },
    // 分页
    changepages(page, pageSize) {
      this.searchforms.page = page;
      this.searchforms.per_page = pageSize;
      this.paginations.page = page;
      this.paginations.per_page = pageSize;
      this.gethighperson();
    },
    resetinfo() {
      this.loading = true;
      // Promise.all([company_yingyee_enterprise(), company_nashui_enterprise()])
      //   .then((Response) => {
      //     this.indext++;
      //     console.log("Response123", Response);
      //     this.yingyeelist = Response[0].data.data;
      //     this.nashuilist = Response[1].data.data;
      //     if (this.indext == 1) {
      //       this.yingyeeData = new Line("yingyee", {
      //         data: this.yingyeelist,
      //         xField: "_id",
      //         yField: "count",
      //         statistic: {
      //           title: {
      //             offsetY: 0,
      //             style: {
      //               fontSize: 26,
      //             },
      //             formatter: (datum) => (datum ? datum.type : "总计"),
      //           },
      //         },
      //         yAxis: {
      //           label: {
      //             // 数值格式化为千分位
      //             formatter: (v) =>
      //               `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      //           },
      //         },
      //       });
      //       this.yingyeeData.render();

      //       this.nashuieData = new Line("nashuie", {
      //         data: this.nashuilist,
      //         xField: "_id",
      //         yField: "count",
      //         yAxis: {
      //           label: {
      //             // 数值格式化为千分位
      //             formatter: (v) =>
      //               `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      //           },
      //         },
      //       });
      //       this.nashuieData.render();
      //     } else {
      //       this.yingyeeData.update(this.yingyeelist);
      //       this.nashuieData.update(this.nashuilist);
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
      manage_get({ id: this.id })
        .then((res) => {
          this.loading = false;
          this.edicts = true;
          this.datas = res.data.data;
          // 生产情况
          this.formproduction = {
            prostatus: this.datas.prostatus,
            water: this.datas.productions.length
              ? this.datas.productions[0].water
              : 0,
            electricity: this.datas.productions.length
              ? this.datas.productions[0].electricity
              : 0,
            natgas: this.datas.productions.length
              ? this.datas.productions[0].natgas
              : 0,
          };
          // 经营情况
          this.formmanage = this.datas.runs.length
            ? this.datas.runs[0]
            : this.formmanage;
          this.events = this.datas.event;
          // 用工-普通用工情况
          this.formemployment = {
            commons: this.datas.commons,
            dangyuan: this.datas.workforces.length
              ? this.datas.workforces[0].dangyuan
              : 0,
            number: this.datas.workforces.length
              ? this.datas.workforces[0].number
              : 0,
            needworks: this.datas.needworks,
          };
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.Response.data.message);
        });
    },
    // 生产情况 编辑
    edit_product() {
      this.visble_product = false;
      this.$nextTick(() => {
        this.$refs.formproduction.setData(this.formproduction);
      });
    },
    // 经营情况 编辑
    edit_manage() {
      this.visble_manage = false;
      this.$nextTick(() => {
        this.$refs.formmanage.setData(this.formmanage);
      });
    },
    // 生产情况 保存
    submitbasc() {
      this.$refs.formproduction.getData().then((res) => {
        var datas = Object.assign(res, {
          id: this.datas.productions.length
            ? this.datas.productions[0].id
            : undefined,
          manage: this.id,
          comeform: "PC端",
        });
        manage_production(datas)
          .then(() => {
            this.visble_product = true;
            setTimeout(() => {
              this.resetinfo();
            }, 100);
          })
          .catch((err) => {
            console.log(err);
            this.$message.error(err.Response.data.message);
          });
      });
    },
    // 经营情况 保存
    submitmanage() {
      this.$refs.formmanage.getData().then((res) => {
        manage_run(
          Object.assign(res, {
            manage: this.id,
            comeform: "PC端",
          })
        )
          .then(() => {
            this.visble_manage = true;
            setTimeout(() => {
              this.resetinfo();
            }, 100);
          })
          .catch((err) => {
            console.log(err);
            this.$message.error(err.Response.data.message);
          });
      });
    },
    // 岗位编辑
    editpost(record) {
      this.jsonData = this.postData;
      this.titles = "管理岗位编辑";
      this.manageid = record.id;
      this.methodes = regulate_edit;
      this.movisible = true;
      this.$nextTick(() => {
        this.$refs.forms.setData({
          name: record.name,
          sex: record.sex,
          age: record.age,
          job: record.job,
          mobile: record.mobile,
          face: record.face,
          content: record.content,
        });
      });
    },
    // 岗位新增
    onAdd() {
      this.jsonData = this.postData;
      this.titles = "管理岗位新增";
      this.manageid = undefined;
      this.methodes = regulate_create;
      this.movisible = true;
      this.$nextTick(() => {
        this.$refs.forms.reset();
      });
    },
    editheight(record) {
      this.jsonData = this.upscaleData;
      this.titles = "高端人才编辑";
      this.manageid = record.id;
      this.methodes = highperson_edit;
      this.movisible = true;
      this.$nextTick(() => {
        this.$refs.forms.setData({
          name: record.name,
          sex: record.sex,
          age: record.age,
          job: record.job,
          mobile: record.mobile,
          face: record.face,
          content: record.content,
          employment: [
            record.start.substring(0, 10),
            record.end.substring(0, 10),
          ],
          honor: record.honor,
        });
      });
    },
    onAdds() {
      this.jsonData = this.upscaleData;
      this.titles = "高端人才新增";
      this.manageid = undefined;
      this.methodes = highperson_create;
      this.movisible = true;
      this.$nextTick(() => {
        this.$refs.forms.reset();
      });
    },
    getOk() {
      this.$refs.forms
        .getData()
        .then((Response) => {
          var datas = Object.assign(Response, {
            id: this.manageid,
            comeform: "PC端",
            manage: this.id,
            start: Response.employment ? Response.employment[0] : undefined,
            end: Response.employment ? Response.employment[1] : undefined,
          });
          this.methodes(datas)
            .then((res) => {
              this.movisible = false;
              if (res.data.data.honor) {
                this.gethighperson();
              } else {
                this.getmanagedata();
              }
            })
            .catch((err) => {
              this.movisible = false;
              this.$message.error(err.Response.data.message);
            });
        })
        .catch((error) => {
          console.log(error);
          this.$message.error(error.Response.data.message);
        });
    },
    // 删除高端人才
    deletes_height(record) {
      highperson_delete({ id: record.id })
        .then((Response) => {
          this.gethighperson();
          this.$message.success(Response.data.message);
        })
        .catch((error) => {
          console.log(error);
          this.$message.error(error.Response.data.message);
        });
    },
    // 还原高端人才
    restore_height(record) {
      highperson_restore({ id: record.id })
        .then((Response) => {
          this.gethighperson();
          this.$message.success(Response.data.message);
        })
        .catch((error) => {
          console.log(error);
          this.$message.error(error.Response.data.message);
        });
    },

    // 删除岗位人员
    deletes_post(record) {
      regulate_delete({ id: record.id })
        .then((Response) => {
          this.getmanagedata();
          this.$message.success(Response.data.message);
        })
        .catch((error) => {
          console.log(error);
          this.$message.error(error.Response.data.message);
        });
    },
    // 还原岗位人员
    restore_post(record) {
      regulate_restore({ id: record.id })
        .then((Response) => {
          this.getmanagedata();
          this.$message.success(Response.data.message);
        })
        .catch((error) => {
          console.log(error);
          this.$message.error(error.Response.data.message);
        });
    },
    // 高端人才编辑
    edithigh(record) {
      this.movisible = true;
      this.jsonData = this.upscaleData;
      this.titles = "管理岗位编辑";
      this.manageid = record.id;
      this.$nextTick(() => {
        this.$refs.forms.setData({
          name: record.name,
          sex: record.sex,
          age: record.age,
          job: record.job,
          mobile: record.mobile,
          face: record.face,
          content: record.content,
          honor: record.honor,
          employment: record.employment,
        });
      });
    },
    // 普通用工情况 编辑
    edit_employment() {
      this.visble_employment = false;
      this.$nextTick(() => {
        this.$refs.formemployments.setData({
          commons: this.formemployment.commons,
          dangyuan: this.formemployment.dangyuan,
          number: this.formemployment.number,
          needworks: this.formemployment.needworks,
        });
      });
    },
    // 普通用工情况 保存
    submitemployment() {
      this.$refs.formemployments.getData().then((res) => {
        var datas = Object.assign(res, {
          manage: this.id,
          comeform: "PC端",
        });
        manage_work(datas)
          .then(() => {
            this.visble_employment = true;
            setTimeout(() => {
              this.resetinfo();
            }, 100);
          })
          .catch((err) => {
            console.log(err);
            this.$message.error(err.Response.data.message);
          });
      });
    },
    // 新增事件
    add_import() {
      this.visble_import = true;
      this.texts = undefined;
    },
    // 编辑事件
    edit_import(record) {
      this.visble_import = true;
      this.$nextTick(() => {
        this.texts = record.content;
        this.eventid = record.id;
      });
    },
    // 删除
    confirmdeletes(record) {
      manage_event_delete({ id: record.id })
        .then((res) => {
          this.$message.success(res.data.message);
          setTimeout(() => {
            this.resetinfo();
          }, 100);
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.Response.data.message);
        });
    },
    getOkes() {
      if (this.texts) {
        manage_event({
          manage: this.id,
          id: this.eventid,
          content: this.texts,
        })
          .then(() => {
            this.visble_import = false;
            setTimeout(() => {
              this.resetinfo();
            }, 100);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    confirm(index) {
      this.postlist.splice(index, 1);
    },
    // 管理岗位查询
    onSearch() {
      this.getmanagedata();
    },
    onSearchs() {
      this.gethighperson();
    },
    // 管理岗位查询重置
    resetForm() {
      this.searchform = {};
      this.getmanagedata();
    },
    resetForms() {
      this.searchforms = {};
      this.gethighperson();
    },

    //获取产品名称
    getproduct(id) {
      var datas = this.productlist.filter((item) => {
        return item.id == id;
      });
      return datas.length ? datas[0].title : "";
    },
    // callback(value) {
    //   this.activeKey = value;
    //   if (value == "1") {
    //     this.jsonData = this.postData;
    //   } else if (value == "2") {
    //     this.jsonData = this.upscaleData;
    //   }
    // },
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
  .fontsize_label {
    font-size: 16px !important;
  }
  .basc_info {
    width: 100%;
    font-size: 20px;
  }
  .business_info {
    margin-top: 24px;
  }
  .table_s {
    margin-top: 20px;
  }
  .imports_items {
    background: #e9f5ff;
    padding: 10px 30px 10px 10px;
    margin: 10px 0;
  }
  .imports_item {
    font-size: 16px;
    text-indent: 2em;
    letter-spacing: 1px;
    cursor: pointer;
    // position: relative;
  }
  .imports_icon {
    // position: absolute;
    right: 5px;
    top: 5px;
    color: #888888;
  }
  .imports_icon:hover {
    // transform: scale(1.2);
    color: black;
  }
  .dynamic-delete-button {
    cursor: pointer;
    position: relative;
    top: 4px;
    font-size: 24px;
    color: #999;
    transition: all 0.3s;
  }
  .dynamic-delete-button:hover {
    color: #777;
  }
  .dynamic-delete-button[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
</style>
<style scoped>
.tubiao_style {
  height: 300px;
}
</style>