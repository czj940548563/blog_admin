<template>
    <div>
        <el-form :model="modelData" status-icon :rules="rule" :label-position="labelPosition"
                 label-width="80px"
                 :ref="objectName">
            <el-form-item
                    v-for="(item,index) in formKey"
                    :label="item.label"
                    :prop="item.prop"
                    :key="index"
            >

                <el-input v-model="item.model" autocomplete="off" :disabled="item.showPassword ? true : false"></el-input>
            </el-form-item>

        </el-form>
    </div>
</template>

<script>
    export default {
        name: "AuthCommonForm",
        props:['modelData','formKey','rule','objectName'],
        data(){
            return{
                labelPosition: 'left',
            }
        }
    }
</script>

<style scoped>

</style>
