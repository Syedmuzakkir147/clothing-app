import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const getProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3005/products");
      setProducts(res.data.product);
    } catch (err) {
      message.error("Failed to load products");
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3005/products/${id}`);
      message.success("Product deleted");
      getProducts();
    } catch (err) {
      message.error("Failed to delete");
    }
  };

  return (
    <div>
      <h2>Products</h2>

      <div style={{ display: "flex", gap: "12px" }}>
        <Button type="primary" onClick={() => navigate("/products/create")}>
          + Add Product
        </Button>

        <Button type="dashed" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </div>

      {products.map((p) => (
        <div
          key={p._id}
          style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}
        >
          <h3>{p.name}</h3>
          <p>₹{p.price}</p>

          <Button onClick={() => navigate(`/products/${p._id}`)}>View</Button>
          <Button onClick={() => navigate(`/products/edit/${p._id}`)}>
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(p._id)}>
            Delete
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
