<template>
    <div id="pc">
			<div id="content">
				<!-- 内容左侧选择区域 -->
			<ul id="cleft">
				<div class="cleft_top">
					<div class="cleft_topbg">
						<div class="cleftbg_img"><img src="/api/image/tx.jpg" alt="头像"></div>
					</div>
				    <div class="cleftbg_p" style="color:#409EFF" v-if="getloginUsername()!=''">{{"欢迎您登录!\t用户:"+getloginUsername()}}</div>
					<div class="cleftbg_p" style="color:#409EFF" v-else>
						登录后可以留言和发布骗子信息哦
					</div>
				</div>
			    <li id="cleft_li01" style="background-color: #ececec;"><img src="/api/font/root01.webp" /><span>网站首页</span></li>
			    <li id="cleft_li02"><img src="/api/font/root02.webp" /><span>关于我</span></li>
			    <a @click="clickADD(3)"><li id="cleft_li03"><img src="/api/font/user04.webp" /><span>先祖信息</span></li></a>
			    <a @click="clickADD(4)"><li id="cleft_li04"><img src="/api/font/user05.webp" /><span>物品信息</span></li></a>
			    <a @click="clickADD(5)"><li id="cleft_li05"><img src="/api/font/user02.webp" /><span>复刻信息</span></li></a>
			    <a @click="clickADD(7)"><li id="cleft_li07"><img src="/api/font/user07.webp" /><span>骗子预警</span></li></a>
			  	<a @click="clickADD(8)"><li id="cleft_li08"><img src="/api/font/user08.webp" /><span>活动时间</span></li></a>
				<a @click="clickADD(9)"><li id="cleft_li09"><img src="/api/font/user03.webp" /><span>奇妙留言</span></li></a>
				<a @click="clickADD(10)"><li id="cleft_li10"><img src="/api/font/user01.webp" /><span>季节信息</span></li></a>
				<div style="margin-top:5vh">
					<el-button type="danger" plain round v-if="getloginUsername()!=''" @click="logOut()" >退出登录 😫</el-button>
					<el-button type="primary" plain round v-else  @click="login()">太炫酷了马上去登录 🥳</el-button>
					<br>
					<br>
					<el-button type="primary" plain round v-if="getloginUsername()=='admin'" @click="goRoot()" >进入管理页面 👻</el-button>
				</div>

			</ul>
			<!-- 内容左侧选择区域 -->
			<!-- 
				单router-view内存消耗少但是无切换动画
				如果用下面这种方法有切换动画但是内存消耗高
			 -->
			<div id="cright">
				<!--第一页 - 首页-HTML页面-->
				<div id="nav01">
					<userNav01 />
				</div>
				<!-- 第二页 - 关于本站 -->
				<div id="nav02">
					<userNav02 />
				</div>
				<!-- 第三页 - 先祖信息 -->
				<div id="nav03">
					<userNav03 v-if="StateCheck(3)" />
				</div>
				<!-- 第四页 - 物品信息 -->
				<div id="nav04">
					<userNav04 v-if="StateCheck(4)" />
				</div>
				<!-- 第五页 - 复刻信息 -->
				<div id="nav05">
					<userNav05 v-if="StateCheck(5)" />
				</div>
				<!-- 第七页 - 骗子预警 -->
				<div id="nav07">
					<userNav07 v-if="StateCheck(7)" />
				</div> 
				<!-- 第八页 - 活动 -->
				<div id="nav08">
					<userNav08  v-if="StateCheck(8)"/>
				</div>
				<!-- 第九页 - 留言 -->
				<div id="nav09">
					<userNav09  v-if="StateCheck(9)"/>
				</div>
				<!-- 第十页 - 后台管理 -->
				<div id="nav10">
					<userNav10  v-if="StateCheck(10)"/>
				</div>
			</div>
		</div>
		<div id="etext"></div>
		<div id="ebg"></div>
		<div id="ebga"></div>
		<div id="xuna"></div>
	</div>
</template>

<script>
import userNav01 from '@/components/User/userNav01'
import userNav02 from '@/components/User/userNav02'
import userNav03 from '@/components/User/userNav03'
import userNav04 from '@/components/User/userNav04'
import userNav05 from '@/components/User/userNav05'
import userNav07 from '@/components/User/userNav07'
import userNav08 from '@/components/User/userNav08'
import userNav09 from '@/components/User/userNav09'
import userNav10 from '@/components/User/userNav10'
import {mapState} from "vuex";
export default {
  name: "Index",
  components: {
    userNav01,
    userNav02,
    userNav03,
    userNav04,
    userNav05,
    userNav07,
    userNav08,
    userNav09,
    userNav10,
  },
  data(){
	  return{
		  ifShow:1,
		  ShowState:[],
	  }
  },
  methods:{
	  goRoot(){
		setTimeout(async () => {
				await this.$router.push('/root');
		  		await this.$router.go(0) 
						// 方法区
		}, 500);
	  },
	  login(){
		  this.$router.push('/login');
	  },
	  logOut(){
		  localStorage.setItem('Authorization','')
		  localStorage.setItem('loginUsername','')
		  localStorage.setItem('loginID','')
		  this.notify_messeage("注销用户成功,请等待网页刷新","success")
		  setTimeout(async() => {
		  	this.$router.go(0) 
		  }, 500);
	  },
	  getloginUsername(){
		  return localStorage.getItem('loginUsername')
	  },
	  clickADD(item){
		  this.ShowState.push(item);
	  },
	  StateCheck(item){
		  for(let i = 0 ; i < this.ShowState.length ; i++){
			  if(this.ShowState[i] == item)	return true;
		  }
		  return false;
	  }
  },
};
</script>

<style scoped>
</style>