import {
  ISSUE_CREATED,
  LOGOUT,
  SIGNIN_SUCCESS,
  ISSUE_CREATED_DONE,
  NOTIFICATION_CREATED,
  NOTIFICATION_REMOVED,
} from "./types";

const { combineReducers } = require("redux");

/**
 * @description - combine reducers
 * @todo - move to root reducer
 */
const initialState = {
  isAuthenticated: null,
  loading: true,
  user: null,
  created: null,
  notifications: [],
};

/**
 *
 * @param {object} state -initial state object
 * @param {string} action -action type
 * @returns {object} -new state object
 * @description - reducer for the actions created in the actions.js file
 * @todo - move to root reducer
 */
const reducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    // when user signs in
    case SIGNIN_SUCCESS:
      // set isAuthenticated to true and user to payload
      return {
        ...state,
        isAuthenticated: true,
        user: payload,
        loading: false,
      };

    // when user logs out
    case LOGOUT:
      // set isAuthenticated to false and user to null
      return {
        ...state,
        isAuthenticated: null,
        user: null,
        loading: false,
      };

    // when user creates an issue
    case ISSUE_CREATED:
      // set created to payload
      return {
        ...state,
        created: payload,
      };

    // when user creates an issue is done
    case ISSUE_CREATED_DONE:
      // set created to null
      return {
        ...state,
        created: null,
      };

    // when user creates a notification
    case NOTIFICATION_CREATED:
      // add notification to notifications array
      return {
        ...state,
        notifications: [...state.notifications, payload],
      };

    // when user removes a notification
    case NOTIFICATION_REMOVED:
      // remove notification from notifications array
      return {
        ...state,
        notifications: state.notifications.filter(
          (alert) => alert.id !== payload
        ),
      };

    // default
    default:
      // return the reducer state
      return state;
  }
};

export default combineReducers({ reducer });
