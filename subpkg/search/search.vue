<template>
	<view>
		<view class="box-search">
			<uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
		</view>
		<!-- 搜索结果 -->
		<!-- 需要频繁切换，那么我们使用v-show会比v-if效率高，但是感觉用户也不用一直点搜索搜索吧 -->
		<view class="result-List" v-if="keyValue.length !== 0 && searchResult.length !== 0">
			<view class="result-item" v-for="(item,index) in searchResult" @click="goToGoodsDetail(item)">
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="17"></uni-icons>
			</view>
		</view>
		<view class="sihuo" v-else-if="sihuoLock">
			<view class="errorMsg-Box">
				<uni-icons type="eye-slash-filled" size="17"></uni-icons>
				<view class="errorMsg">
					暂未查询到相关商品信息
				</view>
			</view>
			<view class="image_ct">
				<image src="../../static/ct/mmexport1621952288900.jpg"></image>
			</view>
		</view>
		<!-- 搜索历史 -->
		<!-- 将搜索历史记录模块作为v-else，作为默认展示，就不会在等待响应的时候出现未查询到相关商品信息了 -->
		<view class="history-box" v-else>
			<!-- 标题区域 -->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="clearHistoryList"></uni-icons>
			</view>
			<!-- 列表区域 -->
			<view class="history-list">
				<uni-tag :text="item" v-for="(item, i) in historyList" :key="i" :circle="true" @click="goToGoodsList(item)"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 用户输入的关键字
				keyValue: '',
				// 根据用户输入的关键字查询到的商品
				searchResult: [],
				// 搜索关键词的历史记录
				historyList: [],
				// 用来决定输入了之后，因为接口的延迟还未查询到商品，会显示未查询到商品的bug,会一闪而过
				sihuoLock: false
			};
		},
		onLoad() {
			// 切换页面回来去本地读取搜索记录
			this.historyList = JSON.parse(uni.getStorageSync('historyList') || '[]')
		},
		methods: {
			// 搜索框value值改变调用的函数
			input(value) {
				// 用户每次输入都会执行这个函数，会发送过多的请求，需要做防抖处理
				clearTimeout(this.timer)
				// 使用箭头函数将this指向出去到VueComponent身上
				this.timer = setTimeout(() => {
					// 调用查询的商品列表的方法
					this.getResult(value)
				}, 500)
			},
			async getResult(value) {
				// 当搜索框中的值为空时，不调用请求接口
				/* 学习到的一个知识点，return的作用是退出当前作用域，返回到上一级作用域继续执行代码，当前作用域的代码不会执行，当if/for中使用
				 return时，因为if/for不具有作用域，所以是直接退出if/for所在的函数作用域
				 */
				// 一进来就初始化sihuoLock的值为false,进来这个函数了说明重新发请求了，就需要把为查询到商品提示信息隐藏
				this.sihuoLock = false
				this.keyValue = value
				if (this.keyValue === '') {
					// 当用户清空搜索框时，需要将之前的搜索结果清空
					this.searchResult = []
					return
				}
				// 发送请求,老师的高级写法，看不明白,换成自己的写法
				// const {data:res} = await uni.$http.get('/api/public/v1/goods/qsearch' , {query: this.keyValue})
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/qsearch?query=' + this.keyValue)
				if (res.meta.status !== 200) return uni.$showMsg()
				this.searchResult = res.message
				// 在赋值之后再去判断searchResult是否为空，默认是为空的
				this.sihuoLock = this.keyValue.length !== 0 && this.searchResult.length == 0
				// 调用将关键词存到搜索记录里面的方法
				this.saveHistoryList()
				// 将搜索记录存到本地，切换页面之后回来的时候还能记录上次的数据
				// 调用 uni.setStorageSync(key, value) 将搜索历史记录持久化存储到本地
				uni.setStorageSync('historyList', JSON.stringify(this.historyList))
			},
			goToGoodsDetail(item) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				})
			},
			goToGoodsList(keyValue) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?query=' + keyValue
				})
			},
			saveHistoryList() {
				// 将historyList数组转换为set集合
				const set = new Set(this.historyList)
				// 先删除set中如果存在的搜索记录，不删除虽然也不会被添加进去，但是顺序不会变，我们的需求是每次搜索都会放在最前面，不管是否重复
				set.delete(this.keyValue)
				// 然后将最新的记录添加进去
				set.add(this.keyValue)
				// 将集合转换为数组
				this.historyList = Array.from(set)
				// 颠倒顺序
				this.historyList = this.historyList.reverse()
			},
			clearHistoryList() {
				// 清空页面
				this.historyList = []
				// 清空本地存储
				uni.setStorageSync('historyList', JSON.stringify(this.historyList))
			}
		}
	}
</script>

<style lang="scss">
	// 搜索框吸顶的效果
	.box-search {
		background-color: #C00000;
		position: sticky;
		top: 0;
		z-index: 99;
	}

	// 搜索商品结果展示列表
	.result-List {
		padding: 0 5px;

		.result-item {
			display: flex;
			justify-content: space-between;
			font-size: 12px;
			padding: 13px 0;
			border-bottom: 1px solid #efefef;

			.goods-name {
				// 文本单行显示，不换行
				white-space: nowrap;
				// 溢出部分隐藏
				overflow: hidden;
				// 文本溢出后用...展示
				text-overflow: ellipsis;
				margin-right: 3px;
			}
		}
	}

	// 搜索历史样式
	.history-box {
		padding: 0 5px;

		.history-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 40px;
			font-size: 13px;
			border-bottom: 1px solid #efefef;
		}

		.history-list {
			display: flex;
			flex-wrap: wrap;

			.uni-tag {
				margin-top: 5px;
				margin-right: 5px;
			}
		}
	}

	// 未查询到商品信息
	.sihuo {
		display: flex;
		flex-direction: column;
		padding: 40px 30px;
		border-radius: 20px;
		background-color: #F8F8F8;

		.errorMsg-Box {
			display: flex;
			justify-content: center;

			.errorMsg {
				margin-left: 10px;
				color: #7E7C8A;
			}
		}
	}
</style>
