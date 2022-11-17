import "./style.css";

import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import Layout from "../../components/layout";
import { context } from "../../App";
import { db } from "../../firebaseconfig";
import isProfileExists from "../../utils/isProfileImageExists";
import { useParams } from "react-router-dom";

function Profile() {
  //global - context
  const { setIsLoading } = useContext(context);

  //all form fields
  const [name, setName] = useState("please fill details");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("please fill details");
  const [address, setAddress] = useState("please fill details");
  const [profile_image, setProfile_image] = useState(
    "https://cdn.onlinewebfonts.com/svg/img_574041.png"
  );

  //getting the user email which was stored at the time of login from local storage
  const [email_current_user] = useState(useParams().email.toLocaleLowerCase());

  //fetching the data of the user as soon as component mounts
  useEffect(() => {
    setIsLoading(true);
    get_current_user();
    const id = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(id);
  }, []);

  //fetching user data from firestore
  const get_current_user = () => {
    onSnapshot(
      doc(db, "users", email_current_user),
      (snapshot) => {
        const user_data = snapshot.data();
        console.log(email_current_user, user_data);
        fill(user_data);
      },
      (error) => {
        console.log("error:", error);
      }
    );
  };

  //fill all the details to the states
  const fill = ({ name, email, phone, address, profile_image } = {}) => {
    setName(name);
    setEmail(email);
    setPhone(phone);
    setProfile_image(
      isProfileExists(profile_image)
        ? profile_image
        : `https://cdn.onlinewebfonts.com/svg/img_574041.png`
    );
    setAddress(address);
  };

  return (
    <>
      <Layout>
        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-image-and-edit-option">
              <div className="profile-image">
                <a target="_blank" rel="noreferrer" href={profile_image}>
                  <img src={profile_image} alt="" />
                </a>
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
        </div>
      </Layout>
    </>
  );
}

export default Profile;
