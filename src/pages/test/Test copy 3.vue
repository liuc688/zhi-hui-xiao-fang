<template>
  <div style="width: 90%; padding: 5%">
    <k-form-build :value="jsonData" ref="forms" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      jsonData: {
        list: [
          {
            type: 'rich-editor',
            label: '富文本编辑器',
            options: {
              defaultValue: null,
              disabled: false,
              width: '100%',
            },
            model: 'rich-editor_1668067523707',
            key: 'rich-editor_1668067523707',
            rules: [
              {
                required: false,
                message: '必填项',
              },
            ],
          },
        ],
        config: {
          layout: 'horizontal',
          labelCol: {
            xs: 4,
            sm: 4,
            md: 4,
            lg: 4,
            xl: 4,
            xxl: 4,
          },
          labelWidth: 100,
          labelLayout: 'flex',
          wrapperCol: {
            xs: 18,
            sm: 18,
            md: 18,
            lg: 18,
            xl: 18,
            xxl: 18,
          },
          hideRequiredMark: false,
          customStyle: '',
        },
      },
    };
  },
  methods: {},
};
</script>
