<template lang="">
    <div class="nav09_bg">
		<div class="nav09_bg">
			<div class="nav09_bt">奇妙留言</div>
		</div>
        <div style="width:50%; height:50%;margin:5vh auto">
            <el-card class="box-card" style="height:50vh;margin-top:5vh;">
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

<script setup lang="ts">
    import {ChatDotRound} from "@element-plus/icons-vue"
    import { ref,reactive } from 'vue'
    import { ServerDataRequest,notify_messeage } from '@/apis/defineFunction'

    let talkMesseage:any = reactive([])
    let Messeage = ref('')

    ServerDataRequest("/talkMesseage/select").then(res =>{talkMesseage.splice(0,99999999);talkMesseage.push(...res)})
    setInterval(() => {
    ServerDataRequest("/talkMesseage/select").then(res =>{talkMesseage.splice(0,99999999);talkMesseage.push(...res)})
    }, 20000);

    function getFinalID(){
        return localStorage.getItem('loginID')
    }
    function getCurrentTime() {
        //获取当前时间
        let myDate = new Date()  
        let yy = String(myDate.getFullYear())  
        let mm = myDate.getMonth() + 1  
        let dd = String(myDate.getDate())  
        let hou = String(myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours())  
        let min = String(myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes())  
        let sec = String(myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds())  
        let nowdata = yy + '年' + mm + '月' + dd +'日' + " " + hou + ':' + min + ':' + sec  
        return nowdata
    }
    async function sendMesseage(){
        if(Messeage.value == ''){
            notify_messeage("请先输入消息","error")
            return false
        }

        if(localStorage.getItem('loginID') == ''){
            notify_messeage("请先登录！！","error")
            return false
        }

        let url ="/talkMesseage/insert?talkMesseageContent="+Messeage.value + "&"
            + "talkMesseageAccountID=" + localStorage.getItem('loginID') + "&"
            + "talkMesseageTime=" + getCurrentTime()
        await ServerDataRequest(url).then(async (res) =>{
            if(res){
                await notify_messeage("发送消息成功","success")
                Messeage.value = ""
                await ServerDataRequest("/talkMesseage/select").then(res =>{talkMesseage.splice(0,99999999);talkMesseage.push(...res)})
            }else{
                await notify_messeage("发送消息失败","error")
            }
        })
    }
</script>

<style scoped>
    .box-card{
        overflow-x:none;
        overflow-y:auto
    }
</style>