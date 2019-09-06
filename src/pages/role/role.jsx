import React, { Component } from 'react'
import { Card, Button, Table, Modal } from 'antd';

import { PAGE_SIZE } from "../../utils/constants"
import LinkButton from "../../components/link-button"
import { formateDate } from "../../utils/dateUtils"
import AddForm from "./add-form"

export default class Role extends Component {

  state = {
    roles: [],
    isShowAdd: false,
    isShowAuth: false
  }

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
        dataIndex: 'create_time',
        render: auth_time => formateDate(auth_time)
      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      },
      {
        title: '操作',
        render: (role) => <LinkButton>设置权限</LinkButton>
      },
    ]
  }

  componentWillMount (){
    this.initColumn()
  }

  render() {

    const { roles, isShowAdd, isShowAuth } = this.state
    const title = (
      <Button type="primary" onClick={()=>this.setState({isShowAdd:true})}>
        创建角色
      </Button>
    )

    return (
      <Card title={title}>
        <Table 
          bordered
          rowKey="_id"
          columns={this.columns}
          pagination={{ pageSize:PAGE_SIZE }}
        />
        <Modal
          title='添加角色'
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={()=>{
            this.setState({ isShowAdd:false})
            // this.form.resetFields()
          }}
        >
          <AddForm setForm={form => this.form = form} />
        </Modal>
      </Card>
    )
  }
}