<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">用户管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="_getUserList">
            <el-button slot="append" icon="el-icon-search" @click="  _getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
        <el-table-column label="状态" width="180">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2,5,10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 添加用户的弹窗对话框 -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
        <!-- 内容主体区域 -->
        <el-form :model="addForm" :rules="addFormRules" ref="refAddForm" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户的弹窗对话框 -->
      <el-dialog
        title="修改用户数据"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <el-form :model="editFrom" :rules="editFromRules" ref="editFromRef" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editFrom.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editFrom.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editFrom.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getUserList } from "network/getUserList";
import { userStateChange } from "network/userStateChange";
import { addNewUser } from "network/addNewUser";
import { getUserInfoById } from "network/getUserInfoById";
import { editUserInfo } from "network/editUserInfo";
import { deleteUserInfo } from "network/deleteUserInfo";

export default {
  data() {
    //   校验邮箱的规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的邮箱"));
    };
    // 校验手机的规则
    var checkMobile = (rule, value, callback) => {
      // 验证手机号的正则
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的手机号"));
    };
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      // 用户列表
      userList: [],
      total: 0,
      //   控制添加用户弹窗的显示隐藏
      addDialogVisible: false,
      //   添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //   添加用户的表单数据验证规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "请输入3至10位的用户名", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "请输入6至15位", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      //   控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      //   根据用户ID查询到的用户数据对象
      editFrom: {},
      //   修改用户数据的验证规则
      editFromRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this._getUserList();
  },
  methods: {
    _getUserList() {
      getUserList(this.queryInfo).then(res => {
        // console.log(res);
        if (res.data.meta.status !== 200)
          return this.$message.error("获取用户列表失败");
        this.userList = res.data.data.users;
        this.total = res.data.data.total;
      });
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this._getUserList();
    },
    // 监听页码改变事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this._getUserList();
    },
    // 用户状态的改变
    userStateChange(userInfo) {
      userStateChange(userInfo.id, userInfo.mg_state).then(res => {
        // console.log(res)
        if (res.data.meta.status !== 200) {
          userInfo.mg_state = !userInfo.mg_state;
          return $message.error("设置状态失败");
        }
        this.$message.success("更新状态成功");
      });
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.refAddForm.resetFields();
    },
    // 点击确认添加新用户,要先预验证
    addUser() {
      this.$refs.refAddForm.validate(async valid => {
        if (!valid) return;
        // 这里先对表单进行验证，如果无误就发起真正的网络请求
        console.log(this.addForm);
        addNewUser(this.addForm).then(res => {
          //   console.log(res);
          if (res.data.meta.status !== 201) {
            this.$message.error("添加用户失败");
          }
          this.$message.success("添加用户成功");
          this.addDialogVisible = false;
          this._getUserList();
        });
      });
    },
    // 展示编辑用户的对话框
    showEditDialog(id) {
      getUserInfoById(id).then(res => {
        if (res.data.meta.status !== 200)
          this.$message.error("查询用户信息失败");
        this.editFrom = res.data.data;
      });

      this.editDialogVisible = true;
    },
    // 监听修改用户数据的弹窗关闭事件
    editDialogClosed() {
      this.$refs.editFromRef.resetFields();
    },
    // 修改用户数据后进行预验证并提交到服务器
    editUserInfo() {
      this.$refs.editFromRef.validate(valid => {
        if (!valid) return;
        // 发起修改用户信息的数据请求
        editUserInfo(
          this.editFrom.id,
          this.editFrom.email,
          this.editFrom.mobile
        ).then(res => {
          console.log(res);
          if (res.data.meta.status !== 200) {
            return this.$message.error("修改用户数据失败");
          }

          this._getUserList();
          this.editDialogVisible = false;
          this.$message.success("修改用户数据成功");
        });
      });
    },
    // 删除用户数据
    removeUserById(id) {
      // console.log(id);
      // 弹窗询问用户是否删除
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
          deleteUserInfo(id).then(res => {
            // console.log(res);
            if(res.data.meta.status!==200) {return this.$message.error('删除用户数据失败')}
            this._getUserList()
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style scoped>
</style>