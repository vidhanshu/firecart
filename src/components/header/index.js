import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom"
import { Navbar, Nav } from 'react-bootstrap';
import { AiOutlineShoppingCart } from "react-icons/ai"
import { useContext } from 'react';
import { context } from '../../App';
import { getAuth, signOut } from "@firebase/auth";
import { toast } from 'react-toastify';
import "./style.css";


const Header = () => {
    const navigator = useNavigate();
    const { cart } = useContext(context);
    const auth = getAuth();

    const [current_user, setCurrentUser] = useState('you');

    const logout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully!", { autoClose: 1000 });
            //logout from local storage
            localStorage.setItem("auth_user", null);
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
                        <span className='logout' onClick={logout}>Logout</span>
                        <Link className='option' to="/profile">{current_user}</Link>
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