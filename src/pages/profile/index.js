import "./style.css"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { deleteDoc, doc, onSnapshot } from "firebase/firestore";

import EditProfileForm from '../../components/profile edit';
import Layout from '../../components/layout'
import Order from '../../components/orders comp/Order'
import { auth } from '../../firebaseconfig'
import { context } from '../../App';
import { db } from "../../firebaseconfig"
import isProfileExists from '../../utils/isProfileImageExists'

export const editProfileContext = createContext();

function Profile() {

    //f user doesn't exist
    const [isCreatingNewProfile, setIsCreatingNewProfile] = useState(false);

    //isEditing?
    const [isEditing, setIsEditing] = useState(false);

    //global - context
    const { setIsLoading } = useContext(context);

    //all form fields
    const [name, setName] = useState('please fill details');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('please fill details');
    const [address, setAddress] = useState('please fill details');
    const [profile_image, setProfile_image] = useState('https://cdn.onlinewebfonts.com/svg/img_574041.png');

    //getting the user email which was stored at the time of login from local storage
    const [email_current_user, set_email_current_user] = useState((auth.currentUser ? auth.currentUser.email : localStorage.getItem('auth_user')));


    //const total shopping
    const [total_shopping, setTotal_shopping] = useState(0);


    //fetching the data of the user as soon as component mounts
    useEffect(() => {

        setIsLoading(true);
        get_current_user();

        //getting updated the loading from orders component

        // /****isLoading jugad cause of late state updates****** */
        // const id = setTimeout(() => {
        //     setIsLoading(false);
        // }, 3000);

        // return () => clearTimeout(id);
        // /****isLoading jugad cause of late state updates****** */
    }, []);


    //fetching user data from firestore
    const get_current_user = () => {
        onSnapshot(doc(db, 'users', email_current_user), (snapshot) => {
            const user_data = snapshot.data();
            fill(user_data)
        }, (error) => {
            console.log(error);
        })
    }

    //delete user profile 
    const deleteProfile = async () => {
        try {
            await deleteDoc(doc(db, 'users', email_current_user));
        } catch (err) {
            console.log(err);
        }
    }

    //fill all the details to the states
    const fill = ({ name, email, phone, address, profile_image } = {}) => {
        if (name === undefined || email === undefined || address === undefined || phone === undefined) {
            return setIsCreatingNewProfile(true);
        }
        setName(name);
        setEmail(email)
        setPhone(phone)
        setProfile_image(isProfileExists(profile_image) ? profile_image : `https://cdn.onlinewebfonts.com/svg/img_574041.png`);
        setAddress(address);
    }

    //context to be sent to the edit component
    const context_to_be_provided = {
        name, setName,
        email, setEmail,
        phone, setPhone,
        address, setAddress,
        profile_image, setProfile_image,
        setIsEditing,
        email_current_user,
        isCreatingNewProfile,
        setIsCreatingNewProfile,
        setTotal_shopping
    }

    return (
        <>
            <editProfileContext.Provider value={context_to_be_provided}>
                {(isEditing || isCreatingNewProfile) && <EditProfileForm />}
            </editProfileContext.Provider>
            <Layout>
                <div className="profile-container">
                    <div className="profile-card">
                        <div className="profile-image-and-edit-option">
                            <div className="profile-image">
                                <a target="_blank" rel="noreferrer" href={profile_image}><img src={profile_image} alt="" /></a>
                            </div>
                            <div className="options-container">
                                <button className="btn btn-primary mt-1" onClick={() => setIsEditing(true)}>
                                    Edit profile
                                </button>
                                <button className="btn btn-danger mt-1" onClick={deleteProfile}>
                                    Delete profile
                                </button>
                                <p className='yellow-highlighted-title'>
                                    total shopping ${total_shopping}
                                </p>
                            </div>
                        </div>
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
                    <editProfileContext.Provider value={context_to_be_provided}>
                        <Order />
                    </editProfileContext.Provider>
                </div>
            </Layout>
        </>

    )
}

export default Profile