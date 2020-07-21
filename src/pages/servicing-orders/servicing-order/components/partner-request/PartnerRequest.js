import React, {useEffect, useState} from 'react';
import Page, {Grid, GridColumn} from '@atlaskit/page';
import {gridSize} from '@atlaskit/theme';
import 'ag-grid-enterprise';
import PropTypes from 'prop-types';
import {uid} from 'react-uid';
import styled from 'styled-components';
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

const PartnerRequest = ({externalId, configuredPrId}) => {
    const [data, setData] = useState({list: []});

    useEffect(() => {
        getServiceRequest(externalId).then(res => {
            const partnerRequest = res.filter(req => req.id === configuredPrId)[0];
            const {tenant, createdBy, createdAt, definition} = partnerRequest;
            setData({
                list: definition.materials,
                tenant,
                createdBy,
                createdAt,
            });
        });
    }, []);

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
        const columnsToResize = [
            'productDesc',
            'primaryVideo',
            'version',
            'srdueDate',
            'materialNotes',
        ];
        params.api.sizeColumnsToFit();
        window.setTimeout(() => {
            const colIds = params.columnApi
                .getAllColumns()
                .map(c => c.colId)
                .filter(colId => columnsToResize.includes(colId));
            params.columnApi.autoSizeColumns(colIds);
            params.api.resetRowHeights();
        }, 50);
    };

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
                                        {data.createdAt
                                            ? parseSimulcast(data.createdAt, DATE_FORMAT)
                                            : 'N/A'}
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
