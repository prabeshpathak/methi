import React from "react";
import { connect } from "react-redux";
import api, { setAuthToken } from "../axios";
import { login, setNotification } from "../state/actions";

// component for the about page
const About = () => {
  return (
    <div className="about container">
      <p>Hello, this is Team Cults.</p>
    </div>
  );
};

export default connect(null, { login, setNotification })(About);
