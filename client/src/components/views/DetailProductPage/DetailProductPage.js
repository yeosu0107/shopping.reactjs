import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {Row, Col} from 'antd'
import ProductImage from './Sections/ProductImage'
import ProductInfo from './Sections/ProductInfo'

function DetailProductPage(props) {

    const productId = props.match.params.productId

    const [Product, setProduct] = useState({})

    useEffect(()=> {
        axios.get(`/api/product/getProduct?id=${productId}&type=single`)
            .then(response => {
                if(response.data.success) {
                    setProduct(response.data.product[0])
                } else {
                    alert('상품 상세 정보 조회를 실패하였습니다.')
                    console.log(response)
                }
            })
    }, [])

    return (
        <div style={{width: '100%', padding: '3rem 4rem'}}>
            <div style={{display:'flex', justifyContent:'center'}}>
                <h1>{Product.title}</h1>
            </div>

            <br />

            <Row gutter={[16,16]}>
                <Col lg={12} sm={24}>
                    <ProductImage detail={Product.images}/>
                </Col>

                <Col lg={12} sm={24}>
                    <ProductInfo detail={Product}/>
                </Col>
            </Row>
        </div>
    )
}

export default DetailProductPage
