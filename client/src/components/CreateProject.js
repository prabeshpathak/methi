import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import api from "../axios";
import "./styles/createProject.scss";

const CreateProject = ({ issueCreated }) => {
  const [formdata, setFormdata] = useState({
    title: "",
    key: "",
  });
  const [newProject, setNewProject] = useState(null);
  const [formPosting, setFormPosting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormPosting(true);
    try {
      const { data } = await api.post("/projects/create", 
      formdata);
      setNewProject(data._id);
    } catch (error) {
      console.log(error.response);
    }
  };

  if (newProject) return <Redirect to={`/projects/boards/${newProject}`} />;

  return (
    <div className="create-project container">
      <div className="create-project__main">
        <form onSubmit={handleSubmit}>
          <h2>Add project details</h2>
          <p>You can change these details anytime in your project settings.</p>
          <label className="text-secondary" htmlFor="projectName">
            Name<span className="text-danger">*</span>
          </label>
          <input
            className="form-control mb-3"
            required
            value={formdata.title}
            onChange={(e) =>
              setFormdata({ ...formdata, [e.target.name]: e.target.value })
            }
            type="text"
            name="title"
            id="projectName"
          />
          <label className="text-secondary" htmlFor="projectKey">
            Key<span className="text-danger">*</span>
          </label>
          <input
            className="form-control mb-3"
            required
            value={formdata.key}
            onChange={(e) =>
              setFormdata({ ...formdata, [e.target.name]: e.target.value })
            }
            type="text"
            name="key"
            id="projectKey"
          />
          <button
            disabled={formPosting}
            className="btn btn-primary"
            type="submit"
          >
            Create project
          </button>
        </form>
        <div className="create-project__info">
          <h5>SDLC Models</h5>
          <div className="d-flex align-items-center">
            <img
              src="https://d32myzxfxyl12w.cloudfront.net/assets/images/article_images/925d76d668dc5bf47d44a8fc0907f30d1d9c8b1f.png?1557486197"
              alt="scrum"
              style={{ border: "1px solid black" }}
            />
            <div className="ms-2">
              <p>
                <strong>Agile</strong>
              </p>
              <p>
                Agile SDLC methodology is based on collaborative decision making
                between requirements and solutions teams, and a cyclical,
                iterative progression of producing working software.
              </p>
            </div>
          </div>
          <h5 className="mt-4">SDLC Models</h5>
          <div className="d-flex align-items-center">
            <img
              src="https://www.researchgate.net/publication/237728174/figure/fig1/AS:854125713571841@1580650847579/Structured-approach-to-SDLC-Waterfall-Model.png"
              alt="team"
              style={{ border: "1px solid black" }}
            />
            <div className="ms-2">
              <p>
                <strong>WaterFall</strong>
              </p>
              <p>
                he waterfall model is a breakdown of project activities into
                linear sequential phases, where each phase depends on the
                deliverables of the previous one and corresponds to a
                specialization of tasks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(null)(CreateProject);
