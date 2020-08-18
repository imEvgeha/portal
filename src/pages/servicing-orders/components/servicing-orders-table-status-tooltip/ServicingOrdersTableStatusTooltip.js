import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Spinner from '@atlaskit/spinner';
import './ServicingOrdersTableStatusTooltip.scss';
import {URL} from '../../../../util/Common';
import {REPORT} from '../../constants';
import {servicingOrdersService} from '../../servicingOrdersService';

const ServicingOrdersTableStatusTooltip = ({soNumber}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [report, setReport] = useState({});
    const [isError, setIsError] = useState(false);

    const fetchFulfillmentOrderStatusReport = async soNumber => {
        setIsLoading(true);
        try {
            let fulfillmentOrders = null;
            if (URL.isLocalOrDevOrQA()) {
                const {fulfillmentOrders: fo} = await servicingOrdersService.getFulfilmentOrdersForServiceOrder(
                    soNumber
                );
                fulfillmentOrders = fo;
            } else {
                fulfillmentOrders = await servicingOrdersService.getFulfilmentOrdersForServiceOrder(soNumber);
            }

            const statusReport = fulfillmentOrders.reduce((acc, fulfillmentOrder) => {
                return {
                    ...acc,
                    [fulfillmentOrder.status]: !acc[fulfillmentOrder.status] ? 1 : acc[fulfillmentOrder.status] + 1,
                };
            }, {});

            setReport(statusReport);
        } catch (e) {
            setIsError(true);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchFulfillmentOrderStatusReport(soNumber);
    }, [soNumber]);

    const baseClassName = 'nexus-c-servicing-orders-table-status-tooltip';

    const createTag = key => (
        <div className={`${baseClassName}__field`} key={key}>
            <span className={`${baseClassName}__field--label`}>{REPORT[key].label}</span>
            <span className={`${baseClassName}__field--value`}>{report[key] || 0}</span>
        </div>
    );

    return (
        <div className={baseClassName}>
            {isLoading ? (
                <Spinner />
            ) : isError ? (
                <p>No fulfillment orders were found.</p>
            ) : (
                <div className={`${baseClassName}__fields`}>{Object.keys(REPORT).map(key => createTag(key))}</div>
            )}
        </div>
    );
};

ServicingOrdersTableStatusTooltip.propTypes = {
    soNumber: PropTypes.string.isRequired,
};

export default ServicingOrdersTableStatusTooltip;
