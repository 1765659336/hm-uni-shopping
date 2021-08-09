import {
		mapGetters
	} from 'vuex'
	export default {
		computed: {
			...mapGetters('m_cart', ['total'])
		},
		onLoad() {
			this.setBadge()
		},
		methods: {
			setBadge() {
				uni.setTabBarBadge({
					index: 2, // 索引
					text: this.total + '' // 注意：text 的值必须是字符串，不能是数字
				})
			}
		}
	}
