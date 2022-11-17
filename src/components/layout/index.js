import "./style.css"

import React, { useContext } from 'react'

import AdminLogin from '../adminLogin'
import Footer from '../footer'
import Header from '../header'
import { context } from '../../App'

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