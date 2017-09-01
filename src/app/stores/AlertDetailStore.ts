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
import { observable, action } from 'mobx';
import * as _ from 'lodash';

// Local
import { RootStore } from '~/stores';
import {
  AlertDetail,
  AlertUpdateRequest,
} from '~/services/alerts/types';
import {
  LocationFieldAddress,
  Markers,
} from '~/services/map/types';
import * as alertAPI from '~/services/alerts/utils/alertsAPI';
import { getLocationsWithAddress } from '~/services/map/utils/getLocationsWithAddress';
import { ContainerNested } from '~/services/containers/types';
import {
  Result,
  ResultIPAdresses
} from '~/types/result';
import { createLocationGeoJSON } from '~/services/map/utils/createLocationGeoJSON';
import { checkAlertUpdate } from '~/services/alerts/utils/checkAlertUpdate';
import { modifyAlertUpdate } from '~/services/alerts/utils/modifyAlertUpdate';
import { createAlertUpdateComment } from '~/services/alerts/utils/createAlertUpdateComment';
import { Action } from '~/services/actions/types';
import { fetchAllActions } from '~/services/actions/api';
import { getFieldsOfType } from '~/services/containers/utils/containerUtils';
import { CONTAINER_FIELDS } from '~/services/containers/constants';
import { isNull } from 'util';

export class AlertDetailStore {
  @observable public id: number = 0;
  @observable public actions: Action[];
  @observable public alert?: AlertDetail;
  @observable public errors: string[] = [];
  @observable public isLoading: boolean = false;
  @observable public IPAddresses?: ResultIPAdresses;
  @observable public locations: LocationFieldAddress[] = [];
  @observable public markers?: Markers;
  @observable public isModalActive: boolean = false;

  private promiseID: symbol = Symbol();
  private stores: RootStore;

  constructor(stores: RootStore) {
    this.stores = stores;
  }

  /**
   * Fetches the alert to display in the alert detail view.
   * @param {number} id ID of the alert.
   * @returns {Promise<void>}
   */
  @action
  public fetchAlert = (id: number): Promise<void> => {
    const promiseID = this.resetPromiseID();

    this.isLoading = true;
    this.id = id;

    return alertAPI.fetchAlert(id)
      .then((alert) => {
        if (this.isValidPromiseID(promiseID)) {
          this.setAlert(alert).then(() => {
            this.isLoading = false;
          });
        }
      })
      .catch((error) => {
        if (this.isValidPromiseID(promiseID)) {
          this.stores.errorStore.add(error);
          this.isLoading = false;
        }
      });
  };

  /**
   * Updates the current alert in the alert detail view.
   * @param {AlertUpdateRequest} fields Fields to update on the alert.
   * @returns {Promise<void>}
   */
  @action
  public update = (fields: AlertUpdateRequest): Promise<void> => {
    if (!this.alert) { return this.raiseMissingAlertError(); }

    const request = checkAlertUpdate(this.alert, fields);

    if (request.valid) { return this.sendAlertUpdate(this.alert, fields); }

    this.errors = request.errors;

    return Promise.reject('Alert update invalid.');
  };

  @action
  public clearErrors = (): void => {
    this.errors = [];
  };

  /**
   * Performs an action on the current alert.
   * @param {number} actionID ID of the action to perform.
   * @returns {Promise<void>}
   */
  @action
  public performAction = (actionID: number): Promise<void> => {
    if (!this.alert) { return this.raiseMissingAlertError(); }

    const promiseID = this.resetPromiseID();

    this.isLoading = true;

    return alertAPI.performAction(actionID, this.alert.id)
      .then((alert) => {
        if (this.isValidPromiseID(promiseID)) {
          this.alert = alert;
          this.isLoading = false;
        }
      })
      .catch((error) => {
        this.stores.errorStore.add(error);
        this.isLoading = false;
      });
  };

  @action
  public fetchActions = (): Promise<void> => {
    return fetchAllActions()
      .then((actions) => { this.actions = actions; })
      .catch((error) => { this.stores.errorStore.add(error); });
  };

  @action
  public openModal = () => {
    this.isModalActive = true;
    this.getIPAddresses();
  };

  @action
  public closeModal = () => {
    this.isModalActive = false;
  };

  @action
  public addComment = (comment: string) => {
    if (!this.alert) { return this.raiseMissingAlertError(); }

    const promiseID = this.resetPromiseID();

    this.isLoading = true;

    return alertAPI.addComment(this.alert.id, comment)
      .then((alert) => {
        if (!this.isValidPromiseID(promiseID)) { return; }
        this.alert = alert;
        this.isLoading = false;
      })
      .catch((error) => {
        this.stores.errorStore.add(error);
      });
  };

  @action
  private getIPAddresses = () => {
    if (!this.alert || !this.alert.distillery) { return; }

    const IPAddresses = getFieldsOfType<string>(
      CONTAINER_FIELDS.IP_ADDRESS,
      this.alert.distillery.container,
      this.alert.data,
    );

    if (!IPAddresses) { return; }

    const nonNullIPAddresses = _.pickBy(IPAddresses, (value) => value !== null);

    if (!_.isEmpty(nonNullIPAddresses)) { this.IPAddresses = IPAddresses; }
  };

  /**
   * Returns a rejected promise explaining that there is currently no
   * selected alert for the alert detail view.
   * @returns {Promise<void>}
   */
  private raiseMissingAlertError = (): Promise<void> => {
    return Promise.reject('Missing alert object.');
  };

  /**
   * Sends a valid alert update to the Cyphon API.
   * @param {AlertDetail} alert
   * @param {AlertUpdateRequest} fields
   * @returns {Promise<void>}
   */
  @action
  private sendAlertUpdate = (
    alert: AlertDetail,
    fields: AlertUpdateRequest,
  ): Promise<void> => {
    const promiseID = this.resetPromiseID();
    const modifiedFields = modifyAlertUpdate(alert, fields);

    this.isLoading = true;

    return alertAPI.updateAlert(alert.id, modifiedFields)
      .then((update) => {
        const comment = createAlertUpdateComment(alert, fields);

        if (comment) {
          return this.sendAlertUpdateComment(alert.id, comment, promiseID)
            .then(() => { this.isLoading = false; });
        }

        if (this.isValidPromiseID(promiseID)) {
          this.alert = update;
          this.isLoading = false;
        }
      });
  };

  @action
  private sendAlertUpdateComment = (
    id: number,
    comment: string,
    promiseID: symbol,
  ): Promise<void> => {
    return alertAPI.addComment(id, comment)
      .then((alert) => {
        if (this.isValidPromiseID(promiseID)) {
          this.alert = alert;
        }
      })
      .catch((error) => {
        this.stores.errorStore.add(error);
      });
  };

  @action
  private setAlert = (alert: AlertDetail): Promise<void> => {
    if (!alert.distillery) {
      this.alert = alert;
      return Promise.resolve();
    }

    return this.fetchGeolocationData(alert.distillery.container, alert.data);
  };

  @action
  private fetchGeolocationData = (
    container: ContainerNested,
    data: Result,
  ): Promise<void> => {
    return getLocationsWithAddress(container, data)
      .then((locations) => {
        const markers = locations.length
          ? createLocationGeoJSON(locations)
          : undefined;

        this.markers = markers;
        this.locations = locations;
      })
      .catch((error) => {
        this.stores.errorStore.add(error);
      });
  };

  private resetPromiseID = (): symbol => {
    const promiseID = Symbol();

    this.promiseID = promiseID;

    return promiseID;
  };

  private isValidPromiseID = (promiseID: symbol): boolean => {
    return this.promiseID === promiseID;
  };
}
