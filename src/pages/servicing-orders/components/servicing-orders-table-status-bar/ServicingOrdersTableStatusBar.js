import React from 'react';
import PropTypes from 'prop-types';
import './ServicingOrdersTableStatusBar.scss';


const ServicingOrdersTableStatusBar = ({statusBarInfo}) => {
    const baseClassName = 'nexus-c-servicing-orders-table-status-bar';

    const {totalRows, selectedRows} = statusBarInfo || {};

    return (
        <div className={baseClassName}>
            <span className={`${baseClassName}__description`}>
                Rows: <span className={`${baseClassName}__value`}>{totalRows}</span>
            </span>
            {selectedRows > 0 && (
                <span className={`${baseClassName}__description`}>
                    Selected: <span className={`${baseClassName}__value`}>{selectedRows}</span>
                </span>
            )}
        </div>
    );
};

ServicingOrdersTableStatusBar.propTypes = {
    statusBarInfo: PropTypes.string,
};

ServicingOrdersTableStatusBar.defaultProps = {
    statusBarInfo: '',
};

export default ServicingOrdersTableStatusBar;
