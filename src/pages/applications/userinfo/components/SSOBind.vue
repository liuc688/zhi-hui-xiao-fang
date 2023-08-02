<template>
    <iframe :id="`iframe_${layerid}`" :src="lydata.router"></iframe>
</template>

<script>
export default {
  name: "Viframe",
  props: {
    layerid: {
      type: String,
    },
    lydata: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  created() {
  },
};
</script>

<style></style>
