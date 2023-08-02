import enquireJs from 'enquire.js'


export function trim(str, char, type) {
	if (char) {
		if (type == 'left') {
			return str.replace(new RegExp('^\\' + char + '+', 'g'), '');
		} else if (type == 'right') {
			return str.replace(new RegExp('\\' + char + '+$', 'g'), '');
		}
		return str.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '');
	}
	return str.replace(/^\s+|\s+$/g, '');
}

export function isDef(v) {
	return v !== undefined && v !== null
}

/**
 * Remove an item from an array.
 */
export function remove(arr, item) {
	if (arr.length) {
		const index = arr.indexOf(item)
		if (index > -1) {
			return arr.splice(index, 1)
		}
	}
}

export function isRegExp(v) {
	return _toString.call(v) === '[object RegExp]'
}

export function enquireScreen(call) {
	const handler = {
		match: function () {
			call && call(true)
		},
		unmatch: function () {
			call && call(false)
		}
	}
	enquireJs.register('only screen and (max-width: 767.99px)', handler)
}

const _toString = Object.prototype.toString


export function addLongPress(info, clickCb, longPressCb) {
	let timer = null;
	let onOff = false;
	const {
		el
	} = info;
	const start = e => {
		// 这里的button的意思是鼠标点击可能不是左键点击可能是右键或者中键点击，所以这里需要判断下
		if (e.type === 'click' || e.button !== 0) return;

		if (timer === null) {
			timer = setTimeout(() => {
				onOff = true;
				longPressCb && longPressCb(info);
			}, 1000);
		}
	};

	const cancel = e => {
		if (e.type === 'click' && e.button === 0 && !onOff) {
			clickCb && clickCb(info);
		}
		if (timer !== null) {
			clearTimeout(timer);
			timer = null;
			onOff = false;
		}
	};
	el.addEventListener('mousedown', start);
	el.addEventListener('click', cancel);
	el.addEventListener('mouseout', cancel);
}
export function getQuery() {

	let url = location.search || location.href; // 获取当前浏览器的URL
	let arr = []; // 存储参数的数组
	let res = {}; // 存储最终JSON结果对象
	if (url.split("?")[1] == undefined) {
		return res;
	}
	arr = url.split("?")[1].split("&"); // 获取浏览器地址栏中的参数

	for (let i = 0; i < arr.length; i++) {
		// 遍历参数
		if (arr[i].indexOf("=") != -1) {
			// 如果参数中有值
			let str = arr[i].split("=");
			res[str[0]] = str[1];
		} else {
			// 如果参数中无值
			res[arr[i]] = "";
		}
	}
	return res;
}
export function Sum(array, field) {
	let number = 0;
	for (const key in array) {
		if (Object.hasOwnProperty.call(array, key)) {
			const element = array[key];
			if (field) {
				if (element[field]) {
					number += element[field];
				}
			} else {
				if (element) {
					number += element;
				}
			}
		}
	}
	return number;
}
export function formSetData(form, record, extend) {
	extend = extend || {}
	let formData = {};
	for (let key in form.form.formItems) {
		formData[key] = record[key];
	}
	formData = Object.assign(formData, extend);
	form.setData(formData);
}

export function formDataError(error, message) {
	for (const key in error) {
		if (Object.hasOwnProperty.call(error, key)) {
			const element = error[key];
			for (const index in element) {
				if (Object.hasOwnProperty.call(element, index)) {
					const data = element[index];
					if (data.errors) {
						data.errors.forEach(item => {
							message(`${item.field} , ${item.message}`);
						});
					} else {
						data.forEach(item => {
							message(`${item.field} , ${item.message}`);
						});
					}
				}
			}
		}
	}
}

export function getCrumb(params, fields) {
	fields = fields || []
	const result = {}
	fields.forEach(x => {
		if (params && params[x]) {
			result[x] = params[x];
		}
	})
	return result
}

