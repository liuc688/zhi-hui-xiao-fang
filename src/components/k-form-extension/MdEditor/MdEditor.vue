<template>
	<mark-down-editor
		v-model="content"
		@change="onChange"
		:toolbars="config"
		:upload-url="config.uploadurl"
		:readonly="record.options.disabled"
	></mark-down-editor>
</template>

<script>
import MarkDownEditor from '@/components/MarkDownEditor';
export default {
	name: 'md-editor',
	components: {
		MarkDownEditor
	},
	props: {
		value: {
			type: String
		},
		record: {
			type: Object,
			required: true
		},
		formConfig: {
			type: Object,
			required: false
		},
		dynamicData: {
			type: Object,
			default: () => ({})
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		content: {
			get() {
				return this.value;
			},
			set(value) {
				this.$emit('change', value);
			}
		},
		config() {
			return this.dynamicData.config || {};
		}
	},

	watch: {
		value: {
			handler(value) {
				if (value) {
					this.content = value;
				}
			},
			deep: true
		},
		record: {
			handler(value) {
				this.config.readonly = value.options.disabled;
			},
			deep: true
		}
	},
	data() {
		return {
			
		};
	},
	methods: {
		onChange(value) {
			this.$emit('change', value);
		}
	}
};
</script>
