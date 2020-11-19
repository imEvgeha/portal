import React, {useState} from 'react';
import EditorWarningIcon from '@atlaskit/icon/glyph/editor/warning';
import {compose} from 'redux';
import NexusGrid from '../../../../ui/elements/nexus-grid/NexusGrid';
import {GRID_EVENTS} from '../../../../ui/elements/nexus-grid/constants';
import createValueFormatter from '../../../../ui/elements/nexus-grid/elements/value-formatter/createValueFormatter';
import withColumnsResizing from '../../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '../../../../ui/elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '../../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '../../../../ui/elements/nexus-grid/hoc/withSideBar';
import withSorting from '../../../../ui/elements/nexus-grid/hoc/withSorting';
import NexusTooltip from '../../../../ui/elements/nexus-tooltip/NexusTooltip';
import {getDomainName} from '../../../../util/Common';
import {COLUMN_MAPPINGS, NEXUS, LEGACY_TOOLTIP_TEXT} from '../../constants';
import {fetchTitleMetadata} from '../../utils';
import TitleMetadataTableStatusBar from '../title-metadata-table-status-bar/TitleMetadataTableStatusBar';
import './TitleMetadataTable.scss';

const TitleMetadataTableGrid = compose(
    withSideBar(),
    withFilterableColumns(),
    withColumnsResizing(),
    withSorting(),
    withInfiniteScrolling({fetchData: fetchTitleMetadata})
)(NexusGrid);

const TitleMetadataTable = () => {
    const columnDefs = COLUMN_MAPPINGS.map(mapping => {
        if (mapping.colId === 'title') {
            return {
                ...mapping,
                cellRendererParams: ({data = {}}) => {
                    const {id} = data;
                    return {
                        link: `${getDomainName()}/metadata/v2/detail/${id}`,
                    };
                },
            };
        }
        if (mapping.colId === 'repository') {
            return {
                ...mapping,
                cellRendererFramework: params => {
                    const {value, data = {}} = params || {};
                    const {id} = data;
                    return (
                        <div className="nexus-c-title-metadata-table__repository">
                            <div>{value}</div>
                            {value !== NEXUS && (
                                <NexusTooltip content={LEGACY_TOOLTIP_TEXT}>
                                    <div
                                        className="nexus-c-title-metadata-table__repository-icon"
                                        onClick={() =>
                                            window.open(
                                                `${getDomainName()}/metadata/detail/${id}/legacy-title-reconciliation`,
                                                '_blank'
                                            )
                                        }
                                    >
                                        <EditorWarningIcon primaryColor="#0052CC" />
                                    </div>
                                </NexusTooltip>
                            )}
                        </div>
                    );
                },
            };
        }
        return {
            ...mapping,
            valueFormatter: createValueFormatter(mapping),
        };
    });

    const [paginationData, setPaginationData] = useState({
        pageSize: 0,
        totalCount: 0,
    });

    const setTotalCount = total => {
        setPaginationData(prevData => {
            return {
                ...prevData,
                totalCount: total,
            };
        });
    };

    const setDisplayedRows = count => {
        setPaginationData(prevData => {
            return {
                ...prevData,
                pageSize: count,
            };
        });
    };

    const onGridReady = ({type, api, columnApi}) => {
        const {READY} = GRID_EVENTS;
        switch (type) {
            case READY: {
                api.sizeColumnsToFit();
                break;
            }
            default:
                break;
        }
    };

    return (
        <div className="nexus-c-title-metadata-table">
            <TitleMetadataTableGrid
                id="TitleMetadataTable"
                columnDefs={columnDefs}
                mapping={COLUMN_MAPPINGS}
                suppressRowClickSelection
                onGridEvent={onGridReady}
                setTotalCount={setTotalCount}
                setDisplayedRows={setDisplayedRows}
            />
            <TitleMetadataTableStatusBar paginationData={paginationData} />
        </div>
    );
};

export default TitleMetadataTable;
