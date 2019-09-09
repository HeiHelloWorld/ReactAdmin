import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'

import { PAGE_SIZE } from "../../utils/constants"
import LinkButton from "../../components/link-button"
import { formateDate } from "../../utils/dateUtils"
import AddForm from "./add-form"
import AuthForm from "./auth-form"
import { reqRoles, reqAddRole, reqUpdateRole } from "../../api"
import memoryUtils from "../../utils/memoryUtils"

export default class Role extends Component {

  state = {
    roles: [],        // 所有角色列表
    isShowAdd: false, //是否显示添加界面
    isShowAuth: false  //是否显示设置权限
  }

  authRef = React.createRef()

  //初始化table列表
  initColumn = () => {
    this.columns = [
      {
        title:'角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: auth_time => formateDate(auth_time)
      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      },
      {
        title: '操作',
        render: (role) => <LinkButton onClick={() => this.showAuth(role)}>设置权限</LinkButton>
      },
    ]
  }

  //显示授权对话框
  showAuth = (role) => {
    this.role = role
    this.setState({
      isShowAuth: true
    })
  }

  //异步获取角色列表显示
  getRoles = async () => {
    const result = await reqRoles()
    if (result.status === 0) {
      const roles = result.data
      this.setState({
        roles
      })
    }
  }

  //添加角色
  addRole = () => {
    this.form.validateFields( async (error,values) => {
      if(!error){
        //重置值
        this.form.resetFields()
        //隐藏对话框
        this.setState({
          isShowAdd: false
        })

        const result = await reqAddRole(values.roleName)
        if(result.status === 0){
          message.success('添加角色成功')
          const role = result.data
          const roles = this.state.roles
          this.setState({
            roles: [...roles,role]
          })
        }
      }
    })
  }

  // 授权操作
  updateRole = async () => {
    //关闭确认对话框
    this.setState({
      isShowAuth: false
    })

    const role = this.role

    role.menus = this.authRef.current.getMenus()
    role.auth_time = Date.now()

    role.auth_name = memoryUtils.user.username
    console.log(this.props.user)

    const result = await reqUpdateRole(role)
    if(result.status===0) {
      message.success(`给${role.name}授权成功`)
      this.getRoles()
    }
  }

  componentWillMount (){
    this.initColumn()
  }

  componentDidMount () {
    this.getRoles()
  }

  render() {

    const { roles, isShowAdd, isShowAuth } = this.state
    const role = this.role || {}
    const title = (
      <Button type='primary' onClick={() => this.setState({ isShowAdd: true })}>
        创建角色
      </Button>
    )

    return (
      <Card title={title}>
        <Table 
          bordered
          rowKey="_id"
          dataSource={roles}
          columns={this.columns}
          pagination={{ pageSize:PAGE_SIZE }}
        />
        <Modal
          title='添加角色'
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={()=>{
            this.setState({ isShowAdd:false})
            this.form.resetFields()
          }}
        >
          <AddForm setForm={form => this.form = form} />
        </Modal>
        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={() => {
            this.setState({ isShowAuth: false })
          }}
        >
          <AuthForm ref={this.authRef} role={role} />
        </Modal>
      </Card>
    )
  }
}

// export default connect (
//   state => ({
//     user: state.user
//   }),
//   {}
// )(Role)