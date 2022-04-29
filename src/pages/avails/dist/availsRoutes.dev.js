"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.AVAILS_PATH = void 0;

const _react = _interopRequireDefault(require("react"));

const _ability = require("@vubiquity-nexus/portal-utils/lib/ability");
const _reactRouterDom = require("react-router-dom");

const _RightsCreateFromAttachment = _interopRequireDefault(require("../legacy/containers/avail/create/ManualRightsEntry/RightsCreateFromAttachment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; const cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } const cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } const newObj = {}; const hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (const key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { const desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// use webpack prefetch for legacy routes
const RightCreate = _react["default"].lazy(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('../legacy/containers/avail/create/RightCreate'));
  });
});

const RightDetails = _react["default"].lazy(function () {
  return RightDetailsImport;
});

var RightDetailsImport = Promise.resolve().then(function () {
  return _interopRequireWildcard(require('./right-details/RightDetails'));
});
const RightMatchingViewImport = Promise.resolve().then(function () {
  return _interopRequireWildcard(require('./right-matching/RightMatchingView'));
});

const RightMatchingView = _react["default"].lazy(function () {
  return RightMatchingViewImport;
});

const AvailsViewImport = Promise.resolve().then(function () {
  return _interopRequireWildcard(require('./AvailsView'));
});

const AvailsView = _react["default"].lazy(function () {
  return AvailsViewImport;
});

const RightToMatchViewImport = Promise.resolve().then(function () {
  return _interopRequireWildcard(require('./right-matching/right-to-match/RightToMatchView'));
});

const RightToMatchView = _react["default"].lazy(function () {
  return RightToMatchViewImport;
});

const RightToRightMatchMergeImport = Promise.resolve().then(function () {
  return _interopRequireWildcard(require('./right-matching/right-to-match/RightToMatchView'));
});

const RightToRightMatchMerge = _react["default"].lazy(function () {
  return RightToRightMatchMergeImport;
});

const MatchRightViewImport = Promise.resolve().then(function () {
  return _interopRequireWildcard(require('./right-matching/match-rights/MatchRightsView'));
});

const MatchRightView = _react["default"].lazy(function () {
  return MatchRightViewImport;
});

const MatchRightViewMergeImport = Promise.resolve().then(function () {
  return _interopRequireWildcard(require('./right-matching/match-rights/MatchRightsView'));
});

const MatchRightViewMerge = _react["default"].lazy(function () {
  return MatchRightViewMergeImport;
});

const TitleMatchReviewImport = Promise.resolve().then(function () {
  return _interopRequireWildcard(require('./title-matching/TitleMatchReview/TitleMatchReview'));
});

const TitleMatchReview = _react["default"].lazy(function () {
  return TitleMatchReviewImport;
});

const AVAILS_PATH = '/avails';
exports.AVAILS_PATH = AVAILS_PATH;
const routes = [{
  index: true,
  key: 'avails',
  element: (0, _ability.canRender)(AvailsView, 'read', 'Avail')
}, {
  path: 'rights',
  element: _reactRouterDom.Outlet,
  children: [{
    path: 'create',
    element: (0, _ability.canRender)(RightCreate, 'create', 'Avail')
  }, {
    path: ':id',
    element: (0, _ability.canRender)(RightDetails, 'update', 'Avail')
  }, {
    path: ':rightId/title-matching',
    element: _reactRouterDom.Outlet,
    children: [{
      path: 'review',
      element: (0, _ability.canRender)(TitleMatchReview, 'update', 'Metadata')
    }]
  }]
}, {
  path: 'history',
  element: _reactRouterDom.Outlet,
  children: [{
    path: 'manual-rights-entry',
    element: (0, _ability.canRender)(_RightsCreateFromAttachment["default"], 'create', 'Avail')
  }, {
    path: ':availHistoryId/rights/create',
    element: (0, _ability.canRender)(RightCreate, 'create', 'Avail')
  }, {
    path: ':availHistoryIds/right-matching',
    element: _reactRouterDom.Outlet,
    children: [{
      key: 'availHistoryIds/right-matching',
      index: true,
      element: (0, _ability.canRender)(RightMatchingView, 'update', 'Avail')
    }, {
      path: ':rightId',
      element: (0, _ability.canRender)(RightToMatchView, 'update', 'Avail')
    }, {
      path: ':rightId/match/:matchedRightIds',
      element: (0, _ability.canRender)(MatchRightView, 'update', 'Avail')
    }]
  }, {
    path: ':availHistoryIds/manual-rights-entry',
    element: (0, _ability.canRender)(_RightsCreateFromAttachment["default"], 'create', 'Avail')
  }]
}, {
  path: 'right-matching',
  element: _reactRouterDom.Outlet,
  children: [{
    key: 'right-matching',
    index: true,
    element: (0, _ability.canRender)(RightToRightMatchMerge, 'update', 'Avail')
  }, {
    path: 'preview',
    element: (0, _ability.canRender)(MatchRightViewMerge, 'update', 'Avail')
  }]
}];
const _default = routes;
exports["default"] = _default;