import { Routes, Route } from 'react-router-dom'
import Home from './pages/home';
import Cart from './pages/cart';
import Login from './pages/login'
import Registration from './pages/registration'
import ProductInfo from './pages/productInfo'
import Error from "./pages/404"
import { createContext } from 'react';
import { useState } from 'react';

export const context = createContext([]);

function App() {

  const [cart, setCart] = useState([]);

  //add to the cart global context
  const addToCart = (data) => {
    if (!cart.includes(data)) {
      setCart((current_cart) => {
        return [...current_cart, data];
      })
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
  }

  //context
  const context_to_be_passed = { cart, setCart, addToCart, removeFromCart };

  return (
    <context.Provider value={context_to_be_passed}>
      <div className='App'>
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
