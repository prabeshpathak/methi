import React from "react";
import { Redirect, Route } from "react-router-dom";
import { connect } from "react-redux";

const PrivateRoute = ({
  isAuthenticated,
  loading,
  component: Component,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) => {
      if (!loading)
        return isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/signin" />
        );
    }}
  />
);

const mapStateToProps = (state) => ({
  isAuthenticated: state.reducer.isAuthenticated,
  loading: state.reducer.loading,
});

export default connect(mapStateToProps)(PrivateRoute);
