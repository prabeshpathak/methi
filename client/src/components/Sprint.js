import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import api from "../axios";
import SprintIssueForm from "./SprintIssueForm";
import Icon from "./svg/Icon";

const Sprint = ({ issues, sprint, index, completeSprint, isLead }) => {
  const [expanded, setExpanded] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);
  const [startModal, setStartModal] = useState(false);
  const [createIssue, setCreateIssue] = useState(false);
  const [formData, setFormData] = useState(null);
  const [sprintStarted, setSprintStarted] = useState(false);

  useEffect(() => {
    sprint && setFormData(sprint);
  }, [sprint]);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") {
        setEditModal(false);
        setCompleteModal(false);
        setStartModal(false);
        setCreateIssue(false);
        setFormData(sprint);
      }
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [sprint]);

  const updateSprint = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/sprints/${_id}`, formData);
      setEditModal(false);
      console.log("Sprint updated");
    } catch (error) {
      console.log(error.response);
    }
  };

  const activateSprint = async (e, isActive) => {
    e.preventDefault();
    try {
      if (!isActive) return completeSprint(_id);
      await api.patch(`/sprints/${_id}`, { ...formData, isActive });
      setSprintStarted(true);
    } catch (error) {
      console.log(error.response);
    }
  };

  const getDates = () =>
    endDate
      ? `${new Date(startDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${new Date(endDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}`
      : isLead && (
          <button
            className="sprint__dateBtn"
            onClick={(e) => {
              e.stopPropagation();
              setEditModal(true);
            }}
          >
            <i className="fa fa-pencil" aria-hidden="true"></i> Add dates
          </button>
        );

  const formatDate = (date) => {
    const currentMonth = date.getMonth();
    const monthString =
      currentMonth >= 10 ? currentMonth + 1 : `0${currentMonth + 1}`;
    const currentDate = date.getDate();
    const dateString = currentDate >= 10 ? currentDate : `0${currentDate}`;
    return `${date.getFullYear()}-${monthString}-${dateString}`;
  };

  const getIssueCount = () => (
    <ul>
      <li>
        {issues.filter((i) => i.issueStatus === "done").length} completed issues
      </li>
      <li>
        {issues.filter((i) => i.issueStatus !== "done").length} open issues
      </li>
    </ul>
  );

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

  if (!formData) return null;
  const { _id, title, startDate, endDate, goal } = formData;
  const { isActive, project } = sprint;
  if (sprintStarted)
    return <Redirect push to={`/projects/boards/${project}`} />;

  return (
    <div className={`sprint ${expanded ? "sprint--expanded" : ""}`}>
      {editModal && formData && (
        <div
          className="sprint__modal"
          onMouseDown={() => {
            setEditModal(false);
            setFormData(sprint);
          }}
        >
          <form
            onSubmit={updateSprint}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h3>Edit sprint: {title}</h3>
            <label htmlFor="title">
              Sprint name<span className="text-danger">*</span>
            </label>
            <input
              required
              value={title}
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
              className="form-control"
              type="text"
              name="title"
              id="title"
            />
            <label htmlFor="startDate">
              Start date<span className="text-danger">*</span>
            </label>
            <input
              required
              value={startDate ? formatDate(new Date(startDate)) : ""}
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
              className="form-control"
              type="date"
              name="startDate"
              id="startDate"
            />
            <label htmlFor="endDate">
              End date<span className="text-danger">*</span>
            </label>
            <input
              value={endDate ? formatDate(new Date(endDate)) : ""}
              min={formatDate(new Date(startDate))}
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
              className="form-control"
              type="date"
              name="endDate"
              id="endDate"
            />
            <label htmlFor="goal">Sprint goal</label>
            <textarea
              value={goal}
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
              className="form-control"
              type="text"
              name="goal"
              id="goal"
            ></textarea>
            <div className="text-end mt-3">
              <button className="btn btn-primary me-2" type="submit">
                Update
              </button>
              <button
                className="btn btn-link"
                type="button"
                onClick={() => {
                  setEditModal(false);
                  setFormData(sprint);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {completeModal && formData && (
        <div
          className="sprint__modal"
          onMouseDown={() => setCompleteModal(false)}
        >
          <form
            className="complete-sprint-form"
            onSubmit={(e) => activateSprint(e, false)}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <img
              src={`${process.env.PUBLIC_URL}/sprint-completed.PNG`}
              alt="sprint completed"
            />
            <div className="p-4">
              <h4>Complete {title}</h4>
              <p>This sprint contains:</p>
              {getIssueCount()}
              <p className="text-secondary">
                Open issues will be moved to backlog
              </p>
              <div className="text-end mt-3">
                <button className="btn btn-primary me-2" type="submit">
                  Complete sprint
                </button>
                <button
                  className="btn btn-link"
                  type="button"
                  onClick={() => setCompleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      {startModal && formData && (
        <div
          className="sprint__modal"
          onMouseDown={() => {
            setStartModal(false);
            setFormData(sprint);
          }}
        >
          <form
            onSubmit={(e) => activateSprint(e, true)}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h3>Start sprint: {title}</h3>
            <p className="mt-3">
              {issues.length} issues will be included in this sprint.
            </p>
            <label htmlFor="title">
              Sprint name<span className="text-danger">*</span>
            </label>
            <input
              required
              value={title}
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
              className="form-control"
              type="text"
              name="title"
              id="title"
            />
            <label htmlFor="startDate">
              Start date<span className="text-danger">*</span>
            </label>
            <input
              required
              value={startDate ? formatDate(new Date(startDate)) : ""}
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
              className="form-control"
              type="date"
              name="startDate"
              id="startDate"
            />
            <label htmlFor="endDate">
              End date<span className="text-danger">*</span>
            </label>
            <input
              required
              value={endDate ? formatDate(new Date(endDate)) : ""}
              min={formatDate(new Date(startDate))}
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
              className="form-control"
              type="date"
              name="endDate"
              id="endDate"
            />
            <label htmlFor="goal">Sprint goal</label>
            <textarea
              value={goal}
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
              className="form-control"
              type="text"
              name="goal"
              id="goal"
            ></textarea>
            <div className="text-end mt-3">
              <button className="btn btn-primary me-2" type="submit">
                Start
              </button>
              <button
                className="btn btn-link"
                type="button"
                onClick={() => {
                  setStartModal(false);
                  setFormData(sprint);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
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
            <strong>{title}</strong>
          </h5>
          <p className="ms-2">{getDates()}</p>
          <p className="ms-2">{issues.length} issue(s)</p>
        </div>
        {isLead && (
          <div className="d-flex align-items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                index === 0 &&
                  (isActive ? setCompleteModal(true) : setStartModal(true));
              }}
              className={`me-2 btn ${
                index === 0
                  ? !isActive
                    ? "btn-primary"
                    : "btn-secondary"
                  : "disabled-btn"
              }`}
            >
              {isActive ? "Complete sprint" : "Start sprint"}
            </button>
            <button
              className="btn btn-secondary"
              onClick={(e) => {
                e.stopPropagation();
                setEditModal(true);
              }}
            >
              Edit sprint
            </button>
          </div>
        )}
      </div>
      <div className="mt-2">
        {issues.map((i) => (
          <Link to={`/issues/${i._id}`} className="sprint__issue" key={i._id}>
            <div className="d-flex align-items-center">
              <Icon icon={i.issueType} size={16} />
              <p className="ms-2">{i.summary}</p>
              {i.epic && <p className="sIssueEpic">{i.epic.summary}</p>}
            </div>
            <div className="d-flex align-items-center">
              <p className={`sIssueStatus ${getStatusClass(i.issueStatus)}`}>
                {i.issueStatus}
              </p>
              <div className="comment__image">
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
      </div>
      <div tabIndex="0" className="sprint__create">
        {isLead &&
          (createIssue ? (
            <SprintIssueForm
              setCreateIssue={setCreateIssue}
              sprint={sprint}
              forBacklog={false}
              issueType="story"
            />
          ) : (
            <h6
              onClick={() => {
                setCreateIssue(true);
              }}
            >
              + Create issue
            </h6>
          ))}
      </div>
    </div>
  );
};

export default Sprint;
