<template>
    <div>
		<div class="nav07_bg">
			<div class="nav07_bt">骗子预警</div>
		</div>

		<div style="width:80%;height:80%;margin:30px auto">
  			  <el-table :data="spritreport.values"  @row-click="cellmouseenter" border >
  			      <el-table-column  prop="reportListTitle"  label="标题"  />
  			      <el-table-column  prop="accountUsername"  label="用户" width="130" />
  			      <el-table-column  prop="reportTime"  label="时间" width="130" />
  			  </el-table>
  			</div>
			<div v-if="getloginUsername()!='' && getloginUsername()!=null">
				<el-button type="primary" size="large" plain round  @click="dialogVisible = true" >🤬我要揭露骗子！</el-button>
				<el-button type="warning" size="large" plain round  @click="EditVisible = true">自己发布的消息</el-button>
			</div>
			<el-button type="primary" size="large" plain round v-else @click="GoLogin">去登录</el-button>
			<!-- 到底了-提示 -->
		</div>

  		<el-dialog v-model="lookVisible" title="🤬揭露骗子🤬" width="50%"  draggable :before-close="SeehandleClose()" :append-to-body="true" destroy-on-close>
				{{SelectReport.reportListTitle}}
		  <el-divider />
			<el-tabs tab-position="left" class="demo-tabs">
    			<el-tab-pane label="内容" selected >{{SelectReport.reportListMesseage}}</el-tab-pane>
    			<el-tab-pane label="图片" class="demo-image__lazy" style="width:70%"><el-image v-for="url in SelectedImg.values" :key="url" :src="'/api/image/'+url"  /></el-tab-pane>
				<el-tab-pane disabled :label="'发布用户 > '+SelectReport.accountUsername" />
    			<el-tab-pane disabled :label="'时间 > '+SelectReport.reportTime" />
  			</el-tabs>
  		</el-dialog>

		  <el-dialog v-model="EditVisible" title="自己发布的消息" width="50%"  draggable :before-close="EdithandleClose()" :append-to-body="true" destroy-on-close>
				<el-table :data="spritreport.filter((data:any) => getUsername(data.accountUsername))" border >
  			      <el-table-column  prop="reportListTitle"  label="标题"  />
  			      <el-table-column  prop="accountUsername"  label="用户" />
  			      <el-table-column  prop="reportTime"  label="时间" />
				  <el-table-column align="center" label="操作" >
                   		<template #default="scope">
                   		    <el-button size="default"  @click="cellmouseenter(scope.row,0,0,0)" type="primary" plain >查看</el-button>
                   		    <el-button size="default"  @click="handleDelete(scope.$index, scope.row)" type="danger" plain >删除</el-button>
                   		</template>  
                </el-table-column>
  			  </el-table>
  		 </el-dialog>

		<el-dialog v-model="dialogVisible" title="🤬举报骗子🤬" width="30%" :before-close="SubmitForm" :append-to-body="true" destroy-on-close>
  			<el-form :model="form" label-width="120px">
  			  <el-form-item label="举报标题">
  			    <el-input v-model="form.reportListTitle" />
  			  </el-form-item>
  			  <el-form-item label="举报内容">
  			    	<el-input v-model="form.reportListMesseage" type="textarea" />
  			  </el-form-item>
			  <el-form-item label="上传证据">
  			    	<el-upload ref="reportAdd"  action="/api/upload" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :file-list="fileList"  :limit="5">
							<el-icon><Plus /></el-icon>
 					 </el-upload>
  			  </el-form-item>
  			</el-form>
  		  		<template #footer>
  		  		  <span class="dialog-footer">
  		  		    <el-button @click="cancelAdd">取消</el-button>
  		  		    <el-button type="primary" @click="SubmitForm">提交</el-button>
  		  		  </span>
  		  		</template>
  		</el-dialog>

</template>
<script setup lang="ts">
		import { ServerDataRequest,notify_messeage } from '@/apis/defineFunction'
		import { Plus } from '@element-plus/icons-vue'
		import {ElMessageBox,UploadInstance} from 'element-plus'
		import {reactive, ref} from 'vue'
		import router from '@/router/routerIndex'

    	let reportAdd = ref<UploadInstance>()
        let SelectReport:any=ref({})
		let dialogVisible=ref(false)
		let lookVisible=ref(false)
		let EditVisible=ref(false)
		let dialogImageUrl=ref('')
		let spritreport:any=reactive([]) 
		let fileList:any=reactive([])
		// 	const fileList = ref<UploadUserFile[]>([
    	//   {
    	//     name: Store.state.Microstore.logourl.split('?')[0].split('/')[Store.state.Microstore.logourl.split('?')[0].split('/').length - 1],
    	//     url: Store.state.Microstore.logourl
    	//   }])
		let SelectedImg:String[]=[]
		let form:any=ref({
			reportListTitle:'',
			reportListMesseage:''
	 	})
		const upload = ref<UploadInstance>()
      ServerDataRequest("/report/select").then((res) => { spritreport.values = res})

	function GoLogin(){
		  router.push('/login');
	}
	function statsForm(){
		return form.value.reportListTitle != '' && form.value.reportListMesseage != '' && fileList.length != 0
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
					await ServerDataRequest("report").then((res) => { spritreport.values = res})
				}else{
					notify_messeage("删除失败","warning")		
				}
			})
        }).catch(() => {
            notify_messeage("取消删除","warning")
			ServerDataRequest("report").then((res) => { spritreport.values = res})
        });
    }
	function cellmouseenter(row:any, column:any, cell:any, event:any) {
      SelectReport = row;
	  SelectedImg = reactive([])
	  let AllImage = row.reportListimage+','
		while(AllImage.indexOf(",") != -1){
			let lstar = AllImage.indexOf(",")
			AllImage = AllImage.replace(',',')')
			let lend = AllImage.indexOf(",")
			if(lstar != -1 && lend != -1)
				SelectedImg.push(AllImage.substring(lstar+1,lend))
		}
	  lookVisible.value = true; // 打开详细窗口
    }
	function getloginUsername(){
		  return localStorage.getItem('Authorization')
	}
	function getUsername(name:any){
		return name == localStorage.getItem('loginUsername')
	}
	function SeehandleClose(){
		lookVisible.value = false
	}
	function EdithandleClose(){
		EditVisible.value = false
	}
	function handlePictureCardPreview(file:any) {
            dialogImageUrl.value = file.url;
            lookVisible.value = true;
    }
	function handleRemove(file:any) {
            ServerDataRequest("/uploadDelete?Filename="+file.response);
    }
	function cancelAdd(){
		ElMessageBox.confirm('确定取消吗？') .then((_:any) => {
                resetForm()
                notify_messeage("用户取消",'warning')
				dialogVisible.value = false;
            }).catch((_:any)=>{})
	}
	function resetForm(){
		form.value.reportListTitle = ""
		form.value.reportListMesseage = ""
		for(let i = 0;i<fileList.length;i++){
            ServerDataRequest("/uploadDelete?Filename="+fileList.values[i].response);
		}
		fileList= []
        reportAdd.value!.clearFiles();
	}
	function SubmitForm(){
		let imagUrl = ''
		let year = new Date().getFullYear();	
		let month = new Date().getMonth() +1;
		let day = new Date().getDate();
		imagUrl = ''
		for(let i = 0;i<fileList.length;i++){
			imagUrl += (','+fileList.values[i].response)
		}
		ElMessageBox.confirm('确定添加吗？') .then((_:any) => {
                if(statsForm()){
                    let url = "/report/insert?reportListTitle="+form.reportListTitle + "&"
					+ "reportListMesseage=" + form.reportListMesseage + "&"
					+ "reportListimage=" + imagUrl + "&" 
					+ "accountUsername=" + localStorage.getItem('loginUsername') +"&"
					+ "reportTime=" + year+'年'+month+'月'+day+'日'
                    ServerDataRequest(url).then(async (res) =>{
                    	if(res){
							await notify_messeage("添加成功!",'success')
                    	    await ServerDataRequest("report").then((res) => { spritreport.values = res})
							form.reportListTitle = ""
							form.reportListMesseage = ""
                    		reportAdd.value!.clearFiles()
							fileList = []
							setTimeout(() => {
								dialogVisible.value = false;
                       		}, 500);
						}
						else
							await notify_messeage("添加失败","error")
                    }).catch(async (res) =>{
                        await notify_messeage("由于服务器问题添加失败!",'error')
                        await resetForm();
                    });
                }else{
                    notify_messeage("你的数据填写不完全，请检查！",'error')
                }
            }).catch(() => {
                resetForm()
                notify_messeage("用户取消",'warning')
				dialogVisible.value = false;
            })

	}
</script>


<style scoped>
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
