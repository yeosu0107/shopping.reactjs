const express = require('express');
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");
const { Product } = require('../models/Product');
const { Payment } = require('../models/Payment')
const async = require('async')

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        history: req.user.history
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

router.post("/addToCart", auth, (req, res) => {
    // User 정보 조회
    User.findOne({_id:req.user._id}, (err, userInfo) => {
        if(err) return res.status(400).json({success:false, err})

        // 유저가 카트에 상품이 있는지 확인
        let isAlreadyExist = false
        userInfo.cart.forEach((item => {
            if(item.id == req.body.productId) {
                isAlreadyExist = true
            }
        }))

        if(isAlreadyExist) {
            User.findOneAndUpdate(
                {_id:req.user._id, "cart.id":req.body.productId}, 
                {$inc: {"cart.$.quantity":1}},
                {new: true}, //userInfo에 업데이트 된 정보를 받으려면 new : true 옵션을 줘야함
                (err, userInfo) => {
                    if(err) return res.status(400).json({success:false, err})
                    res.status(200).send(userInfo.cart)
            })
        }
        else {
            User.findOneAndUpdate(
                {_id:req.user._id},
                {
                    $push: {
                        cart:{
                            id: req.body.productId,
                            quantity:1 ,
                            date: Date.now()
                        }
                    }
                },
                {new: true},
                (err, userInfo) => {
                    if(err) return res.status(400).json({success:false, err})
                    res.status(200).send(userInfo.cart)
                }
            )
        }
    })
});

router.get("/removeFromCart", auth, (req, res) => {
    let productId = req.query.productId

    User.findOneAndUpdate(
        {_id: req.user._id},
        {
            "$pull": {
                cart: {
                    id: req.query.id
                }
            }
        },
        {new: true},
        (err, userInfo) => {
            if(err) return res.status(400).json({success:false, err})

            let cart = userInfo.cart
            let cartItemsId =cart.map(item => {
                return item.id
            })

            Product.find({_id:{$in: cartItemsId}})
                .populate('writer')
                .exec((err, productInfo) => {
                    if(err) return res.status(400).json({success:false, err})
                    res.status(200).json({
                        productInfo,
                        cart
                    })
                })
            
        }
    )
});

router.post("/purchaseSuccess", auth, (req, res) => {
    let history = []
    let transactionData = {}
    // 히스토리 생성
    req.body.cartDetail.forEach(item => {
        history.push({
            dateOfPurchase: Date.now(),
            name: item.title,
            id: item._id,
            price: item.price,
            quantity: item.quantity,
            paymentId: req.body.paymentData.paymentID
        })
    })

    // transaction 정보 생성
    transactionData.user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }
    transactionData.paymentData = req.body.paymentData
    transactionData.product = history

    // 유저 정보 갱신
    User.findOneAndUpdate(
        {_id: req.user._id},
        {$push: {history: history},
        $set: {cart: []}},
        {new: true},
        (err, user) => {
            if(err) return res.status(400).json({success: false, err})

            // payment 정보 갱신
            const payment = new Payment(transactionData)
            payment.save((err, doc) => {
                if(err) return res.status(400).json({success: false, err})

                // product sold 갯수 증가
                let products = [];
                doc.product.forEach((item) => {
                    products.push({
                        id:item.id,
                        quantity: item.quantity
                    })
                })

                async.eachSeries(products, (item, callback) => {
                    Product.update(
                        {_id: item.id},
                        {$inc: {"sold": item.quantity}},
                        {new: false},
                        callback
                    )
                }, (err) => {
                    if(err) return res.status(400).json({success:false, err})
                    return res.status(200).json({
                        success: true,
                        cart: user.cart,
                        cartDetail: []
                    })
                }
                )
            })
        }
    )
});

module.exports = router;
