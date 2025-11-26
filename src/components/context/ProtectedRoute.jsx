import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { Spin } from "antd";

const ProtectedRoute = ({ children , role}) => {
  const { user, loading } = useContext(AuthContext);

  if (loading)
    return (
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
    );

  if (!user) return <Navigate to="/login" replace />;

  if(role && user.role !== role) {
      return <Navigate to="/" replace/> ;
  }

  return children;
};

export default ProtectedRoute;
