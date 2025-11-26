import React, { useState, useContext, useMemo, useEffect } from "react";
import { Modal, Button, Select, Drawer, Card, Row, Col } from "antd";
import { SearchOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CartContext } from "./context/CartContext";
import { AuthContext } from "./context/AuthContext";
import "./Homepage.css";
import axios from "axios";

const HomePage = () => {
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const [options, setOptions] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const { cart, addCart, removeCart, updateCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);

  const { logout } = useContext(AuthContext);
  const { user } = useContext(AuthContext);

  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3005/products", {
        params: { search: search || undefined },
      });
      console.log(res);
      setProducts(res.data.product);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (type === "All" || p.type === type)
    );
  }, [category, type, products, search]);

  const handleAddToCart = async (product) => {
    await addCart(product);

    // setIsModalOpen(false);
  };

  const handleSearch = async (value) => {
    if (!value) {
      setOptions([]);
      setSearchParams({});
      return;
    }

    try {
      const res = await axios.get("http://localhost:3005/products", {
        params: { search: value },
      });
      const suggestions = res.data.product.map((item) => ({
        value: item.name,
      }));
      setOptions(suggestions);
    } catch (error) {
      console.log("Error fetching suggestions", error);
    }
    setSearchParams({ search: value });
  };

  const handleSelect = (value) => {
    setSearchParams({ search: value });
  };

  const { Option } = Select;

  return (
    <div className="home">
      <div className="navbar">
        <div>
          <h2 className="logo">FlopKart</h2>
          <p className="tagline">Shop, Drop, Flop… Repeat!</p>
        </div>

        <div className="navbar-right">
          <Select
            showSearch
            placeholder="Search for products "
            value={search || undefined}
            onSearch={handleSearch}
            onSelect={handleSelect}
            options={options}
            style={{
              width: 400,
              borderRadius: "25px",
            }}
            className="search-bar"
            suffixIcon={<SearchOutlined style={{ fontSize: 18 }} />}
          />

          <Button type="primary" onClick={() => setIsDrawerOpen(true)}>
            🛒 Cart ({cart.length})
          </Button>

          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={() => setLogoutModalOpen(true)}
          ></Button>

          <Modal
            title="Confirm Logout"
            open={logoutModalOpen}
            onOk={logout}
            onCancel={() => setLogoutModalOpen(false)}
            okText="Yes, Logout"
            cancelText="Cancel"
            okType="danger"
            centered
          >
            Are you sure you want to log out?
          </Modal>
        </div>
      </div>

      <div className="filters">
        {user?.role === "admin" && (
          <Button onClick={() => navigate("/products")}>Product</Button>
        )}

        <Select value={category} onChange={setCategory} style={{ width: 160 }}>
          <Option value="All">All Categories</Option>
          <Option value="Men">Men</Option>
          <Option value="Women">Women</Option>
          <Option value="Kids">Kids</Option>
        </Select>

        <Select value={type} onChange={setType} style={{ width: 160 }}>
          <Option value="All">All Types</Option>
          <Option value="Tshirt">Tshirt</Option>
          <Option value="Shirt">Shirt</Option>
          <Option value="Pant">Pant</Option>
          <Option value="Hoodie">Hoodie</Option>
        </Select>
      </div>

      <Row gutter={[20, 20]} className="product-grid">
        {filteredProducts.map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
            <Card
              hoverable
              style={{
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}
              cover={
                <img
                  alt={product.name}
                  src={product.image}
                  onClick={() => navigate(`/product/${product._id}`)}
                  style={{
                    height: 230,
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              }
            >
              <h3 style={{ marginBottom: 5 }}>{product.name}</h3>

              <p style={{ color: "gray", marginBottom: 15, fontSize: 15 }}>
                ₹{product.price}
              </p>

              <div style={{ display: "flex", gap: 10 }}>
                {/* <Button
                  type="default"
                  block
                  onClick={() => navigate(`/details/${product._id}`)}
                >
                  View
                </Button> */}

                <Button
                  type="primary"
                  block
                  onClick={() => handleAddToCart(product)}
                >
                  Add
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Drawer
        title="Your Cart"
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={380}
      >
        {!cart.length ? (
          <p>No items in cart</p>
        ) : (
          <div>
            {cart.map((item) => (
              <div
                key={item.productId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 20,
                  padding: 10,
                  borderRadius: 8,
                  background: "#fafafa",
                  border: "1px solid #eee",
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 8,
                    objectFit: "cover",
                    marginRight: 15,
                  }}
                />

                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0 }}>{item.name}</h4>
                  <p style={{ margin: "5px 0", color: "#666" }}>
                    ₹{item.price}
                  </p>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Button
                      size="small"
                      onClick={() =>
                        updateCart(item.productId, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
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
                </div>

                <Button
                  danger
                  size="small"
                  onClick={() => removeCart(item.productId)}
                  style={{ marginLeft: 10 }}
                >
                  Remove
                </Button>
              </div>
            ))}

            <div
              style={{
                borderTop: "1px solid #ddd",
                paddingTop: 15,
                marginTop: 20,
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Total: ₹
              {cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}
            </div>

            <Button
              type="primary"
              block
              style={{ marginTop: 20, height: 45, fontSize: 16 }}
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </Drawer>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3>Available Categories</h3>
            <ul>
              <li>Men</li>
              <li>Women</li>
              <li>Kids</li>
              <li>Accessories</li>
              <li>Footwear</li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Available Types</h3>
            <ul>
              <li>T-Shirts</li>
              <li>Shirts</li>
              <li>Jeans</li>
              <li>Dresses</li>
              <li>Jackets</li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>About FlopKart</h3>
            <p>
              FlopKart is your one-stop shop for trendy fashion at unbeatable
              prices. Shop smart, look sharp, and save big!
            </p>
            <p>
              © {new Date().getFullYear()} FlopKart — Built by Syed Muzakkir
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
