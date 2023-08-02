/**
 *计算时差
 *beginTime：开始时间
 *endTime:结束时间
 *type:返回类型  
 */
export function difference(beginTime, endTime, type = 'm-s') {
	var dateBegin = new Date(beginTime);
	var dateEnd = new Date(endTime);
	var dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数
	var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
	var leave1 = dateDiff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
	var hours = Math.floor(leave1 / (3600 * 1000)); //计算出小时数
	//计算相差分钟数
	var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
	var minutes = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
	//计算相差秒数
	var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
	var seconds = Math.round(leave3 / 1000);

	let D = dayDiff < 10 ? '0' + dayDiff : dayDiff
	let H = hours < 10 ? '0' + hours : hours
	let M = minutes < 10 ? '0' + minutes : minutes
	let S = seconds < 10 ? '0' + seconds : seconds
	if (type === 'd h:m:s') {
		return `${D} ${H}:${M}:${S}`
	} else if (type === 'h:m:s') {
		return `${H}:${M}:${S}`
	} else if (type === 'm:s') {
		return `${M}:${S}`
	}
}



/**
 * 格式化时间
 *value：时间值，可以是日期时间
 *args：返回值的类型
 */

export function formatDate(value, args) {
	var dt = new Date(value);
	if (args == 'yyyy-M-d') { // yyyy-M-d
		let year = dt.getFullYear();
		let month = dt.getMonth() + 1;
		let day = dt.getDate();
		return {
			year,
			month,
			day
		}
		// return `${year}-${month}-${day}`;
	} else if (args == 'yyyy-M-d H:m:s') { // yyyy-M-d H:m:s
		let year = dt.getFullYear();
		let month = dt.getMonth() + 1;
		let day = dt.getDate();
		let hour = dt.getHours();
		let minute = dt.getMinutes();
		let second = dt.getSeconds();
		return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
	} else if (args == 'yyyy-MM-dd') { // yyyy-MM-dd
		let year = dt.getFullYear();
		let month = (dt.getMonth() + 1).toString().padStart(2, '0');
		let day = dt.getDate().toString().padStart(2, '0');

		// return {
		// 	year,
		// 	month,
		// 	day
		// }
		return `${year}-${month}-${day}`;
	} else { // yyyy-MM-dd HH:mm:ss
		let year = dt.getFullYear();
		let month = (dt.getMonth() + 1).toString().padStart(2, '0');
		let day = dt.getDate().toString().padStart(2, '0');
		let hour = dt.getHours().toString().padStart(2, '0');
		let minute = dt.getMinutes().toString().padStart(2, '0');
		let second = dt.getSeconds().toString().padStart(2, '0');

		return {
			year,
			month,
			day,
			hour,
			minute,
			second
		}
		// return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
	}
}

// 解决ios时间格式
export function formatTime(date) {
	var time = date == null ? "" : Date.parse(date.replace(/-/g, '/'));
	var date = new Date(time);
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	if (month < 10) {
		month = '0' + month;
	}
	var day = date.getDate();
	if (day < 10) {
		day = '0' + day;
	}
	var hour = date.getHours();
	if (hour < 10) {
		hour = '0' + hour;
	}
	var minute = date.getMinutes();
	if (minute < 10) {
		minute = '0' + minute;
	}
	var second = date.getSeconds();
	if (second < 10) {
		second = '0' + second;
	}
	return [year, month, day + ' ' + hour + ':' + minute + ':' + second].map(formatNumber).join('/');
}



// 快速生成随机字符串，可指定长度
export function randomString(len) {
	len = len || 16;
	var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
	var maxPos = $chars.length;
	var pwd = '';
	for (let i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}

// 获取星期
export function getWeek(value) {
	let dt = new Date(value);
	let weekArray = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
	return weekArray[dt.getDay()]
}


// 分钟和秒钟
export const secOrMinArray = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14',
	'15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32',
	'33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50',
	'51', '52', '53', '54', '55', '56', '57', '58', '59'
]
export const hourArray = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14',
	'15', '16', '17', '18', '19', '20', '21', '22', '23'
]
export const dayEndArray = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15',
	'16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'
]
export const dayMidArray = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15',
	'16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'
]
export const dayRunArray = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15',
	'16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29'
]
export const dayPinArray = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15',
	'16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28'
]
export const monthArray = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']


export function modal(content) {
	uni.showModal({
		title: '提示',
		content: content,
		showCancel: false
	})
}
