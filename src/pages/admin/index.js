import React, { useEffect, useState, createContext, useContext } from 'react'
import "./style.css"
import { db } from "../../firebaseconfig";
import { collection, doc, orderBy, deleteDoc, onSnapshot, query, updateDoc } from "@firebase/firestore"
import EditProduct from '../../components/admin edit prod';
import { context } from '../../App';
import { toast } from "react-toastify"
import { IoMdArrowRoundBack } from "react-icons/io"
import { useNavigate } from "react-router-dom"
import containsSpecialChars from '../../utils/speacial_character';
export const product_context = createContext();

function Admin() {


    //category filter 
    const [filter, setFilter] = useState('all');

    //filtered array data 
    const [filtered_array, setFiltered_array] = useState([]);

    //for navigation
    const navigate = useNavigate();

    //isEditing
    const [isEditing, setIsEditing] = useState(false);

    //isInserting New Product
    const [newProduct, setNewProduct] = useState(false);

    //all details to be edited
    const [_id, set_Id] = useState('');
    const [name, setName] = useState('');
    const [image, setImage] = useState('https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png');//default no image preview available image
    const [price, setPrice] = useState(1);
    const [sale_price, setSale_price] = useState(1);
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');

    //to set and reset loading
    const { setIsLoading } = useContext(context)

    //all fetched products will be stored here
    const [products, setProducts] = useState([]);


    /***********************************THIS IS NOW NOT REQUIRED SINCE WE LEARNT THE CONCEPT OF SNAPSHOT**************************** */
    // //for rerendering on updating the data
    // const [updated, setUpdated] = useState(0);
    // //for rerendering on updating the data- getting called from the edit component and hence state is getting changed and component is getting rerender resulting in fetching new data from database
    // const isUpdatedFromEditProdComponent = () => {
    //     setUpdated(i => i + 1)
    // }
    /***********************************THIS IS NOW NOT REQUIRED SINCE WE LEARNT THE CONCEPT OF SNAPSHOT**************************** */

    //fetching as soon as component mounts and data get updated

    useEffect(() => {
        setIsLoading(true);
        fetch_all_categories();
        setProducts([]);
        fetch_data();

        //for getting all states updated due to late state updates
        const id = setTimeout(() => {
            setIsLoading(false);
        }, 2000)

        return () => clearTimeout(id);
    }, [])

    //re-rendering the component whenever the filter changes by changing the filtered_array
    useEffect(() => {
        let array_after_filter = products.filter((prod) => {
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

        if (containsSpecialChars(key_word_to_be_searched)) {
            return toast.warning('Braces not allowed!', { autoClose: 2000 });
        }

        //creating regular expression in case sensitive
        const reg = new RegExp(`${key_word_to_be_searched}`, 'i');

        //conditional logic for checking the keyword and category as well
        array_after_filter = products.filter((({ name, category }) => {
            if (filter === 'all') {
                return (reg.test(name));
            } else {
                return (reg.test(name) && category === filter);
            }
        }))

        setFiltered_array(array_after_filter);
    }


    //filter options
    const [filter_options, setFilter_options] = useState([]);

    //fetching all the categories stored in the firestore
    const fetch_all_categories = () => {
        onSnapshot(doc(db, "categories", 'cats'), (snapshot) => {
            setFilter_options(snapshot.data().categories);
        })
    }


    //fetching all the data from the firestore
    const fetch_data = async () => {
        try {
            const q = query(collection(db, "products"), orderBy("createdAt", "desc"))
            onSnapshot(q, (querySnapshot) => {
                let all_products = []
                let all_categories = new Set([]);
                querySnapshot.forEach(product => {
                    all_categories.add(product.data().category);
                    all_products = [...all_products, { _id: product.id, ...product.data() }];
                })
                const categories_to_be_added_to_firebase = [];
                all_categories.forEach((cat) => {
                    categories_to_be_added_to_firebase.push(cat);
                })

                setProducts(all_products);
                setFiltered_array(all_products)
            })

        } catch (error) {
            console.log(error);
        }

    }

    //fill the edit form with the current values
    const fill = ({ _id, name, price, sale_price, imageURL, description, category, brand } = {}) => {
        set_Id(_id);
        setName(name)
        setImage(imageURL)
        setPrice(price)
        setSale_price(sale_price ? sale_price : '')
        setBrand(brand);
        setCategory(category);
        setDescription(description)
        setIsEditing(true);
    }
    //clear form 
    const clear = () => {
        setCategory('');
        setName('');
        setPrice(1);
        setSale_price(1);
        setBrand('');
        setDescription('');
        setImage('https://bit.ly/3x9dBKX');
    }

    //deleting the product
    const delete_product = async (id_bhej) => {
        try {
            setIsLoading(true);
            await deleteDoc(doc(db, 'products', id_bhej));            
            setIsLoading(false);
            toast.success("Product Deleted!", { autoClose: 2000 });
        } catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }

    //context to  be sent
    const context_to_be_send = {
        name, setName,
        image, setImage,
        sale_price, setSale_price,
        price, setPrice,
        description,
        setDescription,
        setIsEditing,
        category,
        setCategory,
        brand,
        setBrand,
        _id,
        setIsLoading,
        newProduct,
        setNewProduct,
        filter_options
    }

    return (
        <>
            <product_context.Provider value={context_to_be_send}>
                {(isEditing || newProduct) && <EditProduct />}
            </product_context.Provider>
            <div className="container py-3">
                <p className="black-title-lg">
                    Edit the products
                </p>
                {/* back button */}
                <div title='back to home' className="back" onClick={() => navigate('/')}>
                    <IoMdArrowRoundBack />
                </div>
                <button className="mb-4 btn btn-primary" onClick={() => { clear(); setNewProduct(true) }}>add new product</button>

                <div className="search-and-filter-container">
                    <input placeholder='search...' type="text" onChange={search} />

                    <select defaultValue='all' onChange={(evt) => setFilter(evt.target.value)} className='filter'>
                        <option>all</option>
                        {
                            filter_options.map(option => <option key={option} value={option}>{option}</option>)
                        }
                    </select>
                </div>

                <div className="products-grid">
                    {
                        filtered_array.length ? filtered_array.map((product) =>
                        (<div key={product._id} className="admin-product">
                            <div className='admin-prod-details' key={product._id}>
                                <p className="black-title prod-name">{product.name}</p>
                                <div className="product-details">
                                    <div className="admin-prod-img-container">
                                        <img src={`${product.imageURL}`} alt="" />
                                    </div>
                                    <div className='admin-prod-options'>
                                        <button className="btn btn-success" onClick={() => fill(product)}>edit</button>
                                        <button className="btn btn-danger" onClick={() => delete_product(product._id)}>delete</button>
                                    </div>
                                </div>
                                <div className="admin-prod-more-info">
                                    <p className="black-title">price: ${product.price}</p>
                                    {product.sale_price && <p className="red-title">sale price: ${product.sale_price}</p>}
                                    <p className="black-title">brand: {product.brand}</p>
                                    <p className="blue-title">category: {product.category}</p>
                                    <p className="admin-prod-description small-title">{product.description}</p>
                                </div>
                            </div>
                        </div>
                        )
                        ) :
                            <div className="container">
                                <img className=' no-items-in-cart-image no-data-found' src="/nodatafound.jpg" alt="" />
                                <p className="large-title">No data Found!</p>
                            </div>
                    }
                </div>

            </div>
        </>
    )
}

export default Admin