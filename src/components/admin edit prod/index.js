import React, { useContext } from 'react'
import "./style.css"
import { product_context } from '../../pages/admin'
import { db } from "../../firebaseconfig"
import { collection, addDoc, doc, updateDoc } from "@firebase/firestore"

import { toast } from "react-toastify"

//animation
import { motion } from "framer-motion"

function EditProduct() {

    //getting all required context
    const {
        name, setName,
        image, setImage,
        sale_price, setSale_price,
        price, setPrice,
        description,
        setDescription,
        setIsEditing,
        brand,
        setBrand,
        category,
        setCategory,
        _id,
        setIsLoading,
        newProduct,
        setNewProduct,
        filter_options
    } = useContext(product_context);

    //handler cancel
    const cancel = (evt) => {
        evt.preventDefault();
        setIsEditing(false);
    }

    //check for empty
    const isEmpty = () => {
        const check = [name, image, category, brand, description];
        return !check.every((field) => (field !== undefined && field !== ''));
    }

    //handle update
    const update = async (evt) => {
        evt.preventDefault();
        if (isEmpty()) {
            toast.error('Please fill up all details!', { autoClose: 2000 })
            return;
        }
        setIsEditing(false)
        try {
            setIsLoading(true)
            await updateDoc(doc(db, 'products', _id), {
                name,
                price,
                sale_price,
                description,
                imageURL: image,
                category,
                brand,
            })
            if (!check_if_this_cat_already_exists(category)) {
                const newCats = [...filter_options, category];
                await updateDoc(doc(db, 'categories', 'cats'), newCats);
            }

            setIsLoading(false)
            toast.success("data updated successfully!", { autoClose: 2000 })
        } catch (error) {
            console.log(error);
            setIsLoading(false)
        }

    }

    //inserting new product
    const addProduct = async (evt) => {
        evt.preventDefault();
        if (isEmpty()) {
            toast.error('Please fill up all details!', { autoClose: 2000 })
            return;
        }
        setNewProduct(false);
        const data = {
            name,
            price,
            sale_price,
            category,
            brand,
            imageURL: image,
            description,
            createdAt: new Date().toLocaleString(),
            createdBy:{
                name:"admin",
                profile_image:"https://cdn.onlinewebfonts.com/svg/img_574041.png"
            },
        }
        try {
            setIsLoading(true)
            await addDoc(collection(db, "products"), data);
            if (!check_if_this_cat_already_exists(category)) {
                const newCats = [...filter_options, category];
                await updateDoc(doc(db, 'categories', 'cats'), { categories: newCats });
            }
            toast.success("product added", { autoClose: 2000 });
            setIsLoading(false)
        } catch (error) {
            console.log(error);
            setIsLoading(false)
        }
    }

    const check_if_this_cat_already_exists = (cat) => {
        return filter_options.includes(cat);
    }
    return (
        <>
            <div className='edit-prod-form-container'>
                <motion.form className='edit-prod-form'
                    initial={{
                        scale: 0,
                    }}
                    animate={{
                        scale: 1,
                    }}
                    transition={{
                        delay: .2,
                        type: "spring",
                        stiffness: 120,
                    }}
                >
                    <p className="black-title-lg text-center">
                        Edit the products
                    </p>
                    <label htmlFor='name'>name</label>
                    <input autoFocus={true} id='name' type="text" className='form-control' value={name} onChange={(evt) => setName(evt.target.value)} />
                    <label htmlFor='price' >price</label>
                    <input min="1" id='price' type="number" className='form-control' value={price} onChange={(evt) => setPrice(evt.target.value)} />
                    <label htmlFor='sale_price'>sale Price</label>
                    <input min="1" id="sale_price" type="number" className='form-control' value={sale_price} onChange={(evt) => setSale_price(evt.target.value)} />
                    <label htmlFor='image_url'>image</label>
                    <input id="image_url" type="text" className='form-control' value={image} onChange={(evt) => setImage(evt.target.value)} />
                    <label htmlFor='brand'>brand</label>
                    <input id="brand" type="text" className='form-control' value={brand} onChange={(evt) => setBrand(evt.target.value)} />
                    <label htmlFor='category'>category</label>
                    <input id="category" type="text" className='form-control' value={category} onChange={(evt) => setCategory(evt.target.value)} />
                    <label htmlFor='description'>description</label>
                    <textarea id="description" type="text" className='form-control' value={description} onChange={(evt) => setDescription(evt.target.value)} />
                    {!newProduct ?
                        <div className="edit-prod-options">
                            <button className="btn btn-primary" onClick={update}>update</button>
                            <button className="btn btn-danger" onClick={cancel}>cancel</button>
                        </div> :
                        <div className="edit-prod-options">
                            <button className="btn btn-primary" onClick={addProduct}>Add</button>
                            <button className="btn btn-danger" onClick={() => setNewProduct(false)}>cancel</button>
                        </div>
                    }
                </motion.form>
            </div></>

    )
}

export default EditProduct