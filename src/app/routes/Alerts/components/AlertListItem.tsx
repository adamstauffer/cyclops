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
import * as classnames from 'classnames';

// Local
import { AlertLevelIcon } from '../../../services/alerts/components/AlertLevelIcon';
import { AlertStatusIcon } from '../../../services/alerts/components/AlertStatusIcon';
import { AlertListItem as Alert } from '../../../services/alerts/types';
import { getUserFullName } from '../../../services/users/utils/getUserFullName';
import { formatDate } from '../../../utils/dateUtils';
import { shortenDistilleryName } from '../../../services/distilleries/utils/distilleryUtils';

// --------------------------------------------------------------------------
// Interfaces/Types
// --------------------------------------------------------------------------

/** Properties of the AlertListItem component. */
interface Props {
  /** Alert to display. */
  alert: Alert;
  /** Currently selected alert's ID. */
  activeAlertID?: number;
  /**
   * Selects an alerts to view in the alert detail.
   * @param alert
   */
  onClick?(alert: Alert): any;
}

// --------------------------------------------------------------------------
// Component
// --------------------------------------------------------------------------

/**
 * Table row with an overview of the given alert.
 */
export class AlertListItem extends React.Component<Props, {}> {
  /**
   * Selects this alerts to be viewed in the alert detail view.
   */
  public onClick = (): void => {
    if (this.props.onClick) { this.props.onClick(this.props.alert); }
  };

  public render(): JSX.Element {
    const distilleryName = this.props.alert.distillery
      ? shortenDistilleryName(this.props.alert.distillery.name)
      : 'None';
    const isActive = this.props.activeAlertID === this.props.alert.id;
    const classes = classnames(
      'alert-list-item',
      `alert-list-item--${this.props.alert.level.toLowerCase()}`,
      { active: isActive },
    );
    const user = this.props.alert.assigned_user
      ? getUserFullName(this.props.alert.assigned_user)
      : 'Unassigned';
    const onClick = this.props.onClick ? this.onClick : undefined;

    return (
      <tr className={classes} onClick={onClick}>
        <td><AlertLevelIcon level={this.props.alert.level}/></td>
        <td><AlertStatusIcon status={this.props.alert.status}/></td>
        <td className="text--muted">
          {formatDate(this.props.alert.created_date)}
        </td>
        <td className="text--emphasis">
          {distilleryName}
        </td>
        <td><span className="badge">{this.props.alert.incidents}</span></td>
        <td>
          <div className="flex-box">
            <div className="alert-list-item__title flex-item">
              {this.props.alert.title}
              <div className="alert-list-item__gradient"/>
            </div>
            <div className="alert-list-item__user flex-item flex--shrink">
              <span className="text--emphasis">
                {user}
              </span>
            </div>
          </div>
        </td>
      </tr>
    );
  }
}
