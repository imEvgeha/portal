import React from 'react';
import './ServicingOrdersTableStatusBar.scss';

const ServicingOrdersTableStatusBar = ({statusBarInfo}) => {
    const baseClassName = 'nexus-c-servicing-orders-table-status-bar';

    const {totalRows, selectedRows} = statusBarInfo || {};

    return (
        <div className={baseClassName}>
            <span className={`${baseClassName}__info`}>
                Rows: <span className={`${baseClassName}__info--bold`}>{totalRows}</span>
            </span>
            {selectedRows > 0 && (
                <span className={`${baseClassName}__info`}>
                    Selected: <span className={`${baseClassName}__info--bold`}>{selectedRows}</span>
                </span>
            )}
        </div>
    );
};

export default ServicingOrdersTableStatusBar;
