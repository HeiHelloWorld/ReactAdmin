import React, { Component } from 'react'
import { reqCategorys,reqAddCategory,reqUpdateCategory } from "../../api"
import { 
  Card,
  Table,
  Icon,
  Button,
  Modal,
  message
} from "antd"
import LinkButton from "../../components/link-button"
import CategoryForm from "./category-form"

export default class Category extends Component {

  state = {
    categorys: [],  //所有分类
    loading:false,
    showStatus:0    //0：都不显示  1：显示添加  2：显示修改
  }

  //异步获取所有分类列表 
  getCategorys = async() => {
    //显示等待效果
    this.setState({
      loading:true
    })
    const result = await reqCategorys()
    //隐藏等待效果
    this.setState({
      loading: false
    })
    if(result.status===0){
      const categorys = result.data
      this.setState({
        categorys
      })
    }
  }

  //添加分类的函数
  addCategory = () => {
    //对form进行验证
    this.form.validateFields(async (error,values) => {
      if(!error){
        //重置输入框里的数据
        this.form.resetFields()
        //通过后发送请求 添加分类
        const result = await reqAddCategory(values.categoryName)
        if(result.status===0){
          this.setState({
            showStatus: 0
          })
          message.success('添加分类成功')
          this.getCategorys()
        } else {
          message.error(result.msg || '添加分类失败')
        }
      }
    })
  }

  //修改分类的函数
  updateCategory = () => {
    //对form进行验证
    this.form.validateFields(async (error, values) => {
      if (!error) {
        //重置输入框里的数据
        this.form.resetFields()
        //通过后发送请求 更新分类
        values.categoryId = this.category._id
        const result = await reqUpdateCategory(values)
        if (result.status === 0) {
          this.setState({
            showStatus: 0
          })
          message.success('修改分类成功')
          this.getCategorys()
        } else {
          message.error(result.msg || '修改分类失败')
        }
      }
    })
  }

  //取消添加的函数
  handleCancel = () => {
    //重置输入框里的数据
    this.form.resetFields()
    this.setState({
      showStatus: 0
    })
  }

  //显示添加界面
  showAdd = () => {
    this.setState({
      showStatus:1
    })
  }

  //显示修改界面
  showUpdate = (category) => {
    //保存当前分类
    this.category = category

    this.setState({
      showStatus: 2
    })
  }

  componentWillMount () {
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name'
      },
      {
        title: '操作',
        width: 250,
        render: (category) => <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
      }
    ]
  }

  componentDidMount () {
    this.getCategorys()
  }
  
  render() {
    const category = this.category || {}

    const {categorys,loading,showStatus} = this.state

    const extra = (
      <Button type="primary" onClick={this.showAdd}>
        <Icon type="plus"/>
        添加
      </Button>
    )
    return (
      <Card extra={extra}>
        <Table
          loading={loading}
          dataSource={categorys}
          columns={this.columns}
          bordered={true}
          rowKey='_id'
          pagination={{pageSize:2,showQuickJumper:true}}
        />
        <Modal
          title="添加分类"
          visible={showStatus===1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <CategoryForm setForm={(form) => this.form = form} />
        </Modal>
        <Modal
          title="修改分类"
          visible={showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <CategoryForm categoryName={category.name} setForm={(form) => this.form = form}/>
        </Modal>
      </Card>
    )
  }
}
