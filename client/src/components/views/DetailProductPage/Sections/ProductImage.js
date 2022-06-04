import React, { useEffect, useState } from 'react'
import ImageGallery from 'react-image-gallery'

function ProductImage(props) {
    const [Images, setImages] = useState([])

    useEffect(()=> {
        if(props.detail && props.detail.length > 0) {
            let images = []

            props.detail.map(item => {
                images.push({
                    original: `http://localhost:5000/${item}`,
                    thumbnail: `http://localhost:5000/${item}`
                })
            })

            setImages(images)
        }

        // props.detail 값이 바뀔 때마다 라이프 사이클이 작동됨
    }, [props.detail])

    return (
        <div>
            <ImageGallery items={Images} />
        </div>
    )
}

export default ProductImage