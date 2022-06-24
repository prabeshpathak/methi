import React from "react";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import videoBg from "../video.mp4"

const Landing = ({ isAuthenticated }) => {
	if (isAuthenticated) return <Redirect to="/home" />;
	return (
	    <div className='main'>
        <div className="overlay"></div>
        <video src={videoBg} autoPlay loop muted />
        <div className="content">
            <h1>Welcome</h1>
            <p>To my site.</p>
        </div>
    </div>
	);
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.reducer.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);
