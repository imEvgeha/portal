import t from 'prop-types';
import React from 'react';
import './DashboardCard.scss';

export default class DashboardDropableCard extends React.Component {

    render() {

        return (
            <div className="dashboard-card-container">
                <div className="dashboard-card-icon">
                    <i className={this.props.iconClass}> </i>
                </div>
                <div className="dashboard-card-title">
                    {this.props.title}
                </div>
                {this.props.actionName && <button className="btn btn-primary dashboard-card-btn" onClick={this.props.action} id={'avails-dashboard-' +  this.props.name + '-btn'}>{this.props.actionName}</button>}
            </div>
        );
    }
}
DashboardDropableCard.propTypes = {
    name: t.string,
    title: t.string,
    action: t.func,
    iconClass: t.string,
    actionName: t.string,
};