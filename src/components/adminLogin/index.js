import React, { useState, useContext, useEffect } from 'react'
import { context } from '../../App';
import "./style.css"
import { GrFormSubtract } from 'react-icons/gr'
import { getDoc, doc, collection } from "@firebase/firestore";
import { db } from '../../firebaseconfig';
import { useNavigate } from 'react-router-dom';
function AdminLogin() {

  const navigate = useNavigate();

  const { adminFormOpen, setAdminFormOpen } = useContext(context);
  const [creds, setCreds] = useState({});

  useEffect(() => {
    fetch_creds();
  }, [])

  const fetch_creds = async () => {
    try {
      const snapshot = await getDoc(doc(db, 'admin_auth', 'zYiyqOdQaZNe24oPIFmZ'));
      setCreds({ _id: snapshot.id, ...snapshot.data() });
    } catch (err) {
      console.log(err);
    }

  }

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const verify = (evt) => {
    evt.preventDefault();
    if (user === '' || password === '' || creds.password !== password || creds.user !== user) {
      return setAdminFormOpen(i => !i);
    }
    if (creds.password === password && creds.user === user) {
      setAdminFormOpen(i => !i);
      navigate(`/admin/${creds._id}`);
    }
  }

  return (
    <div className="admin-form-container">
      <form onSubmit={verify} className='admin-form'>
      <GrFormSubtract className='close' onClick={() => setAdminFormOpen(i => !i)}  />
        <div className="black-title-lg">Congratulations</div>
        <div className="black-title"> You found hidden feature</div>
        <div className="black-title">It's admin panel !</div>
        <input value={user} onChange={evt => setUser(evt.target.value)} className='form-control' type="text" placeholder='username' />
        <input value={password} onChange={evt => setPassword(evt.target.value)} className='form-control' type="password" placeholder='password' />
        <button className="btn btn-primary">login</button>
      </form>
    </div>
  )
}

export default AdminLogin