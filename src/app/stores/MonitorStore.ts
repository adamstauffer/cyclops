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
import { observable, action, computed } from 'mobx';

// Local
import { RootStore } from './';
import { MonitorNested } from '~/services/monitors/types';
import { fetchAllMonitors } from '~/services/monitors/utils/monitorAPI';
import { PromiseID } from '~/utils/PromiseID';
import { Timeout } from '~/utils/Timeout';

const ACTIVE_STATUS = 'GREEN';
const POLLING_INTERVAL = 60000;

export class MonitorStore {
  @observable public isLoading: boolean = false;
  @observable public isModalActive: boolean = false;
  @observable public monitors: MonitorNested[] = [];
  @observable public selected?: string;

  private stores: RootStore;
  private promiseID: PromiseID = new PromiseID();
  private timeout: Timeout = new Timeout(POLLING_INTERVAL);

  constructor(stores: RootStore) {
    this.stores = stores;
  }

  @computed
  public get down(): MonitorNested[] {
    return this.monitors.filter((monitor) => monitor.status !== ACTIVE_STATUS);
  }

  @computed
  public get up(): MonitorNested[] {
    return this.monitors.filter((monitor) => monitor.status === ACTIVE_STATUS);
  }

  @action
  public fetchMonitors = (): Promise<void> => {
    const promiseID = this.promiseID.reset();

    this.isLoading = true;

    return fetchAllMonitors()
      .then((monitors) => {
        if (this.promiseID.matches(promiseID)) {
          this.monitors = monitors;
          this.isLoading = false;
          this.startTimeout(promiseID);
        }
      })
      .catch((error) => {
        this.stores.errorStore.add(error);

        if (this.promiseID.matches(promiseID)) { this.isLoading = false; }
      });
  };

  @action
  public openModal = (): Promise<void> => {
    this.isModalActive = true;

    return this.fetchMonitors();
  };

  @action
  public closeModal = (): void => {
    this.isModalActive = false;
  };

  @action
  private poll = (): Promise<void> => {
    const promiseID = this.promiseID.reset();

    this.timeout.clear();

    return fetchAllMonitors()
      .then((monitors) => {
        if (this.promiseID.matches(promiseID)) {
          this.monitors = monitors;
          this.startTimeout(promiseID);
        }
      })
      .catch((error) => {
        this.stores.errorStore.add(error);
      });
  };

  private startTimeout = (promiseID: PromiseID): void => {
    this.timeout.start(() => {
      if (this.promiseID.matches(promiseID)) { this.poll(); }
    });
  };
}