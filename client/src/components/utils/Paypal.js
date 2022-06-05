import React from 'react';
import PaypalExpressBtn from 'react-paypal-express-checkout';
import paypalConfig from '../../config/dev';
 
export default class Paypal extends React.Component {
    render() {
        const onSuccess = (payment) => {
            console.log("The payment was succeeded!", payment);
        }
 
        const onCancel = (data) => {
            console.log('The payment was cancelled!', data);
        }
 
        const onError = (err) => {
            console.log("Error!", err);
        }
 
        let env = 'sandbox'; // you can set here to 'production' for production
        let currency = 'USD'; // or you can set this value from your props or state
        let total = this.props.total; // same as above, this is the total amount (based on currency) to be paid by using Paypal express checkout
 
        const client = {
            sandbox:    paypalConfig.sandbox,
            production: 'YOUR-PRODUCTION-APP-ID',
        }
       
        return (
            <PaypalExpressBtn 
                env={env} 
                client={client} 
                currency={currency} 
                total={total} 
                onError={onError} 
                onSuccess={onSuccess} 
                onCancel={onCancel} 
                style={{
                    size:'large',
                    color:'blue',
                    shape:'rect',
                    label:'checkout'
                }}
            />
        );
    }
}