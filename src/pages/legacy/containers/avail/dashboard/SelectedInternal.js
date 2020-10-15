import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

const mapStateToProps = state => {
    return {
        availTabPageSelected: state.dashboard.session.availTabPageSelection.selected,
        showSelectedAvails: state.dashboard.showSelectedAvails,
    };
};

class SelectedInternal extends Component {
    render() {
        if (this.props.showSelectedAvails) {
            return (
                <span className="nx-container-margin table-top-text" id="dashboard-selected-avails-number">
                    Selected items: {this.props.availTabPageSelected.length}
                </span>
            );
        } else {
            if (this.props.availTabPageSelected.length) {
                return (
                    <a href="#" onClick={this.props.toggleShowSelected}>
                        <span className="nx-container-margin table-top-text" id="dashboard-selected-avails-number">
                            Selected items: {this.props.availTabPageSelected.length}
                        </span>
                    </a>
                );
            }
        }
        return '';
    }
}

SelectedInternal.propTypes = {
    showSelectedAvails: PropTypes.bool,
    availTabPageSelected: PropTypes.array,
    toggleShowSelected: PropTypes.func,
};

export const Selected = connect(mapStateToProps, null)(SelectedInternal);
