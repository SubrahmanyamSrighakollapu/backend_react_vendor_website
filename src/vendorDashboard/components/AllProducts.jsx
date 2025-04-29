import React, { useState, useEffect } from "react";
import { API_URL } from "../data/apiPath";

const AllProducts = () => {
  const [products, setProducts] = useState([]);

  const productsHandler = async () => {
    const firmId = localStorage.getItem("firmId");
    try {
      const response = await fetch(`${API_URL}/product/${firmId}/products`);
      const newProductsData = await response.json();
      setProducts(newProductsData.products);
      console.log(newProductsData);
    } catch (error) {
      console.error("failed to fetch products", error);
      alert("failed to fetch products");
    }
  };

  useEffect(() => {
    productsHandler();
    console.log("this is useEffect");
  }, []);

  const deleteProductById = async (productId) => {
    try {
      const userConfirmed = confirm("Are you sure you want to delete?");
      if (!userConfirmed) {
        // User clicked "Cancel"
        return;
      }

      // Proceed to delete the product
      const response = await fetch(`${API_URL}/product/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter((product) => product._id !== productId));
        alert("Product deleted successfully");
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Failed to delete product", error);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="w-full min-h-screen px-4 py-8 lg:ml-20 mb-20">
      {!products || products.length === 0 ? (
        <p className="text-center text-lg text-gray-600">
          No products found! Your customers are waiting — add some tasty items
          to your menu
        </p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-2xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-indigo-700 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {item.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    ₹{item.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.image && (
                      <img
                        src={`${API_URL}/uploads/${item.image}`}
                        alt={item.productName}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => deleteProductById(item._id)}
                      className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
