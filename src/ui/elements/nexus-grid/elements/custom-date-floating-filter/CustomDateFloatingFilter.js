import React from 'react';
import {ISODateToView} from '../../../../../util/date-time/DateTimeUtils';
import './CustomDateFloatingFilter.scss';
import {DATETIME_FIELDS} from '../../../../../util/date-time/constants';
import {NexusTooltip} from '../../../index';

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
        const type = this.props.filterParams.isUsingTime ? DATETIME_FIELDS.TIMESTAMP : DATETIME_FIELDS.REGIONAL_MIDNIGHT;
        const fromDate = from ? `From: ${ISODateToView(from, type)} ` : '';
        const toDate = to ? `To: ${ISODateToView(to, type)}` : '';
        const dateRange = `${fromDate}${toDate}`;
        return (
            <div className='nexus-c-date-range-floating-filter'>
                <NexusTooltip content={dateRange}>
                    <span>{dateRange}</span>
                </NexusTooltip>
            </div>
        );
    }
}

export default CustomDateFloatingFilter;
