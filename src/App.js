import { Routes, Route } from 'react-router-dom'
import Home from './pages/home';
import Cart from './pages/cart';
import Login from './pages/login'
import Registration from './pages/registration'
import ProductInfo from './pages/productInfo'
import Error from "./pages/404"
function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' exact element={<Home />} />
        <Route path='/cart' exact element={<Cart />} />
        <Route path='/login' exact element={<Login />} />
        <Route path='/registration' exact element={<Registration />} />
        <Route path='/product-info/:id' exact element={<ProductInfo />} />
        <Route path='/*' exact element={<Error/>} />
      </Routes>
    </div>
  );
}

export default App;
