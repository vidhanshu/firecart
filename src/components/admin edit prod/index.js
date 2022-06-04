import React, { useContext } from 'react'
import "./style.css"
import { product_context } from '../../pages/admin'
import { db } from "../../firebaseconfig"
import { collection, addDoc, doc, updateDoc } from "@firebase/firestore"

import { toast } from "react-toastify"

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
        isUpdatedFromEditProdComponent,
        newProduct,
        setNewProduct
    } = useContext(product_context);

    //handler cancel
    const cancel = (evt) => {
        evt.preventDefault();
        setIsEditing(false);
    }
    //handle update
    const update = async (evt) => {
        evt.preventDefault();
        try {
            setIsLoading(true)
            await updateDoc(doc(db, 'products', _id), {
                name,
                price,
                sale_price,
                description,
                category,
                brand,
                image,
            })
            setIsLoading(false)
            toast.success("data updated successfully!", { autoClose: 2000 })
            isUpdatedFromEditProdComponent();

        } catch (error) {
            console.log(error);
            setIsLoading(false)
        }
    }

    //inserting new product
    const addProduct = async (evt) => {
        evt.preventDefault();
        const data = {
            name,
            price,
            sale_price,
            category,
            imageURL: image,
            description
        }
        try {
            setIsLoading(true)
            const snapshot = await addDoc(collection(db, "products"), data);
            console.log(snapshot)
            toast.success("product added", { autoClose: 2000 });
            isUpdatedFromEditProdComponent();
            setIsLoading(false)
        } catch (error) {
            console.log(error);
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className='edit-prod-form-container'>
                <form className='edit-prod-form'>
                    <p className="black-title-lg text-center">
                        Edit the products
                    </p>
                    <label htmlFor='name'>name</label>
                    <input autoFocus={true} id='name' type="text" className='form-control' placeholder='name' value={name} onChange={(evt) => setName(evt.target.value)} />
                    <label htmlFor='price'>price</label>
                    <input id='price' type="number" className='form-control' placeholder='price' value={price} onChange={(evt) => setPrice(evt.target.value)} />
                    <label htmlFor='sale_price'>sale Price</label>
                    <input id="sale_price" type="number" className='form-control' placeholder='sale_price' value={sale_price} onChange={(evt) => setSale_price(evt.target.value)} />
                    <label htmlFor='image_url'>image</label>
                    <input id="image_url" type="text" className='form-control' placeholder='image' value={image} onChange={(evt) => setImage(evt.target.value)} />
                    <label htmlFor='brand'>brand</label>
                    <input id="brand" type="text" className='form-control' placeholder='brand' value={brand} onChange={(evt) => setBrand(evt.target.value)} />
                    <label htmlFor='category'>category</label>
                    <input id="category" type="text" className='form-control' placeholder='category' value={category} onChange={(evt) => setCategory(evt.target.value)} />
                    <label htmlFor='description'>description</label>
                    <textarea id="description" type="text" className='form-control' placeholder='description' value={description} onChange={(evt) => setDescription(evt.target.value)} />
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
                </form>
            </div></>

    )
}

export default EditProduct