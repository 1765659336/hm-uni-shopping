<template>
	<view>
		<view class="goods-list">
			<!-- block标签不会被渲染到页面上,但是block标签不能绑定事件，还是需要改成view标签 -->
			<view v-for="(goods, i) in goodsList" :key="i" @click="goToGoodsDetail(goods)">
				<my-goods :goods="goods"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 根据请求商品列表后台API接口规则，要收到一个对象
				queryObj: {
					// 查询关键词
					query: '',
					// 商品分类Id
					cid: '',
					// 页码值
					pagenum: 1,
					// 每页显示多少条数据
					pagesize: 10
				},
				// 商品列表的数据
				goodsList: [],
				// 总数量，用来实现分页
				total: 0,
				// 是否正在请求数据，节流阀
				isloading: false
			}
		},
		// onload可以接收到其它页面跳转过来的时候传递的参数
		onLoad(options) {
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''
			// 判断是否正在请求其它数据，如果是，则不发起额外的请求
			/* 防抖：发起下一次请求会关闭上一次请求
					节流：上一次请求未结束时，锁住下一次发送请求的行为
			 */
			if (this.isloading) return
			// 调用获取商品列表数据的方法
			this.getGoodsList()
		},
		// 上拉触底的生命周期函数
		onReachBottom() {
			// 进来的时候判断当前拿到的数据是否已经拿完,如果已经拿完了的话就不要再发起请求了
			// if(this.queryObj.pagenum * this.queryObj.pagesize > this.total) {
			if (this.goodsList.length >= this.total) {
				uni.$showMsg('已经划到底了~_~')
				return
			}
			// 让页码值自增 +1
			this.queryObj.pagenum++
			// 重新获取列表数据
			this.getGoodsList()
		},
		// 下拉刷新的生命周期函数
		onPullDownRefresh() {
			// 1. 重置关键数据
			this.queryObj.pagenum = 1
			this.total = 0
			this.isloading = false
			this.goodsList = []

			// 2. 重新发起请求
			this.getGoodsList(() => uni.stopPullDownRefresh())
		},
		methods: {
			// 获取商品列表数据的方法
			async getGoodsList(cd) {
				// ** 打开节流阀
				this.isloading = true
				// 发起请求
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
				if (res.meta.status !== 200) return uni.$showMsg()
				// 为数据赋值：通过展开运算符的形式，进行新旧数据的拼接
				this.goodsList = [...this.goodsList, ...res.message.goods]
				this.total = res.message.total
				// ** 关闭节流阀
				this.isloading = false
				// cd接收关闭下拉效果的箭头函数,其实下拉效果自动会关闭，但是我们必须在数据请求成功的时候就立马关闭下拉刷新的效果，给用户更好的体验
				cd && cd()
			},
			// 前往商品详情页
			goToGoodsDetail(goods){
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
				})
			}
		}
	}
</script>

<style lang="scss">
</style>
