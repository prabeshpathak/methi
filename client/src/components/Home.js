import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../axios";
import { ProjectsLoader } from "./ProjectsLoader";
import { connect } from "react-redux";
import "././styles/_home.scss";

async function fetchData() {
  const data = {};
  let response = await api.get("/projects");
  data.projects = response.data;
  return data;
}

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await fetchData();
      setProjects(data.projects);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="home container">
      <h2>Your work</h2>
      <h4 className="home__label">Recent projects</h4>
      <div className="home__projects">
        {loading ? (
          <ProjectsLoader type="projects" />
        ) : (
          projects.map((p) => (
            <Link
              className="home__project"
              key={p._id}
              to={`/projects/boards/${p._id}`}
            >
              <h4>{p.title}</h4>
              <p>Team managed software</p>
            </Link>
          ))
        )}
      </div>
      <h4>Assigned to me</h4>
      <div className="home__assigned"></div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  created: state.reducer.created,
  user: state.reducer.user,
});

export default connect(mapStateToProps)(Home);
