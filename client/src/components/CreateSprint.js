import React, { useState } from "react";
import api from "../axios";

const CreateSprint = ({ project, setSprints, sprintLength }) => {
  const [disabled, setDisabled] = useState(false);

  const createSprint = async () => {
    setDisabled(true);
    try {
      const { data } = await api.post("/sprints/create", {
        title: `${project.key} Sprint ${sprintLength + 1}`,
        project: project._id,
      });
      setSprints((prevState) => [...prevState, data]);
      setDisabled(false);
    } catch (error) {
      console.log(error.response);
    }
  };
  return (
    <div>
      <button
        disabled={disabled}
        className="btn btn-secondary"
        onClick={(e) => {
          e.stopPropagation();
          createSprint();
        }}
      >
        Create sprint
      </button>
    </div>
  );
};

export default CreateSprint;
