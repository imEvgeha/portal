import {Component} from 'react';
import t from 'prop-types';
import connect from 'react-redux/lib/connect/connect';

let mapStateToProps = state => {
    return {
        total: state.dashboard.availTabPage.total
    };
};
class TotalInternal extends Component {

    static propTypes = {
        total: t.number
    };

    render(){
        return this.props.total;
    }
}
export let Total = connect(mapStateToProps, null)(TotalInternal);