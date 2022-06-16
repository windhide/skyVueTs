<template lang="">
    <div>
        <div class="nav08_bg">
            <div class="nav08_bt">活动时间</div>
        </div>
        <div style="margin:30px auto;">
            <el-radio-group v-model="UserSelectAct" style="margin:10px auto 0px;" v-for="(item,i) in activity" :key="'SOA_'+i"  size="large">
               <button><el-radio-button :label="item.activityName" /></button>
            </el-radio-group>
        </div>
        <div style="width:80%;margin:10px auto;">
            <div v-for="item in colorAndTitle" :key="item.titleColor+'s'" style="text-align:left;">
                <div class="head" :style="'background-color:'+item.titleColor" />&nbsp;&nbsp;{{item.activityName}}
            </div>
            <el-calendar v-model="canlendarValue">
                <template #dateCell="{ data }">
                    <p style="text-align:left">{{ data.day.split('-')[2]}}</p>
                    <div v-for="(item,index) in activity" :key="index+'ac'">
                        <div v-if="activityTimeIshave(item,data.day)">
                            <div v-if="colorAndTitle.length != 0" class="canlendar-bar" :style="'background-color:'+ colorAndTitle[index].titleColor " />
                            <!-- 这个↑if如果不加前端会无效报错 -->
                        </div>
                    </div>
                </template>
            </el-calendar>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ServerDataRequest } from '@/apis/defineFunction'
    import {reactive, ref, watch} from 'vue'

    let activity:any = reactive([])
    let selecetedActivity:any = reactive({})
    let UserSelectAct = ref('test')
    let canlendarValue = ref(new Date())
    let colorAndTitle:any = reactive([])

    ServerDataRequest("/activity/select").then(async (res)=>{
        await (activity.push(...res))
        await (selecetedActivity = res[0])
        await colorRandom()
    })

    watch(UserSelectAct,_=>{ reloadCalendar() })

    function reloadCalendar(){ // 标签选择跳转日历的地址
        for(let i = 0;i<activity.length;i++){
            if(activity[i].activityName == UserSelectAct.value){
                selecetedActivity = activity[i]
                break
            }
        }
        let startTime = selecetedActivity.activityStartTime
        startTime = startTime.replace("年","-").replace("月","-").replace("日","")
        canlendarValue.value = new Date(startTime)
    }

    function  activityTimeIshave(item:any,inDate:any){ // 将活动的时间植入到canlendar
       try { // catch包住错误防止误报错
            let startTime = item.activityStartTime
            let endTime = item.activityEndTime
            startTime = new Date(startTime.replace("年","-").replace("月","-").replace("日","")).getTime()
            endTime = new Date(endTime.replace("年","-").replace("月","-").replace("日","")+" 8:00:00").getTime()
            let date = new Date(inDate).getTime()
                if(date >= startTime && date <= endTime) return true
                else return false
       } catch (error) {
    
       }
    }

    function colorRandom(){//十六进制颜色随机
    	for(let i = 0 ; i < activity.length;i++){
    	    var color = "rgb(" + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 10) + ')';
            colorAndTitle.push({ // 给出现的每一个活动时间带上名字和颜色放在日历的上方
                activityName:activity[i].activityName,
                titleColor:color,
            })
        }
    }

   
</script>

<style scoped>
 .el-radio-group button{
    margin: 0;
    padding:0;
    border:0px;
 }
 .head{
    height:1vh;
    width:2vh;
    border-radius: 5555px;
    float:left;
 }
 .canlendar-bar{
    width:100%;
    height:1vh;
    border-radius: 9999px;
    margin-bottom: 3%;
 }
</style>