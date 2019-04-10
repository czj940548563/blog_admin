<template>
    <el-menu :default-active="$route.path" unique-opened router>
        <template v-for="item in $router.options.routes" v-if="!item.hidden">
            <el-submenu :index="item.name" :key="loadPath(item.path)">
                <template slot="title"><i :class="fontcontainer">
                    <span class="iconfont" v-if="item.meta&&item.meta.icon" :class="item.meta.icon"></span>
                </i>
                <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
                </template>
                <el-menu-item-group class="over-hide" v-for="child in item.children" :key="child.name"
                                    v-if="!child.hidden">
                    <el-menu-item v-for="" :index="resolvePath(child.path)">{{child.meta.title}}</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </template>
    </el-menu>
</template>

<script>
    import path from "path";

    export default {
        name: "Aside",
        data(){
            return{
                basePath:'',
            }
        },
        methods: {
            loadPath(path){
                this.basePath=path
            },
            resolvePath(path){
                return this.basePath+'/'+path;
            }
        }
    }
</script>

<style>
    .el-menu {
        height: 100%;
    }
</style>
