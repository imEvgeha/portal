import Page, {Grid, GridColumn} from '@atlaskit/page';
import {gridSize} from '@atlaskit/theme';
import 'ag-grid-enterprise';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
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
        <PartnerRequestWrapper>
            <Page>
                <Grid layout="fluid">
                    <GridColumn>
                        <Grid layout="fluid">
                            <GridColumn medium={2}>
                                <InfoSection>
                                    <h6>{STUDIO}</h6>
                                    <InfoField>{data.tenant || 'N/A'}</InfoField>
                                </InfoSection>
                                <InfoSection>
                                    <h6>{MSS_ORDER_DETAILS}</h6>
                                    <InfoField>{externalId || 'N/A'}</InfoField>
                                </InfoSection>
                            </GridColumn>
                            <GridColumn>
                                <InfoSection>
                                    <h6>{CREATED_DATE}</h6>
                                    <InfoField>
                                        {data.createdAt
                                            ? parseSimulcast(data.createdAt, DATE_FORMAT)
                                            : 'N/A'}
                                    </InfoField>
                                </InfoSection>
                                <InfoSection>
                                    <h6>{CREATED_BY}</h6>
                                    <InfoField>{data.createdBy || 'N/A'}</InfoField>
                                </InfoSection>
                            </GridColumn>
                        </Grid>
                    </GridColumn>
                </Grid>
                <TableWrapper>
                    <NexusGrid
                        defaultColDef={defaultColDef}
                        columnDefs={columnDefs}
                        rowData={rowData}
                        onFirstDataRendered={onFirstDataRendered}
                    />
                </TableWrapper>
            </Page>
        </PartnerRequestWrapper>
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

const PartnerRequestWrapper = styled.div`
    padding-left: ${gridSize() * 2}px;
    padding-right: ${gridSize() * 2}px;
    height: 92%;
`;

const InfoSection = styled.div`
    margin-top: ${gridSize() * 2}px;
    margin-bottom: ${gridSize() * 2}px;
`;

const InfoField = styled.p`
    margin-top: ${gridSize() / 2}px;
`;

const TableWrapper = styled.div`
    margin-top: ${gridSize() * 2}px;
    height: 80%;

    /* the nexus grid container div */
    & > div {
        height: 100%;
    }

    .cell {
        white-space: normal !important;
        max-height: ${gridSize() * 20}px;
        overflow-y: auto !important;
        line-height: 1.618;
    }
`;
