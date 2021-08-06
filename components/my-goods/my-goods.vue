<template>
	<view>
		<view class="goods-item">
			<!-- 商品左侧图片区域 -->
			<view class="goods-item-left">
				<image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
			</view>
			<!-- 商品右侧信息区域 -->
			<view class="goods-item-right">
				<!-- 商品标题 -->
				<view class="goods-name">{{goods.goods_name}}</view>
				<view class="goods-info-box">
					<!-- 商品价格 -->
					<view class="goods-price">￥{{goods.goods_price | toFixed}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-goods",
		data() {
			return {
				// 商品接口有些图片已经失效了，放一张默认的图片
				defaultPic: '/static/ct/mmexport1621952288900.jpg',
			}
		},
		props: {
			goods: {
				type: Object,
				default: {}
			}
		},
		filters:{
			toFixed(num){
				return Number(num).toFixed(2)
			}
		}
	}
</script>

<style lang="scss">
	.goods-item {
		display: flex;
		padding: 10px 5px;
		border-bottom: 1px solid #f0f0f0;

		.goods-item-left {
			margin-right: 5px;

			.goods-pic {
				width: 100px;
				height: 100px;
				display: block;
			}
		}

		.goods-item-right {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			font-size: 13px;
		}

		.goods-price {
			font-size: 16px;
			color: #c00000;
		}
	}
</style>
