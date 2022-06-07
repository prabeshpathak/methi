import React, { useEffect, useState } from "react";
import api from "../axios";

const fetchData = async () => {
  const response = await api.get("/issues");
  return response.data;
};
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

  const handleChange = (e) =>
    setFormData({ ...formdata, [e.target.name]: e.target.value });

  return <></>;
};

export default Create;
