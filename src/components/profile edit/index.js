import React, { useContext, useState } from 'react'
import "./style.css"
import { useNavigate } from 'react-router-dom';

import isImage from "../../utils/isImage"
import findImageNameFromUrl from "../../utils/findImageNameFromUrl";
import isProfileExists from '../../utils/isProfileImageExists';

import { ref, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import { updateDoc, doc, setDoc } from "firebase/firestore";
import { storage, db } from "../../firebaseconfig"

import { toast } from "react-toastify"

import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai"
import { IoMdArrowRoundBack } from "react-icons/io"

import { editProfileContext } from '../../pages/profile'
import { context } from "../../App"

//animation
import { motion } from "framer-motion"

function EditProfileForm() {

    //const navigate
    const navigate = useNavigate();

    //for setting up loading..
    const { setIsLoading } = useContext(context);
    //for uploading of the file 
    const [imageAsFile, setImageAsFile] = useState('');

    const {
        name, setName,
        email, setEmail,
        phone, setPhone,
        address, setAddress,
        profile_image, setProfile_image,
        setIsEditing,
        email_current_user,
        setIsCreatingNewProfile,
        isCreatingNewProfile
    } = useContext(editProfileContext);



    //ek image upload krne  k lie ki gai mahabharat
    const uploadProfile = async () => {


        if (check_for_empty()) {
            return toast.error("Please fill all details!", { autoClose: 2000 });
        } else if (imageAsFile === '') {
            setIsLoading(true);
            setIsEditing(false);
            await updateDoc(doc(db, 'users', email_current_user), {
                name, email, address, phone
            })
            toast.success("details successfully updated!", { autoClose: 2000 })
        }
        else {
            if (!isImage(imageAsFile.name)) {
                setIsLoading(false);
                toast.error("Please upload jpg/ jpeg/ svg/ png/ gif", { autoClose: 4000 });
                return;
            }

            //deleting the old profile from the data base since new one is getting uploaded
            isProfileExists(profile_image) && await delete_profile_image(true);

            const storageRef = ref(storage, imageAsFile.name);

            setIsEditing(false);
            setIsLoading(true);

            toast.success("uploading started..", { autoClose: 2000 });
            // const uploadTask = uploadBytesResumable(storageRef, imageAsFile);
            uploadBytes(storageRef, imageAsFile).then(async (snapshot) => {

                //storing the name for getting the download link for image
                let name_of_the_image_just_uploaded = snapshot.ref.name;
                const pathRef = ref(storage, name_of_the_image_just_uploaded);

                toast.success("bas thodasa aur wait!", { autoClose: 2000 });
                getDownloadURL(pathRef).then(async (downloadURL) => {
                    toast.success("profile image uploaded!", { autoClose: 2000 });
                    // console.log(downloadURL);
                    setProfile_image(downloadURL);
                    //calling the above update profile function here, reason being late state updates.
                    await updateDoc(doc(db, 'users', email_current_user), {
                        name, email, address, profile_image: downloadURL, phone
                    })
                }).catch((error) => {
                    console.log(error);
                    setIsLoading(false);
                })
            })
        }
        setIsLoading(false);
        return true;
    }

    //create new profile
    const createProfile = async () => {
        setIsLoading(true);
        if (check_for_empty()) {
            toast.error("Please fill all details!", { autoClose: 2000 });
            setIsLoading(false);
            return;
        } else if (imageAsFile === '') {
            toast.success("creating your profile...!", { autoClose: 2000 })
            const docRef = await doc(db, `users/${email_current_user}`);
            await setDoc(docRef, {
                name, email, address, profile_image: "https://cdn.onlinewebfonts.com/svg/img_574041.png", phone
            });
            toast.success("profile created...!", { autoClose: 2000 })
            setIsLoading(false);
        } else {
            toast.success("creating your profile...!", { autoClose: 2000 })

            const storageRef = ref(storage, imageAsFile.name);

            uploadBytes(storageRef, imageAsFile).then(async (snapshot) => {

                //storing the name for getting the download link for image
                let name_of_the_image_just_uploaded = snapshot.ref.name;
                const pathRef = ref(storage, name_of_the_image_just_uploaded);

                getDownloadURL(pathRef).then(async (downloadURL) => {
                    toast.success("profile image uploaded!", { autoClose: 2000 });
                    setProfile_image(downloadURL);
                    const docRef = await doc(db, `users/${email_current_user}`);
                    await setDoc(docRef, {
                        name, email, address, profile_image: downloadURL, phone
                    });
                }).catch((error) => {
                    console.log(error);
                })
            })

            const docRef = await doc(db, `users/${email_current_user}`);
            await setDoc(docRef, {
                name, email, address, profile_image, phone
            });
            toast.success("profile created...!", { autoClose: 2000 })
        }
        setIsLoading(false);
        setIsCreatingNewProfile(false);
    }

    //for profile image deletion
    const delete_profile_image = async (isPreviousImageDeleted) => {
        setIsLoading(true);

        //if profile doesn't exists we can't delete
        if (!isProfileExists(profile_image)) {
            setIsLoading(false);
            return toast.error("No profile image exists!", { autoClose: 2000 });
        }

        //getting the name of the current pic to delete it from storage bucket
        let pic_to_be_deleted = findImageNameFromUrl(profile_image);

        const profile_ref = ref(storage, pic_to_be_deleted);
        deleteObject(profile_ref).then(async () => {
            isPreviousImageDeleted ? toast.success("previous profile image deleted!", { autoClose: 2000 }) : toast.success("profile image deleted!", { autoClose: 2000 })
            //just deleting from the storage is not enough we also need to delete the link of the image from the firestore hence updating the link to default link
            await updateDoc(doc(db, 'users', email_current_user), {
                profile_image: 'https://cdn.onlinewebfonts.com/svg/img_574041.png'
            })
            setIsLoading(false);
        }).catch((error) => {
            console.log(error);
            setIsLoading(false);
        })
        setIsEditing(false);
    }

    //check if fields are empty
    const check_for_empty = () => {
        if (name === '' || email === '' || address === '' || phone === '') {
            return true
        }
        return false;
    }

    const cancel_editing = () => {
        setIsEditing(false);
    }

    return (
        <>
            <div className='edit-profile-form-container'>
                <motion.form className='edit-profile-form'
                    initial={{
                        scale: 0,
                    }}
                    animate={{
                        scale: 1,
                    }}
                    transition={{
                        delay: 0,
                        type: "tween",
                        stiffness: 100,
                    }}
                >
                    <div className="white-back-button" onClick={() => {
                        if (isCreatingNewProfile) {
                            navigate("/");
                        } else {
                            setIsEditing(false);
                        }
                    }
                    }>
                        <IoMdArrowRoundBack />
                    </div>
                    <p className="black-title-lg text-center">
                        Edit Profile
                    </p>
                    <div className='image-and-option-container' style={{ position: "relative" }}>
                        <span className='edit-option'>
                            <label htmlFor="upload">
                                <AiOutlineEdit />
                            </label>
                            <input type="file" name="photo" id="upload" onChange={evt => setImageAsFile(evt.target.files[0])} />
                        </span>
                        <span className='delete-option' onClick={delete_profile_image}>
                            <label htmlFor="nothing">
                                <AiOutlineDelete />
                            </label>
                        </span>
                        <div className="profile_image_container">
                            <img src={profile_image} alt="" />
                        </div>
                    </div>
                    <label htmlFor='name'>name</label>
                    <input autoFocus={true} id='name' type="text" className='form-control' placeholder='name' value={name} onChange={evt => setName(evt.target.value)} />
                    <label htmlFor='phone'>phone</label>
                    <input id='phone' type="number" className='form-control' placeholder='phone' value={phone} onChange={(evt) => setPhone(evt.target.value)} />
                    <label htmlFor='email'>email</label>
                    <input id="email" type="text" className='form-control' placeholder='email' value={email} onChange={evt => setEmail(evt.target.value)} />
                    <label htmlFor='address'>address</label>
                    <input id="address" type="text" className='form-control' placeholder='address' value={address} onChange={evt => setAddress(evt.target.value)} />
                    <div className="edit-profile-options">
                        {!isCreatingNewProfile ?
                            <>
                                <button className="btn btn-primary" onClick={(evt) => { evt.preventDefault(); uploadProfile() }}>update</button>
                                <button className="btn btn-danger" onClick={(evt) => { evt.preventDefault(); cancel_editing() }}>cancel</button>
                            </>
                            : <button className="btn btn-primary" onClick={(evt) => { evt.preventDefault(); createProfile() }}>create</button>
                        }
                    </div>
                </motion.form>
            </div></>

    )
}

export default EditProfileForm