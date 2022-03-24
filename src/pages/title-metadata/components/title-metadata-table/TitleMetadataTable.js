import React, {useEffect, useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import NexusGrid from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/NexusGrid';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import createValueFormatter from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/value-formatter/createValueFormatter';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import withSorting from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSorting';
import NexusStatusDot from '@vubiquity-nexus/portal-ui/lib/elements/nexus-status-dot/NexusStatusDot';
import NexusTooltip from '@vubiquity-nexus/portal-ui/lib/elements/nexus-tooltip/NexusTooltip';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {getSortModel} from '@vubiquity-nexus/portal-utils/lib/utils';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {
    DEFAULT_CATALOGUE_OWNER,
    LEGACY_TOOLTIP_TEXT,
    NEXUS,
    REPOSITORY_COLUMN_ID,
    UPLOADED_EMETS_COLUMN_MAPPINGS,
} from '../../constants';
import {setTitleMetadataFilter} from '../../titleMetadataActions';
import {createTitleMetadataFilterSelector} from '../../titleMetadataSelectors';
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

const TitleMetadataTable = ({
    history,
    catalogueOwner,
    setGridApi,
    setColumnApi,
    columnApi,
    gridApi,
    setTitleMetadataFilter,
    titleMetadataFilter,
}) => {
    const columnDefs = UPLOADED_EMETS_COLUMN_MAPPINGS.map(mapping => {
        if (mapping.colId === 'title') {
            return {
                ...mapping,
                cellRendererParams: ({data = {}}) => {
                    const {id} = data;
                    return {
                        link: `/metadata/detail/`,
                        linkId: id,
                        newTab: false,
                    };
                },
                valueFormatter: createValueFormatter(mapping),
            };
        }
        if (mapping.colId === REPOSITORY_COLUMN_ID) {
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
                                            history.push(
                                                URL.keepEmbedded(`/metadata/detail/${id}/legacy-title-reconciliation`)
                                            )
                                        }
                                    >
                                        <NexusStatusDot severity="warning" />
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

    useLayoutEffect(() => {
        return () => {
            if (gridApi && columnApi?.columnController) {
                const filterModel = gridApi.getFilterModel();
                const sortModel = getSortModel(columnApi);
                const columnState = columnApi?.getColumnState();

                const firstFilterModel = Object.keys(filterModel).shift();
                const id = filterModel && filterModel[`${firstFilterModel}`]?.filter;

                setTitleMetadataFilter({...titleMetadataFilter, id, filterModel, sortModel, columnState});
            }
        };
    }, [columnApi]);

    const onGridReady = ({type, api, columnApi}) => {
        const {READY} = GRID_EVENTS;
        switch (type) {
            case READY: {
                api.sizeColumnsToFit();
                setGridApi(api);
                setColumnApi(columnApi);
                break;
            }
            default:
                break;
        }
    };

    const [externalFilter, setExternalFilter] = useState(null);

    useEffect(() => {
        let externalFilter = catalogueOwner;
        const {location} = history;
        if (location) {
            const {search} = location;
            if (search) {
                const contentType = URL.getParamIfExists('contentType');
                const parentId = URL.getParamIfExists('parentId');
                if (contentType && parentId) {
                    externalFilter = {
                        parentId,
                        contentType,
                    };
                }
            }
        }
        setExternalFilter(externalFilter);
    }, [catalogueOwner, history?.location?.search]);

    return (
        <div className="nexus-c-title-metadata-table">
            <TitleMetadataTableGrid
                columnDefs={columnDefs}
                mapping={UPLOADED_EMETS_COLUMN_MAPPINGS}
                suppressRowClickSelection
                onGridEvent={onGridReady}
                setTotalCount={setTotalCount}
                setDisplayedRows={setDisplayedRows}
                externalFilter={externalFilter}
                link="/metadata/detail"
            />
            <TitleMetadataTableStatusBar paginationData={paginationData} />
        </div>
    );
};

TitleMetadataTable.propTypes = {
    history: PropTypes.object,
    catalogueOwner: PropTypes.object,
    columnApi: PropTypes.object,
    setGridApi: PropTypes.func,
    setColumnApi: PropTypes.func,
    gridApi: PropTypes.object,
    setTitleMetadataFilter: PropTypes.func,
    titleMetadataFilter: PropTypes.object,
};

TitleMetadataTable.defaultProps = {
    history: {},
    catalogueOwner: DEFAULT_CATALOGUE_OWNER,
    columnApi: {},
    setGridApi: () => null,
    setColumnApi: () => null,
    gridApi: {},
    setTitleMetadataFilter: () => null,
    titleMetadataFilter: {},
};

const mapStateToProps = () => {
    const titleMetadataFilterSelector = createTitleMetadataFilterSelector();

    return state => ({
        titleMetadataFilter: titleMetadataFilterSelector(state),
    });
};

const mapDispatchToProps = dispatch => ({
    setTitleMetadataFilter: payload => dispatch(setTitleMetadataFilter(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TitleMetadataTable);
