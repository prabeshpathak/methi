import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { login } from "../state/actions";
import api, { setAuthToken } from "../axios";
import "./styles/_signin.scss";
import { signInWithGoogle } from "../services/firebase";
import firebase from "firebase/compat/app";
import { setNotification } from "../state/actions";

const SignIn = ({ isAuthenticated, login, setNotification }) => {
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
      <Redirect to="/register" />;
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
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.reducer.isAuthenticated,
});

export default connect(mapStateToProps, { login })(SignIn);
