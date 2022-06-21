import api, { setAuthToken } from "../axios";
import {
  SIGNIN_SUCCESS,
  LOGOUT,
  ISSUE_CREATED,
  ISSUE_CREATED_DONE,
  NOTIFICATION_CREATED,
  NOTIFICATION_REMOVED,
} from "./types";

/**
 *
 * @param {object} user - user object
 * @returns {object} - action object
 * @description - action creator for signing in a user
 */
export const login = (user) => async (dispatch) => {
  dispatch({
    type: SIGNIN_SUCCESS,
    payload: user,
  });

  // dispatch({
  //     type: NOTIFICATION_CREATED,
  //     payload: { id: Date.now(), message : "Signed in successfully", className : "info-circle text-info" },
  // });
};

/**
 *
 * @returns {object} - action object
 * @description - action creator for signing out a user
 */
export const logout = () => async (dispatch) => {
  localStorage.removeItem("token");
  setAuthToken(null);
  dispatch({
    type: LOGOUT,
  });
};

/**
 *
 * @returns {object} - action object
 * @description - action creator for retrieving auth user if token exists in local storage
 * @todo - move to middleware
 * @todo - move to reducer
 * @error - if token does not exist in local storage
 */
export const retrieveSession = () => async (dispatch) => {
  if (localStorage.getItem("token")) {
    const token = localStorage.getItem("token");
    setAuthToken(token);
    try {
      const user = await api.get("/signin/user");
      if (user)
        dispatch({
          type: SIGNIN_SUCCESS,
          payload: user.data,
        });
    } catch (error) {
      localStorage.removeItem("token");
      setAuthToken(null);
      console.log(error);
    }
  } else {
    setAuthToken(null);
    dispatch({
      type: LOGOUT,
    });
  }
};

/**
 *
 * @param {object} issue - issue object
 * @returns {object} - action object
 * @description - action creator for creating an issue
 */
export const issueCreated = (issue) => async (dispatch) =>
  dispatch({
    type: ISSUE_CREATED,
    payload: issue,
  });

/**
 *
 * @returns {object} - action object
 * @description - action creator for creating an issue is done
 */
export const issueCreatedDone = () => async (dispatch) =>
  dispatch({
    type: ISSUE_CREATED_DONE,
  });

/**
 *
 * @param {string} message - message string
 * @param {string} className - class name string
 * @returns {object} - action object
 * @description - action creator for creating a notification
 */
export const setNotification = (message, className) => async (dispatch) => {
  const id = Date.now();
  dispatch({
    type: NOTIFICATION_CREATED,
    payload: { id, message, className },
  });
  setTimeout(() => dispatch({ type: NOTIFICATION_REMOVED, payload: id }), 3000);
};
