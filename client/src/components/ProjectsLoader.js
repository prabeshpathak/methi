import React from 'react'

export const ProjectsLoader = ({ type }) => {

    if (type === "projects")
        return (
            <>
                <div
                    className="projects-loader"
                >
                    <p className="projects-loader__content"></p>
                    <p className="projects-loader__content projects-loader__content--info"></p>
                </div>
                <div
                    className="projects-loader"
                >
                    <p className="projects-loader__content"></p>
                    <p className="projects-loader__content projects-loader__content--info"></p>
                </div>
                <div
                    className="projects-loader"
                >
                    <p className="projects-loader__content"></p>
                    <p className="projects-loader__content projects-loader__content--info"></p>
                </div>
            </>
        )
}