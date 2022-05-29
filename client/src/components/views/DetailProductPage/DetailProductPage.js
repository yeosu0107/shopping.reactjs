import React, { useEffect, useState } from 'react'
import axios from 'axios'

function DetailProductPage(props) {

    const productId = props.match.params.productId

    useEffect(()=> {
        axios.get(`/api/product/getProduct?id=${productId}&type=single`)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data)
                } else {
                    alert('상품 상세 정보 조회를 실패하였습니다.')
                    console.log(response)
                }
            })
    }, [])

    return (
        <div>
            DetailProduct
        </div>
    )
}

export default DetailProductPage
