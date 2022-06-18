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
        <el-table :data="SeasonOrActivity.filter((data:any) => data.srName.indexOf(dataIndex)!=-1)" height="482" stripe  >
            <el-table-column align="center" prop="srID" label="序号" width="100" />
            <el-table-column align="center" prop="srName" label="活动或季节" />
            <el-table-column align="center" prop="srStartTime" label="开始时间" />
            <el-table-column align="center" prop="srEndTime" label="结束时间" />
            <el-table-column align="center" label="操作" width="200">
                <template #default="scope">
                    <el-button size="default"  @click="handleEdit(scope.$index, scope.row)" type="warning" plain>编辑</el-button>
                    <el-button size="default"  @click="handleDelete(scope.$index, scope.row)" type="danger" plain >删除</el-button>
                </template>  
            </el-table-column>
        </el-table>
        <el-button size="default"  @click="openDrawer('添加活动')" type="success" style="margin-top: 10px;" plain>添加季节/活动</el-button>
    </div>

    <!-- 新增部分 -->
    <el-drawer v-model="dialog" title="添加季节/活动" :before-close="addHandleClose"  :append-to-body="true">
        <template #default>
            <el-form :model="form" style="width:60%;margin:0 auto" :label-position="'left'">
                <el-form-item label="季节/活动名字" :label-width="formLabelWidth">
                    <el-input v-model="form.srName"></el-input>
                </el-form-item>
                <el-form-item label="开始时间" :label-width="formLabelWidth">
                    <el-date-picker v-model="form.srStartTime" format="YYYY年M月D日" value-format="YYYY年M月D日" type="date" placeholder="选择开始时间" /> 
                </el-form-item>
                <el-form-item label="结束时间" :label-width="formLabelWidth">
                    <el-date-picker v-model="form.srEndTime" format="YYYY年M月D日" value-format="YYYY年M月D日" type="date" placeholder="选择结束时间" /> 
                </el-form-item>
                <el-form-item label="季节/活动" :label-width="formLabelWidth">
                    <el-switch v-model="form.srIsSeason" class="mb-2" active-text="季节" inactive-text="活动" />
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

    <!-- 修改部分 -->
    <el-dialog title="修改" v-model="EditVisible" :before-close="UpdatehandleClose" width="35%" :append-to-body="true">
        <el-form :model="form" style="width:60%;margin:0 auto" :label-position="'left'">
                <el-form-item label="季节/活动名字" :label-width="formLabelWidth">
                    <el-input v-model="form.srName"></el-input>
                </el-form-item>
                <el-form-item label="开始时间" :label-width="formLabelWidth">
                    <el-date-picker v-model="form.srStartTime" format="YYYY年M月D日" value-format="YYYY年M月D日" type="date" placeholder="选择开始时间" /> 
                </el-form-item>
                <el-form-item label="结束时间" :label-width="formLabelWidth">
                    <el-date-picker v-model="form.srEndTime" format="YYYY年M月D日" value-format="YYYY年M月D日" type="date" placeholder="选择结束时间" /> 
                </el-form-item>
                <el-form-item label="季节/活动" :label-width="formLabelWidth">
                    <el-switch v-model="form.srIsSeason" class="mb-2" active-text="季节" inactive-text="活动" />
                </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="UpdatehandleClose">取 消</el-button>
          <el-button type="primary" @click="UpdateSubmit">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script setup lang="ts">
    import { ServerDataRequest,notify_messeage } from '@/apis/defineFunction'
    import {reactive, ref, watch} from 'vue'
    import {ElMessageBox} from 'element-plus'

    let SeasonOrActivityTopLab  = ref(['季节','活动'])
    let SeasonOrActivityTopLabSelect = ref('季节')
    let drawerTitle = ref('') // 模态框内标题 用于重用
    let formLabelWidth = ref('120px')
    let dataIndex = ref('季')
    let dialog = ref(false)
    let EditVisible = ref(false)
    let SeasonOrActivity:any = reactive([])
    let form:any = ref({
        srName:'',
        srStartTime:'',
        srEndTime:'',
        srIsSeason:false,
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
        ElMessageBox.confirm('确定添加吗？', '提示', {
             confirmButtonText: '确定',
             cancelButtonText: '取消',
             type: 'warning',
        }).then(async () => {
            if(stateForm()){
                let url = "/SeasonOrActivity/insert?srName=" + form.value.srName 
                    + "&srStartTime=" + form.value.srStartTime
                    + "&srEndTime=" + form.value.srEndTime
                    + "&srIsSeason=" + form.value.srIsSeason
                await ServerDataRequest(url).then(async (res) =>{
				    if(res){
				    	notify_messeage("添加成功!","success")
                        ServerDataRequest("/SeasonOrActivity/select").then(res=>{SeasonOrActivity.length = 0;SeasonOrActivity.push(...res)   })
                        resetForm()
				    }else{
				    	notify_messeage("因服务器原因失败","warning")	
                        resetForm()
				    }
			    })
            }else{
				notify_messeage("数据填写不全！","warning")	
            }
        }).catch(() => {
            addCancelForm()
        })
    }

    function UpdatehandleClose(){
        resetForm()
        notify_messeage("取消","warning")
        EditVisible.value=false
    }

    function UpdateSubmit(){
        ElMessageBox.confirm('确定修改吗？', '提示', {
             confirmButtonText: '确定',
             cancelButtonText: '取消',
             type: 'warning',
        }).then(async () => {
            if(stateForm()){
                let url = "/SeasonOrActivity/update?srID=" + form.value.srID 
                    + "&srName=" + form.value.srName
                    + "&srStartTime=" + form.value.srStartTime
                    + "&srEndTime=" + form.value.srEndTime
                    + "&srIsSeason=" + form.value.srIsSeason
                await ServerDataRequest(url).then(async (res) =>{
				    if(res){
				    	notify_messeage("修改成功!","success")
                        ServerDataRequest("/SeasonOrActivity/select").then(res=>{SeasonOrActivity.length = 0;SeasonOrActivity.push(...res)   })
                        resetForm()
				    }else{
				    	notify_messeage("因服务器原因失败","warning")	
                        resetForm()
				    }
			    })
            }else{
				notify_messeage("数据填写不全！","warning")	
            }
        }).catch(() => {
            resetForm()
            notify_messeage("取消修改","warning")
        })
    }

    function addCancelForm(){
        resetForm()
        notify_messeage("取消添加","warning")
    }

    function resetForm(){
        form.value.srName = ''
        form.value.srStartTime = ''
        form.value.srEndTime = ''
        form.value.srIsSeason = false
        dialog.value = false
        EditVisible.value = false
    }

    function stateForm(){
        return form.value.srName != '' &&
        form.value.srStartTime != '' &&
        form.value.srEndTime != '' 
    }

    function handleEdit(index:any, row:any){
        form.value = JSON.parse(JSON.stringify(row))
        EditVisible.value=true
    }

    function handleDelete(index:any, row:any){
        ElMessageBox.confirm('确定删除>>>'+row.srName+'吗？', '提示', {
             confirmButtonText: '确定',
             cancelButtonText: '取消',
             type: 'warning',
        }).then(async () => {
            ServerDataRequest("/SeasonOrActivity/delete?id="+row.srID).then(res =>{
                if(res){
                    notify_messeage("删除成功","success")
                    ServerDataRequest("/SeasonOrActivity/select").then(res=>{SeasonOrActivity.length = 0;SeasonOrActivity.push(...res)   })
                }else
                    notify_messeage("因为服务器的问题删除失败","warning")
            })
        }).catch(() => {
            resetForm()
            notify_messeage("取消删除","warning")
        })
    }

</script>

<style scoped>
.el-radio-group button{
    margin: 0;
    padding:0;
    border:0px;
 }  
</style>