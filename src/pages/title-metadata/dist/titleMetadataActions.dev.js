"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearTitleMetadataFilter = exports.setTitleMetadataFilter = exports.uploadMetadata = exports.storeTitleUserDefinedGridState = exports.clearSeasonPersons = exports.clearTitle = exports.publishTitle = exports.syncTitle = exports.updateTitle = exports.getEditorialMetadata = exports.removeSeasonPerson = exports.propagateAddPersons = exports.getTerritoryMetadata = exports.getExternalIds = exports.getTitle = void 0;

var actionTypes = _interopRequireWildcard(require("./titleMetadataActionTypes"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var getTitle = function getTitle(payload) {
  return {
    type: actionTypes.GET_TITLE,
    payload: payload
  };
};

exports.getTitle = getTitle;

var getExternalIds = function getExternalIds(payload) {
  return {
    type: actionTypes.GET_EXTERNAL_IDS,
    payload: payload
  };
};

exports.getExternalIds = getExternalIds;

var getTerritoryMetadata = function getTerritoryMetadata(payload) {
  return {
    type: actionTypes.GET_TERRITORY_METADATA,
    payload: payload
  };
};

exports.getTerritoryMetadata = getTerritoryMetadata;

var propagateAddPersons = function propagateAddPersons(payload) {
  return {
    type: actionTypes.PROPAGATE_ADD_PERSONS,
    payload: payload
  };
};

exports.propagateAddPersons = propagateAddPersons;

var removeSeasonPerson = function removeSeasonPerson(payload) {
  return {
    type: actionTypes.PROPAGATE_REMOVE_PERSONS,
    payload: payload
  };
};

exports.removeSeasonPerson = removeSeasonPerson;

var getEditorialMetadata = function getEditorialMetadata(payload) {
  return {
    type: actionTypes.GET_EDITORIAL_METADATA,
    payload: payload
  };
};

exports.getEditorialMetadata = getEditorialMetadata;

var updateTitle = function updateTitle(payload) {
  return {
    type: actionTypes.UPDATE_TITLE,
    payload: payload
  };
};

exports.updateTitle = updateTitle;

var syncTitle = function syncTitle(payload) {
  return {
    type: actionTypes.SYNC_TITLE,
    payload: payload
  };
};

exports.syncTitle = syncTitle;

var publishTitle = function publishTitle(payload) {
  return {
    type: actionTypes.PUBLISH_TITLE,
    payload: payload
  };
};

exports.publishTitle = publishTitle;

var clearTitle = function clearTitle() {
  return {
    type: actionTypes.CLEAR_TITLE
  };
};

exports.clearTitle = clearTitle;

var clearSeasonPersons = function clearSeasonPersons() {
  return {
    type: actionTypes.CLEAR_SEASON_PERSONS
  };
};

exports.clearSeasonPersons = clearSeasonPersons;

var storeTitleUserDefinedGridState = function storeTitleUserDefinedGridState(payload) {
  return {
    type: actionTypes.SET_TITLE_USER_DEFINED_GRID_STATE,
    payload: payload
  };
};

exports.storeTitleUserDefinedGridState = storeTitleUserDefinedGridState;

var uploadMetadata = function uploadMetadata(payload) {
  return {
    type: actionTypes.UPLOAD_METADATA,
    payload: payload
  };
};

exports.uploadMetadata = uploadMetadata;

var setTitleMetadataFilter = function setTitleMetadataFilter(payload) {
  return {
    type: actionTypes.SET_TITLE_FILTER,
    payload: payload
  };
};

exports.setTitleMetadataFilter = setTitleMetadataFilter;

var clearTitleMetadataFilter = function clearTitleMetadataFilter() {
  return {
    type: actionTypes.SET_TITLE_FILTER
  };
};

exports.clearTitleMetadataFilter = clearTitleMetadataFilter;