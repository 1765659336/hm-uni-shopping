export default {
	// 为当前模块开启命名空间
	namespaced: true,

	// 模块的 state 数据
	state: {
		// 购物车的数组，用来存储购物车中每个商品的信息对象
		// 每个商品的信息对象，都包含如下 6 个属性：
		// { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
		cart: JSON.parse(uni.getStorageSync('cart') || '[]'),
		// 这个值放在这不好，但是可以实现功能，当用户登录之后，可以判断这个来决定是否跳转到购物车页面
		page: '',
	},

	// 模块的 mutations 方法
	mutations: {
		// 添加商品
		ADDTOCART(state, value) {
			// 根据提交的商品的Id，查询购物车中是否存在这件商品
			// 如果不存在，则 findResult 为 undefined；否则，为查找到的商品信息对象
			// filter过滤 forEach循环 find查询
			const Result = state.cart.find(goods => goods.goods_id === value.goods_id)
			// 如果购物车中没有这件商品，则直接 push
			// 如果购物车中有这件商品，则只更新数量即可
			Result ? Result.goods_count++ : state.cart.push(value)
			// 将每次修改之后的cart存储在本地，当页面跳转回来的时候，依然可以正常的展示
			// this指向Store
			// console.log(this)
			this.commit('m_cart/SAVETOSTORAGE')
		},
		// 保存商品到本地
		SAVETOSTORAGE(state) {
			uni.setStorageSync('cart', JSON.stringify(state.cart))
		},
		// 更新购物车中商品的状态
		UPDATEGOODS(state, goods) {
			// 根据 goods_id 查询购物车中对应商品的信息对象
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

			// 有对应的商品信息对象
			if (findResult) {
				switch (goods.type) {
					case 'state':
						// 更新对应商品的勾选状态
						findResult.goods_state = goods.goods_state
						break
					case 'count':
						// 更新对应商品的数量
						findResult.goods_count = goods.goods_count
						break
				}
				// 持久化存储到本地
				this.commit('m_cart/SAVETOSTORAGE')
			}
		},
		// 删除商品
		DELETEGOODS(state, goods) {
			// cart中商品id不等于要删除的那个商品id的过滤下来
			state.cart = state.cart.filter(x => x.goods_id !== goods.goods_id)
			// 持久化存储到本地
			this.commit('m_cart/SAVETOSTORAGE')
		},
		// 改变购物车页面所有商品的选中状态
		UPDATEALLGOODSSTATE(state, newState) {
			console.log(newState)
			state.cart.forEach(x => x.goods_state = newState)
			// 持久化存储到本地
			this.commit('m_cart/SAVETOSTORAGE')
		},
		// 当用户未登录点击支付跳转到登录页面
		UPDATEPAGE(state,newValue){
			state.page = newValue
		}
	},
	// 模块的 getters 属性
	getters: {
		// 统计购物车中商品的数量
		total(state) {
			let c = 0
			// 循环cart的每一项
			state.cart.forEach(goods => c += goods.goods_count)
			return c
		},
		// 统计要结算的商品数量
		checkedCount(state) {
			// 先使用 filter 方法，从购物车中过滤器已勾选的商品，返回新的数组
			// 再使用 reduce 方法，将已勾选的商品总数量进行累加
			// reduce() 的返回值就是已勾选的商品的总数量
			return state.cart.filter(x => x.goods_state)
				.reduce((total, item) => total += item.goods_count, 0)
		},
		// 统计要结算的商品的总额
		checkedGoodsAmount(state) {
			return state.cart.filter(x => x.goods_state)
				.reduce((amount, item) => amount += item.goods_count * item.goods_price, 0)
				.toFixed(2)
		}
	},
}
