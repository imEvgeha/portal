import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Tag from '@atlaskit/tag/dist/cjs/Tag';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import config from 'react-global-configuration';
import {compose} from 'redux';
import NexusGrid from '../../../../ui/elements/nexus-grid/NexusGrid';
import createValueFormatter from '../../../../ui/elements/nexus-grid/elements/value-formatter/createValueFormatter';
import withColumnsResizing from '../../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '../../../../ui/elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '../../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '../../../../ui/elements/nexus-grid/hoc/withSideBar';
import withSorting from '../../../../ui/elements/nexus-grid/hoc/withSorting';
import {
    COLUMN_MAPPINGS,
    USER,
    INITIAL_SEARCH_PARAMS,
    DOP_GUIDED_TASK_URL,
    DOP_PROJECT_URL,
    PROJECT_STATUS_ENUM,
} from '../../constants';
import {fetchDopTasksData} from '../../utils';
import DopTasksTableStatusBar from '../dop-tasks-table-status-bar/DopTasksTableStatusBar';
import './DopTasksTable.scss';

const DopTasksTableGrid = compose(
    withSideBar(),
    withFilterableColumns(),
    withColumnsResizing(),
    withSorting(),
    withInfiniteScrolling({fetchData: fetchDopTasksData})
)(NexusGrid);

const DopTasksTable = ({externalFilter, setExternalFilter, setGridApi, setColumnApi}) => {
    const [paginationData, setPaginationData] = useState({
        pageSize: 0,
        totalCount: 0,
    });

    const formattedValueColDefs = COLUMN_MAPPINGS.map(col => {
        if (col.colId === 'taskName') {
            return {
                ...col,
                cellRendererParams: {
                    link: `${config.get('gateway.DOPUrl')}${DOP_GUIDED_TASK_URL}`,
                },
            };
        }
        if (col.colId === 'taskStatus') {
            return {
                ...col,
                cellRendererFramework: params => {
                    const {value} = params || {};
                    let color = 'yellowLight';
                    switch (value) {
                        case 'COMPLETED':
                            color = 'grey';
                            break;
                        case 'READY':
                            color = 'green';
                            break;
                        case 'IN PROGRESS':
                            color = 'blue';
                            break;
                        default:
                            color = 'standard';
                            break;
                    }
                    return (
                        <div>
                            <Tag text={value} color={color} />
                        </div>
                    );
                },
            };
        }
        if (col.colId === 'projectName') {
            return {
                ...col,
                cellRendererParams: {
                    link: `${config.get('gateway.DOPUrl')}${DOP_PROJECT_URL}`,
                    linkId: 'projectId',
                },
            };
        }
        if (col.colId === 'projectStatus') {
            return {
                ...col,
                valueFormatter: params => PROJECT_STATUS_ENUM[params.value],
            };
        }
        return {
            ...col,
            valueFormatter: createValueFormatter(col),
        };
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
                setGridApi(api);
                setColumnApi(columnApi);
                break;
            }
            default:
                break;
        }
    };

    const onSortChanged = ({api}) => {
        // get sorting column and prepare data for passing it as a payload instead of url params (not supported by DOP api)
        const sortModel = api.getSortModel();
        if (sortModel.length) {
            const sortCriterion = [
                {
                    fieldName: sortModel[0].colId,
                    ascending: sortModel[0].sort === 'asc',
                },
            ];
            setExternalFilter(prevData => {
                return {
                    ...prevData,
                    sortCriterion,
                };
            });
        } else {
            setExternalFilter(prevData => {
                return {
                    ...prevData,
                    sortCriterion: INITIAL_SEARCH_PARAMS.sortCriterion,
                };
            });
        }
    };

    return (
        <div className="nexus-c-dop-tasks-table">
            <DopTasksTableGrid
                id="DopTasksTable"
                columnDefs={formattedValueColDefs}
                mapping={COLUMN_MAPPINGS}
                suppressRowClickSelection
                onSortChanged={onSortChanged}
                onGridEvent={onGridReady}
                setTotalCount={setTotalCount}
                setDisplayedRows={setDisplayedRows}
                externalFilter={externalFilter}
            />
            <DopTasksTableStatusBar paginationData={paginationData} />
        </div>
    );
};

DopTasksTable.propTypes = {
    externalFilter: PropTypes.object,
    setExternalFilter: PropTypes.func,
    setGridApi: PropTypes.func,
    setColumnApi: PropTypes.func,
};

DopTasksTable.defaultProps = {
    externalFilter: USER,
    setExternalFilter: () => null,
    setGridApi: () => null,
    setColumnApi: () => null,
};

export default DopTasksTable;
