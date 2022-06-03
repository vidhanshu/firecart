import React, { useState, useContext, useEffect } from 'react'
import { context } from '../../App';
import "./style.css"
import { AiOutlineClose } from 'react-icons/ai'
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
      console.log(snapshot.id)
    } catch (err) {
      console.log(err);
    }

  }

  const [user, setUser] = useState('');
  const [password, setpassword] = useState('');

  const verify = (evt) => {
    evt.preventDefault();
    console.log(creds)
    console.log(user, password)
    if (user === '' || password === '' || creds.password !== password || creds.user !== user) {
      return setAdminFormOpen(i => !i);
    }
    if (creds.password === password && creds.user === user) {
      console.log('asoso')
      navigate(`/admin/${creds._id}`);
    }
    console.log("bananna")
  }

  return (
    <div className="admin-form-container">
      <form onSubmit={verify} className='admin-form'>
        <AiOutlineClose className='close' onClick={() => setAdminFormOpen(i => !i)} />
        <h1 className="black-title-lg">Nothing to see here!</h1>
        <input value={user} onChange={evt => setUser(evt.target.value)} className='form-control' type="text" placeholder='username' />
        <input value={password} onChange={evt => setpassword(evt.target.value)} className='form-control' type="passwordword" placeholder='passwordword' />
        <button className="btn btn-primary">login</button>
      </form>
    </div>
  )
}

export default AdminLogin