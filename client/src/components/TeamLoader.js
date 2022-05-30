import React from "react";
import "./styles/_team.scss";


const memberStyles = {
  backgroundColor: "rgb(235, 236, 240)",
  width: 115,
  height: 30,
  borderRadius: 3,
};

const TeamLoader = () => {
  return (
    <div className="team-loader">
      <img
        src={`../../public/teambg.PNG`}
        className="team__header"
        alt="teambackground"
      />
      <div style={{ width: 810 }} className="container d-flex mt-3">
        <div className="team__info">
          <div className="team__inputs">
            <input style={{ backgroundColor: "rgb(235, 236, 240)" }} />
          </div>
          <div className="team__inputs mt-3">
            <textarea
              style={{ backgroundColor: "rgba(56, 56, 56, .3)" }}
            ></textarea>
          </div>
          <div className="d-flex team__config">
            <button className="btn btn-sm flex-grow-1">Add people</button>
            <button className="btn btn-sm ms-2">Delete team</button>
          </div>
          <div className="team__members mt-4">
            <div className="member-container">
              <div className="comment__image"></div>
              <p style={memberStyles}></p>
              <div className="flex-grow-1 text-end">
                <button disabled className="btn btn-sm btn-outline-danger">
                  Remove
                </button>
              </div>
            </div>
            <div className="member-container">
              <div className="comment__image"></div>
              <p style={memberStyles}></p>
              <div className="flex-grow-1 text-end">
                <button disabled className="btn btn-sm btn-outline-danger">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="team__activity ms-3">
          <div>
            <div className="message">
              <div className="comment__image"></div>
              <div
                className="ms-2"
                style={{
                  width: 263,
                  height: 50,
                  backgroundColor: "#ECEDF0",
                  borderRadius: 3,
                }}
              ></div>
              <p
                style={{ backgroundColor: "rgba(56, 56, 56, .3)", height: 25 }}
              ></p>
            </div>
            <div className="message">
              <div className="comment__image"></div>
              <div
                className="ms-2"
                style={{
                  width: 263,
                  height: 50,
                  backgroundColor: "#ECEDF0",
                  borderRadius: 3,
                }}
              ></div>
              <p
                style={{ backgroundColor: "rgba(56, 56, 56, .3)", height: 25 }}
              ></p>
            </div>
            <div className="message">
              <div className="comment__image"></div>
              <div
                className="ms-2"
                style={{
                  width: 263,
                  height: 50,
                  backgroundColor: "#ECEDF0",
                  borderRadius: 3,
                }}
              ></div>
              <p
                style={{ backgroundColor: "rgba(56, 56, 56, .3)", height: 25 }}
              ></p>
            </div>
          </div>
          <div className="team__send-message">
            <input
              disabled
              className="form-control me-1"
              type="text"
              placeholder="Send a message to your team"
            />
            <button disabled className="btn btn-outline-primary" type="submit">
              <i className="fa fa-angle-up" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamLoader;
