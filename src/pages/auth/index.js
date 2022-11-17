import "./style.css";

import React, { useContext, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "@firebase/auth";

import { context } from "../../App";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Authentication() {
  const [isRegisterForm, setIsRegisterForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirm_password] = useState("");

  //loading context
  const { setIsLoading } = useContext(context);
  //authentication purpose
  const auth = getAuth();

  const navigate = useNavigate();

  const register = async (evt) => {
    evt.preventDefault();
    if (email === "" || password === "" || confirm_password === "") {
      return toast.error("please fill out all details", { autoClose: 2000 });
    }
    if (password.length < 6) {
      return toast.error("password length must be >6");
    }
    if (!email.includes("@")) {
      return toast.error("invalid email");
    }
    try {
      setIsLoading(true);
      const user = await createUserWithEmailAndPassword(auth, email, password);
      //jugad for login of user until he logs out
      localStorage.setItem("auth_user", user.user.email);
      localStorage.setItem("current_user", '{ "name": "unknown" }');
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      if (/email-already-in-use/.test(error)) {
        toast.error("User with this email already exists!", {
          autoClose: 2000,
        });
      } else if (/weak-password/.test(error)) {
        toast.warning("Password must have min-length 6 char!", {
          autoClose: 2000,
        });
      }
      setIsLoading(false);
    }
  };

  const login = async (evt) => {
    evt.preventDefault();
    if (email === "" || password === "") {
      return toast.error("please fill out all details", { autoClose: 2000 });
    }
    try {
      setIsLoading(true);
      const user = await signInWithEmailAndPassword(auth, email, password);
      //jugad for login of user until he logs out
      localStorage.setItem("auth_user", user.user.email);
      localStorage.setItem("current_user", '{ "name": "unknown" }');
      setIsLoading(false);
      navigate("/");
    } catch (err) {
      toast.error("Wrong credentials!", { autoClose: 1000 });
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="auth-main-container"
      initial={{
        x: "100vw",
      }}
      animate={{
        x: 0,
      }}
      transition={{
        delay: 0,
        type: "tween",
        stiffness: 0,
      }}
    >
      <div className="large-title">
        Welcome to{" "}
        <div style={{ display: "inline-block" }}>
          <img className="logo-img" src="/logo.png" alt="logo" />
          Firecart
        </div>
      </div>
      <div className="auth-container">
        <div className="auth-img">
          <lottie-player
            src="https://assets5.lottiefiles.com/packages/lf20_gjmecwii.json"
            background="transparent"
            speed="1"
            loop
            autoplay
          ></lottie-player>
        </div>
        <form className="auth-form">
          <h1 className="black-title-lg">
            {!isRegisterForm ? `Login Here` : `Register Here`}
          </h1>
          <hr />
          <input
            autoFocus
            className="form-control"
            type="email"
            placeholder="email"
            value={email}
            onChange={(evt) => setEmail(evt.target.value.trim().toLowerCase())}
          />
          <input
            className="form-control"
            type="password"
            placeholder="password"
            value={password}
            onChange={(evt) => setPassword(evt.target.value.trim())}
          />
          {isRegisterForm ? (
            <input
              className="form-control"
              type="password"
              placeholder="confirm password"
              value={confirm_password}
              onChange={(evt) => setConfirm_password(evt.target.value.trim())}
            />
          ) : null}
          {isRegisterForm ? (
            <button className="btn btn-primary login" onClick={register}>
              register
            </button>
          ) : (
            <button className="btn btn-primary login" onClick={login}>
              login
            </button>
          )}
          {isRegisterForm ? (
            <p>
              Already have an account?{" "}
              <span
                className="blue-title-with-underline"
                onClick={() => setIsRegisterForm((i) => !i)}
              >
                Login
              </span>
            </p>
          ) : (
            <p>
              Don't have and account?{" "}
              <span
                className="blue-title-with-underline"
                onClick={() => setIsRegisterForm((i) => !i)}
              >
                Register
              </span>
            </p>
          )}
        </form>
      </div>
    </motion.div>
  );
}

export default Authentication;
