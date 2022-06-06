import React, { useState, useContext } from 'react'
import Header from '../header'
import Footer from '../footer'
import "./style.css"
import { context } from '../../App'
import AdminLogin from '../adminLogin'

function Layout({ children }) {

    const { adminFormOpen } = useContext(context);

    return (
        <>
            {adminFormOpen && <AdminLogin />}
            <div className='main'>
                <Header />
                <div className="content">
                    {children}
                </div>
                <Footer />
            </div>
        </>
    )
}

export default Layout