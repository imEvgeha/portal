import React, {Component} from 'react';
import t from 'prop-types';
import {connect} from 'react-redux';

let mapStateToProps = state => {
    return {
        availTabPageSelected: state.dashboard.session.availTabPageSelection.selected,
        showSelectedAvails: state.dashboard.showSelectedAvails,
    };
};

class SelectedInternal extends Component {

    render(){
        if(this.props.showSelectedAvails){
            return (
                <span
                    className="nx-container-margin table-top-text"
                    id="dashboard-selected-avails-number"
                >Selected items: {this.props.availTabPageSelected.length}
                </span>
            );
        }else {
            if (this.props.availTabPageSelected.length) {
                return (
                    <a href="#" onClick={this.props.toggleShowSelected}>
                        <span
                            className="nx-container-margin table-top-text"
                            id="dashboard-selected-avails-number"
                        >Selected items: {this.props.availTabPageSelected.length}
                        </span>
                    </a>
                );
            }
        }
        return '';
    }
}

SelectedInternal.propTypes = {
    showSelectedAvails: t.bool,
    availTabPageSelected: t.array,
    toggleShowSelected: t.func
};

export let Selected = connect(mapStateToProps, null)(SelectedInternal);