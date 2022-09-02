import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {DynamicDropdown} from '@portal/portal-components';
import {getSortModel, setSorting} from '@vubiquity-nexus/portal-utils/lib/utils';
import {isEmpty, uniqBy} from 'lodash';
import {useDispatch} from 'react-redux';
import './NexusSavedTableDropdown.scss';

const insertNewGridModel = (viewId, userDefinedGridStates, model) => {
    const newUserData = userDefinedGridStates.slice();
    const foundIndex = newUserData.findIndex(obj => obj.id === viewId);
    if (foundIndex > -1) {
        newUserData[foundIndex] = model;
    } else {
        newUserData.push(model);
    }
    return newUserData;
};

const NexusSavedTableDropdown = ({
    userDefinedGridStates,
    gridApi,
    columnApi,
    username,
    externalFilter,
    applyPredefinedTableView,
    onUserDefinedViewSelected,
    tableLabels,
    tableOptions,
    setBlockLastFilter,
    isDisabled,
    setCurrentUserView,
    currentUserView,
    previousGridState,
    updateColumnsAction,
    setUserDefinedGridState,
}) => {
    const dispatch = useDispatch();
    const [selectedItem, setSelectedItem] = useState(currentUserView?.label ? currentUserView : tableOptions[0]);

    useEffect(() => {
        setCurrentUserView(selectedItem);
    }, [selectedItem]);

    const onSelectView = item => {
        setSelectedItem(item);

        if (item.columnState) {
            selectUserDefinedTableView(item);
        } else {
            selectPredefinedTableView(item.value);
        }
    };

    const onDeleteItem = item => {
        if (selectedItem.value === item.value) {
            setSelectedItem(tableOptions[0]);
            selectPredefinedTableView(tableOptions[0].value);
        }
        removeUserDefinedGridState(item);
    };

    const saveButtonHandler = value => {
        // Line below used to block applying stored filter for titleMetadata page
        setBlockLastFilter(false);
        saveUserDefinedGridState(value);
        setSelectedItem({label: value, value});
    };

    const saveUserDefinedGridState = viewId => {
        if (!isEmpty(gridApi) && !isEmpty(columnApi) && username && viewId) {
            const filterModel = gridApi.getFilterModel();
            const sortModel = getSortModel(columnApi);
            const columnState = columnApi.getColumnState();
            const model = {id: viewId, filterModel, sortModel, columnState, externalFilter};
            const newUserData = insertNewGridModel(viewId, userDefinedGridStates, model);
            setUserDefinedGridState({[username]: newUserData});

            if (previousGridState) {
                // merge the existing views of the user with new views for avails section
                dispatch(updateColumnsAction({[username]: uniqBy([...newUserData, ...previousGridState], 'id')}));
            }
        }
    };

    const removeUserDefinedGridState = item => {
        const filteredGridStates = userDefinedGridStates.filter(opt => opt.id !== item.id);
        setUserDefinedGridState({[username]: filteredGridStates});
        if (previousGridState) {
            dispatch(updateColumnsAction({[username]: filteredGridStates}));
        }
    };

    const selectPredefinedTableView = filter => applyPredefinedTableView(gridApi, filter, columnApi);

    const selectUserDefinedTableView = view => {
        if (!isEmpty(gridApi) && !isEmpty(columnApi) && view) {
            const {columnState, filterModel, sortModel} = view || {};
            gridApi.setFilterModel(filterModel);
            setSorting(sortModel, columnApi);
            columnApi?.applyColumnState({state: columnState});
            onUserDefinedViewSelected(view);
        }
    };

    const constructOptions = () => {
        return [
            {
                label: tableLabels?.savedViewslabel || 'User Defined Views',
                options: [
                    ...userDefinedGridStates.map(opt => ({...opt, label: opt.id, value: opt.id, isDeletable: true})),
                ],
            },
            {label: tableLabels.predifinedViewsLabel || 'Predifined Views', options: [...tableOptions]},
        ];
    };

    return (
        <div className="nexus-c-dop-tasks-dropdown">
            <div className="nexus-c-dop-tasks-dropdown__elements">
                <DynamicDropdown
                    columnClass="col-12"
                    options={constructOptions()}
                    value={selectedItem}
                    onChange={onSelectView}
                    onAddValue={saveButtonHandler}
                    disabled={isDisabled}
                    onDeleteItem={onDeleteItem}
                    placeholder="Select"
                />
            </div>
        </div>
    );
};

NexusSavedTableDropdown.propTypes = {
    userDefinedGridStates: PropTypes.array,
    gridApi: PropTypes.object,
    columnApi: PropTypes.object,
    username: PropTypes.string,
    externalFilter: PropTypes.object,
    applyPredefinedTableView: PropTypes.func,
    onUserDefinedViewSelected: PropTypes.func,
    tableLabels: PropTypes.object,
    tableOptions: PropTypes.array,
    setBlockLastFilter: PropTypes.func,
    isDisabled: PropTypes.bool,
    setCurrentUserView: PropTypes.func,
    currentUserView: PropTypes.object,
    previousGridState: PropTypes.array,
    updateColumnsAction: PropTypes.func,
    setUserDefinedGridState: PropTypes.func,
};

NexusSavedTableDropdown.defaultProps = {
    userDefinedGridStates: [],
    gridApi: {},
    columnApi: {},
    username: '',
    externalFilter: {},
    applyPredefinedTableView: () => null,
    onUserDefinedViewSelected: () => null,
    tableLabels: {},
    tableOptions: [],
    setBlockLastFilter: () => null,
    isDisabled: false,
    setCurrentUserView: () => null,
    currentUserView: {},
    setUserDefinedGridState: () => null,
    previousGridState: [],
    updateColumnsAction: () => null,
};

export default NexusSavedTableDropdown;
