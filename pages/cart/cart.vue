<template>
	<view>
		<view v-if="cart.length !== 0">
			<!-- 收货地址展示区域 -->
			<my-address></my-address>
			<!-- 渲染购物车商品展示区 -->
			<!-- 标题区 -->
			<view class="cart-title">
				<!-- 左侧图标区 -->
				<uni-icons type="cart" size="18"></uni-icons>
				<!-- 右侧文本区 -->
				<text class="cart-title-text">购物车</text>
			</view>
			<!-- 循环渲染商品数据 -->
			<uni-swipe-action>
				<block v-for="( goods,i ) in cart" :key="i">
					<uni-swipe-action-item :right-options="options" @click="swipeActionClickHandler(goods)">
						<my-goods :goods="goods" showRadio @radio-change="radioChangeHandler" showNum
							@num-change="numberChangeHandler"></my-goods>
					</uni-swipe-action-item>
				</block>
			</uni-swipe-action>
			<!-- 商品结算区域 -->
			<my-settle></my-settle>
		</view>
		<!-- 空白购物车区域 -->
		<view class="empty-cart" v-else>
			<image src="/static/cart_empty@2x.png" class="empty-img"></image>
			<text class="tip-text">空空如也~</text>
		</view>
	</view>
</template>

<script>
	import CartBadge from '../../mixins/CartBadge.js'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		mixins: [CartBadge],
		data() {
			return {
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#C00000'
					}
				}]
			}
		},
		computed: {
			...mapState('m_cart', ['cart'])
		},
		methods: {
			...mapMutations('m_cart', ['UPDATEGOODS', 'DELETEGOODS']),
			// 商品的勾选状态发生了变化
			radioChangeHandler(obj) {
				this.UPDATEGOODS(obj)
			},
			// 商品数量发生改变
			numberChangeHandler(obj) {
				this.UPDATEGOODS(obj)
			},
			// 滑动删除
			swipeActionClickHandler(goods) {
				this.DELETEGOODS(goods)
			}
		}
	}
</script>

<style lang="scss">
	.cart-title {
		height: 40px;
		display: flex;
		align-items: center;
		padding-left: 5px;
		font-size: 14px;
		border-bottom: 1px solid #EFEFEF;

		.cart-title-text {
			margin-left: 10px;
		}
	}

	.empty-cart {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 150px;

		.empty-img {
			width: 130px;
			height: 130px;
		}

		.tip-text {
			font-size: 16px;
			color: gray;
			margin-top: 15px;
			font-weight: bold;
		}
	}
</style>
