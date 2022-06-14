<template>
    <div>
      <!-- 内容主体部分 -->
      <div style="width:70%;margin:0px auto">
            <el-table :data="Report" height="500" stripe  >
                <el-table-column align="center" prop="reportListTitle" label="举报标题" />
                <el-table-column align="center" prop="reportListimage" label="举报图片" />
                <el-table-column align="center" prop="reportListMesseage" label="举报的详细信息" />
                <el-table-column align="center" prop="accountUsername" label="举报用户" />
                <el-table-column align="center" prop="reportTime" label="举报时间" />
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope" style="float:left">
                        <el-button size="mini"  @click="handleEdit(scope.$index, scope.row)" type="warning" plain>编辑</el-button>
                        <el-button size="mini"  @click="handleDelete(scope.$index, scope.row)" type="danger" plain >删除</el-button>
                    </template>  
                </el-table-column>
            </el-table>
      </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            Report:[],
            selectedReport:{}
        }
    },
    methods:{
        cellmouseenter(row, column, cell, event) {
             this.SelectReport = row;
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
                      this.ServerDataRequest("/reprint").then((res) => {this.Report = res;});
                  }
                  else    
                    this.notify_messeage("删除失败","error")
                })
            }).catch(() => {
                this.notify_messeage("取消删除","warning")
            });
        },
    },
    created() {
        this.ServerDataRequest("report").then((res) => { this.Report = res})
    },

}
</script>