import "./Order.css"

import React, { useContext, useEffect, useState } from 'react'
import { auth, db } from '../../firebaseconfig';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

import { context } from '../../App';
import { editProfileContext } from '../../pages/profile';

function Order() {

    //const
    const { setIsLoading } = useContext(context);
    const { setTotal_shopping } = useContext(editProfileContext);

    const [orders, setOrders] = useState([]);

    //getting the user email which was stored at the time of login from local storage
    const [email_current_user, set_email_current_user] = useState((auth.currentUser ? auth.currentUser.email : localStorage.getItem('auth_user')));

    useEffect(() => {
        setIsLoading(true);
        fecth_orders();

        /****isLoading jugad cause of late state updates****** */
        const id = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        return () => clearTimeout(id);
        /****isLoading jugad cause of late state updates****** */
    }, [])




    //compute total shopping
    const total_shopping = (all_orders = []) => {
        let total = 0;
        all_orders.forEach((order) => {
            total += parseFloat(order.total_price);
        })
        return total;
    }

    const fecth_orders = async () => {
        try {
            const collRef = query((collection(db, 'orders', email_current_user, "my_orders")), orderBy("ordered_at", "desc"));
            const snapshot = await getDocs(collRef);
            let order_details = [];
            snapshot.forEach((snap) => {
                order_details = [...order_details, { _id: snap.id, ...snap.data() }];
            });
            setTotal_shopping(total_shopping(order_details));
            setOrders(order_details)
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className="orders-container">
            <p className="black-title-lg">Your orders</p>
            <div className="orders">
                {
                    orders.map((order) => {
                        return (
                            <div className='order-cover' key={order._id}>
                                <div className="order">
                                    <p className="black-title">No. of items: {order.no_of_items}</p>
                                    <p className="yellow-highlighted-title">Total price: ${order.total_price}</p>
                                    <p className="blue-highlighted-title ">Date: {order.ordered_at}</p>
                                    <div className="items_container">
                                        {
                                            order.ordered_items.map((item, idx) => {
                                                return (
                                                    <p key={idx} className="small-title">
                                                        {idx + 1}) {item}
                                                    </p>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}

export default Order