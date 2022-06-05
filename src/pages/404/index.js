//hooks
import React, { useState, useEffect } from 'react'
//components
import Layout from '../../components/layout'
//for manual navigation
import { useNavigate } from "react-router-dom"
//css
import "./style.css"

function Error() {
  const navigate = useNavigate();
  //timer
  const [timer, setTimer] = useState(10);

  //automatic returning to home page
  useEffect(() => {

    //for updating each sec
    const id = setInterval(() => {
      setTimer(i => i - 1)
    }, 1000);

    //for redirection
    const idt = setTimeout(() => {
      navigate("/")
    }, 10000)

    //clearing the intervals
    return () => { clearInterval(id); clearTimeout(idt) }
  }, [])

  return (
    <Layout>
      <div className="timer">Redirecting you to home in {timer} sec</div>
      <img className='no-items-in-cart-image' src="/404.jpg" alt="" />
      <p className="large-title">404 Page not found!</p>
    </Layout>
  )
}

export default Error