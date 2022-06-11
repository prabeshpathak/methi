import React, { useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import api from "../axios";
import { issueCreated } from "../state/actions";
import { connect } from "react-redux";

const SprintIssueForm = ({
  sprint,
  issueCreated,
  setCreateIssue,
  forBacklog,
  issueType,
  epic,
}) => {
  const [data, setData] = useState(null);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (!forBacklog && sprint)
      setData({
        project: sprint.project,
        sprint: sprint._id,
        issueType,
        summary: "",
        epic,
      });
    else setData({ project: forBacklog, issueType, summary: "", epic });
  }, [sprint, forBacklog, issueType, epic]);
  if (!data) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const response = await api.post("/issues/create", data);
      issueCreated(response.data);
      setCreateIssue(false);
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        disabled={issueType === "Epic"}
        value={data.issueType}
        onChange={(e) => setData({ ...data, issueType: e.target.value })}
        name="issueType"
      >
        <option hidden={data.issueType === "Story"} value="Story">
          Story
        </option>
        <option hidden={data.issueType === "Task"} value="Task">
          Task
        </option>
        <option hidden={data.issueType === "Bug"} value="Bug">
          Bug
        </option>
      </select>
      <input
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.target.blur();
            setCreateIssue(false);
          }
        }}
        required
        value={data.summary}
        onChange={(e) => setData({ ...data, summary: e.target.value })}
        placeholder="What needs to be done?"
      />
      {loader && <Loader type="Rings" color="#42526e" width={30} height={30} />}
    </form>
  );
};

export default connect(null, { issueCreated })(SprintIssueForm);
