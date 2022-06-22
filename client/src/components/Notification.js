import React from "react";
import { connect } from "react-redux";

const Notification = ({ notifications }) => {
  return notifications.length > 0 ? (
    <div className={`notifications`}>
      {notifications.map(({ id, message, className }) => (
        <p key={id}>
          <i className={`fa fa-${className}`} aria-hidden="true"></i> {message}
        </p>
      ))}
    </div>
  ) : null;
};

const mapStateToProps = (state) => ({
  notifications: state.reducer.notifications,
});

export default connect(mapStateToProps)(Notification);
