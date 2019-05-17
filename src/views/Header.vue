<template>
    <header class="header">
        <ul class="header-logo">
            <a href="https://github.com/czj940548563/blog_admin"><img
                    style="position: absolute; top: 0; right: 0; border: 0;"
                    src="https://camo.githubusercontent.com/652c5b9acfaddf3a9c326fa6bde407b87f7be0f4/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6f72616e67655f6666373630302e706e67"
                    alt="Fork me on GitHub"
                    data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_orange_ff7600.png"></a>
            <img src="./logo.svg" alt="logo">
        </ul>
        <ul class="header-operations">
            <li>
                <el-dropdown class="user-dropdown" @command="handleCommand" trigger="click">
                <span class="el-dropdown-link">
                <font-awesome-icon :icon="['far','user']"/>
                    <span class="header-lang is-active"> user </span>
                    <span class="header-opacity">[管理员]</span>
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                    <el-dropdown-menu slot="dropdown" class="user-dropdown-menu">
                        <el-dropdown-item command="logout">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </li>
        </ul>
    </header>
</template>

<script>
    export default {
        name: "Header",
        data() {
            return {
                activeIndex: '1',
                activeIndex2: '1'
            };
        },
        props: [],
        methods: {
            handleCommand(command) {
                if (command=='logout'){
                    localStorage.removeItem('JWT_TOKEN');
                    this.$router.push({name:'Login'});
                }
            }
        },
    }
</script>

<style>
    .header {
        background-color: rgb(32, 160, 255);
        height: 80px;
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
        padding: 0 20px;
        z-index: 999;
        box-sizing: border-box;
        position: fixed;
    }

    .header-logo {
        display: inline-block;
        float: left;
        line-height: 80px;
    }

    .header-operations {
        display: inline-block;
        float: right;
        padding-right: 30px;
        height: 100%;
        margin: 0px 80px 0px 0px ;

    }

    .header-operations li {
        color: #fff;
        display: inline-block;
        vertical-align: middle;
        padding: 0 10px;
        margin: 0 10px;
        line-height: 80px;
        cursor: pointer;
    }

    .header-operations li:first-child {
        cursor: default
    }

    .header-opacity {
        opacity: .7;
    }

    .header-operations:after, header:after {
        display: inline-block;
        content: "";
        height: 100%;
        vertical-align: middle;
    }
    .user-dropdown{
        color: white !important;
        font-size: medium !important;
    }
    .el-icon-arrow-down {
        font-size: 12px;
        cursor: pointer;
    }
    .user-dropdown-menu{
        text-align: center;
    }
</style>
