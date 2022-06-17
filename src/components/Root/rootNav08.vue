<template>
    <div class="nav08_bg">
        <div class="nav08_bt">活动时间</div>
    </div>
    <!-- 顶部筛选部分 -->
    <div style="margin-top:38px;">
          <el-radio-group v-model="SeasonOrActivityTopLabSelect" v-for="(item,i) in SeasonOrActivityTopLab" :key="'MM_'+i" size="large">
                <button><el-radio-button :label="item" /></button>
          </el-radio-group>
         <br>
    </div>
    <!-- 内容主体部分 -->
    <div style="width:70%;margin:20px auto">
        <el-table :data="SeasonOrActivity.filter((data:any) => data.srName.indexOf(dataIndex)!=-1)" height="500" stripe  >
            <el-table-column align="center" prop="srID" label="序号" />
            <el-table-column align="center" prop="srName" label="活动或季节" />
            <el-table-column align="center" prop="srStartTime" label="开始时间" />
            <el-table-column align="center" prop="srEndTime" label="结束时间" />
            <el-table-column align="center" label="操作" width="200">
                <template #default="scope">
                    <el-button size="default"  @click="handleSee(scope.$index, scope.row)" type="primary" plain>查看</el-button>
                    <el-button size="default"  @click="handleDelete(scope.$index, scope.row)" type="danger" plain >删除</el-button>
                </template>  
            </el-table-column>
        </el-table>
        <el-button size="default"  @click="openDrawer('添加活动')" type="success" style="margin-top: 10px;" plain>添加复刻</el-button>
    </div>

    <!-- 新增部分 -->
    <el-drawer v-model="dialog" title="添加物品" :before-close="addHandleClose"  :append-to-body="true">
        <template #default>
            <el-form :model="form" style="width:50%;margin:0 auto" :label-position="'left'">
                <el-form-item label="季节或活动名字" :label-width="formLabelWidth">
                    <el-input v-model="form.srName"></el-input>
                </el-form-item>
                <el-form-item label="开始时间" :label-width="formLabelWidth">
                    <el-date-picker v-model="form.srStartTime" format="YYYY年M月D日" value-format="YYYY年M月D日" type="date" placeholder="选择开始时间" /> 
                </el-form-item>
                <el-form-item label="结束时间" :label-width="formLabelWidth">
                    <el-date-picker v-model="form.srEndTime" format="YYYY年M月D日" value-format="YYYY年M月D日" type="date" placeholder="选择结束时间" /> 
                </el-form-item>
                <el-form-item label="季节/活动" :label-width="formLabelWidth">
                    <el-switch v-model="form.isSeason" class="mb-2" active-text="季节" inactive-text="活动" />
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
          <div style="flex: auto;margin:0px auto">
               <el-button @click="addCancelForm">取 消</el-button>
               <el-button type="primary" @click="addHandleClose">添加</el-button>
          </div>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
    import { ServerDataRequest,notify_messeage } from '@/apis/defineFunction'
    import {reactive, ref, watch} from 'vue'
    import {ElMessageBox} from 'element-plus'

    let SeasonOrActivityTopLab  = ref(['季节','活动'])
    let SeasonOrActivityTopLabSelect = ref('季节')
    let dataIndex = ref('季')
    let dialog = ref(false)
    let SeasonOrActivity:any = reactive([])
    let form:any = ref({
        srName:'',
        srStartTime:'',
        srEndTime:'',
        isSeason:false,
    })
    
    ServerDataRequest("/SeasonOrActivity/select").then(res=>{SeasonOrActivity.length = 0;SeasonOrActivity.push(...res)   })

    watch(SeasonOrActivityTopLabSelect,_=>{
        if (SeasonOrActivityTopLabSelect.value == '季节')
            dataIndex.value = '季'
        else
            dataIndex.value = '活动'
    })

    function openDrawer(title:any){ // 增加的显示组件
        dialog.value = true;
        drawerTitle = title;
    }

    function addHandleClose(){

    }

    function addCancelForm(){
        form.value.srName = ''
        form.value.srStartTime = ''
        form.value.srEndTime = ''
        form.value.isSeason = false
        dialog.value = false;
        notify_messeage("取消添加","warning")
    }


    function handleSee(index:any, row:any){

    }

    function handleDelete(index:any, row:any){

    }

</script>

<style scoped>
.el-radio-group button{
    margin: 0;
    padding:0;
    border:0px;
 }  
</style>