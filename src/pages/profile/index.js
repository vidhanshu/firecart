import React, { createContext, useContext, useEffect, useState } from 'react'
import Layout from '../../components/layout'
import isProfileExists from '../../utils/isProfileImageExists'
import "./style.css"
import { db } from "../../firebaseconfig"
import { onSnapshot, doc } from "firebase/firestore";
import { context } from '../../App';
import EditProfileForm from '../../components/profile edit';
import { toast } from 'react-toastify'
import { auth } from '../../firebaseconfig'

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


    //fetching the data of the user as soon as component mounts
    useEffect(() => {
        if (email_current_user) {
            get_current_user();
        } else {
            toast.error("you are not authenticated!");
        }
    }, []);


    //fetching user data from firestore
    const get_current_user = () => {
        setIsLoading(true);
        onSnapshot(doc(db, 'users', email_current_user), (snapshot) => {
            const user_data = snapshot.data();
            fill(user_data)
            setIsLoading(false);
        }, (error) => {
            console.log(error);
            setIsLoading(false);
        })
    }

    //fill all the details to the states
    const fill = ({ name, email, phone, address, profile_image } = {}) => {
        if (name === undefined || email === undefined || address === undefined || phone === undefined) {
            console.log('apple')
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
        setIsCreatingNewProfile
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
                            <button className="btn btn-primary mt-1" onClick={() => setIsEditing(true)}>
                                Edit profile
                            </button>
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
                </div>
            </Layout>
        </>

    )
}

export default Profile