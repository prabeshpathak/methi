import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import api from "../axios";
import Sidebar from "./Sidebar";
import Icon from "./svg/Icon";
import { setNotification } from "../state/actions";

async function fetchData(id) {
  const { data } = await api.get(`/sprints/active/${id}`);
  let issues = {
    "to do": [],
    "in progress": [],
    done: [],
  };
  if (data.issues)
    for (const issue of data.issues) issues[issue.issueStatus].push(issue);
  return { sprint: data.sprint, issues, project: data.project };
}

const Boards = ({ match, user, setNotification }) => {
  const [sprint, setSprint] = useState(null);
  const [issues, setIssues] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completeModal, setCompleteModal] = useState(false);
  const [sprintCompleted, setSprintCompleted] = useState(false);

  useEffect(() => {
    (async function () {
      const data = await fetchData(match.params.id);
      setSprint(data.sprint);
      setIssues(data.issues);
      setProject(data.project);
      setLoading(false);
    })();
  }, [match.params.id]);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") setCompleteModal(false);
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.delete(`/sprints/${sprint._id}`);
    setNotification("Sprint completed", "info text-info");
    setSprintCompleted(true);
  };

  const getRemainingDate = () => {
    const endDate = new Date(sprint.endDate);
    if (endDate.getTime() - Date.now() < 1) return 0;
    return Math.floor(
      (endDate.getTime() - new Date(Date.now())) / (1000 * 3600 * 24)
    );
  };

  const getIssueCount = () => (
    <ul>
      <li>{issues["done"].length} completed issues</li>
      <li>
        {issues["in progress"].length + issues["to do"].length} open issues
      </li>
    </ul>
  );

  if (sprintCompleted)
    return <Redirect push to={`/projects/backlog/${project._id}`} />;

  return (
    <div className="outer-container">
      <Sidebar project={project} navigation="boards" />
      <div className="boards">
        {completeModal && (
          <div
            className="sprint__modal"
            onMouseDown={() => setCompleteModal(false)}
          >
            <form
              className="complete-sprint-form"
              onSubmit={handleSubmit}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <img
                src={`${process.env.PUBLIC_URL}/sprint-completed.jpg`}
                alt="sprint completed"
              />
              <div className="p-4">
                <h4>Complete {sprint?.title}</h4>
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
        <div className="d-flex justify-content-between align-items-center">
          <div className="issue__nav">
            <Link to="/projects">Projects</Link>
            <span>/</span>
            {!loading && (
              <Link to={`/projects/boards/${sprint?.project._id}`}>
                {project?.title}
              </Link>
            )}
          </div>
          {sprint && (
            <div className="boards__completed">
              <p>
                <i className="fa fa-clock-o me-1" aria-hidden="true"></i>{" "}
                {getRemainingDate()} days remaining
              </p>
              {user?._id === project?.lead._id && (
                <button
                  onClick={() => setCompleteModal(true)}
                  className="btn btn-primary"
                >
                  Complete sprint
                </button>
              )}
            </div>
          )}
        </div>
        <h2>{sprint ? sprint.title : `${project?.key ?? "Sprint"} board`}</h2>
        <div className="d-flex mt-3">
          <div className="boards__container">
            {!loading && (
              <p className="text-secondary">
                TO DO {`${issues["to do"].length} ISSUES`}
              </p>
            )}
            {sprint ? (
              issues &&
              issues["to do"].map((i) => (
                <Link
                  to={`/issues/${i._id}`}
                  key={i._id}
                  className="boards__issue mb-2"
                >
                  <p>{i.summary}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <Icon icon={i.issueType} size={16} />
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
              ))
            ) : (
              <>
                <img
                  className="mt-3"
                  height={128}
                  src={`${process.env.PUBLIC_URL}/nosprint.jpg`}
                  alt="no sprint"
                />
                <p className="text-center mt-1">
                  <strong>You haven't started a sprint</strong>
                </p>
                <p className="text-center">
                  You can't do anything on your board because you haven't
                  started a sprint yet. Go to the backlog to plan and start a
                  sprint.
                </p>
                <Link
                  className={`btn btn-outline-secondary ${
                    loading ? "pe-none" : ""
                  }`}
                  to={`/projects/backlog/${project?._id}`}
                >
                  Go to Backlog
                </Link>
              </>
            )}
          </div>
          <div className="boards__container">
            {!loading && (
              <p className="text-secondary">
                IN PROGRESS {`${issues["in progress"].length} ISSUES`}
              </p>
            )}
            {!loading &&
              issues["in progress"].map((i) => (
                <Link
                  to={`/issues/${i._id}`}
                  key={i._id}
                  className="boards__issue"
                >
                  <p>{i.summary}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <Icon icon={i.issueType} size={16} />
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
          <div className="boards__container">
            {!loading && (
              <p className="text-secondary">
                DONE {`${issues["done"].length} ISSUES`}
                <i
                  className="fa fa-check text-success ms-1"
                  aria-hidden="true"
                ></i>
              </p>
            )}
            {!loading &&
              issues["done"].map((i) => (
                <Link
                  to={`/issues/${i._id}`}
                  key={i._id}
                  className="boards__issue"
                >
                  <p>{i.summary}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <Icon icon={i.issueType} size={16} />
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
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.reducer.user,
});

export default connect(mapStateToProps, { setNotification })(Boards);
