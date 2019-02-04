import React from 'react';
import connect from 'react-redux/es/connect/connect';
import t from 'prop-types';

import {updateBreadcrumb} from '../../../stores/actions/index';

//const mapStateToProps = state => {
//    return {};
//};

const mapDispatchToProps = {
    updateBreadcrumb
};

class AvailDetails extends React.Component {

    static propTypes = {
        updateBreadcrumb: t.func,
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    render() {
        return 'NEW';
    }
}

export default connect(null, mapDispatchToProps)(AvailDetails);