<template>
  <div>
        <div style="margin:10px auto;">
            <el-input v-model="sereachData" placeholder="请输入先祖名字查询，或选择对应季节查询"  class="input-with-select" style="width:50%" size="large">
                <template #append>
                  <el-button :icon="Search" @click="searchSprit()" />
                </template>
           </el-input> 
           <br>
           <el-radio-group v-model="UserSelectSeason" style="margin:10px auto 0px;" v-for="(item,i) in SeasonOrActivity"  :key="'ss_'+i" size="large">
              <button><el-radio-button :label="item.srName" /></button>
           </el-radio-group>
           <br>
           <el-radio-group v-model="UserSelectMaxMap" style="margin:10px auto 0px;" v-for="(item,i) in MaxMap" :key="'MM_'+i" size="large">
              <button><el-radio-button :label="item.maxName" /></button>
           </el-radio-group>
        </div>

       <div style="width:100%;">
          <el-row>
            <el-col  v-for="(item, index) in Sprit" :key="'sprit_'+index" :span="4" v-if="true">
            <div class="demo-image__preview">
              <el-card :body-style="{ padding: '0px' }">
                <b><span style="color:red"> {{item.spritName}} </span></b>
                <br />
                <el-image style="width: 200px; height: 300px;padding-top: 10px" :src="$staticData+item.spritLink" :preview-src-list="srcList" fit="contain" @click="imageClick($staticData+item.spritCost)" :hide-on-click-modal="true" :preview-teleported="true" />
                  <div class="bottom" style="padding: 10px">
                        <b><p :style="'color:'+colorFuntion(item.miniMap.maxMap.maxName)">地图：{{item.miniMap.maxMap.maxName}} <b>{{item.miniMap.miniName}}</b></p></b>
                        <span style="line-height:25px">所属季节：{{item.seasonOrActivity.srName}}</span>
                  </div>
              </el-card>
            </div>
            </el-col>
          </el-row>
       </div>
  </div>
  <div style="margin:10px auto;display:flex;justify-content:center">
      <el-pagination  v-if="showPage==1" :page-size="1" :pager-count="11" layout="prev, pager, next" :total="Pages" @current-change="handleCurrentChange" />
  </div>
</template>

<script setup lang="ts">
    import { ServerDataRequest,colorFuntion,$staticData } from '@/apis/defineFunction'
    import { Search } from '@element-plus/icons-vue'
    import {reactive, ref, watch} from 'vue'
    
    let UserSelectSeason = ref('全部')
    let UserSelectMaxMap = ref('全部')
    let sereachData = ref('')
    let Pages = ref(0)
    let NowPages = ref(1)
    let showPage = ref(1)
    let SeasonOrActivity:any = reactive([])
    let MaxMap:any = reactive([])
    let Sprit:any = reactive([])
    let srcList = ['https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg']
    //加数据
    ServerDataRequest('/SeasonOrActivity/daohang').then((res)=>{SeasonOrActivity.push(...res)})
    ServerDataRequest("/sprit/SpritPage").then((res)=>{Pages.value = res})
    ServerDataRequest("/MaxMap/select").then((res)=>{MaxMap.push(...res)})
    selectBySpritsPage();

    //监听
    watch(UserSelectSeason,_=>{ searchSprit() })
    watch(UserSelectMaxMap,_=>{ searchSprit() })
    watch(NowPages,_=>{ selectBySpritsPage() })

    //方法体
    function selectBySpritsPage(){
        ServerDataRequest("/sprit/select?id="+NowPages.value).then((res)=>{Sprit.length = 0; Sprit.push(...res)})
    }
    function handleCurrentChange(val:number) {
        NowPages.value = val
    }
    function searchSprit(){
        if(sereachData.value == "" && UserSelectSeason.value == '全部'  &&  UserSelectMaxMap.value == '全部'){
           showPage.value = 1; // 显示分页条
           NowPages.value = 1;// 重置分页条页码
           selectBySpritsPage(); // 重新加载
        }else{
           showPage.value = 0;
           let url = 
           "/sprit/sreach?sereachData="  + sereachData.value  +
           '&SeasonName='  + UserSelectSeason.value +
           '&MaxmapName='  + UserSelectMaxMap.value
           ServerDataRequest(url).then((res)=>{Sprit.length = 0; Sprit.push(...res)})
        }
    }
    function imageClick(url:string){
        srcList.push(url)
        srcList.splice(0,1);
    }
</script>

<style scoped >

 .demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}

.image {
  width: 100%;
  display: block;
}

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }

 .el-select .el-input {
    width: 500px;
  }
 .input-with-select .el-input-group__prepend {
   background-color: var(--el-fill-color-blank);
 }
 .el-radio-group button{
    margin: 0;
    padding:0;
    border:0px;
 }
</style>