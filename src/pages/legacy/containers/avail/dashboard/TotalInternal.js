import {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

const mapStateToProps = state => {
    return {
        total: state.dashboard.availTabPage.total,
    };
};
class TotalInternal extends Component {
    render() {
        return this.props.total;
    }
}

TotalInternal.propTypes = {
    total: PropTypes.number,
};
export const Total = connect(mapStateToProps, null)(TotalInternal);
