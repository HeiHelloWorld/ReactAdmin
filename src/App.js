import React,{ Component } from "react"
import {Button,message} from 'antd'

export default class App extends Component {
  render() {
    return (
      <Button type="primary" onClick={() => message.success('响应点击')}>测试antd</Button>
    )
  }
}