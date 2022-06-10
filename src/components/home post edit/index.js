import React from 'react'
import { motion } from 'framer-motion';
import { useContext, useState } from "react"
import { toast } from "react-toastify"
import { postContext } from "../../pages/home"
import { addDoc, collection, doc, updateDoc } from "firebase/firestore"
import { db, auth } from "../../firebaseconfig"

function EditPost({ type }) {

    //const current_user
    const [current_user, setCurrent_user] = useState(JSON.parse(localStorage.getItem('current_user')));
    //getting the user email which was stored at the time of login from local storage
    const [email_current_user, set_email_current_user] = useState((auth.currentUser ? auth.currentUser.email : localStorage.getItem('auth_user')));

    const {
        name, setName,
        price, setPrice,
        sale_price, setSale_price,
        category, setCategory,
        brand, setBrand,
        description, setDescription,
        image, setImage, setIsEditing,
        setIsEditingPost, categories, id
    } = useContext(postContext)

    //check for empty
    const isEmpty = () => {
        const check = [name, image, category, brand, description];
        return !check.every((field) => (field !== undefined && field !== ''));
    }


    const check_if_this_cat_already_exists = (cat) => {
        return categories.includes(cat);
    }



    const cancel = (evt) => {
        evt.preventDefault()
        if (type) {
            return setIsEditingPost(false);
        }
        setIsEditing(false);
    }


    //inserting new product
    const addPost = async () => {
        if (isEmpty()) {
            toast.error('Please fill up all details!', { autoClose: 2000 })
            return;
        }
        setIsEditing(false);
        const data = {
            name,
            price,
            sale_price,
            category,
            brand,
            imageURL: image,
            description,
            createdAt: new Date().toLocaleString(),
            createdBy: current_user,
            actual_email: email_current_user,
        }
        try {
            // setIsLoading(true)
            await addDoc(collection(db, "products"), data);
            toast.success("product added", { autoClose: 2000 });
            // setIsLoading(false)
        } catch (error) {
            console.log(error);
            // setIsLoading(false)
        }

    }


    //handle update
    const editPost = async () => {
        console.log(id);
        if (isEmpty()) {
            toast.error('Please fill up all details!', { autoClose: 2000 })
            return;
        }
        try {
            setIsEditingPost(false);
            await updateDoc(doc(db, 'products', id), {
                name,
                price,
                sale_price,
                description,
                imageURL: image,
                category,
                brand,
            })
            if (!check_if_this_cat_already_exists(category)) {
                const newCats = { categories: [...categories, category] };
                await updateDoc(doc(db, 'categories', 'cats'), newCats);
            }

            toast.success("data updated successfully!", { autoClose: 2000 })
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <div className='edit-prod-form-container' style={{ zIndex: "3000" }}>
            <motion.form className='edit-prod-form'
                initial={{
                    scale: 0,
                }}
                animate={{
                    scale: 1,
                }}
                transition={{
                    delay: 0,
                    type: "tween",
                }}
            >
                <p className="black-title-lg text-center">
                    {type ? 'Edit post' : 'Add post to sell product'}
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
                <div className="edit-prod-options">
                    {!type ?
                        <button className="btn btn-primary"
                            onClick={(evt) => { evt.preventDefault(); addPost() }}
                        >add</button>
                        : <button className="btn btn-primary" onClick={(evt) => {
                            evt.preventDefault();
                            editPost();
                        }}>update</button>}
                    <button className="btn btn-danger" onClick={cancel}>cancel</button>
                </div>
            </motion.form>
        </div>
    )
}

export default EditPost