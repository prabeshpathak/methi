import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import api from "../axios";
import CreateSprint from "./CreateSprint";
import Sidebar from "./Sidebar";
import Sprint from "./Sprint";
import { issueCreatedDone, setNotification } from "../state/actions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Icon from "./svg/Icon";
import SprintIssueForm from "./SprintIssueForm";

async function fetchData(id) {
  const data = {};
  let response = await api.get(`/issues/backlog/${id}`);
  data.issues = response.data;
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
  const [issues, setIssues] = useState(null);
  const [sprints, setSprints] = useState(null);
  const [project, setProject] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const [createIssue, setCreateIssue] = useState(false);
  const [isLead, setIsLead] = useState(false);

  useEffect(() => {
    if (user)
      (async function () {
        const data = await fetchData(match.params.id);
        setIssues(data.issues);
        setSprints(data.sprints);
        setProject(data.project);
        if (data.project.lead._id === user._id) setIsLead(true);
      })();
  }, [match.params.id, user]);

  useEffect(() => {
    if (created)
      if (
        created.project._id === match.params.id &&
        created.issueType !== "Epic"
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

  const completeSprint = async (sid) => {
    await api.delete(`/sprints/${sid}`);
    setSprints(sprints.filter((s) => s._id !== sid));
    setNotification("Sprint completed", "info text-info");
    setIssues(
      issues
        .filter((issue) => issue.sprint !== sid || issue.issueStatus !== "done")
        .map((i) => {
          if (i.sprint === sid) i.sprint = undefined;
          return i;
        })
    );
    window.location.reload();
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

  const backlogIssues = issues?.filter((i) => !i.sprint);

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
        {sprints?.map((s, i) => (
          <Sprint
            key={s._id}
            index={i}
            sprint={s}
            isLead={isLead}
            completeSprint={completeSprint}
            issues={issues.filter((i) => i.sprint === s._id)}
          />
        ))}

        {project && issues && sprints ? (
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
                <p className="ms-2">{backlogIssues?.length} issue(s)</p>
              </div>
              {isLead && (
                <CreateSprint
                  project={project}
                  sprintLength={sprints.length}
                  setSprints={setSprints}
                />
              )}
            </div>
            {backlogIssues.map((i) => (
              <Link
                to={`/issues/${i._id}`}
                className="sprint__issue"
                key={i._id}
              >
                <div className="d-flex align-items-center">
                  <Icon icon={i.issueType} size={16} />
                  <p className="ms-2">{i.summary}</p>
                  {i.epic && <p className="sIssueEpic">{i.epic.summary}</p>}
                </div>
                <div className="d-flex align-items-center">
                  <p
                    className={`sIssueStatus ${getStatusClass(i.issueStatus)}`}
                  >
                    {i.issueStatus}
                  </p>
                  <div className="comment__image ms-2">
                    {i.assignee
                      ? i.assignee.fullName
                          .match(/\b(\w)/g)
                          .join("")
                          .toUpperCase()
                      : "N/A"}
                  </div>
                </div>
              </Link>
            ))}
            <div tabIndex="0" className="sprint__create">
              {isLead &&
                (createIssue ? (
                  <SprintIssueForm
                    setCreateIssue={setCreateIssue}
                    forBacklog={project._id}
                    issueType="story"
                  />
                ) : (
                  <h6 onClick={() => setCreateIssue(true)}>+ Create issue</h6>
                ))}
            </div>
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

export default connect(mapStateToProps, { issueCreatedDone, setNotification })(
  Backlog
);
