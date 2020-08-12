import React from 'react';
import PropTypes from 'prop-types';
import './ServicingOrdersTableStatusTooltip.scss';
import {REPORT} from '../../constants';

const ServicingOrdersTableStatusTooltip = ({reportValues}) => {
    const baseClassName = 'nexus-c-servicing-orders-table-status-tooltip';


    const createTag = key => (
        <div className={`${baseClassName}__field`} key={key}>
            <span className={`${baseClassName}__field--label`}>{REPORT[key].label}</span>
            <span
                className={`${baseClassName}__field--value`}
            >
                {reportValues[key] || 0}
            </span>
        </div>
    );

    return (
        <div className={baseClassName}>
            <div className={`${baseClassName}__fields`}>
                {Object.keys(REPORT).map(key => createTag(key))}
            </div>
        </div>
    );
};

ServicingOrdersTableStatusTooltip.propTypes = {
    reportValues: PropTypes.object,
};

ServicingOrdersTableStatusTooltip.defaultProps = {
    reportValues: {},
};

export default ServicingOrdersTableStatusTooltip;
