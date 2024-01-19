import React, { createContext, useContext, useReducer } from 'react';

const INITIAL_STATE = {
    loading: false,
    isLoggedIn: false,
    token: null,
};

export const actions = {
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
    USER_LOADED: 'USER_LOADED',
    LOGOUT: 'LOGOUT',
    LOGGED_IN: 'LOGGED_IN',
};

const reduder = (state, action) => {
    switch (action.type) {
        case actions.LOGGED_IN:
            return {
                ...state,
                token: action.payload.token,
                isLoggedIn: true,
                loading: false,
            };

        case actions.USER_LOADED:
            return {
                ...state,
                token: action.payload.token,
                isLoggedIn: true,
                loading: false,
            };

        case actions.AUTHENTICATION_ERROR:
        case actions.LOGOUT:
            localStorage.clear('token');
            return {
                ...state,
                token: null,
                isLoggedIn: false,
            };
        default:
            return state;
    }
};
export const AuthContext = createContext();
function AuthContextProvider({ children }) {
    const [state, dispatch] = useReducer(reduder, INITIAL_STATE);

    return <AuthContext.Provider value={{ dispatch, state }}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
