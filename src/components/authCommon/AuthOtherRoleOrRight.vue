<template>
    <el-table :data="tableData"
              ref="multipleTable"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
        <el-table-column v-for="(item,key) in tableKey"
                         v-if="!item.date&&!item.operation"
                         header-align="center"
                         align="center"
                         :key="key"
                         :prop="item.prop"
                         :type="item.type"
                         :label="item.label">
        </el-table-column>
    </el-table>
</template>

<script>
    export default {
        name: "AuthOtherRoleOrRight",
        props: ['tableData', 'tableKey','handleSelectionChange'],
        data() {
            return {}
        },
    }
</script>

<style>

</style>
