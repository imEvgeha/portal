import {
  LOAD_PROFILE_INFO} from "../constants/action-types";

export const loadProfileInfo = profileInfo => ({ type: LOAD_PROFILE_INFO, payload: profileInfo });
