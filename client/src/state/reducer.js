import { LOGOUT, SIGNIN_SUCCESS } from "./types";

const { combineReducers } = require("redux");

const initialState = {
    isAuthenticated: null,
    loading : true,
    user: null,
};

const reducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case SIGNIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                user: payload,
                loading : false
            };

        case LOGOUT:
            return {
                ...state,
                isAuthenticated: null,
                user: null,
                loading : false
            };

        default:
            return state;
    }
}

export default combineReducers({ reducer });