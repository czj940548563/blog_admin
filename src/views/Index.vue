<template>
    <div>
    <el-container>
        <el-header>
            <Header></Header>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <Aside></Aside>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
    </div>
</template>

<script>

    import Aside from "@/views/Aside";
    import Header from "@/views/Header";


    export default {
        name: "Index",
        components: { Header, Aside}
    }
</script>

<style scoped>

</style>
