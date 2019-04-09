<template>
    <el-container>
        <el-header>
            <Header></Header>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <Aside></Aside>
            </el-aside>
            <el-main>
                <User></User>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import User from "@/views/User";
    import Aside from "@/views/Aside";
    import Header from "@/views/Header";

    export default {
        name: "Index",
        components: {User, Header, Aside}
    }
</script>

<style scoped>

</style>
