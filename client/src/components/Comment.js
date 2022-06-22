import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import api from "../axios";

const Comment = ({
  comment: commentProp,
  user: activeUser,
  activeComment,
  setActiveComment,
  commentDeleteModal,
  setCommentDeleteModal,
  deleteComment,
}) => {
  const [comment, setComment] = useState(null);
  const [unmounted, setUnmounted] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);

  useEffect(() => {
    if (!unmounted) setComment(commentProp);
    return () => setUnmounted(true);
  }, [commentProp, unmounted]);

  if (!comment || !activeUser) return null;
  const { _id, user, body, createdAt } = comment;
  const editing = activeComment === _id;
  const deleting = commentDeleteModal === _id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnDisabled(true);
    try {
      await api.patch(`/comments/${_id}`, comment);
    } catch (error) {
      console.log(error.response);
    } finally {
      setActiveComment(null);
      setBtnDisabled(false);
    }
  };

  const getButtons = () => {
    if (activeUser._id === user._id)
      return editing ? (
        <input
          value="Save"
          onClick={(e) => e.stopPropagation()}
          type="submit"
          disabled={btnDisabled}
          className="btn btn-sm btn-primary"
        />
      ) : (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveComment(_id);
            }}
            className="btn btn-link"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCommentDeleteModal(_id);
            }}
            className="btn btn-link ms-2"
          >
            Delete
          </button>
        </>
      );
  };

  return (
    <div className="comment">
      <div className="comment__image">
        {user.fullName
          .match(/\b(\w)/g)
          .join("")
          .toUpperCase()}
      </div>
      <div className="comment__main ms-2">
        <h5>{user.fullName}</h5>
        <form className="comment__body" onSubmit={handleSubmit}>
          <textarea
            onClick={(e) => e.stopPropagation()}
            className={`${editing ? "input-active" : ""}`}
            disabled={!editing || btnDisabled}
            onChange={(e) => setComment({ ...comment, body: e.target.value })}
            value={body}
          ></textarea>
          <div className="comment__btns">
            {getButtons()}
            {deleting && (
              <div
                className="delete-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <h5>
                  <i
                    className="fa fa-exclamation-triangle"
                    aria-hidden="true"
                  ></i>{" "}
                  Delete this comment?
                </h5>
                <p>Once you delete, it's gone for good.</p>
                <div className="text-end mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteComment(_id);
                    }}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setCommentDeleteModal(null)}
                    className="btn btn-sm btn-light ms-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
      <div className="comment__timestamps ms-2">
        <p>{new Date(createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.reducer.user,
});

export default connect(mapStateToProps)(Comment);
