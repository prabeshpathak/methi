import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../state/actions";
import "./styles/nav.scss";

async function fetchData(lead) {
  return "fetching data";
}

const Nav = ({
  isAuthenticated,
  logout,
  setFormOpen,
  loading,
  user,
  navModals,
  setNavModals,
  created,
}) => {
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    if (!loading && user)
      (async () => {
        try {
          const response = await fetchData(user._id);
          setProjects(response.projects.data);
          setTeams(response.teams.data);
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
    // eslint-disable-next-line
  }, []);

  return (
    <nav
      onClick={() => {
        setNavModals({ projects: false, teams: false });
        setFormOpen(false);
      }}
      className="nav"
    >
      <div className="container">
        <div className="d-flex align-items-center">
          <Link to="/">
            <div>
              <div className="nav__logo">
                <img
                  src={`https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80`}
                  alt="logo"
                />
                <h2>Methi</h2>
              </div>
            </div>
          </Link>
          {isAuthenticated && (
            <div className="nav__auth">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNavModals({ projects: !navModals.projects, teams: false });
                }}
                className="btn authBtns"
              >
                Projects <i className="fa fa-angle-down"></i>
              </button>
              {navModals.projects && (
                <div className="authBtns__modal">
                  <h6 className="p-2 m-0 text-secondary">RECENT</h6>
                  {projects.map((p) => (
                    <Link
                      className="links"
                      key={p._id}
                      to={`/projects/boards/${p._id}`}
                    >
                      <h5>{`${p.title} (${p.key})`}</h5>
                      <h6>Software project</h6>
                    </Link>
                  ))}
                  <Link className="createProjectBtn" to="/projects/create">
                    Create project
                  </Link>
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNavModals({ projects: false, teams: !navModals.teams });
                }}
                className="btn authBtns"
              >
                People <i className="fa fa-angle-down"></i>
              </button>
              {navModals.teams && (
                <div className="authBtns__modal authBtns__modal--people">
                  <h6 className="p-2 m-0 text-secondary">YOUR TEAMS</h6>
                  {teams.map((t) => (
                    <Link className="links" key={t._id} to={`/teams/${t._id}`}>
                      <i className="fa fa-users" aria-hidden="true"></i>
                      <h5 className="ms-2">{t.title}</h5>
                    </Link>
                  ))}
                  <Link className="createProjectBtn" to="/teams/create">
                    <i className="fa fa-plus me-2" aria-hidden="true"></i> Start
                    a team
                  </Link>
                </div>
              )}
              <button
                className="btn btn-primary ms-3"
                onClick={(e) => {
                  e.stopPropagation();
                  setFormOpen(true);
                }}
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
              <button
                onClick={logout}
                className="btn btn-sm btn-outline-danger"
              >
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
  created: state.reducer.created,
  user: state.reducer.user,
});

export default connect(mapStateToProps, { logout })(Nav);
