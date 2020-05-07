import React from 'react';
import {DATETIME_FIELDS, ISODateToView} from '../../../../../util/DateTimeUtils';
import './CustomDateFloatingFilter.scss';

class CustomDateFloatingFilter extends React.Component {
    constructor(props) {
        super(props);
        const { column: { colDef: {field}}, currentParentModel} = props;
        const {filter = {}} = currentParentModel() || {};
        this.state = {
            from: filter[`${field}From`] || '',
            to: filter[`${field}To`] || ''
        };
    }

    onParentModelChanged = (params= {}) => {
        if(params) {
            const {filter} = params;
            const {column: {colDef: {field}}} = this.props;
            this.setState({
                from: filter[`${field}From`],
                to: filter[`${field}To`]
            });
        }
    };

    render() {
        const {from, to} = this.state;

        return (
            <div className='nexus-c-date-range-floating-filter'>
                { from && <span>From: {ISODateToView(from, DATETIME_FIELDS.REGIONAL_MIDNIGHT)}</span>}
                { to && <span>To: {ISODateToView(to, DATETIME_FIELDS.REGIONAL_MIDNIGHT)}</span>}
            </div>
        );
    }
}

export default CustomDateFloatingFilter;
