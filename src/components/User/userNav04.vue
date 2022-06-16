<template>
<div>
       <div style="margin:10px auto;">
            <el-input v-model="sereachData" placeholder="请输入先祖名字查询，或选择对应季节查询"  class="input-with-select" style="width:50%"  size="large">
             <el-button slot="append" @click="getdataForSreach()">搜索</el-button>
           </el-input>
           <br>
           <el-radio-group v-model="UserSelectSeasson" style="margin:10px auto 0px;" v-for="(item,i) in SeasonOrActivity.values" :key="'SOA_'+i"  size="large">
              <button><el-radio-button :label="item.srName" /></button>
           </el-radio-group>
           <br>
           <el-radio-group v-model="UserSelectItemType" style="margin:10px auto 0px;" v-for="(item,i) in ItemType.values" :key="'IT_'+i"  size="large">
              <button><el-radio-button :label="item.itemTypeName" /></button>
           </el-radio-group>
           <br>
           <el-radio-group v-model="UserSelectMaxMap" style="margin:10px auto 0px;" v-for="(item,i) in MaxMap.values" :key="'MM_'+i" size="large">
              <button><el-radio-button :label="item.maxName" /></button>
           </el-radio-group>
        </div>
       <div style="width:100%;display:flex">
            <el-row>
                <el-col  v-for="(items, index) in item.values" :key="index" :span="3" >
                <div class="demo-image__preview">
                  <el-card :body-style="{ padding: '0px' }">
                     <el-image style="width: 90px; height: 80px;padding-top: 5px" :src="$staticData+items.itemLink" :preview-src-list="srcList" fit="contain" @click="imageClick($staticData+items.sprit.spritCost,$staticData+items.sprit.spritLink)" :hide-on-click-modal="true"   :preview-teleported="true" />
                            <div>
                              <p style="line-height:25px"><b>{{items.itemName}}</b></p>
                              <p style="line-height:25px;">{{items.sprit.spritName}}</p>
                              <b><p :style="'line-height:25px;'+'color:'+colorFuntion(items.sprit.miniMap.maxMap.maxName)">{{items.sprit.miniMap.maxMap.maxName}}</p></b>
                            </div>
                  </el-card>
                  </div>
                </el-col>
            </el-row>
   </div>
</div>
  <div style="margin:10px auto;display:flex;justify-content:center">
      <el-pagination   v-if="showPage==1" :page-size="1" :pager-count="11" layout="prev, pager, next" :total="Pages" @current-change="handleCurrentChange" />
  </div>
</template>


<script setup lang="ts">
    // import 所需要的方法
    import { ServerDataRequest,colorFuntion,$staticData } from '@/apis/defineFunction'
    import {reactive, ref, watch} from 'vue'
    
    let item:any = reactive([])
    let SeasonOrActivity:any = reactive([])
    let ItemType:any = reactive([])
    let MaxMap:any = reactive([])
    let sereachData = ref("")
    let UserSelectSeasson = ref("全部")
    let UserSelectItemType = ref("全部")
    let UserSelectMaxMap = ref("全部")
    let Pages = ref(0)
    let NowPages = ref(1)
    let showPage = ref(1)
    let srcList = [
        'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        ]
    
    //setup会在创建的时候调用方法完成数据的获取
    ServerDataRequest("/itemType/select").then((res) => {ItemType.values = res;});
    ServerDataRequest("/MaxMap/select").then((res) => {MaxMap.values = res;});
    ServerDataRequest("/SeasonOrActivity/daohang").then((res) => {SeasonOrActivity.values = res;});
    ServerDataRequest("/item/itemPage").then((res) => {Pages.value = res;});
    ItemPageSelect();
    
    // 监听执行方法
    watch(UserSelectSeasson,_=>{getdataForTTT()})
    watch(UserSelectItemType,_=>{getdataForTTT()})
    watch(UserSelectMaxMap,_=>{getdataForTTT()})
    watch(NowPages,_=>{ItemPageSelect()})
    
    function getdataForSreach(){
        showPage.value = 0; // 隐藏分页条
        let SreachUrl =
          "/item/sreach?sreach=" + sereachData.value +
          "&season=" + UserSelectSeasson.value +
          "&Type=" + UserSelectItemType.value +
          "&Map=" + UserSelectMaxMap.value;
        ServerDataRequest(SreachUrl).then((res) => {item.values = res;});
        sereachData.value = "";
    }
    
    function imageClick(url:any,url2:any){
        srcList.splice(0,2)
        srcList.push(url)
        srcList.push(url2)
    }
    
    function getdataForTTT(){
        if (UserSelectSeasson.value == "全部" && UserSelectItemType.value == "全部" &&  UserSelectMaxMap.value == "全部") {
          showPage.value = 1; // 显示分页条
          NowPages.value = 1; // 重置分页条页码
          ItemPageSelect(); // 重新加载
        } else {
          let TTTURL =
            "/item/sreach?sreach=" + sereachData.value +
            "&season=" + UserSelectSeasson.value +
            "&Type=" + UserSelectItemType.value +
            "&Map=" + UserSelectMaxMap.value;
          ServerDataRequest(TTTURL).then((res) => {item.values = res;});
        }
    }
    
    function ItemPageSelect(){
        ServerDataRequest("/item/select?id=" + NowPages.value).then((res) => {item.values = res;});
    }
    
    function handleCurrentChange(val:number) {
        NowPages.value = val;
    }

</script>

<style scoped>
.el-radio-group button {
  margin: 0;
  padding: 0;
  border: 0px;
}
</style>