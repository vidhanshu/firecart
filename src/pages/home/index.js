import { collection, setDoc, doc, getDocs, getDoc, addDoc } from '@firebase/firestore';
import React, { useEffect, useState, useContext } from 'react'
import Layout from '../../components/layout'
import { db } from "../../firebaseconfig";
import { Link } from "react-router-dom"
import { useNavigate } from 'react-router-dom';
import { context } from '../../App';
import containsSpeacialChars from "../../utils/speacial_character"
import "./style.css"
import { toast } from 'react-toastify';

function Home() {

  //filter state
  const [filter, setFilter] = useState('all');

  //filtered products - for searching and filtering purpose
  const [filtered_array, setFiltered_array] = useState([])

  //all products - this is to store backup data after searching
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
      setFiltered_array(products);

    } catch (error) {
      console.log(error)
    }
  }


  //add filter options here
  const filter_options = [
    "electronics",
    "cloths",
    "computers",
  ]

  //re-rendering the component whenever the filter changes by changing the filtered_array
  useEffect(() => {
    let array_after_filter = productsData.filter((prod) => {
      if (filter !== 'all') {
        return prod.category === filter;
      }
      return true;
    })
    setFiltered_array(array_after_filter);
  }, [filter])


  //filtered array after search
  const search = (evt) => {
    let array_after_filter = [];
    const key_word_to_be_searched = evt.target.value.trim().toLowerCase();

    if (containsSpeacialChars(key_word_to_be_searched)) {
      return toast.warning('Braces not allowed!', { autoClose: 2000 });
    }

    //creating regular expression incasesensitive
    const reg = new RegExp(`${key_word_to_be_searched}`, 'i');

    //conditional logic for checking the keyword and category as well
    array_after_filter = productsData.filter((({ name, category }) => {
      if (filter === 'all') {
        return (reg.test(name));
      } else {
        return (reg.test(name) && category === filter);
      }
    }))

    setFiltered_array(array_after_filter);
  }

  return (
    <Layout >
      <div className="search-and-filter-container">
        <input placeholder='search...' type="text" onChange={search} />

        <select defaultValue='all' onChange={(evt) => setFilter(evt.target.value)} className='filter'>
          <option>all</option>
          {
            filter_options.map(option => <option key={option} value={option}>{option}</option>)
          }
        </select>
      </div>
      <div className="container">
        <div className="grid">
          {
            (filtered_array.length) ? filtered_array.map(prod => {
              return (
                <div key={prod._id} className='product-card'>
                  <div className="product-container">
                    <p>{prod.name}</p>
                    <div className="image-container">
                      <img alt='product' src={prod.imageURL} />
                    </div>
                  </div>
                  <div className="overlay">
                    <h4>$ {prod.sale_price ? prod.sale_price : prod.price}</h4>
                    <div className="btn-group">
                      <button onClick={() => addToCart(prod)} className='btn btn-primary'>Add to cart</button>
                      <button onClick={() => navigate(`/product-info/${prod._id}`)} className='btn btn-primary'>View</button>
                    </div>
                  </div>
                </div>
              )
            }) : null
          }
        </div>
        {
          (!filtered_array.length) ?
            <div className="container">
              <img className=' no-items-in-cart-image no-data-found' src="/nodatafound.jpg" alt="" />
              <p className="large-title">No data Found!</p>
            </div> : null
        }
      </div>
    </Layout>
  )
}

export default Home;