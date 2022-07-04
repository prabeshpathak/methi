import React from "react";
import video from "../assets/team.mp4";
import { Link } from "react-router-dom";
// component for the about page
const About = () => {
  return (
    <section class="showcase">
      <video src={video} autoPlay loop muted />
      <div class="overlay"></div>
      <div class="text" style={{ color: "white" }}>
        <h2>The Team Cult</h2>
        <h3>We are there for the team</h3>
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

export default About;
