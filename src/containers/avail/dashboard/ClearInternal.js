import React, {Component} from 'react';
import t from 'prop-types';
import connect from 'react-redux/es/connect/connect';

let mapStateToProps = state => {
    return {
        availTabPageSelected: state.dashboard.session.availTabPageSelection.selected,
        showSelectedAvails: state.dashboard.showSelectedAvails,
    };
};
class ClearInternal extends Component {

    static propTypes = {
        showSelectedAvails: t.bool,
        availTabPageSelected: t.array,
        clearAllSelected: t.func
    };

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
export let Clear = connect(mapStateToProps, null)(ClearInternal);