import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import api from "../axios";
import Sidebar from "./Sidebar";
import { setNotification } from "../state/actions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

async function fetchData(id) {
  const data = {};
  let response;
  response = await api.get(`/sprints/project/${id}`);
  data.sprints = response.data;
  response = await api.get(`/projects/${id}`);
  data.project = response.data;
  return data;
}

const Backlog = ({
  match,
  issueCreatedDone,
  created,
  user,
  setNotification,
}) => {
  const [project, setProject] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const [isLead, setIsLead] = useState(false);

  useEffect(() => {
    if (user)
      (async function () {
        const data = await fetchData(match.params.id);
        setProject(data.project);
        if (data.project.lead._id === user._id) setIsLead(true);
      })();
  }, [match.params.id, user]);

  const completeSprint = async (sid) => {
    await api.delete(`/sprints/${sid}`);
    setNotification("Sprint completed", "info text-info");
  };

  const getStatusClass = (issueStatus) => {
    switch (issueStatus) {
      case "in progress":
        return "sIssueStatus--inprogress";
      case "done":
        return "sIssueStatus--done";
      default:
        return "sIssueStatus--todo";
    }
  };

  return (
    <div className="outer-container">
      <Sidebar project={project} navigation="backlog" />
      <div className="backlog">
        <div className="issue__nav">
          <Link to="/projects">Projects</Link>
          <span>/</span>
          {project && (
            <Link to={`/projects/boards/${project._id}`}>{project.title}</Link>
          )}
        </div>
        <h2>Backlog</h2>

        {project ? (
          <div
            className={`backlog__bottom ${
              expanded ? "backlog__bottom--expanded" : ""
            }`}
          >
            <div
              className="sprint__header"
              tabIndex="0"
              onClick={() => setExpanded(!expanded)}
            >
              <div className="d-flex align-items-center">
                <i
                  className={`fa fa-angle-${expanded ? "down" : "right"}`}
                  aria-hidden="true"
                ></i>
                <h5 className="ms-2">
                  <strong>Backlog</strong>
                </h5>
                <p className="ms-2">0 issue(s)</p>
              </div>
            </div>

            <div tabIndex="0" className="sprint__create"></div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  created: state.reducer.created,
  user: state.reducer.user,
});

export default connect(mapStateToProps, { setNotification })(Backlog);
