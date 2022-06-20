import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import api from "../axios";
import Epic from "./Epic";
import Sidebar from "./Sidebar";
import SprintIssueForm from "./SprintIssueForm";
import { issueCreatedDone } from "../state/actions";
import "./styles/_roadmap.scss";

async function fetchData(id) {
  return {
    project: await api.get(`/projects/${id}`),
    issues: await api.get(`/issues/roadmap/${id}`),
  };
}

const Roadmap = ({ match, created, user, issueCreatedDone }) => {
  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [isLead, setIsLead] = useState(false);
  const [createIssue, setCreateIssue] = useState(false);

  useEffect(() => {
    if (user)
      (async function () {
        const response = await fetchData(match.params.id);
        setProject(response.project.data);
        if (response.project.data.lead._id === user._id) setIsLead(true);
        setIssues(response.issues.data);
      })();
  }, [match.params.id, user]);

  useEffect(() => {
    if (created)
      if (
        created.project._id === match.params.id &&
        created.issueType === "Epic"
      ) {
        setIssues((prevIssues) => [...prevIssues, created]);
        issueCreatedDone();
      }
    // eslint-disable-next-line
  }, [created]);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") setCreateIssue(false);
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="outer-container">
      <Sidebar project={project} navigation="roadmap" />
      <div className="roadmap">
        <div className="issue__nav">
          <Link to="/projects">Projects</Link>
          <span>/</span>
          {project && (
            <Link to={`/projects/boards/${project._id}`}>{project.title}</Link>
          )}
        </div>
        <h2>Roadmap</h2>
        <div className="roadmap__container">
          <h3 className="header">Epic</h3>
          <div className="roadmap__issues">
            {issues.map((i) => (
              <Epic isLead={isLead} key={i._id} epic={i} />
            ))}
          </div>
          <div tabIndex="0" className="sprint__create">
            {isLead &&
              (createIssue ? (
                <SprintIssueForm
                  setCreateIssue={setCreateIssue}
                  forBacklog={project._id}
                  issueType="Epic"
                />
              ) : (
                <h6 onClick={() => setCreateIssue(true)}>+ Create Epic</h6>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  created: state.reducer.created,
  user: state.reducer.user,
});

export default connect(mapStateToProps, { issueCreatedDone })(Roadmap);
