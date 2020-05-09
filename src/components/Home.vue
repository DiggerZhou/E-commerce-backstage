<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="~assets/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' :'200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" unique-opened  :collapse="isCollapse" :collapse-transition="false" router :default-active='activePath'>
          <!-- 一级菜单 -->
          <el-submenu :index="item1.id +''" v-for="item1 in navigationList" :key="item1.id">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item1.id]"></i>
              <!-- 文本 -->
              <span>{{item1.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+ item2.path " v-for="item2 in item1.children" :key="item2.id" @click="saveNavState('/'+ item2.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{item2.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容 -->
      <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { navigationList } from "network/navigation";

export default {
  data() {
    return {
      navigationList: [],
      iconObj:{
          "125":'iconfont icon-users',
          "103":'iconfont icon-tijikongjian',
          "101":'iconfont icon-shangpin',
          "102":'iconfont icon-danju',
          "145":'iconfont icon-baobiao'
      },
      isCollapse:false,
    //   被激活的链接地址
      activePath:''
    };
  },
  created() {
    this.getNavigationList();
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    //   退出主页
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取左侧菜单列表数据
    getNavigationList() {
      navigationList().then(res => {
        console.log(res.data.data);
        if(res.data.meta.status !==200) return this.$message.error('res.meta.msg')
        this.navigationList = res.data.data;
      });
    },
    // 点击按钮折叠菜单
    toggleCollapse(){
        this.isCollapse = !this.isCollapse
      
    },
    // 把当前导航栏被选中的那一个的index保存在sessionStorage里面，从而用default-active属性动态绑定哪个属于高亮
    saveNavState(activePath){
        window.sessionStorage.setItem('activePath',activePath)
        this.activePath = activePath
    }
  }
};
</script>

<style scoped>
.home-container {
  height: 100%;
}
.el-menu{
    border-right: 0;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-header div img {
  padding-right: 20px;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.iconfont{
    margin-right: 10px;
}
.toggle-button{
    background-color: #4a5064;
    text-align: center;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>