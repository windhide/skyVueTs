<template lang="">
    <div class="nav09_bg">
		<div class="nav09_bg">
			<div class="nav09_bt">奇妙留言</div>
		</div>
        <div style="width:50%; height:50%;margin:5vh auto">
            <el-card class="box-card" style="height:50vh;margin-top:5vh">
                <div v-for="(item, index) in talkMesseage" :key="index">
                    <div v-if="item.account.accountID == getFinalID()">
                        <p style="text-align:right;color:#F56C6C">我&nbsp&nbsp&nbsp{{item.talkMesseageTime}}</p>
                        <p style="text-align:right;color:#F56C6C">&nbsp&nbsp&nbsp {{item.talkMesseageContent}}</p>
                    </div>
                    <div v-else>
                        <p style="text-align:left;color:#409EFF">用户[{{item.account.accountUsername}}]&nbsp&nbsp&nbsp{{item.talkMesseageTime}}</p>
                        <p style="text-align:left;color:#409EFF">&nbsp&nbsp&nbsp {{item.talkMesseageContent}}</p>
                    </div>
                    <br>
                </div>
             </el-card>
            <el-input placeholder="请输入内容" v-model="Messeage" class="input-with-select" style="margin-bottom:5vh" shallowRef>
                <template #append>
                    <el-button :icon="ChatDotRound" @click="sendMesseage()"></el-button>
                </template>
            </el-input>
        <br>
        </div>
	</div>
</template>

<script>
import {ChatDotRound} from "@element-plus/icons-vue"
import { shallowRef } from 'vue'
export default {
    data() {
        return {
            talkMesseage:[],
            Messeage:'',
            online:false,
            ChatDotRound:shallowRef(ChatDotRound), //这里是因为需要一个shallowRef
        }
    },
    methods:{
        getFinalID(){
            return localStorage.getItem('loginID')
        },
        getCurrentTime() {
           //获取当前时间
        		let myDate = new Date()  
        		let yy = String(myDate.getFullYear())  
        		let mm = myDate.getMonth() + 1  
        		let dd = String(myDate.getDate())  
        		let hou = String(myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours())  
        		let min = String(myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes())  
        		let sec = String(myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds())  
        		this.nowDate = yy + '年' + mm + '月' + dd +'日' 
        		this.nowTime = hou + ':' + min + ':' + sec  
                let nowdata=this.nowDate+" "+this.nowTime
                return nowdata
        },
        async sendMesseage(){
            if(this.Messeage == ''){
                this.notify_messeage("请先输入消息","error")
                return false
            }
            if(localStorage.getItem('loginID') == ''){
                this.notify_messeage("请先登录！！","error")
                return false
            }
            let url ="/talkMesseage/insert?talkMesseageContent="+this.Messeage + "&"
            + "talkMesseageAccountID=" + localStorage.getItem('loginID') + "&"
            + "talkMesseageTime=" + this.getCurrentTime()
            await this.ServerDataRequest(url).then(async (res) =>{
                if(res){
                    await this.notify_messeage("发送消息成功","success")
                    this.Messeage = ""
                    await this.ServerDataRequest("/talkMesseage/select").then(res =>{this.talkMesseage = res})
                }else{
                    await this.notify_messeage("发送消息失败","error")
                }
            })
        }
    },
    created(){
        this.ServerDataRequest("/talkMesseage/select").then(res =>{this.talkMesseage = res})
        setInterval(() => {
            this.ServerDataRequest("/talkMesseage/select").then(res =>{this.talkMesseage = res})
        }, 20000);
    }
   
}
</script>

<style scoped>
    .box-card{
        overflow-x:none;
        overflow-y:auto
    }
</style>