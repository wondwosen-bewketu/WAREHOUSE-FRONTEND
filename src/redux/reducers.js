// reducers.js

import { combineReducers } from "redux";
import userReducer from "./slice/userSlice"; // Add userReducer

const rootReducer = combineReducers({
  user: userReducer
});

export default rootReducer;
