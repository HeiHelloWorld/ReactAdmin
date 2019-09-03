import React, { Component } from 'react'
import { withRouter } from "react-router-dom"
import { Modal } from "antd";

import LinkButton from "../link-button";
import { reqWeather } from "../../api"
import { formateDate } from "../../utils/dateUtils"
import "./index.less";
import menuConfig from "../../config/menuConfig"
import memoryUtils from "../../utils/memoryUtils"
import storageUtils from '../../utils/storageUtils';

class Header extends Component {

  state = {
    currentTime:formateDate(Date.now()),
    dayPictureUrl: '',
    weather: ''
  }

  getTitle = () => {
    const path = this.props.location.pathname
    let title
    menuConfig.forEach(item => {
      if(item.key===path){
        title = item.title
      } else if (item.children){
        const cItem = item.children.find(cItem => cItem.key ===path)
        if(cItem) {
          title = cItem.title
        }
      }
    })
    return title
  }

  updateTime = () => {
    this.intervalId = setInterval(() => {
      this.setState({
        currentTime: formateDate(Date.now())
      })
    }, 1000);
  }

  getWeather = async () => {
    const { dayPictureUrl,weather } = await reqWeather('上海')
    this.setState({
      dayPictureUrl,
      weather
    })
  }

  logout = () => {
    Modal.confirm({
      title:'确定退出吗？',
      onOk: () => {
        storageUtils.removeUser()
        memoryUtils.user = {}
        this.props.history.replace('/login')
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  componentWillUnmount (){
    clearInterval(this.intervalId)
  }

  componentDidMount () {
    this.updateTime()
    this.getWeather()
  }
  
  render() {
    const title = this.getTitle()
    const { currentTime,dayPictureUrl,weather } = this.state
    const { username } = memoryUtils.user
    return (
      <div className="header">
        <div className="header-top">
          欢迎, {username}   &nbsp;
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            {dayPictureUrl ? <img src={dayPictureUrl} alt="weather" /> : null}
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)