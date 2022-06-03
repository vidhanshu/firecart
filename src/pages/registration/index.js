import React, { useState, useContext } from 'react'
import './style.css'
import { toast } from 'react-toastify';
import { context } from '../../App';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "@firebase/auth";

function Registration() {
  const [isRegisterForm, setIsRegisterForm] = useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm_password, setConfirm_password] = useState('')
  const [rerender, setRerender] = useState(1);

  //loading context
  const { setIsLoading } = useContext(context);
  //authentication purpose
  const auth = getAuth();

  const navigate = useNavigate();


  const register = async (evt) => {
    evt.preventDefault();
    try {
      setIsLoading(true)
      const user = await createUserWithEmailAndPassword(auth, email, password);
      localStorage.setItem(`${process.env.REACT_APP_SECRETE_KEY}`, user.user.email);
      setIsLoading(false);
      navigate('/');
    }
    catch (error) {
      if (/email-already-in-use/.test(error)) {
        toast.error("User with this email already exists!", { autoClose: 2000 });
      } else if (/weak-password/.test(error)) {
        toast.warning("Password must have min-length 6 char!", { autoClose: 2000 });
      }
      setIsLoading(false);
    }
  }

  const login = async (evt) => {
    evt.preventDefault();
    try {
      setIsLoading(true)
      const user = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem(`${process.env.REACT_APP_SECRETE_KEY}`, user.user.email);
      setIsLoading(false)
      navigate('/')
    } catch (err) {
      toast.error("Wrong credentials!", { autoClose: 1000 });
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-main-container">
      <div className='large-title'>Welcome to <img style={{ width: 40, height: 45, marginRight: 10 }} src="/logo.png" alt='logo' />Firecart</div>
      <div className="auth-container container">
        <div className="auth-img">
          <lottie-player
            src="https://assets5.lottiefiles.com/packages/lf20_gjmecwii.json" background="transparent"
            speed="1"
            loop autoplay>
          </lottie-player>
        </div>
        <form className="auth-form">
          <h1 className="black-title-lg">{!isRegisterForm ? `Login Here` : `Register Here`}</h1>
          <hr />
          <input className='form-control' type="email" placeholder='email' value={email} onChange={evt => setEmail(evt.target.value.trim().toLowerCase())} />
          <input className='form-control' type="password" placeholder='password' value={password} onChange={evt => setPassword(evt.target.value.trim())} />
          {isRegisterForm ?
            <input className='form-control' type="password" placeholder='confirm password' value={confirm_password} onChange={evt => setConfirm_password(evt.target.value.trim())} />
            : null
          }
          {isRegisterForm ?
            <button className="btn btn-primary login" onClick={register}>register</button>
            : <button className="btn btn-primary login" onClick={login}>login</button>
          }
          {
            isRegisterForm ?
              <p>Already have an account? <span className='blue-title-with-underline' onClick={() => setIsRegisterForm((i) => !i)}>Login</span></p>
              : <p>Don't have and account? <span className='blue-title-with-underline' onClick={() => setIsRegisterForm((i) => !i)}>Register</span></p>


          }
        </form>
      </div>
    </div>

  )
}

export default Registration