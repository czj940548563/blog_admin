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
                    <div>
                        <el-tabs
                                v-model="activeIndex"
                                type="border-card"
                                closable
                                v-if="openTab.length"
                                @tab-click='tabClick'
                                @tab-remove='tabRemove'
                        >
                            <el-tab-pane
                                    :key="item.name"
                                    v-for="(item, index) in openTab"
                                    :label="item.title"
                                    :name="item.route"
                            >
                            </el-tab-pane>
                            <div class="content-wrap">
                                <router-view></router-view>
                            </div>
                        </el-tabs>
                    </div>

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
        components: {Header, Aside},
        data() {
            return {}
        },
        methods: {
            //tab标签点击时，切换相应的路由
            tabClick(tab) {
                console.log("tab", tab);
                console.log('active', this.activeIndex);
                this.$router.push({path: this.activeIndex});
            },
            //移除tab标签
            tabRemove(targetName) {
                console.log("tabRemove", targetName);
                console.log(this.$router.params);
                //首页不删
                if (targetName == '/' || targetName == '/home') {
                    return
                }
                this.$store.commit('delete_tabs', targetName);

                if (this.activeIndex === targetName) {
                    // 设置当前激活的路由
                    if (this.openTab && this.openTab.length >= 1) {
                        console.log('=============', this.openTab[this.openTab.length - 1].route)
                        this.$store.commit('set_active_index', this.openTab[this.openTab.length - 1].route);
                        this.$router.push({path: this.activeIndex});
                        console.log(this.openTab);
                    } else {
                        this.$router.push({path: '/'});
                    }
                }
            }
        },
        mounted() {

            if (this.$route.path !== '/' && this.$route.path !== '/home') {
                this.$store.commit('add_tabs', {route: '/home', name: 'Index', title: '首页'});
                this.$store.commit('add_tabs', {route: this.$route.path , name: this.$route.name,title:this.$route.meta.title });
                this.$store.commit('set_active_index', this.$route.path);
            } else {
                this.$store.commit('add_tabs', {route: '/home', name: 'Index', title: '首页'});
                this.$store.commit('set_active_index', '/home');
                this.$router.push('/');
            }
        },

        computed: {
            openTab() {
                return this.$store.state.openTab;
            },
            activeIndex: {
                get() {
                    return this.$store.state.activeIndex;
                },
                set(val) {
                    this.$store.commit('set_active_index', val);
                }
            }
        },
        watch: {
            '$route'(to, from) {
                //判断路由是否已经打开
                //已经打开的 ，将其置为active
                //未打开的，将其放入队列里
                let flag = false;
                for (let item of this.openTab) {
                    if (item.name === to.name) {
                        console.log('to.path', to.path);
                        this.$store.commit('set_active_index', to.path)
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    if (!(to.path === '/' || to.path === '/home')) {
                        this.$store.commit('add_tabs', {route: to.path, name: to.name, title: to.meta.title});
                    }
                    this.$store.commit('set_active_index', to.path);
                }
            }
        }
    }
</script>

<style scoped>

</style>
