import React, {Component} from 'react';
import t from 'prop-types';
import {connect} from 'react-redux';

const mapStateToProps = state => {
    return {
        availTabPageSelected: state.dashboard.session.availTabPageSelection.selected,
        showSelectedAvails: state.dashboard.showSelectedAvails,
    };
};
class ClearInternal extends Component {

    render(){
        if (this.props.showSelectedAvails && this.props.availTabPageSelected.length > 0)
            return (
                <a href="#" onClick={this.props.clearAllSelected}>
                    <span
                        className="nx-container-margin table-top-text"
                        id="dashboard-clear-all-selected"
                    >
                        Clear All
                    </span>
                </a>
            );
        else return '';
    }
}

ClearInternal.propTypes = {
    showSelectedAvails: t.bool,
    availTabPageSelected: t.array,
    clearAllSelected: t.func
};

export const Clear = connect(mapStateToProps, null)(ClearInternal);