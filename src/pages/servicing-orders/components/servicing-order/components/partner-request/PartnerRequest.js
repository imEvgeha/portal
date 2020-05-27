import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {uid} from 'react-uid';
import moment from 'moment';
import {getServiceRequest} from '../../../../servicingOrdersService';
import {parseSimulcast} from '../../../../../../util/DateTimeUtils';
import {
    COLUMN_KEYS,
    COLUMNS,
    CREATED_BY,
    CREATED_DATE,
    DATE_FORMAT,
    MSS_ORDER_DETAILS,
    STUDIO
} from '../FilterSection/constants';
import './PartnerRequest.scss';

const PartnerRequest = ({orderDetails}) => {
    const {customer, soID, creationDate, createdBy} = orderDetails;
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        getServiceRequest().then(res => setOrders(res));
    }, []);

    return (
        <div className="nexus-c-partner-request">
            <div className="nexus-c-partner-request__info">
                <div className="nexus-c-partner-request__info-field">
                    {`${STUDIO}: ${customer}`}
                </div>
                <div className="nexus-c-partner-request__info-field">
                    {`${MSS_ORDER_DETAILS}: ${soID}`}
                </div>
                <div className="nexus-c-partner-request__info-field">
                    {`${CREATED_DATE}: ${
                        moment(creationDate).isValid()
                            ? parseSimulcast(creationDate, DATE_FORMAT)
                            : null
                    }`}
                </div>
                <div className="nexus-c-partner-request__info-field">
                    {`${CREATED_BY}: ${createdBy}`}
                </div>
            </div>
            <div className="nexus-c-partner-request__table">
                {COLUMNS.map((columnHeader, index) => (
                    <div key={index} className="nexus-c-partner-request__table-column-header">
                        {columnHeader}
                    </div>
                ))}
                {orders.map((order) => (
                    COLUMN_KEYS.map((key, index) => (
                        <div
                            key={uid(key, index)}
                            className="nexus-c-partner-request__table-cell"
                        >
                            {order[key]}
                        </div>
                    ))
                ))}
            </div>
        </div>
    );
};

PartnerRequest.propTypes = {
    orderDetails: PropTypes.shape({
        customer: PropTypes.string,
        soID: PropTypes.string,
        creationDate: PropTypes.string,
        createdBy: PropTypes.string,
    }),
};

PartnerRequest.defaultProps = {
    orderDetails: {
        customer: '',
        soID: '',
        creationDate: '',
        createdBy: '',
    }
};

export default PartnerRequest;
