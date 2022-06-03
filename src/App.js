import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/home';
import Cart from './pages/cart';
import Authentication from './pages/auth'
import ProductInfo from './pages/productInfo'
import Error from "./pages/404"
import { createContext } from 'react';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "./components/loader"
import { useNavigate } from 'react-router-dom';
import Profile from './pages/profile';
import { auth } from "./firebaseconfig"

export const context = createContext([]);
function App() {

  const [cart, setCart] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

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
      toast.error("Already exists in a cart!", { autoClose: 10 });
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
  const context_to_be_passed = { cart, setCart, addToCart, removeFromCart, setIsLoading };

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
        {isLoading && <Loader />}
        <Routes>
          <Route path='/' exact element={<ProtectedRoutes><Home /></ProtectedRoutes>} />
          <Route path='/cart' exact element={<ProtectedRoutes><Cart /></ProtectedRoutes>} />
          <Route path='/product-info/:id' exact element={<ProtectedRoutes><ProductInfo /></ProtectedRoutes>} />
          <Route path="/profile" exact element={<ProtectedRoutes><Profile /></ProtectedRoutes>} />
          <Route path='/*' exact element={<Error />} />
          <Route path='/auth' exact element={<Authentication />} />
        </Routes>
      </div>
    </context.Provider>
  );
}

export default App;

export const ProtectedRoutes = ({ children }) => {

  const user = auth.currentUser;
  if (user) {
    return children;
  } else {
    return <Navigate to="/auth" />
  }
}