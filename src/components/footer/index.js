import React from 'react'
import { Link } from 'react-router-dom';
import "./style.css"

function Footer() {
  const currentYear = (new Date()).getFullYear();
  return (
    <footer>
      <div className='wave'>
        <img className='footerwave' src="/footerwave.png" alt="wave" />
      </div>
      <div className='footer-content'>
        <Link className='logo' to="/"><img style={{ width: 30, height: 35, marginRight: 10 }} src="/logo.png" alt='logo' />Firecart</Link>
        <p><span onClick={() => console.log("clicked")}>©</span> All rights reserved {currentYear}-{currentYear + 1}</p>
      </div>
    </footer>
  )
}

export default Footer