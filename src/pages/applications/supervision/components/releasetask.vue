<template>
  <div class="maines">
    <div class="steps_s">
      <a-steps :current="current">
        <a-step v-for="items in stemlist" :key="items.id">
          <template slot="title">{{ items.title }}</template>
          <span slot="description">{{ items.description }}</span>
        </a-step>
      </a-steps>
    </div>
    <!-- 表单 -->
    <div class="forms" v-if="current == 0">
      <a-spin :spinning="spinning" tip="目录加载中...">
        <!-- <k-form-build
          :value="formDatas"
          ref="kcompanyForm"
          :dynamicData="dynamicData"
          @change="changeforms"
        /> -->
        <k-form-build
          :value="formDatas1"
          ref="kcompanyForm1"
          :dynamicData="dynamicData"
          @change="changeforms"
        />
        <a-form-model
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item
            ref="organization"
            label="目录"
            prop="organization"
          >
            <a-tree-select
              style="width: 100%"
              show-search
              @change="changechannels"
              allowClear
              v-model="ruleForm.organization"
              :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
              :treeData="channeltree"
              placeholder="请选择目录"
              :replaceFields="{
                key: 'id',
                value: 'id',
                title: ``,
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
              <span slot="title" slot-scope="record">
                {{ record.title }}
                <a-tag color="blue" v-if="record.maps && record.maps.length">
                  映
                </a-tag>
              </span>
            </a-tree-select>
          </a-form-model-item>
        </a-form-model>
        <k-form-build
          :value="formDatas2"
          ref="kcompanyForm2"
          :dynamicData="dynamicData"
          @change="changeforms"
        />
      </a-spin>
      <div style="text-align: center; margin: 50px auto 70px">
        <a-button type="primary" @click="next">下一步</a-button>
      </div>
    </div>
    <!-- 表格 -->
    <div class="tables" v-if="current == 1">
      <div class="ta_title">任务标题：{{ form.title }}</div>
      <div class="ta_content">任务说明：{{ form.content }}</div>
      <a-button class="ta_button" type="dashed" @click="modify()"
        ><a-icon type="plus"></a-icon> 添加新站点</a-button
      >
      <div style="display: flex; margin: 16px auto">
        <div class="ta_left">
          <a-alert type="info" show-icon>
            <div class="message" slot="message">
              已选择&nbsp;
              <a>{{ selectedRowKeys.length }}</a>
              &nbsp;项
              <a
                class="clear"
                @click="onSelectClear"
                v-if="this.selectedRowKeys.length > 0"
                >清空</a
              >
            </div>
          </a-alert>
        </div>
        <div class="ta_right">
          <a-space>
            <a-popconfirm
              title="你确定要删除这些数据吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="pldelete"
              :disabled="this.selectedRowKeys.length < 1"
            >
              <a-button
                :disabled="this.selectedRowKeys.length < 1"
                type="primary"
                size="large"
                >批量删除</a-button
              >
            </a-popconfirm>
          </a-space>
        </div>
      </div>
      <a-table
        :columns="columns"
        :data-source="tabledata"
        bordered
        rowKey="index"
        class="tablees"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :scroll="{ x: 2000 }"
      >
        <template slot="site" slot-scope="text, record">{{
          record.siteTitle
        }}</template>
        <template slot="channel" slot-scope="text, record">{{
          record.title
        }}</template>
        <!-- 任务时间 -->
        <template slot="degrees" slot-scope="text, record">
          <!-- {{record.category == "时间类型" ? record.degrees[0]. + "/" + item.end : "" }} -->
          <div v-if="record.degrees">
            <a-tag v-for="(item,index) in record.degrees" :key="index" style="margin-bottom:5px" color='#6495ED'>
              {{item.ranges[0] + " / " +item.ranges[1]}}
              <!-- {{item}} -->
            </a-tag>
          </div>
          <a-tag v-else color='#6495ED'>
          {{ timesee(record) }}
          </a-tag>
        </template>
        <!-- 循环次数 -->
        <template slot="degree" slot-scope="text, record">
          {{ record.degree }}
        </template>
        <!-- 周期类型 -->
        <template slot="period" slot-scope="text, record">{{
          record.period
        }}</template>
        <template slot="count" slot-scope="text, record">{{
          record.count
        }}</template>
        <template slot="taskload" slot-scope="text, record">
          {{ record.taskload || record.degree * record.count }}
        </template>
        <template slot="keywords" slot-scope="text, record">
          <a-tag v-for="(item, index) in record.keywords" :key="index">
            {{ item }}</a-tag
          >
        </template>
        <template slot="collects" slot-scope="text, record">
          <a-tag v-for="(item, index) in record.collects" :key="index">
            {{ item }}
          </a-tag>
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <a @click="modify(record, index)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="你确定要删除此条数据吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="deletes(index)"
          >
            <a href="#">删除</a>
          </a-popconfirm>
        </template>
      </a-table>
      <div style="text-align: center; margin: 30px auto 50px">
        <a-space>
          <a-button type="primary" @click="Lasts">上一步</a-button>
          <a-button type="primary" @click="nexts">下一步</a-button>
        </a-space>
      </div>
    </div>
    <!-- 创建完成 -->
    <div class="finished" v-if="current == 2">
      <div class="finished_imgs">
        <img src="../images/finish.png" alt="" />
      </div>
      <div class="finished_title">任务创建成功</div>
      <div class="finished_content">任务创建成功</div>
      <a-space>
        <a-button type="primary" @click="creattask">创建任务</a-button>
        <a-button @click="totasklist">返回列表</a-button>
      </a-space>
    </div>
    <!-- 督导编辑 -->
    <a-modal
      title="任务督导"
      width="60%"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      class="taskSupervision"
    >
      <a-spin :spinning="spinning" tip="目录加载中...">
        <k-form-build
          :value="formDatas1"
          ref="kcompanyForms1"
          :dynamicData="dynamicData"
          @change="changeformes"
        />
        <a-form-model
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item
            ref="organization"
            label="目录"
            prop="organization"
          >
            <a-tree-select
              style="width: 100%"
              show-search
              @change="changechannels"
              allowClear
              v-model="ruleForm.organization"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="channeltree"
              placeholder="请选择目录"
              :replaceFields="{
                key: 'id',
                value: 'id',
                title: ``,
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
              <span slot="title" slot-scope="record">
                {{ record.title }}
                <a-tag color="blue" v-if="record.maps && record.maps.length"
                  >映</a-tag
                >
              </span>
            </a-tree-select>
          </a-form-model-item>
        </a-form-model>
        <k-form-build
          :value="formDatas2"
          ref="kcompanyForms2"
          :dynamicData="dynamicData"
          @change="changeformes"
        />
      </a-spin>
    </a-modal>
  </div>
</template>
<script>
import { organization_tree, organization_get } from "@/services/organization";
import { channel_list, channel_maps, channel_get } from "@/services/content";
import { risk_create, datetime_degrees } from "@/services/supervision";
import { form_get } from "@/services/forms";
export default {
  data() {
    return {
      formDatas: {},
      formDatas1: {},
      formDatas2: {},
      ruleForm: {
        organization: undefined,
      },
      rules: {
        organization: [{ required: true, message: "请选择目录" }],
      },
      wrapperCol: { span: 24 },
      labelCol: { span: 24 },
      current: 0,
      stemlist: [
        { id: 0, title: "基本信息", description: "填写任务的具体内容" },
        { id: 1, title: "确认信息", description: "确认上一步填写的信息" },
        { id: 2, title: "发布完成", description: "完成任务创建" },
      ],
      form: {},
      sitetree: [],
      channeltree: [],
      spinning: false,
      selectedRowKeys: [],
      tabledata: [],
      columns: [
        {
          title: "任务目标",
          children: [
            {
              title: "任务站点",
              dataIndex: "site",
              align: "center",
              scopedSlots: { customRender: "site" },
            },
            {
              title: "任务目录",
              dataIndex: "channel",
              align: "center",
              scopedSlots: { customRender: "channel" },
            },
          ],
        },
        {
          title: "任务量",
          children: [
            {
              title: "督导类型",
              dataIndex: "category",
              align: "center",
              scopedSlots: { customRender: "category" },
            },
            {
              title: "任务时间",
              dataIndex: "degrees",
              width: "200px",
              align: "center",
              scopedSlots: { customRender: "degrees" },
            },
            {
              title: "周期类型",
              dataIndex: "period",
              align: "center",
              scopedSlots: { customRender: "period" },
            },
            {
              title: "循环次数",
              dataIndex: "degree",
              align: "center",
              scopedSlots: { customRender: "degree" },
            },
            {
              title: "每周期发文量",
              dataIndex: "count",
              align: "center",
              scopedSlots: { customRender: "count" },
            },
            {
              title: "执行时间",
              dataIndex: "action",
              align: "center",
              width: "120px",
              scopedSlots: { customRender: "action" },
            },
            {
              title: "总发文量",
              dataIndex: "taskload",
              align: "center",
              scopedSlots: { customRender: "taskload" },
            },
          ],
        },
        {
          title: "标题关键词",
          dataIndex: "keywords",
          align: "center",
          scopedSlots: { customRender: "keywords" },
        },
        {
          title: "操作",
          dataIndex: "operation",
          align: "center",
          fixed: "right",
          width: "120px",
          scopedSlots: { customRender: "operation" },
        },
      ],
      indext: undefined,
      visible: false,
      confirmLoading: false,
      siteTitle: undefined,
      channeltitle: undefined,
    };
  },
  computed: {
    dynamicData() {
      let result = {
        sitelist: this.sitetree,
        channellist: this.channeltree,
        superviselist: [
          { label: "是", value: true },
          { label: "否", value: false },
        ],
      };
      return result;
    },
  },
  mounted() {},
  created() {
    this.init();
  },
  methods: {
    organization_gets(id) {
      organization_get({ id: id })
        .then((ress) => {
          this.siteTitle = ress.data.data.title;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    channel_gets(id) {
      channel_get({ id: id })
        .then((ress) => {
          this.channeltitle = ress.data.data.title;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    modify(record, index) {
      this.indext = index;
      this.visible = true;
      if (record) {
        this.indext = index;
        this.spinning = true;
        channel_list({
          site: record.siteid || record.site,
          tree: true,
        })
          .then((res) => {
            this.channeltree = res.data.data;
            this.spinning = false;
            if (record.category == "周期类型") {
              this.$refs.kcompanyForms2.show([
                "period",
                "degree",
                "count",
                "action",
              ]);
              this.$refs.kcompanyForms1.hide(["title", "content"]);
              this.$refs.kcompanyForms2.hide([
                "degrees",
                "supervise",
                "taskload",
                "includes",
              ]);
            } else if (record.category == "时间类型") {
              this.$refs.kcompanyForms1.hide(["title", "content"]);
              this.$refs.kcompanyForms2.hide([
                "period",
                "degree",
                "count",
                "action",
                "supervise",
                "includes",
              ]);
              this.$refs.kcompanyForms2.show(["degrees", "taskload"]);
            }
            this.$nextTick(() => {
              this.$refs.kcompanyForms1.setData({
                title: this.form.title,
                content: this.form.content,
                site: record.siteid || record.site,
                channel: record.channel,
              });
              this.ruleForm = {
                organization: record.channel,
              };
              this.$refs.kcompanyForms2.setData({
                period: record.period || undefined,
                category: record.category || undefined,
                degree: record.degree || undefined,
                count: record.count || undefined,
                // supervise: record.supervise,
                degrees: [record.start, record.end],
                keywords: record.keywords,
                start: record.degrees ? record.degrees[0] : undefined,
                end: record.degrees ? record.degrees[1] : undefined,
                action: record.action || undefined,
                number: record.number || 0,
                taskload: record.taskload || undefined,
                collects: record.collects || undefined,
              });
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.indext = undefined;
        this.spinning = false;
        this.$nextTick(() => {
          if (this.form.category == "周期类型") {
            this.$refs.kcompanyForms2.show([
              "period",
              "degree",
              "count",
              "action",
            ]);
            this.$refs.kcompanyForms1.hide(["title", "content"]);
            this.$refs.kcompanyForms2.hide([
              "degrees",
              "taskload",
              "includes",
            ]);
          } else if (this.form.category == "时间类型") {
            this.$refs.kcompanyForms1.hide(["title", "content"]);
            this.$refs.kcompanyForms2.hide([
              "includes",
              "period",
              "degree",
              "count",
              "action",
            ]);
            this.$refs.kcompanyForms2.show(["degrees", "taskload"]);
          }
        });
        this.$nextTick(() => {
          // this.$refs.kcompanyForms.setData(this.form);
          this.$refs.kcompanyForms1.setData({
            title: this.form.title,
            content: this.form.content,
            site: this.form.site,
            channel: this.form.channel,
          });
          this.ruleForm.organization = this.form.channel;
          this.$refs.kcompanyForms2.setData(this.form);
        });
      }
    },
    deletes(index) {
      this.tabledata.splice(index, 1);
    },
    // 排序
    sorts(array) {
      for (var i = 0; i < array.length; i++) {
        for (var j = i + 1; j < array.length; j++) {
          if (array[i] < array[j]) {
            var tmp = array[i];
            array[i] = array[j];
            array[j] = tmp;
          }
        }
      }
      return array;
    },
    // 批量删除
    pldelete() {
      var Last = this.sorts(this.selectedRowKeys);
      this.tabledata = this.tabledata.filter((item, index) => {
        if (Last.indexOf(index) == -1) {
          return item;
        }
      });
      this.selectedRowKeys = [];
    },
    handleOk() {
      Promise.all([
        this.$refs.kcompanyForms1.getData(),
        this.$refs.kcompanyForms2.getData(),
      ])
        .then((res) => {
          this.$refs.ruleForm.validate((valid) => {
            if (valid) {
              this.visible = false;
              if (this.indext || this.indext == 0) {
                this.tabledata[this.indext] = Object.assign(res[0], res[1], {
                  siteTitle: this.siteTitle,
                  title: this.channeltitle,
                  start: res[1].degrees ? res[1].degrees[0] : undefined,
                  end: res[1].degrees ? res[1].degrees[1] : undefined,
                  channel: this.ruleForm.organization,
                });
              } else {
                this.tabledata.push(
                  Object.assign(res[0], res[1], {
                    siteTitle: this.siteTitle,
                    title: this.channeltitle,
                    channel: this.ruleForm.organization,
                    start: res[1].degrees ? res[1].degrees[0] : undefined,
                    end: res[1].degrees ? res[1].degrees[1] : undefined,
                  })
                );
              }
            } else {
              return false;
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleCancel() {
      this.visible = false;
      this.indext = undefined;
    },
    init() {
      Promise.all([
        form_get({ name: "supervise_task" }),
        organization_tree(),
        form_get({ name: "supervise_task1" }),
        form_get({ name: "supervise_task2" }),
      ])
        .then((res) => {
          this.formDatas = res[0].data.data.form;
          this.formDatas1 = res[2].data.data.form;
          this.formDatas2 = res[3].data.data.form;
          this.sitetree = res[1].data.data;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    // 表单改变事件： 站点
    changeforms(key, value) {
      if (value == "site") {
        this.spinning = true;
        channel_list({
          site: key,
          tree: true,
        })
          .then((res) => {
            this.channeltree = res.data.data;
            this.$refs.ruleForm.resetFields()
            this.spinning = false;
            this.organization_gets(key);
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (value == "category") {
        if (key == "周期类型") {
          this.$refs.kcompanyForm2.show([
            "includes",
            "period",
            "degree",
            "count",
            "action",
          ]);

          this.$refs.kcompanyForm2.hide(["degrees", "taskload", "taskload"]);
        } else if (key == "时间类型") {
          this.$refs.kcompanyForm2.hide([
            "period",
            "degree",
            "count",
            "action",
          ]);
          this.$refs.kcompanyForm2.show(["degrees", "taskload", "includes"]);
        }
      } else if (value == "channel") {
        this.channel_gets(key);
      }
    },
    changechannels(key) {
      if (key) {
        this.channel_gets(key);
      } else {
        this.$message.warning("请选择目录！");
      }
    },
    //
    changeformes(key, value) {
      if (value == "site") {
        this.spinning = true;
        channel_list({
          site: key,
          tree: true,
        })
          .then((res) => {
            this.channeltree = res.data.data;
            this.spinning = false;
            this.organization_gets(key);
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (value == "category") {
        if (key == "周期类型") {
          this.$refs.kcompanyForms2.show([
            "period",
            "degree",
            "count",
            "action",
          ]);
          this.$refs.kcompanyForms2.hide(["degrees", "taskload", "taskload"]);
        } else if (key == "时间类型") {
          this.$refs.kcompanyForms2.hide([
            "period",
            "degree",
            "count",
            "action",
          ]);
          this.$refs.kcompanyForms2.show(["degrees", "taskload"]);
        }
      } else if (value == "channel") {
        this.channel_gets(key);
      }
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    onSelectClear() {
      this.selectedRowKeys = [];
    },
    next() {
      Promise.all([
        this.$refs.kcompanyForm1.getData(),
        this.$refs.kcompanyForm2.getData(),
      ])
        .then((response) => {
          this.$refs.ruleForm.validate((valid) => {
            if (valid) {
              this.form = Object.assign(response[0], response[1], {
                channel: this.ruleForm.organization,
              });
              response = Object.assign(response[0], response[1], {
                channel: this.ruleForm.organization,
              });
              this.current = 1;
              if (response.includes) {
                channel_maps({ channel: response.channel })
                  .then((res) => {
                    console.log('00000',response)
                    this.tabledata = [];
                    this.$nextTick(() => {
                      this.tabledata = res.data.data;
                      for (
                        let index = 0;
                        index < this.tabledata.length;
                        index++
                      ) {
                        // this.tabledata[index].name = response.name;
                        // this.tabledata[index].content = response.content;
                        this.tabledata[index].site =
                          this.tabledata[index].siteid;
                        this.tabledata[index].channel =
                          this.tabledata[index].id;
                        this.tabledata[index].category = response.category;
                        this.tabledata[index].period =
                          response.category == "周期类型"
                            ? response.period
                            : undefined;
                        this.tabledata[index].degree =
                          response.category == "周期类型"
                            ? response.degree
                            : undefined;
                        this.tabledata[index].count =
                          response.category == "周期类型"
                            ? response.count
                            : undefined;
                        this.tabledata[index].start =
                          response.category == "时间类型"
                            ? response.degrees[0]
                            : undefined;
                        this.tabledata[index].end =
                          response.category == "时间类型"
                            ? response.degrees[1]
                            : undefined;
                        this.tabledata[index].degrees =
                          response.category == "时间类型"
                            ? response.degrees
                            : undefined;
                        this.tabledata[index].keywords = response.keywords;
                        // this.tabledata[index].supervise = response.supervise;
                        this.tabledata[index].number = response.number || 0;
                        this.tabledata[index].action =
                          response.category == "周期类型"
                            ? response.action
                            : undefined;
                        this.tabledata[index].taskload = response.taskload;
                        this.tabledata[index].collects = response.collects;
                      }
                      this.tabledata.unshift({
                        siteTitle: this.siteTitle,
                        title: this.channeltitle,
                        site: response.site,
                        channel: response.channel,
                        category: response.category,
                        period:
                          response.category == "周期类型"
                            ? response.period
                            : undefined,
                        degree:
                          response.category == "周期类型"
                            ? response.degree
                            : undefined,
                        count:
                          response.category == "周期类型"
                            ? response.count
                            : undefined,
                        start:
                          response.category == "时间类型"
                            ? response.degrees[0]
                            : undefined,
                        end:
                          response.category == "时间类型"
                            ? response.degrees[1]
                            : undefined,
                        degrees:
                          response.category == "时间类型"
                            ? response.degrees
                            : undefined,
                        keywords: response.keywords,
                        // supervise = response.supervise;
                        number: response.number || 0,
                        action:
                          response.category == "周期类型"
                            ? response.action
                            : undefined,
                        taskload: response.taskload,
                        collects: response.collects,
                      });
                    });
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              } else {
                this.tabledata = [];
                this.$nextTick(() => {
                  this.tabledata.push({
                    siteTitle: this.siteTitle,
                    title: this.channeltitle,
                    site: response.site,
                    channel: response.channel,
                    category: response.category,
                    period:
                      response.category == "周期类型"
                        ? response.period
                        : undefined,
                    degree:
                      response.category == "周期类型"
                        ? response.degree
                        : undefined,
                    count:
                      response.category == "周期类型"
                        ? response.count
                        : undefined,
                    start:
                      response.category == "时间类型"
                        ? response.degrees[0]
                        : undefined,
                    end:
                      response.category == "时间类型"
                        ? response.degrees[1]
                        : undefined,
                    degrees:
                      response.category == "时间类型"
                        ? response.degrees
                        : undefined,
                    keywords: response.keywords,
                    // supervise = response.supervise;
                    number: response.number || 0,
                    action:
                      response.category == "周期类型"
                        ? response.action
                        : undefined,
                    taskload: response.taskload,
                    collects: response.collects,
                  });
                });
              }
            } else {
              return false;
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    Lasts() {
      this.current = 0;
      this.$nextTick(() => {
        if (this.form.category == "周期类型") {
          this.$refs.kcompanyForm1.show(["title", "content"]);
          this.$refs.kcompanyForm2.show([
            "includes",
            "period",
            "degree",
            "count",
            "action",
          ]);
          this.$refs.kcompanyForm2.hide(["degrees", "taskload"]);
        } else if (this.form.category == "时间类型") {
          this.$refs.kcompanyForm2.hide([
            "period",
            "degree",
            "count",
            "action",
          ]);
          this.$refs.kcompanyForm1.show(["title", "content"]);
          this.$refs.kcompanyForm2.show(["includes", "degrees", "taskload"]);
        }
        this.$nextTick(() => {
          this.$refs.kcompanyForm1.setData({
            title: this.form.title,
            content: this.form.content,
            site: this.form.site,
            channel: this.form.channel,
          });
          this.ruleForm.organization = this.form.channel;
          this.$refs.kcompanyForm2.setData(this.form);
        });
      });
    },
    // 确认信息页（也就是第二页）的下一步
    nexts() {
      const tasks = new Array();
      console.log("pp",this.form)
      if(this.form.degrees && this.form.degrees.length){
        var tempArrays = [];
      for(let i=0;i<this.form.degrees.length;i++) {
        tempArrays.push({start:this.form.degrees[i].ranges[0],end:this.form.degrees[i].ranges[1]});
      }
      console.log('123456',tempArrays)
      console.log('currentresult',this.form)
      }
      const formes = Object.assign(this.form, {
        // title: this.form.name,
        start: this.form.degrees ? this.form.degrees[0] : undefined,
        end: this.form.degrees ? this.form.degrees[1] : undefined,
      });
      for (let index = 0; index < this.tabledata.length; index++) {
        tasks[index] = Object.assign(this.tabledata[index], {
          title: this.tabledata[index].title,
        });
      }
      const datas = Object.assign(formes, { risks: tasks });
      if(this.form.degrees && this.form.degrees.length) {
        this.$set(datas.risks[0],'degrees',tempArrays)
      }
      risk_create(datas)
        .then((response) => {
          this.current = 2;
          this.$message.success(response.data.message);
        })
        .catch((error) => {
          console.log("error", error);
          this.$message.error(err.response.data.message);
        });
    },
    timesee(record) {
      var newdate = new Date(record.action);
      if (record.period == "日") {
        newdate.setDate(newdate.getDate() + record.degree);
        var yy1 = newdate.getFullYear();
        var mm1 = newdate.getMonth() + 1;
        var dd1 = newdate.getDate();
        return record.action + " / " + yy1 + "-" + mm1 + "-" + dd1;
      } else if (record.period == "周") {
        newdate.setDate(newdate.getDate() + record.degree * 7);
        var yy1 = newdate.getFullYear();
        var mm1 = newdate.getMonth() + 1;
        var dd1 = newdate.getDate();
        return record.action + " / " + yy1 + "-" + mm1 + "-" + dd1;
      } else if (record.period == "月") {
        newdate.setMonth(newdate.getMonth() - 1 + (record.degree + 1));
        var yy1 = newdate.getFullYear();
        var mm1 = newdate.getMonth() + 1;
        var dd1 = newdate.getDate();
        return record.action + " / " + yy1 + "-" + mm1 + "-" + dd1;
      } else if (record.period == "季") {
        newdate.setMonth(newdate.getMonth() - 1 + (record.degree * 3 + 1));
        var yy1 = newdate.getFullYear();
        var mm1 = newdate.getMonth() + 1;
        var dd1 = newdate.getDate();
        return record.action + " / " + yy1 + "-" + mm1 + "-" + dd1;
      } else if (record.period == "年") {
        newdate.setMonth(newdate.getMonth() - 1 + (record.degree * 12 + 1));
        var yy1 = newdate.getFullYear();
        var mm1 = newdate.getMonth() + 1;
        var dd1 = newdate.getDate();
        return record.action + " / " + yy1 + "-" + mm1 + "-" + dd1;
      }
    },
    totasklist() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "tasklist",
          params: {
            menus: ["tasklist"],
          },
        },
      });
    },
    creattask() {
      this.current = 0;
      this.$refs.kcompanyForm.reset();
      this.$refs.kcompanyForm.hide([
        "period",
        "degree",
        "count",
        "degrees",
        "action",
        "taskload",
      ]);
    },
  },
};
</script>
<style scoped lang="less">
.maines {
  height: 100%;
  overflow: auto;
  background: #fff;
  .steps_s {
    padding: 85px 20%;
    border-bottom: 1px solid #f5f5f5;
  }
  .forms {
    padding: 20px 18% 50px;
  }
  .tables {
    padding: 20px 10% 50px;
    .ta_title {
      font-size: 20px;
      font-family: PingFang SC, PingFang SC-Medium;
      font-weight: 500;
      text-align: left;
      color: rgba(0, 0, 0, 0.85);
    }
    .ta_content {
      font-size: 14px;
      font-family: PingFang SC;
      text-align: left;
      color: rgba(0, 0, 0, 0.65);
      padding: 13px 0 26px;
    }
    .ta_button {
      width: 100%;
    }
    .ta_left {
      width: calc(100% - 100px);
      .message {
        color: #000000a6;
        a {
          font-weight: 600;
        }
      }
      .clear {
        float: right;
      }
    }
    .ta_right {
      width: 100px;
      display: flex;
      justify-content: end;
      align-items: center;
    }
    .tablees {
      a {
        color: #1890ff;
      }
    }
  }
  .finished {
    width: 100%;
    text-align: center;
    padding: 90px 0px;
    .finished_imgs img {
      width: 70px;
      height: 70px;
    }
    .finished_title {
      font-size: 24px;
      text-align: center;
      color: #000000d9;
      margin: 36px auto 5px;
    }
    .finished_content {
      font-size: 14px;
      text-align: center;
      color: #00000073;
      margin: 5px auto 25px;
    }
  }
}
</style>
<style scoped>
/*  */
.maines >>> .ant-form-item {
  box-shadow: #dedede 0 0 4px;
  padding: 15px;
  border-radius: 6px;
}
.maines >>> .ant-form-item .ant-form-item {
  box-shadow: #fff 0 0 0;
}
.tablees >>> .ant-modal-body {
  height: 640px !important;
  overflow-y: auto;
}
.taskSupervision >>> .ant-modal-body {
  height: 640px !important;
  overflow-y: auto;
}
.taskSupervision >>> .ant-form-item {
  box-shadow: #dedede 0 0 4px;
  padding: 15px;
  border-radius: 6px;
}
.taskSupervision >>> .ant-form-item .ant-form-item {
  padding: 0;
  box-shadow: #fff 0 0 0;
}
/* 强制设置单元行高度，避免高度坍缩 */
.taskSupervision >>> tr {
  height: 50px !important;
}
</style>