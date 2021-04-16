import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Tag from '@atlaskit/tag/dist/cjs/Tag';
import MoreIcon from '@vubiquity-nexus/portal-assets/more-icon.svg';
import NexusGrid from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/NexusGrid';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import {defineCheckboxSelectionColumn} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/columnDefinitions';
import createValueFormatter from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/value-formatter/createValueFormatter';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
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
    ASSIGN_TASK_TITLE,
} from '../../constants';
import {fetchDopTasksData} from '../../utils';
import DopTasksTableStatusBar from '../dop-tasks-table-status-bar/DopTasksTableStatusBar';
import AssignModal from './components/assign-modal/AssignModal';
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [rowsSelected, setRowsSelected] = useState([]);
    const [taskOwner, setTaskOwner] = useState(null);
    const {openModal, closeModal} = useContext(NexusModalContext);

    const removeMenu = () => setIsMenuOpen(false);

    useEffect(() => {
        window.addEventListener('click', removeMenu);
        return () => {
            window.removeEventListener('click', removeMenu);
        };
    }, []);

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
        const {READY, SELECTION_CHANGED} = GRID_EVENTS;
        switch (type) {
            case READY: {
                api.sizeColumnsToFit();
                setGridApi(api);
                setColumnApi(columnApi);
                break;
            }
            case SELECTION_CHANGED: {
                setRowsSelected(api.getSelectedRows());
                break;
            }
            default:
                break;
        }
    };

    const onSortChanged = ({columnApi}) => {
        // get sorting column and prepare data for passing it as a payload instead of url params (not supported by DOP api)
        const sortModel = getSortModel(columnApi);
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

    const openMenu = e => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    };

    const applyAssign = () => {
        // taskOwner is updated in state
    };

    const handleAssign = () => {
        openModal(<AssignModal selectedTasks={rowsSelected.map(t => t.id)} setTaskOwner={setTaskOwner} />, {
            title: ASSIGN_TASK_TITLE,
            actions: [
                {
                    text: 'Apply',
                    onClick: applyAssign,
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

    return (
        <div className="nexus-c-dop-tasks-table">
            <MoreIcon className="nexus-c-dop-tasks-table__more-actions" onClick={openMenu} />
            {isMenuOpen && (
                <div className="nexus-c-dop-tasks-table__action-menu">
                    <div
                        className={`nexus-c-dop-tasks-table__action-menu--item ${
                            rowsSelected.length ? 'enable-option' : ''
                        }`}
                        onClick={handleAssign}
                    >
                        Assign
                    </div>
                    <div className="nexus-c-dop-tasks-table__action-menu--item">Forward</div>
                </div>
            )}
            <DopTasksTableGrid
                id="DopTasksTable"
                columnDefs={[defineCheckboxSelectionColumn(), ...formattedValueColDefs]}
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
};

DopTasksTable.defaultProps = {
    externalFilter: USER,
    setExternalFilter: () => null,
    setGridApi: () => null,
    setColumnApi: () => null,
};

export default DopTasksTable;
