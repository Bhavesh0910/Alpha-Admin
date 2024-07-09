import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { connect } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PrivateRoutes = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  useEffect(() => {
   
    if (!isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated]);
  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" />;
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(PrivateRoutes);
