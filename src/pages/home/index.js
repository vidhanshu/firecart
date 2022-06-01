import { collection, setDoc, doc, getDocs, getDoc, addDoc } from '@firebase/firestore';
import React, { useEffect, useState } from 'react'
import Layout from '../../components/layout'
import { db } from "../../firebaseconfig";
import "./style.css"
function Home() {
  const [productsData, setProductsData] = useState([]);

  useEffect(() => {
    getProducts();
  }, [])

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
                      <button className='btn btn-primary'>Add to cart</button>
                      <button className='btn btn-primary'>View</button>
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