import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../AxiosInstance/Api";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

   const fetchUser = async () => {
      try {
        const res = await api.get("/users/profile");
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false); 
      }
    };

    useEffect(() => {
      fetchUser()
    },[]);

  const signUp = async (values) => {
    try {
      const res = await api.post("/users/signup", values);
      console.log("Signup success", res.data);
      setUser(res.data.user);
      navigate("/");
    } catch (error) {
      console.log("Signup failed", error.message);
    }
  };

  console.log({ user });

  const login = async (values) => {
    try {
      const res = await api.post("/users/login", values);
      console.log("login succcess", res.data);
      setUser(res.data.user);
      navigate("/");
    } catch (error) {
      console.error("Login failed", error.message);
    }
  };

  const logout = async () => {
  try {
    await api.post("/users/logout", {});
    setUser(null);
    setCart([]);
    navigate("/login");
  } catch (error) {
    console.error("Failed to logout");
  }
};

 return (
    <AuthContext.Provider value={{ user, loading, signUp, login, logout }}>
      {loading ? (
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin size="large" />  
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
