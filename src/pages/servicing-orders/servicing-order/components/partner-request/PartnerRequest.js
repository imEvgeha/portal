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
import Heading from '../../../../../ui/atlaskit/heading/Heading';
import DynamicTable from '@atlaskit/dynamic-table';
import {typography, gridSize} from '@atlaskit/theme';
import Page, {Grid, GridColumn} from '@atlaskit/page';

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

    const rows = [
        ...data.list,
        ...['', '', '', '', ''].map((val, index) => ({
            amount: '',
            artWork: '',
            closedCaptions: null,
            document: '',
            embargoDate: null,
            eopdueDate: '',
            eopnotes: '',
            eoppo: '',
            eopresource: '',
            eopstatus: 'Not Required',
            id: uid(index) + index,
            materialNotes: '',
            metaData: '',
            other: 'string',
            ppsdueDate: '04/07/2021',
            ppsnotes: '',
            ppspo: '4865863',
            ppsresource: 'DSOTO',
            ppsstatus: 'PPS Assigned',
            primaryVideo: 1 + index,
            productDesc: '',
            productID: '17' + index,
            rebillType: '',
            secondaryAudio: null,
            srdueDate: `04/10/202${index}`,
            subtitlesForced: null,
            subtitlesFull: null,
            trailer: '',
            vendorAssetGroupID: 'DA16129',
            vendorSpecID: 'E-ERIC-HD2',
            version: 'TheatricalVersion',
        })),
    ].map(order => ({
        // the key for each row
        key: order.id,

        // the cells in each row
        cells: COLUMN_KEYS.map((key, index) => ({
            key: uid(key, index),
            content:
                key === 'materialNotes' ? (
                    <WrapperWithMaxHeight maxHeight="14">
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem
                            sit provident doloremque dolores suscipit deleniti laudantium,
                            repudiandae vel, blanditiis adipisci earum corrupti numquam, sint veniam
                            incidunt delectus dolor. Quos, ullam? Lorem ipsum dolor sit amet
                            consectetur adipisicing elit. Tempora adipisci, vero officia quaerat in
                            at provident ratione tempore iste amet asperiores? Laborum pariatur
                            optio necessitatibus inventore quae, ipsum a voluptate.
                        </p>
                    </WrapperWithMaxHeight>
                ) : (
                    order[key]
                ),
        })),
    }));

    const emptyTableText = () => (
        <Heading size="h400" as="h3">
            There are no partner requests.
        </Heading>
    );

    return (
        <PartnerRequestWrapper>
            <Page>
                <Heading size="h900" as="h1" style={{marginBottom: `${gridSize() * 4}px`}}>
                    Partner Request
                </Heading>
                <Grid layout="fluid" spacing="compact">
                    <GridColumn medium={2}>
                        <PartnerRequestInfoSection>
                            <Heading size="h300" as="h2">
                                {STUDIO}
                            </Heading>
                            <ParterRequestInfoField>{data.tenant}</ParterRequestInfoField>
                        </PartnerRequestInfoSection>
                        <PartnerRequestInfoSection>
                            <Heading size="h300" as="h2">
                                {MSS_ORDER_DETAILS}
                            </Heading>
                            <ParterRequestInfoField>{externalId}</ParterRequestInfoField>
                        </PartnerRequestInfoSection>
                    </GridColumn>
                    <GridColumn>
                        <PartnerRequestInfoSection>
                            <Heading size="h300" as="h2">
                                {CREATED_DATE}
                            </Heading>
                            <ParterRequestInfoField>
                                {data.createdAt
                                    ? parseSimulcast(data.createdAt, DATE_FORMAT)
                                    : 'N/A'}
                            </ParterRequestInfoField>
                        </PartnerRequestInfoSection>
                        <PartnerRequestInfoSection>
                            <Heading size="h300" as="h2">
                                {CREATED_BY}
                            </Heading>
                            <ParterRequestInfoField>
                                {data.createdBy || 'N/A'}
                            </ParterRequestInfoField>
                        </PartnerRequestInfoSection>
                    </GridColumn>
                </Grid>
                <DynamicTable
                    isLoading={loading}
                    head={columnDefs}
                    rows={rows}
                    isFixedWidth
                    emptyView={emptyTableText()}
                />
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
    overflow-y: scroll;
`;

const PartnerRequestWrapper = styled.div`
    padding-left: ${gridSize() * 2}px;
    padding-right: ${gridSize() * 2}px;
`;

const PartnerRequestInfoSection = styled.div`
    margin-bottom: ${gridSize() * 3}px;
`;

const ParterRequestInfoField = styled.p`
    margin-top: ${gridSize() / 2}px;
`;
