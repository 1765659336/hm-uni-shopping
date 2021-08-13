<template>
	<view>
		<view class="goods-item">
			<!-- 商品左侧图片区域 -->
			<view class="goods-item-left">
				<radio :checked="goods.goods_state" color="#E00000" v-if="showRadio" @click="radioClickHandler"></radio>
				<image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
			</view>
			<!-- 商品右侧信息区域 -->
			<view class="goods-item-right">
				<!-- 商品标题 -->
				<view class="goods-name">{{goods.goods_name}}</view>
				<view class="goods-info-box">
					<!-- 商品价格 -->
					<view class="goods-price">￥{{goods.goods_price | toFixed}}</view>
					<!-- 右侧商品的数量 -->
					<uni-number-box :value="goods.goods_count" :min="1" :max="9999" v-if="showNum" @change="numberChangeHandler"></uni-number-box>
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
			},
			showRadio: {
				type: Boolean,
				default: false
			},
			showNum: {
				type: Boolean,
				default: false
			}
		},
		filters:{
			toFixed(num){
				return Number(num).toFixed(2)
			}
		},
		methods:{
			// 单选框选择状态改变触发的事件
			radioClickHandler(){
				this.$emit('radio-change',{
					goods_id: this.goods.goods_id,
					goods_state: ! this.goods.goods_state,
					type: 'state'
				})
			},
			// uni-number-box组件数值改变触发的事件
			numberChangeHandler(value){
				this.$emit('num-change',{
					goods_id: this.goods.goods_id,
					// +value将value转换为一个数值
					goods_count: +value,
					type: 'count'
				})
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
			display: flex;
			justify-content: space-between;
			align-items: center;
			
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
			// 让盒子里面的内容占满整个盒子
			flex: 1;
			
			.goods-info-box {
				display: flex;
				justify-content: space-between;
				align-items: center;
				
				.goods-price {
					font-size: 16px;
					color: #c00000;
				}
			}
		}
	}
</style>
