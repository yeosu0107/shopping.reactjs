import React from 'react'
import "./CartItem.css"

function CartItem(props)
{
    const renderItems = () => (
        props.products && props.products.map((product, index) => (
            <tr key={index}>
                <td>
                    <img style = {{width:'70px'}} alt="product"
                        src={renderProductImage(product.images)} />
                </td>
                <td>
                    {product.quantity} EA
                </td>
                <td>
                    {product.price}
                </td>
                <td>
                    <button onClick={()=>props.removeItem(product._id)}>
                        Remove
                    </button>
                </td>
            </tr>
        ))
    )

    const renderProductImage = (images) => {
        if(images.length > 0) {
            let image = images[0]
            return `http://localhost:5000/${image}`
        }
        return ""
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Product Image</th>
                        <th>Product Quantity</th>
                        <th>Product Price</th>
                        <th>Remove from Cart</th>
                    </tr>
                </thead>
                <tbody>
                    {renderItems()}
                </tbody>
            </table>
        </div>
    )
}

export default CartItem