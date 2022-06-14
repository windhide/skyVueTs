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

<script>
export default {
    data() {
        return {
            activity:[],
            selecetedActivity:{},
            UserSelectAct:'test',
            canlendarValue:new Date(),
            colorAndTitle:[],
        }
    },
    methods:{
        activityTimeIshave(item,inDate){ // 将活动的时间植入到canlendar
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
        },
        reloadCalendar(){ // 标签选择跳转日历的地址
            for(let i = 0;i<this.activity.length;i++){
                if(this.activity[i].activityName == this.UserSelectAct){
                    this.selecetedActivity = this.activity[i]
                    break
                }      
            }
            let startTime = this.selecetedActivity.activityStartTime
            startTime = startTime.replace("年","-").replace("月","-").replace("日","")
            this.canlendarValue = new Date(startTime)
        },
        colorRandom(){//十六进制颜色随机
			for(let i = 0 ; i < this.activity.length;i++){
			    var color = "rgb(" + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 10) + ')';
                this.colorAndTitle.push({ // 给出现的每一个活动时间带上名字和颜色放在日历的上方
                    activityName:this.activity[i].activityName,
                    titleColor:color,
                })
            }
		},
    },
    created() {
        this.ServerDataRequest("/activity/select").then(async (res)=>{
            await (this.activity = res)
            await (this.selecetedActivity = res[0])
            await this.colorRandom()
        })
    },
    watch: {
        UserSelectAct:'reloadCalendar',
    },
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