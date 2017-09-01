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
import * as React from 'react';
import { ListGroupItem } from 'react-bootstrap';

// Local
import { Monitor } from '~/services/monitors/types';

// --------------------------------------------------------------------------
// Interfaces/Types
// --------------------------------------------------------------------------

/** Properties of the MonitorModalListItem component. */
interface Props {
  /** Monitor to view as a list item. */
  monitorName: string;
  /** Name of the currently selected monitor. */
  selectedMonitorName?: string;
  /**
   * Selects a monitor to view detailed information on.
   * @param monitor
   */
  selectMonitor(monitor: string): any;
}

// --------------------------------------------------------------------------
// Component
// --------------------------------------------------------------------------

/**
 * Displays a monitor list item that can be used to select a monitor to
 * view more information on.
 */
export class MonitorModalListItem extends React.Component<Props, {}> {

  /**
   * Selects this monitor to be viewed.
   */
  public selectMonitor = (): void => {
    this.props.selectMonitor(this.props.monitorName);
  };

  /**
   * Renders the component.
   * @returns {JSX.Element}
   */
  public render(): JSX.Element {

    return (
      <ListGroupItem
        active={this.props.selectedMonitorName === this.props.monitorName}
        key={this.props.monitorName}
        onClick={this.selectMonitor}
      >
        {this.props.monitorName}
      </ListGroupItem>
    );
  }
}
