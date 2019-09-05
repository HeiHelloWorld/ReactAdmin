import React, { Component } from 'react'
import { Card,Icon,List } from "antd"

import { reqProduct, reqCategory } from '../../api'
import LinkButton from "../../components/link-button"
import memoryUtils from "../../utils/memoryUtils"
import { BASE_IMG_PATH } from '../../utils/constants'
import './product.less'

const {Item} = List

export default class ProductDetail extends Component {

  state = {
    product: memoryUtils.product,
    categoryName : ''
  }

  getCategory = async (categoryId) => {
    const result = await reqCategory(categoryId)
    if(result.status===0){
      const categoryName = result.data.name
      this.setState({
        categoryName
      })
    }
  }

  async componentDidMount (){
    if(!this.state.product._id){
      const result = await reqProduct(this.props.match.params.id)
      if(result.status===0) {
        const product = result.data
        this.setState({
          product
        })
        this.getCategory(product.categoryId)
      }
    } else {
      this.getCategory(this.state.product.categoryId)
    }
  }

  render() {
    const {product,categoryName} = this.state

    const title = (
      <>
        <LinkButton 
          onClick={() => this.props.history.goBack()}>
          <Icon type="arrow-left"></Icon> 
          商品详情
        </LinkButton>
      </>
    )
    return (
      <Card title={title} className="detail">
        <List>
          <Item>
            <span className="detail-left">商品名称：</span>
            <span>{product.name}</span>
          </Item>
          <Item>
            <span className="detail-left">商品描述：</span>
            <span>{product.desc}</span>
          </Item>
          <Item>
            <span className="detail-left">商品价格：</span>
            <span>{product.price}元</span>
          </Item>
          <Item>
            <span className="detail-left">商品分类：</span>
            <span>{categoryName}</span>
          </Item>
          <Item>
            <span className="detail-left">商品图片：</span>
            <span className="detail-imgs">
              {
                product.imgs && product.imgs.map(item => (
                  <img key={item} src={{BASE_IMG_PATH} + item} alt="img" />
                ))
              }
            </span>
          </Item>
          <Item>
            <span className="detail-left">商品详情：</span>
            <div dangerouslySetInnerHTML={{ __html: product.detail }}></div>
          </Item>
        </List>
      </Card>
    )
  }
}
