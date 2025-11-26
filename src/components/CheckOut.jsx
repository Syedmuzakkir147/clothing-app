import React, { useContext } from "react";
import { Button, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { CartContext } from "./context/CartContext";
import "./CheckOut.css";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(CartContext);

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="checkout-page">
      <Card>
        <h1>🛍️ Checkout</h1>

        <div className="summary">
          <p>Total Items: <strong>{cart.length}</strong></p>
          <p >Total Price: <strong style={{ marginTop: 20, fontSize: 30, color: "#1677ff" }}>₹{total}</strong></p>
        </div>

        <Button type="primary" className="place-order" onClick={clearCart}>
          Place Order
        </Button>

        <p className="thank-you">Thank you for shopping with FlopKart!</p>
        <p className="note">Proceed with payment and delivery details below.</p>

        <Button type="default" className="back-home" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Card>
    </div>
  );
};

export default Checkout;
