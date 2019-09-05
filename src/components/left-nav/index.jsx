import React, { Component } from 'react'
import { Link,withRouter } from "react-router-dom"
import { Menu,Icon } from 'antd'

import "./index.less"
import logo from "../../assets/images/logo.png"
import menuList from "../../config/menuConfig"

const { SubMenu,Item } = Menu

class LeftNav extends Component {

  getMenuNodes = (menuList) => {
    return menuList.map(item => {
      if(!item.children){
        return (
          <Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Item>
        )
      } else {
        return (
          <SubMenu 
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getMenuNodes2(item.children)}
          </SubMenu>
        )
      }
    })
  }

  getMenuNodes2 = (menuList) => {

    const path = this.props.location.pathname
    return menuList.reduce((pre,item) => {

      if(!item.children){
        pre.push(
          <Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Item>
        )
      } else {
        if(item.children.some(item => item.key===path)){
          this.openKey = item.key
        }
        pre.push(
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon}/>
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getMenuNodes2(item.children)}
          </SubMenu>
        )
      }
      return pre
    },[])
  }

  componentWillMount () {
    this.menuNodes = this.getMenuNodes2(menuList)
  }

  render() {
    const menuNodes = this.menuNodes
    const selectedKey = this.props.location.pathname
    const openKey = this.openKey
    //console.log('left-nav render()', this.props.location.pathname, this.openKey)
    
    return (
      <div className="left-nav">
        <Link to="/home" className="left-nav-header">
          <img src={logo} alt="logo"/>
          <h1>硅谷后台</h1>
        </Link>
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys = {[selectedKey]}
          defaultOpenKeys={[openKey]}
        >
          { menuNodes }
        </Menu>
      </div>
      // <Layout style={{ minHeight: '100vh' }}>
      //   <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
      //     <div className="logo" />
      //     <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
      //       <Menu.Item key="1">
      //         <Icon type="pie-chart" />
      //         <span>Option 1</span>
      //       </Menu.Item>
      //       <Menu.Item key="2">
      //         <Icon type="desktop" />
      //         <span>Option 2</span>
      //       </Menu.Item>
      //       <SubMenu
      //         key="sub1"
      //         title={
      //           <span>
      //             <Icon type="user" />
      //             <span>User</span>
      //           </span>
      //         }
      //       >
      //         <Menu.Item key="3">Tom</Menu.Item>
      //         <Menu.Item key="4">Bill</Menu.Item>
      //         <Menu.Item key="5">Alex</Menu.Item>
      //       </SubMenu>
      //       <SubMenu
      //         key="sub2"
      //         title={
      //           <span>
      //             <Icon type="team" />
      //             <span>Team</span>
      //           </span>
      //         }
      //       >
      //         <Menu.Item key="6">Team 1</Menu.Item>
      //         <Menu.Item key="8">Team 2</Menu.Item>
      //       </SubMenu>
      //       <Menu.Item key="9">
      //         <Icon type="file" />
      //         <span>File</span>
      //       </Menu.Item>
      //     </Menu>
      //   </Sider>
      //   <Layout>
      //     <Header style={{ background: '#fff', padding: 0 }} />
      //     <Content style={{ margin: '0 16px' }}>
      //       <Breadcrumb style={{ margin: '16px 0' }}>
      //         <Breadcrumb.Item>User</Breadcrumb.Item>
      //         <Breadcrumb.Item>Bill</Breadcrumb.Item>
      //       </Breadcrumb>
      //       <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>Bill is a cat.</div>
      //     </Content>
      //     <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      //   </Layout>
      // </Layout>
    )
  }
}

export default withRouter(LeftNav)