import React from "react";
import { connect } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoutes = ({ isAuthenticated }) => {
    if (!isAuthenticated) {
        return <Outlet />;
    } else {
        return <Navigate to="/" />;
    }
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(PublicRoutes);
