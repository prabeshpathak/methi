import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ project, navigation }) => {
  return (
    <div className="sidebar">
      <div className="sidebar__project">
        <img
          src={`${process.env.PUBLIC_URL}/icon.png`}
          height={24}
          width={24}
          alt="flag"
        />
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
