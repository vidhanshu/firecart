import React from 'react';
import { Link } from "react-router-dom"
import { Navbar,  Nav } from 'react-bootstrap';
import {AiOutlineShoppingCart} from "react-icons/ai"

import "./style.css"
const Header = () => {
    return (
        <div className='App tc f3 sticky-top'>
            <Navbar style={{ padding: '10px 20px' }} className='nav-bar' expand='lg'>
                <Link className='logo' to="/"><img style={{ width: 30, height: 35,marginRight:10}} src="/logo.png" alt='logo' />Firecart</Link>
                <Navbar.Toggle style={{filter:'invert(100%)'}} aria-controls="basic-navbar-nav" color="white" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className='ms-auto'>
                        <Link className='option' to="/Login">Login</Link>
                        <Link className='option' to="/Register">Register</Link>
                        <Link className='option' to="/cart"><AiOutlineShoppingCart/></Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}

export default Header;