import React from "react";

const IssueLoader = () => {
  return (
    <div className="issue-loader container">
      <div className="issue__nav">
        <a href="/">Projects</a>
        <span>/</span>
      </div>
      <div className="issue__hero">
        <div>
          <form className="issue__summary">
            <input
              style={{ backgroundColor: "rgba(56, 56, 56, .3)" }}
              disabled
            />
          </form>
          <textarea className="mt-3" disabled></textarea>
          <div className="issue__comments mt-3">
            <textarea
              style={{ backgroundColor: "#e9e9e9" }}
              disabled
            ></textarea>
            <p className="protip">
              <strong>Pro tip:</strong> press M to comment
            </p>
          </div>
        </div>
        <div className="ms-4">
          <div className="issue__status">
            <select style={{ width: 180 }} value="default" disabled="disabled">
              <option value="default">Issue progress</option>
            </select>
          </div>
          <div className="issue__details">
            <div style={{ width: 350 }} className="expandBtn">
              <h6>Details</h6>
              <i className="fa fa-angle-down" aria-hidden="true"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueLoader;
