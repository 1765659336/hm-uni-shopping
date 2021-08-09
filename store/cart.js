export default {
	// 为当前模块开启命名空间
	namespaced: true,

	// 模块的 state 数据
	state: {
		// 购物车的数组，用来存储购物车中每个商品的信息对象
		// 每个商品的信息对象，都包含如下 6 个属性：
		// { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
		cart: JSON.parse(uni.getStorageSync('cart') || '[]'),
	},

	// 模块的 mutations 方法
	mutations: {
		ADDTOCART(state,value){
			// 根据提交的商品的Id，查询购物车中是否存在这件商品
			// 如果不存在，则 findResult 为 undefined；否则，为查找到的商品信息对象
			// filter过滤 forEach循环 find查询
			const Result = state.cart.find( goods => goods.goods_id === value.goods_id)
			// 如果购物车中没有这件商品，则直接 push
			// 如果购物车中有这件商品，则只更新数量即可
			Result ? Result.goods_count ++ : state.cart.push(value)
			// 将每次修改之后的cart存储在本地，当页面跳转回来的时候，依然可以正常的展示
			// this指向Store
			// console.log(this)
			this.commit('m_cart/SAVETOSTORAGE')
		},
		SAVETOSTORAGE(state){
			uni.setStorageSync('cart', JSON.stringify(state.cart))
		}
	},

	// 模块的 getters 属性
	getters: {
		// 统计购物车中商品的数量
		total(state){
			let c = 0
			// 循环cart的每一项
			state.cart.forEach( goods => c += goods.goods_count)
			return c
		}
	},
}
