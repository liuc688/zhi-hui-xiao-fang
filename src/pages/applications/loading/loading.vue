<template>
	<common-layout>
		<div class="top">
			<div class="header">
				<img alt="logo" class="logo" src="@/assets/images/logo.png" />
				<!-- <span class="title">尚可集约化信息管理系统v3.1.1</span> -->
				<span class="title">{{VUE_APP_NAME}}</span>
			</div>
			<!-- <div class="desc">尚可集约化信息管理系统v3.1.1是山东尚可网络科技有限公司2021年开发的一款政务产品</div> -->
		</div>
		<div class="loading">
			<div class="text"><span>模块加载中...</span></div>
			<a-progress
				:stroke-color="{
					from: '#108ee9',
					to: '#87d068'
				}"
				:percent="100"
				status="active"
				:showInfo="false"
			/>
		</div>
	</common-layout>
</template>

<script>
import CommonLayout from '@/layouts/CommonLayout';
import { mapMutations } from 'vuex';
export default {
	name: 'loding',
	components: { CommonLayout },
	data() {
		return {
			VUE_APP_NAME:process.env.VUE_APP_NAME,
		};
	},
	computed: {
		query() {
			return this.$route.query;
		}
	},
	created() {
		this.$nextTick(() => {
			const routes = this.$router.options.routes.filter(item => {
				return item.path === `/${this.query.path}` || (item.meta && item.meta.group === this.query.path);
			});
			this.$store.commit('applications/setMenu', routes);
			setTimeout(() => {
				this.$router.push({
					path: this.query.path
				});
			}, 1000);
		});
	},

	methods: {
		...mapMutations('account', ['setUser'])
	}
};
</script>

<style lang="less" scoped>
.common-layout {
	.top {
		text-align: center;
		.header {
			height: 44px;
			line-height: 44px;
			a {
				text-decoration: none;
			}
			.logo {
				height: 44px;
				vertical-align: top;
				margin-right: 16px;
			}
			.title {
				font-size: 33px;
				color: @title-color;
				font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
				font-weight: 600;
				position: relative;
				top: 2px;
			}
		}
		.desc {
			font-size: 14px;
			color: @text-color-second;
			margin-top: 12px;
			margin-bottom: 40px;
		}
	}
	.loading {
		width: 368px;
		margin: 0 auto;
		@media screen and (max-width: 576px) {
			width: 95%;
		}
		@media screen and (max-width: 320px) {
			.captcha-button {
				font-size: 14px;
			}
		}
		.text {
			text-align: center;
		}
		.icon {
			font-size: 24px;
			color: @text-color-second;
			margin-left: 16px;
			vertical-align: middle;
			cursor: pointer;
			transition: color 0.3s;

			&:hover {
				color: @primary-color;
			}
		}
	}
}
</style>
