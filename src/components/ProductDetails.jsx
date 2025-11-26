import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Button, Drawer, message, Card, Row, Col, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { CartContext } from "./context/CartContext";
import "./Homepage.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { cart, addCart, removeCart, updateCart } = useContext(CartContext);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3005/products/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        message.error("Failed to load product");
      }
      setLoading(false);
    };

    loadProduct();
  }, [id]);

  if (loading || !product) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <div className="navbar">
        <div>
          <h2 className="logo">FlopKart</h2>
          <p className="tagline">Shop, Drop, Flop… Repeat!</p>
        </div>

        <div>
          <Button type="primary" onClick={() => setIsDrawerOpen(true)}>
            🛒 Cart ({cart.length})
          </Button>
        </div>
      </div>

      <Card
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", gap: 40, justifyContent: "center" }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: 350,
              height: 350,
              objectFit: "cover",
              borderRadius: 10,
            }}
          />

          <div>
            <h1 style={{ marginBottom: 10 }}>{product.name}</h1>
            <p style={{ fontSize: 16 }}>Category: {product.category}</p>
            <p style={{ fontSize: 16 }}>Type: {product.type}</p>

            <h2 style={{ marginTop: 20, fontSize: 30, color: "#1677ff" }}>
              ₹{product.price}
            </h2>

            <div style={{ marginTop: 20 }}>
              <Button
                type="primary"
                size="large"
                onClick={() => addCart(product)}
              >
                Add To Cart
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Drawer
        title="Your Cart"
        placement="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        {!cart.length ? (
          <p>No items in cart</p>
        ) : (
          <>
            {cart.map((item) => (
              <div
                key={item.productId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 20,
                  padding: 5,
                  borderRadius: 8,
                  background: "#fafafa",
                  border: "1px solid #eee",
                }}
              >
                <img src={item.image} style={{
                    width: 70,
                    height: 70,
                    borderRadius: 8,
                    marginRight: 15,
                  }} 
                />

                <div style={{ marginLeft: 10, flex: 1 }}>
                  <h4>{item.name}</h4>
                  <p>₹{item.price}</p>

                  <Button
                    size="small"
                    onClick={() =>
                      updateCart(item.productId, item.quantity - 1)
                    }
                  >
                    -
                  </Button>

                  <span style={{ margin: "0 10px" }}>{item.quantity}</span>

                  <Button
                    size="small"
                    onClick={() =>
                      updateCart(item.productId, item.quantity + 1)
                    }
                  >
                    +
                  </Button>
                </div>

                <Button
                  danger
                  size="small"
                  onClick={() => removeCart(item.productId)}
                >
                  X
                </Button>
              </div>
            ))}

            <h3>
              Total: ₹{cart.reduce((a, b) => a + b.price * b.quantity, 0)}
            </h3>

            <Button type="primary" block onClick={() => navigate("/checkout")}>
              Checkout
            </Button>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default ProductDetails;
