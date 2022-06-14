<template>
    <div>
       <div style="margin-top:80px;margin-bottom:50px">
           <el-radio-group v-model="UserSelectItemType" style="margin:10px auto 0px;" v-for="(item,i) in ItemType" :key="'IT_'+i"  size="large" >
              <button><el-radio-button :label="item.itemTypeName" /></button>
           </el-radio-group>
           <br>
        </div>
        <!-- ↑筛选部分 -->
        <!-- ↓内容部分 -->
        <div style="width:70%;margin:0px auto">
            <el-table :data="Item" height="500" stripe  >
                <el-table-column align="center" width="100" >
                    <template #default="scope">
                        <div style="display: flex; align-items: center">
                              <img :src="'/api/image/'+scope.row.itemLink" width="50" />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="itemName" label="物品名字" />
                <el-table-column align="center" prop="sprit.spritName" label="所属先祖" />
                <el-table-column align="center" prop="sprit.seasonOrActivity.srName" label="所属季节" />
                <el-table-column align="center" prop="itemType.itemTypeName" label="物品类别"  />
                <el-table-column align="center" label="操作" width="180">
                    <template #default="scope" >
                        <el-button size="default"  @click="handleEdit(scope.$index, scope.row)" type="warning" plain>编辑</el-button>
                        <el-button size="default"  @click="handleDelete(scope.$index, scope.row)" type="danger" plain >删除</el-button>
                    </template>  
                </el-table-column>
            </el-table>
            <el-button size="default"  @click="openDrawer('新增物品')" type="success" style="margin-top: 10px;" plain>添加物品</el-button>
        </div>

        <!-- 新增部分 -->
         <el-drawer v-model="dialog" title="添加物品" :before-close="handleClose"   :close-on-press-escape="true"  :append-to-body="true">
              <template #default>
                <div>
                    <el-form :model="form" style="width:50%;margin:0 auto" :label-position="'left'">
                            <el-form-item label="物品名字" :label-width="formLabelWidth">
                                <el-input v-model="form.itemName" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="所属先祖" :label-width="formLabelWidth">
                                  <el-select v-model="form.spritID" filterable placeholder="请选择">
                                    <div v-for="item in Sprit" :key="item.spritID" >
                                       <el-option :label="item.spritName" :value="item.spritID" />
                                    </div>
                                  </el-select>
                            </el-form-item>
                            <el-form-item label="物品类型" :label-width="formLabelWidth">
                                  <el-select v-model="form.itemTypeID" placeholder="物品类型">
                                      <div  v-for="(item,i) in ItemType" :key="'ItemType_'+i"  >
                                          <el-option :label="item.itemTypeName"  :value="item.itemTypeID" v-if="item.itemTypeName != '全部' " />
                                      </div>
                                  </el-select>
                            </el-form-item>
                            <el-form-item label="物品图" :label-width="formLabelWidth">
                                <el-upload accept="image/*" ref="AddItemLink" action="/api/upload"  list-type="picture-card"   :on-preview="handlePictureCardPreview" :on-remove="handleRemove"  :limit="2" :on-success="ItemLinkSuccessAdd">
                                    <el-icon  class="avatar-uploader-icon"><Plus /></el-icon>
                                </el-upload>
                            </el-form-item>    
                        </el-form>
                </div>
              </template>
              <template #footer>
                <div style="flex: auto;margin:0px auto">
                  <el-button @click="cancelForm">取 消</el-button>
                  <el-button type="primary" @click="handleClose">添加</el-button>
                </div>
              </template>
            </el-drawer>
        <!-- 修改部分 -->
        <el-dialog v-model="dialogVisible" title="修改" width="35%" draggable :before-close="UpdatehandleClose"  :close-on-press-escape="true"  :append-to-body="true">
                        <el-form :model="SelectEditItem" style="width:50%;margin:0 auto" :label-position="'left'">
                             <el-form-item label="物品名字" :label-width="formLabelWidth">
                               <el-input v-model="SelectEditItem.itemName" autocomplete="off"></el-input>
                             </el-form-item>
                             <el-form-item label="所属先祖" :label-width="formLabelWidth">
                                 <el-select v-model="SelectEditItem.spritID" filterable placeholder="请选择">
                                    <div v-for="item in Sprit" :key="item.spritID">
                                        <el-option :label="item.spritName" :value="item.spritID" />
                                    </div>
                                 </el-select>
                            </el-form-item>
                            <el-form-item label="物品类型" :label-width="formLabelWidth">
                                 <el-select v-model="SelectEditItem.itemTypeID" placeholder="物品类型">
                                        <div v-for="(item,i) in ItemType" :key="'ItemType_'+i">
                                            <el-option  :label="item.itemTypeName"  :value="item.itemTypeID" v-if="item.itemTypeName != '全部' " />
                                        </div>
                                 </el-select>
                            </el-form-item>
                            <el-form-item label="物品图" :label-width="formLabelWidth">
                                 <el-upload accept="image/*" ref="UpdateItemLink" action="/api/upload"  list-type="picture-card"   :on-preview="handlePictureCardPreview"
                                  :on-remove="handleRemove"  :limit="2" :on-success="ItemLinkSuccessUpdate">
                                      <el-icon  class="avatar-uploader-icon"><Plus /></el-icon>
                                  </el-upload>
                            </el-form-item>
                        </el-form>
                        目前物品图：<el-image style="width: auto; height: 200px" :src="'/api/image/'+SelectEditLinkURL" />
                <template #footer>
                  <span class="dialog-footer">
                        <el-button @click="UpdatehandleClose">取 消</el-button>
                        <el-button type="primary" @click="UpdateSubmit">确 定</el-button>
                  </span>
                </template>
            </el-dialog>
	  </div>
       <el-dialog v-model="dialogindialogVisible" :append-to-body="true">
            <img style="width:60%" :src="dialogImageUrl" alt="">
       </el-dialog>
</template>

<script>
import {Plus} from "@element-plus/icons-vue"
export default {
    data() {
        return {
            Plus:Plus,
            dialogVisible:false,
            dialogImageUrl:'',
            dialogindialogVisible:false,
            visible: false,   // 添加的弹出框开关
            dialog: false,   // 添加的Modal框
            drawerTitle:'', // 模态框内标题 用于重用
            formLabelWidth: '70px',
            UserSelectItemType:'裤子',
            SelectEditItem:{},
            SelectEditLinkURL:'',
            ItemType:[],
            Item:[],
            Sprit:[],
            form:{
                itemName:'',
                itemLink:'',
                spritID:'',
                itemTypeID:'',
            },
        }
    },
    methods: {
        async handleEdit(index, row) {
            await (this.SelectEditItem = JSON.parse(JSON.stringify(row))) // 转换成json再转回来就不会共用同一个地址
            //  不然赋值了之后会A变B也变
            await (this.SelectEditLinkURL= row.itemLink)
            await (this.SelectEditItem.itemLink = '')
            await (this.dialogVisible = true)
        },
        UpdateSubmit(){ // 修改
             let url = "/item/update?";
                url = url + "itemID=" + this.SelectEditItem.itemID +"&" +
                            "itemName=" + this.SelectEditItem.itemName +"&" +
                            "itemLink=" + this.SelectEditItem.itemLink +"&" +
                            "spritID=" + this.SelectEditItem.spritID +"&" +
                            "itemTypeID=" + this.SelectEditItem.itemTypeID 
                this.ServerDataRequest(url).then(async (res) =>{
                    if(res){
                        await this.notify_messeage("修改成功","success")
                        await this.ServerDataRequest("/item/sreach?sreach=全部&season=全部&Type=裤子&Map=全部").then((res) => {this.Item = res;});
                        await this.$refs['UpdateItemLink'].clearFiles();
                        await (this.dialogVisible = false)
                    }else{
                        await this.ServerDataRequest("/uploadDelete?Filename="+this.SelectEditItem.itemLink);
                        await (this.SelectEditItem.itemID = '')
                        await (this.SelectEditItem.itemName = '')
                        await (this.SelectEditItem.spritID = '')
                        await (this.SelectEditItem.itemTypeID = '')
                        await (this.SelectEditItem.itemLink = '')
                        await this.$refs['UpdateItemLink'].clearFiles();
                        this.notify_messeage("修改失败","error")
                    }
                })
        },
        openDrawer(title){ // 增加的显示组件
            this.dialog = true;
            this.drawerTitle = title;
        },
        cancelForm() { // 增加的取消显示
            this.dialog = false;
            this.resetForm();
        },
        async resetForm(){
            this.form.itemName = ''
            this.form.spritID = ''
            this.form.itemTypeID = ''
            if(this.form.itemLink != ''){
                await this.ServerDataRequest("/uploadDelete?Filename="+this.form.itemLink);
                this.form.itemLink = ''
            }
            this.$refs['AddItemLink'].clearFiles();
        },
        ItemLinkSuccessAdd(response, file, fileList){ //增加的上传图片方法
            if(fileList.length>1){
                this.ServerDataRequest("/uploadDelete?Filename="+fileList[0].response);
                fileList.splice(0,1);
            }
            this.form.itemLink = response
        },
        handleClose() { // 增加的方法
             this.$confirm('确定添加吗？') .then(async (_) => {
                if(this.statsForm()){
                    let url = "/item/insert?itemName="+
                    this.form.itemName+"&itemLink="+
                    this.form.itemLink+"&spritID="+
                    this.form.spritID+"&itemTypeID="+
                    this.form.itemTypeID
                    await this.ServerDataRequest(url).then(async (res) =>{
                        if(res){
                                await  this.notify_messeage("添加成功","success")
                                this.form.itemName = ''
                                this.form.spritID = ''
                                this.form.itemTypeID = ''
                                this.form.itemLink = ''
                                await this.$refs['AddItemLink'].clearFiles();
                                await this.ServerDataRequest("/item/sreach?sreach=全部&season=全部&Type=裤子&Map=全部").then((res) => {this.Item = res;});
                        }else{
                                await this.resetForm();
                                await this.notify_messeage("添加失败","error")
                        }
                    })
                    setTimeout(() => {
                            this.dialog = false;
                       }, 1000);
                }else{
                    this.notify_messeage("你的先祖数据填写不完全，请检查！",'error')
                }
            }).catch(_ => {
                this.resetForm()
                this.dialog = false;
                this.notify_messeage("用户取消",'warning')
            });
        },
        statsForm(){
            //判断添加表单里面的数据是否完整
            return this.form.itemName != "" && this.form.itemLink != "" && this.form.spritID != "" && this.form.itemTypeID != ""
        },
        UpdatehandleClose(){
            this.$confirm('确认关闭？').then(async (_) => {  
                await this.ServerDataRequest("/uploadDelete?Filename="+this.SelectEditItem.itemLink);
                await this.$refs['UpdateItemLink'].clearFiles();
                await (this.SelectEditItem.itemLink = '')
                await (this.dialogVisible = false)
          }).catch(_ => {});
        },
        handleRemove(file) {
            this.ServerDataRequest("/uploadDelete?Filename="+file.response);
            this.SelectEditItem.itemLink = ''
            this.form.itemLink = ''
        },
        ItemLinkSuccessUpdate(response, file, fileList){
            if(fileList.length>1){
                this.ServerDataRequest("/uploadDelete?Filename="+fileList[0].response);
                fileList.splice(0,1);
            }
            this.SelectEditItem.itemLink = response
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogindialogVisible = true;
        },
        handleDelete(index, row){
            let id = row.itemID;
            console.log(id)
            this.$confirm('此操作将永久删除该物品数据, 是否继续?', '提示', {
                 confirmButtonText: '确定',
                 cancelButtonText: '取消',
                 type: 'warning',
            }).then(async () => {
                await this.ServerDataRequest("/item/delete?itemID="+id).then(async (res) =>{
                    if(res){
                        await this.notify_messeage("删除物品成功","success") 
                        await this.ServerDataRequest("/item/sreach?sreach=全部&season=全部&Type="+this.UserSelectItemType+"&Map=全部").then((res) => {this.Item = res;});
                    }else{
                        await this.notify_messeage("删除物品失败","error")        
                    }
                })
                
            }).catch(() => {
                this.notify_messeage("取消删除","warning")
            });
        }
    },
    created() {
        this.ServerDataRequest("/itemType/select").then((res) => {this.ItemType = res;});
        this.ServerDataRequest("/item/sreach?sreach=全部&season=全部&Type=裤子&Map=全部").then((res) => {this.Item = res;});
        this.ServerDataRequest("/sprit/sreach?sereachData=全部&SeasonName=全部&MaxmapName=全部").then((res)=>{this.Sprit = res})
    },
    watch:{
        UserSelectItemType: function(){
            this.ServerDataRequest("/item/sreach?sreach=全部&season=全部&Type="+this.UserSelectItemType+"&Map=全部").then((res) => {this.Item = res;});
        }
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
