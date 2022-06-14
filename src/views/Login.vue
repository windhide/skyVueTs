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
				 	<i :class="isLogin?'fa fa-check':'fa fa-times'" />
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

<script>
import {mapMutations} from "vuex";
export default {
	data() {
		return {
			username:'',
			password:'',
			regusername:'',
			regpassword:'',
			regpassword2:'',
			userToken:'',
			isLogin:'',
			loginID:'',
		}
	},
	methods: {
        ...mapMutations(["changeLogin"]),
		async login(){
			let v=this;
			this.ServerDataRequest("/account/Login?username="+v.username+"&password="+v.password).then(async (res)=>{
				 await (v.userToken = res.token)
				 await (v.isLogin = res.isLogin)
				 if(res.isLogin){
					 await this.ServerDataRequest("/account/findID?username="+v.username).then(res =>{v.loginID = res})
					 await v.notify_messeage("欢迎您登录"+v.username,"success")
					 await console.log(v.userToken == "")
                     await v.changeLogin({ Authorization:v.userToken,loginUsername:v.username,loginID:v.loginID});
					 await setTimeout(async () => {
						 await v.$router.push('/');
					 	 await v.$router.go(0) 
						// 方法区
					}, 500);
				}else{
					await v.notify_messeage("用户名或密码错误！","warning")
				}
			})
		},
		async registerAccount(){
			let v=this;
			if(v.regusername == '' || v.regpassword == '')
				await v.notify_messeage("用户名或密码不能为空","warning")
			else{
				if(v.regpassword != v.regpassword2 || v.regpassword == '' || v.regpassword2 == '')
					await v.notify_messeage("两次密码输入不一致！","warning")
				else{
					this.ServerDataRequest("/account/Check?username="+v.regusername).then(async (res) =>{
						if(res){
							await v.notify_messeage("该用户名已经存在了,换一个试试","warning")
						}else{
							await this.ServerDataRequest("/account/Register?username="+v.regusername+"&password="+v.regpassword).then(async (res) =>{
								v.notify_messeage("注册成功自动登录中....")
								await setTimeout(async() => {
									await (v.username = v.regusername)
									await (v.password = v.regpassword)
									await v.login();
								}, 500);
							})
						}
					})
				}
			}

			
		}
	},
	mounted: function() {
    if (location.href.indexOf("#check")<=0) {
      location.href = location.href + "#check";
      location.reload();
    }
  }
}
</script>

<style scoped>
</style>
	
