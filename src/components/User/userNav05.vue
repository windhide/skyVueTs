<template>
  <div style="margin:30px auto; width:90%;height:50%">
              <el-radio-group v-model="Count_Sprit_Select" v-for="(item,i) in Count_Sprit" :key="'MM_'+i">
                <button><el-radio-button :label="item" /></button>
             </el-radio-group>
      <div>
        <div style="display:flex; width:100%">
          <div style="width:100%;">
         <el-card class="box-card" style="height:100%;width:100%">
            <div v-if="SelectReprint.value != null" style="text-align:left">
                <b><p>先祖名称: {{SelectReprint.value.sprit.spritName}}</p></b>
                <b><p :style="'color:'+colorFuntion(SelectReprint.value.sprit.miniMap.maxMap.maxName)">先祖所在位置: {{SelectReprint.value.sprit.miniMap.maxMap.maxName+SelectReprint.value.sprit.miniMap.miniName}}</p></b>
                <b><p style="color:#FF5809">先祖已复刻:{{SelectReprint.value.count}}次</p></b>
                <b><p style="color:#FF5809">距离上次复刻已过去:{{difference()}}天<br /></p></b>
                <b><p style="color:#9F35FF">复刻时间:</p></b>
                <b><p style="color:#9F35FF" v-for="item in ReprintTimer">{{item}}<br /></p></b>
                <br>
                <el-image :src="$staticData+SelectReprint.value.sprit.spritCost" fit="scale-down" style="height:500px"/>
                <el-image :src="$staticData+SelectReprint.value.sprit.spritLink" fit="scale-down" style="height:500px;width:200px;float:left" />
            </div>
            <div v-if="SelectReprint == null">
                没有选择先祖
            </div>
          </el-card>
    </div>
    <div style="width:50%;">
    <!-- :default-sort = "{prop: 'reprintID', order: 'descending'}" -->
        <el-table :data="Reprint" @row-click="cellmouseenter" :row-style="{height: '1px'}"  height="650" border stripe v-if="Count_Sprit_Select == '全部' || Count_Sprit_Select == '选择复刻次数'" >
            <el-table-column align="center" prop="reprintID" label="顺序" width="75"  sortable  />
            <el-table-column align="center" prop="sprit.spritName" label="先祖" width="100" />
            <el-table-column align="center" prop="sprit.seasonOrActivity.srName" label="季节" width="90"   />
            <el-table-column align="center" prop="reprintTime" label="时间"  width="130"  />
       </el-table>
       <el-table :data="CountReprint" @row-click="cellmouseenter"  :row-style="{height: '1px'}"  height="650" border stripe v-else>
            <el-table-column align="center" prop="reprintID" label="顺序" width="75" sortable   />
            <el-table-column align="center" prop="sprit.spritName" label="先祖" width="100" />
            <el-table-column align="center" prop="sprit.seasonOrActivity.srName" label="季节" width="90"   />
            <el-table-column align="center" prop="reprintTime" label="时间"  width="130"  />
       </el-table>
   </div>
  </div>
  </div>
  </div>
</template>

<script setup lang="ts">

    import { ServerDataRequest,colorFuntion,$staticData } from '@/apis/defineFunction'
    import {reactive, ref, watch} from 'vue'
    
    let SelectReprint:any = reactive({})
    let Count_Sprit_Select = ref("全部")
    let Count_Sprit:any = ref(["选择复刻次数", 1, 2, 3, "全部"])
    let Reprint:any = reactive([])
    let CountReprint:any = reactive([])
    let ReprintTimer:String[] = reactive([])

    ServerDataRequest("/reprint/select").then((res) => {Reprint.push(...res) }) // !
    
    watch(Count_Sprit_Select,_=>{
      UserSelect()
    })

    function cellmouseenter(row:any, column:any, cell:any, event:any) {
      SelectReprint.value = row;
      ReprintTimer.splice(0,99999)
      for (let i = 0; i < Reprint.length; i++) {
        if (Reprint[i].spritID == SelectReprint.value.spritID) {
            ReprintTimer.push(Reprint[i].reprintTime);
        }
      }
    }

    function difference() {
      let beginTime = ReprintTimer[ReprintTimer.length-1]
      beginTime = beginTime.replace("年","-")
      beginTime = beginTime.replace("月","-")
      beginTime = beginTime.replace("日","-")
      const yy = new Date().getFullYear()
      const mm = new Date().getMonth() + 1
      const dd = new Date().getDate()
      var dateBegin = new Date(beginTime.replace(/-/g,'/'));
      var dateEnd = new Date(yy + '-' + mm + '-' + dd);
      var dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数
      var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
      return dayDiff;
    }

    function UserSelect() {
      CountReprint.splice(0,999)
      if (Count_Sprit_Select.value != "选择复刻次数") {
        for (let i = 0; i < Reprint.length; i++) {
          if (Reprint[i].count == Count_Sprit_Select.value) {
            CountReprint.push(Reprint[i]);
          }
        }
      }
    }
</script>

<style scoped>
.el-radio-group button {
  margin: 0;
  padding: 0;
  border: 0px;
}
</style>