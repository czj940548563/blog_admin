<template>
    <div class="login-container">
        <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm"
                 label-position="left">
            <h3 class="title">Clownc Blog Admin</h3>
            <el-form-item prop="account">
                <span class="fontcontainer">
                    <span class="iconfont icon-yonghu"></span>
                </span>
                <!-- <span class="svg-container svg-container_login">
                    <svg-icon icon-class="user" />
                </span> -->
                <el-input name="account" type="text" v-model="loginForm.account" autoComplete="on"
                          placeholder="account"/>
            </el-form-item>
            <el-form-item prop="password">
                <span class="fontcontainer">
                    <span class="iconfont icon-mima"></span>
                </span>
                <!-- <span class="svg-container">
                <svg-icon icon-class="password"></svg-icon>
                </span> -->
                <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password"
                          autoComplete="on"
                          placeholder="password"></el-input>
                <!-- <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span> -->
                <span class="show-pwd iconfont icon-yanjing" @click="showPwd"></span>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width:100%;" @click.native.prevent="handleLogin">
                    Sign in
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {checkAccount, validatePass,returnMsg} from "@/assets/authJs/common";
    import md5 from 'js-md5';

    export default {
        name: "Index",
        data() {

            return {
                loginForm: {
                    account: "",
                    password: ""
                },
                loginRules: {
                    account: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {validator: validatePass, trigger: 'blur'}
                    ]
                },
                pwdType: "password"
            };
        },
        methods: {
            showPwd() {
                if (this.pwdType === "password") {
                    this.pwdType = "";
                } else {
                    this.pwdType = "password";
                }
            },
            handleLogin() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.loginForm.password=md5(this.loginForm.password);
                        this.$ajax.post('/api/auth/login', this.loginForm,{
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then((response)=> {
                            let code = response.data.code;
                            if (code == '200') {
                                localStorage.setItem("JWT_TOKEN",response.headers.authorization);
                                this.$router.push({name:'Index'});
                            } else {
                                returnMsg(this, response.data.msg, 'error')
                            }
                        })
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            }
        },
    }
</script>
<style rel="stylesheet/scss" lang="scss">
    $bg: #2d3a4b;
    $light_gray: #eee;

    /* reset element-ui css */
    .login-container {
        .el-input {
            display: inline-block;
            height: 47px;
            width: 90%;

            input {
                background: transparent;
                border: 0px;
                -webkit-appearance: none;
                border-radius: 0px;
                padding: 12px 5px 12px 15px;
                color: $light_gray;
                height: 47px;

                &:-webkit-autofill {
                    -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
                    -webkit-text-fill-color: #fff !important;
                }
            }
        }

        .el-form-item {
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            color: #454545;
        }
    }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
    $bg: #2d3a4b;
    $dark_gray: #889aa4;
    $light_gray: #eee;
    .login-container {
        position: fixed;
        height: 100%;
        width: 100%;
        background-color: $bg;

        .login-form {
            position: absolute;
            left: 0;
            right: 0;
            width: 520px;
            padding: 35px 35px 15px 35px;
            margin: 120px auto;
        }

        .tips {
            font-size: 14px;
            color: #fff;
            margin-bottom: 10px;

            span {
                &:first-of-type {
                    margin-right: 16px;
                }
            }
        }

        .svg-container {
            padding: 6px 5px 6px 15px;
            color: $dark_gray;
            vertical-align: middle;
            width: 30px;
            display: inline-block;

            &_login {
                font-size: 20px;
            }
        }

        .title {
            font-size: 26px;
            font-weight: 400;
            color: $light_gray;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }

        .show-pwd {
            position: absolute;
            right: 10px;
            top: 7px;
            font-size: 16px;
            color: $dark_gray;
            cursor: pointer;
            user-select: none;
        }

        .fontcontainer {
            color: #889aa4;
            padding-left: 10px;
        }
    }
</style>

