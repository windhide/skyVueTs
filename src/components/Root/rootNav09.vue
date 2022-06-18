<template>
    <div >
        <div class="nav09_bg">
			<div class="nav09_bt">奇妙留言</div>
		</div>
      <!-- 内容主体部分 -->
        <div style="width:80%;margin:5vh auto">
              <el-table :data="talkMesseage" height="500" stripe  >
                  <el-table-column align="center" prop="talkMesseageID" label="信息ID" width="100" />
                  <el-table-column align="center" prop="talkMesseageContent" label="信息内容" />
                  <el-table-column align="center" prop="account.accountUsername" label="发送的用户"  width="100" />
                  <el-table-column align="center" prop="talkMesseageTime" label="发送的时间" />
                  <el-table-column label="操作" width="100">
                      <template #default="scope">
                            <el-button size="default"  @click="handleDelete(scope.$index, scope.row)" type="danger" plain >删除</el-button>
                      </template> 
                  </el-table-column>
              </el-table>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ServerDataRequest,notify_messeage } from '@/apis/defineFunction'
    import {reactive, ref, watch} from 'vue'
    import {ElMessageBox} from 'element-plus'
    
    let talkMesseage:any = reactive([])

    ServerDataRequest("/talkMesseage/select").then(res=>{ talkMesseage.push(...res) })

    function handleDelete(index:any,row:any){
        ElMessageBox.confirm('确定删除用户:'+row.account.accountUsername+'的>>>'+row.talkMesseageContent+'信息吗?', '提示', {
             confirmButtonText: '确定',
             cancelButtonText: '取消',
             type: 'warning',
        }).then(async () => {
            ServerDataRequest("/talkMesseage/delete?id="+row.talkMesseageID).then(res=>{
                if(res){
                    notify_messeage("删除成功!","success")
                    ServerDataRequest("/talkMesseage/select").then(res=>{talkMesseage.length = 0;talkMesseage.push(...res) })
                }
                else
                    notify_messeage("删除失败","error")
            })
        }).catch(() => {
            notify_messeage("取消删除","warning")
        })
    }

</script>