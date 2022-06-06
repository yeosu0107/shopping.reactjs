import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getCartItems, removeCartItem, onPurchaseSuccess } from '../../../_actions/user_actions'
import CartItem from './Sections/CartItem';
import { Empty, Result } from 'antd'
import Paypal from '../../utils/Paypal';

function CartPage(props) {
    const dispatch = useDispatch();

    const [TotalPrice, setTotalPrice] = useState(0)
    const [ShowTotalPrice, setShowTotalPrice] = useState(false)
    const [ShowSuccess, setShowSuccess] = useState(false)

    useEffect(()=> {
        let cartItems=[]
        // cart에 상품이 있는지 확인
        if(props.user.userData && props.user.userData.cart) {
            if(props.user.userData.cart.length > 0) {
                props.user.userData.cart.forEach((item) => {
                    cartItems.push(item.id)
                })

                dispatch(getCartItems(cartItems, props.user.userData.cart))
                    .then(response => {
                        calculateTotalPrice(response.payload)
                    })
            }
        }
    }, [props.user.userData])

    let calculateTotalPrice = (cartDetail) => {
        let result = 0

        cartDetail.map(item => {
            result += parseInt(item.price, 0) * item.quantity
        })

        setTotalPrice(result)
        setShowTotalPrice(true)
    }

    let removeItemFromCart = (productId) => {
        dispatch(removeCartItem(productId))
            .then(response => {
                if(response.payload.productInfo.length <= 0) {
                    setShowTotalPrice(false)
                }
            })
    }

    const onSuccess = (payment) => {
        console.log(props.user.cartDetail)
        dispatch(onPurchaseSuccess({
            paymentData: payment,
            cartDetail: props.user.cartDetail
        }))
            .then(response => {
                if(response.payload.success) {
                    setShowTotalPrice(false)
                    setShowSuccess(true)
                }
                else {
                    alert("결제 후 데이터를 처리하는 데 실패하였습니다.")
                    console.log("onSuccess: error")
                    console.log(response.data.err)
                }
            })
    }

    return (
        <div style ={{width:'85%', margin:'3rem auto'}}>
            <h1>My Cart</h1>

            {ShowTotalPrice ? 
                <>
                    <div>
                        <CartItem products={props.user.cartDetail} removeItem={removeItemFromCart}/>
                    </div>
                     <div style={{marginTop: '3rem'}}>
                        <h2>Total Amount: ${TotalPrice}</h2>
                    </div>

                    <div>
                        <Paypal 
                            total={TotalPrice}
                            onSuccess={onSuccess}
                        />
                    </div>
                </>
            :
                <>
                    <br />
                    {ShowSuccess ?
                        <>
                        <Result
                            status="success"
                            title="Successfully Purchased Items"
                        />
                        </>
                    :
                        <>
                        <Empty description={false} />
                        <div style={{ textAlign:'center' }}>
                            <h4>No Items In the Cart</h4>
                        </div>
                        </>
                    }
                </>
            }

            

           
        </div>
    )
}

export default CartPage