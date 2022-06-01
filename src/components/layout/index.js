import React from 'react'
import Header from '../header'
import Footer from '../footer'
import "./style.css"
function Layout({ children }) {
    return (
        <div className='main'>
            <Header />
            <div className="content">
                {children}
            </div>
            <Footer />
        </div>
    )
}

export default Layout