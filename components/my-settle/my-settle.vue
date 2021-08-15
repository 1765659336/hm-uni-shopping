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
		<view class="btn-settle">结算({{checkedCount}})</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations,
	} from 'vuex'
	export default {
		name: "my-settle",
		data() {
			return {

			};
		},
		computed: {
			...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
			// 全选按钮的选中状态
			isFullCheck() {
				return this.total === this.checkedCount
			},
		},
		methods: {
			...mapMutations('m_cart', ['UPDATEALLGOODSSTATE']),
			changeAllState() {
				this.UPDATEALLGOODSSTATE(!this.isFullCheck)
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
