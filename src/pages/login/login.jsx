import React,{ Component } from "react"
import { Form,Icon,Input,Button,message } from "antd"
import { Redirect } from 'react-router-dom'

import memoryUtils from '../../utils/memoryUtils'
import { reqLogin } from '../../api'
import logo from './images/logo.png';
import "./login.less";
import storageUtils from "../../utils/storageUtils";

const {Item} = Form

class Login extends Component {

  handleSubmit = event => {
    event.preventDefault();

    const form = this.props.form

    form.validateFields(async (error, { username, password }) => {
      if(!error){
        const result = await reqLogin(username,password)
        if(result.status === 0){
          const user = result.data
          storageUtils.saveUser(user)
          memoryUtils.user = user

          //跳转到admin路由
          this.props.history.replace('/')
        } else {
          message.error(result.msg)
        }
      }else {
        console.log('前台表单验证失败！')
      }
    })
  }

  validatePwd = (rule,value,callback) => {
    value = value.trim()
    if(!value){
      callback('请输入密码！')
    }else if (value.length < 4){
      callback('密码不能小于4位！')
    }else if (value.length > 12){
      callback('密码不能大于12位！')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)){
      callback('密码只能包含字母、数字或下划线！')
    } else {
      callback()
    }
  }

  render () {
    const user = memoryUtils.user
    // 如果登陆
    if (user._id) {
      // 自动跳转到admin
      return <Redirect to="/"></Redirect>
    }
    
    //const form = this.props.form
    const getFieldDecorator = this.props.form.getFieldDecorator
    
    return (
      <div className="login">
        <div className="login-header">
          <img src={logo} alt="logo" />
          <h1>后台管理系统</h1>
        </div>
        <div className="login-content">
          <h1>用户登陆</h1>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
              {getFieldDecorator('username', {
                rules: [
                  { required: true, message: '请输入用户名!' },
                  { min: 4, message: '最少长度为4!' },
                  { max: 12, message: '最大长度为12!' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含英文数字下划线!' }
                ],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                />
              )}
            </Item>
            <Form.Item>
              {getFieldDecorator('password', {
                initialValue:'',
                rules: [
                  {validator:this.validatePwd}
                ]
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="密码"
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登 陆
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}

const WrappedLogin = Form.create()(Login)
export default WrappedLogin