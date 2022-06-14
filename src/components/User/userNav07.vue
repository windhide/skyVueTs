<template>
    <div>
		<div class="nav07_bg">
			<div class="nav07_bt">骗子预警</div>
		</div>

		<div style="width:80%;height:80%;margin:30px auto">
  			  <el-table :data="spritreport"  @row-click="cellmouseenter" border >
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

  		<el-dialog v-model="lookVisible" title="🤬揭露骗子🤬" width="50%"  draggable :before-close="SeehandleClose" :append-to-body="true">
				{{this.SelectReport.reportListTitle}}
		  <el-divider />
			<el-tabs tab-position="left" class="demo-tabs">
    			<el-tab-pane label="内容" selected >{{this.SelectReport.reportListMesseage}}</el-tab-pane>
    			<el-tab-pane label="图片" class="demo-image__lazy" style="width:70%"><el-image v-for="url in SelectedImg" :key="url" :src="'/api/image/'+url"  /></el-tab-pane>
				<el-tab-pane disabled :label="'发布用户 > '+this.SelectReport.accountUsername" />
    			<el-tab-pane disabled :label="'时间 > '+this.SelectReport.reportTime" />
  			</el-tabs>
  		</el-dialog>

		  <el-dialog v-model="EditVisible" title="自己发布的消息" width="50%"  draggable :before-close="EdithandleClose" :append-to-body="true">
				<el-table :data="spritreport.filter(data => this.getUsername(data.accountUsername))" border >
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

		<el-dialog v-model="dialogVisible" title="删除" width="30%" :before-close="SubmitForm" :append-to-body="true">
  			<el-form :model="form" label-width="120px">
  			  <el-form-item label="举报标题">
  			    <el-input v-model="form.reportListTitle" />
  			  </el-form-item>
  			  <el-form-item label="举报内容">
  			    	<el-input v-model="form.reportListMesseage" type="textarea" />
  			  </el-form-item>
			  <el-form-item label="上传证据">
  			    	<el-upload ref="reportAdd"  action="/api/upload" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :file-list="fileList"  :limit="5">
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
<script>
export default {
  data() {
    return {
        spritreport:[],
        SelectReport:null,
		dialogVisible:false,
		lookVisible:false,
		EditVisible:false,
		dialogImageUrl:'',
		fileList:[],
		SelectedImg:[],
		form:{
			reportListTitle:'',
			reportListMesseage:'',
		},
    };
  },
  methods:{
	GoLogin(){
		  this.$router.push('/login');
	},
	statsForm(){
		return this.reportListTitle != '' && this.reportListMesseage != '' && this.fileList.length != 0
	},
	handleDelete(index, row){
        let id = row.reportListID;
        this.$confirm('此操作将删除>>'+row.reportListTitle+'此条数据, 是否继续?', '提示', {
             confirmButtonText: '确定',
             cancelButtonText: '取消',
             type: 'warning',
        }).then(async () => {
            await this.ServerDataRequest("/report/delete?id="+id).then(async (res) =>{
				if(res){
					await this.notify_messeage("删除成功","success")
						let AllImage = row.reportListimage+','
						while(AllImage.indexOf(",") != -1){
							let lstar = AllImage.indexOf(",")
							AllImage = AllImage.replace(',',')')
							let lend = AllImage.indexOf(",")
							if(lstar != -1 && lend != -1)
								await this.ServerDataRequest("/uploadDelete?Filename="+AllImage.substring(lstar+1,lend))
						}
					await this.ServerDataRequest("report").then((res) => { this.spritreport = res})
				}else{
					this.notify_messeage("删除失败","warning")		
				}
			})
        }).catch(() => {
            this.notify_messeage("取消删除","warning")
			this.ServerDataRequest("report").then((res) => { this.spritreport = res})
        });
    },
    cellmouseenter(row, column, cell, event) {
      this.SelectReport = row;
	  this.SelectedImg = []
	  let AllImage = row.reportListimage+','
		while(AllImage.indexOf(",") != -1){
			let lstar = AllImage.indexOf(",")
			AllImage = AllImage.replace(',',')')
			let lend = AllImage.indexOf(",")
			if(lstar != -1 && lend != -1)
				this.SelectedImg.push(AllImage.substring(lstar+1,lend))
		}
	  this.lookVisible = true; // 打开详细窗口
    },
	getloginUsername(){
		  return localStorage.getItem('Authorization')
	},
	getUsername(name){
		return name == localStorage.getItem('loginUsername')
	},
	SeehandleClose(){
		this.lookVisible = false
	},
	EdithandleClose(){
		this.EditVisible = false
	},
	handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.lookVisible = true;
    },
	handleRemove(file) {
            this.ServerDataRequest("/uploadDelete?Filename="+file.response);
    },
	cancelAdd(){
		this.$confirm('确定取消吗？') .then(_ => {
                this.resetForm()
                this.notify_messeage("用户取消",'warning')
				this.dialogVisible = false;
            }).catch(_=>{})
	},
	resetForm(){
		this.form.reportListTitle = ""
		this.form.reportListMesseage = ""
		for(let i = 0;i<this.fileList.length;i++){
            this.ServerDataRequest("/uploadDelete?Filename="+this.fileList[i].response);
		}
		this.fileList= []
        this.$refs['reportAdd'].clearFiles();
	},
	SubmitForm(){
		let imagUrl = ''
		let year = new Date().getFullYear();	
		let month = new Date().getMonth() +1;
		let day = new Date().getDate();
		imagUrl = ''
		for(let i = 0;i<this.fileList.length;i++){
			imagUrl += (','+this.fileList[i].response)
		}
		this.$confirm('确定添加吗？') .then(_ => {
                if(this.statsForm()){
                    let url = "/report/insert?reportListTitle="+this.form.reportListTitle + "&"
					+ "reportListMesseage=" + this.form.reportListMesseage + "&"
					+ "reportListimage=" + imagUrl + "&" 
					+ "accountUsername=" + localStorage.getItem('loginUsername') +"&"
					+ "reportTime=" + year+'年'+month+'月'+day+'日'
                    this.ServerDataRequest(url).then(async (res) =>{
                    	if(res){
							await this.notify_messeage("添加成功!",'success')
                    	    await this.ServerDataRequest("report").then((res) => { this.spritreport = res})
							this.form.reportListTitle = ""
							this.form.reportListMesseage = ""
                    		this.$refs['reportAdd'].clearFiles();
							this.fileList = []
							setTimeout(() => {
								this.dialogVisible = false;
                       		}, 500);
						}
						else
							await this.notify_messeage("添加失败","error")
                    }).catch(async (res) =>{
                        await this.notify_messeage("由于服务器问题添加失败!",'error')
                        await resetForm();
                    });
                }else{
                    this.notify_messeage("你的数据填写不完全，请检查！",'error')
                }
            }).catch(() => {
                this.resetForm()
                this.notify_messeage("用户取消",'warning')
				this.dialogVisible = false;
            })

	},
  },
  created() {
      this.ServerDataRequest("/report/select").then((res) => { this.spritreport = res})
  },
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
