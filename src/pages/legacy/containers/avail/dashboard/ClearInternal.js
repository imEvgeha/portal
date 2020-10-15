import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

const mapStateToProps = state => {
    return {
        availTabPageSelected: state.dashboard.session.availTabPageSelection.selected,
        showSelectedAvails: state.dashboard.showSelectedAvails,
    };
};
class ClearInternal extends Component {
    render() {
        if (this.props.showSelectedAvails && this.props.availTabPageSelected.length > 0)
            return (
                <a href="#" onClick={this.props.clearAllSelected}>
                    <span className="nx-container-margin table-top-text" id="dashboard-clear-all-selected">
                        Clear All
                    </span>
                </a>
            );
        else return '';
    }
}

ClearInternal.propTypes = {
    showSelectedAvails: PropTypes.bool,
    availTabPageSelected: PropTypes.array,
    clearAllSelected: PropTypes.func,
};

export const Clear = connect(mapStateToProps, null)(ClearInternal);
