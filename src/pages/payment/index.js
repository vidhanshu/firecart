import React, { useContext, useEffect, useState } from 'react'
//layout
import Layout from '../../components/layout'
//icons
import { IoMdArrowRoundBack } from "react-icons/io"
//navigation
import { useNavigate } from "react-router-dom"
//stylesheet
import "./style.css"
//firebase
import { db, auth } from "../../firebaseconfig"
import { addDoc, collection } from 'firebase/firestore'
//alerts
import { toast } from "react-toastify"
//contexts
import { context } from '../../App'
// import nodemailer from 'nodemailer';

function Payment() {
    const navigate = useNavigate();

    //getting the user email which was stored at the time of login from local storage
    const [email_current_user] = useState((auth.currentUser ? auth.currentUser.email : localStorage.getItem('auth_user')));


    //for the data of the cart and performing operations on it
    const { cart, setIsLoading, setCart } = useContext(context);

    const [isPaymentSuccessful, setIspaymentSuccessful] = useState(false);

    //const loading rerender
    const [loading, setLoading] = useState(0);

    //calculating the total...
    let total_amount = 0;

    const compute_total = () => {
        cart.forEach(e => {
            total_amount += parseFloat(e.sale_price) ? parseFloat(e.sale_price) : parseFloat(e.price);
        })
    }
    compute_total();

    if (total_amount === 0) {
        setIsLoading(false);
        toast.warning("please add to cart something!")
        navigate("/")
    }




    //placeorder and store data into firestore

    const order_data = {
        no_of_items: cart.length,
        ordered_at: new Date().toUTCString(),
        total_price: total_amount,
        ordered_items: cart.map(prod => prod.name)
    }




    useEffect(() => {
        setIsLoading(true);
        const id = setTimeout(async () => {
            setIsLoading(false);
            if (isPaymentSuccessful) {
                toast.success("payment successful!", { autoClose: 3000 })
                toast.success("products will be delivered within 1/0 days!", { autoClose: 3000 })
                setCart([]);
                navigate("/")
            }
        }, 2000)

        return () => {
            clearTimeout(id);
        }
    }, [loading])


    const place_order = async () => {
        await addDoc(collection(db, "orders", email_current_user, "my_orders"), order_data);
    }

    return (
        <>
            <Layout>
                <div className="back-container">
                    <div className="normal-back-without-flex" onClick={() => navigate('/')}>
                        <IoMdArrowRoundBack />
                    </div>
                </div>
                <div className='container paypal_container'>
                    <div className="paypal">
                        <div className="paypal-icon">
                            <img src="https://www.freepnglogos.com/uploads/paypal-logo-png-11.png" alt="" />
                        </div>
                    </div>
                    <div className="black-title-lg">to pay: $ {total_amount}</div>
                    <button className="btn btn-primary" onClick={() => {
                        setIspaymentSuccessful(true);
                        setLoading(i => i + 1);
                        place_order()
                    }}>pay now</button>
                </div>
            </Layout>
        </>
    )
}

export default Payment