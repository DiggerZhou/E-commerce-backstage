<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">权限管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRolesVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, index) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom',index===0 ? 'bdtop' :'']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2,index2) in item1.children "
                  :key="item2.id"
                  :class="index2===0 ? '' :'bdtop'"
                >
                  <el-col :span="6">
                    <el-tag type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="(item3,index3) in item2.children" :key="item3.id" type="warning">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRoles(scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRoles(scope.row.id)"
            >删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 点击添加角色按钮弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="addRolesVisible"
      width="50%"
      @closed="addRolesDialogClosed"
    >
      <el-form
        :model="addRolesForm"
        :rules="addRolesFormRules"
        ref="addRolesFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 点击编辑角色按钮弹窗 -->
    <el-dialog title="提示" :visible.sync="editRolesVisible" width="50%">
      <el-form
        :model="editRolesFrom"
        :rules="editRolesFormRules"
        ref="editRolesFromRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesConselRequest">取 消</el-button>
        <el-button type="primary" @click="editRolesConfirmRequest">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRolesList } from "network/Rights/getRolesList";
import { addRolesRequest } from "network/Rights/addRolesRequest";
import { deleteRolesRequest } from "network/Rights/deleteRolesRequest";
import { editRolesRequest } from "network/Rights/editRolesRequest";
export default {
  data() {
    return {
      // 所有角色的列表数据
      rolesList: [],
      // 添加角色按钮弹窗的显示与隐藏
      addRolesVisible: false,
      // 添加角色的表单数据
      addRolesForm: {},
      // 添加角色的表单数据验证规则
      addRolesFormRules: {
        roleName: [
          { required: true, trigger: "blur", message: "请输入角色名称" }
        ],
        roleDesc: [
          { required: true, trigger: "blur", message: "请输入角色描述" }
        ]
      },
      // 修改角色按钮弹窗的显示与隐藏
      editRolesVisible: false,
      // 根据id获得的角色的数据
      editRolesFrom: {},
      // 根据id获得的角色的数据验证规则
      editRolesFormRules: {
        roleName: [
          { required: true, trigger: "blur", message: "请输入角色名称" }
        ],
        roleDesc: [
          { required: true, trigger: "blur", message: "请输入角色描述" }
        ]
      }
    };
  },
  created() {
    this._getRolesList();
  },
  methods: {
    // 获取用户角色数据列表
    _getRolesList() {
      getRolesList().then(res => {
        // console.log(res);
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取角色列表失败");
        }
        this.rolesList = res.data.data;
        console.log(this.rolesList);
      });
    },
    // 添加用户数据
    addRoles() {
      this.$refs.addRolesFormRef.validate(valid => {
        if (!valid) return;

        addRolesRequest(
          this.addRolesForm.roleName,
          this.addRolesForm.roleDesc
        ).then(res => {
          console.log(res);
          if (res.data.meta.status !== 201) {
            this.$message.error("添加用户角色失败");
          }
          this.$message.success("添加用户角色成功");
          this.addRolesVisible = false;
          this._getRolesList();
        });
      });
    },
    // 监听添加用户角色的弹窗关闭后要重置表单
    addRolesDialogClosed() {
      this.$refs.addRolesFormRef.resetFields();
    },
    // 删除用户角色
    deleteRoles(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          //   console.log(id);
          deleteRolesRequest(id).then(res => {
            // console.log(res);
            if (res.data.meta.status !== 200) {
              return this.$message.error("删除用户数据失败");
            }
            this._getRolesList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 编辑用户角色
    editRoles(row) {
      this.editRolesVisible = true;
      this.editRolesFrom = row;
      // console.log(row);
    },
    // 编辑角色后确认提交到服务器
    editRolesConfirmRequest() {
      this.$refs.editRolesFromRef.validate(valid => {
        if (!valid) return;
        editRolesRequest(
          this.editRolesFrom.id,
          this.editRolesFrom.roleName,
          this.editRolesFrom.roleDesc
        ).then(res => {
          this._getRolesList();
          this.editRolesVisible = false;
        });
      });
    },
    // 编辑角色弹窗中的取消按钮点击重置数据
    editRolesConselRequest() {
      this.editRolesVisible = false;
      this.$refs.editRolesFromRef.resetFields();
    }
  }
};
</script>

<style scoped>
.el-tag {
  margin: 7px;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.bdtop {
  border-top: 1px solid #eee;
}
</style>

    