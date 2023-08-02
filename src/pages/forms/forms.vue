<template>
	<div><a @click="onClick">{{$route.path}}</a></div>
</template>

<script>
	import { mapState } from 'vuex';
export default {
	name: 'forms',
	components: {},
	data() {
		return {
		};
	},

	created() {
		console.log("created");
	},
	computed: {
		...mapState('applications', ['menu','tabs','active'])
	},
	methods: {
		onClick() {
			const path = '/forms/list'
			this.$router.push({
				path: path
			});
			
			const route = this.$router.getRoutes().find(item=>item.path === path)
			this.$store.commit('applications/setActive', route.path);
			this.$store.commit('applications/setTabs', {
				path:route.path,
				name:route.name
			});
			
		}
	}
};
</script>

<style></style>
