import React, { useEffect, useState, createContext, useContext } from 'react'
import "./style.css"
import { db } from "../../firebaseconfig";
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc } from "@firebase/firestore"
import EditProduct from '../../components/admin edit prod';
import { context } from '../../App';
import { toast } from "react-toastify"

export const product_context = createContext();

function Admin() {

    //isEditing
    const [isEditing, setIsEditing] = useState(false);

    //isInserting New Product
    const [newProduct, setNewProduct] = useState(false);

    //all details to be edited
    const [_id, set_Id] = useState('');
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [price, setPrice] = useState(0);
    const [sale_price, setSale_price] = useState(0);
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');

    //to set and reset loading
    const { setIsLoading } = useContext(context)

    //all fetched products will be stored here
    const [products, setProducts] = useState([]);

    //for rerendering on updating the data
    const [updated, setUpdated] = useState(0);

    //for rerendering on updating the data- getting called from the edit component and hence state is getting changed and component is getting rerender resulting in fetching new data from database
    const isUpdatedFromEditProdComponent = () => {
        setUpdated(i => i + 1)
    }

    //fetching as soon as component mounts and data get updated
    useEffect(() => {
        setProducts([]);
        fetch_data();
    }, [updated])

    //fetching all the data from the firestore
    const fetch_data = async () => {
        try {
            setIsLoading(true);
            const snapshot = await getDocs(collection(db, 'products'));
            snapshot.forEach((product) => {
                setProducts(cur => [...cur, { _id: product.id, ...product.data() }])
            })
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }

    }

    //fill the edit form with the current values
    const fill = ({ _id, name, price, sale_price, imageURL, description, category } = {}) => {
        set_Id(_id);
        setName(name)
        setImage(imageURL)
        setPrice(price)
        setSale_price(sale_price ? sale_price : '')
        setCategory(category);
        setDescription(description)
        setIsEditing(true);
    }

    //deleting the product
    const delete_product = async (id_bhej) => {
        try {
            setIsLoading(true);
            await deleteDoc(doc(db, 'products', id_bhej));
            setIsLoading(false);
            setUpdated(i => i - 1);
            toast.success("Product Deleted!", { autoClose: 2000 });
        } catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }

    //context to  be sent
    const context_to_be_sent = {
        name, setName,
        image, setImage,
        sale_price, setSale_price,
        price, setPrice,
        description,
        setDescription,
        setIsEditing,
        category,
        setCategory,
        _id,
        setIsLoading,
        isUpdatedFromEditProdComponent,
        newProduct,
        setNewProduct
    }

    return (
        <>
            <product_context.Provider value={context_to_be_sent}>
                {(isEditing || newProduct) && <EditProduct />}
            </product_context.Provider>


            <div className="container py-3">
                <p className="black-title-lg">
                    Edit the products
                </p>
                <button className="mb-4 btn btn-primary" onClick={() => setNewProduct(true)}>add new product</button>
                {
                    products.map((product) =>
                    (<div key={product._id} className="admin-product">
                        <div className='admin-prod-details' key={product._id}>
                            <div className="product-details">
                                <p className="black-title">{product.name}</p>
                                <div className="admin-prod-img-container">
                                    <img src={`${product.imageURL}`} alt="" />
                                </div>
                            </div>
                            <div className="admin-prod-more-info">
                                <p className="black-title">price: ${product.price}</p>
                                {product.sale_price && <p className="red-title">sale price: ${product.sale_price}</p>}
                                <p className="blue-title">category: {product.category}</p>
                                <p className="admin-prod-description small-title">{product.description}</p>
                            </div>
                        </div>
                        <div className='admin-prod-options'>
                            <button className="btn btn-success" onClick={() => fill(product)}>edit</button>
                            <button className="btn btn-danger" onClick={() => delete_product(product._id)}>delete</button>
                        </div>
                    </div>
                    )
                    )
                }

            </div>
        </>
    )
}

export default Admin