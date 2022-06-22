import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import api from "../axios";
import { issueCreated, setNotification } from "../state/actions";

async function fetchData() {
  return {
    projects: await api.get("/projects/lead"),
    assignees: await api.get("/projects/assignees"),
  };
}

const Create = ({ user, setFormOpen, issueCreated, setNotification }) => {
  const [projects, setProjects] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [formdata, setFormData] = useState({
    project: "",
    summary: "",
    issueType: "Task",
    description: "",
    assignee: "",
    label: "",
    sprint: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(null);
  const [createAnother, setCreateAnother] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const response = await fetchData();
      setProjects(response.projects.data);
      setAssignees(response.assignees.data);
    })();
  }, [user]);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") setFormOpen(false);
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formdata, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formdata.project === "") return console.log("Select a project");
    const data = Object.fromEntries(
      Object.entries(formdata).filter(([key, val]) => val !== "")
    );
    const { title } = projects.find((p) => p._id === formdata.project);
    try {
      setFormSubmitting(true);
      const response = await api.post("/issues/create", data);
      issueCreated({
        ...response.data,
        project: { _id: response.data.project, title },
      });
      setNotification("Issue created", "info text-info");
      if (!createAnother) return setFormOpen(false);
      setFormData({
        project: "",
        summary: "",
        issueType: "Task",
        description: "",
        assignee: "",
        label: "",
        sprint: "",
      });
      setFormSubmitting(false);
    } catch (error) {
      console.log(error.response);
    }
  };

  const getSprints = (projectId) =>
    api
      .get(`/sprints/project/${projectId}`)
      .then(({ data }) => setSprints(data));

  return (
    <div className="create">
      {user && projects ? (
        <form onSubmit={handleSubmit}>
          <h3>Create issue</h3>
          <div className="create__scrollable">
            <label>
              Project<span className="text-danger">*</span>
            </label>
            {projects && (
              <select
                value={formdata.project}
                onChange={(e) => {
                  handleChange(e);
                  getSprints(e.target.value);
                }}
                className="form-control"
                name="project"
              >
                <option disabled value="">
                  Select a project
                </option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>
            )}
            <label>
              Issue Type<span className="text-danger">*</span>
            </label>
            <select
              value={formdata.issueType}
              onChange={handleChange}
              className="form-control"
              name="issueType"
            >
              <option value="Story">Story</option>
              <option value="Task">Task</option>
              <option value="Bug">Bug</option>
              <option value="Epic">Epic</option>
            </select>
            <label htmlFor="issueSummary">
              Summary<span className="text-danger">*</span>
            </label>
            <input
              value={formdata.summary}
              onChange={handleChange}
              className="form-control"
              name="summary"
              type="text"
              id="issueSummary"
              required
            />
            <label htmlFor="issueDescription">Description</label>
            <textarea
              value={formdata.description}
              onChange={handleChange}
              name="description"
              className="form-control"
              id="issueDescription"
            ></textarea>
            <label htmlFor="issueAssignee">Assignee</label>
            <select
              value={formdata.assignee}
              onChange={handleChange}
              name="assignee"
              className="form-control"
              id="issueAssignee"
            >
              <option value="">Unassigned</option>
              {assignees.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.fullName}
                </option>
              ))}
            </select>
            <label htmlFor="labels">Labels</label>
            <input
              value={formdata.label}
              onChange={handleChange}
              name="label"
              className="form-control"
              type="text"
              id="labels"
            />
            <label htmlFor="issueSprint">Sprint</label>
            <select
              value={formdata.sprint}
              onChange={handleChange}
              name="sprint"
              className="form-control"
              id="issueSprint"
            >
              <option disabled value=""></option>
              {sprints.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
          <div className="text-end mt-2">
            <input
              onChange={() => setCreateAnother(!createAnother)}
              id="create-another"
              type="checkbox"
            />
            <label className="me-2" htmlFor="create-another">
              Create another
            </label>
            <button
              disabled={formSubmitting}
              className="btn btn-primary me-2"
              type="submit"
            >
              Create
            </button>
            <button
              className="btn btn-link"
              type="button"
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.reducer.user,
});

export default connect(mapStateToProps, { issueCreated, setNotification })(
  Create
);
