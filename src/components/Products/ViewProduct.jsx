import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import "./ViewProduct.css";

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:3005/products/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        message.error("Failed to load product");
      }
    };

    loadProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
  <div className="view-wrapper">
    <div className="view-card">
      <h2>Product Details</h2>

      <img
        src={product.image}
        alt={product.name}
        className="view-image"
      />

      <p className="view-text"><strong>Name:</strong> {product.name}</p>
      <p className="view-text"><strong>Category:</strong> {product.category}</p>
      <p className="view-text"><strong>Type:</strong> {product.type}</p>
      <p className="view-text"><strong>Price:</strong> ₹{product.price}</p>

      <div className="view-buttons">
        <Button type="primary" onClick={() => navigate(`/products/edit/${id}`)}>
          Edit
        </Button>
        <Button onClick={() => navigate("/products")}>
          Back
        </Button>
      </div>
    </div>
  </div>
);

};

export default ViewProduct;
