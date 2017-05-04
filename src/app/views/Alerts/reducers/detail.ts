/**
 * The contents of this file are subject to the CYPHON Proprietary Non-
 * Commercial Registered User Use License Agreement (the "Agreement”). You
 * may not use this file except in compliance with the Agreement, a copy
 * of which may be found at https://github.com/dunbarcyber/cyclops/. The
 * developer of the CYPHON technology and platform is Dunbar Security
 * Systems, Inc.
 *
 * The CYPHON technology or platform are distributed under the Agreement on
 * an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or
 * implied. See the Agreement for specific terms.
 *
 * Copyright (C) 2017 Dunbar Security Solutions, Inc. All Rights Reserved.
 *
 * Contributor/Change Made By: ________________. [Only apply if changes
 * are made]
 */

// Vendor
import {
  handleActions,
  Reducer,
  ReducerMap,
} from 'redux-actions';
import * as _ from 'lodash';

// Local
import {
  LocationFieldAddress,
  Markers,
} from '../../../services/map/types';
import { AlertDetail } from '../../../api/alerts/types';
import * as actions from '../actions/detail';
import { ResultIPAdresses } from '../../../types/result';
import { RequestCanceler } from '../../../utils/RequestCanceler';

/** State shape of the AlertDetail reducer. */
export interface State {
  /** ID of the currently selected alerts. */
  alertId: number | null;
  /** Locations from the alerts data with their addresses. */
  locations: LocationFieldAddress[] | null;
  /** GeoJSON markers of the currently selected alerts. */
  markers: Markers | null;
  /** Currently selected alerts. */
  alert: AlertDetail | null;
  /** If a loading icon should be shown. */
  loading: boolean;
  /** IP address fields related to the alert. */
  ipAddresses: ResultIPAdresses | null;
  /** If the data modal is active. */
  modalActive: boolean;
  /** Error message that doesn't require the error popup. */
  error: string[];
}

/**
 * Initial state of the AlertDetail reducer.
 * @type {State}
 */
export const INITIAL_STATE: State = {
  alert: null,
  alertId: null,
  ipAddresses: null,
  loading: false,
  locations: [],
  markers: null,
  modalActive: false,
  error: [],
};

const reducers: ReducerMap<State, any> = {};

const request = new RequestCanceler();

/**
 * Updates the AlertDetail reducer based on a(n) CLOSE_ALERT action.
 * @param state Current AlertDetail reducer state.
 * @param action CLOSE_ALERT action.
 * @returns {State} Updated AlertDetail reducer state.
 */
reducers[actions.CLOSE_ALERT] = (
  state: State,
  action: actions.CloseAlertAction,
): State => {
  request.cancel();

  return Object.assign({}, state, INITIAL_STATE);
};

/**
 * Updates the AlertDetail reducer based on a(n) FETCH_ALERT_PENDING action.
 * @param state Current AlertDetail reducer state.
 * @param action FETCH_ALERT_PENDING action.
 * @returns {State} Updated AlertDetail reducer state.
 */
reducers[actions.FETCH_ALERT_PENDING] = (
  state: State,
  action: actions.FetchAlertPendingAction,
): State => {
  const update: Partial<State> = {
    alertId: action.payload.alertId,
    loading: true,
  };

  request.cancel();
  request.set(action.payload.canceler);

  return Object.assign({}, state, update);
};

/**
 * Updates the AlertDetail reducer based on a(n) FETCH_ALERT_SUCCESS action.
 * @param state Current AlertDetail reducer state.
 * @param action FETCH_ALERT_SUCCESS action.
 * @returns {State} Updated AlertDetail reducer state.
 */
reducers[actions.FETCH_ALERT_SUCCESS] = (
  state: State,
  action: actions.FetchAlertSuccessAction,
): State => {
  const update: Partial<State> = {
    alert: action.payload.alert,
    loading: false,
    locations: action.payload.locations,
    markers: action.payload.markers,
  };

  return Object.assign({}, state, update);
};

/**
 * Updates the AlertDetail reducer based on a(n) REQUEST_PENDING action.
 * @param state Current AlertDetail reducer state.
 * @param action REQUEST_PENDING action.
 * @returns {State} Updated AlertDetail reducer state.
 */
reducers[actions.REQUEST_PENDING] = (
  state: State,
  action: actions.RequestPendingAction,
): State => {
  const update: Partial<State> = {
    loading: true,
  };

  request.cancel();
  request.set(action.payload);

  return Object.assign({}, state, update);
};

/**
 * Updates the AlertDetail reducer based on a(n) REQUEST_FAILED action.
 * @param state Current AlertDetail reducer state.
 * @param action REQUEST_FAILED action.
 * @returns {State} Updated AlertDetail reducer state.
 */
reducers[actions.REQUEST_FAILED] = (
  state: State,
  action: actions.RequestFailedAction,
): State => {
  const update: Partial<State> = {
    loading: false,
  };

  return Object.assign({}, state, update);
};

/**
 * Updates the AlertDetail reducer based on a(n) UPDATE_ALERT_SUCCESS action.
 * @param state Current AlertDetail reducer state.
 * @param action UPDATE_ALERT_SUCCESS action.
 * @returns {State} Updated AlertDetail reducer state.
 */
reducers[actions.UPDATE_ALERT_SUCCESS] = (
  state: State,
  action: actions.UpdateAlertSuccessAction,
): State => {
  const update: Partial<State> = {
    alert: Object.assign({}, state.alert, action.payload),
    loading: false,
  };

  return Object.assign({}, state, update);
};

/**
 * Updates the AlertDetail reducer based on a(n) OPEN_DATA_MODAL action.
 * @param state Current AlertDetail reducer state.
 * @param action OPEN_DATA_MODAL action.
 * @returns {State} Updated AlertDetail reducer state.
 */
reducers[actions.OPEN_DATA_MODAL] = (
  state: State,
  action: actions.OpenDataModalAction,
): State => {
  const update: Partial<State> = {
    ipAddresses: action.payload,
    modalActive: true,
  };

  return Object.assign({}, state, update);
};

/**
 * Updates the AlertDetail reducer based on a(n) CLOSE_DATA_MODAL action.
 * @param state Current AlertDetail reducer state.
 * @param action CLOSE_DATA_MODAL action.
 * @returns {State} Updated AlertDetail reducer state.
 */
reducers[actions.CLOSE_DATA_MODAL] = (
  state: State,
  action: actions.CloseDataModalAction,
): State => {
  const update: Partial<State> = {
    modalActive: false,
  };

  return Object.assign({}, state, update);
};

/**
 * Updates the AlertDetailReducer based on a(n) ADD_ERROR_MESSAGE action.
 * @param state Current AlertDetailReducer state.
 * @param action ADD_ERROR_MESSAGE action.
 * @returns {State} Updated AlertDetailReducer state.
 */
reducers[actions.ADD_ERROR_MESSAGE] = (
  state: State,
  action: actions.AddErrorMessageAction,
): State => {
  const update: Partial<State> = {
    error: action.payload,
  };

  return Object.assign({}, state, update);
};

/**
 * Updates the AlertDetailReducer based on a(n) CLOSE_ERROR_MESSAGE action.
 * @param state Current AlertDetailReducer state.
 * @param action CLOSE_ERROR_MESSAGE action.
 * @returns {State} Updated AlertDetailReducer state.
 */
reducers[actions.CLOSE_ERROR_MESSAGE] = (
  state: State,
  action: actions.CloseErrorMessageAction,
): State => {
  const update: Partial<State> = {
    error: [],
  };

  return Object.assign({}, state, update);
};

/**
 * Reducer for the alert detail view.
 * @type {Reducer<State, any>}
 */
export const reducer = handleActions<State, any>(reducers, INITIAL_STATE);