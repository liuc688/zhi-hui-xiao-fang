<template>
  <div class="content">
    <div class="content_left">
      <div class="content_left_button">部门与账号</div>
    </div>
    <div class="content_right">
      <div class="content_right_list">
        <span style="font-size: 16px; color: rgb(103, 160, 199)">企业单位部门列表(双击节点可编辑部门信息)</span>
        <div class="content_right_listContent">
          <ul type="none" style="font-size: 16px">
            <li>
              <span style="height: 30px; width: 30px; background: #000; float: left; left: -25px; top: 20px; position: relative" @click="expand(index)"></span>
              <div
                style="
                  color: rgb(238, 249, 255);
                  margin-top: 15px;
                  background-color: rgb(9, 67, 109);
                  width: 220px;
                  height: 40px;
                  line-height: 40px;
                  float: left;
                  padding-left: 25px;
                  cursor: pointer;
                "
              >
                <img src="../img/setUp_zh.png" width="20px" height="20px" style="margin-right: 20px" />
                演示账号
              </div>
              <ul type="none" v-if="this.index" style="font-size: 16px; margin-top: 16px; color: rgb(150, 176, 191)">
                <li style="margin: 10px 0 0 60px; display: -webkit-inline-box; cursor: pointer">财务部</li>
                <li style="margin: 10px 0 0 60px; cursor: pointer">软件部</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div class="content_right_form">
        <div class="content_right_form_top">
          <button style="width: 120px; height: 100%; background-color: rgb(12, 81, 154); font-size: 14px; margin-right: 20px; border: none">
            <a-icon type="plus-circle" style="margin-right: 10px" />
            新增部门
          </button>
          <button style="width: 120px; height: 100%; background-color: rgb(12, 81, 154); font-size: 14px; border: none">
            <a-icon type="plus-circle" style="margin-right: 10px" />
            新增账号
          </button>
          <span style="font-size: 16px; margin-left: 20px; color: rgb(103, 160, 199)">(可直接在数据表格中编辑姓名、手机、邮箱)</span>
        </div>
        <div class="content_right_form_bottom">
          <div style="width: 100%; height: 40px; line-height: 40px; border: 1px solid rgb(8, 87, 143); text-align: center; font-size: 16px; margin-bottom: 10px">
            <span style="width: 15%; height: 40px; float: left">所属部门</span>
            <span style="width: 15%; height: 40px; float: left">账号</span>
            <span style="width: 10%; height: 40px; float: left">姓名</span>
            <span style="width: 20%; height: 40px; float: left">手机</span>
            <span style="width: 20%; height: 40px; float: left">邮箱</span>
            <span style="width: 20%; height: 40px; float: left">操作</span>
          </div>
          <div style="width: 100%; height: 40px; line-height: 40px; text-align: center; font-size: 16px; margin: 5px 0; background-color: rgb(0, 45, 78)">
            <span style="width: 15%; height: 40px; float: left">财务部</span>
            <span style="width: 15%; height: 40px; float: left">HBN9S5321</span>
            <span style="width: 10%; height: 40px; float: left">文化</span>
            <span style="width: 20%; height: 40px; float: left">13803214593</span>
            <span style="width: 20%; height: 40px; float: left">13803214593@163.com</span>
            <span style="width: 20%; height: 40px; float: left">
              <button style="background-color: rgb(59, 137, 233); margin-right: 10px; border-radius: 5px; border: none; height: 30px; line-height: 30px; width: 60px">设置</button>
              <button style="background-color: rgb(225, 156, 67); border-radius: 5px; border: none; height: 30px; line-height: 30px; width: 60px">删除</button>
            </span>
          </div>
          <div style="width: 100%; height: 40px; line-height: 40px; text-align: center; font-size: 16px; margin: 5px 0; background-color: rgb(0, 45, 78)">
            <span style="width: 15%; height: 40px; float: left">财务部</span>
            <span style="width: 15%; height: 40px; float: left">HBN9S5321</span>
            <span style="width: 10%; height: 40px; float: left">文化</span>
            <span style="width: 20%; height: 40px; float: left">13803214593</span>
            <span style="width: 20%; height: 40px; float: left">13803214593@163.com</span>
            <span style="width: 20%; height: 40px; float: left">
              <button style="background-color: rgb(59, 137, 233); margin-right: 10px; border-radius: 5px; border: none; height: 30px; line-height: 30px; width: 60px">设置</button>
              <button style="background-color: rgb(225, 156, 67); border-radius: 5px; border: none; height: 30px; line-height: 30px; width: 60px">删除</button>
            </span>
          </div>
          <div style="width: 100%; height: 40px; line-height: 40px; text-align: center; font-size: 16px; margin: 5px 0; background-color: rgb(0, 45, 78)">
            <span style="width: 15%; height: 40px; float: left">财务部</span>
            <span style="width: 15%; height: 40px; float: left">HBN9S5321</span>
            <span style="width: 10%; height: 40px; float: left">文化</span>
            <span style="width: 20%; height: 40px; float: left">13803214593</span>
            <span style="width: 20%; height: 40px; float: left">13803214593@163.com</span>
            <span style="width: 20%; height: 40px; float: left">
              <button style="background-color: rgb(59, 137, 233); margin-right: 10px; border-radius: 5px; border: none; height: 30px; line-height: 30px; width: 60px">设置</button>
              <button style="background-color: rgb(225, 156, 67); border-radius: 5px; border: none; height: 30px; line-height: 30px; width: 60px">删除</button>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      index: false,
      // data,
      // columns,
    };
  },
  methods: {
    expand(index) {
      this.index = !this.index;
    },
  },
};
</script>
<style lang="less">
.content {
  width: auto;
  height: 100%;
  margin: 10px 40px 30px 40px;

  .content_left {
    height: 100%;
    width: 20%;
    background-color: rgb(2, 34, 56);
    float: left;
    padding: 25px;

    .content_left_button {
      background-image: url(../img/setUp_bm.png);
      width: 240px;
      height: 50px;
      line-height: 40px;
      font-size: 16px;
      padding: 5px 20px;
      cursor: pointer;
      color: rgb(238, 249, 255);
    }
  }

  .content_right {
    height: 100%;
    width: 79%;
    background-color: rgb(2, 34, 56);
    float: right;
    padding: 25px;

    .content_right_list {
      height: 100%;
      width: 25%;
      float: left;
      border-right: dashed 1px rgb(56, 102, 133);

      .content_right_listContent {
        width: 100%;
        height: 500px;
      }
    }

    .content_right_form {
      width: 75%;
      height: auto;
      float: right;
      padding-left: 20px;

      .content_right_form_top {
        width: 100%;
        height: 40px;
      }

      .content_right_form_bottom {
        margin-top: 20px;
      }
    }
  }
}
</style>
