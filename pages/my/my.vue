<template>
	<view>
		<!--  -->
		<my-login v-if="!token"></my-login>
		<my-userinfo v-else></my-userinfo>
	</view>
</template>

<script>
	import CartBadge from '../../mixins/CartBadge.js'
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				mixins: [CartBadge]
			};
		},
		computed: {
			...mapState('m_user', ['token']),
		}
	}
</script>

<style lang="scss">
	page,
	.my-container {
		height: 100%;
	}
</style>
