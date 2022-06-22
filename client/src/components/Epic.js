import React, { useEffect } from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import SprintIssueForm from "./SprintIssueForm";
import Icon from "./svg/Icon";
import { issueCreatedDone } from "../state/actions";
import { useRef } from "react";

const Epic = ({ epic, isLead, created, issueCreatedDone }) => {
  const { _id, summary, issues: Issues, project } = epic;
  const [issues, setIssues] = useState(Issues ?? []);
  const [expanded, setExpanded] = useState(false);
  const [createIssue, setCreateIssue] = useState(false);
  const [focus, setFocus] = useState(false);
  const formRef = useRef();

  useEffect(() => {
    if (created)
      if (created.project._id === project && created.epic === _id) {
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

  useEffect(() => {
    formRef.current?.focus();
  }, [formRef, focus]);

  const getDoneIssues = () => {
    let done = 0;
    for (let i = 0; i < issues.length; i++)
      if (issues[i].issueStatus === "done") done++;
    return done === 0 ? 0 : Math.floor((done * 100) / issues.length);
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
    <div className="epic">
      <div className="epic__header">
        <i
          onClick={() => setExpanded(!expanded)}
          className={`fa fa-2x me-2 fa-angle-${expanded ? "down" : "right"}`}
          aria-hidden="true"
        ></i>
        <Link to={`/issues/${_id}`}>
          <Icon size={28} icon="epic" />
          <div className="progress-container ms-2">
            <h3>{summary}</h3>
            {getDoneIssues() > 0 && (
              <div className="progress-bar">
                <div
                  style={{ width: `${getDoneIssues()}%` }}
                  className="progress-bar__inner"
                ></div>
              </div>
            )}
          </div>
        </Link>
        {isLead && (
          <div className="epic__btn">
            <button
              onClick={() => {
                setExpanded(true);
                setFocus(!focus);
                setCreateIssue(true);
              }}
              className="btn btn-secondary btn-sm"
            >
              <i className="fa fa-plus" aria-hidden="true"></i>
            </button>
          </div>
        )}
      </div>
      <div className="epic__issues">
        {expanded &&
          issues?.map((i) => (
            <Link to={`/issues/${i._id}`} key={i._id}>
              <div className="d-flex align-items-center">
                <Icon size={18} icon={i.issueType} />
                <p>{i.summary}</p>
              </div>
              <div className="d-flex align-items-center">
                <p className={`sIssueStatus ${getStatusClass(i.issueStatus)}`}>
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
        {expanded && (
          <div tabIndex="0" ref={formRef} className="sprint__create">
            {isLead && createIssue && (
              <SprintIssueForm
                setCreateIssue={setCreateIssue}
                epic={_id}
                forBacklog={project}
                issueType="Task"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  created: state.reducer.created,
});

export default connect(mapStateToProps, { issueCreatedDone })(Epic);
