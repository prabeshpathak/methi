import React from "react";
import { Link } from "react-router-dom";
import "./styles/_sidebar.scss";

const Sidebar = ({ project, navigation }) => {
  return (
    <div className="sidebar">
      <div className="sidebar__project">
        <img
          src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1143&q=80"
          height={24}
          width={24}
          alt="flag"
        />
        {console.log(project)}
        <div className="ms-2">
          <h5>{project ? project.title : "Loading..."}</h5>
          <p>Software project</p>
        </div>
      </div>
      <div className="sidebar__navigation">
        <Link
          onClick={(e) => !project && e.preventDefault()}
          className={`${navigation === "roadmap" ? "sidebar--active" : ""}`}
          to={`/projects/roadmap/${project?._id}`}
        >
          <i className="fa fa-align-right" aria-hidden="true"></i> Roadmap
        </Link>
        <Link
          onClick={(e) => !project && e.preventDefault()}
          className={`${navigation === "backlog" ? "sidebar--active" : ""}`}
          to={`/projects/backlog/${project?._id}`}
        >
          <i className="fa fa-th-list" aria-hidden="true"></i> Backlog
        </Link>

        <Link
          onClick={(e) => !project && e.preventDefault()}
          className={`${navigation === "boards" ? "sidebar--active" : ""}`}
          to={`/projects/boards/${project?._id}`}
        >
          <i className="fa fa-columns" aria-hidden="true"></i> Boards
        </Link>
        <Link
          onClick={(e) => !project && e.preventDefault()}
          className={`${navigation === "settings" ? "sidebar--active" : ""}`}
          to={`/projects/settings/${project?._id}`}
        >
          <i className="fa fa-cog" aria-hidden="true"></i> Project settings
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
