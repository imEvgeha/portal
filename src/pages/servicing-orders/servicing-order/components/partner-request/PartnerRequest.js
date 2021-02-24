import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import 'ag-grid-enterprise';
import NexusJsonView from '@vubiquity-nexus/portal-ui/lib/elements/nexus-json-view/NexusJsonView';
import {get} from 'lodash';
import {getServiceRequest} from '../../../servicingOrdersService';
import {STUDIO,} from '../filter-section/constants';
import './PartnerRequest.scss';

const PartnerRequest = ({externalId, configuredPrId}) => {
    const [data, setData] = useState({list: []});

    useEffect(() => {
        getServiceRequest(externalId).then(res => {
            // eslint-disable-next-line prefer-destructuring
            const partnerRequest = res.filter(req => req.id === configuredPrId)[0];
            const {tenant, createdBy, createdAt, definition} = partnerRequest;
            const materialsList = definition['materials'] ? definition['materials'] : get(JSON.parse(definition),'materials',[])
            setData({
                list: materialsList,
                tenant,
                createdBy,
                createdAt,
            });
        });
    }, [configuredPrId, externalId]);

    return (
        <div className="nexus-c-partner-request__json">
            <div className="nexus-c-partner-request__info-section">
                <h6>{STUDIO}</h6>
                <p className="nexus-c-partner-request__info-field">{data.tenant || 'N/A'}</p>
            </div>
            <div>
                <NexusJsonView defaultHeight="calc(100vh - 142px" src={data.tenant ? data : {}} />
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
