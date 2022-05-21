import {
  LOGOUT,
  SIGNIN_SUCCESS,
  NOTIFICATION_CREATED,
  NOTIFICATION_REMOVED,
} from "./types";

const { combineReducers } = require("redux");

const initialState = {
  isAuthenticated: null,
  loading: true,
  user: null,
  notifications: [],
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SIGNIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: payload,
        loading: false,
      };

    case LOGOUT:
      return {
        ...state,
        isAuthenticated: null,
        user: null,
        loading: false,
      };

    case NOTIFICATION_CREATED:
      return {
        ...state,
        notifications: [...state.notifications, payload],
      };
    case NOTIFICATION_REMOVED:
      return {
        ...state,
        notifications: state.notifications.filter(
          (alert) => alert.id !== payload
        ),
      };

    default:
      return state;
  }
};

export default combineReducers({ reducer });
