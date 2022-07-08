import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import api from "../axios";
import Sidebar from "./Sidebar";

async function fetchData(id) {
  return await api.get(`/projects/${id}`);
}

const ProjectSettings = ({ match, user }) => {
  const [project, setProject] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(true);

  useEffect(() => {
    (async function () {
      const { data } = await fetchData(match.params.id);
      setProject(data);
    })();
  }, [match.params.id]);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") setDeleteModal(false);
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const updateProject = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/projects/${project._id}`, {
        title: project.title,
        key: project.key,
      });
      window.location.reload();
    } catch (error) {
      console.log(error.response);
    }
  };

  const deleteProject = async (e) => {
    e.preventDefault();
    try {
      setDeleteSubmitting(true);
      await api.delete(`/projects/${project._id}`);
      window.location.replace("/");
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <div className="outer-container">
      <Sidebar project={project} navigation="settings" />
      <div className="project-settings">
        {deleteModal && (
          <div
            className="sprint__modal"
            onMouseDown={() => setDeleteModal(false)}
          >
            <form
              className="delete-modal"
              onSubmit={deleteProject}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="p-1">
                <h4>
                  <i
                    className="fa fa-exclamation-triangle text-danger"
                    aria-hidden="true"
                  ></i>{" "}
                  <strong>Delete permenantly?</strong>
                </h4>
                <p>
                  The project along with its issues, components will be deleted
                  permenantly
                </p>
                <div className="d-flex align-items-baseline">
                  <input
                    className="w-auto me-2"
                    onChange={() => setDeleteSubmitting(!deleteSubmitting)}
                    id="confirm-delete"
                    required
                    type="checkbox"
                  />
                  <label htmlFor="confirm-delete">Confirm delete</label>
                </div>
                <div className="text-end mt-3">
                  <button
                    disabled={deleteSubmitting}
                    type="submit"
                    className="btn btn-danger me-2"
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => setDeleteModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
        {project && user?._id === project.lead._id && (
          <div className="text-end">
            <button
              onClick={() => setDeleteModal(true)}
              className="btn mb-5 btn-danger"
            >
              Delete permenantly
            </button>
          </div>
        )}
        <form onSubmit={updateProject}>
          <div className="text-center">
            <img id="projectimg" src={`${process.env.PUBLIC_URL}/project.jpg`} alt="project" />
          </div>
          {project && (
            <>
              <label className="text-secondary" htmlFor="projectName">
                Name
              </label>
              <input
                readOnly={user?._id !== project.lead._id}
                className="form-control mb-3"
                required
                value={project.title}
                onChange={(e) =>
                  setProject({ ...project, [e.target.name]: e.target.value })
                }
                type="text"
                name="title"
                id="projectName"
              />
              <label className="text-secondary" htmlFor="projectKey">
                Key
              </label>
              <input
                readOnly={user?._id !== project.lead._id}
                className="form-control mb-3"
                required
                value={project.key}
                onChange={(e) =>
                  setProject({ ...project, [e.target.name]: e.target.value })
                }
                type="text"
                name="key"
                id="projectKey"
              />
              <label>Project lead</label>
              <input
                readOnly
                className="form-control mb-3"
                type="text"
                value={project.lead.fullName}
              />
              <button className="btn btn-primary" type="submit">
                Save
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.reducer.user,
});

export default connect(mapStateToProps)(ProjectSettings);
