<template>


    <div>
        <div class="table-group">
            <div class="table-group-btn">
                <el-button type="primary" icon="el-icon-delete" size="small" @click="confirmDeleteRight">批量删除
                </el-button>
                <el-button type="primary" icon="el-icon-plus" size="small" @click="dialogAddRight = true">添加权限
                </el-button>
            </div>
            <!--添加权限dialog---------->
            <el-dialog title="添加权限" :visible.sync="dialogAddRight" @close="closeAddRight">
                <el-form :model="addRight" status-icon :rules="addRightRule" :label-position="labelPosition"
                         label-width="80px"
                         ref="addRight">
                    <el-form-item label="权限" prop="rightName">
                        <el-input v-model="addRight.rightName" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="权限代码" prop="rightCode">
                        <el-input v-model="addRight.rightCode" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="description">
                        <el-input v-model="addRight.description" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="reset('addRole')">重置</el-button>
                    <el-button type="primary" @click="submitRight('addRight')">确定</el-button>
                </div>
            </el-dialog>

            <!--编辑权限dialog--->
            <div class="edit-right">
                <el-dialog title="编辑" :visible.sync="dialogEditRight" @close="closeEditRight">
                    <el-form :model="editRight" status-icon :rules="editRightRule" :label-position="labelPosition"
                             label-width="80px"
                             ref="editRight">
                        <el-form-item label="权限" prop="rightName">
                            <el-input v-model="editRight.rightName" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="权限代码" prop="rightCode">
                            <el-input v-model="editRight.rightCode" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="描述" prop="description">
                            <el-input v-model="editRight.description" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="状态" prop="enable">
                            <el-switch class="enable-switch"
                                       v-model="editRight.enable"
                                       active-color="#13ce66"
                                       active-text="启用"
                                       inactive-text="禁用"
                                       active-value="1"
                                       inactive-value="0">
                            </el-switch>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="updateRight('editRight')">确定</el-button>
                    </div>
                </el-dialog>
            </div>
        </div>
        <div><!--权限列表--->
            <el-table
                    ref="multipleTable"
                    :data="rightList"
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
        <!--分页插件-->
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

</template>

<script>

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
        name: "Right",
        data() {
            return {
                rightList: [],
                editRight: [],
                labelPosition: 'left',
                dialogAddRight: false,
                dialogEditRight: false,

                rightMultipleSelection: [],//权限选择项
                rightSelectionIds: [],//权限选择项的id

                total: '',
                search:'',
                currentPageSize: 8,
                currentPageNum: 1,
                //增加权限form表单绑定对象
                addRight: {
                    rightName: '',
                    rightCode:'',
                    description: '',

                },
                //编辑角色的校验规则
                addRightRule: {
                    rightName: [
                        {required: true, message: '权限不能为空', trigger: 'blur'},
                    ],
                    rightCode: [
                        {required: true, message: '权限代码不能为空', trigger: 'blur'},
                    ],
                },
                //编辑权限的校验规则
                editRightRule: {
                    rightName: [
                        {required: true, message: '权限不能为空', trigger: 'blur'},
                    ],
                    rightCode: [
                        {required: true, message: '权限代码不能为空', trigger: 'blur'},
                    ],
                },
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
                        label: '权限名称',
                        prop: 'rightName',
                        type: '',
                        date: false,
                        status: false,
                    },
                    {
                        label: '权限代码',
                        prop: 'rightCode',
                        type: '',
                        date: false,
                        status: false,
                    },
                    {
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
            updateRight(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let subData = this.editRight;
                        this.$ajax.post('/api/auth/updateRight', subData, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then(function (res) {
                            return res.data;
                        }).then((data) => {
                            if (data.code == '200') {
                                updateSucess(this);
                                this.selectAllRight(this.currentPageNum, this.currentPageSize);
                                this.dialogEditRight = false;
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

            selectAllRight(pageNum, pageSize) {
                this.$ajax.get('/api/auth/selectAllRight', {
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
                    this.rightList = data1.list;
                    this.total = data1.total;
                    this.currentPageSize = data1.pageSize;
                    this.currentPageNum = data1.pageNum;
                    //console.log(this.userList)
                }).catch(error => {
                    console.log(error)
                });
            },
            submitRight(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let subData = this.addRight;
                        this.$ajax.post('/api/auth/insertRight', subData, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then(function (res) {
                            return res.data;
                        }).then((data) => {
                            if (data.code == '200') {
                                addSucess(this);
                                this.selectAllRight(this.currentPageNum, this.currentPageSize);
                                this.dialogAddRight = false;
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
            batchDeleteRight() {
                let ids = [];
                let selection = this.rightMultipleSelection;
                for (let i = 0; i < selection.length; i++) {
                    ids.push(selection[i].id)
                }
                let data = new FormData();
                data.append('ids', ids);
                this.$ajax.post('/api/auth/deleteRights', data).then(function (response) {
                    return response.data;
                }).then((data) => {
                    var code = data.code;
                    if (code == '200') {
                        for (var i = this.rightSelectionIds.length - 1; i >= 0; i--) {//逆向循环待删除的数组防止破坏数组下标
                            this.rightList.splice(this.rightSelectionIds[i], 1)
                        }
                        deleteSucess(this);
                    } else {
                        returnMsg(this, data.msg, 'error')
                    }
                })
            },
            closeEditRight(){
                clearFormValidate(this, 'editRight');
                resetForm(this, 'editRight');
            },
            closeAddRight() {
                clearFormValidate(this, 'addRight');
                resetForm(this, 'addRight');
            },
            confirmDeleteRight() {
                confirmDelete(this, this.rightMultipleSelection, 'right');
            },

            dateFormatter(row, column) {
                return dateFormat(row, column)
            },

            edit(val) {
                this.editRight = val;
                this.dialogEditRight = true;
            },

            /**
             * 将选中的行id放进待删除的数组中，后续进行对数组遍历删除
             * */
            handleSelectionChange(val) {
                this.rightMultipleSelection = val;
                this.rightSelectionIds = [];
                //获取选中行的index
                val.forEach((val, index) => {
                    this.rightList.forEach((v, i) => {
                        // id 是每一行的数据id
                        if (val.id == v.id) {
                            this.rightSelectionIds.push(i)
                        }
                    })
                })

            },
            /**
             * 每页条数变化时触发
             * @param val
             */
            handleSizeChange(val) {
                this.selectAllRight(this.currentPageNum, val)
            },
            /**
             * 当前页改变是触发
             * @param val
             */
            handleCurrentChange(val) {
                this.selectAllRight(val, this.currentPageSize)
            },


        },
        created() {
            this.selectAllRight(this.currentPageNum, this.currentPageSize);
        }
    }
</script>

<style scoped>

</style>
