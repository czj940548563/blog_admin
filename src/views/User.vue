<template>
    <div>
        <div class="table-group">
            <div class="table-group-btn">
                <el-button type="primary" icon="el-icon-delete" size="small" @click="confirmDeleteUser">批量删除</el-button>
                <el-button type="primary" icon="el-icon-plus" size="small" @click="dialogFormVisible = true">添加用户
                </el-button>
            </div>
            <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
                <el-form :model="addUser" status-icon :rules="rules" :label-position="labelPosition" label-width="80px"
                         ref="addUser">
                    <el-form-item label="账号" prop="account">
                        <el-input v-model="addUser.account" autocomplete="off" placeholder="账号默认密码为123456"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                        <el-input v-model="addUser.mobile" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="mail">
                        <el-input v-model="addUser.mail" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="resetForm('addUser')">重置</el-button>
                    <el-button type="primary" @click="submitUser('addUser')">确定</el-button>
                </div>
            </el-dialog>
        </div>

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
                >
                </el-table-column>
                <el-table-column
                        prop="mail"
                        label="邮箱"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        align="right"
                        fixed="right"
                        label="操作"
                        width="180">
                    <template slot="header" slot-scope="scope">
                        <el-input
                                v-model="search"
                                size="mini"
                                placeholder="输入关键字搜索"
                                width="120"
                        />
                    </template>
                    <template slot-scope="scope">
                        <el-button @click="dialogTableVisible=checkRole(scope.row)" type="text" size="small">角色
                        </el-button>
                        <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="page-block">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    background
                    :current-page="currentPageNum"
                    :page-sizes="[8,20,50,100]"
                    :page-size="currentPageSize"
                    layout="sizes,prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>


        <el-dialog title="角色" :visible.sync="dialogTableVisible">
            <div class="role-group-btn">
                <el-button type="primary" icon="el-icon-plus" size="mini">添加角色</el-button>
            </div>
            <el-table :data="roles">
                <el-table-column property="createTime" label="创建日期" width="100"
                                 :formatter="dateFormat"></el-table-column>
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
            var checkAccount = (rule, value, callback) => {
                if (value != '') {
                    let form = new FormData();
                    form.append("account", value);
                    this.$ajax.post('/api/auth/selectUserByAccount', form).then(function (res) {
                        return res.data
                    }).then((data) => {
                        if (data.code == '500105') {
                            return callback(new Error('已存在该账号'))
                        } else {
                            callback();
                        }
                    });
                }
            };
            var checkPhone = (rule, value, callback) => {
                if (value != '') {
                    if (value !== '') {
                        var reg = /^1[3456789]\d{9}$/;
                        if (!reg.test(value)) {
                            callback(new Error('请输入有效的手机号码'));
                        }
                    }
                    callback();
                }
            };
            return {
                labelPosition: 'left',
                userList: [],
                roles: [],
                loading: true,
                dialogTableVisible: false,
                userId: '',
                multipleSelection: [],
                deleteIndex: [],
                search: '',
                dialogFormVisible: false,
                addUser: {
                    account: '',
                    password: '123456',
                    mobile: '',
                    mail: ''
                },
                rules: {
                    account: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                        {validator: checkAccount, trigger: 'blur'}
                    ],
                    mail: [
                        {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号码', trigger: 'blur'},
                        {validator: checkPhone, trigger: 'blur'}
                    ]
                },
                currentPageNum:1,
                currentPageSize:8,
                total:''


            }
        },
        methods: {
            deleteRow(index, rows) {
                rows.splice(index, 1);
            },
            checkRole(val) {
                this.roles = val.roles;
                this.userId = val.id;
                return true;
            },
            dateFormat(row, column) {
                var date = row[column.property];
                return date.substring(0, 10)
            },
            deleteRoleRow(index, rows, uId) {
                var userId = uId;
                var roleId = rows[index].id;
                let data = new FormData();
                data.append('userId', userId);
                data.append('roleId', roleId);
                this.$ajax.post('/api/auth/deleteRoleByUser', data).then(function (response) {
                    return response.data;
                }).then((date) => {
                    var code = date.code;
                    if (code == '200') {
                        this.deleteRoleSucess();
                        rows.splice(index, 1);
                    }
                })

            },
            deleteRoleSucess() {
                this.$message({
                    message: '删除成功',
                    type: 'success',
                    duration: 1000,
                    center: true
                });
            },
            batchDeleteUser() {
                var ids = [];
                let selection = this.multipleSelection;
                for (var i = 0; i < selection.length; i++) {
                    ids.push(selection[i].id)
                }
                let data = new FormData();
                data.append('ids', ids);
                this.$ajax.post('/api/auth/deleteUsers', data).then(function (response) {
                    return response.data;
                }).then((date) => {
                    var code = date.code;
                    if (code == '200') {
                        for (var i = this.deleteIndex.length - 1; i >= 0; i--) {//逆向循环防止破坏数组下标
                            this.userList.splice(this.deleteIndex[i], 1)
                        }
                        this.deleteRoleSucess();

                    }
                })
            },
            confirmDeleteUser() {
                if (this.multipleSelection.length > 0) {
                    this.$confirm('确认删除？')
                        .then(() => {
                            this.batchDeleteUser();
                        })
                        .catch(_ => {
                        });
                } else {
                    this.$message({
                        showClose: true,
                        message: '请选择行',
                        center: true,
                        type: 'warning'
                    });
                }

            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.deleteIndex = [];
                //获取选中行的index
                val.forEach((val, index) => {
                    this.userList.forEach((v, i) => {
                        // id 是每一行的数据id
                        if (val.id == v.id) {
                            this.deleteIndex.push(i)
                        }
                    })
                })

            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            submitUser(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$ajax.post('/api/auth/regist', this.addUser, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then(function (res) {
                            return res.data;
                        }).then((data) => {
                            if (data.code == '200') {
                                this.$message({
                                    showClose: true,
                                    message: '添加成功',
                                    center: true,
                                    type: 'success'
                                });
                                this.selectAllUser();
                                this.dialogFormVisible = false;
                            } else {
                                this.$message({
                                    showClose: true,
                                    message: data.msg,
                                    center: true,
                                    type: 'error'
                                });
                            }
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: '请输入正确的数据',
                            center: true,
                            type: 'warning'
                        });
                        return false;
                    }
                });
            },
            selectAllUser(pageNum,pageSize) {
                this.$ajax.get('/api/auth/selectAllUser',{
                    params: {
                        pageNum: pageNum,
                        pageSize:pageSize
                    }
                }).then(
                    function (res) {
                        return res.data;
                    }
                ).then((data) => {
                    let data1 = data.data;
                    this.userList = data1.list;
                    this.total=data1.total;
                    this.currentPageSize=data1.pageSize;
                    this.currentPageNum=data1.pageNum;
                    this.loading = false;
                    //console.log(this.userList)
                }).catch(error => {
                    console.log(error)
                });
            },
            handleSizeChange(val) {
                this.selectAllUser(this.currentPageNum,val)
            },
            handleCurrentChange(val) {
                this.selectAllUser(val,this.currentPageSize)
            }
        },
        created() {
            this.selectAllUser(this.currentPageNum,this.currentPageSize);
        }
    }
</script>

<style>
    .el-dialog__title {
        float: left;
    }

    .table-group {
        height: 40px;
        line-height: 40px;
        text-align: left;
    }

    .table-group-btn {
        display: inline-block;
    }

    .role-group-btn {
        height: 30px;
        line-height: 30px;
        text-align: left;
    }
    .page-block{
        margin-top: 30px;
    }
</style>
