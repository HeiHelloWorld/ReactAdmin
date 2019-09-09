import React,{ Component } from "react"
import { Form,Tree,Input } from "antd"
import PropTypes from 'prop-types'

import menuList from '../../config/menuConfig'

const {TreeNode} = Tree
const Item = Form.Item

export default class AuthForm extends Component {

  static propTypes = {
    role: PropTypes.object
  }

  constructor (props) {
    super(props)

    let checkedKeys = []
    const role = this.props.role
    if(role){
      checkedKeys = role.menus
    }
    this.state = {
      checkedKeys
    }
  }

  getMenus = () => this.state.checkedKeys

  getTreeNodes = (menuList) => {
    return menuList.reduce((pre, item) => {
      if (!item.isPublic) {
        pre.push(
          <TreeNode title={item.title} key={item.key}>
            {item.children ? this.getTreeNodes(item.children) : null}
          </TreeNode>
        )
      }
      return pre
    }, [])
  }

  handleCheck = (checkedKeys) => {
    this.setState({
      checkedKeys
    })
  }

  //将要接收到新的属性
  componentWillReceiveProps (nextProps) {
    const menus = nextProps.role.menus
    this.setState({
      checkedKeys: menus
    })
  }

  render () {

    const {checkedKeys} = this.state
    const { role } = this.props
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 15 }
    }

    return (
      <>
        <Item label='角色名称' {...formItemLayout}>
          <Input value={role.name} disabled/>
        </Item>
        <Tree
          checkable
          defaultExpandAll
          checkedKeys={checkedKeys}
          onCheck={this.handleCheck}
        >
          <TreeNode title="平台权限" key="all">
            {
              this.getTreeNodes(menuList)
            }
          </TreeNode>
        </Tree>
      </>
    )
  }
}