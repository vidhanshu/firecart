import { Routes, Route, Navigate } from 'react-router-dom'
import Shop from './pages/shop';
import Cart from './pages/cart';
import Authentication from './pages/auth'
import ProductInfo from './pages/productInfo'
import Admin from './pages/admin';
import CheckOut from './pages/checkout';
import Payment from './pages/payment';
import Home from './pages/home';
import Profile from './pages/profile';
import Error from "./pages/404"

//hooks
import { createContext } from 'react';
import { useState } from 'react';

//for toasts
import { ToastContainer, toast } from 'react-toastify';
//import once use everywhere toast
import 'react-toastify/dist/ReactToastify.css';
//for loading throughout website
import Loader from "./components/loader"
//authentication
import { auth } from "./firebaseconfig"
import Developer from './pages/developer';
import UserProfile from './pages/user-profile';
//global context
export const context = createContext([]);
function App() {

  //complete current cart data
  const [cart, setCart] = useState([]);
  //loading page or not
  const [isLoading, setIsLoading] = useState(false);
  //check if item already exists
  const check_if_exist = (key) => {
    for (let i = 0; i < cart.length; i++) {
      console.log(key);
      if (cart[i]._id === key) {
        return true;
      }
    }
    return false;
  }
  //admin form  
  const [adminFormOpen, setAdminFormOpen] = useState(false);

  //add to the cart global context
  const addToCart = (data) => {
    console.log(cart);
    if (!check_if_exist(data._id)) {
      setCart((current_cart) => {
        return [...current_cart, data];
      })
      toast.success("Added successfully", { autoClose: 1000 })
    } else {
      toast.error("Already exists in a cart!", { autoClose: 1000 });
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
    toast.success("deleted successfully!", { autoClose: 1000, })
  }

  //context
  const context_to_be_send = { cart, setCart, addToCart, removeFromCart, setIsLoading, adminFormOpen, setAdminFormOpen };

  return (
    <context.Provider value={context_to_be_send}>
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
          <Route path='/developer' exact element={<ProtectedRoutes><Developer /></ProtectedRoutes>} />
          <Route path='/shop' exact element={<ProtectedRoutes><Shop /></ProtectedRoutes>} />
          <Route path='/cart' exact element={<ProtectedRoutes><Cart /></ProtectedRoutes>} />
          <Route path='/checkout' exact element={<ProtectedRoutes><CheckOut /></ProtectedRoutes>} />
          <Route path='/payment' exact element={<ProtectedRoutes><Payment /></ProtectedRoutes>} />
          <Route path='/product-info/:id' exact element={<ProtectedRoutes><ProductInfo /></ProtectedRoutes>} />
          <Route path="/profile" exact element={<ProtectedRoutes><Profile /></ProtectedRoutes>} />
          <Route path="/user-profile/:email" exact element={<ProtectedRoutes><UserProfile /></ProtectedRoutes>} />
          <Route path="/profile:email" exact element={<ProtectedRoutes><Profile /></ProtectedRoutes>} />
          <Route path="/admin/:id" exact element={<ProtectedRoutes><Admin /></ProtectedRoutes>} />
          <Route path='/auth' exact element={<Authentication />} />
          <Route path='/*' exact element={<Error />} />
        </Routes>
      </div>
    </context.Provider>
  );
}

export default App;


//protecting the routes by checking if the user is authenticated as soon as we route to the page
export const ProtectedRoutes = ({ children }) => {

  const user = auth.currentUser;

  const user_from_local_store = (localStorage.getItem('auth_user') === 'null' ? null : localStorage.getItem('auth_user'));

  if (user !== null || user_from_local_store !== null) {
    return children;
  } else {
    return <Navigate to="/auth" />
  }
}