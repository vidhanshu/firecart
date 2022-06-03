import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import "./style.css"
import { context } from '../../App';
function Footer() {
  const { setAdminFormOpen } = useContext(context);
  const [render,setRender] = useState(1);
  return (
    <footer>
      <div className='wave'>
        <img className='footerwave' src="/footerwave.png" alt="wave" />
      </div>
      <div className='footer-content'>
        <Link className='logo' to="/"><img style={{ width: 30, height: 35, marginRight: 10 }} src="/logo.png" alt='logo' />Firecart</Link>
        <p className='small-title'><span onClick={() => {setAdminFormOpen(i => !i);setRender(i=>i+1)}}>©</span> All rights reserved by firecart.com</p>
      </div>
    </footer>
  )
}

export default Footer