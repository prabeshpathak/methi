import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import api from "../axios";
import { Redirect } from "react-router-dom";

const CreateTeam = ({ user, issueCreated }) => {
  const [title, setTitle] = useState("");
  const [newTeam, setNewTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [searchDropDown, setSearchDropDown] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [formPosting, setFormPosting] = useState(false);
  const searchRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormPosting(true);
    try {
      const { data } = await api.post("/teams/create", { title, members });
      issueCreated(data);
      setNewTeam(data._id);
    } catch (error) {
      console.log(error.response);
    }
  };

  const searchUser = async (e) => {
    if (e.key === "Escape") {
      e.target.blur();
      setSearchDropDown(false);
      e.target.value = "";
      return;
    }
    if (e.target.value !== "") {
      try {
        const { data } = await api.get(`/teams/search/${e.target.value}/new`);
        setSearchResult(data.filter(({ _id }) => checkAddedUser(_id)));
        setSearchDropDown(true);
      } catch (error) {
        console.log(error.response);
      }
    }
  };

  const checkAddedUser = (uid) => {
    for (const member of members) if (member._id === uid) return false;

    return true;
  };

  const addUser = async (_id, fullName) => {
    setMembers([...members, { _id, fullName }]);
    searchRef.current.value = "";
    setSearchDropDown(false);
    setSearchResult([]);
  };

  if (newTeam) return <Redirect to={`/teams/${newTeam}`} />;
  if (!user) return null;

  return (
    <div
      onClick={() => setSearchDropDown(false)}
      className="create-team container"
    >
      <div>
        <h2>Start a new team</h2>
        <div className="create-team__main">
          <img
            src={`${process.env.PUBLIC_URL}/create-team.PNG`}
            alt="createteam"
          />
          <form onSubmit={handleSubmit}>
            <p>Get everyone working in one place by adding them to a team.</p>
            <label className="text-secondary" htmlFor="teamName">
              Team Name
            </label>
            <input
              disabled={formPosting}
              required
              placeholder="What’s your team called?"
              className="form-control mb-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              name="title"
              id="teamName"
            />
            <label className="text-secondary" htmlFor="members">
              Invite people to your team
            </label>
            <div className="invite-people">
              <div className="d-flex">
                {members.map((m) => (
                  <div key={m._id} className="invite-people__content">
                    <p>{m.fullName}</p>
                    <i
                      onClick={() =>
                        setMembers(
                          members.filter((member) => member._id !== m._id)
                        )
                      }
                      className="fa fa-times ms-1"
                      aria-hidden="true"
                    ></i>
                  </div>
                ))}
              </div>
              <input
                disabled={formPosting}
                ref={searchRef}
                placeholder="add more people..."
                onClick={(e) => e.stopPropagation()}
                onKeyDown={searchUser}
                type="text"
                id="members"
              />
              <div
                onClick={(e) => e.stopPropagation()}
                className="search-result"
              >
                {searchDropDown &&
                  searchResult.map(
                    (u) =>
                      u._id !== user._id && (
                        <div
                          onClick={() => addUser(u._id, u.fullName)}
                          key={u._id}
                          className="search-result__content"
                        >
                          <div className="comment__image">
                            {u.fullName
                              .match(/\b(\w)/g)
                              .join("")
                              .toUpperCase()}
                          </div>
                          <p>{u.fullName}</p>
                        </div>
                      )
                  )}
              </div>
            </div>
            <div className="text-end mt-2">
              <button
                disabled={formPosting}
                className="btn btn-primary"
                type="submit"
              >
                Start team
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.reducer.user,
});

export default connect(mapStateToProps)(CreateTeam);
