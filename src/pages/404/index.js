import React, { useState, useEffect } from 'react'
import Layout from '../../components/layout'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom"

function Error() {
  const navigate = useNavigate();
  useEffect(() => {
    toast.error("Page not found!", { autoClose: 1000 })
    const id = toast.loading("redirecting you to home!")
    setTimeout(() => {
      toast.update(id, { render: "Done!", type: 'success', isLoading: false ,autoClose:1000})
      navigate("/");
    }, 5000);
  }, [])

  return (
    <Layout>
      <img className='no-items-in-cart-image' src="/404.jpg" alt="" />
      <p className="large-title">404 Page not found!</p>
    </Layout>
  )
}

export default Error