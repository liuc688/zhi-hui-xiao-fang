<template>
  <div style="background: #f1f1f1">
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-row style="padding: 10px 0px">
        <a-col :span="12" style="text-align: left">
          <a-button type="primary" @click="partedit()">
            <a-icon type="plus" />
            <span>创建部门</span>
          </a-button>
        </a-col>
      </a-row>
      <!-- 表格 -->
      <a-table
        :columns="columns"
        :data-source="dataSource"
        class="components-table-demo-nested"
      >
        <div slot="action" slot-scope="text, record, index">
          <a @click="partedit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="staffedits(index, record)">增编人员</a>
        </div>
        <div slot="name" slot-scope="text">
          <span style="font-size: 16px; font-weight: 800">{{ text }}</span>
        </div>
        <a-table
          slot="expandedRowRender"
          slot-scope="record"
          :columns="innerColumns"
          :data-source="record.workers"
          :pagination="false"
        >
          <span slot="actions" slot-scope="text, records, index">
            <a-popconfirm
              title="您确定要将此人移除此部门?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="workerremoves(record, records)"
              @cancel="() => {}"
            >
              <a>删除</a>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a @click="staffedits(index, record, records)">编辑</a>
          </span>
        </a-table>
      </a-table>
    </a-card>
    <!-- 部门增编 -->
    <a-modal
      title="部门增编"
      width="80%"
      :confirm-loading="subloading"
      :visible="departedit"
      @ok="orderactionSubmit()"
      @cancel="
        () => {
          departedit = false;
          this.$refs.partforms.reset();
        }
      "
    >
      <k-form-build :value="departData" ref="partforms" />
    </a-modal>
    <a-modal
      title="增编人员"
      width="50%"
      :confirm-loading="subloading"
      :visible="staffedit"
      @ok="staffsubmit()"
      @cancel="
        () => {
          staffedit = false;
          this.$refs.staffforms.reset();
        }
      "
    >
      <k-form-build
        :value="staffData"
        ref="staffforms"
        :dynamicData="dynamicData"
      />
    </a-modal>
  </div>
</template>
<script>
import {
  departmentlis,
  workerlis,
  departinser,
  workerinsert,
  workerremove,
  organization_add,
  // site
} from "@/services/order";
import { getform } from "@/services/order";
export default {
  data() {
    return {
      dataSource: [], //部门列表
      stafflist: [], //员工列表
      subloading: false,
      departedit: false,
      staffedit: false, //增编人员
      // 一级表单
      columns: [
        {
          title: "部门名称",
          dataIndex: "name",
          scopedSlots: { customRender: "name" },
        },
        {
          title: "创建时间",
          dataIndex: "_createtime",
          scopedSlots: { customRender: "_createtime" },
        },
        {
          title: "部门操作",
          dataIndex: "action",
          width: 200,
          scopedSlots: { customRender: "action" },
        },
      ],
      // 二级表单
      innerColumns: [
        {
          title: "人员名称",
          dataIndex: "nickname",
          scopedSlots: { customRender: "nickname" },
        },
        {
          title: "人员操作",
          dataIndex: "actions",
          width: 200,
          scopedSlots: { customRender: "actions" },
        },
      ],
      departData: {}, //部门增编表单
      staffData: {}, //增编人员表单
      departId: "",
      departid: "",
      starffid: "",
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    };
  },
  computed: {
    dynamicData() {
      let result = {
        stafflist: [],
      };
      for (let item in this.stafflist) {
        result.stafflist.push({
          key: this.stafflist[item].id,
          label: this.stafflist[item].nickname,
        });
      }
      return result;
    },
  },
  created() {
    this.list();
  },
  methods: {
    // 页面获取
    list() {
      departmentlis()
        .then((res) => {
          this.dataSource = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
      // 员工列表
      workerlis()
        .then((res) => {
          this.stafflist = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });

      getform({
        name: "departedit",
      })
        .then((res) => {
          this.departData = res.data.data.form;
        })
        .catch((err) => {
          console.log(err);
        });
      getform({
        name: "add_comments",
      })
        .then((res) => {
          this.document_logo = res.data.data.form;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 人员裁员
    workerremoves(record, records) {
      workerremove({
        department: record.id,
        worker: records.id,
      })
        .then(() => {
          this.$message.success("操作成功！");
          this.list();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //增编人员
    staffedits(index, record, records) {
      this.staffedit = true;
      if (records) {
        this.$nextTick(() => {
          this.$refs.staffforms.setData({
            worker: records.id,
            forward: records._extension.forward,
            index: index,
          });
        });

        this.starffid = records.id;
        this.departid = record.id;
      } else {
        this.departid = record.id;
        this.starffid = "";
      }
    },
    // 增编人员提交
    staffsubmit() {
      this.$refs.staffforms.getData().then((res) => {
        var parems = {
          department: this.departid,
          worker: res.worker,
          index: res.index,
          forward: res.forward,
          id: this.starffid,
        };
        workerinsert(parems)
          .then(() => {
            this.staffedit = false;
            this.$refs.staffforms.reset();
            this.$message.success("操作成功");
            this.list();
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    // 部门编辑
    partedit(record) {
      this.departedit = true;
      if (record) {
        this.departId = record.id;
        this.methods = departinser;
        this.$nextTick(() => {
          this.$refs.partforms.setData({
            name: record.name,
          });
        });
      } else {
        this.departId = "";
        this.methods =organization_add;
      }
    },
    //部门提交
    orderactionSubmit() {
      this.$refs.partforms
        .getData()
        .then((res) => {
          this.subloading = true;
          this.methods({
            title: res.name,
            name: res.name,
            parent: this.departId,
          })
            .then(() => {
              this.subloading = false;
              this.departedit = false;
              this.$message.success("创建成功!");
              this.list();
            })
            .catch((err) => {
              this.subloading = false;
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
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
  border-right: 1px solid #f0f0f0;
}
.ant-table-thead > tr > th,
.ant-table-tbody > tr > td {
  padding: 16px 16px;
}
</style>
<style scoped>
.alert {
  margin-bottom: 16px;
}
.alert .message a {
  font-weight: 600;
}
.alert .clear {
  float: right;
}
.table_content {
  margin: 20px 0;
}
.demo-loading {
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
}
</style>