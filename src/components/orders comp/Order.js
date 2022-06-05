import { doc, getDoc, getDocs, collection, query, orderBy } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { db, auth } from '../../firebaseconfig';
import "./Order.css"
import { context } from '../../App';
function Order() {

    //const
    const { setIsLoading } = useContext(context);

    const [orders, setOrders] = useState([]);

    //getting the user email which was stored at the time of login from local storage
    const [email_current_user, set_email_current_user] = useState((auth.currentUser ? auth.currentUser.email : localStorage.getItem('auth_user')));

    useEffect(() => {
        fecth_orders();
    }, [])

    const fecth_orders = async () => {
        try {
            setIsLoading(true);
            const collRef = query((collection(db, 'orders', email_current_user, "my_orders")), orderBy("ordered_at", "desc"));
            const snapshot = await getDocs(collRef);
            let order_details = [];
            snapshot.forEach((snap) => {
                order_details = [...order_details, { _id: snap.id, ...snap.data() }];
            });
            console.log(order_details)
            setOrders(order_details)
            setIsLoading(false);
        } catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }

    return (
        <div className="orders-container">
            <p className="black-title-lg">Your orders</p>
            <div className="orders">
                {
                    orders.map((order) => {
                        return (
                            <div className='order' key={order._id}>
                                <div className="order">
                                    <p className="black-title">No. of items: {order.no_of_items}</p>
                                    {
                                        order.ordered_items.map((item, idx) => {
                                            return (
                                                <p key={idx} className="small-title">
                                                    {idx + 1}) {item}
                                                </p>
                                            )
                                        })
                                    }
                                    <p className="red-title">total price: ${order.total_price}</p>
                                    <p className="green-title">Date: {order.ordered_at}</p>
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