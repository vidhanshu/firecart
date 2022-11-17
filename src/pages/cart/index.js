import "./style.css";

import React, { createContext, useState } from "react";

import { AiOutlineDelete } from "react-icons/ai";
import { IoMdArrowRoundBack } from "react-icons/io";
import Layout from "../../components/layout";
import { Link } from "react-router-dom";
import { context } from "../../App";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export const payment_context = createContext();

function Cart() {
  //for navigation
  const navigate = useNavigate();

  //for the data of the cart and performing operations on it
  const { cart, removeFromCart } = useContext(context);

  //context late updating problem solution to rerender comp
  const [setRerender] = useState(0);

  //calculating the total...
  let total_amount = 0;

  const compute_total = () => {
    cart.forEach((e) => {
      total_amount += parseFloat(e.sale_price)
        ? parseFloat(e.sale_price)
        : parseFloat(e.price);
    });
  };
  compute_total();
  //calculating the total...

  const context_to_be_send = {
    total_amount,
    compute_total,
  };

  if (!cart.length) {
    return (
      <Layout>
        <div className="back-container">
          <div
            className="normal-back-without-flex"
            onClick={() => navigate("/")}
          >
            <IoMdArrowRoundBack />
          </div>
        </div>
        <img
          className="no-items-in-cart-image"
          src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-2506.jpg?t=st=1654090015~exp=1654090615~hmac=2a7e1f45e1bf47dee759c1a73d7d1000c5bdd65b752473a6a8da25194598efac&w=740"
          alt=""
        />
        <p className="large-title">Cart is Empty!</p>
      </Layout>
    );
  } else {
    return (
      <payment_context.Provider value={context_to_be_send}>
        <Layout>
          <div className="taggy-title-container">
            <div className="normal-back" onClick={() => navigate("/")}>
              <IoMdArrowRoundBack />
            </div>
            <div className="taggy-title">total: $ {total_amount}</div>
          </div>
          <div className="carted-item-container">
            {cart.map(({ name, _id, price, sale_price, imageURL }) => {
              return (
                <div key={_id} className="carted-item-card">
                  <div className="carted-item-image">
                    <Link to={`/product-info/${_id}`}>
                      <img src={imageURL} alt="" />
                    </Link>
                  </div>
                  <div className="carted-item-info">
                    <p className="small-title">{name}</p>
                    <p className="small-title">
                      price: ${sale_price ? sale_price : price}
                    </p>
                    <button
                      onClick={() => {
                        removeFromCart(_id);
                        setRerender((i) => i + 1);
                      }}
                      className="btn btn-danger"
                    >
                      <AiOutlineDelete />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="order_now_container">
            <Link to="/checkout">
              <button className="btn btn-primary">Check Out</button>
            </Link>
          </div>
        </Layout>
      </payment_context.Provider>
    );
  }
}

export default Cart;
