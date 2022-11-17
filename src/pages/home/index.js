import React, { createContext, useEffect, useState } from "react";
import { auth, db } from "../../firebaseconfig";
import { doc, onSnapshot } from "firebase/firestore";

import EditPost from "../../components/home post edit";
import Layout from "../../components/layout";
import Posts from "../../components/posts";

export const postContext = createContext();
function Home() {
  //is editing post
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [id, setId] = useState();

  //getting the user email which was stored at the time of login from local storage
  const [email_current_user] = useState(
    auth.currentUser
      ? auth.currentUser.email
      : localStorage.getItem("auth_user")
  );

  //all details to be edited
  const [name, setName] = useState("");
  const [image, setImage] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"
  ); //default no image preview available image
  const [price, setPrice] = useState(1);
  const [sale_price, setSale_price] = useState(1);
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [categories, setCategories] = useState([]);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    onSnapshot(doc(db, "users", email_current_user), (res) => {
      console.log(res.data());
      if (res.exists()) {
        localStorage.setItem("current_user", JSON.stringify(res.data()));
      } else {
        console.log("not exists");
      }
    });
    fetch_all_categories();
  }, []);

  //clear fileds
  const clear = () => {
    setCategory("");
    setName("");
    setPrice(1);
    setSale_price(1);
    setBrand("");
    setDescription("");
    setImage("https://bit.ly/3x9dBKX");
  };

  //fetching all the categories stored in the firestore
  const fetch_all_categories = () => {
    onSnapshot(doc(db, "categories", "cats"), (snapshot) => {
      setCategories(snapshot.data().categories);
    });
  };

  //fill
  const fill = ({
    name,
    imageURL,
    price,
    sale_price,
    brand,
    category,
    description,
  }) => {
    setName(name);
    setImage(imageURL);
    setPrice(price);
    setSale_price(sale_price ? sale_price : "");
    setBrand(brand);
    setCategory(category);
    setDescription(description);
  };

  const context_to_be_send = {
    name,
    setName,
    price,
    setPrice,
    category,
    setCategory,
    brand,
    setBrand,
    description,
    setDescription,
    sale_price,
    setSale_price,
    isEditing,
    setIsEditing,
    setImage,
    image,
    categories,
    setIsEditingPost,
    isEditingPost,
    id,
    setId,
  };

  return (
    <>
      {isEditing && (
        <postContext.Provider value={context_to_be_send}>
          {" "}
          <EditPost />
        </postContext.Provider>
      )}
      {isEditingPost && (
        <postContext.Provider value={context_to_be_send}>
          {" "}
          <EditPost type="post" />
        </postContext.Provider>
      )}
      <Layout>
        <button
          className="btn btn-primary"
          onClick={() => {
            clear();
            setIsEditing(true);
          }}
        >
          Add post
        </button>
        <Posts
          setId={setId}
          categories={categories}
          name={name}
          brand={brand}
          category={category}
          price={price}
          sale_price={sale_price}
          description={description}
          image={image}
          setIsEditingPost={setIsEditingPost}
          isEditingPost={isEditingPost}
          fill={fill}
        />
      </Layout>
    </>
  );
}

export default Home;
