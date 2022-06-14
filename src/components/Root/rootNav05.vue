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

<script>
export default {
  data() {
    return {
      SelectReprint: null,
      dialogVisible:false,
      dialog:false,
      visible: false,   // 添加的弹出框开关
      drawerTitle:'', // 模态框内标题 用于重用
      formLabelWidth: '70px',
      Count_Sprit_Select: "全部",
      Count_Sprit: ["选择复刻次数", 1, 2, 3, "全部"],
      Reprint:[],
      Sprit:[],
      CountReprint:[],
      SelectEditReprint:{
        reprintID:'',
        spritID:'',
        reprintTime:'',
      },
      form:{
        spritID:'',
        ReprintTime:'',
      },
    };
  },
  methods: {
    async handleEdit(index, row) {
            await (this.SelectEditReprint = JSON.parse(JSON.stringify(row))) // 转换成json再转回来就不会共用同一个地址
            await (this.dialogVisible = true)
    },
    UpdatehandleClose(){
      this.$confirm('确认关闭？').then(async (_) => {  
                await (this.dialogVisible = false)
          }).catch(_ => {});
    },
    UpdateSubmit(){ // 修改
        let url = "/reprint/update?";
           url = url + "reprintID=" + this.SelectEditReprint.reprintID +"&" +
                       "spritID=" + this.SelectEditReprint.spritID +"&" +
                       "reprintTime=" + this.SelectEditReprint.reprintTime
           this.ServerDataRequest(url).then(async (res) =>{
               if(res){
                   await this.notify_messeage("修改成功","success")
                   await this.ServerDataRequest("/reprint/select").then((res) => {this.Reprint = res;});
                   await (this.dialogVisible = false)
               }else{
                   this.notify_messeage("修改失败","error")
               }
           })
    },
    handleDelete(index, row){
            let id = row.reprintID;
            console.log(id)
            this.$confirm('此操作将删除>>'+row.sprit.spritName+'的复刻数据, 是否继续?', '提示', {
                 confirmButtonText: '确定',
                 cancelButtonText: '取消',
                 type: 'warning',
            }).then(async () => {
                await this.ServerDataRequest("/reprint/delete?id="+id).then(res =>{
                  if(res){
                      this.notify_messeage("删除成功","success")
                      this.ServerDataRequest("/reprint/select").then((res) => {this.Reprint = res;});
                  }
                  else    
                    this.notify_messeage("删除失败","error")
                })
            }).catch(() => {
                this.notify_messeage("取消删除","warning")
            });
    },
    openDrawer(title){ // 增加的显示组件
            this.dialog = true;
            this.drawerTitle = title;
    },
    cancelForm() { // 增加的取消显示
            this.dialog = false;
            this.form.spritID = ''
            this.form.reprintTime=''
    },
    handleClose() { // 增加的方法
             this.$confirm('确定添加吗？') .then(async (_) => {
                this.loading = true;
                if(this.form.reprintTime != '' && this.form.spritID != ''){
                    let url = "/reprint/insert?spritID=" + this.form.spritID +"&reprintTime="+this.form.reprintTime
                    this.ServerDataRequest(url).then(async (res) =>{
                      if(res){
                          await this.notify_messeage("成功添加","success")
                          await this.ServerDataRequest("/reprint/select").then(res =>{this.Reprint = res})
                          await (this.form.spritID = '')
                          await (this.reprintTime = '')
                      }else{
                        await this.notify_messeage("添加失败","error")
                          this.form.spritID = ''
                          this.form.reprintTime=''
                      }
                    })
                    setTimeout(() => {
                          this.dialog = false;
                    }, 1000);
                }else{
                    this.notify_messeage("你的数据填写不完全，请检查！",'error')
                }
            }).catch(_ => {
                this.notify_messeage("用户取消",'warning')
                this.form.spritID = ''
                this.reprintTime = ''
                this.dialog = false;
            });
    },
    UserSelect() {
      this.CountReprint = [];
      if (this.Count_Sprit_Select != "选择复刻次数") {
        for (let i = 0; i < this.Reprint.length; i++) {
          if (this.Reprint[i].count == this.Count_Sprit_Select) {
            this.CountReprint.push(this.Reprint[i]);
          }
        }

        for (let i = 0; i < this.CountReprint.length; i++) {
          for (let j = i + 1; j < this.CountReprint.length; j++) {
            try {
              if (this.CountReprint[i].spritID == this.CountReprint[j].spritID) {
                delete this.CountReprint[j];
                continue;
              }
            } catch (error) {}
          }
        }
      }
    },
  },
  created() {
        this.ServerDataRequest("/reprint/select").then(res => {this.Reprint = res})
        this.ServerDataRequest("/sprit/sreach?sereachData=全部&SeasonName=全部&MaxmapName=全部").then((res)=>{this.Sprit = res})

  },
  watch: {  
      Count_Sprit_Select:'UserSelect',
  },
};
</script>

<style scoped>
.el-radio-group button {
  margin: 0;
  padding: 0;
  border: 0px;
}
</style>