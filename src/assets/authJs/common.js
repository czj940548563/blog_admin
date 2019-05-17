import axios from 'axios'

export const dateFormat = (row, column) => {
    let date = row[column.property];
    return date.substring(0, 10)
};


export const confirmAdd = (_this, selection, judge) => {
    if (selection.length > 0) {
        _this.$confirm('确认添加？')
            .then(() => {
                if (judge == 'user') {
                    _this.batchAddRoles();
                }
                if (judge == 'role') {
                    _this.batchAddRights();
                }
            })
            .catch(_ => {
            });
    } else {
        _this.$message({
            showClose: true,
            message: '请选择行',
            center: true,
            type: 'warning'
        });
    }
};


export const confirmDelete = (_this, selection, judge) => {
    if (selection.length > 0) {
        _this.$confirm('确认删除？')
            .then(() => {
                if (judge == 'user') {
                    _this.batchDeleteUser();
                }
                if (judge == 'role') {
                    _this.batchDeleteRole();
                }
                if (judge == 'right') {
                    _this.batchDeleteRight();
                }
            })
            .catch(_ => {
            });
    } else {
        _this.$message({
            showClose: true,
            message: '请选择行',
            center: true,
            type: 'warning'
        });
    }
};


//校验
//密码
export const checkPassword = (rule, value, callback) => {
    if (value != '') {
        if (value !== '') {
            if (value.length > 16) {
                callback(new Error('密码不能大于16位'))
            }
        }
        callback();
    }
};
//手机号
export const checkPhone = (rule, value, callback) => {
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

//账号唯一
export const checkAccount = (rule, value, callback) => {
    if (value != '') {
        let form = new FormData();
        form.append("account", value);
        axios.post('/api/auth/selectUserByAccount', form).then(function (res) {
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
export const validatePass = (rule, value, callback) => {
    if (value.length > 16) {
        callback(new Error("密码不能大于16位"));
    } else {
        callback();
    }
};

export const deleteSucess = (_this) => {
    _this.$message({
        message: '删除成功',
        type: 'success',
        duration: 1000,
        center: true
    });
};
export const addSucess = (_this) => {
    _this.$message({
        message: '添加成功',
        type: 'success',
        duration: 1000,
        center: true
    });
};
export const updateSucess = (_this) => {
    _this.$message({
        message: '更新成功',
        type: 'success',
        duration: 1000,
        center: true
    });
};

export const returnMsg = (_this, msg, type) => {
    _this.$message({
        message: msg,
        type: type,
        duration: 1000,
        center: true
    });
};

//清除表单验证结果
export const clearFormValidate = (_this, formName) => {
    _this.$refs[formName].clearValidate();
};

//重置
export const resetForm = (_this, formName) => {
    _this.$refs[formName].resetFields();
}





