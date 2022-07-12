<template>
	<div style="text-align:left">
		<div id="ebg"></div>
		<div class="materialContainer">
			<div class="box">
				<div class="title">登录</div>
				<div class="input">
					<label for="name">账号</label>
					<input type="text" v-model="username" id="name" />
					<span class="spin"></span>
				</div>
				<div class="input">
					<label for="pass">密码</label>
					<input type="password" id="pass" v-model="password" />
					<span class="spin"></span>
				</div>
				<div class="button login">
					<button @click="login()">
						<span>登录</span>
						<i :class="isLogin ? 'fa fa-check' : 'fa fa-times'" />
					</button>
				</div>
			</div>
			<div class="overbox">
				<div class="material-button alt-2"><span class="shape"></span></div>
				<div class="title">注册</div>
				<div class="input">
					<label for="regname">用户名</label>
					<input type="text" v-model="regusername" id="regname" />
					<span class="spin"></span>
				</div>
				<div class="input">
					<label for="regpass">密码</label>
					<input type="password" v-model="regpassword" id="regpass" />
					<span class="spin"></span>
				</div>
				<div class="input">
					<label for="reregpass">确认密码</label>
					<input type="password" v-model="regpassword2" id="reregpass" />
					<span class="spin"></span>
				</div>
				<div class="button" style="margin-top:2.5vh">
					<button @click="registerAccount()"><span>注册</span></button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { notify_messeage, ServerDataRequest } from "@/apis/defineFunction"
	import { ref } from "vue"
	import router from '@/router/routerIndex'
	import store from '@/store/storeIndex'

	let username: any = ref("")
	let password: any = ref("")
	let regusername: any = ref("")
	let regpassword: any = ref("")
	let regpassword2: any = ref("")
	let userToken: any = ref("")
	let isLogin: any = ref("")
	let loginID: any = ref("")

	if (location.href.indexOf("#check") <= 0) {
		location.href = location.href + "#check";
		location.reload();
	}

	async function login() {
		ServerDataRequest("/account/Login?username=" + username.value + "&password=" + password.value).then(async (res: any) => {
			await (userToken.value = res.token)
			await (isLogin.value = res.isLogin)
			if (res.isLogin) {
				await ServerDataRequest("/account/findID?username=" + username.value).then((res: any) => { loginID.value = res })
				await notify_messeage("欢迎您登录" + username.value, "success")
				await store.commit("changeLogin",{ Authorization: userToken.value, loginUsername: username.value, loginID: loginID.value })
				await setTimeout(async () => {
					await router.push('/');
					await router.go(0)
					// 方法区
				}, 500);
			} else {
				await notify_messeage("用户名或密码错误！", "warning")
			}
		})
	}

	async function registerAccount() {
		if (regusername == '' || regpassword == '')
			await notify_messeage("用户名或密码不能为空", "warning")
		else {
			if (regpassword.value != regpassword2.value || regpassword.value == '' || regpassword2.value == '')
				await notify_messeage("两次密码输入不一致！", "warning")
			else {
				ServerDataRequest("/account/Check?username=" + regusername.value).then(async (res: any) => {
					if (res) {
						await notify_messeage("该用户名已经存在了,换一个试试", "warning")
					} else {
						await ServerDataRequest("/account/Register?username=" + regusername.value + "&password=" + regpassword.value).then(async (res) => {
							notify_messeage("注册成功自动登录中....", "success")
							await setTimeout(async () => {
								await (username.value = regusername.value)
								await (password.value = regpassword.value)
								await login();
							}, 500);
						})
					}
				})
			}
		}
	}
</script>

<style scoped>
</style>
	
