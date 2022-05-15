const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { Product } = require('../models/Product')
const router = express.Router();

//=================================
//             Product
//=================================

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`)
    }
})

var upload = multer({storage: storage}).single("file")

// 상품 정보를 db에 저장
router.post('/', (req, res) => {
    const product = new Product(req.body)
    product.save((err) => {
        if(err) {
            return res.status(400).json({success: false, err: err})
        }

        return res.status(200).json({success: true})
    })
})

// 이미지 파일 저장
router.post('/image', (req, res) => {
    upload(req, res, err => {
        if(err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.fieldname})
    })
})

// 이미지 파일 삭제
router.delete('/image?:filePath', (req, res) => {
    console.log("init delete " + req.query.filePath)
    if(fs.existsSync(req.query.filePath)) {
        try {
            fs.unlinkSync(req.query.filePath)
            console.log('delete file')
            return res.json({success:true})
        } catch(error) {
            console.log(`error: ${error}`)
            return res.json({success:false, err:error})
        }
    }

    return res.json({success:false, err:'not exist file'})
})


module.exports = router;
