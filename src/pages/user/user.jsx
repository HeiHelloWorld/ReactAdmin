import React, { Component } from 'react'
import { Card, Table, Button, Modal, message } from "antd"

import UserForm from "./user-form"
import LinkButton from "../../components/link-button"
import { formateDate } from "../../utils/dateUtils"
import { PAGE_SIZE } from "../../utils/constants"
import { reqAddOrUpdateUser, reqUsers, reqDeleteUser } from "../../api"

export default class User extends Component {

  state = {
    isShow: false,
    users: [],
    roles: []
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getUsers()
  }

  //初始化列表
  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },
      {
        title: '电话',
        dataIndex: 'phone'
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: role_id => this.roleNames[role_id]
      },
      {
        title: '操作',
        render: (user) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            &nbsp;&nbsp;&nbsp;
            <LinkButton onClick={() => this.clickDelete(user)}>删除</LinkButton>
          </span>
        )
      }
    ]
  }

  initRoleNames = (roles) => {
    this.roleNames = roles.reduce((pre,role) => {
      pre[role._id] = role
      return pre
    },{})
  }

  clickDelete = (user) => {
    Modal.confirm({
      content: `确定删除${user.username}吗？`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if(result.status === 0){
          this.getUsers()
        }
      }
    })
  }

  //修改用户
  showUpdate = (user) => {
    this.user = user
    this.setState({
      isShow: true
    })
  }

  //异步获取所有用户列表
  getUsers = async () => {
    const result = await reqUsers()
    if(result.status === 0){
      const {users,roles} = result.data

      //生成包含所有角色名的对象
      this.roleNames = roles.reduce((pre,role) => {
        pre[role._id] = role.name
        return pre
      },{})

      this.setState({
        users,
        roles
      })
    }
  }

  //点击“创建用户”显示界面
  showAddUser = () => {
    this.user = null
    this.setState({
      isShow: true
    })
  }

  //添加、更新用户
  AddOrUpdateUser = async () => {
    console.log(this.form)
    const user = this.form.getFieldsValue()
    this.form.resetFields()
    if(this.user){
      user._id = this.user._id
    }
    this.setState({
      isShow: false
    })

    const result = await reqAddOrUpdateUser(user)
    if(result.status === 0){
      message.success('操作成功')
      this.getUsers()
    }
  }

  

  render() {

    const title = <Button type="primary" onClick={this.showAddUser}>创建用户</Button>
    const {users, roles, isShow } = this.state
    const user = this.user || {}

    return (
      <>
        <Card title={title}>
          <Table
            columns={this.columns}
            rowKey='_id'
            dataSource={users}
            bordered
            pagination={{defaultPageSize: PAGE_SIZE,showQuickJumper:true}}
          />
          <Modal
            title={user._id ? '修改用户' : '添加用户'}
            visible={isShow}
            onCancel={()=>this.setState({isShow:false})}
            onOk={this.AddOrUpdateUser}
          >
            <UserForm
              setForm={(form) => this.form = form}
              user={user}
              roles={roles}
            />
          </Modal>
        </Card>
      </>
    )
  }
}