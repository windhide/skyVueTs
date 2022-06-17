<template>
        <div class="nav07_bg">
			<div class="nav07_bt">骗子预警</div>
		</div>
      <!-- 内容主体部分 -->
      <div style="width:70%;margin:50px auto">
            <el-table :data="Report" height="500" stripe  >
                <el-table-column align="center" prop="reportListTitle" label="举报标题" />
                <el-table-column align="center" prop="accountUsername" label="举报用户" />
                <el-table-column align="center" prop="reportTime" label="举报时间" />
                <el-table-column align="center" label="操作" width="200">
                    <template #default="scope">
                        <el-button size="default"  @click="handleSee(scope.$index, scope.row)" type="primary" plain>查看</el-button>
                        <el-button size="default"  @click="handleDelete(scope.$index, scope.row)" type="danger" plain >删除</el-button>
                    </template>  
                </el-table-column>
            </el-table>
      </div>

    <el-dialog v-model="dialogTableVisible" :append-to-body="true">
        {{SelectReport.reportListTitle}}
	  <el-divider />
		<el-tabs tab-position="left" class="demo-tabs">
    		<el-tab-pane label="内容" selected >{{SelectReport.reportListMesseage}}</el-tab-pane>
    		<el-tab-pane label="图片" class="demo-image__lazy" style="width:70%"><el-image v-for="url in SelectedImg" :key="url" :src="'/api/image/'+url"  /></el-tab-pane>
			<el-tab-pane disabled :label="'发布用户 > '+SelectReport.accountUsername" />
    		<el-tab-pane disabled :label="'时间 > '+SelectReport.reportTime" />
  		</el-tabs>
    </el-dialog>

</template>

<script setup lang="ts">
    import { ServerDataRequest,notify_messeage } from '@/apis/defineFunction'
    import {reactive, ref} from 'vue'
    import {ElMessageBox} from 'element-plus'

    let Report:any = reactive([])
    let SelectReport:any = ref({})
    let SelectedImg:any = reactive([])
    let dialogTableVisible = ref(false)
    let activeName = ref("first")

    ServerDataRequest("/report/select").then((res) => { Report.length = 0 ; Report.push(...res)})

    function See(){
        dialogTableVisible.value = false
    }

    function handleSee(index:any, row:any){
        SelectReport.value = row
        SelectedImg.length = 0
	    let AllImage = row.reportListimage+','
		while(AllImage.indexOf(",") != -1){
			let lstar = AllImage.indexOf(",")
			AllImage = AllImage.replace(',',')')
			let lend = AllImage.indexOf(",")
			if(lstar != -1 && lend != -1)
			    SelectedImg.push(AllImage.substring(lstar+1,lend))
		}
        dialogTableVisible.value = true
    }

    function handleDelete(index:any, row:any){
            let id = row.reportListID;
        ElMessageBox.confirm('此操作将删除>>'+row.reportListTitle+'此条数据, 是否继续?', '提示', {
             confirmButtonText: '确定',
             cancelButtonText: '取消',
             type: 'warning',
        }).then(async () => {
            await ServerDataRequest("/report/delete?id="+id).then(async (res) =>{
				if(res){
					await notify_messeage("删除成功","success")
						let AllImage = row.reportListimage+','
						while(AllImage.indexOf(",") != -1){
							let lstar = AllImage.indexOf(",")
							AllImage = AllImage.replace(',',')')
							let lend = AllImage.indexOf(",")
							if(lstar != -1 && lend != -1)
								await ServerDataRequest("/uploadDelete?Filename="+AllImage.substring(lstar+1,lend))
						}
					await ServerDataRequest("/report/select").then((res) => { Report.length = 0 ; Report.push(...res)})
				}else{
					notify_messeage("删除失败","warning")		
				}
			})
        }).catch(() => {
            notify_messeage("取消删除","warning")
        });
    }
    
</script>

<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.el-tabs--right .el-tabs__content,
.el-tabs--left .el-tabs__content {
  height: 100%;
}
.demo-image__lazy {
  height: 500px;
  overflow-y: auto;
}
.demo-image__lazy .el-image {
  display: block;
  min-height: 500px;
}
</style>