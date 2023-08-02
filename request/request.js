let Api = {
	// NODE_ENV: '"development"',
	// 线上
	// WEB_BASE_API:"http://171.34.197.243:8990",
	// WEB_BASE_API:"http://171.34.197.243:8990"
	// 线下
	WEB_BASE_API:"http://10.1.0.111:8999",
	// WEB_BASE_API:"http://10.1.0.205:8999",
	// WEB_BASE_API:"http://10.1.0.204:8999",
	// WEB_BASE_API:"http://171.34.196.54:8990",
	// WEB_BASE_API:"http://10.1.1.152:8999",
	WEB_BASE_API2:"http://59.55.128.156:3000/mock/3314",
}

// export let baseApi = "http://10.1.0.111:8999"
// export let baseApi = "http://171.34.197.243:8990"
// export let baseApi = "http://171.34.197.243:8990"
export let baseApi = Api.WEB_BASE_API
// 获取token
function getToken(){
    return uni.getStorageSync('token');
}

export let request = function(url,method = 'GET',data={},isJson=true){
	let fUrl = `${Api.WEB_BASE_API}${url}`
	let token = getToken() ? getToken():''
	let contentType = ''
	let Accept = ''
	if(isJson){
		if(isJson == 'Accept'){
			Accept = 'application/json, text/plain, */*'
			// contentType = 'application/json'
		}else{
			contentType = 'application/json'
		}
	}else{
		contentType = 'application/x-www-form-urlencoded'
	}
	return new Promise((resolve, reject) => {
			uni.request({
				method: method,
				url: fUrl,
				data: data,
				// sslVerify:false,
				header: {
					'Content-Type':contentType,
					'Accept':Accept,
					// 'Content-Type': 'application/json',//uni-app默认是json格式
					// 'Content-Type': 'application/x-www-form-urlencoded', //form格式
					"X-Access-Token": token,
				},
				success: (res) => {
					if (res.data.code == 200) {
						
						resolve(res)
					} else if (res.data.code == 401) {
						uni.showModal({
							title: '提示',
							content: '状态过期，请重新登录',
							showCancel: false,
							success: (res) => {
								if (res.confirm) {
									uni.reLaunch({
										url: '/pages/login/login'
									})
								}
							}
						})
					} else {
						resolve(res)
					}
				},
				fail: (err) => {
					console.log("err",err)
					reject(err)
				}
			})
		})
}
export let request2 = function(url,method = 'GET',data={},isJson=true){
	let fUrl = `${Api.WEB_BASE_API2}${url}`
	let token = getToken() ? getToken():''
	let contentType = ''
	if(isJson){
		contentType = 'application/json'
	}else{
		contentType = 'application/x-www-form-urlencoded'
	}
	return new Promise((resolve, reject) => {
			uni.request({
				method: method,
				url: fUrl,
				data: data,
				// sslVerify:false,
				header: {
					// 'Content-Type': 'application/json',//uni-app默认是json格式
					// 'Content-Type': 'application/x-www-form-urlencoded', //form格式
					"X-Access-Token": token,
				},
				success: (res) => {
					if (res.data.code == 200) {
						resolve(res)
					} else if (res.data.code == 401) {
						// uni.showModal({
						// 	title: '提示',
						// 	content: '状态过期，请重新登录',
						// 	showCancel: false,
						// 	success: (res) => {
						// 		if (res.confirm) {
						// 			uni.reLaunch({
						// 				url: '/pages/login/login'
						// 			})
						// 		}
						// 	}
						// })
					} else {
						resolve(res)
					}
				},
				fail: (err) => {
					reject(err)
				}
			})
		})
}
