import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../state/actions";
import './styles/nav.scss';
async function fetchData(lead) {
  return "fetching data";
}

const Nav = ({
  isAuthenticated,
  logout,
  setFormOpen,
  loading,
  user,
  setNavModals,
}) => {
  useEffect(() => {
    if (!loading && user)
      (async () => {
        try {
          console.log(await fetchData(user._id));
        } catch (error) {
          console.log(error.response);
        }
      })();
  }, [loading, user]);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") setNavModals({ projects: false, teams: false });
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [setNavModals]);

  return (
    <nav onClick={() => { setNavModals({ projects: false, teams: false }); setFormOpen(false) }} className="nav">
			<div className="container">
				<div className="d-flex align-items-center">
					<Link to="/">
						<div>
							<div className="nav__logo">
								<img src={`https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80`} alt="logo" />
								<h2>Methi</h2>
							</div>
						</div>
					</Link>
					{isAuthenticated && (
						<div className="nav__auth">
							<button onClick={e => { e.stopPropagation()}} className="btn authBtns">Projects <i className="fa fa-angle-down"></i></button>
							<button
								className="btn btn-primary ms-3"
								onClick={(e) => { e.stopPropagation(); setFormOpen(true) }}
							>
								Create
							</button>
						</div>
					)}
				</div>
				<div>
					<Link to="/about" className="btn btn-sm btn-outline-primary me-2">
						About
					</Link>
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
  user: state.reducer.user,
});

export default connect(mapStateToProps, { logout })(Nav);
