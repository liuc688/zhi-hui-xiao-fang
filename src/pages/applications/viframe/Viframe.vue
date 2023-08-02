<template>
	<iframe :id="`iframe_${id}`" :src="router" ></iframe>
</template>

<script>
export default {
	name: 'Viframe',
	props: {
		id: {
			type: String
		},
		router: {
			type: String
		},
		data: {
			//传递的数据
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	created() {
		console.log('this.router',this.router);
		
	}
};
</script>

<style></style>
