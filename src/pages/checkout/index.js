import "./style.css"

import { Link, useNavigate } from "react-router-dom"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from "../../firebaseconfig"
import { doc, onSnapshot } from "firebase/firestore"

import CheckOutDetailsEditForm from '../../components/check out page form'
import { IoMdArrowRoundBack } from "react-icons/io"
import Layout from '../../components/layout'
import { context } from '../../App'
import { toast } from 'react-toastify'

export const checkoutcontext = createContext();

function CheckOut() {
    const navigate = useNavigate();

    //is loading
    const { setIsLoading } = useContext(context);

    //is profile exists?
    const [isProfileExists, setIsProfileExists] = useState(false);

    const [isYes, setIsYes] = useState(true);

    //current details 
    const [name, setName] = useState('please fill details');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('please fill details');
    const [address, setAddress] = useState('please fill details');

    //getting the user email which was stored at the time of login from local storage
    const [email_current_user, set_email_current_user] = useState((auth.currentUser ? auth.currentUser.email : localStorage.getItem('auth_user')));


    //fill all the details to the states
    const fill = ({ name, email, phone, address } = {}) => {
        setName(name);
        setEmail(email)
        setPhone(phone)
        setAddress(address);
    }



    useEffect(() => {
        setIsLoading(true);
        fetch_current_details();
        /****isLoading jugad cause of late state updates****** */
        const id = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(id);
        /****isLoading jugad cause of late state updates****** */
    }, [])

    const fetch_current_details = async () => {
        try {

            console.log(email_current_user)
            onSnapshot(doc(db, 'users', email_current_user), (snapshot) => {
                if (!snapshot.data()) {
                    return setIsProfileExists(false);
                } else {
                    setIsProfileExists(true);
                    fill(snapshot.data());
                }
            })
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong!", { autoClose: 2000 });
        }
    }

    //context to be sent
    const context_to_be_sent = {
        name, setName, email, setEmail, address, setAddress, phone, setPhone
    }

    return (
        <Layout>
            <div className="normal-back-without-flex m-2" onClick={() => navigate('/')}>
                <IoMdArrowRoundBack />
            </div>
            <div className="back_container">
                {isProfileExists &&
                    <div className="checkout_container">
                        <p className="black-title-lg"> For delivery, Do you wanna use same details that you have in you profile?</p>
                        <button className="btn btn-primary" onClick={() => setIsYes(true)}>yes</button>
                        <button className="btn btn-danger m-2" onClick={() => setIsYes(false)}>No</button>
                    </div>
                }
                {
                    (isProfileExists && isYes) ?
                        <div className="current_details">
                            <div className="profile-details">
                                <div className="profile-detail">
                                    <div className="black-title">name</div>
                                    <div className="small-title">{name}</div>
                                </div>
                                <div className="profile-detail">
                                    <div className="black-title">phone</div>
                                    <div className="small-title">{phone}</div>
                                </div>
                                <div className="profile-detail">
                                    <div className="black-title">email</div>
                                    <div className="small-title">{email}</div>
                                </div>
                                <div className="profile-detail">
                                    <div className="black-title">Address</div>
                                    <div className="small-title">{address}</div>
                                </div>
                            </div>
                        </div>
                        :
                        <checkoutcontext.Provider className="Provider" value={context_to_be_sent}>
                            <CheckOutDetailsEditForm />
                        </checkoutcontext.Provider>
                }
            </div>
            <div className="edit-profile-options">
                <Link to="/payment"><button className="btn btn-primary">Proceed to pay</button></Link>
            </div>
        </Layout >
    )
}

export default CheckOut