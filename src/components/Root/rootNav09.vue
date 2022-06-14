<template>
    <div >
        <div class="nav09_bg">
			<div class="nav09_bt">奇妙留言</div>
		</div>
      <!-- 内容主体部分 -->
      <div style="width:80%;margin:5vh auto">
            <el-table :data="talkMesseage" height="500" stripe  >
                <el-table-column align="center" prop="talkMesseageID" label="信息ID" />
                <el-table-column align="center" prop="talkMesseageContent" label="信息内容" />
                <el-table-column align="center" prop="account.accountUsername" label="发送的用户" sortable />
                <el-table-column align="center" prop="talkMesseageTime" label="发送的时间" />
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope" style="float:left">
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
            talkMesseage:[],
        }
    },
    methods:{
        handleDelete(index, row){
            this.talkMesseage = row;
             this.$confirm('此操作将删除id为>>'+row.talkMesseageID+'这条消息, 是否继续?', '提示', {
                 confirmButtonText: '确定',
                 cancelButtonText: '取消',
                 type: 'warning',
            }).then(async () => {
                await this.ServerDataRequest("/talkMesseage/delete?id="+row.talkMesseageID).then(res =>{
                  if(res){
                      this.notify_messeage("删除成功","success")
                      this.ServerDataRequest("/talkMesseage/select").then(res =>{this.talkMesseage = res})
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
        this.ServerDataRequest("/talkMesseage/select").then(res =>{this.talkMesseage = res})
    },

}
</script>