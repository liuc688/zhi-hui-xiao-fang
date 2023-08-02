<template>
    <div>
        <form>
            <form-item v-model="form.name">
                <input/>
            </form-item>
        </form>
    </div>
</template>
<script>
export default {
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    };
  },
  props: {
    layerid: {//自动注入的layerid
      type: String,
      default: ''
    },
    iframeData: {//传递的数据
      type: Object,
      default: () => {
        return {};
      }
    },
    lydata:{
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  methods: {
    onSubmit () {
      //更新父对象数据信息
      this.$parent.$data.iframeData = Object.assign({}, this.form);
      //或者
      this.lydata.iframeData = Object.assign(this.lydata.iframeData, this.form);

      this.$layer.msg('成功');
      this.$layer.close(this.layerid);
    },
    quxiao () {
      this.$layer.close(this.layerid);
    }
  },
  watch: {
    iframeData: {
      handler: function () {
        this.form = this.iframeData;
      },
      deep: true,
      immediate: true
    }
  }
};
</script>