import { collection, setDoc, doc, getDocs, getDoc, addDoc } from '@firebase/firestore';
import React, { useEffect, useState, useContext } from 'react'
import Layout from '../../components/layout'
import { db } from "../../firebaseconfig";
import { Link } from "react-router-dom"
import { useNavigate } from 'react-router-dom';
import { context } from '../../App';

import "./style.css"

function Home() {

  //all products
  const [productsData, setProductsData] = useState([]);

  //to manually navigate and pass params
  const navigate = useNavigate();


  //context 
  const { addToCart } = useContext(context);

  //fetching the data on first load
  useEffect(() => {
    getProducts();
  }, [])

  //function to fetch the data
  const getProducts = async () => {
    const products = [];
    try {
      const snapshots = await getDocs(collection(db, 'products'));

      snapshots.forEach((productSnapshot => {
        products.push({ _id: productSnapshot.id, ...productSnapshot.data() })
      }))

      setProductsData(products);

    } catch (error) {
      console.log(error)
    }
  }


  return (
    <Layout >
      <div className="container">
        <div className="grid">
          {
            productsData.map(prod => {
              return (
                <div key={prod._id} className='product-card'>
                  <div className="product-container">
                    <p>{prod.name}</p>
                    <div className="image-container">
                      <img alt='product' src={prod.imageURL} />
                    </div>
                  </div>
                  <div className="overlay">
                    <h4>{prod.sale_price ? prod.sale_price : prod.price} Rs</h4>
                    <div className="btn-group">
                      <button onClick={() => addToCart(prod)} className='btn btn-primary'>Add to cart</button>
                      <button onClick={() => navigate(`/product-info/${prod._id}`)} className='btn btn-primary'>View</button>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </Layout>
  )
}

export default Home;