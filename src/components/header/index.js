import "./style.css";

import { AiOutlineLogout, AiOutlineShoppingCart } from "react-icons/ai"
import { Link, useNavigate } from "react-router-dom"
import { Nav, Navbar } from 'react-bootstrap';
import { getAuth, signOut } from "@firebase/auth";

import { BiUser } from "react-icons/bi"
import {BsShop} from "react-icons/bs"
import React from 'react';
import { context } from '../../App';
import { toast } from 'react-toastify';
import { useContext } from 'react';

const Header = () => {
    const navigator = useNavigate();
    const { cart } = useContext(context);
    const auth = getAuth();

    const logout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully!", { autoClose: 1000 });
            //logout from local storage
            localStorage.setItem("auth_user", null);
            localStorage.setItem("current_user", null);
            navigator("/auth");
        } catch (err) {
            toast.error("Unable to logout!", { autoClose: 1000 });
        }

    }

    return (
        <header className='App tc f3 sticky-top'>
            <Navbar style={{ padding: '10px 20px' }} className='nav-bar' expand='sm'>
                <Link className='logo' to="/"><img style={{ width: 30, height: 35, marginRight: 10 }} src="/logo.png" alt='logo' />Firecart</Link>
                <Navbar.Toggle style={{ filter: 'invert(100%)' }} aria-controls="basic-navbar-nav" color="white" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className='ms-auto'>
                        <Link title="shop" className='option hover-grow' to="/shop"><BsShop /></Link>
                        <span title="logout" className='logout' onClick={logout}><AiOutlineLogout fill='red'/></span>
                        <Link title="profile" className='option hover-grow' to="/profile"><BiUser /></Link>
                        <Link title="cart" className='option' to="/cart">
                            <AiOutlineShoppingCart className='hover-grow' />
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