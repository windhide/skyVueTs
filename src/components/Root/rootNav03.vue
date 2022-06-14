<template>
<div>
      <div>
            <div style="margin-top:80px;margin-bottom:50px">
                <el-radio-group v-model="UserSelectSeason" style="margin:0px auto 0px;" v-for="(item,i) in SeasonOrActivity" :key="i"  size="large">
                        <button v-if="item.srName.indexOf('季') != -1  || item.srName == '全部' || item.srName == '常规'"><el-radio-button :label="item.srName" /></button>
                </el-radio-group>
                <br>
                <!-- 筛选部分 -->
            </div>
            <div style="width:70%;margin:0px auto">
                <el-table :data="Sprit" height="538" stripe  >
                    <el-table-column align="center" prop="spritID" label="ID"  width="80" sortable />
                    <el-table-column align="center" prop="spritName" label="先祖"  />
                    <el-table-column align="center" prop="seasonOrActivity.srName" label="所属组"  />
                    <el-table-column align="center" prop="miniMap.miniName" label="所属小地图"  />
                    <el-table-column align="center" prop="miniMap.maxMap.maxName" label="所属大地图"  />
                    <el-table-column align="center" label="操作" width="150">
                        <template #default="scope" >
                            <el-button size="small"  @click="handleEdit(scope.$index, scope.row)" type="warning" plain>编辑</el-button>
                            <el-button size="small"  @click="handleDelete(scope.$index, scope.row)" type="danger" plain >删除</el-button>
                        </template>  
                    </el-table-column>
                </el-table>
            </div>
        <el-button size="default"  @click="drawer = true" type="success" style="margin-top: 10px;" plain>添加先祖</el-button>
        <!--添加-->
            <el-drawer v-model="drawer" title="添加先祖" :before-close="handleClose"  :append-to-body="true" >
              <template #default>
                <div>
                    <el-form :model="form" style="width:50%;margin:0 auto" :label-position="'left'"  >
                            <el-form-item label="先祖名字" :label-width="formLabelWidth">
                              <el-input v-model="form.spritName" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="季节" :label-width="formLabelWidth">
                                <el-select v-model="form.srID" placeholder="请选择对应季节">
                                <div v-for="(item,i) in SeasonOrActivity" :key="'SeasonOrActivity_'+i">
                                    <el-option :label="item.srName" :value="item.srID" v-if="(item.srName!='全部' && item.srName.indexOf('季') != -1) || item.srName.indexOf('常规') != -1"/>
                                </div>
                                </el-select>
                           </el-form-item>
                           <el-form-item label="所属地图" :label-width="formLabelWidth">
                                <el-select v-model="form.maxMapID" placeholder="大地图">
                                    <div v-for="(item,i) in maxMap" :key="'maxmap_'+i" >
                                        <el-option  :label="item.maxName"  :value="item.maxMapID" v-if="item.maxName!='全部'"/>
                                    </div>
                                </el-select>
                           </el-form-item>
                           <el-form-item :label-width="formLabelWidth">
                                <el-select v-model="form.miniMapID" placeholder="小地图（请先选择大地图）">
                                    <div  v-for="(item,i) in miniMap" :key="'minimap_'+i" >
                                        <el-option :label="item.miniName"  :value="item.miniMapID" v-if="item.maxMapID==form.maxMapID"/>
                                    </div>
                                </el-select>
                           </el-form-item>
                           <el-form-item label="先祖图" :label-width="formLabelWidth">
                                <el-upload accept="image/*" ref="spritLink" action="/api/upload"  list-type="picture-card"   :on-preview="handlePictureCardPreview"
                                 :on-remove="handleRemove"  :limit="2" :on-success="spritLinkSuccess">
                                    <el-icon  class="avatar-uploader-icon"><Plus /></el-icon>
                                 </el-upload>
                            </el-form-item>
                            <el-form-item label="兑换图" :label-width="formLabelWidth">
                                <el-upload accept="image/*" ref="spritCost" action="/api/upload"  list-type="picture-card"  :on-preview="handlePictureCardPreview"
                                 :on-remove="handleRemove" :limit="2" :on-success="spritCostSuccess">
                                    <el-icon  class="avatar-uploader-icon"><Plus /></el-icon>
                                 </el-upload>
                            </el-form-item>
                    </el-form>
                </div>
              </template>
              <template #footer>
                <div style="flex: auto;margin:0px auto">
                  <el-button @click="cancelClick()">取消</el-button>
                  <el-button type="primary" @click="handleClose">添加</el-button>
                </div>
              </template>
            </el-drawer>
        <!-- 修改 -->
            <el-dialog v-model="dialogVisible" title="修改" width="35%" draggable :before-close="UpdatehandleClose"  :close-on-press-escape="true"  :append-to-body="true">
                <el-form :model="SelectedSprit" style="width:50%;margin:0 auto" :label-position="'left'">
                         <el-form-item label="先祖名字" :label-width="formLabelWidth">
                           <el-input v-model="SelectedSprit.spritName" autocomplete="off"></el-input>
                         </el-form-item>
                         <el-form-item label="季节" :label-width="formLabelWidth">
                             <el-select v-model="SelectedSprit.srID" placeholder="请选择对应季节">
                                <div  v-for="(item,i) in SeasonOrActivity" :key="'SeasonOrActivity_'+i">
                                    <el-option  :label="item.srName"  :value="item.srID" v-if="(item.srName!='全部' && item.srName.indexOf('季') != -1) || item.srName.indexOf('常规') != -1"/>
                                </div>
                             </el-select>
                        </el-form-item>
                        <el-form-item label="所属地图" :label-width="formLabelWidth">
                             <el-select v-model="SelectedSprit.miniMap.maxMapID" placeholder="大地图">
                                <div v-for="(item,i) in maxMap" :key="'maxmap_'+i" >
                                       <el-option  :label="item.maxName"  :value="item.maxMapID" v-if="item.maxName!='全部'"/>
                                </div>
                             </el-select>
                        </el-form-item>
                        <el-form-item :label-width="formLabelWidth">
                             <el-select v-model="SelectedSprit.miniMapID" placeholder="小地图（请先选择大地图）">
                                <div  v-for="(item,i) in miniMap" :key="'minimap_'+i" >
                                    <el-option :label="item.miniName"  :value="item.miniMapID" v-if="item.maxMapID==SelectedSprit.miniMap.maxMapID"/>
                                </div>
                             </el-select>
                        </el-form-item>
                        <el-form-item label="先祖图" :label-width="formLabelWidth">
                             <el-upload accept="image/*" ref="UpdatespritLink" action="/api/upload"  list-type="picture-card"   :on-preview="handlePictureCardPreview"
                              :on-remove="handleRemove"  :limit="2" :on-success="spritLinkSuccessUpdate">
                                  <el-icon  class="avatar-uploader-icon"><Plus /></el-icon>
                              </el-upload>
                        </el-form-item>
                        <el-form-item label="兑换图" :label-width="formLabelWidth">
                            <el-upload accept="image/*" ref="UpdatespritCost" action="/api/upload"  list-type="picture-card"  :on-preview="handlePictureCardPreview"
                             :on-remove="handleRemove" :limit="2" :on-success="spritCostSuccessUpdate">
                                 <el-icon  class="avatar-uploader-icon"><Plus /></el-icon>
                             </el-upload>
                        </el-form-item>
                        
                    </el-form>
                        目前先组图：<el-image style="width: auto; height: 200px" :src="'/api/image/'+SelectedSpritLink" />
                        目前兑换图：<el-image style="width: auto; height: 200px" :src="'/api/image/'+SelectedSpritCost" />
                <template #footer>
                  <span class="dialog-footer">
                        <el-button @click="UpdatehandleClose">取 消</el-button>
                        <el-button type="primary" @click="UpdateSubmit">确 定</el-button>
                  </span>
                </template>
            </el-dialog>
            <el-dialog  v-model="adddialogVisible" :append-to-body="true">
                 <img style="width:60%" :src="dialogImageUrl" alt="Preview Image">
            </el-dialog>
    </div>
</div>
</template>

<script scoped>
import {Plus} from '@element-plus/icons-vue'

export default {
    data() {
        return {
            adddialogVisible: false, //增加的图片放大开关
            dialogVisible: false, //修改的开关
            dialogindialogVisible:false,
            UserSelectSeason: '常规', //  用于默认选择筛选条件值
            SeasonOrActivity:[], // 筛选数据条件
            drawer:false,
            Sprit:[], // 展示所有数据
            SelectedSprit:{
                miniMap:{
                    maxMap:{}
                }
            }, // 此处用于修改的数据对仗
            SelectedSpritLink:'',
            SelectedSpritCost:'',
            maxMap:[],  // 用于添加行列的子选项查询
            miniMap:[], // 用于添加行列的子选项查询
            formLabelWidth: '70px', // 添加模态框内部样式的PX
            dialogImageUrl: '', // 图片上传预览
            dialogVisible: false,// 图片上传预览
            form:{ // 表单的子
                spritName:'',
                spritLink:'',
                spritCost:'',
                srID:'',
                miniMapID:'',
                maxMapID:'',
            }
        }
    },
     methods: {
        async handleEdit(index, row) {
            await (this.SelectedSprit = JSON.parse(JSON.stringify(row))) // 转换成json再转回来就不会共用同一个地址
            // 不然赋值了之后会A变B也变
            await (this.SelectedSpritLink= row.spritLink)
            await (this.SelectedSpritCost= row.spritCost)
            await (this.SelectedSprit.spritCost = '')
            await (this.SelectedSprit.spritLink = '')
            await (this.dialogVisible = true)
        },
        handleDelete(index, row) {
            let id = row.spritID;
            console.log(id)
            this.$confirm('此操作将永久删除该先祖数据, 是否继续?', '提示', {
                 confirmButtonText: '确定',
                 cancelButtonText: '取消',
                 type: 'warning',
            }).then(() => {
                 this.ServerDataRequest("/sprit/delete?id="+row.spritID).then((res) =>{
                     if(res){
                         this.notify_messeage("删除成功",'success')
                         this.ServerDataRequest("/sprit/sreach?sereachData=全部&SeasonName=全部&MaxmapName=全部").then((res)=>{this.Sprit = res})
                     }else{
                         this.notify_messeage("删除失败，请先删除该先祖旗下的物品道具",'error')
                         let item = []
                         let message = ''
                         let isDelete = true;
                         this.ServerDataRequest("/item/delete/sprit?spritID="+row.spritID).then((res) =>{
                             item = res
                              for(let i = 0;i<item.length;i++){
                                message = message + "<span>"+item[i].itemName+"</span><image  style='width: 100px; height: 100px' src='"+$staticData+item[i].itemLink+"' /><br/>"
                              }
                              this.$confirm('是否删除此先祖对应旗下的物品道具?', '是否删除此先祖对应旗下的物品道具?', {
                                   dangerouslyUseHTMLString:true,
                                   confirmButtonText: '确定',
                                   cancelButtonText: '取消',
                                   type: 'warning',
                                   message:message,
                                 }).then(async () => {
                                      // 删除奥
                                    for(let i = 0;i<item.length;i++){
                                        await this.ServerDataRequest("/item/delete?itemID="+item[i].itemID).then(res=>{
                                            if(res)
                                              this.notify_messeage("已删除 -> : "+item[i].itemName,'warning')
                                            else 
                                             isDelete = false;
                                        })
                                    }
                                    if(isDelete){
                                        console.log("---删除了物品后执行的重新删除---")
                                        await this.ServerDataRequest("/sprit/delete?id="+row.spritID)
                                        this.notify_messeage("删除成功 -> " + row.spritName, 'success')
                                        await this.ServerDataRequest("/sprit/sreach?sereachData=全部&SeasonName=全部&MaxmapName=全部").then((res)=>{this.Sprit = res})
                                    }
                                 }).catch(() => {
                                   this.notify_messeage("取消删除",'info')
                                 });
                             })
                     }
                 })
            }).catch(() => {
                this.notify_messeage("取消操作","warning")
            });
        },
        handleClose() {
             this.$confirm('确定添加吗？') .then(_ => {
                if(this.statsForm()){
                    let url = "/sprit/insert?spritName="+
                    this.form.spritName+"&spritLink="+
                    this.form.spritLink+"&spritCost="+
                    this.form.spritCost+"&srID="+
                    this.form.srID+"&miniMapID="+
                    this.form.miniMapID+"&maxMapID="+
                    this.form.maxMapID
                    this.ServerDataRequest(url).then(async (res) =>{
                        if(res!=false)
                            await this.notify_messeage("添加成功!",'success')
                            await this.ServerDataRequest("/sprit/sreach?sereachData=全部&SeasonName=全部&MaxmapName=全部").then((res)=>{this.Sprit = res})
                    }).catch(async (res) =>{
                            await resetForm();
                            await this.notify_messeage("由于服务器问题上传失败!",'error')
                    });
                    this.form.srID=''
                    this.form.miniMapID=''
                    this.form.maxMapID=''
                    this.form.spritName=''
                    this.form.spritLink=''
                    this.$refs['spritLink'].clearFiles();
                    this.$refs['spritCost'].clearFiles();
                    setTimeout(() => {
                            this.drawer = false
                       }, 1000);
                }else{
                    this.notify_messeage("你的先祖数据填写不完全，请检查！",'error')
                }
            }).catch(_ => {
                this.notify_messeage("用户取消",'warning')
                this.drawer = false
                this.resetForm()
            });
    },
    UpdatehandleClose() {
        this.$confirm('确认关闭？')
          .then(async (_) => {  
            await this.ServerDataRequest("/uploadDelete?Filename="+this.SelectedSprit.spritCost)
            await this.ServerDataRequest("/uploadDelete?Filename="+this.SelectedSprit.spritLink)
            await this.$refs['UpdatespritLink'].clearFiles();
            await this.$refs['UpdatespritCost'].clearFiles();
            await (this.dialogVisible = false)
          })
          .catch(_ => {});
    },
    cancelForm() {
      this.dialog = false;
      this.resetForm();
    },
    resetForm(){
        this.form.srID=''
        this.form.miniMapID=''
        this.form.maxMapID=''
        if(this.form.spritLink!="")
            this.ServerDataRequest("/uploadDelete?Filename="+this.form.spritLink);
        if(this.form.spritCost!="")
            this.ServerDataRequest("/uploadDelete?Filename="+this.form.spritCost);
        this.form.spritName=''
        this.form.spritLink=''
        this.$refs['spritLink'].clearFiles();
        this.$refs['spritCost'].clearFiles();
    },
    statsForm(){
        return this.form.spritName!= '' && this.form.spritLink !='' && this.form.spritCost != '' && this.srID != '' && this.form.miniMapID != '' && this.form.maxMapID != ''
    },
    handleRemove(file) {
        this.ServerDataRequest("/uploadDelete?Filename="+file.response);
        if(this.form.spritLink == file.response)
            this.form.spritLink = ''
        if(this.form.spritCost == file.response)
        this.form.spritCost = ''
    },
    handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.adddialogVisible = true;
    },
    spritLinkSuccess(response, file, fileList){
        if(fileList.length>1){
            this.ServerDataRequest("/uploadDelete?Filename="+fileList[0].response);
            fileList.splice(0,1);
        }
        this.form.spritLink = response
    },
    spritCostSuccess(response, file, fileList){
        if(fileList.length>1){
            this.ServerDataRequest("/uploadDelete?Filename="+fileList[0].response);
            fileList.splice(0,1);
        }
        this.form.spritCost =  response
    },
    spritLinkSuccessUpdate(response, file, fileList){
        if(fileList.length>1){
            this.ServerDataRequest("/uploadDelete?Filename="+fileList[0].response);
            fileList.splice(0,1);
        }
        this.SelectedSprit.spritLink = response
    },
    spritCostSuccessUpdate(response, file, fileList){
        if(fileList.length>1){
            this.ServerDataRequest("/uploadDelete?Filename="+fileList[0].response);
            fileList.splice(0,1);
        }
        this.SelectedSprit.spritCost =  response
    },
    UpdateSubmit(){
        let url = "/sprit/update?";
        url = url + "spritID=" + this.SelectedSprit.spritID +"&" +
                    "spritName=" + this.SelectedSprit.spritName +"&" +
                    "spritCost=" + this.SelectedSprit.spritCost +"&" +
                    "spritLink=" + this.SelectedSprit.spritLink +"&" +
                    "srID=" + this.SelectedSprit.srID +"&" +
                    "miniMapID=" + this.SelectedSprit.miniMapID 
        this.ServerDataRequest(url).then(async (res) =>{
            if(res){
                await this.notify_messeage("修改成功","success")
                await this.ServerDataRequest("/sprit/sreach?sereachData=全部&SeasonName=全部&MaxmapName=全部").then((res)=>{this.Sprit = res})
                await this.$refs['UpdatespritLink'].clearFiles();
                await this.$refs['UpdatespritCost'].clearFiles();
                await (this.dialogVisible = false)
            }else{
                this.notify_messeage("修改失败","error")
            }
        })
    },
     cancelClick() {
         this.resetForm()
         this.notify_messeage("取消操作","warning")
         this.drawer = false
    },
    },
    created() {
        this.ServerDataRequest('/SeasonOrActivity/daohang').then((res)=>{this.SeasonOrActivity = res})
        // this.ServerDataRequest("/sprit/sreach?sereachData=全部&SeasonName=全部&MaxmapName=全部").then((res)=>{this.Sprit = res})
        this.ServerDataRequest('/sprit/sreach?sereachData=全部&SeasonName=常规&MaxmapName=全部').then((res)=>{this.Sprit = res})
        this.ServerDataRequest('/MiniMap/select').then((res)=>{this.miniMap = res})
        this.ServerDataRequest('/MaxMap/select').then((res)=>{this.maxMap = res})
    },
    watch:{
        UserSelectSeason:function(){
            this.ServerDataRequest('/sprit/sreach?sereachData=全部&SeasonName='+this.UserSelectSeason+'&MaxmapName=全部').then((res)=>{this.Sprit = res})
        },
        'form.maxMapID':function(){
            this.form.miniMapID = ''
        },
    },
}
</script>

<style scoped>
.el-radio-group button{
    margin: 0;
    padding:0;
    border:0px;
 }
 .el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>