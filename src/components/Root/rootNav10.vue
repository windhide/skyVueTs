<template>
    <div>
        <div class="nav10_bg">
			<div class="nav10_bt">季节信息</div>
		</div>
      <!-- 内容主体部分 -->
      <div style="width:50%;margin:5vh auto">
            <el-table :data="SeasonOrActivity.filter(data => data.srName.includes('季'))" height="500" stripe  >
                <el-table-column align="center" prop="srID" label="季节ID"   width="70" />
                <el-table-column align="center" prop="srName" label="季节名" width="100" />
                <el-table-column align="center" prop="srStartTime" label="季节开始时间" />
                <el-table-column align="center" prop="srEndTime" label="季节结束时间" />
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope" style="float:left">
                        <el-button size="mini"  @click="handleEdit(scope.$index, scope.row)" type="warning" plain>编辑</el-button>
                        <el-button size="mini"  @click="handleDelete(scope.$index, scope.row)" type="danger" plain >删除</el-button>
                    </template>  
                </el-table-column>
            </el-table>
            <el-button size="medium"  @click="openDrawer('新增物品')" type="success" style="margin-top: 10px;" plain>添加季节信息</el-button>
      </div>

       <!-- 新增部分 -->
        <el-drawer :title="drawerTitle" :before-close="handleClose" :visible.sync="dialog" direction="rtl"  ref="drawer" :modal="false">
             <!-- 此处模态框有BUG所以关闭:modal = "false" -->
            <div class="demo-drawer__content">
              <div class="demo-drawer__footer">
                        <el-form :model="form" style="width:80%;margin:0 auto" :label-position="'left'">
                            <el-form-item label="季节或活动名字">
                                <el-input v-model="form.srName" autocomplete="off" />
                            </el-form-item>
                            <el-form-item label="开始时间" :label-width="formLabelWidth">
                                <el-date-picker v-model="form.srStartTime"  type="date"  placeholder="选择开始日期"  format="yyyy 年 M 月 d 日"    value-format="yyyy年M月d日" />
                            </el-form-item>
                            <el-form-item label="结束时间" :label-width="formLabelWidth">
                                <el-date-picker v-model="form.srEndTime"  type="date"  placeholder="选择结束日期"  format="yyyy 年 M 月 d 日"    value-format="yyyy年M月d日" />
                            </el-form-item>
                            <el-form-item label="是季节吗" :label-width="formLabelWidth">
                                <el-switch  v-model="form.isSeason" active-text="是季节" inactive-text="不是季节" />
                            </el-form-item>
                        </el-form>
                    <el-button @click="cancelForm">取 消</el-button>
                    <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
              </div>
            </div>
        </el-drawer>


        <!-- 修改部分 -->
        <el-dialog title="修改" :visible.sync="dialogVisible" :before-close="UpdatehandleClose" :modal="false" width="35%">
            <el-form :model="SelectedSeasonOrActivity" style="width:50%;margin:0 auto" :label-position="'left'">
                            <el-form-item label="季节或活动名字">
                                <el-input v-model="SelectedSeasonOrActivity.srName" autocomplete="off" />
                            </el-form-item>
                            <el-form-item label="开始时间" :label-width="formLabelWidth">
                                <el-date-picker v-model="SelectedSeasonOrActivity.srStartTime"  type="date"  placeholder="选择开始日期"  format="yyyy 年 M 月 d 日"    value-format="yyyy年M月d日" />
                            </el-form-item>
                            <el-form-item label="结束时间" :label-width="formLabelWidth">
                                <el-date-picker v-model="SelectedSeasonOrActivity.srEndTime"  type="date"  placeholder="选择结束日期"  format="yyyy 年 M 月 d 日"    value-format="yyyy年M月d日" />
                            </el-form-item>
                            <el-form-item label="是季节吗" :label-width="formLabelWidth">
                                <el-switch  v-model="SelectedSeasonOrActivity.isSeason" active-text="是季节" inactive-text="不是季节" />
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
            dialogVisible:false,
            dialogImageUrl:false,
            dialogindialogVisible:false,
            visible: false,   // 添加的弹出框开关
            dialog: false,   // 添加的Modal框
            loading: false, // 添加的加载
            formLabelWidth: '70px',
            drawerTitle:'', // 模态框内标题 用于重用
            SeasonOrActivity:[],
            SelectedSeasonOrActivity:{},
            form:{
                srName:'',
                srStartTime:'',
                srEndTime:'',
                isSeason:true,
            },
        }
    },
    methods:{
        async handleEdit(index, row) {
            await (this.SelectedSeasonOrActivity = JSON.parse(JSON.stringify(row))) // 转换成json再转回来就不会共用同一个地址
            await (this.dialogVisible = true)
        },
        cellmouseenter(row, column, cell, event) {
             this.selectedSeasonOrActivity = row;
        },
        handleDelete(index, row){
             this.$confirm('此操作将删除>>>'+row.srName+', 是否继续?', '提示', {
                 confirmButtonText: '确定',
                 cancelButtonText: '取消',
                 type: 'warning',
            }).then(async () => {
                await this.ServerDataRequest("/SeasonOrActivity/delete?id="+row.srID).then(res =>{
                  if(res){
                      this.notify_messeage("删除成功","success")
                      this.ServerDataRequest("/SeasonOrActivity/select").then((res) => { this.SeasonOrActivity = res})
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
            this.loading = false;
            this.dialog = false;
            clearTimeout(this.timer);
        },
        handleClose(done) { // 增加的方法
             if (this.loading) return;
             this.$confirm('确定添加吗？') .then(async (_) => {
                this.loading = true;
                if(this.form.srName != '' && this.form.srStartTime != '' && this.form.srEndTime != ''){
                    let url = "/SeasonOrActivity/insert?srName=" + this.form.srName + "&"
                            + "srStartTime="+this.form.srStartTime + "&"
                            + "srEndTime="+this.form.srEndTime + "&"
                            + "Season="+ this.form.isSeason
                    if(this.BigTime(this.form.srStartTime,this.form.srEndTime)){
                        this.loading = false;
                        return ;
                    }
                    this.ServerDataRequest(url).then(async (res) => { 
                        if(res){
                            await this.notify_messeage("添加季节成功","success")
                            await this.ServerDataRequest("/SeasonOrActivity/select").then((res) => { this.SeasonOrActivity = res})
                                this.form.srName = ''
                                this.form.srStartTime = ''
                                this.form.srEndTime = ''
                                this.loading = false
                            done();
                        } 
                        else{
                            await resetForm()
                            await this.notify_messeage("因为服务器的问题添加失败了","error")
                            this.loading = false;
                        }
                    })
                }else{
                    await this.notify_messeage("添加所需要的数据不全面","warning")
                    this.loading = false
                }
            }).catch(_ => {
                this.notify_messeage("取消",'warning')
                done();
            });
        },
        UpdatehandleClose(){
            this.dialogVisible = false
        },
        UpdateSubmit(){ // 修改
             let url = "/SeasonOrActivity/update?srName=" + this.SelectedSeasonOrActivity.srName + "&"
                            + "srStartTime="+this.SelectedSeasonOrActivity.srStartTime + "&"
                            + "srEndTime="+this.SelectedSeasonOrActivity.srEndTime + "&"
                            + "Season="+ this.SelectedSeasonOrActivity.isSeason + "&"
                            + "srID=" + this.SelectedSeasonOrActivity.srID
                if(this.BigTime(this.SelectedSeasonOrActivity.srStartTime,this.SelectedSeasonOrActivity.srEndTime)){
                        this.loading = false;
                        return ;
                }
                this.ServerDataRequest(url).then(async (res) =>{
                    if(res){
                        await this.notify_messeage("修改成功","success")
                        await (this.dialogVisible = false)
                        await this.ServerDataRequest("/SeasonOrActivity/select").then((res) => { this.SeasonOrActivity = res})
                    }else{
                        this.notify_messeage("修改失败","error")
                    }
                })
        },
        BigTime(startTime,EndTime){
            let start =  new Date(startTime.replace("年",'/').replace("月",'/').replace("日",'/')).getTime();
            let end =  new Date(EndTime.replace("年",'/').replace("月",'/').replace("日",'/')).getTime();
            if (start > end){
                this.notify_messeage("结束时间不能早于开始的时间","error")
                return true
            }else
                return false;
                
        },
    },
    created() {
        this.ServerDataRequest("/SeasonOrActivity/select").then((res) => { this.SeasonOrActivity = res})
    },
   

}
</script>