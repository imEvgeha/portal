import t from 'prop-types'
import React from 'react'
import './DashboardCard.scss'

export default class DashboardDropableCard extends React.Component {
    static propTypes = {
        title: t.string,
        action: t.func,
        iconClass: t.string,
        actionName: t.string,
    };

    render() {

        return (
            <div className="dashboard-card-container">
                <div className="dashboard-card-icon">
                    <i className={this.props.iconClass}> </i>
                </div>
                <div className="dashboard-card-title">
                    {this.props.title}
                </div>
                <button className="btn btn-primary">{this.props.actionName}</button>
            </div>
        )
    }
}
