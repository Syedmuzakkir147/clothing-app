import React, { useContext } from "react";
import { Button, Checkbox, Form, Input, Card } from "antd";
import { AuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <Card className="login-card" title="Login">
        <Form onFinish={login}>
          <Form.Item label="Email" name="email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item style={{ textAlign: "center" }}>
            <Button type="primary" htmlType="submit" className="login-btn">
              Login
            </Button>
          </Form.Item>

          <Form.Item>
            New user?
            <a onClick={() => navigate("/signup")}> Create account</a>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
