import React from 'react';
import './DashboardCard.scss';

import TitleCreate from './TitleCreateModal';
import PropTypes from 'prop-types';
export default class DashboardDropableCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalBox: false,
        };
    }
    toggle = () => {
        this.setState({
            modalBox: !this.state.modalBox,
        });
    };

    render() {
        return (
            <div className="dashboard-card-container">
                <div className="dashboard-card-icon">
                    <i className={this.props.iconClass}> </i>
                </div>
                <div className="dashboard-card-title">{this.props.title}</div>
                {this.props.actionName && (
                    <button
                        className="btn btn-primary dashboard-card-btn"
                        onClick={this.toggle}
                        id={'title-dashboard-' + this.props.name + '-btn'}
                    >
                        {this.props.actionName}
                    </button>
                )}
                <TitleCreate display={this.state.modalBox} toggle={this.toggle} />
            </div>
        );
    }
}

DashboardDropableCard.propTypes = {
    iconClass: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    actionName: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
};
