<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="roleList" stripe border>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', 'vcenter', i1 === 0 ? 'bdtop' : '']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级、三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环渲染二级权限 -->
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="['bdtop', 'vcenter', i2 === 0 ? '' : 'bdtop']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-tag
                    type="warning"
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    closable
                    @close="removeRightById(scope.row, item3.id)"
                  >
                    {{ item3.authName }}
                  </el-tag>
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
            <!-- 编辑按钮 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >

            <!-- 删除按钮 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRoleById(scope.row.id)"
              >删除</el-button
            >

            <!-- 分配权限按钮 -->
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容 -->
      <el-form
        :model="addRole"
        :rules="addRoleRules"
        ref="addRoleRef"
        label-width="70px"
      >
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="addRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editRole" ref="editRoleRef" label-width="70px">
        <el-form-item label="角色名">
          <el-input v-model="editRole.roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="TreeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      // 添加角色对话框是否显示
      addDialogVisible: false,
      // 添加角色对话框的表单数据
      addRole: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色对话框的表单验证规则对象
      addRoleRules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            triggle: 'blur'
          },
          {
            min: 1,
            max: 10,
            message: '用户名长度在1~10个字符之间',
            trigger: 'blur'
          }
        ]
      },
      // 修改角色对话框是否显示
      editDialogVisible: false,
      // 修改角色对话框查询到的角色信息对象
      editRole: {},
      // 分配角色对话框是否显示
      setRightDialogVisible: false,
      // 分配角色对话框中的所有权限数据
      rightsList: [],
      // 树形控件的属性绑定对象
      TreeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点id值数组
      defKeys: [],
      // 当前即将分配权限的id
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色数据
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data
      console.log(this.roleList)
    },
    // 添加角色对话框的关闭
    addDialogClosed() {
      this.$refs.addRoleRef.resetFields()
    },
    // 点击按钮添加新角色
    addRoles() {
      // 先进行新角色合法性校验
      this.$refs.addRoleRef.validate(async valid => {
        if (!valid) return
        // 可发送添加角色请求
        const { data: res } = await this.$http.post('roles', this.addRole)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功！')
        // 隐藏添加角色对话框
        this.addDialogVisible = false
        // 重新获取数据列表
        this.getRolesList()
      })
    },
    // 展示编辑角色对话框
    async showEditDialog(id) {
      // 根据id查询商品
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询数据失败')
      }
      this.editRole = res.data
      this.editDialogVisible = true
      console.log(this.editRole)
    },
    // 监听编辑角色对话框的关闭
    editDialogClosed() {
      this.$refs.editRoleRef.resetFields()
    },
    // 编辑角色信息并提交
    async editRoleInfo() {
      const { data: res } = await this.$http.put(
        'roles/' + this.editRole.roleId,
        {
          roleName: this.editRole.roleName,
          roleDesc: this.editRole.roleDesc
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新用户信息失败')
      }
      // 关闭对话框
      this.editDialogVisible = false
      // 刷新数据列表
      this.getRolesList()
      // 提示修改成功
      this.$message.success('更新用户信息成功！')
    },
    // 点击按钮，根据id删除对应角色信息
    async removeRoleById(id) {
      // 弹窗询问是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 如果用户取消删除，则返回值为字符串cancel
      // 如果用户确认删除，则返回值为字符串confirm
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除成功！')
      this.getRolesList()
    },
    // 点击按钮，根据id删除对应的权限
    async removeRightById(role, rightId) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )

      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      this.$message.success('删除成功！')
      role.children = res.data
    },
    // 通过递归形式，获取角色所有三级权限的id，并保存到defKefs数组中
    getLeafKeys(node, arr) {
      // 如果当前node节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      // 若不是三级节点，则获取其子节点并再次该调用函数
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 展示分配角色对话框
    async showSetRightDialog(role) {
      // 将要分配的角色id保存到data中
      this.roleId = role.id
      // 获取所有权限数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      // 将获取到的数据保存到data中
      this.rightsList = res.data
      console.log(this.rightsList)
      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 点击按钮实现分配角色
    async allotRights() {
      // 获取被选中和半选中的数据id数组
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 将id数组转换为字符串
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.setRightDialogVisible = false
    },
    // 监听分配权限对话框的关闭
    setRightDialogClosed() {
      this.defKeys = []
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.bdtop {
  border-top: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
