import Axios from 'axios'
import React from 'react'


function HistoryPage(props) {
    return (
        <div style={{ width:'80%', margin: '3rem auto' }}>
           <div style={{textAlign: 'center'}}> 
                <h1>History</h1>
           </div>

           <table>
               <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantitiy</th>
                        <th>Date of Purchase</th>
                    </tr>
               </thead>

               <tbody>
                    {props.user.userData && props.user.userData.history.map((item,index) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.price}</td>
                            <td>{item.quantity}</td>
                            <td>{item.dateOfPurchase}</td>
                        </tr>
                    ))}
               </tbody>
               
           </table>
        </div>
    )
}

export default HistoryPage
