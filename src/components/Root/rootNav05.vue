<template>
  <div>
    
      <!-- 顶部筛选部分 -->
      <div style="margin-top:80px;margin-bottom:50px">
          <el-radio-group v-model="Count_Sprit_Select" v-for="(item,i) in Count_Sprit" :key="'MM_'+i" size="large">
                <button><el-radio-button :label="item" /></button>
          </el-radio-group>
         <br>
      </div>
      <!-- 内容主体部分 -->
      <div style="width:70%;margin:0px auto"  v-if="Count_Sprit_Select == '全部' || Count_Sprit_Select == '选择复刻次数'">
            <el-table :data="Reprint" height="500" stripe  >
                <el-table-column align="center" width="100" >
                    <template  #default="scope">
                        <img :src="'/api/image/'+scope.row.sprit.spritLink" width="100" />
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="reprintID" label="顺序" sortable />
                <el-table-column align="center" prop="sprit.spritName" label="先祖名字" />
                <el-table-column align="center" prop="sprit.seasonOrActivity.srName" label="所属季节" />
                <el-table-column align="center" prop="reprintTime" label="复刻时间" />
                <el-table-column align="center" label="操作" width="200">
                    <template  #default="scope">
                        <el-button size="default"  @click="handleEdit(scope.$index, scope.row)" type="warning" plain>编辑</el-button>
                        <el-button size="default"  @click="handleDelete(scope.$index, scope.row)" type="danger" plain >删除</el-button>
                    </template>  
                </el-table-column>
            </el-table>
            <el-button size="default"  @click="openDrawer('新增物品')" type="success" style="margin-top: 10px;" plain>添加复刻</el-button>
      </div>
      <div style="width:70%;margin:0px auto"  v-else >
            <el-table :data="CountReprint" height="500" stripe >
                <el-table-column align="center" width="100" >
                    <template #default="scope">
                        <img :src="'/api/image/'+scope.row.sprit.spritLink" width="50" />
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="sprit.spritName" label="先祖名字" />
                <el-table-column align="center" prop="sprit.seasonOrActivity.srName" label="所属季节" />
                <el-table-column align="center" prop="reprintTime" label="复刻时间" />
                <el-table-column align="center" label="操作" width="200">
                    <template #default="scope">
                        <el-button size="default"  @click="handleEdit(scope.$index, scope.row)" type="warning" plain>编辑</el-button>
                        <el-button size="default"  @click="handleDelete(scope.$index, scope.row)" type="danger" plain >删除</el-button>
                    </template>  
                </el-table-column>
            </el-table>
            <el-button size="default"  @click="openDrawer('添加复刻先祖')" type="success" style="margin-top: 10px;" plain>添加物品</el-button>
      </div>

        <!-- 新增部分 -->
        <el-drawer v-model="dialog" title="添加物品" :before-close="handleClose"  :append-to-body="true">
              <template #default>
                <div>
                    <el-form :model="form" style="width:50%;margin:0 auto" :label-position="'left'">
                        <el-form-item label="选择先祖" :label-width="formLabelWidth">
                             <el-select v-model="form.spritID" placeholder="选择先祖" filterable >
                                <div v-for="(item,i) in Sprit" :key="'sprit_'+i" >
                                    <el-option  :label="item.spritName" :value="item.spritID"  v-if="item.spritName.indexOf('向导') == -1" />
                                </div>
                             </el-select>
                        </el-form-item>
                        <el-form-item label="复刻时间" :label-width="formLabelWidth">
                              <el-date-picker v-model="form.reprintTime" format="YYYY年M月D日" value-format="YYYY年M月D日" type="date" placeholder="选择复刻时间" /> 
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
        <el-dialog title="修改" v-model="dialogVisible" :before-close="UpdatehandleClose" width="35%" :append-to-body="true">
            <el-form :model="SelectEditReprint" style="width:50%;margin:0 auto" :label-position="'left'">
                <el-form-item label="选择先祖" :label-width="formLabelWidth">
                     <el-select v-model="SelectEditReprint.spritID" placeholder="选择先祖" filterable >
                          <div v-for="(item,i) in Sprit" :key="'sprit_'+i" >
                               <el-option  :label="item.spritName" :value="item.spritID"  v-if="item.spritName.indexOf('向导') == -1" />
                          </div>
                     </el-select>
                </el-form-item>
                <el-form-item label="复刻时间" :label-width="formLabelWidth">
                      <el-date-picker v-model="SelectEditReprint.reprintTime" format="YYYY年M月D日" value-format="YYYY年M月D日" type="date" placeholder="选择复刻时间" /> 
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="UpdatehandleClose">取 消</el-button>
              <el-button type="primary" @click="UpdateSubmit">确 定</el-button>
            </span>
        </el-dialog>

  </div>
</template>

<script setup lang="ts">
    import {Plus} from '@element-plus/icons-vue'
    import { ServerDataRequest,notify_messeage } from '@/apis/defineFunction'
    import {reactive, ref, watch} from 'vue'
    import {ElMessageBox} from 'element-plus'

    let dialogVisible = ref(false)
    let dialog = ref(false)
    let drawerTitle = ref('') // 模态框内标题 用于重用
    let formLabelWidth = ref('70px')
    let Count_Sprit_Select = ref("全部")
    let Count_Sprit:any  = ref(["选择复刻次数", 1, 2, 3, "全部"])
    let Reprint:any = reactive([])
    let Sprit:any = reactive([])
    let CountReprint:any = reactive([])
    let SelectEditReprint:any = ref({
           reprintID:'',
           spritID:'',
           reprintTime:'',
    })
    let form:any = ref({
       spritID:'',
       ReprintTime:''
    })

    ServerDataRequest("/reprint/select").then(res => {Reprint.length = 0; Reprint.push(...res)})
    ServerDataRequest("/sprit/sreach?sereachData=全部&SeasonName=全部&MaxmapName=全部").then((res)=>{Sprit.length = 0; Sprit.push(...res)})

    watch(Count_Sprit_Select,UserSelect)

    async function handleEdit(index:any, row:any) {
        await (SelectEditReprint.value = JSON.parse(JSON.stringify(row))) // 转换成json再转回来就不会共用同一个地址
        await (dialogVisible.value = true)
    }
    function UpdatehandleClose(){
        ElMessageBox.confirm('确认关闭？').then(async (_) => {  
            await (dialogVisible.value = false)
        }).catch(_ => {});
    }
    function UpdateSubmit(){ // 修改
        let url = "/reprint/update?";
            url = url + "reprintID=" + SelectEditReprint.value.reprintID +"&" +
              "spritID=" + SelectEditReprint.value.spritID +"&" +
              "reprintTime=" + SelectEditReprint.value.reprintTime
        ServerDataRequest(url).then(async (res) =>{
            if(res){
                await notify_messeage("修改成功","success")
                await ServerDataRequest("/reprint/select").then((res) => {Reprint.length = 0;Reprint.push(...res)});
                await UserSelect()
                await (dialogVisible.value = false)
            }else{
               notify_messeage("修改失败","error")
            }
        })
    }
    function handleDelete(index:any, row:any){
        let id = row.reprintID;
        console.log(id)
        ElMessageBox.confirm('此操作将删除>>'+row.sprit.spritName+'的复刻数据, 是否继续?', '提示', {
             confirmButtonText: '确定',
             cancelButtonText: '取消',
             type: 'warning',
        }).then(async () => {
            await ServerDataRequest("/reprint/delete?id="+id).then(async (res) =>{
                if(res){
                    await notify_messeage("删除成功","success")
                    await ServerDataRequest("/reprint/select").then((res) => {Reprint.length = 0; Reprint.push(...res)});
                    await UserSelect()
                }
                else    
                    notify_messeage("删除失败","error")
            })
        }).catch(() => {
            notify_messeage("取消删除","warning")
        });
    }
    function openDrawer(title:any){ // 增加的显示组件
            dialog.value = true;
            drawerTitle = title;
    }
    function cancelForm() { // 增加的取消显示
            dialog.value = false;
            form.value.spritID = ''
            form.value.reprintTime=''
    }
    function handleClose() { // 增加的方法
             ElMessageBox.confirm('确定添加吗？') .then(async (_) => {
                // this.loading = true;
                if(form.value.reprintTime != '' && form.value.spritID != ''){
                    let url = "/reprint/insert?spritID=" + form.value.spritID +"&reprintTime="+form.value.reprintTime
                    ServerDataRequest(url).then(async (res) =>{
                      if(res){
                          await notify_messeage("成功添加","success")
                          await ServerDataRequest("/reprint/select").then(res =>{Reprint.length = 0; Reprint.push(...res)})
                          await UserSelect()
                          await (form.value.spritID = '')
                          await (form.value.reprintTime = '')
                      }else{
                        await notify_messeage("添加失败","error")
                          form.value.spritID = ''
                          form.value.reprintTime=''
                      }
                    })
                    setTimeout(() => {
                          dialog.value = false;
                    }, 500);
                }else{
                    notify_messeage("你的数据填写不完全，请检查！",'error')
                }
            }).catch(_ => {
                notify_messeage("用户取消",'warning')
                form.value.spritID = ''
                form.value.reprintTime = ''
                dialog.value = false;
            });
    }
    function UserSelect() {
        CountReprint.length = 0
        if (Count_Sprit_Select.value != "选择复刻次数") {
          for (let i = 0; i < Reprint.length; i++) {
            if (Reprint[i].count == Count_Sprit_Select.value) {
              CountReprint.push(Reprint[i]);
            }
          }
        }
    }
</script>

<style scoped>
.el-radio-group button {
  margin: 0;
  padding: 0;
  border: 0px;
}
</style>