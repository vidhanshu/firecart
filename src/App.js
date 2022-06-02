import { Routes, Route } from 'react-router-dom'
import Home from './pages/home';
import Cart from './pages/cart';
import Login from './pages/login'
import Registration from './pages/registration'
import ProductInfo from './pages/productInfo'
import Error from "./pages/404"
import { createContext } from 'react';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const context = createContext([]);

function App() {

  const [cart, setCart] = useState([]);

  //check if exists
  const check_if_exist = (key) => {
    for (let i = 0; i < cart.length; i++) {
      console.log(key);
      if (cart[i]._id === key) {
        return true;
      }
    }
    return false;
  }


  //add to the cart global context
  const addToCart = (data) => {
    console.log(cart);
    if (!check_if_exist(data._id)) {
      setCart((current_cart) => {
        return [...current_cart, data];
      })
      toast.success("Added successfully", { autoClose: 10 })
    } else {
      toast.error("Already exists in a cart!",{autoClose:10});
    }
  }

  //remove from the cart global context
  const removeFromCart = (_id) => {
    const cart_after_removal = cart;
    for (let i = 0; i < cart_after_removal.length; i++) {
      if (cart_after_removal[i]._id === _id) {
        cart_after_removal.splice(i, 1);
        break;
      }
    }
    setCart(cart_after_removal);
    toast.success("deleted successfully!", { autoClose: 10, })
  }

  //context
  const context_to_be_passed = { cart, setCart, addToCart, removeFromCart };

  return (
    <context.Provider value={context_to_be_passed}>
      <div className='App'>
        <ToastContainer
          position='top-right'
          theme='dark'
          style={{
            padding: 0,
          }}
        />
        <Routes>
          <Route path='/' exact element={<Home />} />
          <Route path='/cart' exact element={<Cart />} />
          <Route path='/login' exact element={<Login />} />
          <Route path='/registration' exact element={<Registration />} />
          <Route path='/product-info/:id' exact element={<ProductInfo />} />
          <Route path='/*' exact element={<Error />} />
        </Routes>
      </div>
    </context.Provider>
  );
}

export default App;
