import React from "react";

export const ProjectsLoader = ({ type }) => {
  if (type === "projects")
    return (
      <>
        <div className="projects-loader">
          <p className="projects-loader__content"></p>
          <p className="projects-loader__content projects-loader__content--info"></p>
        </div>
        <div className="projects-loader">
          <p className="projects-loader__content"></p>
          <p className="projects-loader__content projects-loader__content--info"></p>
        </div>
        <div className="projects-loader">
          <p className="projects-loader__content"></p>
          <p className="projects-loader__content projects-loader__content--info"></p>
        </div>
      </>
    );
  else
    return (
      <>
        <div className="issues-loader">
          <div className="issues-loader__icon"></div>
          <div className="issues-loader__mid">
            <p className="projects-loader__content"></p>
            <p className="projects-loader__content projects-loader__content--info"></p>
          </div>
        </div>
        <div className="issues-loader">
          <div className="issues-loader__icon"></div>
          <div className="issues-loader__mid">
            <p className="projects-loader__content"></p>
            <p className="projects-loader__content projects-loader__content--info"></p>
          </div>
        </div>
        <div className="issues-loader">
          <div className="issues-loader__icon"></div>
          <div className="issues-loader__mid">
            <p className="projects-loader__content"></p>
            <p className="projects-loader__content projects-loader__content--info"></p>
          </div>
        </div>
      </>
    );
};
