import React from 'react';
import { Link } from "react-router-dom"
import { Navbar, Nav } from 'react-bootstrap';
import { AiOutlineShoppingCart } from "react-icons/ai"
import { useContext } from 'react';
import { context } from '../../App';


import "./style.css"


const Header = () => {

    const { cart } = useContext(context);

    return (
        <header className='App tc f3 sticky-top'>
            <Navbar style={{ padding: '10px 20px' }} className='nav-bar' expand='sm'>
                <Link className='logo' to="/"><img style={{ width: 30, height: 35, marginRight: 10 }} src="/logo.png" alt='logo' />Firecart</Link>
                <Navbar.Toggle style={{ filter: 'invert(100%)' }} aria-controls="basic-navbar-nav" color="white" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className='ms-auto'>
                        <Link className='option' to="/">Home</Link>
                        <Link className='option' to="/login">Logout</Link>
                        <Link className='option' to="/cart">
                            <AiOutlineShoppingCart />
                            <span className="notification-bubble">
                                {cart.length}
                            </span>
                        </Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </header>
    );
}

export default Header;