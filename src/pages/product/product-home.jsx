import React, { Component } from 'react'
import { Card,Select,Input,Button,Icon,Table,message } from "antd"
import LinkButton from "../../components/link-button"
import { reqProducts, reqSearchProducts, reqUpdateStatus } from "../../api"
import memoryUtils from '../../utils/memoryUtils';

const {Option} = Select

export default class ProductHome extends Component {

  state = {
    products: [],
    total: 0,
    searchType: 'productName',
    searchName: ''
  }

  reqUpdateStatus = async (productId, status) => {
    const result = await reqUpdateStatus(productId,status)
    if(result.status===0){
      message.success('更新商品状态成功')
      this.getProducts(this.current)
    }
  }

  componentWillMount () {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name'
      }, 
      {
        title: '商品描述',
        dataIndex: 'desc'
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => '￥' + price
      },
      {
        title: '状态',
        width: 100,
        //dataIndex: 'status',
        render: ({_id,status}) => {  //1：在售  2：已下架
          let btnText = '下架'
          let text = '在售'
          if(status===2){
            btnText = '上架'
            text = '已下架'
          }

          return (
            <span>
              <Button 
                type="primary" 
                onClick={() => this.reqUpdateStatus(_id, status===1 ? 2 : 1)}>
                {btnText}
              </Button>
              <span>{text}</span>
            </span>
          )
        }
      },
      {
        title: '操作',
        width: 100,
        render: (product) => {
          return (
            <span>
              <LinkButton
                onClick={() => {
                  memoryUtils.product = product
                  this.props.history.push(`/product/detail/${product._id}`)
                }}
              >详情</LinkButton>
              <LinkButton
                onClick={() => {
                  this.props.history.push('/product/addupdate',product)
                }}
              >修改</LinkButton>
            </span>
          )
        }
      }
    ]
  }

  getProducts = async (pageNum) => {
    this.current = pageNum
    let result
    const { searchType, searchName } = this.state
    if(this.search && searchName) {
      result = await reqSearchProducts({pageNum,pageSize: 2, searchType, searchName})
    } else {
      result = await reqProducts(pageNum, 2)
    }
 
    if(result.status===0) {
      const {list,total} = result.data
      this.setState({
        products: list,
        total
      })
    }
  }

  //根据指定页码异步请求获取对应页的数据显示
  componentDidMount () {
    this.getProducts(1)
  }

  render() {

    const {products,total,searchName,searchType} = this.state

    const title = (
      <div>
        <Select 
          value={searchType} 
          style={{width:150}} 
          onChange={value => this.setState({searchType:value})}
        >
          <Option value="productName" key="1">按名称搜索</Option>
          <Option value="productDesc" key="2">按描述搜索</Option>
        </Select>
        <Input 
          placeholder="关键字" 
          value={searchName} 
          style={{ width: 200, margin:"0 15px"}}
          onChange={event => this.setState({ searchName: event.target.value })}
        />
        <Button type="primary" onClick={() =>{
          this.search = true
          this.getProducts(1)
        }}>搜索</Button>
      </div>
    )

    const extra = (
      <Button type="primary" onClick={() => this.props.history.push('/product/addupdate')}>
        <Icon type="plus"></Icon>
        添加商品
      </Button>
    )

    return (
      <Card title={title} extra={extra}>
        <Table
          rowKey='_id'
          bordered={true}
          dataSource={products}
          columns={this.columns}
          pagination={{
            current: this.current,
            pageSize: 2, 
            total, 
            onChange:(page)=>this.getProducts(page)}}
        />
      </Card>
    )
  }
}
