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
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {fetchUploadedEMETsLog} from '@vubiquity-nexus/portal-utils/lib/services/UploadLogService';
import {getSortModel} from '@vubiquity-nexus/portal-utils/lib/utils';
import {connect, useDispatch} from 'react-redux';
import {useLocation} from 'react-router-dom';
import {compose} from 'redux';
import {DEFAULT_CATALOGUE_OWNER, UPLOAD_COLUMN_MAPPINGS} from '../../constants';
import {setUploadMetadataFilter} from '../../titleMetadataActions';
import {createUploadLogMetadataFilterSelector} from '../../titleMetadataSelectors';
import TitleMetadataTableStatusBar from '../title-metadata-table-status-bar/TitleMetadataTableStatusBar';
import './UploadMetadataTable.scss';

const UploadMetadataTableGrid = compose(
    withSideBar(),
    withFilterableColumns(),
    withColumnsResizing(),
    withSorting(),
    withInfiniteScrolling({fetchData: fetchUploadedEMETsLog})
)(NexusGrid);

const UploadMetadataTable = ({catalogueOwner, setGridApi, setColumnApi, columnApi, gridApi, titleMetadataFilter}) => {
    const dispatch = useDispatch();
    const location = useLocation();

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
            if (gridApi && columnApi?.columnModel) {
                const filterModel = gridApi.getFilterModel();
                const sortModel = getSortModel(columnApi);
                const columnState = columnApi?.getColumnState();

                const firstFilterModel = Object.keys(filterModel).shift();
                const id = filterModel && filterModel[`${firstFilterModel}`]?.filter;
                dispatch(setUploadMetadataFilter({...titleMetadataFilter, id, filterModel, sortModel, columnState}));
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
        <div className="nexus-c-upload-metadata-table">
            <UploadMetadataTableGrid
                columnDefs={columnDefs}
                mapping={UPLOAD_COLUMN_MAPPINGS}
                suppressRowClickSelection
                onGridEvent={onGridReady}
                setTotalCount={setTotalCount}
                setDisplayedRows={setDisplayedRows}
                externalFilter={externalFilter}
                onlyReceivedSize
            />
            <TitleMetadataTableStatusBar paginationData={paginationData} />
        </div>
    );
};

UploadMetadataTable.propTypes = {
    catalogueOwner: PropTypes.object,
    columnApi: PropTypes.object,
    setGridApi: PropTypes.func,
    setColumnApi: PropTypes.func,
    gridApi: PropTypes.object,
    titleMetadataFilter: PropTypes.object,
};

UploadMetadataTable.defaultProps = {
    catalogueOwner: DEFAULT_CATALOGUE_OWNER,
    columnApi: {},
    setGridApi: () => null,
    setColumnApi: () => null,
    gridApi: {},
    titleMetadataFilter: {},
};

const mapStateToProps = () => {
    const titleMetadataFilterSelector = createUploadLogMetadataFilterSelector();
    return state => ({
        titleMetadataFilter: titleMetadataFilterSelector(state),
    });
};

export default connect(mapStateToProps, null)(UploadMetadataTable);
