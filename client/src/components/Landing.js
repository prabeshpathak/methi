import React from "react";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import video from "../assets/video.mp4";
import { Link } from "react-router-dom";
const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) return <Redirect to="/home" />;
  return (
    <section class="showcase">
      <video src={video} autoPlay loop muted />
      <div class="overlay"></div>
      <div class="text">
        <h2>Plans are worthless </h2>
        <h3>Planning is essential</h3>
        <p>
          Remember teamwork begins by building trust. And the only way to do
          that is to overcome our need for invulnerability. We are here to help.
          Sign up to get started.
        </p>
        <Link to="/signin">
          <span className="link-text">Account</span>
        </Link>
      </div>
    </section>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.reducer.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);
