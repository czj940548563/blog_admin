<template>
    <div>
        <el-table
                ref="multipleTable"
                v-loading="loading"
                :data="userList"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                :default-sort="{prop: 'date', order: 'descending'}"
        >
            <el-table-column
                    type="selection"
                    prop="id"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    label="日期"
                    :formatter="dateFormat"
                    sortable
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="account"
                    label="账号"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="mobile"
                    label="手机号"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="mail"
                    label="邮箱"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="120">
                <template slot-scope="scope">
                    <el-button @click="dialogTableVisible=checkRole(scope.row)" type="text" size="small">角色</el-button>
                    <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button
                            @click.native.prevent="deleteRow(scope.$index, userList)"
                            type="text"
                            size="small">
                        移除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="角色" :visible.sync="dialogTableVisible">
            <el-table :data="roles">
                <el-table-column property="createTime" label="创建日期" width="100"  :formatter="dateFormat"></el-table-column>
                <el-table-column property="roleName" label="角色名称" width="100"></el-table-column>
                <el-table-column property="description" label="描述" show-overflow-tooltip></el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="120">
                    <template slot-scope="scope">
                        <el-button
                                @click.native.prevent="deleteRoleRow(scope.$index,roles,userId)"
                                type="text"
                                size="small">
                            移除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "User",
        data() {
            return {
                userList: [],
                roles: [],
                loading: true,
                dialogTableVisible: false,
                userId:''
            }
        },
        methods: {
            deleteRow(index, rows) {
                rows.splice(index, 1);
            },
            checkRole(val) {
                this.roles = val.roles;
                this.userId=val.id;
                return true;
            },
            dateFormat(row, column) {
                var date = row[column.property];
                return date.substring(0, 10)
            },
            deleteRoleRow(index,rows,uId){
               var userId=uId;
               var roleId=rows[index].id;
               this.$ajax.post('/api/auth/deleteRoleByUser',{
                    'userId':'1',
                    'roleId':'3',
                }).then(function (response) {
                    return response.data;
                }).then((date)=>{
                    var code=date.code;
                    if (code=='200'){
                        this.deleteRoleSucess();
                        rows.splice(index, 1);
                    }
                })

            },
            deleteRoleSucess(){
                this.$message({
                    message: '删除成功',
                    type: 'success',
                    duration:1000,
                    center:true
                });
            }

        },
        created() {
            this.$ajax.get('/api/auth/selectAllUser').then(
                function (res) {
                    return res.data;
                }
            ).then((data) => {
                var users = data.data;
                var arr = new Array();
                for (var i = 0; i < users.length; i++) {
                    arr.push(users[i]);
                }
                this.userList = arr;
                this.loading = false;
                console.log(this.userList)
            }).catch(error => {
                console.log(error)
            })
        }
    }
</script>

<style>
    .el-dialog__title {
        float: left;
    }
</style>
