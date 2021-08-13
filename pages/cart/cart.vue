<template>
	<view>
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
		data(){
			return {
				options:[{
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
			...mapMutations('m_cart', ['UPDATEGOODS','DELETEGOODS']),
			// 商品的勾选状态发生了变化
			radioChangeHandler(obj) {
				this.UPDATEGOODS(obj)
			},
			// 商品数量发生改变
			numberChangeHandler(obj) {
				this.UPDATEGOODS(obj)
				// 修改底部导航栏购物车标签上的数字badge
				this.setBadge()
			},
			// 滑动删除
			swipeActionClickHandler(goods){
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
</style>
