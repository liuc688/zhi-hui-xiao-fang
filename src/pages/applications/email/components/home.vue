<template>
  <!-- loading 是最外侧的蒙层 -->
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false"  class="mailboxHome" :loading = "loadings">
    <a-tabs :activeKey="card" type="card" tab-position="left" @change="callback" :loading = "loading">
    <!-- <a-tabs :activeKey="card" tab-position="left" @change="callback"> -->
      <!-- 待处理邮件部分 -->
      <a-tab-pane key="1" tab="待处理邮件" v-if="hideOrShow" :disabled = "loading">
        <div style="min-height: 600px">
          <a-form-model
          layout="horizontal"
          :model="searchform"
          ref="searchform"
          >
            <a-row :gutter="24">
              <a-col :md="8" :sm="24">
                <a-form-model-item
                label="编码"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-input
                  v-model="searchform.select"
                  placeholder="请输入"
                  allowClear
                  />
                </a-form-model-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-model-item
                label="时间范围"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-select
                  placeholder="请选择"
                  v-model="searchform.scope"
                  allowClear
                  >
                    <a-select-option
                    v-for="(item, key) in dynamicData.scope"
                    :key="key"
                    :value="key"
                    >
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <template v-if="advanced">
                <a-col :md="8" :sm="24">
                  <a-form-model-item
                  label="指定日期"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                  format="YYYY-MM-DD"
                  >
                    <a-range-picker
                    style="width: 100%"
                    v-model="searchform.rangedata"
                    @change="onTimerRangeChange"
                    allowClear
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-model-item
                  label="信件类型"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                  >
                    <a-select
                    placeholder="请选择"
                    v-model="searchform.type"
                    allowClear
                    >
                      <a-select-option
                      v-for="(item, key) in dynamicData.type"
                      :key="key"
                      :value="key"
                      >
                        {{ item }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-model-item
                  label="是否公开"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                  >
                    <a-select
                    v-model="searchform.isPublic"
                    placeholder="请选择"
                    allowClear
                    >
                      <a-select-option value="1">公开</a-select-option>
                      <a-select-option value="2">不公开</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
              </template>
              <a-col :md="6" :sm="24" :offset="2">
                <span style=" float: left;margin-top: 3px;display: block;margin-bottom: 24px;white-space: nowrap;">
                  <a-button
                  type="primary"
                  :loading="loadingsearch"
                  @click="onSearch"
                  >
                    查询
                  </a-button>
                  <a-button
                  style="margin-left: 8px"
                  @click="resetForm()"
                  :loading="loadingreset"
                  >
                    重置
                  </a-button>
                  <a @click="toggleAdvanced" style="margin-left: 8px">
                    {{ advanced ? "收起" : "展开" }} <a-icon :type="advanced ? 'up' : 'down'" />
                  </a>
                </span>
              </a-col>
            </a-row>
          </a-form-model>
          <div class="alert">
            <a-alert type="info" :show-icon="true">
              <div class="message" slot="message">
                已选择&nbsp; <a>{{ selectedRowKeys.length }}</a> &nbsp;项
                <a class="clear" @click="onSelectClear" v-if="this.selectedRowKeys.length > 0">
                清空
                </a>
              </div>
            </a-alert>
          </div>
          <!-- 表格 -->
          <a-table
            ref="table"
            bordered
            class="table_content"
            size="middle"
            rowKey="id"
            :loading="loading"
            :pagination="false"
            :columns="columns"
            :dataSource="dataSource.items"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
          >
            <span slot="titles" slot-scope="text, record">
              <a @click="toform(record)" style="color: #00aaf0"> {{ text }}</a>
            </span>
            <span slot="public" slot-scope="text, record">
              <!-- {{ record.public ? "公开" : "不公开" }} -->
              <span v-if="record.public">
                <a-tag color="#1f9246">公开</a-tag>
              </span>
              <span v-else>
                <a-tag color="#ff8877">不公开</a-tag>
              </span>
            </span>
            <span slot="relation" slot-scope="text, record">
              {{ record.relation ? "是" : "否" }}
            </span>
            <!-- 类型字段插槽（样式自定义） -->
            <span slot="type" slot-scope="text, record">
              <!-- 动态的给 a-tag 配置颜色 -->
              <a-tag :color='colorList[record.type]'>{{ type[record.type].name }}</a-tag>
            </span>
            <span slot="action" slot-scope="text, record">
              <a @click="toform(record)" style="color: #00aaf0">查看</a>
            </span>
          </a-table>
          <a-pagination
          size="small"
          style="text-align: right"
          @change="changepage"
          :current="pagination.page"
          :pageSize="pagination.per_page"
          @showSizeChange="changepage"
          :pageSizeOptions="pageSizeOptions"
          :total="dataSource.total"
          show-size-changer
          show-quick-jumper
          :show-total="(total) => `共 ${total} 条`"
          >
          </a-pagination>
        </div>
      </a-tab-pane>
      <!-- 待回复邮件部分 -->
      <a-tab-pane key="2" tab="待回复邮件" :disabled = "loading">
        <div style="min-height: 600px">
          <a-form-model
            layout="horizontal"
            :model="searchform"
            ref="searchform"
          >
            <a-row :gutter="24">
              <a-col :md="8" :sm="24">
                <a-form-model-item
                  label="接收部门"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-tree-select
                    style="width: 100%"
                    show-search
                    allow-clear
                    v-model="searchform.organization"
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                    :treeData="organizations"
                    @change="handleChange"
                    placeholder="请选择搜索站点"
                    :replaceFields="{
                      title: 'title',
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
                    slot-scope="{ key, value }"
                    style="color: #08c"
                    >
                      Child Node1 {{ value }}
                    </span>
                  </a-tree-select>
                </a-form-model-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-model-item
                  label="编码"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-input
                    v-model="searchform.select"
                    placeholder="请输入"
                    allowClear
                  />
                </a-form-model-item>
              </a-col>
              <template v-if="advanced">
                <a-col :md="8" :sm="24">
                  <a-form-model-item
                    label="时间范围"
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 18, offset: 1 }"
                  >
                    <a-select
                      placeholder="请选择"
                      v-model="searchform.scope"
                      allowClear
                    >
                      <a-select-option
                        v-for="(item, key) in dynamicData.scope"
                        :key="key"
                        :value="key"
                        >{{ item }}</a-select-option
                      >
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-model-item
                    label="指定日期"
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 18, offset: 1 }"
                    format="YYYY-MM-DD"
                  >
                    <a-range-picker
                      style="width: 100%"
                      v-model="searchform.rangedata"
                      @change="onTimerRangeChange"
                      allowClear
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-model-item
                    label="信件类型"
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 18, offset: 1 }"
                  >
                    <a-select
                      placeholder="请选择"
                      v-model="searchform.type"
                      allowClear
                    >
                      <a-select-option
                        v-for="(item, key) in dynamicData.type"
                        :key="key"
                        :value="key"
                        >{{ item }}</a-select-option
                      >
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-model-item
                    label="是否公开"
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 18, offset: 1 }"
                  >
                    <a-select
                      v-model="searchform.isPublic"
                      placeholder="请选择"
                      allowClear
                    >
                      <a-select-option value="1">公开</a-select-option>
                      <a-select-option value="2">不公开</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                
              </template>
              <a-col :md="6" :sm="24" :offset="2">
                <span
                  style="
                    float: left;
                    margin-top: 3px;
                    display: block;
                    margin-bottom: 24px;
                    white-space: nowrap;
                  "
                >
                  <a-button
                    type="primary"
                    :loading="loadingsearch"
                    @click="onSearch"
                    >查询</a-button
                  >
                  <a-button
                    style="margin-left: 8px"
                    @click="resetForm()"
                    :loading="loadingreset"
                    >重置</a-button
                  >
                  <a @click="toggleAdvanced" style="margin-left: 8px">
                    {{ advanced ? "收起" : "展开" }}
                    <a-icon :type="advanced ? 'up' : 'down'" />
                  </a>
                </span>
              </a-col>
            </a-row>
          </a-form-model>
          <div class="alert">
            <a-alert type="info" :show-icon="true">
              <div class="message" slot="message">
                已选择&nbsp;
                <a>{{ selectedRowKeys.length }}</a>&nbsp;项
                <a class="clear" @click="onSelectClear" v-if="this.selectedRowKeys.length > 0">清空</a>
                <!-- <a-divider type="vertical" />
                <a @click="deleteDraft" v-if="this.selectedRowKeys.length > 0"
                  >删除</a
                > -->
              </div>
            </a-alert>
          </div>
          <!-- 表格 -->
          <a-table
            ref="table"
            bordered
            :loading="loading"
            class="table_content"
            size="middle"
            rowKey="id"
            :pagination="false"
            :columns="columns"
            :dataSource="dataSource.items"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
          >
            <span slot="public" slot-scope="text, record">
              <!-- {{ record.public ? "公开" : "不公开" }} -->
              <span v-if="record.public">
                <a-tag color="#1f9246">公开</a-tag>
              </span>
              <span v-else>
                <a-tag color="#ff8877">不公开</a-tag>
              </span>
            </span>
            <span slot="relation" slot-scope="text, record">
              {{ record.relation ? "是" : "否" }}
            </span>
            <span slot="type" slot-scope="text, record">
              <!-- 动态的给 a-tag 配置颜色 -->
              <a-tag :color='colorList[record.type]'>{{ type[record.type].name }}</a-tag>
            </span>
            <span slot="titles" slot-scope="text, record">
              <a @click="toform(record)" style="color: #00aaf0"> {{ text }}</a>
            </span>
            <span slot="action" slot-scope="text, record">
              <a @click="toform(record)" style="color: #00aaf0">查看</a>
            </span>
          </a-table>
          <a-pagination
            size="small"
            style="text-align: right"
            @change="changepage"
            :current="pagination.page"
            :pageSize="pagination.per_page"
            @showSizeChange="changepage"
            :pageSizeOptions="pageSizeOptions"
            :total="dataSource.total"
            show-size-changer
            show-quick-jumper
            :show-total="(total) => `共 ${total} 条`"
          ></a-pagination>
        </div>
      </a-tab-pane>
      <!-- 已回复邮件部分 -->
      <a-tab-pane key="3" tab="已回复邮件" :disabled = "loading">
        <div style="min-height: 600px">
          <a-form-model
            layout="horizontal"
            :model="searchform"
            ref="searchform"
          >
            <a-row :gutter="24">
              <a-col :md="8" :sm="24">
                <a-form-model-item
                  label="接收部门"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-tree-select
                    style="width: 100%"
                    show-search
                    allow-clear
                    v-model="searchform.organization"
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                    :treeData="organizations"
                    placeholder="请选择搜索站点"
                    :replaceFields="{
                      title: 'title',
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
                      slot-scope="{ key, value }"
                      style="color: #08c"
                      >Child Node1 {{ value }}</span
                    >
                  </a-tree-select>
                </a-form-model-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-model-item
                  label="编码"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-input
                    v-model="searchform.select"
                    placeholder="请输入"
                    allowClear
                  />
                </a-form-model-item>
              </a-col>
              
              <template v-if="advanced">
                <a-col :md="8" :sm="24">
                  <a-form-model-item
                    label="时间范围"
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 18, offset: 1 }"
                  >
                    <a-select
                      placeholder="请选择"
                      v-model="searchform.scope"
                      allowClear
                    >
                      <a-select-option
                        v-for="(item, key) in dynamicData.scope"
                        :key="key"
                        :value="key"
                        >{{ item }}</a-select-option
                      >
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-model-item
                    label="指定日期"
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 18, offset: 1 }"
                    format="YYYY-MM-DD"
                  >
                    <a-range-picker
                      style="width: 100%"
                      v-model="searchform.rangedata"
                      @change="onTimerRangeChange"
                      allowClear
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-model-item
                    label="信件类型"
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 18, offset: 1 }"
                  >
                    <a-select
                      placeholder="请选择"
                      v-model="searchform.type"
                      allowClear
                    >
                      <a-select-option
                        v-for="(item, key) in dynamicData.type"
                        :key="key"
                        :value="key"
                        >{{ item }}</a-select-option
                      >
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-model-item
                    label="是否公开"
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 18, offset: 1 }"
                  >
                    <a-select
                      v-model="searchform.isPublic"
                      placeholder="请选择"
                      allowClear
                    >
                      <a-select-option value="1">公开</a-select-option>
                      <a-select-option value="2">不公开</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                
              </template>
              <a-col :md="6" :sm="24" :offset="2">
                <span
                  style="
                    float: left;
                    margin-top: 3px;
                    display: block;
                    margin-bottom: 24px;
                    white-space: nowrap;
                  "
                >
                  <a-button
                    type="primary"
                    :loading="loadingsearch"
                    @click="onSearch"
                    >查询</a-button
                  >
                  <a-button
                    style="margin-left: 8px"
                    @click="resetForm()"
                    :loading="loadingreset"
                    >重置</a-button
                  >
                  <a @click="toggleAdvanced" style="margin-left: 8px">
                    {{ advanced ? "收起" : "展开" }}
                    <a-icon :type="advanced ? 'up' : 'down'" />
                  </a>
                </span>
              </a-col>
            </a-row>
          </a-form-model>
          <div class="alert">
            <a-alert type="info" :show-icon="true">
              <div class="message" slot="message">
                已选择&nbsp;
                <a>{{ selectedRowKeys.length }}</a> &nbsp;项
                <a class="clear" @click="onSelectClear" v-if="this.selectedRowKeys.length > 0">清空</a>
              </div>
            </a-alert>
          </div>
          <!-- 表格 -->
          <a-table
            ref="table"
            bordered
            :loading="loading"
            class="table_content"
            size="middle"
            rowKey="id"
            :pagination="false"
            :columns="columns"
            :dataSource="dataSource.items"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
          >
            <span slot="public" slot-scope="text, record">
              <!-- {{ record.public ? "公开" : "不公开" }} -->
              <span v-if="record.public">
                <a-tag color="#1f9246">公开</a-tag>
              </span>
              <span v-else>
                <a-tag color="#ff8877">不公开</a-tag>
              </span>
            </span>
            <span slot="relation" slot-scope="text, record">
              {{ record.relation ? "是" : "否" }}
            </span>
            <span slot="type" slot-scope="text, record">
              <!-- 动态的给 a-tag 配置颜色 -->
              <a-tag :color='colorList[record.type]'>{{ type[record.type].name }}</a-tag>
            </span>
            <span slot="titles" slot-scope="text, record">
              <a @click="toform(record)" style="color: #00aaf0"> {{ text }}</a>
            </span>
            <span slot="action" slot-scope="text, record">
              <a @click="toform(record)" style="color: #00aaf0">查看</a>
            </span>
          </a-table>
          <a-pagination
            size="small"
            style="text-align: right"
            @change="changepage"
            :current="pagination.page" 
            :pageSize="pagination.per_page"
            @showSizeChange="changepage"
            :pageSizeOptions="pageSizeOptions"
            :total="dataSource.total"
            show-size-changer
            show-quick-jumper
            :show-total="(total) => `共 ${total} 条`"
          ></a-pagination>
        </div>
      </a-tab-pane>
      <!-- 不予处理邮件部分 -->
      <a-tab-pane key="4" tab="不予处理邮件" :disabled = "loading">
        <div style="min-height: 600px">
          <a-form-model
            layout="horizontal"
            :model="searchform"
            ref="searchform"
          >
            <a-row :gutter="24">
              <a-col :md="8" :sm="24">
                <a-form-model-item
                  label="编码"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-input
                    v-model="searchform.select"
                    placeholder="请输入"
                    allowClear
                  />
                </a-form-model-item>
              </a-col>
              <a-col :md="8" :sm="24">
                  <a-form-model-item
                  label="时间范围"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                  >
                    <a-select
                    placeholder="请选择"
                    v-model="searchform.scope"
                    allowClear
                    >
                      <a-select-option
                      v-for="(item, key) in dynamicData.scope"
                      :key="key"
                      :value="key"
                      >
                        {{ item }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
              <template v-if="advanced">
                <a-col :md="8" :sm="24">
                  <a-form-model-item
                    label="指定日期"
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 18, offset: 1 }"
                    format="YYYY-MM-DD"
                  >
                    <a-range-picker
                      style="width: 100%"
                      v-model="searchform.rangedata"
                      @change="onTimerRangeChange"
                      allowClear
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-model-item
                    label="信件类型"
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 18, offset: 1 }"
                  >
                    <a-select
                      placeholder="请选择"
                      v-model="searchform.type"
                      allowClear
                    >
                      <a-select-option
                        v-for="(item, key) in dynamicData.type"
                        :key="key"
                        :value="key"
                        >{{ item }}</a-select-option
                      >
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-model-item
                    label="是否公开"
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 18, offset: 1 }"
                  >
                    <a-select
                      v-model="searchform.isPublic"
                      placeholder="请选择"
                      allowClear
                    >
                      <a-select-option value="1">公开</a-select-option>
                      <a-select-option value="2">不公开</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
              </template>
              <a-col :md="6" :sm="24" :offset="2">
                <span style=" float: left; margin-top: 3px; display: block; margin-bottom: 24px; white-space: nowrap;">
                  <a-button
                    type="primary"
                    :loading="loadingsearch"
                    @click="onSearch"
                    >查询</a-button
                  >
                  <a-button
                    style="margin-left: 8px"
                    @click="resetForm()"
                    :loading="loadingreset"
                    >重置</a-button
                  >
                  <a @click="toggleAdvanced" style="margin-left: 8px">
                    {{ advanced ? "收起" : "展开" }}
                    <a-icon :type="advanced ? 'up' : 'down'" />
                  </a>
                </span>
              </a-col>
            </a-row>
          </a-form-model>
          <div class="alert">
            <a-alert type="info" :show-icon="true">
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
          <!-- 表格 -->
          <a-table
            ref="table"
            bordered
            :loading="loading"
            class="table_content"
            size="middle"
            rowKey="id"
            :pagination="false"
            :columns="columns"
            :dataSource="dataSource.items"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
          >
            <span slot="public" slot-scope="text, record">
              <!-- {{ record.public ? "公开" : "不公开" }} -->
              <span v-if="record.public">
                <a-tag color="#1f9246">公开</a-tag>
              </span>
              <span v-else>
                <a-tag color="#ff8877">不公开</a-tag>
              </span>
            </span>
            <span slot="relation" slot-scope="text, record">
              {{ record.relation ? "是" : "否" }}
            </span>
            <span slot="type" slot-scope="text, record">
              <!-- 动态的给 a-tag 配置颜色 -->
              <a-tag :color='colorList[record.type]'>{{ type[record.type].name }}</a-tag>
            </span>
            <span slot="titles" slot-scope="text, record">
              <a @click="toform(record)" style="color: #00aaf0"> {{ text }}</a>
            </span>
            <!-- 接收部门的插槽（样式自定义） -->
            
            <!-- <span slot="organizationTitle" slot-scope="text, record">
              <span v-if="text">{{text}}</span>
              <span v-else>无</span>
            </span> -->
            <span slot="action" slot-scope="text, record">
              <a @click="toform(record)" style="color: #00aaf0">查看</a>
            </span>

          </a-table>
          <a-pagination
            size="small"
            style="text-align: right"
            @change="changepage"
            :current="pagination.page"
            :pageSize="pagination.per_page"
            @showSizeChange="changepage"
            :pageSizeOptions="pageSizeOptions"
            :total="dataSource.total"
            show-size-changer
            show-quick-jumper
            :show-total="(total) => `共 ${total} 条`"
          ></a-pagination>
        </div>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import {
/*email_site_list,*/ 
email_paginate,
email_forwards_get  // 信箱转发权限验证
} from "@/services/email";
import { organization_tree } from "@/services/organization";
import { center } from '@antv/g2plot/lib/plots/sankey/sankey';
export default {
  props: {
    params: {
      //传递的数据
      type: Object,
    },
    event: {
      type: Function,
    },
  },
  data() {
    return {
      activekey: "",
      searchform: {
        organization:""
      },
      organizations: {},
      advanced: false,
      card: "1",
      dataSource: {},
      loading: true,  // 当我们切换标签栏的时候，数据没有刷新回来时，会出现一个等待页面
      loadings: true,
      loadingsearch: false,
      loadingreset: false,
      confirmLoading: false,
      replyLoading: false,
      type: {
        1: { name: "建议" },
        2: { name: "表扬" },
        3: { name: "咨询" },
        4: { name: "投诉" },
      },
      columns: [
        {
          title: "编码",
          dataIndex: "select",
          width: 50,
          align: "center",
          scopedSlots: { customRender: "select" },
        },
        {
          title: "信件标题",
          dataIndex: "title",
          ellipsis: true,
          width: 120,
          align: "center",
          scopedSlots: { customRender: "titles" },
        },
        {
          title: "信件内容",
          dataIndex: "content",
          ellipsis: true,
          width: 120,
          align: "center",
          scopedSlots: { customRender: "content" },
        },
        {
          title: "信件类型",
          dataIndex: "type",
          align: "center",
          width: 90,
          scopedSlots: { customRender: "type" },
        },
        {
          title: "发件人姓名",
          dataIndex: "contact.name",
          align: "center",
          width: 70,
          ellipsis: true,
          scopedSlots: { customRender: "name" },
        },
        {
          title: "发件人电话",
          dataIndex: "contact.mobile",
          align: "center",
          width: 100,
          ellipsis: true,
          scopedSlots: { customRender: "mobile" },
        },
        {
          title: "是否公开",
          dataIndex: "public",
          align: "center",
          width: 80,
          scopedSlots: { customRender: "public" },
        },
        {
          title: "是否接受部门联系",
          dataIndex: "relation",
          align: "center",
          width: 120,
          scopedSlots: { customRender: "relation" },
        },
        {
          title: "接收部门",
          dataIndex: "organization.title",
          align: "center",
          width: 80,
          ellipsis:true,
          scopedSlots: { customRender: "organizationTitle" },
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          width: 100,
          scopedSlots: { customRender: "action" },
        },
      ],
      selectedRowKeys: [],
      total: 1,
      pageSizeOptions: ["10", "20", "30", "40"],
      forward: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      form: {},
      replyform: {},
      transpondId: "",
      replyId: "",
      hideOrShow:false,  // 待处理邮件部分是否显示
      indax:1,
      colorList:['#f50','#2db7f5','#87d068','#108ee9','#C66584','#ff00ff','#ff8877','#1f9246','#4511bf','#bf1145'],
      listColor:['#ff8877','#1f9246','#4511bf','#bf1145'],
    };
  },
  computed: {
    pagination: {
      get() {
        return {
          page: this.dataSource.page || 1,
          per_page: this.dataSource.per_page || 10,
        };
      },
      set(val) {
        this.dataSource.page = val.page;
        this.dataSource.per_page = val.per_page;
      },
    },
    dynamicData() {
      let result = {
        scope: {
          1: "今天",
          2: "本周",
          3: "上周",
          4: "本月",
          5: "上月",
        },
        type: {
          1: "建议",
          2: "表扬",
          3: "咨询",
          4: "投诉",
        },
      };
      return result;
    },
  },
  created() {
    this.card = this.searchform.status = this.params.searchform ? this.params.searchform.status == "6" ? "4" : this.params.searchform.status : this.card;
    // this.card = '2';
    this.searchform = this.params.searchform ? this.params.searchform : this.searchform;
    // console.log('this.params01',this.params)
    this.indax = this.params&&this.params.indax?this.params.indax:this.indax;
    this.init();
  },
  methods: {
    init() {
      organization_tree()
        .then((res) => {
          console.log('organization_tree',res)
          console.log("this.indaxs",this.indaxs);
          // this.searchform.organization = res.data.data[0].id; 表示接收部门默认是第一个值
          this.searchform.organization = res.data.data[0].id;
          this.organizations = res.data.data;
          console.log('searchform.organization',this.searchform)
          this.loadDataSrouce();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleOk() {},
    //查看
    toform(record) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "email-details",
          params: {
            data: record,
            searchform: Object.assign(this.searchform),
            indax:this.indax,
          },
        },
      });
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    onSearch() {
      this.loading = true;
      this.loadingsearch = true;
      this.searchform.page = 1;
      this.searchform.per_page = 10;
      this.loadDataSrouce();
    },
    loadDataSrouce() {
      Promise.all([
        email_forwards_get(),  // 信箱转发权限验证
        email_paginate(this.searchform)
      ])
      .then((res) => {
        console.log('res',res)
        /* 
        res[0].data.data.forwards 是一个布尔类型的值，
        如果为 true，表示当前账号有信箱转发的权限，所以可以显示待处理邮件（第一部分）
        如果为 false，表示当前账号无信箱转发的权限，所以不会显示待处理邮件（也就是第一部分）
        */
        this.hideOrShow = res[0].data.data.forwards;
        /*
        若 this.hideOrShow 为 false（也就是说没有转发权限，相应的，如果为 true，表示有转发权限）
        并且 indax 为 1（执行完一次后 indax 的值就不为 1 了，所以说这里的目的是让 this.card 等于 2 只执行一次，
        this.searchform.status = "2"; 这句代码也只是执行一次（也就是说 if 块中的代码都执行一次），
        如果我们执行完 this.searchform.status = "2";this.searchform.new = false; 代码，表示我们修改了分页接口需要的参数，
        所以我们要执行分页方法 this.loadDataSrouce(); 这里会引发一个新的问题，那就是页面蒙层什么时候失效，
        因为我们会在 if 块中再一次执行分页方法，所以蒙层不能在 if 块中失效，而是在 else 块中失效（蒙层失效代码：this.loadings = false;） ）
        */ 
        if(!this.hideOrShow && this.indax == 1) {
          this.card = '2';
          this.searchform.status = "2";
          this.searchform.new = false;  // 未受理
          this.indax++;
          this.loadDataSrouce();
          this.loadingsearch = false;
          this.loadingreset = false;
        } else {
          this.dataSource = res[1].data.data;
          this.loading = false;
          this.loadings = false;
          this.loadingsearch = false;
          this.loadingreset = false;
        }
      })
      .catch((error) => {
        console.log("erroe", error);
        this.loadings = false;
        this.loading = false;
        if(!this.hideOrShow && this.indax == 1) {
          this.card = '2';
          this.searchform.status = "2";
          this.searchform.new = false;  // 未受理
          this.indax++;
        }
      });
    },
    // 接收部门选择时执行的回调函数
    handleChange(e){
      console.log("---------",e)
      console.log('this.searchform',this.searchform)
    },
    onTimerRangeChange(data, strdate) {
      if (strdate && strdate.length) {
        this.searchform.start = strdate[0];
        this.searchform.end = strdate[1];
      } else {
        this.searchform.start = undefined;
        this.searchform.end = undefined;
      }
    },
    // 删除 信件
    deleteDraft() {
    },
    // 分页
    changepage(page, pageSize) {
      this.searchform.page = page;
      this.searchform.per_page = pageSize;
      this.loadDataSrouce();
    },
    onSelectClear() {
      this.selectedRowKeys = [];
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 重置按钮
    resetForm() {
      this.searchform = {};
      var key = this.card;
      if (key == 2) {
        this.searchform.status = "2";
        this.searchform.new = false;
      } else if (key == 3) {
        this.searchform.status = "3";
        this.searchform.new = false;
      } else if (key == 4) {
        this.searchform.status = "6";
        this.searchform.new = undefined;
      } else if (key == 1) {
        this.searchform.status = "1";
        this.searchform.new = undefined;
      }
      this.loading = true;
      this.loadingreset = true;
      this.loadDataSrouce();
    },
    // 标签栏的切换
    callback(key) {
      console.log('标签栏的切换',key);
      this.loading = true;
      this.card = key;
      this.advanced = false;
      // 这里的 organization 表示接收部门字段，它默认的永远是山东尚可网络科技有限公司部门
      this.searchform = {
        organization: this.searchform.organization
      };
      this.selectedRowKeys = [];
      if (key == 2) {
        this.searchform.status = "2";
        this.searchform.new = false;
        console.log('this.searchform',this.searchform)
      } else if (key == 3) {
        this.searchform.status = "3";
        this.searchform.new = false;
      } else if (key == 4) {
        this.searchform.status = "6";
        this.searchform.new = undefined;
      } else if (key == 1) {
        this.searchform.status = "1";
        this.searchform.new = undefined;
      }
      this.loadDataSrouce();
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.indexOf(input) >= 0;
    },
  },
};
</script>
<style >
.ant-table table {
  border-collapse: collapse;
  border-spacing: 0;
}
.ant-table-thead > tr > th,
.ant-table-tbody > tr > td {
  border-left: 1px solid #f0f0f0;
  border-top: 1px solid #f0f0f0;
}
</style>
<style scoped>
.table_content {
  margin: 20px 0;
}
.clear {
  float: right;
}
/* 样式穿透，ant-tag 标签的 margin 值设置为 0 */
.table_content >>> .ant-tag {
  margin: 0 !important;
}
</style>
<style scoped>
.mailboxHome >>> .ant-tabs-tab-active {
  /* background: deeppink !important; */
  background: #1890ff !important;
  color: #fff !important;
  /* font-weight: 600; */
  font-size: 16px;
}
.mailboxHome >>> .ant-tabs-tab {
  text-align: center;
  width: 131px !important;
}
</style>