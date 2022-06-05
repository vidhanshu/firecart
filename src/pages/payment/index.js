import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../components/layout'
import { IoMdArrowRoundBack } from "react-icons/io"
import { useNavigate } from "react-router-dom"
import "./style.css"
import { payment_context } from '../cart'
import { toast } from "react-toastify"
import { context } from '../../App'
function Payment() {
    const navigate = useNavigate();

    //for the data of the cart and performing operations on it
    const { cart, setIsLoading, setCart } = useContext(context);

    const [isPaymentSuccessful, setIspaymentSuccessful] = useState(false);

    //const loading rerender
    const [loading, setLoading] = useState(0);

    useEffect(() => {
        setIsLoading(true);
        const id = setTimeout(() => {
            setIsLoading(false);
            if (isPaymentSuccessful) {
                toast.success("payment successful!", { autoClose: 3000 })
                setCart([]);
                navigate("/")
            }
        }, 2000)

        return () => {
            clearTimeout(id);
        }
    }, [loading])


    //calculating the total...
    let total_amount = 0;

    const compute_total = () => {
        cart.forEach(e => {
            total_amount += parseFloat(e.sale_price) ? parseFloat(e.sale_price) : parseFloat(e.price);
        })
    }
    compute_total();

    if (total_amount === 0) {
        toast.warning("please add to cart something!")
        navigate("/")
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
                    }}>pay now</button>
                </div>
            </Layout>
        </>
    )
}

export default Payment