import React from "react";
import { connect } from "react-redux";
import api, { setAuthToken } from "../axios";
import { login, setNotification } from "../state/actions";

// component for the about page
const About = ({ login, setNotification }) => {
  // default login data for the about page
  const loginData = {
    email: "admin@admin.com",
    password: "111111",
  };

  // generate a token for the user to access about page
  const loginDefault = async () => {
    const { data } = await api.post("/signin/login", loginData);
    localStorage.setItem("token", data.token);
    setAuthToken(data.token);
    login(data.user);
    setNotification(
      "Logged into default account successfully",
      "info text-info"
    );
  };

  return (
    <div className="about container">
      <p>
        Hello, this is Team Cults. <span className="fw-bold">Methi</span> is
        basically a very light version of
        <a href="https://www.atlassian.com/software/jira"> Jira</a>. We tried to
        remake the agile development part of Methi. You can create account then
        create a team or get added to other teams in order to assign issues to
        others or get assigned yourself. Project lead can create or modify
        issues and assign them to team members. There is backlog for all issues,
        sprint for creating a sprint with some issues and roadmap for tracking
        all the epics and sub-issues under them including the completion
        percentage.
      </p>
      <h5>
        <button onClick={loginDefault} className="btn btn-success btn-sm">
          <i className="fa fa-user-o me-1" aria-hidden="true"></i>
          <i className="fa fa-key" aria-hidden="true"></i> Click here
        </button>{" "}
        to login to the default account and check out the features directly with
        readymade examples.
      </h5>
      <h5 className="mb-0">
        <strong>Features:</strong>
      </h5>
      <ul>
        <li>
          In homepage there are projects you work on and the issues you've been
          assigned. These things are under a project-
        </li>
        <li>
          Backlog: A place for all the issues related to this project, and to
          create and start sprints.
        </li>
        <li>
          Boards: If there is an active sprint, the issues under that sprint
          will be shown here in different boards based on their status. Number
          of remaining days to complete the sprint will be shown and option to
          complete it. After completing a sprint, finished issues are deleted
          and unfinished ones are moved to backlog.
        </li>
        <li>
          Roadmap: It contains the epic issues of a project. All the other
          issues under those epics are listed below. New issues under them can
          be added or new epic can be created directly from there. A progress
          bar based on number of issues that are marked as 'done' is also there
          under each epic.
        </li>
        <li>
          Issues can be epic, story, task or bug. These can be created and
          modified by only project lead and the issue status can be changed by
          assignee as well. Users related to the same project can comment on
          issues as well. Trying to bring the drag and drop feature of changing
          issue status and stuff like that in original Methi in next version, as
          that seemed complicated right now.
        </li>
        <li>
          Sprint can be started after providing a start and end date. Remaining
          days to the end date from current date is shown on sprints page
          (boards).
        </li>
        <li>
          A team has to be created to add assignees to issues. The assignee list
          for any project shows the users that are in a team where the team lead
          is also the project lead. In teams, people can send message which is
          basically commenting. I'd like to use sockets and implement actual
          live chatting later on.
        </li>
      </ul>
    </div>
  );
};

export default connect(null, { login, setNotification })(About);
