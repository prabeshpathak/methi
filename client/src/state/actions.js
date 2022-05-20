import api, { setAuthToken } from "../axios";
import { SIGNIN_SUCCESS, LOGOUT } from "./types";
import firebase from "firebase/compat";

export const login = (user) => async (dispatch) => {
  dispatch({
    type: SIGNIN_SUCCESS,
    payload: user,
  });
};

export const logout = () => async (dispatch) => {
  localStorage.removeItem("token");
  firebase.auth().signOut();
  setAuthToken(null);
  dispatch({
    type: LOGOUT,
  });
};

// Retrieve and auth user if token exists in local storage
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
