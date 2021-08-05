<template>
	<view>
		<!-- 使用自定义搜索组件 -->
		<view class="box-search">
			<my-search :boxHeight="50" @myclick="goToSearch"></my-search>
		</view>
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(item,index) in swiperList" :key="index">
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>
		<!-- 分类区域 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item, index) in navList" :key="index" @click="navClickHandler(item)">
				<image :src="item.image_src" class="nav-img"></image>
			</view>
		</view>
		<view class="floor-list">
			<!-- 楼层 item 项 -->
			<view class="floor-item" v-for="(item, i) in floorList" :key="i">
				<!-- 楼层标题 -->
				<image :src="item.floor_title.image_src" class="floor-title"></image>
				<!-- 楼层图片区域 -->
				<view class="floor-img-box">
					<!-- 左侧大图片的盒子 -->
					<navigator class="left-img-box" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src"
							:style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
					</navigator>
					<!-- 右侧 4 个小图片的盒子 -->
					<view class="right-img-box">
						<navigator class="right-img-item" v-for="(item2, i2) in item.product_list" :key="i2" v-if="i2 !== 0"
							:url="item2.url">
							<image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}">
							</image>
						</navigator>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 轮播图的数据
				swiperList: [],
				// 分类栏里面的数据
				navList: [],
				// 楼层的数据列表
				floorList: [],
			};
		},
		onLoad() {
			// 在页面刚开始加载的时候，调用请求轮播图数据的函数
			this.getSwiperList()
			// 调用请求分类数据的函数
			this.getNavList()
			// 调用获取楼层数据的方法
			this.getFloorList()
		},
		methods: {
			async getSwiperList() {
				// 发起请求,对象解构data重命名为res
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/swiperdata')
				// 请求失败，弹一个错误的消息 
				if (res.meta.status !== 200) {
					return uni.$showMsg()
				}
				// 请求成功，将请求到的数据传递到data里面
				this.swiperList = res.message
			},
			async getNavList() {
				// 这里面的this指向VucComponent
				// console.log(this)
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/catitems')
				// return跳出函数
				if (res.meta.status !== 200) {
					return uni.$showMsg()
				}
				this.navList = res.message
			},
			navClickHandler(item) {
				// 判断点击的是哪个 nav
				if (item.name === '分类') {
					// 内部跳转到现有的页面
					uni.switchTab({
						url: '../cate/cate'
					})
				}
			},
			async getFloorList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/floordata')
				if (res.meta.status !== 200) {
					return uni.$showMsg()
				}
				// 添加自己的url属性
				res.message.forEach(floor => {
					floor.product_list.forEach(prod => {
						prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
					})
				})
				this.floorList = res.message
			},
			// 跳转到搜索页面
			goToSearch(){
				uni.navigateTo({
					url: '/subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
	// 轮播图区域的样式
	swiper {
		height: 330rpx;

		.swiper-item,
		image {
			width: 100%;
			height: 100%;
		}
	}

	// 分类区域的样式
	.nav-list {
		display: flex;
		justify-content: space-around;
		margin: 15px 0;

		.nav-img {
			width: 128rpx;
			height: 140rpx;
		}
	}

	// 楼层的样式
	.floor-title {
		height: 60rpx;
		width: 100%;
		display: flex;
	}

	.right-img-box {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}

	.floor-img-box {
		display: flex;
		padding-left: 10rpx;
	}
	
	// 首页搜索框吸顶效果
	.box-search {
		position: sticky;
		top: 0;
		z-index: 99;
	}
</style>
