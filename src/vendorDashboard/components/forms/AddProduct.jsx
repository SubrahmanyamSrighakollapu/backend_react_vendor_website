import React, { useState } from "react";
import { API_URL } from "../../data/apiPath";
import { ThreeCircles } from "react-loader-spinner";

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    if (category.includes(value)) {
      setCategory(category.filter((item) => item !== value));
    } else {
      setCategory([...category, value]);
    }
  };

  const handleBestSeller = (event) => {
    const value = event.target.value === "true";
    setBestSeller(value);
  };
  const handleImageUpload = (event) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const loginToken = localStorage.getItem("loginToken");
      const firmId = localStorage.getItem("firmId");

      if (!loginToken || !firmId) {
        console.error("user not authenticated");
      }

      const formData = new FormData();
      formData.append("productName", productName);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("bestSeller", bestSeller);
      formData.append("image", image);

      category.forEach((value) => {
        formData.append("category", value);
      });

      const response = await fetch(`${API_URL}/product/add-product/${firmId}`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        alert("Product added succesfully");
      }
      setProductName("");
      setPrice("");
      setCategory([]);
      setBestSeller(false);
      setImage(null);
      setDescription("");
    } catch (error) {
      alert("Failed to add Product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-start pt-16 px-4">
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <ThreeCircles
            visible={loading}
            height={100}
            width={100}
            color="#4fa94d"
            ariaLabel="three-circles-loading"
          />
          <p className="text-gray-600 text-lg">
            Please wait, your product is being added...
          </p>
        </div>
      ) : (
        <form
          className="w-full max-w-3xl lg:max-w-3xl bg-white shadow-xl rounded-2xl p-8 flex flex-col gap-4 border border-gray-200"
          onSubmit={handleAddProduct}
          encType="multipart/form-data"
        >
          <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
            Add Product
          </h2>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">Price</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold">Category</label>
            <div className="flex flex-wrap gap-4">
              {["veg", "non-veg"].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={item}
                    checked={category.includes(item)}
                    onChange={handleCategoryChange}
                    className="accent-blue-600"
                  />
                  {item.toUpperCase()}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold">Best Seller</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="true"
                  checked={bestSeller === true}
                  onChange={handleBestSeller}
                  className="accent-blue-600"
                />
                Yes
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="false"
                  checked={bestSeller === false}
                  onChange={handleBestSeller}
                  className="accent-blue-600"
                />
                No
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">Firm Image</label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="border border-gray-300 rounded px-2 py-1"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-50 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddProduct;
