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

// 상품 정보 조회
router.post('/products', (req, res) => {
    let index = req.body.index ? parseInt(req.body.index) : 0
    let limit = req.body.limit ? parseInt(req.body.limit) : 8
    let term = req.body.searchTerm
    let filterArg = {}

    for(let key in req.body.filters) {
        if(req.body.filters[key].length > 0) {
            if(key === "price") {
                filterArg[key] = {
                    // greater than equal
                    $gte: req.body.filters[key][0],
                    // less than eqaul
                    $lte: req.body.filters[key][1]
                }
            } else {
                filterArg[key] = req.body.filters[key]
            }
        }
    }

    if(term) {
        Product.find(filterArg)
            .find({$text: {$search:term}})
            .populate("writer")
            .skip(index)
            .limit(limit)
            .exec((err, productInfo) => {
                if(err) {
                    return res.status(400).json({success:false, err})
                }

                return res.status(200).json(
                    {
                        success: true, 
                        productInfo, 
                        postSize: productInfo.length
                    }
                )
            })
    }
    else {
        Product.find(filterArg)
            .populate("writer")
            .skip(index)
            .limit(limit)
            .exec((err, productInfo) => {
                if(err) {
                    return res.status(400).json({success:false, err})
                }

                return res.status(200).json(
                    {
                        success: true, 
                        productInfo, 
                        postSize: productInfo.length
                    }
                )
            })
    }
})

// 상품 상세 정보를 조회
router.get('/getProduct', (req, res) => {
    let type = req.query.type
    let productIds = req.query.id


    if(type === "array") {
        let ids = req.query.id.split(',')
        productIds = ids.map(item => {
            return item
        })
    }

    Product.find({_id:{$in: productIds}})
        .populate('writer')
        .exec((err,product) => {
            if(err) return res.status(400).send(err)
            return res.status(200).send(product)
        })
})

// 이미지 파일 삭제
router.delete('/image?:filePath', (req, res) => {
    if(fs.existsSync(req.query.filePath)) {
        try {
            fs.unlinkSync(req.query.filePath)
            return res.json({success:true})
        } catch(error) {
            return res.json({success:false, err:error})
        }
    }

    return res.json({success:false, err:'not exist file'})
})


module.exports = router;
