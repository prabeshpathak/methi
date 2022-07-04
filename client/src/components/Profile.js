import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import api from "../axios";
import { login, setNotification } from "../state/actions";

const Profile = ({ user, login, setNotification }) => {
  const [formdata, setFormData] = useState(null);

  useEffect(() => {
    if (user) setFormData({ fullName: user.fullName, email: user.email });
  }, [user]);

  const updateProfile = async (e) => {
    e?.preventDefault();
    try {
      await api.patch("/signin/user", formdata);
      login({ ...user, fullName: formdata.fullName, email: formdata.email });
      setNotification("Profile updated");
    } catch (error) {
      setFormData({ fullName: user.fullName, email: user.email });
      if (error.response?.status === 409)
        return setNotification(error.response.data, "exclamation-triangle");
      console.log(error.response);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape" || e.key === "Enter") e.target.blur();
    if (e.key === "Enter") updateProfile();
  };
  return (
    <div className="project-settings mt-5">
      <form className="m-auto mt-5" onSubmit={updateProfile}>
        <h2>Profile</h2>
        {formdata && (
          <>
            <label className="text-secondary" htmlFor="email">
              Email
            </label>
            <input
              onKeyDown={handleKeyDown}
              className="form-control mb-3"
              required
              value={formdata.email}
              disabled
              onChange={(e) =>
                setFormData({ ...formdata, [e.target.name]: e.target.value })
              }
              type="text"
              name="email"
              id="email"
            />
            <label className="text-secondary" htmlFor="fullName">
              Full Name
            </label>
            <input
              onKeyDown={handleKeyDown}
              className="form-control mb-3"
              required
              value={formdata.fullName}
              onChange={(e) =>
                setFormData({ ...formdata, [e.target.name]: e.target.value })
              }
              type="text"
              name="fullName"
              id="fullName"
            />
            <button className="btn btn-primary" type="submit">
              Save
            </button>
          </>
        )}
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.reducer.user,
});

export default connect(mapStateToProps, { login, setNotification })(Profile);
