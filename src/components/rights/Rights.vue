<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">权限管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
        <el-table-column prop="path" label="路径" width="180"></el-table-column>
        <el-table-column prop="level" label="权限管理">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.level == 0">一级权限</el-tag>
                <el-tag type="success" v-else-if="scope.row.level ==1">二级权限</el-tag>
                <el-tag type="warning" v-else>三级权限</el-tag>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsList } from "network/Rights/getRightsList";
export default {
  data() {
    return {
      // 权限列表数据
      rightsList: []
    };
  },
  created() {
    // 获取权限列表数据
    this._getRightsList();
  },
  methods: {
    _getRightsList() {
      getRightsList().then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取权限列表失败");
        }
        // console.log(res);
        this.rightsList = res.data.data;
        console.log(this.rightsList);
      });
    }
  }
};
</script>

<style scoped>
</style>