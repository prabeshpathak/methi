import React from "react";
import { Redirect } from "react-router";
import { connect } from "react-redux";

const Landing = ({ isAuthenticated }) => {
	if (isAuthenticated) return <Redirect to="/home" />;
	return (
		<div className="landing container">
			<h1>The #1 software development tool used by agile teams</h1>
			<img src={`${process.env.PUBLIC_URL}/landing.png`} alt="" />
		</div>
	);
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.reducer.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);
