import React, {useState, useEffect, useLayoutEffect} from 'react';
import PropTypes from 'prop-types';
import NexusGrid from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/NexusGrid';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import createValueFormatter from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/value-formatter/createValueFormatter';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import withSorting from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSorting';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {getSortModel} from '@vubiquity-nexus/portal-utils/lib/utils';
import {connect, useDispatch} from 'react-redux';
import {compose} from 'redux';
import {UPLOAD_COLUMN_MAPPINGS, DEFAULT_CATALOGUE_OWNER} from '../../constants';
import { fetchListOfUploadedMetadata } from '../../service/UploadLogService';
import {setTitleMetadataFilter} from '../../titleMetadataActions';
import {createTitleMetadataFilterSelector} from '../../titleMetadataSelectors';
import TitleMetadataTableStatusBar from '../title-metadata-table-status-bar/TitleMetadataTableStatusBar';
import './UploadMetadataTable.scss';

const UploadMetadataTableGrid = compose(
    withSideBar(),
    withFilterableColumns(),
    withColumnsResizing(),
    withSorting(),
    withInfiniteScrolling({fetchData: fetchListOfUploadedMetadata})
)(NexusGrid);

const UploadMetadataTable = ({
    history,
    catalogueOwner,
    setGridApi,
    setColumnApi,
    columnApi,
    gridApi,
    titleMetadataFilter,
}) => {
    const dispatch = useDispatch();
    const columnDefs = UPLOAD_COLUMN_MAPPINGS.map(mapping => {
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
                dispatch(setTitleMetadataFilter({...titleMetadataFilter, id, filterModel, sortModel, columnState}));
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
        <div className="nexus-c-upload-metadata-table">
            <UploadMetadataTableGrid
                columnDefs={columnDefs}
                mapping={UPLOAD_COLUMN_MAPPINGS}
                suppressRowClickSelection
                onGridEvent={onGridReady}
                setTotalCount={setTotalCount}
                setDisplayedRows={setDisplayedRows}
                externalFilter={externalFilter}
                link="/metadata/detail"
                onlyReceivedSize
            />
            <TitleMetadataTableStatusBar paginationData={paginationData} />
        </div>
    );
};

UploadMetadataTable.propTypes = {
    history: PropTypes.object,
    catalogueOwner: PropTypes.object,
    columnApi: PropTypes.object,
    setGridApi: PropTypes.func,
    setColumnApi: PropTypes.func,
    gridApi: PropTypes.object,
    titleMetadataFilter: PropTypes.object,
};

UploadMetadataTable.defaultProps = {
    history: {},
    catalogueOwner: DEFAULT_CATALOGUE_OWNER,
    columnApi: {},
    setGridApi: () => null,
    setColumnApi: () => null,
    gridApi: {},
    titleMetadataFilter: {},
};

const mapStateToProps = () => {
    const titleMetadataFilterSelector = createTitleMetadataFilterSelector();
    return state => ({
        titleMetadataFilter: titleMetadataFilterSelector(state),
    });
};

export default connect(mapStateToProps, null)(UploadMetadataTable);
