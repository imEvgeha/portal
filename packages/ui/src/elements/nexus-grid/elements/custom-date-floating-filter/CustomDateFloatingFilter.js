import React from 'react';
import PropTypes from 'prop-types';
import {dateToISO} from '@vubiquity-nexus/portal-utils/lib/date-time/DateTimeUtils';
import {DATETIME_FIELDS} from '@vubiquity-nexus/portal-utils/lib/date-time/constants';
import NexusTooltip from '../../../nexus-tooltip/NexusTooltip';
import './CustomDateFloatingFilter.scss';

class CustomDateFloatingFilter extends React.Component {
    constructor(props) {
        super(props);
        const {
            column: {
                colDef: {field},
            },
            currentParentModel,
        } = props;
        const {filter = {}} = currentParentModel() || {};
        this.state = {
            from: filter[`${field}From`] || '',
            to: filter[`${field}To`] || '',
        };
    }

    onParentModelChanged = (params = {}) => {
        if (params) {
            const {filter} = params;
            const {
                column: {
                    colDef: {field},
                },
            } = this.props;
            this.setState({
                from: filter[`${field}From`],
                to: filter[`${field}To`],
            });
        }
    };

    render() {
        const {from, to} = this.state;
        const {
            filterParams: {isUsingTime},
        } = this.props;

        const type = isUsingTime ? DATETIME_FIELDS.TIMESTAMP : DATETIME_FIELDS.REGIONAL_MIDNIGHT;
        const fromDate = from ? `From: ${dateToISO(from)} ` : '';
        const toDate = to ? `To: ${dateToISO(to)}` : '';
        const dateRange = `${fromDate}${toDate}`;
        return (
            <div className="nexus-c-date-range-floating-filter">
                <NexusTooltip content={dateRange}>
                    <span>{dateRange}</span>
                </NexusTooltip>
            </div>
        );
    }
}

CustomDateFloatingFilter.propTypes = {
    filterParams: PropTypes.object,
    column: PropTypes.object.isRequired,
    currentParentModel: PropTypes.func.isRequired,
};

CustomDateFloatingFilter.defaultProps = {
    filterParams: {},
};

export default CustomDateFloatingFilter;
