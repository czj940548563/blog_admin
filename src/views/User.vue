<template>
    <div>
        <div class="table-group">
            <div class="table-group-btn">
                <el-button type="primary" icon="el-icon-delete" size="small" @click="confirmDeleteUser">批量删除</el-button>
                <el-button type="primary" icon="el-icon-plus" size="small" @click="dialogFormVisible = true">添加用户
                </el-button>
            </div>

            <!----------添加用户dialog------->
            <el-dialog title="添加用户" :visible.sync="dialogFormVisible" @close="closeAddUser">

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
                    <el-button @click="reset('addUser')">重置</el-button>
                    <el-button type="primary" @click="submitUser('addUser')">确定</el-button>
                </div>
            </el-dialog>


            <!----------编辑用户dialog------->
            <el-dialog title="编辑" :visible.sync="dialogFormEditVisible" @close="closeEditUser">
                <el-form :model="editUser" status-icon :rules="rules1" :label-position="labelPosition"
                         label-width="80px"
                         ref="editUser">
                    <el-form-item label="账号" prop="account">
                        <el-input v-model="editUser.account" autocomplete="off" disabled="disabled"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                        <el-input v-model="editUser.mobile" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="mail">
                        <el-input v-model="editUser.mail" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="enable">
                        <el-switch class="enable-switch"
                                   v-model="editUser.enable"
                                   active-color="#13ce66"
                                   active-text="启用"
                                   inactive-text="禁用"
                                   active-value="1"
                                   inactive-value="0">
                        </el-switch>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="updateUser('editUser')">确定</el-button>
                </div>
            </el-dialog>
        </div>

        <div>
            <!------------user列表------------------->
            <el-table
                    ref="multipleTable"
                    :data="this.userList"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                    :default-sort="{prop: 'date', order: 'descending'}"
            >
                <el-table-column
                        v-for="(item, index) in tableKey"
                        v-if="item.date"
                        :prop="item.prop"
                        :label="item.label"
                        :type="item.type"
                        :formatter="dateFormatter"
                        :key="index"
                        align="center"
                        header-align="center"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        v-else-if="item.status"
                        :prop="item.prop"
                        :label="item.label"
                        :type="item.type"
                        :key="index"
                        align="center"
                        header-align="center"
                        filter-placement="bottom-end"
                        show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <el-tag
                                :type="scope.row.enable === '1' ? 'success' : 'info'"
                                disable-transitions>{{scope.row.enable === '1' ? '可用' : '禁用'}}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column
                        v-else-if="item.operation"
                        fixed="right"
                        :label="item.label"
                        :key="index"
                        align="center"
                        header-align="center"
                        show-overflow-tooltip>
                    <template slot="header" slot-scope="scope">
                        <el-input
                                v-model="search"
                                size="mini"
                                placeholder="输入关键字搜索"
                                width="120"
                        />
                    </template>
                    <template slot-scope="scope">
                        <el-button @click="dialogCheckRole=checkRole(scope.row)" type="danger" size="mini">角色
                        </el-button>
                        <el-button @click="edit(scope.row)" size="mini" icon="el-icon-edit" type="primary">编辑
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        v-else
                        :prop="item.prop"
                        :label="item.label"
                        :type="item.type"
                        :key="index"
                        align="center"
                        header-align="center"
                        show-overflow-tooltip>
                </el-table-column>
            </el-table>
        </div>

        <!----------user列表分页插件--------------------->
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

        <!-- 已有角色列表dialog---------------->
        <el-dialog title="角色" :visible.sync="dialogCheckRole" class="dialog_title">
            <div class="role-group-btn">
                <el-button type="primary" icon="el-icon-plus" size="small" @click="innerVisible = true" plain>添加角色
                </el-button>
            </div>

            <!----------可选角色列表dialog--------------------->
            <el-dialog
                    width="30%"
                    title="可选角色列表"
                    :visible.sync="innerVisible"
                    @open="getOtherRoles(1,user.roles,5)"
                    class="other-role"
                    append-to-body>
                <div class="role-block">
                    <role-table :tableData="otherRoles" :tableKey="roleTableKey"
                                :handleSelectionChange="handleRoleSelectionChange"></role-table>
                </div>
                <!----------可选角色列表分页插件--------------------->
                <div class="role-page-block">
                    <el-pagination
                            @current-change="handleRoleCurrentChange(user.roles)"
                            :current-page.sync="roleCurrentPage"
                            :page-size="5"
                            background
                            layout="prev, pager, next, jumper"
                            :total="roleTotal">
                    </el-pagination>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="confirmAddRoles" size="mini ">添加</el-button>
                </div>
            </el-dialog>
            <div>
                <!----------用户角色列表dialog--------------------->
                <el-table :data="user.roles">
                    <el-table-column
                            v-for="(item, index) in roleTableKey"
                            v-if="!item.date&&!item.type&&!item.operation"
                            :prop="item.prop"
                            :label="item.label"
                            :key="index"
                            show-overflow-tooltip
                    >
                    </el-table-column>

                    <el-table-column
                            v-else-if="item.operation"
                            fixed="right"
                            :label="item.label"
                            :key="index"
                            align="center"
                            header-align="center"
                            show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-button
                                    @click.native.prevent="deleteRoleRow(scope.$index,user.roles,user.id)"
                                    type="danger"
                                    size="mini">
                                移除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

        </el-dialog>
    </div>
</template>

<script>
    import RoleTable from '@/components/authCommon/AuthOtherRoleOrRight';
    import md5 from 'js-md5';
    import {
        dateFormat,
        confirmAdd,
        checkPhone,
        checkPassword,
        checkAccount,
        deleteSucess,
        updateSucess,
        addSucess,
        clearFormValidate,
        resetForm,
        confirmDelete,
        returnMsg
    } from "@/assets/authJs/common";

    export default {
        name: "User",
        components: {RoleTable},
        data() {
            return {


                roleTableKey: [
                    {
                        label: '',
                        prop: '',
                        type: 'selection',
                        date: false,
                        operation: false,
                    },
                    {
                        label: '创建日期',
                        prop: 'createTime',
                        type: '',
                        date: true,
                        operation: false,
                    },
                    {
                        label: '角色名称',
                        prop: 'roleName',
                        type: '',
                        date: false,
                        operation: false,
                    }, {
                        label: '描述',
                        prop: 'description',
                        type: '',
                        date: false,
                        operation: false,
                    },
                    {
                        label: '操作',
                        prop: '',
                        type: '',
                        date: false,
                        operation: true,
                    },
                ],
                tableKey: [
                    {
                        label: '',
                        prop: '',
                        type: 'selection',
                        date: false,
                        operation: false,
                        status: false,
                    },
                    {
                        label: '创建日期',
                        prop: 'createTime',
                        type: '',
                        date: true,
                        operation: false,
                        status: false,
                    }, {
                        label: '账号',
                        prop: 'account',
                        type: '',
                        date: false,
                        operation: false,
                        status: false,
                    }, {
                        label: '手机号',
                        prop: 'mobile',
                        type: '',
                        date: false,
                        operation: false,
                        status: false,
                    },
                    {
                        label: '邮箱',
                        prop: 'mail',
                        type: '',
                        date: false,
                        operation: false,
                        status: false,
                    }, {
                        label: '状态',
                        prop: 'enable',
                        type: '',
                        date: false,
                        operation: false,
                        status: true,
                    },
                    {
                        label: '操作',
                        prop: '',
                        type: '',
                        date: false,
                        operation: true,
                        status: false,
                    },
                ],
                labelPosition: 'left',
                userList: [],
                user: [],//操作的当前行的用户对象
                otherRoles: [],//不在用户中的角色
                userId: '',
                multipleSelection: [],//用户选择项
                selectionIds: [],//用户选择项的id
                roleMultipleSelection: [],//给用户增加角色的选择项
                roleSelectionIds: [],//给用户增加角色选择项的id
                search: '',
                dialogCheckRole: false,//已有角色列表dialog
                dialogFormVisible: false,//添加用户dialog
                dialogFormEditVisible: false,//编辑用户dialog
                innerVisible: false,//可选角色列表dialog

                //增加用户form表单绑定对象
                addUser: {
                    account: '',
                    password: '123456',
                    mobile: '',
                    mail: '',
                    enable: '',
                    roles: [],
                },

                editUser: [],
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
                rules1: {
                    mail: [
                        {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号码', trigger: 'blur'},
                        {validator: checkPhone, trigger: 'blur'}
                    ],
                },
                currentPageNum: 1,
                currentPageSize: 8,
                roleCurrentPage: 1,
                total: '',
                roleTotal: '',

            }

        },
        methods: {

            edit(val) {
                this.editUser = val;
                this.dialogFormEditVisible = true;
            },
            dateFormatter(row, column) {
                return dateFormat(row, column);
            },
            /**
             * 删除用户的某个角色
             * */
            deleteRoleRow(index, rows, uId) {
                let roleId = rows[index].id;
                let data = new FormData();
                data.append('userId', uId);
                data.append('roleId', roleId);
                this.$ajax.post('/api/auth/deleteRoleByUser', data).then(function (response) {
                    return response.data;
                }).then((date) => {
                    var code = date.code;
                    if (code == '200') {
                        deleteSucess(this);
                        rows.splice(index, 1);
                    }
                })

            },
            /**
             *
             * 批量删除用户
             * */
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
                }).then((data) => {
                    var code = data.code;
                    if (code == '200') {
                        for (var i = this.selectionIds.length - 1; i >= 0; i--) {//逆向循环待删除的数组防止破坏数组下标
                            this.userList.splice(this.selectionIds[i], 1)
                        }
                        deleteSucess(this);
                    } else {
                        returnMsg(this, data.msg, 'error')
                    }
                })
            },
            checkRole(val) {
                this.user = val;
                return true;
            },
            confirmDeleteUser() {
                confirmDelete(this, this.multipleSelection, 'user')
            }
            ,
            confirmAddRoles() {
                confirmAdd(this, this.roleMultipleSelection, 'user');
            }
            ,
            batchAddRoles() {
                var ids = [];
                let selection = this.roleMultipleSelection;
                for (var i = 0; i < selection.length; i++) {
                    ids.push(selection[i].id)
                }
                let data = new FormData();
                data.append('roleIds', ids);
                data.append('userId', this.user.id);
                this.$ajax.post('/api/auth/insertUserRole', data).then(function (response) {
                    return response.data;
                }).then((data) => {
                    var code = data.code;
                    if (code == '200') {
                        for (var i = this.roleSelectionIds.length - 1; i >= 0; i--) {//逆向循环待删除的数组防止破坏数组下标
                            this.otherRoles.splice(this.roleSelectionIds[i], 1)
                        }
                        addSucess(this);
                        this.innerVisible = false;
                        this.user.roles = data.data;
                    }
                })
            }
            ,
            /**
             * 将选中的行id放进待删除的数组中，后续进行对数组遍历删除
             * */
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.selectionIds = [];
                //获取选中行的index
                val.forEach((val, index) => {
                    this.userList.forEach((v, i) => {
                        // id 是每一行的数据id
                        if (val.id == v.id) {
                            this.selectionIds.push(i)
                        }
                    })
                })

            }
            ,
            /**
             * 将选中的行id放进数组中，后续进行对数组遍历添加
             * */
            handleRoleSelectionChange(val) {
                this.roleMultipleSelection = val;
                this.roleSelectionIds = [];
                //获取选中行的index
                val.forEach((val, index) => {
                    this.otherRoles.forEach((v, i) => {
                        // id 是每一行的数据id
                        if (val.id == v.id) {
                            this.roleSelectionIds.push(i)
                        }
                    })
                })

            }
            ,
            /**
             * 新增用户
             *
             * */
            submitUser(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addUser.password=md5(this.addUser.password);
                        let subData = this.addUser;
                        this.$ajax.post('/api/auth/insertUser', subData, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then(function (res) {
                            return res.data;
                        }).then((data) => {
                            if (data.code == '200') {
                                addSucess(this);
                                this.selectAllUser(this.currentPageNum, this.currentPageSize);
                                this.dialogFormVisible = false;
                                clearFormValidate(formName);
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
            }
            ,
            closeAddUser() {
                clearFormValidate(this, 'addUser');
                resetForm(this, 'addUser');
            },
            reset(formName) {
                resetForm(this, formName);
            }
            ,
            closeEditUser() {
                clearFormValidate(this, 'editUser');
                resetForm(this, 'editUser');
            }
            ,
            updateUser(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let subData = this.editUser;
                        this.$ajax.post('/api/auth/updateUser', subData, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then((response)=> {
                            return response.data;
                        }).then((data) => {
                            if (data.code == '200') {
                                updateSucess(this);
                                this.selectAllUser(this.currentPageNum, this.currentPageSize);
                                this.dialogFormEditVisible = false;
                                this.clearFormValidate(this, formName);
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

            }
            ,
            /**
             * 分页查找用户
             * @param pageNum
             * @param pageSize
             */
            selectAllUser(pageNum, pageSize) {
                this.$ajax.get('/api/auth/selectAllUser', {
                    params: {
                        pageNum: pageNum,
                        pageSize: pageSize
                    }
                }).then(
                    function (res) {
                        return res.data;
                    }
                ).then((data) => {
                    let data1 = data.data;
                    this.userList = data1.list;
                    this.total = data1.total;
                    this.currentPageSize = data1.pageSize;
                    this.currentPageNum = data1.pageNum;
                    //console.log(this.userList)
                }).catch(error => {
                    console.log(error)
                });
            }
            ,
            /**
             * 每页条数变化时触发
             * @param val
             */
            handleSizeChange(val) {
                this.selectAllUser(this.currentPageNum, val)
            }
            ,
            /**
             * 当前页改变是触发
             * @param val
             */
            handleCurrentChange(val) {
                this.selectAllUser(val, this.currentPageSize)
            }
            ,
            handleRoleCurrentChange(val, roles) {
                this.getOtherRoles(val, roles, 5)
            }
            ,
            getOtherRoles(pageNum, roles, pageSize) {
                let ids = [];
                if (roles.length > 0) {
                    roles.forEach(role => {
                        ids.push(role.id);
                    });
                }
                let data = new FormData()
                data.append('ids', ids);
                data.append('pageNum', pageNum)
                data.append('pageSize', pageSize)
                this.$ajax.post('/api/auth/selectOtherRoles', data)
                    .then(function (res) {
                        return res.data
                    }).then((data) => {
                    let data1 = data.data;
                    this.otherRoles = data1.list;
                    this.roleTotal = data1.total;
                    this.roleCurrentPage = data1.pageNum;
                }).catch(error => {
                    console.log(error)
                })
            }
        },
        mounted() {
            this.selectAllUser(this.currentPageNum, this.currentPageSize);
        }
    }
</script>

<style>
    .el-dialog__title {
        float: left;
        font-size: 20px !important;

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

    .page-block {
        margin-top: 30px;
    }

    .other-role {
        text-align: center;
    }

    .role-page-block {
        margin-top: 15px;
        height: 25px;
        line-height: 25px;
    }

    .role-group-btn {
        height: 40px;
        margin: 0;
        padding: 0;
        line-height: 40px;
    }
</style>
