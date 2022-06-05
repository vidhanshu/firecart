import React from 'react'
import Layout from '../../components/layout'
import "./style.css"
import {FaExternalLinkAlt} from 'react-icons/fa'
function Developer() {
    return (
        <Layout>
            <div className="redirect">
            <div className="black-title">click the below icon</div>
                <a  href='https://vidhanshu-portfolio.vercel.app'>
                    <FaExternalLinkAlt className='redirect-icon' />
                </a>
            </div>
        </Layout>
    )
}

export default Developer