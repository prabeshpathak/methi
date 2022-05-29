import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import api from "../axios";
import TeamLoader from "./TeamLoader";
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

    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.reducer.user,
});

export default connect(mapStateToProps)(Team);