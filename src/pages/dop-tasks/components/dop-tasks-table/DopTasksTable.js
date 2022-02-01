import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Tag from '@atlaskit/tag';
import MoreIcon from '@vubiquity-nexus/portal-assets/more-icon.svg';
import NexusGrid from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/NexusGrid';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import {defineCheckboxSelectionColumn} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/columnDefinitions';
import createValueFormatter from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/value-formatter/createValueFormatter';
import withFilterableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import withSorting from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSorting';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import {getSortModel} from '@vubiquity-nexus/portal-utils/lib/utils';
import config from 'react-global-configuration';
import {compose} from 'redux';
import {
    COLUMN_MAPPINGS,
    USER,
    INITIAL_SEARCH_PARAMS,
    DOP_GUIDED_TASK_URL,
    DOP_PROJECT_URL,
    PROJECT_STATUS_ENUM,
    TASK_ACTIONS_ASSIGN,
    TASK_ACTIONS_UNASSIGN,
    TASK_ACTIONS_FORWARD,
    TASK_STATUS_ENUM,
    CHANGE_PRIORITY_TITLE,
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

    const removeMenu = () => setIsMenuOpen(false);

    useEffect(() => {
        window.addEventListener('click', removeMenu);
        return () => {
            window.removeEventListener('click', removeMenu);
        };
    }, []);

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

    const formattedValueColDefs = COLUMN_MAPPINGS.map(col => {
        col.resizable = true;
        if (col.colId === 'taskName') {
            return {
                ...col,
                cellRendererParams: {
                    link: `${config.get('DOP_base')}${DOP_GUIDED_TASK_URL}`,
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
                    link: `${config.get('DOP_base')}${DOP_PROJECT_URL}`,
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
        return data && [TASK_STATUS_ENUM.READY, TASK_STATUS_ENUM.IN_PROGRESS].includes(data.taskStatus)
            ? ''
            : {'pointer-events': 'none'};
    };

    const cellClass = ({data}) => {
        return data && [TASK_STATUS_ENUM.READY, TASK_STATUS_ENUM.IN_PROGRESS].includes(data.taskStatus)
            ? ''
            : 'nexus-c-grid-checkbox--is-disabled';
    };

    const checkboxColumn = {...defineCheckboxSelectionColumn(), cellStyle, cellClass};

    return (
        <div className="nexus-c-dop-tasks-table">
            <MoreIcon className="nexus-c-dop-tasks-table__more-actions" onClick={openMenu} />
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
                columnDefs={[checkboxColumn, ...formattedValueColDefs]}
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
