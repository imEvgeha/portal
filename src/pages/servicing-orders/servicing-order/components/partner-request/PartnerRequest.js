import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Page, {Grid, GridColumn} from '@atlaskit/page';
import 'ag-grid-enterprise';
import NexusJsonView from '@vubiquity-nexus/portal-ui/lib/elements/nexus-json-view/NexusJsonView';
import {NexusGrid} from '../../../../../ui/elements';
import {parseSimulcast} from '../../../../../util/date-time/DateTimeUtils';
import {getServiceRequest} from '../../../servicingOrdersService';
import {
    COLUMN_KEYS,
    CREATED_BY,
    CREATED_DATE,
    DATE_FORMAT,
    MSS_ORDER_DETAILS,
    STUDIO,
} from '../filter-section/constants';
import {columnDefs, defaultColDef} from './PartnerRequestColumnDefinitions';
import './PartnerRequest.scss';

const TIMEOUT = 50;

const PartnerRequest = ({externalId, configuredPrId}) => {
    const [data, setData] = useState({list: []});

    useEffect(() => {
        getServiceRequest(externalId).then(res => {
            // eslint-disable-next-line prefer-destructuring
            const partnerRequest = res.filter(req => req.id === configuredPrId)[0];
            const {tenant, createdBy, createdAt, definition} = partnerRequest;
            setData({
                list: definition.materials || [],
                tenant,
                createdBy,
                createdAt,
            });
        });
    }, [configuredPrId, externalId]);

    const rowData = data.list.map(order =>
        Object.keys(order).reduce(
            (currRowData, key) =>
                COLUMN_KEYS.includes(key)
                    ? {
                          ...currRowData,
                          [key]: order[key],
                      }
                    : currRowData,

            {}
        )
    );

    const onFirstDataRendered = params => {
        const columnsToResize = ['productDesc', 'primaryVideo', 'version', 'srdueDate', 'materialNotes'];
        params.api.sizeColumnsToFit();
        window.setTimeout(() => {
            const colIds = params.columnApi
                .getAllColumns()
                .map(c => c.colId)
                .filter(colId => columnsToResize.includes(colId));
            params.columnApi.autoSizeColumns(colIds);
            params.api.resetRowHeights();
        }, TIMEOUT);
    };

    if (data.tenant && data.tenant === 'MGM') {
        return (
            <div className="nexus-c-partner-request">
                <Page>
                    <Grid layout="fluid">
                        <GridColumn>
                            <Grid layout="fluid">
                                <GridColumn medium={2}>
                                    <div className="nexus-c-partner-request__info-section">
                                        <h6>{STUDIO}</h6>
                                        <p className="nexus-c-partner-request__info-field">{data.tenant || 'N/A'}</p>
                                    </div>
                                    <div className="nexus-c-partner-request__info-section">
                                        <h6>{MSS_ORDER_DETAILS}</h6>
                                        <p className="nexus-c-partner-request__info-field">{externalId || 'N/A'}</p>
                                    </div>
                                </GridColumn>
                                <GridColumn>
                                    <div className="nexus-c-partner-request__info-section">
                                        <h6>{CREATED_DATE}</h6>
                                        <p className="nexus-c-partner-request__info-field">
                                            {data.createdAt ? parseSimulcast(data.createdAt, DATE_FORMAT) : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="nexus-c-partner-request__info-section">
                                        <h6>{CREATED_BY}</h6>
                                        <p className="nexus-c-partner-request__info-field">{data.createdBy || 'N/A'}</p>
                                    </div>
                                </GridColumn>
                            </Grid>
                        </GridColumn>
                    </Grid>
                    <div className="nexus-c-partner-request__table-wrapper">
                        <NexusGrid
                            defaultColDef={defaultColDef}
                            columnDefs={columnDefs}
                            rowData={rowData}
                            onFirstDataRendered={onFirstDataRendered}
                        />
                    </div>
                </Page>
            </div>
        );
    }

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
