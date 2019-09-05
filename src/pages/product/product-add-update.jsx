import React, { Component } from 'react'
import { Card, Icon, Form, Select, Input, Button, message } from "antd"

import PicturesWall from "./pictures-wall"
import RichTextEditor from "./rich-text-editor"
import LinkButton from "../../components/link-button"
import { reqCategorys, addOrUpdateProduct } from "../../api"

const { Item } = Form
const {Option} = Select

class ProductAddUpdate extends Component {

  state = {
    categorys: []
  }

  //创建ref容器对象
  pwRef = React.createRef()
  editorRef = React.createRef()

  handleSubmit = (event) => {
    //阻止事件默认行为
    event.preventDefault()

    this.props.form.validateFields(async (error,values)=>{
      if(!error){
        const {name,desc,price,categoryId} = values
        //console.log(name, desc, price, categoryId)
        const imgs = this.pwRef.current.getImgs()
        //console.log('imgs',imgs)
        const detail = this.editorRef.current.getDetail()

        const product = { name, desc, price, categoryId, imgs, detail}
        if (this.props.location.state){
          product._id = this.props.location.state._id
        }

        const result = await addOrUpdateProduct(product)
        if(result.status===0){
          message.success('操作成功')
          this.props.history.replace('/product')
        } else {
          message.error('操作失败')
        }
      }
    })
  }

  getCategorys = async () => {
    const result = await reqCategorys()
    if(result.status===0){
      const categorys = result.data
      this.setState({
        categorys
      })
    }
  }

  //商品价格的验证
  validatePrice = (rule,value,callback) => {
    if(value < 0){
      callback('价格不能小于0')
    }else{
      callback()
    }
  }

  componentDidMount (){
    this.getCategorys()
  }

  render() {
    const product = this.props.location.state || {}
    const { getFieldDecorator } = this.props.form
    const { categorys } = this.state

    const title = (
      <>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type="arrow-left"></Icon>
        </LinkButton>
        <span>{product._id ? '修改' : '添加'}商品</span>
      </>
    )

    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8}
    }

    return (
      <Card title={title}>
        <Form onSubmit={this.handleSubmit} {...formItemLayout}>
          <Item label="商品名称">
            {
              getFieldDecorator('name', {
                initialValue:product.name,
                rules:[
                  {required:true,whitespace:true,message:'请输入商品名称'}
                ]
              })(
                <Input placeholder="商品名称"></Input>
              )
            }
          </Item>
          <Item label="商品描述">
            {
              getFieldDecorator('desc', {
                initialValue: product.desc,
                rules: [
                  { required: true, whitespace: true, message: '请输入商品描述' }
                ]
              })(
                <Input placeholder="商品描述"></Input>
              )
            }
          </Item>
          <Item label="商品价格">
            {
              getFieldDecorator('price', {
                initialValue: product.price && (''+product.price), 
                rules: [
                  { required: true, whitespace: true, message: '请输入商品价格' },
                  {validator: this.validatePrice}
                ]
              })(
                <Input type="number" placeholder="商品价格" addonAfter="元"></Input>
              )
            }
          </Item>
          <Item label="商品分类">
            {
              getFieldDecorator('categoryId', {
                initialValue: product.categoryId || '',
                rules: [
                  { required: true, whitespace: true, message: '请选择商品分类' }
                ]
              })(
                <Select>
                  <Option value=''>未选择</Option>
                  {
                    categorys.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)
                  }
                </Select>
              )
            }
          </Item>
          <Item label="商品图片" wrapperCol={{span: 15}}>
            <PicturesWall ref={this.pwRef} imgs={product.imgs}/>
          </Item>
          <Item label="商品详情" wrapperCol={{ span: 20 }}>
            <RichTextEditor ref={this.editorRef} detail={product.detail}/>
          </Item>
          <Item>
            <Button type="primary" htmlType="submit">提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(ProductAddUpdate)