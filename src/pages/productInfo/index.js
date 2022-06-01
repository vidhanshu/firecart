import React, { useEffect, useState } from 'react'
import Layout from '../../components/layout'
import { useParams } from "react-router-dom";
import { getDoc, doc } from "@firebase/firestore"
import { db } from "../../firebaseconfig"
import "./style.css"

function ProductInfo() {
  //hook to get the params from path
  const params = useParams();
  const id = params.id;
  const [product, setProduct] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      setProduct(await getProduct());
    }

    fetchData();

  }, []);

  const getProduct = async () => {
    try {
      const snapshot = await getDoc(doc(db, 'products', id));
      const product_from_firebase = snapshot.data();
      return product_from_firebase;
    } catch (error) {
      console.log(error)
      return { error: "some error occurred!" }
    }
  }

  const { name, imageURL, category, description, price, sale_price, brand } = product;


  if (product.error) {
    return (<Layout><h1>Sorry some error has occurred!</h1></Layout>)
  } else {
    return (
      <Layout>
        <div className="container product-info-container">
          <p className='black-title'>{name}</p>
          <div className="product-image-container">
            <img src={imageURL} alt="product" />
          </div>
          <p className="black-title-lg">Brand: {brand ? brand.toUpperCase() : "unknown"}</p>
          <p>{description}</p>
          <div className="price-container">
            {
              sale_price ?
                <p className='black-title'>
                  <span style={{ textDecoration: "line-through" }}>price: ${price}</span>
                  <br />
                  sale price: ${sale_price}
                  <br />
                  <p className='red-title'>limited time offer</p>
                </p> :
                <p className='black-title'>price: ${price}</p>
            }
            <button className="btn btn-primary">Add to cart</button>
          </div>

        </div>
      </Layout>
    )
  }
}


export default ProductInfo

