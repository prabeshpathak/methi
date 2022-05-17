import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { login } from "../state/actions";
import api, { setAuthToken } from "../axios";
import "./styles/signin.scss";
import { signInWithGoogle } from "../services/firebase";
import firebase from "firebase/compat/app";

const SignIn = ({ isAuthenticated, login }) => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [formExpanded, setFormExpanded] = useState(false);
  const [formModeLogin, setFormModeLogin] = useState(true);
  const [loader, setLoader] = useState(false);
  const [disabled, setDisabled] = useState(false);

  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      const { displayName, email } = user;
      setEmail(email);
      setFullName(displayName);
    } else {
      <Redirect to="/signin" />;
    }
  });

  if (isAuthenticated) return <Redirect to="/home" />;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formExpanded && email.length !== 0) return setFormExpanded(true);
    if (email.length === 0 || password.length === 0) return;
    try {
      setLoader(true);
      setDisabled(true);
      const route = `auth/${formModeLogin ? "login" : "register"}`;
      const { data } = await api.post(route, { email, password, fullName });
      localStorage.setItem("token", data.token);
      setAuthToken(data.token);
      login(data.user);
    } catch (error) {
      if (error.response) console.log(error.response.data);
      else console.log(error);
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
    <div className="signin">
      <h1>
        <i className="fa fa-exclamation-triangle" aria-hidden="true"></i> METHI
      </h1>
      <form onSubmit={handleSubmit}>
        <h5>
          {formModeLogin ? "Log in to your account" : "Create a new account"}
        </h5>
        <input
          className="form-control"
          type="text"
          disabled={disabled}
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        {!formModeLogin && (
          <input
            className="form-control"
            type="text"
            disabled={disabled}
            autoComplete="full-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full name"
          />
        )}
        {formExpanded && (
          <input
            className={`form-control ${formExpanded && "signin__expandable"}`}
            type="password"
            disabled={disabled}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        )}
        <button className="btn signin__submit" type="submit">
          {getBtnText()}
        </button>

        <button
          onClick={() => setFormModeLogin(!formModeLogin)}
          type="button"
          disabled={disabled}
          className="btn btn-link"
        >
          {formModeLogin
            ? "Sign up for an account"
            : "Already have an Methi account? Log in"}
        </button>
        <div className="login-buttons">
          <button className="login-provider-button" onClick={signInWithGoogle}>
            <img
              src="https://img.icons8.com/ios-filled/50/000000/google-logo.png"
              alt="google icon"
            />
            <span> Continue with Google</span>
          </button>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.reducer.isAuthenticated,
});

export default connect(mapStateToProps, { login })(SignIn);
