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
import { bindActionCreators as bind } from 'redux';
import {
  ComponentClass,
  connect,
} from 'react-redux';

// Local
import {
  DispatchToProps,
  StateToProps,
} from '~/types/redux';
import * as actions from '../actions/AlertViewActions';
import { fetchAllCategories } from '~/services/alerts/actions/categoryActions';

// --------------------------------------------------------------------------
// Interfaces/Types
// --------------------------------------------------------------------------

// /** Container properties. */
// interface ContainerProps {
//   location: LocationDescriptor;
//   router: InjectedRouter;
// }
//
// /** Function that maps the redux state to the wrapped component. */
// type Values = StateToProps<ValueProps, ContainerProps>;
//
// /** Function that maps redux dispatch functions to the wrapped component. */
// type Functions = DispatchToProps<FunctionProps, ContainerProps>;
//
// /** Container type. */
// type Container = ComponentClass<ContainerProps>;
//
// // --------------------------------------------------------------------------
// // Property Mapping
// // --------------------------------------------------------------------------
//
// /**
//  * Maps the redux state to wrapped component properties.
//  * @param state Redux state.
//  * @param props Container properties.
//  */
// const values: Values = (state, props) => ({
//   alerts: state.routes.AlertList.AlertView.alerts,
//   categories: state.services.alerts.categories,
//   count: state.routes.AlertList.AlertView.count,
//   distilleries: state.routes.AlertList.AlertView.distilleries,
//   interval: state.routes.AlertList.AlertView.interval,
//   loading: state.routes.AlertList.AlertView.loading,
//   location: props.location,
//   polling: state.routes.AlertList.AlertView.polling,
//   pollingEnabled: state.routes.AlertList.AlertView.pollingEnabled,
//   router: props.router,
//   selectedAlert: state.routes.AlertDetail.AlertDetail.alertId,
//   users: state.routes.AlertList.AlertView.users,
// });
//
// /**
//  * Maps redux dispatch functions to wrapped component properties.
//  * @param dispatch Dispatch function for the redux store.
//  */
// const functions: Functions = (dispatch) => ({
//   fetchAllCategories: bind(fetchAllCategories, dispatch),
//   disablePolling: bind(actions.disablePolling, dispatch),
//   fetchViewResources: bind(actions.fetchViewResources, dispatch),
//   searchAlerts: bind(actions.searchAlerts, dispatch),
//   startPolling: bind(actions.pollAlerts, dispatch),
//   stopPolling: bind(actions.stopPolling, dispatch),
// });
//
// // --------------------------------------------------------------------------
// // Container
// // --------------------------------------------------------------------------
//
// /**
//  * Container for the AlertView component.
//  * @type {Container}
//  */
// export const AlertViewContainer: Container = withRouter(
//   connect(
//     values,
//     functions,
//   )(AlertView),
// );
