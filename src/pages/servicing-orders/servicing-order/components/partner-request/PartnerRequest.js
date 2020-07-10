import DynamicTable from '@atlaskit/dynamic-table';
import Page, {Grid, GridColumn} from '@atlaskit/page';
import {gridSize} from '@atlaskit/theme';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {uid} from 'react-uid';
import styled from 'styled-components';
import {parseSimulcast} from '../../../../../util/date-time/DateTimeUtils';
import {getServiceRequest} from '../../../servicingOrdersService';
import {
    COLUMNS,
    COLUMN_KEYS,
    CREATED_BY,
    CREATED_DATE,
    DATE_FORMAT,
    MSS_ORDER_DETAILS,
    STUDIO,
} from '../filter-section/constants';

const PartnerRequest = ({externalId, configuredPrId}) => {
    const [data, setData] = useState({list: []});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getServiceRequest(externalId).then(res => {
            const partnerRequest = res.filter(req => req.id === configuredPrId)[0];
            const {tenant, createdBy, createdAt, definition} = partnerRequest;
            setData({
                list: JSON.parse(definition).materials,
                tenant,
                createdBy,
                createdAt,
            });
            setLoading(false);
        });
    }, []);

    const columnDefs = {
        cells: COLUMNS.map((col, index) => {
            const baseColumnDef = {
                key: COLUMN_KEYS[index],
                content: col,
                isSortable: false,
                width: 7,
            };

            if (col === 'Notes') {
                return {...baseColumnDef, width: 30};
            }

            return baseColumnDef;
        }),
    };

    const rows = data.list.map(order => ({
        // the key for each row
        key: order.id,

        // the cells in each row
        cells: COLUMN_KEYS.map((key, index) => ({
            // the key for each cell
            key: uid(key, index),

            // the content for each cell
            content:
                key === 'materialNotes' ? (
                    <WrapperWithMaxHeight maxHeight="14">
                        <p>{order[key]}</p>
                    </WrapperWithMaxHeight>
                ) : (
                    order[key]
                ),
        })),
    }));

    return (
        <PartnerRequestWrapper>
            <Page>
                <Grid layout="fluid">
                    <GridColumn>
                        <Title>Partner Request</Title>
                        <Grid layout="fluid" spacing="comfortable">
                            <GridColumn medium={2}>
                                <InfoSection>
                                    <h6>{STUDIO}</h6>
                                    <InfoField>{data.tenant}</InfoField>
                                </InfoSection>
                                <InfoSection>
                                    <h6>{MSS_ORDER_DETAILS}</h6>
                                    <InfoField>{externalId}</InfoField>
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
                        <TableWrapper>
                            <DynamicTable
                                isLoading={loading}
                                head={columnDefs}
                                rows={rows}
                                isFixedWidth
                                emptyView={<h4>There are no partner requests.</h4>}
                            />
                        </TableWrapper>
                    </GridColumn>
                </Grid>
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

const WrapperWithMaxHeight = styled.div`
    max-height: ${props => props.maxHeight * gridSize()}px;
    overflow-y: auto;
`;

const PartnerRequestWrapper = styled.div`
    padding-left: ${gridSize() * 2}px;
    padding-right: ${gridSize() * 2}px;
`;

const Title = styled.h1`
    margin-bottom: ${gridSize() * 2}px;
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
`;
