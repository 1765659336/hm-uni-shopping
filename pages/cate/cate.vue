<template>
	<view>
		<!-- 自定义搜索栏,可以传递很多属性，用来个性化设计，具体查考components/my-search/my-search.Vue组件查看 -->
		<my-search :boxHeight="searchHeight" @getBoxHeight="getBoxHeight" @myclick="goToSearch"></my-search>
		<view class="scroll-view-container">
			<!-- 左侧一级导航区域 -->
			<!-- 加了:之后style后面的内容就是js表达式了需要带{} -->
			<scroll-view scroll-y :style="{'height': vh - searchHeight + 'px;'}" class="left-scroll-view">
				<!-- block不占有页面结构,不需要添加类名样式时，推荐使用block -->
				<!-- uniapp中循环推荐使用的block在页面中是不显示的，当不需要添加类名的时候可以推荐使用 -->
				<block v-for="(item,index) in cateList" :key="index">
					<view :class="['left-scroll-view-item', active===index ? 'active' : '' ]"
						@click="changeActive(index)">{{item.cat_name}}</view>
				</block>
			</scroll-view>
			<!-- 右侧二级导航区域 -->
			<scroll-view scroll-y :style="{'height': vh - searchHeight + 'px;'}" class="right-scroll-view"
				:scroll-top="scrollTop">
				<view class="right-scroll-view-item" v-for="(item2,index2) in cateListlv2" :key="index2">
					<view class="lv2-item">
						{{item2.cat_name}}
					</view>
					<!-- 动态渲染三级分类的列表数据 -->
					<view class="lv3-list">
						<!-- 三级分类 Item 项 -->
						<view class="lv3-item" v-for="(item3, index3) in item2.children" :key="index3"
							@click="goToGoodsList(item3)">
							<!-- 图片 -->
							<image :src="item3.cat_icon"></image>
							<!-- 文本 -->
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import CartBadge from '../../mixins/CartBadge.js'
	export default {
		data() {
			return {
				// 滚动视图的高度
				vh: 0,
				// 分类页面数据的获取
				cateList: [],
				// 分类页面二级列表的数据
				cateListlv2: [],
				// 记录选择的一级分类
				active: 0,
				// 二级导航栏滚动条开始的位置
				scrollTop: 0,
				// 设置搜索框的高度
				searchHeight: 50
			};
		},
		onLoad() {
			// 调用获取页面的可使用高度赋值给导航条高度的函数
			this.getHeight()
			// 调用获取分类页面数据的函数
			this.getCateList()
		},
		methods: {
			getHeight() {
				// 页面渲染时，自动获取设备的可使用高度
				const sysInfo = uni.getSystemInfoSync()
				// 将高度赋值给scroll-view
				this.vh = sysInfo.windowHeight
			},
			async getCateList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/categories')
				if (res.meta.status !== 200) {
					uni.$showMsg()
				}
				this.cateList = res.message
				// 默认将第一个一级标题的二级标题内容展示
				this.cateListlv2 = this.cateList[0].children
			},
			// 点击一级导航区域改变active的值，从而给选中的标签添加active类名,给二级导航区域重新赋值,改变二级导航条的默认开始位置
			changeActive(index) {
				this.active = index
				// 重新给二级导航区赋值
				this.cateListlv2 = this.cateList[index].children
				// 当用户点击一级导航条时，将data中的scrollTop的值修改，才能触发页面重新渲染，直接赋值为0的话页面不会重新渲染
				this.scrollTop = this.scrollTop == 1 ? 0 : 1
			},
			// 点击三级标题前往商品展示页面
			goToGoodsList(item3) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?cid=' + item3.cat_id
				})
			},
			goToSearch() {
				uni.navigateTo({
					url: '/subpkg/search/search'
				})
			}
		},
		mixins: [CartBadge]
	}
</script>

<style lang="scss">
	.scroll-view-container {
		display: flex;

		// 左侧滚动条
		.left-scroll-view {
			width: 120px;

			// 左侧内部标签
			.left-scroll-view-item {
				height: 50px;
				text-align: center;
				line-height: 50px;
				background-color: #f7f7f7;
				font-size: 12px;
			}

			// 选中左侧一级导航区的样式
			.active {
				background-color: #ffffff;
				position: relative;

				// &父级选择器的别名
				&::before {
					content: '';
					display: block;
					width: 3px;
					height: 30px;
					background-color: #c00000;
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}

		// 右侧样式
		// 二级标签的样式
		.right-scroll-view-item {
			font-size: 12px;
			font-weight: bold;
			text-align: center;
			padding: 15px 0;

			.lv3-list {
				display: flex;
				flex-wrap: wrap;

				.lv3-item {
					width: 33.33%;
					margin-bottom: 10px;
					display: flex;
					flex-direction: column;
					align-items: center;

					image {
						width: 60px;
						height: 60px;
					}

					text {
						font-size: 12px;
					}
				}
			}
		}
	}

	// 通过 rpx 设置元素和字体的大小，小程序在不同尺寸的屏幕下，可以实现自动适配，如果直接给固定的就使用px
</style>
