import React, { useState } from 'react'
import Layout from '../../components/layout'
import { context } from "../../App"
import { useContext } from "react"
import "./style.css"
import { AiOutlineDelete } from "react-icons/ai"
import { Link } from "react-router-dom"
import { IoMdArrowRoundBack } from "react-icons/io"
import { useNavigate } from "react-router-dom"

function Cart() {

  //for navigation
  const navigate = useNavigate();

  const { cart, removeFromCart } = useContext(context);

  const [rerender, setRerender] = useState(0);

  let total_amount = 0;

  cart.forEach(e => {
    total_amount += parseFloat(e.sale_price) ? parseFloat(e.sale_price) : parseFloat(e.price);
  })


  if (!cart.length) {
    return (
      <Layout>
        <div className="back-container">
          <div className="normal-back-without-flex" onClick={() => navigate('/')}>
            <IoMdArrowRoundBack />
          </div>
        </div>
        <img className='no-items-in-cart-image' src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-2506.jpg?t=st=1654090015~exp=1654090615~hmac=2a7e1f45e1bf47dee759c1a73d7d1000c5bdd65b752473a6a8da25194598efac&w=740" alt="" />
        <p className="large-title">Cart is Empty!</p>
      </Layout>
    )
  } else {
    return (
      <Layout >
        <div className="taggy-title-container">
          <div className='normal-back' onClick={() => navigate('/')}>
            <IoMdArrowRoundBack />
          </div>
          <div className="taggy-title">total: $ {total_amount}</div>
        </div>
        <div className="carted-item-container">
          {
            cart.map(({ name, _id, price, sale_price, imageURL }) => {
              return (
                <div key={_id} className="carted-item-card">
                  <div className="carted-item-image">
                    <Link to={`/product-info/${_id}`}><img src={imageURL} alt="" /></Link>
                  </div>
                  <div className="carted-item-info">
                    <p className='small-title'>{name}</p>
                    <p className='small-title'>price: ${sale_price ? sale_price : price}</p>
                    <button onClick={() => { removeFromCart(_id); setRerender(i => i + 1) }} className="btn btn-danger"><AiOutlineDelete /></button>
                  </div>
                </div>
              )
            })
          }
        </div>

      </Layout>
    )
  }
}

export default Cart