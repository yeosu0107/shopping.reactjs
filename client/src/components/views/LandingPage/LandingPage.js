import React, { useEffect, useState } from 'react'
import { FaCode } from "react-icons/fa";
import axios from "axios";
import {Icon, Col, Card, Row, Carousel} from 'antd'
import Meta from 'antd/lib/card/Meta'
import ImageSlider from '../../utils/ImageSlider';

function LandingPage() {

    const [Products, setProducts] = useState([])
    const [Index, setIndex] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0)


    useEffect(() => {
        let body = {
            index: Index,
            limit: Limit
        }

        getProducts(body)
    }, [])

    const renderCards = Products.map((product, index) => {
        return <Col lg={6} md={8} xs={24} key={index}>
            <Card 
                cover={<ImageSlider images={product.images} />}>
                <Meta 
                   title={product.title}
                    description={`$${product.price}`}
                />
            </Card>
        </Col>
    })

    const getProducts = (body) => {
        axios.post('/api/product/products', body)
        .then(response => {
            console.log(body)
            if(response.data.success) {
                if(body.loadMore) {
                    console.log(response.data.productInfo)
                    setProducts([...Products, ...response.data.productInfo])
                }
                else {
                    setProducts(response.data.productInfo)
                }
                setPostSize(response.data.postSize)
            } else {
                alert("상품 정보를 조회하는 데  실하ㅆ습니다.")
            }
        })
    }

    const loadMoreHandler = () => {
        let index = Index + Limit

        let body = {
            index: index,
            limit: Limit,
            loadMore: true
        }
        setIndex(index)
        getProducts(body)
    }

    return (
        <div style={{ width:'75%', margin: '3rem auto' }}>
            <div style={{textAlign: 'center'}}>
                <h2>Products</h2>
            </div>
            
            <Row gutter={[16,16]}>
                {renderCards}
            </Row>

            <br />

            {PostSize >= Limit &&
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <button onClick={loadMoreHandler}>더보기</button>
                </div>
            }
        </div>
    )
}

export default LandingPage
