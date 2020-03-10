import {Component} from 'react';
import t from 'prop-types';
import connect from 'react-redux/lib/connect/connect';

let mapStateToProps = state => {
    return {
        total: state.dashboard.availTabPage.total
    };
};
class TotalInternal extends Component {

    render(){
        return this.props.total;
    }
}

TotalInternal.propTypes = {
    total: t.number
};
export let Total = connect(mapStateToProps, null)(TotalInternal);