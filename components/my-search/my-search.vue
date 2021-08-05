<template>
	<view @click="boxSearchHandle" class="my-search-container" :style="[{'background-color':boxBgColor},{'height':boxHeight + 'px'}]">
		<view class="my-search-box" :style="[{'background-color':searchBgColor},{'border-radius':searchRadius + 'px'},{'height':searchHeight + 'px'}]">
			<!-- 使用uni-app中的icon组件 -->
			<uni-icons type="search" size="17" :style="{'font-size':fontSize + 'px'}"></uni-icons>
			<text class="search">搜索</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-search",
		data() {
			return {};
		},
		props: {
			// 盒子的背景颜色
			boxBgColor:{
				type:String,
				default: '#C00000'
			},
			//  搜索框的背景颜色
			searchBgColor:{
				type:String,
				default: '#FFFFFF'
			},
			boxHeight:{
				type:Number,
				// 单位px
				default: 40
			},
			searchHeight:{
				type:Number,
				// 单位px
				default: 36
			},
			searchRadius:{
				type:Number,
				// 单位px
				default: 18
			},
			fontSize:{
				type:Number,
				// 单位px
				default: 15
			}
		},
		methods:{
			boxSearchHandle(){
				// 执行父组件的方法
				this.$emit('myclick')
			}
		}
	}
</script>

<style lang="scss">
	.my-search-container {
		// height: 50px;
		// background-color: #C00000;
		display: flex;
		flex-direction: column;
		justify-content: center;

		.my-search-box {
			// height: 36px;
			// background-color: #FFFFFF;
			// border-radius: 18px;
			display: flex;
			justify-content: center;
			align-items: center;

			.search {
				// font-size: 15px;
				margin-left: 5px;
			}
		}
	}
</style>
