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
import { ReducerMap, handleActions } from 'redux-actions';

// Local
import * as actions from '../actions/ErroPopupActions';
import { StoredError } from '../../../services/errors/types';

/** SearchQueryState shape of the ErrorPopup reducer. */
export interface ErrorPopupState {
  /** Current errors to make the user aware of. */
  errors: StoredError[];
  /** Currently viewed error in the popup. */
  current: number;
}

type PartialState = Partial<ErrorPopupState>;

/**
 * Initial state of the ErrorPopup reducer.
 * @type {State}
 */
const INITIAL_STATE: ErrorPopupState = {
  current: 0,
  errors: [],
};

/**
 * Object used to map reducer functions to action types modifying the
 * ErrorPopup reducer state.
 * @type {ReducerMap<State, any>}
 */
const reducers: ReducerMap<ErrorPopupState, any> = {};

/**
 * Updates the ErrorPopup reducer based on a(n) ADD_ERROR action.
 * @param state Current ErrorPopup reducer state.
 * @param action ADD_ERROR action.
 * @returns {ErrorPopupState} Updated ErrorPopup reducer state.
 */
reducers[actions.ADD_ERROR] = (
  state: ErrorPopupState,
  action: actions.AddErrorAction,
): ErrorPopupState => {
  const update: PartialState = {
    errors: [...state.errors, action.payload],
  };

  return Object.assign({}, state, update);
};

/**
 * Updates the ErrorPopup reducer based on a(n) VIEW_ERROR action.
 * @param state Current ErrorPopup reducer state.
 * @param action VIEW_ERROR action.
 * @returns {State} Updated ErrorPopup reducer state.
 */
reducers[actions.VIEW_ERROR] = (
  state: ErrorPopupState,
  action: actions.ViewErrorAction,
): ErrorPopupState => {
  const update: PartialState = {
    current: action.payload,
  };

  return Object.assign({}, state, update);
};

/**
 * Updates the ErrorPopup reducer based on a(n) CLEAR_ERRORS action.
 * @param state Current ErrorPopup reducer state.
 * @param action CLEAR_ERRORS action.
 * @returns {State} Updated ErrorPopup reducer state.
 */
reducers[actions.CLEAR_ERRORS] = (
  state: ErrorPopupState,
  action: actions.ClearErrorsAction,
): ErrorPopupState => {
  return Object.assign({}, state, INITIAL_STATE);
};

/**
 * ErrorPopup reducer.
 * @type {@type {Reducer<SearchQueryState, any>}
 */
export const ErrorPopupReducer = handleActions<ErrorPopupState, any>(
  reducers,
  INITIAL_STATE,
);
