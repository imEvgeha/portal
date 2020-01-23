import React from 'react';
import PropTypes from 'prop-types';
import {store} from '../../../../../index';
import {getDateFormatBasedOnLocale} from '../../../../../util/Common';
import moment from 'moment';
import './CustomDateFloatingFilter.scss';

class CustomDateFloatingFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            from: props.initialFilters.from,
            to: props.initialFilters.to,
        };
    }

    onParentModelChanged = ({filter = {}}) => {
        const { column: { colDef: {field}}} = this.props;
        this.setState({
            from: filter[`${field}From`],
            to: filter[`${field}To`]
        });
    };

    render() {
        const {from, to} = this.state;
        const {locale} = store.getState().localeReducer;

        // Create date placeholder based on locale
        const dateFormat = getDateFormatBasedOnLocale(locale);

        return (
            <div className='nexus-c-date-range-floating-filter'>
                { from && <span>From: {moment(from).format(dateFormat)}</span>}
                { to && <span>To: {moment(to).format(dateFormat)}</span>}
            </div>
        );
    }
}

CustomDateFloatingFilter.propTypes = {
    initialFilters: PropTypes.object,
};

CustomDateFloatingFilter.defaultProps = {
    initialFilters: {},
};

export default CustomDateFloatingFilter;
