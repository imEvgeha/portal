import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {uid} from 'react-uid';
import {getServiceRequest} from '../../../servicingOrdersService';
import {parseSimulcast} from '../../../../../util/date-time/DateTimeUtils';
import {
    COLUMN_KEYS,
    COLUMNS,
    CREATED_BY,
    CREATED_DATE,
    DATE_FORMAT,
    MSS_ORDER_DETAILS,
    STUDIO,
} from '../filter-section/constants';
import './PartnerRequest.scss';

const PartnerRequest = ({externalId, configuredPrId}) => {
    const [data, setData] = useState({list: []});

    useEffect(() => {
        getServiceRequest(externalId).then(res => {
            // eslint-disable-next-line prefer-destructuring
            const partnerRequest = res.filter(req => req.id === configuredPrId)[0];
            const {tenant, createdBy, createdAt, definition} = partnerRequest;
            setData({
                list: definition.materials,
                tenant,
                createdBy,
                createdAt,
            });
        });
    }, // disabling eslint here as it couldn't be tested since no scenario was found as of now
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

    return (
        <div className="nexus-c-partner-request">
            <div className="nexus-c-partner-request__info">
                <div className="nexus-c-partner-request__info-field">
                    {STUDIO}: {data.tenant}
                </div>
                <div className="nexus-c-partner-request__info-field">
                    {MSS_ORDER_DETAILS}: {externalId}
                </div>
                <div className="nexus-c-partner-request__info-field">
                    {CREATED_DATE}: {data.createdAt ? parseSimulcast(data.createdAt, DATE_FORMAT) : ''}
                </div>
                <div className="nexus-c-partner-request__info-field">
                    {CREATED_BY}: {(data.createdBy || '')}
                </div>
            </div>
            <div className="nexus-c-partner-request__table">
                {COLUMNS.map((columnHeader, index) => (
                    <div key={index} className="nexus-c-partner-request__table-column-header">
                        {columnHeader.toUpperCase()}
                    </div>
                ))}
                {data.list && data.list.map(order => (
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
    externalId: PropTypes.string,
    configuredPrId: PropTypes.string,
};

PartnerRequest.defaultProps = {
    externalId: '',
    configuredPrId: '',
};

export default PartnerRequest;
