import { FormUpload } from '@/services/api'
// import KFormDesign from 'k-form-design'
import KFormDesign from '@/components/k-form-design/packages'
import RichEditor from "./RichEditor"
// import RelatedDocument from "./RelatedDocument"
import MdEditor from "./MdEditor"
import Tags from "./Tags"
import TreeSelect from "./TreeSelect"
import KeyValuePair from "./KeyValuePair"
import TagsSelects from "./TagsSelects"
import CustomTabs from "./CustomTabs"
import Relations from "./Relations"
import IconList from "./IconList"
import JsonEditor from "./JsonEditor"
import AColorPicker from "./AColorPicker"
import draggable from "./draggable"
import excels from "./excels"
import opinions from "./opinions"
import dynamictree from "./dynamictree"


KFormDesign.setConfig({
	title: "自定义控件",
	uploadFile: FormUpload, // 上传文件地址
	uploadImage: FormUpload, // 上传图片地址
	uploadFileName: "file", // 上传文件name
	uploadImageName: "file", // 上传图片name

	list: [
		{
			type: "custom-tabs", // 组件类型
			label: "动态标签页", // 组件名称
			component: CustomTabs, // 组件
			list: [],
			options:{}
		},
		{
			type: "rich-editor", // 组件类型
			label: "富文本编辑器", // 组件名称
			component: RichEditor, // 组件
			options: {
				defaultValue: null, // 可选值
				disabled: false, // 可选值
				width: "100%"
			},
			model: "", // 可选值
			key: "",
			rules: [ // 可选值
				{
					required: false,
					message: "必填项"
				}
			]
		}, 
		// {
		// 	type: "related-document", // 组件类型
		// 	label: "相关文档", // 组件名称
		// 	component: RelatedDocument, // 组件
		// 	options: {
		// 		defaultValue: undefined, // 可选值
		// 		multiple: false, // 可选值
		// 		disabled: false, // 可选值
		// 		width: "100%",
		// 		clearable: true, // 可选值
		// 		placeholder: "请选择", // 可选值
		// 		showSearch: false, // 可选值
		// 		dynamic: false
		// 	},
		// 	model: "", // 可选值
		// 	key: "",
		// 	rules: [ // 可选值
		// 		{
		// 			required: false,
		// 			message: "必填项"
		// 		}
		// 	]
		// },
		{
			type: "md-editor", // 组件类型
			label: "MD编辑器", // 组件名称
			component: MdEditor, // 组件
			options: {
				defaultValue: null, // 可选值
				disabled: false, // 可选值
				width: "100%"
			},
			model: "", // 可选值
			key: "",
			rules: [ // 可选值
				{
					required: false,
					message: "必填项"
				}
			]
		},
		{
			type: "tags", // 组件类型
			label: "标签", // 组件名称
			component: Tags, // 组件
			options: {
				defaultValue: "标签", // 可选值
				width: "100%"
			},
			model: "", // 可选值
			key: "",
			rules: [ // 可选值
				{
					required: false,
					message: "必填项"
				}
			]
		},
		{
			type: "treeselect", // 组件类型
			label: "树状选择器", // 组件名称
			component: TreeSelect, // 组件
			options: {
				disabled: false, // 禁用
				multiple: false, // 多选
				// hidden: false, //隐藏
				clearable: false, // 清除
				showSearch: false, // 可搜索
				treeCheckable: false, //可选
				placeholder: "请选择", // 占位
				dynamicKey: "",
				dynamic: false,
				options: [
					{
						value: "1",
						label: "选项1",
						children: [
							{
								value: "11",
								label: "选项11"
							}
						]
					},
					{
						value: "2",
						label: "选项2",
						children: [
							{
								value: "22",
								label: "选项22"
							}
						]
					}
				]
			},
			model: "", // 可选值
			key: "",
			// help: "",
			prefix: "",
			suffix: "",
			rules: [ // 可选值
				{
					required: false,
					message: "必填项"
				}
			]
		},
		{
			type: "key-value-pair", // 组件类型
			label: "键值对", // 组件名称
			component: KeyValuePair, // 组件
			options: {
				width: "100%",
			},
			model: {}, // 可选值
			key: {},
			rules: [ // 可选值
				{
					required: false,
					message: "必填项"
				}
			]
		},
		{
			type: "tagselect", // 表单类型
			label: "输入选择器", // 标题文字
			component: TagsSelects, // 组件
			icon: "icon-xiala",
			options: {
				width: "100%", // 宽度
				defaultValue: undefined, // 下拉选框请使用undefined为默认值
				multiple: true, // 是否允许多选
				disabled: false, // 是否禁用
				clearable: false, // 是否显示清除按钮
				hidden: false, // 是否隐藏，false显示，true隐藏
				placeholder: "请选择", // 默认提示文字
				dynamicKey: "",
				dynamic: false,
				ifinput: true,
				options: [],
				showSearch: false // 是否显示搜索框，搜索选择的项的值，而不是文字
			},
			model: "",
			key: "",
			rules: [
				{
					required: false,
					message: "必填项"
				}
			]
		},
		{
			type: "relations", // 组件类型
			label: "相关文档(new)", // 组件名称
			component: Relations, // 组件
			options: {
				defaultValue: undefined, // 可选值
				multiple: false, // 可选值
				disabled: false, // 可选值
				width: "100%",
				clearable: true, // 可选值
				placeholder: "请选择", // 可选值
				showSearch: false, // 可选值
				dynamic: false
			},
			model: "", // 可选值
			key: "",
			rules: [ // 可选值
				{
					required: false,
					message: "必填项"
				}
			]
		}, {
			type: "icon-list", // 组件类型
			label: "图标选择器", // 组件名称
			component: IconList, // 组件
			options: {
				dynamicKey: "IconList",
				dynamic: true,
				width: "100%",

				options: [],
			},
			model: "", // 可选值
			key: "",
			prefix: "",
			suffix: "",
			rules: [ // 可选值
				{
					required: false,
					message: "必填项"
				}
			]
		}, {
			type: "a-color-picker", // 组件类型
			label: "颜色选择器", // 组件名称
			component: AColorPicker, // 组件
			options: {
				defaultValue: "red",
				disabled: false, // 可选值
				width: "100%",
			},
			model: "", // 可选值
			key: "",
			prefix: "",
			suffix: "",
			rules: [ // 可选值
				{
					required: false,
					message: "必填项"
				}
			]
		},
		{
			type: "json-editor", // 组件类型
			label: "Json编辑器", // 组件名称
			component: JsonEditor, // 组件
			options: {
				defaultValue: {}, // 可选值
				disabled: false, // 可选值
				width: "100%"
			},
			model: "", // 可选值
			key: "",
			rules: [ // 可选值
				{
					required: false,
					message: "必填项"
				}
			]
		},
		{
			type: "拖拽排序", // 组件类型
			label: "排序", // 组件名称
			component: draggable, // 组件
			options: {
				// defaultValue: [], // 可选值
				disabled: false, // 可选值
				width: "100%",
				dynamicKey: "",
				dynamic: false,
				options: [
					{
						value: "1",
						label: "选项1",
					},
					{
						value: "2",
						label: "选项2",
					}
				]
			},
			model: "", // 可选值
			key: "",
		},
		{
			type: "excels", // 组件类型
			label: "excels", // 组件名称
			component: excels, // 组件
			options: {
				disabled: false, // 可选值
				width: "100%",
				hidden: false, // 是否隐藏，false显示，true隐藏
				// options: [],
			},
			model: "", // 可选值
			key: [],
			rules: [ // 可选值
				{
					required: false,
					message: "必填项"
				}
			]
		},
		{
            type: "opinions", // 组件类型
            label: "意见征集", // 组件名称
            component: opinions, // 组件
            options: {
                defaultValue: {}, // 可选值
                disabled: false, // 可选值
                width: "100%",
                clearable: true, // 可选值
                placeholder: "请选择", // 可选值
                showSearch: false, // 可选值
                dynamic: false
            },
            model: '', // 可选值
            key: '',
            rules: [ // 可选值
                {
                    required: false,
                    message: "必填项"
                }
            ]
        },
		{
			type: "dynamictree", // 组件类型
			label: "动态选择器", // 组件名称
			component: dynamictree, // 组件
			options: {
				disabled: false, // 禁用
				multiple: false, // 多选
				// hidden: false, //隐藏
				clearable: false, // 清除
				showSearch: false, // 可搜索
				treeCheckable: false, //可选
				placeholder: "请选择", // 占位
				dynamicKey: "",
				dynamic: false,
				options: [
					{
						value: "1",
						label: "选项1",
						children: [
							{
								value: "11",
								label: "选项11"
							}
						]
					},
					{
						value: "2",
						label: "选项2",
						children: [
							{
								value: "22",
								label: "选项22"
							}
						]
					}
				]
			},
			model: "", // 可选值
			key: "",
			// help: "",
			prefix: "",
			suffix: "",
			rules: [ // 可选值
				{
					required: false,
					message: "必填项"
				}
			]
		},
		
	]
})
