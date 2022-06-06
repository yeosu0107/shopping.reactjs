import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import { Icon } from 'antd'
import axios from 'axios'

function FileUpload(props) {

    const [Images, setImages] = useState([])

    const dropHandler = (files) => {
        let formData = new FormData();
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append("file", files[0])

        axios.post('/api/product/image', formData, config)
            .then(response => {
                if(response.data.success) {
                    refreshImages([...Images, response.data.filePath])
                } else {
                    alert('파일 업로드를 실패하였습니다.')
                    console.log(response.data.err)
                }
            })
    }

    const deleteHandler = (image) => {
        const currentIndex = Images.indexOf(image)
        console.log(`${Images[currentIndex]}`)
        axios.delete(`/api/product/image?filePath=${Images[currentIndex]}`)
            .then(response => {
                if(response.data.success) {
                    let newImages = [...Images]
                    newImages.splice(currentIndex, 1)

                    refreshImages(newImages)
                } else {
                    alert('파일 삭제를 실패하였습니다.')
                    console.log(response.data.err)
                }
            })
    }

    const refreshImages = (images) => {
        setImages(images)
        props.refreshFunction(images)
    }

    return (
        <div style={{ display:'flex', justifyContent:'space-between'}}>
            <Dropzone onDrop={dropHandler}>
                {({getRootProps, getInputProps}) => (
                    <section>
                    <div 
                        style = {{
                            width:300, height:240, border:'1px solid lightgray',
                            display: 'flex', alignItems: 'center', justifyContent:'center'
                        }}
                        {...getRootProps()}>
                        <input {...getInputProps()} />
                        <Icon type="plus" style ={{fontSize:'3rem'}}/>
                    </div>
                    </section>
              ) }
            </Dropzone>

            <div style={{display:'flex', width:'350px', height:'240px', overflowX:'auto', overflowY:'hidden'}}>
                {Images.map((image, index) => (
                    <div key={index} style={{display:'inline-block', position:'relative'}}>
                        <img style={{minWidth: '300px', width:'300px', height:'240px'}}
                            src={`http://localhost:5000/${image}`}
                        />
                        <div style={{position:'absolute', cursor: 'pointer', top:'1%', right:'3%'}}
                            onClick={() => deleteHandler(image)}>x</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FileUpload