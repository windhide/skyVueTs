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

<script setup lang="ts">
import {Plus} from '@element-plus/icons-vue'
import { ServerDataRequest,notify_messeage } from '@/apis/defineFunction'
import {reactive, ref, watch} from 'vue'
import {ElMessageBox,UploadInstance,UploadUserFile} from 'element-plus'

    let AddItemLink = ref<UploadInstance>() // 对应上传的ref
    let UpdateItemLink = ref<UploadInstance>()// 对应上传的ref
    const fileList = ref<UploadUserFile[]>([])
    let dialogVisible = ref(false)
    let dialogImageUrl = ref('')
    let dialogindialogVisible = ref(false)
    let dialog = ref(false)  // 添加的Modal框
    let formLabelWidth = ref('70px')
    let UserSelectItemType = ref('裤子')
    let SelectEditLinkURL = ref('')
    let ItemType:any = reactive([])
    let Item:any = reactive([])
    let Sprit:any = reactive([])
    let SelectEditItem:any = ref({})
    let form:any = ref({
            itemName:'',
            itemLink:'',
            spritID:'',
            itemTypeID:'',
    })

    ServerDataRequest("/itemType/select").then((res) => {ItemType.push(...res)});
    ServerDataRequest("/item/sreach?sreach=全部&season=全部&Type=裤子&Map=全部").then((res) => {Item.push(...res)});
    ServerDataRequest("/sprit/sreach?sereachData=全部&SeasonName=全部&MaxmapName=全部").then((res)=>{Sprit.push(...res)})

    watch(UserSelectItemType,_=>{
        ServerDataRequest("/item/sreach?sreach=全部&season=全部&Type="+UserSelectItemType+"&Map=全部").then((res) => {Item.length = 0 ; Item.push(...res)});
    })

    async function handleEdit(index:any, row:any) {
        await (SelectEditItem.value = JSON.parse(JSON.stringify(row))) // 转换成json再转回来就不会共用同一个地址
        //  不然赋值了之后会A变B也变
        await (SelectEditLinkURL.value= row.itemLink)
        await (SelectEditItem.value.itemLink = '')
        await (dialogVisible.value = true)
    }
    function UpdateSubmit(){ // 修改
        let url = "/item/update?";
        url = url + "itemID=" + SelectEditItem.value.itemID +"&" +
            "itemName=" + SelectEditItem.value.itemName +"&" +
            "itemLink=" + SelectEditItem.value.itemLink +"&" +
            "spritID=" + SelectEditItem.value.spritID +"&" +
            "itemTypeID=" + SelectEditItem.value.itemTypeID 
        ServerDataRequest(url).then(async (res) =>{
            if(res){
                await notify_messeage("修改成功","success")
                await ServerDataRequest("/item/sreach?sreach=全部&season=全部&Type=裤子&Map=全部").then((res) => {Item.length = 0; Item.push(...res)});
                await UpdateItemLink.value!.clearFiles();
                await (dialogVisible.value = false)
            }else{
                await ServerDataRequest("/uploadDelete?Filename="+SelectEditItem.value.itemLink);
                await (SelectEditItem.value.itemID = '')
                await (SelectEditItem.value.itemName = '')
                await (SelectEditItem.value.spritID = '')
                await (SelectEditItem.value.itemTypeID = '')
                await (SelectEditItem.value.itemLink = '')
                await UpdateItemLink.value!.clearFiles();
                notify_messeage("修改失败","error")
            }
        })
    }
    function openDrawer(title:any){ // 增加的显示组件
        dialog.value = true;
    }
    function cancelForm() { // 增加的取消显示
        dialog.value = false;
        resetForm();
    }
    async function resetForm(){
        form.value.itemName = ''
        form.value.spritID = ''
        form.value.itemTypeID = ''
        if(form.value.itemLink != ''){
            await ServerDataRequest("/uploadDelete?Filename="+form.value.itemLink);
            form.value.itemLink = ''
        }
        AddItemLink.value!.clearFiles();
    }
    function ItemLinkSuccessAdd(response:any, file:any, fileList:any){ //增加的上传图片方法
        if(fileList.length>1){
            ServerDataRequest("/uploadDelete?Filename="+fileList[0].response);
            fileList.splice(0,1);
        }
        form.value.itemLink = response
    }
    function handleClose() { // 增加的方法
         ElMessageBox.confirm('确定添加吗？') .then(async (_) => {
            if(statsForm()){
                let url = "/item/insert?itemName="+
                form.value.itemName+"&itemLink="+
                form.value.itemLink+"&spritID="+
                form.value.spritID+"&itemTypeID="+
                form.value.itemTypeID
                await ServerDataRequest(url).then(async (res) =>{
                    if(res){
                            await  notify_messeage("添加成功","success")
                            form.value.itemName = ''
                            form.value.spritID = ''
                            form.value.itemTypeID = ''
                            form.value.itemLink = ''
                            AddItemLink.value!.clearFiles();
                            await ServerDataRequest("/item/sreach?sreach=全部&season=全部&Type=裤子&Map=全部").then((res) => {Item.length = 0; Item.push(...res)});
                    }else{
                            await resetForm();
                            await notify_messeage("添加失败","error")
                    }
                })
                setTimeout(() => {
                        dialog.value = false;
                   }, 1000);
            }else{
                notify_messeage("你的先祖数据填写不完全，请检查！",'error')
            }
        }).catch(_ => {
            resetForm()
            dialog.value = false;
            notify_messeage("用户取消",'warning')
        });
    }
    function statsForm(){
        //判断添加表单里面的数据是否完整
        return form.value.itemName != "" 
            && form.value.itemLink != "" 
            && form.value.spritID != "" 
            && form.value.itemTypeID != ""
    }
    function UpdatehandleClose(){
        ElMessageBox.confirm('确认关闭？').then(async (_) => {  
            await ServerDataRequest("/uploadDelete?Filename="+SelectEditItem.value.itemLink);
            await UpdateItemLink.value!.clearFiles();
            await (SelectEditItem.itemLink = '')
            await (dialogVisible.value = false)
      }).catch(_ => {});
    }
    function handleRemove(file:any) {
        ServerDataRequest("/uploadDelete?Filename="+SelectEditItem.value.itemLink);
        SelectEditItem.itemLink = ''
        form.value.itemLink = ''
    }
    function ItemLinkSuccessUpdate(response:any, file:any, fileList:any){
        if(fileList.length>1){
            ServerDataRequest("/uploadDelete?Filename="+fileList[0].response);
            fileList.splice(0,1);
        }
        SelectEditItem.value.itemLink = response
    }
    function handlePictureCardPreview(file:any) {
        dialogImageUrl = file.url;
        dialogindialogVisible.value = true;
    }
    function handleDelete(index:any, row:any){
        let id = row.itemID;
        console.log(id)
        ElMessageBox.confirm('此操作将永久删除该物品数据, 是否继续?', '提示', {
             confirmButtonText: '确定',
             cancelButtonText: '取消',
             type: 'warning',
        }).then(async () => {
            await ServerDataRequest("/item/delete?itemID="+id).then(async (res) =>{
                if(res){
                    await notify_messeage("删除物品成功","success") 
                    await ServerDataRequest("/item/sreach?sreach=全部&season=全部&Type="+UserSelectItemType.value+"&Map=全部").then((res) => {Item.length = 0; Item.push(...res)});
                }else{
                    await notify_messeage("删除物品失败","error")        
                }
            })
            
        }).catch(() => {
            notify_messeage("取消删除","warning")
        });
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
