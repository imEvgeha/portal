import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {SimpleTag as Tag} from '@atlaskit/tag';
import NexusGrid from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/NexusGrid';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import {defineCheckboxSelectionColumn} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/columnDefinitions';
import createValueFormatter from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/value-formatter/createValueFormatter';
import withFilterableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import withSorting from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSorting';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import {getApiURI} from '@vubiquity-nexus/portal-utils/lib/config';
import {getSortModel} from '@vubiquity-nexus/portal-utils/lib/utils';
import {compose} from 'redux';
import {mapColumnDefinitions} from '../../../avails/rights-repository/util/utils';
import {
    CHANGE_PRIORITY_TITLE,
    COLUMN_MAPPINGS,
    INITIAL_SEARCH_PARAMS,
    PROJECT_STATUS_ENUM,
    TASK_ACTIONS_ASSIGN,
    TASK_ACTIONS_FORWARD,
    TASK_ACTIONS_UNASSIGN,
    TASK_STATUS_ENUM,
    USER,
} from '../../constants';
import {fetchDopTasksData} from '../../utils';
import DopTasksTableStatusBar from '../dop-tasks-table-status-bar/DopTasksTableStatusBar';
import AssignModal from './components/assign-modal/AssignModal';
import './DopTasksTable.scss';

const DopTasksTableGrid = compose(
    withSideBar(),
    withFilterableColumns(),
    withSorting(),
    withInfiniteScrolling({fetchData: fetchDopTasksData})
)(NexusGrid);

const DopTasksTable = ({
    externalFilter,
    setExternalFilter,
    setGridApi,
    setColumnApi,
    assignTasks,
    unAssignTasks,
    changePriority,
}) => {
    const [paginationData, setPaginationData] = useState({
        pageSize: 0,
        totalCount: 0,
    });
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [action, setAction] = useState(null);
    const [rowsSelected, setRowsSelected] = useState([]);
    const [modalValue, setModalValue] = useState(null);
    const [api, setApi] = useState(null);
    const {openModal, closeModal} = useContext(NexusModalContext);
    const [tableColumnDefinitions, setTableColumnDefinitions] = useState([]);

    const removeMenu = () => setIsMenuOpen(false);

    useEffect(() => {
        window.addEventListener('click', removeMenu);
        return () => {
            window.removeEventListener('click', removeMenu);
        };
    }, []);

    useEffect(() => {
        if (!tableColumnDefinitions.length) {
            const colDefs = [checkboxColumn, ...constructColumnDefs(mapColumnDefinitions(COLUMN_MAPPINGS))];

            setTableColumnDefinitions(colDefs);
        }
    }, [COLUMN_MAPPINGS]);

    useEffect(() => {
        if (modalValue) {
            if (action[0] === CHANGE_PRIORITY_TITLE) {
                changePriority({taskIds: rowsSelected, priority: modalValue});
            } else {
                assignTasks({userId: modalValue, taskIds: rowsSelected.map(n => n.id), closeModal, action: action[0]});
            }
            setRowsSelected([]);
            api && api.deselectAll();
            closeModal();
        }
    }, [action]);

    const constructColumnDefs = defs =>
        defs.map(col => {
            col.resizable = true;
            if (col.colId === 'taskName') {
                const uri = `/index.html?launchApp=Tasks&gtMethod=external&taskId=`;
                const link = getApiURI('dopPortal', uri, 0, 'dopExternal');
                return {
                    ...col,
                    cellRendererParams: {link},
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
                const uri = `/index.html?launchApp=Projects&projectId=`;
                const link = getApiURI('dopPortal', uri, 0, 'dopExternal');
                return {
                    ...col,
                    cellRendererParams: {
                        link,
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
        const {READY, SELECTION_CHANGED} = GRID_EVENTS;
        switch (type) {
            case READY: {
                api.sizeColumnsToFit();
                setApi(api);
                setGridApi(api);
                setColumnApi(columnApi);
                break;
            }
            case SELECTION_CHANGED: {
                setRowsSelected(api.getSelectedRows().map(({id, projectId}) => ({id, projectId})));
                break;
            }
            default:
                break;
        }
    };

    const onSortChanged = ({columnApi}) => {
        // get sorting column and prepare data for passing it as a payload instead of url params (not supported by DOP api)
        const sortModel = getSortModel(columnApi);
        if (sortModel?.length) {
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

    const openMenu = e => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    };

    const handleAssign = val => {
        val === TASK_ACTIONS_UNASSIGN
            ? unAssignTasks({taskIds: rowsSelected.map(n => n.id)})
            : openModal(<AssignModal selectedTasks={rowsSelected} onChange={setModalValue} action={val} />, {
                  title: val === CHANGE_PRIORITY_TITLE ? CHANGE_PRIORITY_TITLE : `${val} Tasks`,
                  actions: [
                      {
                          text: 'Apply',
                          onClick: () => setAction([val]),
                          appearance: 'primary',
                      },
                      {
                          text: 'Cancel',
                          onClick: closeModal,
                          appearance: 'default',
                      },
                  ],
              });
    };

    const cellStyle = ({data}) => {
        return data &&
            [TASK_STATUS_ENUM.COMPLETED, TASK_STATUS_ENUM.EXITED, TASK_STATUS_ENUM.OBSOLETE].includes(data.taskStatus)
            ? {'pointer-events': 'none'}
            : '';
    };

    const cellClass = ({data}) => {
        return data &&
            [TASK_STATUS_ENUM.COMPLETED, TASK_STATUS_ENUM.EXITED, TASK_STATUS_ENUM.OBSOLETE].includes(data.taskStatus)
            ? 'nexus-c-grid-checkbox--is-disabled'
            : '';
    };

    const checkboxColumn = {...defineCheckboxSelectionColumn(), cellStyle, cellClass};

    return (
        <div className="nexus-c-dop-tasks-table">
            <i className="po po-more nexus-c-dop-tasks-table__more-actions" onClick={openMenu} />
            {isMenuOpen && (
                <div className="nexus-c-dop-tasks-table__action-menu">
                    {[TASK_ACTIONS_ASSIGN, TASK_ACTIONS_UNASSIGN, TASK_ACTIONS_FORWARD, CHANGE_PRIORITY_TITLE].map(
                        key => (
                            <div
                                className={`nexus-c-dop-tasks-table__action-menu--item ${
                                    rowsSelected.length ? 'enable-option' : ''
                                }`}
                                key={key}
                                onClick={() => handleAssign(key)}
                            >
                                {key}
                            </div>
                        )
                    )}
                </div>
            )}
            <DopTasksTableGrid
                id="DopTasksTable"
                columnDefs={tableColumnDefinitions}
                rowSelection="multiple"
                notFilterableColumns={['action']}
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
    assignTasks: PropTypes.func,
    unAssignTasks: PropTypes.func,
    changePriority: PropTypes.func,
};

DopTasksTable.defaultProps = {
    externalFilter: USER,
    setExternalFilter: () => null,
    setGridApi: () => null,
    setColumnApi: () => null,
    assignTasks: () => null,
    unAssignTasks: () => null,
    changePriority: () => null,
};

export default DopTasksTable;
