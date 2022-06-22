import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../axios";
import { ProjectsLoader } from "./ProjectsLoader";
import Icon from "./svg/Icon";
import { issueCreatedDone, setNotification } from "../state/actions";
import { connect } from "react-redux";

async function fetchData() {
  const data = {};
  let response = await api.get("/projects");
  data.projects = response.data;
  response = await api.get("/issues");
  data.issues = response.data;
  return data;
}

const Home = ({ created, user, issueCreatedDone, setNotification }) => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await fetchData();
      setProjects(data.projects);
      setIssues(data.issues);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (created)
      if (created.assignee === user._id) {
        setIssues([...issues, created]);
        issueCreatedDone();
      }
    // eslint-disable-next-line
  }, [created]);

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
      <div className="home__assigned">
        {loading ? (
          <ProjectsLoader type="issues" />
        ) : (
          issues.map((i) => (
            <Link to={`/issues/${i._id}`} key={i._id}>
              <Icon size={24} icon={i.issueType} />
              <div>
                <p>
                  <b>{i.summary}</b>
                </p>
                <p>{i.project.title}</p>
              </div>
              <p style={{ textTransform: "capitalize" }}>{i.issueStatus}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  created: state.reducer.created,
  user: state.reducer.user,
});

export default connect(mapStateToProps, { issueCreatedDone, setNotification })(
  Home
);
