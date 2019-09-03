import React, { Component } from 'react'
import PropTypes from "prop-types"
import { Form,Input } from "antd"

const Item = Form.Item


//用于分类的添加和修改
class CategoryForm extends Component {

  static propTypes = {
    categoryName : PropTypes.string,
    setForm: PropTypes.func.isRequired
  }

  componentWillMount (){
    this.props.setForm(this.props.form)
  }

  render() {
    
    const {categoryName} = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <Form>
        <Item>
          {
            getFieldDecorator('categoryName',{
              initialValue: categoryName,
              rules:[
                {required:true,message:'必须输入分类名称',whitespace:true}
              ]
            })(
              <Input placeholder="请输入分类名称"/>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(CategoryForm)