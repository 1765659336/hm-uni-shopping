export default {
	namespaced: true,
	state: {
		// 3. 读取本地的收货地址数据，初始化 address 对象
		address: JSON.parse(uni.getStorageSync('address') || '{}'),
		// 用户登录之后的信息
		token: uni.getStorageSync('token') || '',
		// 用户的基本信息
		userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}')
	},
	mutations: {
		UPDATEADDRESS(state, address) {
			state.address = address
			// 2. 通过 this.commit() 方法，调用 m_user 模块下的 SAVEADDRESSTOSTORAGE 方法将 address 对象持久化存储到本地
			this.commit('m_user/SAVEADDRESSTOSTORAGE')
		},
		UPDATEUSERINFO(state, userinfo) {
			state.userinfo = userinfo
			this.commit('m_user/SAVEUSERINFOSTORAGE')
		},
		// 更新 token 字符串
		UPDATETOKEN(state, token) {
			state.token = token
			// 通过 this.commit() 方法，调用 m_user 模块下的 saveTokenToStorage 方法，将 token 字符串持久化存储到本地
			this.commit('m_user/SAVETOKENTOSTORAGE')
		},
		// 1. 定义将 address 持久化存储到本地 mutations 方法
		SAVEADDRESSTOSTORAGE(state) {
			uni.setStorageSync('address', JSON.stringify(state.address))
		},
		SAVEUSERINFOSTORAGE(state) {
			uni.setStorageSync('userinfo', JSON.stringify(state.userinfo))
		},
		// 将 token 字符串持久化存储到本地
		SAVETOKENTOSTORAGE(state) {
			uni.setStorageSync('token', state.token)
		},
	},
	getters: {
		// 收货详细地址的计算属性
		addstr(state) {
			if (!state.address.provinceName) return ''

			// 拼接 省，市，区，详细地址 的字符串并返回给用户
			return state.address.provinceName + state.address.cityName + state.address.countyName + state.address
				.detailInfo
		}
	}
}
