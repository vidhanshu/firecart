import "./style.css";

import React, { useContext, useEffect, useState } from "react";
import { doc, getDoc } from "@firebase/firestore";

import { GrFormSubtract } from "react-icons/gr";
import { context } from "../../App";
import { db } from "../../firebaseconfig";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

//animation

function AdminLogin() {
  const navigate = useNavigate();

  const { setAdminFormOpen } = useContext(context);
  const [creds, setCreds] = useState({});

  useEffect(() => {
    fetch_creds();
  }, []);

  const fetch_creds = async () => {
    try {
      const snapshot = await getDoc(
        doc(db, "admin_auth", "zYiyqOdQaZNe24oPIFmZ")
      );
      console.log(snapshot);
      setCreds({ _id: snapshot.id, ...snapshot.data() });
    } catch (err) {
      console.log(err);
    }
  };

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const verify = (evt) => {
    evt.preventDefault();
    if (
      user === "" ||
      password === "" ||
      creds.password !== password ||
      creds.user !== user
    ) {
      return setAdminFormOpen((i) => !i);
    }
    if (creds.password === password && creds.user === user) {
      setAdminFormOpen((i) => !i);
      navigate(`/admin/${creds._id}`);
    }
  };

  return (
    <div className="admin-form-container">
      <motion.form
        onSubmit={verify}
        className="admin-form"
        initial={{
          scale: 0,
        }}
        animate={{
          scale: 1,
        }}
        transition={{
          delay: 0.2,
          type: "spring",
          stiffness: 200,
        }}
      >
        <GrFormSubtract
          className="close"
          onClick={() => setAdminFormOpen((i) => !i)}
        />
        <div className="black-title-lg">Congratulations</div>
        <div className="black-title"> You found hidden feature</div>
        <div className="black-title">It's admin panel !</div>
        <input
          value={user}
          onChange={(evt) => setUser(evt.target.value)}
          className="form-control"
          type="text"
          placeholder="username"
        />
        <input
          value={password}
          onChange={(evt) => setPassword(evt.target.value)}
          className="form-control"
          type="password"
          placeholder="password"
        />
        <button className="btn btn-primary">login</button>
      </motion.form>
    </div>
  );
}

export default AdminLogin;
