<template>
    <div>
        <div class="table-group">
            <div class="table-group-btn">
                <el-button type="primary" icon="el-icon-delete" size="small" @click="confirmDeleteRole">批量删除</el-button>
                <el-button type="primary" icon="el-icon-plus" size="small" @click="dialogAddRole = true">添加角色
                </el-button>
            </div>
            <!--添加角色dialog---------->
            <el-dialog title="添加角色" :visible.sync="dialogAddRole" @close="closeAddRole">
                <el-form :model="addRole" status-icon :rules="addRoleRule"  :label-position="labelPosition" label-width="80px"
                         ref="addRole">
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="addRole.roleName" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="description">
                        <el-input v-model="addRole.description" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="reset('addRole')">重置</el-button>
                    <el-button type="primary" @click="submitRole('addRole')">确定</el-button>
                </div>
            </el-dialog>



            <!----------编辑角色dialog------->
            <div class="edit-role">
                <el-dialog title="编辑" :visible.sync="dialogEditRole" @close="closeEditRole">
                    <el-form :model="editRole" status-icon :rules="editRoleRule" :label-position="labelPosition"
                             label-width="80px"
                             ref="editRole">
                        <el-form-item label="角色名称" prop="roleName">
                            <el-input v-model="editRole.roleName" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="描述" prop="description">
                            <el-input v-model="editRole.description" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="状态" prop="enable">
                            <el-switch class="enable-switch"
                                       v-model="editRole.enable"
                                       active-color="#13ce66"
                                       active-text="启用"
                                       inactive-text="禁用"
                                       active-value="1"
                                       inactive-value="0">
                            </el-switch>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="updateRole('editRole')">确定</el-button>
                    </div>
                </el-dialog>
            </div>
        </div>

        <div>
            <div>
                <!--角色列表--->
                <el-table
                        ref="multipleTable"
                        :data="this.roleList"
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
                            :formatter="dateFormatter"
                            :type="item.type"
                            :key="index"
                            align="center"
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
                            <el-button @click="dialogCheckRight=checkRight(scope.row)" type="danger" size="mini">权限
                            </el-button>
                            <el-button @click="edit(scope.row)" size="mini" icon="el-icon-edit" type="primary">编辑</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                            v-else
                            :prop="item.prop"
                            :label="item.label"
                            :type="item.type"
                            :key="index"
                            align="center"
                            show-overflow-tooltip
                    >
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
        </div>


        <!--已有权限列表----->
        <el-dialog title="权限" :visible.sync="dialogCheckRight" class="dialog_title">
            <div class="role-group-btn">
                <el-button type="primary" icon="el-icon-plus" size="small" @click="addRightDialog = true" plain>添加权限
                </el-button>
            </div>
            <!--可选权限dialog-->
            <div>
                <el-dialog
                        width="30%"
                        title="可选权限列表"
                        :visible.sync="addRightDialog"
                        @open="getOtherRights(1,role.rights,5)"
                        class="other-role"
                        append-to-body>
                    <div class="role-block">
                        <right-table :tableData="otherRights" :tableKey="rightTableKey"
                                     :handleSelectionChange="handleRightSelectionChange"></right-table>
                    </div>
                    <!----------可选权限列表分页插件--------------------->
                    <div class="role-page-block">
                        <el-pagination
                                @current-change="handleRightCurrentChange(role.rights)"
                                :current-page.sync="rightCurrentPage"
                                :page-size="5"
                                background
                                layout="prev, pager, next, jumper"
                                :total="rightTotal">
                        </el-pagination>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="confirmAddRights" size="mini ">添加</el-button>
                    </div>
                </el-dialog>
            </div>
            <div>
                <el-table :data="role.rights">
                    <el-table-column
                            v-for="(item, index) in rightTableKey"
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
                                    @click.native.prevent="deleteRightRow(scope.$index,role.rights,role.id)"
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
    import RightTable from "@/components/authCommon/AuthOtherRoleOrRight"

    import {
        dateFormat,
        deleteSucess,
        clearFormValidate,
        updateSucess,
        confirmAdd,
        addSucess,
        confirmDelete,
        resetForm,
        returnMsg
    } from "@/assets/authJs/common";

    export default {
        name: "Role",
        components: {RightTable},
        data() {
            return {
                multipleSelection: [],//角色选择项
                selectionIds: [],//角色选择项的id
                rightMultipleSelection: [],//给角色增加权限的选择项
                rightSelectionIds: [],//给角色增加权限选择项的id
                labelPosition: 'left',
                dialogAddRole:false,
                dialogEditRole: false,
                addRightDialog: false,
                dialogCheckRight: false,
                otherRights: [],
                editRole: [],
                role: [],
                roleList: [],
                currentPageNum: 1,
                currentPageSize: 8,
                rightCurrentPage: 1,
                total: '',
                rightTotal: '',
                search:'',
                //增加用户form表单绑定对象
                addRole: {
                    roleName: '',
                    description: '',
                    rights:[],
                },

                //添加角色的校验规则
                addRoleRule: {
                    roleName: [
                        {required: true, message: '角色名称不能为空', trigger: 'blur'},
                    ],
                },
                //编辑角色的校验规则
                editRoleRule: {
                    roleName: [
                        {required: true, message: '角色名称不能为空', trigger: 'blur'},
                    ],
                },
                rightTableKey: [
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
                        label: '权限名称',
                        prop: 'rightName',
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
                    },],
                tableKey: [
                    {
                        label: '',
                        prop: '',
                        type: 'selection',
                        date: false,
                        status: false,
                    },
                    {
                        label: '创建日期',
                        prop: 'createTime',
                        type: '',
                        date: true,
                        status: false,
                    }, {
                        label: '角色名称',
                        prop: 'roleName',
                        type: '',
                        date: false,
                        status: false,
                    }, {
                        label: '描述',
                        prop: 'description',
                        type: '',
                        date: false,
                        status: false,
                    }, {
                        label: '可用状态',
                        prop: 'enable',
                        type: '',
                        date: false,
                        status: true,
                    }, {
                        label: '操作',
                        prop: '',
                        type: '',
                        date: false,
                        operation: true,
                        status: false,
                    },
                ],
            }
        },
        methods: {
            submitRole(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let subData = this.addRole;
                        this.$ajax.post('/api/auth/insertRole', subData, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then(function (res) {
                            return res.data;
                        }).then((data) => {
                            if (data.code == '200') {
                                addSucess(this);
                                this.selectAllRole(this.currentPageNum, this.currentPageSize);
                                this.dialogAddRole = false;
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
            },

            reset(formName) {
                resetForm(this, formName);
            },
            closeAddRole(){
                clearFormValidate(this, 'addRole');
                resetForm(this, 'addRole');
            },
            /**
             *
             * 批量删除角色
             * */
            batchDeleteRole(){
                let ids = [];
                let selection = this.multipleSelection;
                for (let i = 0; i < selection.length; i++) {
                    ids.push(selection[i].id)
                }
                let data = new FormData();
                data.append('ids', ids);
                this.$ajax.post('/api/auth/deleteRoles', data).then(function (response) {
                    return response.data;
                }).then((data) => {
                    var code = data.code;
                    if (code == '200') {
                        for (var i = this.selectionIds.length - 1; i >= 0; i--) {//逆向循环待删除的数组防止破坏数组下标
                            this.roleList.splice(this.selectionIds[i], 1)
                        }
                        deleteSucess(this);

                    }else {
                        returnMsg(this,data.msg,'error')
                    }
                })
            },

            confirmDeleteRole(){
                confirmDelete(this,this.multipleSelection,'role');
            },

            /**
             * 给某个角色添加权限
             *
             * */
            batchAddRights() {
                let ids = [];
                let selection = this.rightMultipleSelection;
                for (let i = 0; i < selection.length; i++) {
                    ids.push(selection[i].id)
                }
                let data = new FormData();
                data.append('rightIds', ids);
                data.append('roleId', this.role.id);
                this.$ajax.post('/api/auth/insertRoleRight', data).then(function (response) {
                    return response.data;
                }).then((data) => {
                    var code = data.code;
                    if (code == '200') {
                        for (var i = this.rightSelectionIds.length - 1; i >= 0; i--) {//逆向循环待删除的数组防止破坏数组下标
                            this.otherRights.splice(this.rightSelectionIds[i], 1)
                        }
                        addSucess(this);
                        this.addRightDialog = false;
                        this.role.rights = data.data;
                    }
                })
            }
            ,

            confirmAddRights() {
                confirmAdd(this, this.rightMultipleSelection, 'role');
            },
            handleRightCurrentChange(val, rights) {
                this.getOtherRights(val, rights, 5)
            },
            /**
             * 将选中的行id放进待删除的数组中，后续进行对数组遍历删除
             * */
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.selectionIds = [];
                //获取选中行的index
                val.forEach((val, index) => {
                    this.roleList.forEach((v, i) => {
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
            handleRightSelectionChange(val) {
                this.rightMultipleSelection = val;
                this.rightSelectionIds = [];
                //获取选中行的index
                val.forEach((val, index) => {
                    this.otherRights.forEach((v, i) => {
                        // id 是每一行的数据id
                        if (val.id == v.id) {
                            this.rightSelectionIds.push(i)
                        }
                    })
                })

            }
            ,
            getOtherRights(pageNum, rights, pageSize) {
                let ids = [];
                if (rights.length > 0) {
                    rights.forEach(right => {
                        ids.push(right.id);
                    });
                }
                let data = new FormData()
                data.append('ids', ids);
                data.append('pageNum', pageNum)
                data.append('pageSize', pageSize)
                this.$ajax.post('/api/auth/selectOtherRights', data)
                    .then(function (res) {
                        return res.data
                    }).then((data) => {
                    let data1 = data.data;
                    this.otherRights = data1.list;
                    this.rightTotal = data1.total;
                    this.rightCurrentPage = data1.pageNum;
                }).catch(error => {
                    console.log(error)
                })
            },

            /**
             *
             * 更新角色
             * */
            updateRole(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let subData = this.editRole;
                        this.$ajax.post('/api/auth/updateRole', subData, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then(function (res) {
                            return res.data;
                        }).then((data) => {
                            if (data.code == '200') {
                                updateSucess(this);
                                this.selectAllRole(this.currentPageNum, this.currentPageSize);
                                this.dialogEditRole = false;
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

            },


            /**
             *
             * 关闭编辑角色页面后清除校验提示，如果有校验
             * */
            closeEditRole() {
                clearFormValidate(this, 'editRole');
                resetForm(this, 'editRole');
            },
            edit(val) {
                this.editRole = val;
                this.dialogEditRole = true;
            },

            /**
             * 删除角色的某个权限
             * */
            deleteRightRow(index, rows, roleId) {
                let rightId = rows[index].id;
                let data = new FormData();
                data.append('roleId', roleId);
                data.append('rightId', rightId);
                this.$ajax.post('/api/auth/deleteRightByRole', data).then(function (response) {
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
             * 分页查找
             * */
            selectAllRole(pageNum, pageSize) {
                this.$ajax.get('/api/auth/selectAllRole', {
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
                    this.roleList = data1.list;
                    this.total = data1.total;
                    this.currentPageSize = data1.pageSize;
                    this.currentPageNum = data1.pageNum;
                    //console.log(this.userList)
                }).catch(error => {
                    console.log(error)
                });
            },
            /**
             * 每页条数变化时触发
             * @param val
             */
            handleSizeChange(val) {
                this.selectAllRole(this.currentPageNum, val)
            },
            /**
             * 当前页改变是触发
             * @param val
             */
            handleCurrentChange(val) {
                this.selectAllRole(val, this.currentPageSize)
            },

            dateFormatter(row, column) {
                return dateFormat(row, column)
            },

            checkRight(val) {
                this.role = val;
                return true;
            }

        },

        created() {
            this.selectAllRole(this.currentPageNum, this.currentPageSize);
        }
    }
</script>

<style>
    .enable-switch {
        float: left;
        height: 40px;
        line-height: 40px;
    }

    .el-switch__label {
        height: 40px;
        line-height: 40px;
    }
</style>
