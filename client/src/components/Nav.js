import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../state/actions";

async function fetchData(lead) {
	return 'fetching data';
}

const Nav = ({ isAuthenticated, logout, setFormOpen, loading, user, navModals, setNavModals }) => {
	const [projects, setProjects] = useState([]);
	const [teams, setTeams] = useState([]);

	useEffect(() => {
		if (!loading && user)
			(async () => {
				try {
					const response = await fetchData(user._id);
					setProjects(response.projects.data);
					setTeams(response.teams.data)
				} catch (error) {
					console.log(error.response);
				}
			})();
	}, [loading, user]);

	useEffect(() => {
		function handleEscape(e) {
			if (e.key === "Escape")
				setNavModals({ projects: false, teams: false })
		}
		window.addEventListener("keydown", handleEscape)
		return () => window.removeEventListener("keydown", handleEscape)
		// eslint-disable-next-line
	}, [])

	return (
		<nav onClick={() => { setNavModals({ projects: false, teams: false }); setFormOpen(false) }} className="nav">
			<div className="container">
				<div className="d-flex align-items-center">
					<Link to="/">
						<div>
							<div className="nav__logo">
								<h2>Methi</h2>
							</div>
						</div>
					</Link>
					
				</div>
				<div>
					{isAuthenticated ? (
						<>
							<Link to="/profile" className="btn btn-sm btn-outline-info me-2">
								Profile
							</Link>
							<button onClick={logout} className="btn btn-sm btn-outline-danger">
								Log out
							</button>
						</>
					) : (
						<Link to="/signin" className="btn btn-sm btn-outline-primary">
							Get it free
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.reducer.isAuthenticated,
	loading: state.reducer.loading,
	user: state.reducer.user
});

export default connect(mapStateToProps, { logout })(Nav);