import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { login } from "../state/actions";
import api, { setAuthToken } from "../axios";
import { gapi } from "gapi-script";
import "./styles/_signin.scss";

import { GoogleLogin } from "react-google-login";

const SignIn = ({ isAuthenticated, login }) => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [formExpanded, setFormExpanded] = useState(false);
  const [formModeLogin, setFormModeLogin] = useState(true);
  const [loader, setLoader] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        scope: "email",
      });
    }

    gapi.load("client:auth2", start);
  }, []);

  const responseGoogleSuccess = async (response) => {
    try {
      const { data } = await api.post("/signin/googlelogin", {
        idToken: response.tokenId,
      });
      localStorage.setItem("token", data.token);
      setAuthToken(data.token);
      login(data.user);
    } catch (e) {
      console.log(e);
    }
  };
  const responseGoogleError = (response) => {
    console.log(response);
  };

  if (isAuthenticated) return <Redirect to="/home" />;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formExpanded && email.length !== 0) return setFormExpanded(true);
    if (email.length === 0 || password.length === 0) return;
    try {
      setLoader(true);
      setDisabled(true);
      const route = `/signin/${formModeLogin ? "login" : "register"}`;
      const { data } = await api.post(route, { email, password, fullName });
      localStorage.setItem("token", data.token);
      setAuthToken(data.token);

      login(data.user);
    } catch (error) {
      console.log(error);
      setLoader(false);
      setDisabled(false);
    }
  };

  const getBtnText = () => {
    if (loader)
      return <i className="fa fa-circle-o-notch" aria-hidden="true"></i>;
    if (formExpanded)
      if (formModeLogin) return "Log in";
      else return "Sign up";
    else return "Continue";
  };
  return (
    <div className="signin" id="signIn">
      <h1>
        <i className="fa fa-exclamation-triangle" aria-hidden="true"></i> METHI
      </h1>
      <div className="signin__form">
        <img src={`${process.env.PUBLIC_URL}/landing.PNG`} alt="" />
        <form onSubmit={handleSubmit}>
          <h5>
            {formModeLogin ? "Log in to your account" : "Create a new account"}
          </h5>
          <input
            name="email"
            className="form-control"
            type="text"
            disabled={disabled}
            autoComplete="email"
            value={email.email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            id="email"
          />
          {!formModeLogin && (
            <input
              name="fullName"
              className="form-control"
              type="text"
              disabled={disabled}
              autoComplete="full-name"
              value={fullName.fullname}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full name"
              id="fullName"
            />
          )}
          {formExpanded && (
            <input
              className={`form-control ${formExpanded && "signin__expandable"}`}
              type="password"
              name="password"
              disabled={disabled}
              autoComplete="current-password"
              defaultValue={password.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              id="password"
            />
          )}
          <button className="btn signin__submit" type="submit" id="continue">
            {getBtnText()}
          </button>
          <button
            onClick={() => setFormModeLogin(!formModeLogin)}
            type="button"
            disabled={disabled}
            className="btn btn-link"
            id="signUpLink"
          >
            {formModeLogin
              ? "Sign up for an account"
              : "Already have an Methi account? Log in"}
          </button>
          <>
            <br />
            Or
            <hr />
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              buttonText={`${
                !formModeLogin ? "Register with Google" : "Login with google"
              }`}
              onSuccess={responseGoogleSuccess}
              onFailure={responseGoogleError}
              cookiePolicy={"single_host_origin"}
            />
          </>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.reducer.isAuthenticated,
});

export default connect(mapStateToProps, { login })(SignIn);
