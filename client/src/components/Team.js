import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import api from "../axios";
import TeamLoader from "./TeamLoader";
import "./styles/_team.scss";

const Team = ({ match, user }) => {
  const [team, setTeam] = useState(null);
  const [formdata, setFormdata] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [messageSubmitting, setMessageSubmitting] = useState(false);
  const [titleEditing, setTitleEditing] = useState(false);
  const [descEditing, setDescEditing] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(true);
  const [searchDropDown, setSearchDropDown] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [deleteMember, setDeleteMember] = useState(null);
  const titleRef = useRef();

  useEffect(() => {
    setTeam(null);
    async function fetchData() {
      const { data } = await api.get(`/teams/details/${match.params.id}`);
      setTeam(data);
      setFormdata({
        title: data.title,
        description: data.description ?? "",
      });
    }
    fetchData();
  }, [match.params.id]);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") {
        setAddModal(false);
        setDeleteModal(false);
      }
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (messageText !== "")
      try {
        setMessageSubmitting(true);
        let { data } = await api.post("/messages/create", {
          body: messageText,
          user: user._id,
          team: team._id,
        });
        data.user = user;
        setTeam({ ...team, messages: [...team.messages, data] });
        setMessageSubmitting(false);
        setMessageText("");
      } catch (error) {
        console.log(error);
      }
  };

  const updateTeam = async (e, input) => {
    e.preventDefault();
    try {
      if (input === "title") {
        setTitleEditing(false);
        titleRef.current.blur();
      }
      if (input === "description") setDescEditing(false);
      await api.patch(`/teams/${team._id}`, { [input]: formdata[input] });
      setTeam({ ...team, [input]: formdata[input] });
    } catch (error) {
      console.log(error.response);
    }
  };

  const searchUser = async (e) => {
    if (e.key === "Escape") {
      e.target.blur();
      setSearchDropDown(false);
      e.stopPropagation();
      return;
    }
    if (e.target.value !== "") {
      try {
        const { data } = await api.get(
          `/teams/search/${e.target.value}/${team._id}`
        );
        setSearchDropDown(true);
        setSearchResult(data);
      } catch (error) {
        console.log(error.response);
      }
    }
  };

  const addUser = async (member) => {
    try {
      setSearchDropDown(false);
      const { data } = await api.post("/teams/add/", {
        team: team._id,
        member,
      });
      setTeam({ ...team, members: [...team.members, data] });
      setAddModal(false);
    } catch (error) {
      console.log(error.response);
    }
  };

  const removeUser = async (member) => {
    try {
      setTeam({
        ...team,
        members: team.members.filter((m) => m._id !== member),
      });
      await api.post("/teams/remove/", { team: team._id, member });
      setDeleteMember(null);
    } catch (error) {
      console.log(error.response);
    }
  };

  const deleteTeam = async (e) => {
    e.preventDefault();
    try {
      setDeleteSubmitting(true);
      await api.delete(`/teams/${team._id}`);
      window.location.replace("/");
    } catch (error) {
      console.log(error.response);
    }
  };

  const cancelEdit = (e, input) => {
    if (input === "title") setTitleEditing(false);
    if (input === "description") setDescEditing(false);
    e?.target.blur();
    setFormdata({ ...formdata, [input]: team[input] ?? "" });
  };

  if (!team || !formdata || !user) return <TeamLoader />;
  const { members, messages } = team;
  const isLead = team.lead === user._id;

  return (
    <div className="team">
      {addModal && (
        <div className="sprint__modal" onMouseDown={() => setAddModal(false)}>
          <form
            className="add-modal"
            onSubmit={(e) => e.preventDefault()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="p-1">
              <h4>Add team members</h4>
              <input
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => searchUser(e)}
                className="form-control"
                type="text"
                placeholder="Their name or email"
              />
              <div className="text-end mt-3">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => setAddModal(false)}
                >
                  Done
                </button>
              </div>
            </div>
            <div onClick={(e) => e.stopPropagation()} className="search-result">
              {searchDropDown &&
                searchResult.map((u) => (
                  <div
                    onClick={(e) => {
                      addUser(u._id);
                      e.stopPropagation();
                    }}
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
                ))}
            </div>
          </form>
        </div>
      )}
      {deleteModal && (
        <div
          className="sprint__modal"
          onMouseDown={() => setDeleteModal(false)}
        >
          <form
            className="delete-modal"
            onSubmit={deleteTeam}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="p-1">
              <h4>
                <i
                  className="fa fa-exclamation-triangle text-danger"
                  aria-hidden="true"
                ></i>{" "}
                <strong>You’re about to delete this team</strong>
              </h4>
              <p>
                This means you’ll remove all information related to the team.
                The issues in which assigned members do not belong to even a
                single group with yourself, will become unassigned
              </p>
              <div className="d-flex align-items-baseline">
                <input
                  onChange={() => setDeleteSubmitting(!deleteSubmitting)}
                  id="confirm-delete"
                  required
                  type="checkbox"
                />
                <label htmlFor="confirm-delete">
                  This is a permanent action and can’t be undone. Are you sure
                  you want to delete this team?
                </label>
              </div>
              <div className="text-end mt-3">
                <button
                  disabled={deleteSubmitting}
                  type="submit"
                  className="btn btn-danger me-2"
                >
                  Delete
                </button>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => setDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      <img
        src={`${process.env.PUBLIC_URL}/teambg.PNG`}
        className="team__header"
        alt="teambackground"
      />
      <div className="container">
        <div className="team__info">
          <form
            onSubmit={(e) => updateTeam(e, "title")}
            className="team__inputs"
          >
            <input
              required
              ref={titleRef}
              disabled={!isLead}
              onKeyDown={(e) => e.key === "Escape" && cancelEdit(e, "title")}
              onClick={() => setTitleEditing(true)}
              type="text"
              value={formdata.title}
              onChange={(e) =>
                setFormdata({ ...formdata, [e.target.name]: e.target.value })
              }
              name="title"
            />
            <div className={`editBtns ${titleEditing ? "" : "d-none"}`}>
              <button type="submit" className="me-2">
                <i className="fa fa-check"></i>
              </button>
              <button type="button" onClick={() => cancelEdit(null, "title")}>
                <i className="fa fa-times" aria-hidden="true"></i>
              </button>
            </div>
          </form>
          <form
            onSubmit={(e) => updateTeam(e, "description")}
            className="team__inputs team__inputs--desc mt-5"
          >
            <textarea
              required
              disabled={!isLead}
              onKeyDown={(e) =>
                e.key === "Escape" && cancelEdit(e, "description")
              }
              onClick={() => setDescEditing(true)}
              value={formdata.description}
              onChange={(e) =>
                setFormdata({ ...formdata, [e.target.name]: e.target.value })
              }
              placeholder={
                isLead
                  ? "There’s no ‘description’ in ‘team’, but you could add one here."
                  : "Some description for the team."
              }
              name="description"
            ></textarea>
            <div className={`editBtns ${descEditing ? "" : "d-none"}`}>
              <button type="submit" className="me-2">
                <i className="fa fa-check"></i>
              </button>
              <button
                type="button"
                onClick={() => cancelEdit(null, "description")}
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </button>
            </div>
          </form>
          {isLead && (
            <div className="d-flex team__config">
              <button
                className="btn btn-sm flex-grow-1"
                onClick={() => setAddModal(true)}
              >
                Add people
              </button>
              <button
                className="btn btn-sm ms-2"
                onClick={() => setDeleteModal(true)}
              >
                Delete team
              </button>
            </div>
          )}
          <div className="team__members mt-4">
            <h5 className="text-secondary">{members.length} members</h5>
            {members.map((m) => (
              <div className="member-container" key={m._id}>
                <div className="comment__image">
                  {m.fullName
                    .match(/\b(\w)/g)
                    .join("")
                    .toUpperCase()}
                </div>
                <p>{m.fullName}</p>
                {isLead && (
                  <div className="flex-grow-1 text-end">
                    {m._id !== user._id && (
                      <button
                        onClick={() => setDeleteMember(m._id)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        Remove
                      </button>
                    )}
                    <div
                      className={`member-container__deleteModal ${
                        deleteMember === m._id
                          ? "member-container__deleteModal--opened"
                          : ""
                      }`}
                    >
                      <button
                        onClick={() => removeUser(m._id)}
                        className="btn btn-sm btn-danger"
                      >
                        Confirm remove
                      </button>
                      <button
                        onClick={() => setDeleteMember(null)}
                        className="btn btn-sm btn-info"
                      >
                        LOL JK
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="team__activity">
          <div>
            {messages.map((m) => (
              <div key={m._id} className="message">
                <div className="comment__image">
                  {m.user.fullName
                    .match(/\b(\w)/g)
                    .join("")
                    .toUpperCase()}
                </div>
                <div className="ms-2">
                  <h5
                    className={`${
                      user._id === m.user._id ? "message--self" : ""
                    }`}
                  >
                    {m.user.fullName}
                  </h5>
                  <p className="message__body">
                    <strong>{m.body}</strong>
                  </p>
                </div>
                <p>{new Date(m.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="team__send-message">
            <input
              onKeyDown={(e) => e.key === "Escape" && e.target.blur()}
              disabled={messageSubmitting}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="form-control me-1"
              type="text"
              placeholder="Send a message to your team"
            />
            <button
              disabled={messageSubmitting}
              className="btn btn-outline-primary"
              type="submit"
            >
              <i className="fa fa-angle-up" aria-hidden="true"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.reducer.user,
});

export default connect(mapStateToProps)(Team);