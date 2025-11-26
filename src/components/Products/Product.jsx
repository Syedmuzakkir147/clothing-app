import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, Button, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import "./Product.css";

const Product = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    name: "",
    category: "",
    type: "",
    price: "",
    image: ""
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id) {
          const res = await axios.get(`http://localhost:3005/products/${id}`);
          setProductData(res.data.product);
        }
      } catch (err) {
        message.error("Failed to load product");
      }
    };

    fetchProduct();
  }, [id]);

  const handleSave = async () => {
    try {
      if (id) {
        await axios.put(`http://localhost:3005/products/${id}`, productData);
        message.success("Product updated");
      } else {
        await axios.post("http://localhost:3005/products/create", productData);
        message.success("Product created");
      }

      navigate("/products");
    } catch (err) {
      message.error("Failed to save product");
    }
  };

  return (
    <div className="product-container">
      <h2>{id ? "Edit Product" : "Create Product"}</h2>

      <Input
        className="product-input"
        placeholder="Product Name"
        value={productData.name}
        onChange={(e) => setProductData({ ...productData, name: e.target.value })}
        style={{ marginBottom: 10 }}
      />

      <Input
        className="product-input"
        placeholder="Category"
        value={productData.category}
        onChange={(e) => setProductData({ ...productData, category: e.target.value })}
        style={{ marginBottom: 10 }}
      />

      <Input
        className="product-input"
        placeholder="Type"
        value={productData.type}
        onChange={(e) => setProductData({ ...productData, type: e.target.value })}
        style={{ marginBottom: 10 }}
      />

      <Input
        className="product-input"
        placeholder="Price"
        value={productData.price}
        onChange={(e) => setProductData({ ...productData, price: e.target.value })}
        style={{ marginBottom: 10 }}
      />

      <Input
        className="product-input"
        placeholder="Image URL"
        value={productData.image}
        onChange={(e) => setProductData({ ...productData, image: e.target.value })}
        style={{ marginBottom: 10 }}
      />

      <Button className="product-button" type="primary" onClick={handleSave}>
        {id ? "Update" : "Create"}
      </Button>
    </div>
  );
};

export default Product;
