import React, { useContext, useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { db, } from "../../firebaseconfig"
import { context } from "../../App"
import { useNavigate } from "react-router-dom"
import stringShortner from '../../utils/stringShortner'
import { deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify'

import "./style.css"
function Posts({ user, setIsEditingPost, setId, fill }) {

    //const navigate
    const navigate = useNavigate();

    //posts
    const [posts, setPosts] = useState([]);


    useEffect(() => {
        get_all_posts();
    }, [])

    //get all posts 
    const get_all_posts = () => {
        setIsLoading(true)
        try {
            const q = query(collection(db, "products"), orderBy("createdAt", "desc"))

            onSnapshot(q, (querySnapshot) => {
                let products = [];
                querySnapshot.forEach((product) => {
                    products = [...products, { _id: product.id, ...product.data() }];
                })
                setPosts(products)
                setIsLoading(false)
            })
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    //deleting the product
    const delete_product = async (id_bhej) => {
        try {
            await deleteDoc(doc(db, 'products', id_bhej));
            toast.success("Product Deleted!", { autoClose: 2000 });
        } catch (error) {
            console.log(error)
        }
    }


    //context 
    const { addToCart, setIsLoading } = useContext(context);

    return (
        <div>
            {
                <div className="container">
                    <div className="grid">
                        {
                            posts.map(post => {
                                return (
                                    <div key={post._id} className='product-card'>
                                        <div className="user_details">
                                            <div className="post-header">
                                                {post.createdBy ? post.createdBy.name : 'unknown'}
                                                <img width="30px" height="30px" src={post.createdBy ? post.createdBy.profile_image : 'https://cdn.onlinewebfonts.com/svg/img_574041.png'} alt="" className="user-icon" />
                                            </div>
                                            <p className='small-title'>posted at {post.createdAt.toString()}</p>
                                        </div>
                                        <div className='small-title prod-name'>
                                            {stringShortner(post.name, 60)}
                                        </div>
                                        <div className="product-container">
                                            <div className="image-container">
                                                <img alt='product' src={post.imageURL} />
                                                <div className="post-overlay">
                                                    <h4>$ {post.sale_price ? post.sale_price : post.price}</h4>
                                                    <div className="btn-group">
                                                        {post.createdBy.name === user.name ?
                                                            <>
                                                                <button className="btn btn-danger" onClick={() => delete_product(post._id)}>delete</button>
                                                                <button onClick={() => navigate(`/product-info/${post._id}`)} className='btn btn-primary'>View</button>
                                                                <button className="btn btn-success" onClick={() => { setIsEditingPost(true); setId(post._id); fill(post) }}>edit</button>
                                                            </>
                                                            :
                                                            <><button onClick={() => addToCart(post)} className='btn btn-primary'>Add to cart</button>
                                                                <button onClick={() => navigate(`/product-info/${post._id}`)} className='btn btn-primary'>View</button>
                                                            </>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    {
                        (!posts.length) ?
                            <div className="container">
                                <img className=' no-items-in-cart-image no-data-found' src="/nodatafound.jpg" alt="" />
                                <p className="large-title">No data Found!</p>
                            </div> : null
                    }
                </div>

            }
        </div>
    )
}

export default Posts