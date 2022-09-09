import React, {useEffect, useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {getUsername} from '@portal/portal-auth/authSelectors';
import {Restricted} from '@portal/portal-auth/permissions';
import NexusGrid from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/NexusGrid';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import createValueFormatter from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/value-formatter/createValueFormatter';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSelectableRows from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSelectableRows';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import withSorting from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSorting';
import NexusStatusDot from '@vubiquity-nexus/portal-ui/lib/elements/nexus-status-dot/NexusStatusDot';
import NexusTooltip from '@vubiquity-nexus/portal-ui/lib/elements/nexus-tooltip/NexusTooltip';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {getSortModel} from '@vubiquity-nexus/portal-utils/lib/utils';
import {get} from 'lodash';
import {connect} from 'react-redux';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {compose} from 'redux';
import {mapColumnDefinitions} from '../../../avails/rights-repository/util/utils';
import {
    DEFAULT_CATALOGUE_OWNER,
    LEGACY_TOOLTIP_TEXT,
    NEXUS,
    REPOSITORY_COLUMN_ID,
    UPLOADED_EMETS_COLUMN_MAPPINGS,
} from '../../constants';
import {setSelectedTitles, setTitleMetadataFilter} from '../../titleMetadataActions';
import {createSelectedTitlesSelector, createTitleMetadataFilterSelector} from '../../titleMetadataSelectors';
import {fetchTitleMetadata} from '../../utils';
import SelectedTitlesTable from '../selected-title-metadata-table/SelectedTitleMetadataTable';
import TitleMetadataTableStatusBar from '../title-metadata-table-status-bar/TitleMetadataTableStatusBar';
import './TitleMetadataTable.scss';

const TitleMetadataTableGrid = compose(
    withSideBar(),
    withFilterableColumns(),
    withColumnsResizing(),
    withSorting(),
    withSelectableRows(),
    withInfiniteScrolling({fetchData: fetchTitleMetadata})
)(NexusGrid);

const TitleMetadataTable = ({
    username,
    selectedTitles,
    setSelectedTitles,
    catalogueOwner,
    setGridApi,
    setColumnApi,
    columnApi,
    gridApi,
    setTitleMetadataFilter,
    titleMetadataFilter,
    showSelected,
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [tableColumnDefinitions, setTableColumnDefinitions] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState({});
    const routeParams = useParams();
    const selectedTitlesArray = get(selectedTitles, username, []);

    useEffect(() => {
        if (!tableColumnDefinitions.length) {
            const colDefs = constructColumnDefs(mapColumnDefinitions(UPLOADED_EMETS_COLUMN_MAPPINGS));
            setTableColumnDefinitions(colDefs);
        }
    }, [UPLOADED_EMETS_COLUMN_MAPPINGS]);

    useEffect(() => {
        return () => {
            setSelectedTitles({[username]: []});
        };
    }, []);

    const constructColumnDefs = defs =>
        defs.map(mapping => {
            if (mapping.colId === 'title') {
                return {
                    ...mapping,
                    cellRendererParams: ({data = {}}) => {
                        const {id} = data;
                        return {
                            link: 'metadata/detail/',
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

                                <Restricted resource="titleMetadataMergeTitle">
                                    {value !== NEXUS && (
                                        <NexusTooltip content={LEGACY_TOOLTIP_TEXT}>
                                            <div
                                                className="nexus-c-title-metadata-table__repository-icon"
                                                onClick={() =>
                                                    navigate(
                                                        URL.keepEmbedded(`detail/${id}/legacy-title-reconciliation`)
                                                    )
                                                }
                                            >
                                                <NexusStatusDot severity="warning" />
                                            </div>
                                        </NexusTooltip>
                                    )}
                                </Restricted>
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
            if (gridApi && columnApi?.columnModel) {
                const filterModel = gridApi?.getFilterModel();
                const sortModel = getSortModel(columnApi);
                const columnState = columnApi?.getColumnState();

                if (filterModel) {
                    const firstFilterModel = Object.keys(filterModel)?.shift();
                    const id = filterModel && filterModel[`${firstFilterModel}`]?.filter;
                    setTitleMetadataFilter({...titleMetadataFilter, id, filterModel, sortModel, columnState});
                }
            }
        };
    }, [columnApi]);

    const onGridReady = ({type, api, columnApi}) => {
        const {READY, SELECTION_CHANGED} = GRID_EVENTS;
        switch (type) {
            case READY: {
                api.sizeColumnsToFit();
                setGridApi(api);
                setColumnApi(columnApi);
                break;
            }
            case SELECTION_CHANGED: {
                setSelectedTitles({[username]: api.getSelectedRows()});
                break;
            }
            default:
                break;
        }
    };

    const [externalFilter, setExternalFilter] = useState(null);

    useEffect(() => {
        let externalFilter = catalogueOwner;
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
    }, [catalogueOwner, location?.search]);

    return (
        <div className="nexus-c-title-metadata-table">
            {!showSelected && (
                <>
                    <TitleMetadataTableGrid
                        rowSelection="multiple"
                        context={{selectedRows: selectedTitlesArray}}
                        columnDefs={tableColumnDefinitions}
                        mapping={UPLOADED_EMETS_COLUMN_MAPPINGS}
                        suppressRowClickSelection
                        onGridEvent={onGridReady}
                        setTotalCount={setTotalCount}
                        setDisplayedRows={setDisplayedRows}
                        externalFilter={externalFilter}
                        link={`/${routeParams.realm}/metadata/detail`}
                    />
                    <TitleMetadataTableStatusBar paginationData={paginationData} />
                </>
            )}

            {showSelected && (
                <SelectedTitlesTable
                    columnDefs={tableColumnDefinitions}
                    mapping={UPLOADED_EMETS_COLUMN_MAPPINGS}
                    selectedFilter={selectedFilter}
                    setSelectedFilter={setSelectedFilter}
                    selectedTitles={selectedTitlesArray}
                    setSelectedTitles={setSelectedTitles}
                    username={username}
                />
            )}
        </div>
    );
};

TitleMetadataTable.propTypes = {
    username: PropTypes.string.isRequired,
    setSelectedTitles: PropTypes.func.isRequired,
    selectedTitles: PropTypes.object,
    catalogueOwner: PropTypes.object,
    columnApi: PropTypes.object,
    setGridApi: PropTypes.func,
    setColumnApi: PropTypes.func,
    gridApi: PropTypes.object,
    setTitleMetadataFilter: PropTypes.func,
    titleMetadataFilter: PropTypes.object,
    showSelected: PropTypes.bool,
};

TitleMetadataTable.defaultProps = {
    selectedTitles: {},
    catalogueOwner: DEFAULT_CATALOGUE_OWNER,
    columnApi: {},
    setGridApi: () => null,
    setColumnApi: () => null,
    gridApi: {},
    setTitleMetadataFilter: () => null,
    titleMetadataFilter: {},
    showSelected: false,
};

const mapStateToProps = () => {
    const titleMetadataFilterSelector = createTitleMetadataFilterSelector();
    const selectedTitlesSelector = createSelectedTitlesSelector();

    return state => ({
        titleMetadataFilter: titleMetadataFilterSelector(state),
        username: getUsername(state),
        selectedTitles: selectedTitlesSelector(state),
    });
};

const mapDispatchToProps = dispatch => ({
    setTitleMetadataFilter: payload => dispatch(setTitleMetadataFilter(payload)),
    setSelectedTitles: payload => dispatch(setSelectedTitles(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TitleMetadataTable);
