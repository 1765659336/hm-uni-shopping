<template>
	<view class="my-settle-container">
		<!-- 全选区域 -->
		<label class="radio" @click="changeAllState">
			<radio color="#C00000" :checked="isFullCheck" /><text>全选</text>
		</label>

		<!-- 合计区域 -->
		<view class="amount-box">
			合计:<text class="amount">￥{{checkedGoodsAmount}}</text>
		</view>

		<!-- 结算按钮 -->
		<view class="btn-settle" @click="settlement">结算({{checkedCount}})</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations,
		mapState,
	} from 'vuex'
	export default {
		name: "my-settle",
		data() {
			return {
				seconds: 3,
			};
		},
		computed: {
			...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
			...mapGetters('m_user', ['addstr']),
			...mapState('m_user', ['token']),
			// 全选按钮的选中状态
			isFullCheck() {
				return this.total === this.checkedCount
			},
		},
		methods: {
			...mapMutations('m_cart', ['UPDATEALLGOODSSTATE','UPDATEPAGE']),
			changeAllState() {
				this.UPDATEALLGOODSSTATE(!this.isFullCheck)
			},
			// 点击了结算按钮
			settlement() {
				// 1. 先判断是否勾选了要结算的商品
				if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品！')

				// 2. 再判断用户是否选择了收货地址
				if (!this.addstr) return uni.$showMsg('请选择收货地址！')

				// 3. 最后判断用户是否登录了
				// if (!this.token) return uni.$showMsg('请先登录！')
				if (!this.token) return this.delayNavigate()

				uni.$showMsg('支付接口失效，支付功能暂时没有开发')
			},
			// 延时跳转到登录页面
			delayNavigate() {
				// 当用户登录过之后，seconds的值会变成0，用户退出点击支付时，需要重新赋值
				this.seconds = 3
				// 初次展示跳转倒计时提示信息
				this.showTips(this.seconds)
				this.timer = setInterval(() => {
					this.seconds--
					// 如果到达0秒时跳转到登录页面
					if (this.seconds == 0){
						clearInterval(this.timer)
						// 告诉登录页面，我是从哪跳转来的，登录之后还需要回来
						this.UPDATEPAGE('cart')
						uni.switchTab({
							url:'/pages/my/my',
						})
						return
					}
					this.showTips(this.seconds)
				}, 1000)
			},
			showTips(seconds) {
				uni.showToast({
					title: `${seconds}秒后跳转到登录页面`,
					// 为页面添加透明遮罩，防止点击的时候穿透点击到下层页面内容，这样就不会多次执行showTips,产生bug
					mask: true,
					// 不添加icon属性，提示信息过长不完全展示，
					// 添加icon属性之后，可以展示更长的提示信息
					icon: 'none',
					// 下一次弹出会覆盖上一次的弹出，如果这个值不比定时器的延时长的话，会出现闪烁的情况
					duration: 1500
				})
			}
		}
	}
</script>

<style lang="scss">
	.my-settle-container {
		background-color: #f9f9f9;
		// 固定定位
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 50px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 5px;
		font-size: 14px;

		.radio {
			display: flex;
			align-items: center;
		}

		.amount-box {

			.amount {
				color: #C00000;
				font-weight: bold;
			}
		}

		.btn-settle {
			background-color: #c00000;
			height: 50px;
			// 设置最小的宽度
			min-width: 100px;
			line-height: 50px;
			text-align: center;
			color: white;
		}
	}
</style>
