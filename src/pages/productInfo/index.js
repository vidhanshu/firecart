import React, { useEffect, useState, useContext } from 'react'
import Layout from '../../components/layout'
import { useParams } from "react-router-dom";
import { getDoc, doc } from "@firebase/firestore"
import { db } from "../../firebaseconfig"
import "./style.css"
import { IoMdArrowRoundBack } from "react-icons/io"
import { useNavigate } from 'react-router-dom';
import { context } from '../../App';

function ProductInfo() {

  //manual navigation
  const navigate = useNavigate();

  //hook to get the params from path
  const params = useParams();
  const id = params.id;

  const [product, setProduct] = useState({})

  const { addToCart, setIsLoading } = useContext(context);

  useEffect(() => {
    console.log("apple")
    const fetchData = async () => {
      setProduct(await getProduct());
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const getProduct = async () => {
    try {
      setIsLoading(true);
      const snapshot = await getDoc(doc(db, 'products', id));
      const product_from_firebase = snapshot.data();
      return { _id: snapshot.id, ...product_from_firebase };
    } catch (error) {
      console.log(error)
      return { error: "some error occurred!" }
    }
  }


  const { name, imageURL, description, price, sale_price, brand } = product;


  if (product.error) {
    return (<Layout><h1>Sorry some error has occurred!</h1></Layout>)
  } else {
    return (
      <Layout>
        <div className="container product-info-container">
          <div className="back-container">
            <div title='back to home' className="normal-back-without-flex" onClick={() => navigate('/')}>
              <IoMdArrowRoundBack />
            </div>
          </div>
          <p className='black-title'>{name}</p>
          <div className="product-image-container">
            <img src={imageURL} alt="product" />
          </div>
          <div className="brand-container">
            <p className="black-title-lg">Brand: {brand ? brand.toUpperCase() : "unknown"}</p>
            <p>{description}</p>
          </div>
          <div className="price-container">
            {
              sale_price ?
                <p className='black-title'>
                  <span style={{ textDecoration: "line-through" }}>price: ${price}</span>
                  <br />
                  sale price: ${sale_price}
                  <br />
                  <p className="red-title">you will save: ${(price - sale_price).toPrecision(4)}</p>
                  <span className='red-title'>limited time offer</span>
                </p> :
                <p className='black-title'>price: ${price}</p>
            }
            <button onClick={() => addToCart(product)} className="btn btn-primary">Add to cart</button>
          </div>

        </div>
      </Layout>
    )
  }
}


export default ProductInfo

