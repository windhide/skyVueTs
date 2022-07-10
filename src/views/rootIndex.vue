<template>
	 <div id="pc">
			<div id="content">
				<!-- 内容左侧选择区域 -->
			<ul id="cleft">
				<div class="cleft_top">
					<div class="cleft_topbg" />
					<div class="cleftbg_p">光遇攻略站后台</div>
				</div>
			    <li id="cleft_li01" style="background-color: #ececec;"><img src="/api/font/root01.webp" /><span>后台</span></li>
			    <a @click="changeState(3)"><li id="cleft_li03"><img src="/api/font/root02.webp" /><span>先祖管理</span></li></a>
			    <a @click="changeState(4)"><li id="cleft_li04"><img src="/api/font/root03.webp" /><span>物品管理</span></li></a>
			    <a @click="changeState(5)"><li id="cleft_li05"><img src="/api/font/root04.webp" /><span>复刻管理</span></li></a>
			    <a @click="changeState(7)"><li id="cleft_li07"><img src="/api/font/root05.webp" /><span>骗子管理</span></li></a>
			    <a @click="changeState(8)"><li id="cleft_li08"><img src="/api/font/root06.webp" /><span>活动管理</span></li></a>
			    <a @click="changeState(9)"><li id="cleft_li09"><img src="/api/font/root07.webp" /><span>留言管理</span></li></a>
			    <a @click="changeState(10)"><li id="cleft_li10"><img src="/api/font/root08.webp" /><span>季节管理</span></li></a>
			</ul>
			<!-- 内容左侧选择区域 -->
			<!-- 
				单router-view内存消耗少但是无切换动画
				如果用下面这种方法有切换动画但是内存消耗高
			 -->
			<div id="cright">
				<!--第一页 - 首页-HTML页面-->
				<div id="nav01">	
					<rootNav01 />
				</div>
				<div id="nav03">
					<rootNav03 v-if="state3" />
				</div>
				<div id="nav04">
 					<rootNav04 v-if="state4" /> 
				</div>
				<div id="nav05">
					<rootNav05 v-if="state5" />
				</div>
				<div id="nav07"> 
					<rootNav07 v-if="state7" />
				</div>
				<div id="nav08">
					<rootNav08 v-if="state8" />
				</div>
				<div id="nav09">
					<rootNav09 v-if="state9" />
				</div>
				<!-- <div id="nav10"> -->
					<!-- <Root_Nav10 /> -->
				<!-- </div> -->
				
			</div>
		</div>
		<div id="etext"></div>
		<div id="ebg"></div>
		<div id="ebga"></div>
	</div>
</template>


<script lang="ts" setup>
	import rootNav01 from "../components/Root/rootNav01.vue";
	import rootNav03 from "../components/Root/rootNav03.vue";
	import rootNav04 from "../components/Root/rootNav04.vue";
	import rootNav05 from "../components/Root/rootNav05.vue";
	import rootNav07 from "../components/Root/rootNav07.vue";
	import rootNav08 from "../components/Root/rootNav08.vue";
	import rootNav09 from "../components/Root/rootNav09.vue";
	import rootNav10 from "../components/Root/rootNav10.vue";

	import { reactive,nextTick,ref } from 'vue-demi';
	
	let state3:any = ref(false);
	let state4:any = ref(false);
	let state5:any = ref(false);
	let state7:any = ref(false);
	let state8:any = ref(false);
	let state9:any = ref(false);
	let state10:any = ref(false);

	function changeState(item:Number){
		eval("state"+item+".value=false")
		nextTick(function () {
            eval("state"+item+".value=true") // 重新加载组件.
        }) 
	}
</script>

<style>
*{
  padding: 0px;
}
</style>