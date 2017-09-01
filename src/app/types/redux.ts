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
import { Dispatch, Action, ThunkAction } from 'redux';
import { Component } from 'react';
import { ComponentClass } from 'react-redux';

// Local
// import { StoreState } from '../store';
import { Reducer } from 'redux-actions';

/** Redux dispatch function configured with this redux store state. */
export type ReduxDispatch = Dispatch<any>;

/**
 * Local interface of react-redux functions that map the redux state to
 * a react component properties.
 */
export type StateToProps<R, P> = (state: any, ownProps: P) => R;

/**
 * Local interface of react-redux function that maps redux dispatch actions
 * to a react component properties.
 */
export type DispatchToProps<R, P> = (
  dispatch: ReduxDispatch,
  ownProps: P,
) => R;

/** Flux standard action with specified paylaod type. */
export interface ReduxAction<Payload> extends Action {
  /** Type of action. */
  type: string;
  /** Data passed with the action. */
  payload: Payload;
  /** If the action is an error type. */
  error?: boolean;
}

export type ReduxActionCreator<P> = (payload: P) => ReduxAction<P>;

/** Thunk action that returns a promise that returns undefined. */
export type ThunkActionPromise = ThunkAction<
  Promise<void>,
  any,
  undefined
>;

/** Thunk action that returns undefined. */
export type ThunkActionVoid = ThunkAction<void, any, undefined>;

/** Root component of a route specified in react-router. */
export type ViewComponent = ComponentClass<any>;
