import React, {useState} from 'react';
import PropTypes from 'prop-types';
import DropdownMenu, {DropdownItem, DropdownItemGroup} from '@atlaskit/dropdown-menu';
import {FieldTextStateless} from '@atlaskit/field-text';
import CheckIcon from '@atlaskit/icon/glyph/check';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import IconButton from '@vubiquity-nexus/portal-ui/lib/atlaskit/icon-button/IconButton';
import {getSortModel, setSorting} from '@vubiquity-nexus/portal-utils/lib/utils';
import {isEmpty} from 'lodash';
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
    setUserDefinedGridState,

    applyPredefinedTableView,
    tableLabels,
    tableOptions,
    hasPredefined,
}) => {
    const [selectedItem, setSelectedItem] = useState(tableOptions[0]);
    const [showTextFieldActions, setShowTextFieldsActions] = useState(false);
    const [userInput, setUserInput] = useState('');

    const setPredefinedView = item => {
        setSelectedItem(item);
        selectPredefinedTableView(item.value);
    };

    const setUserDefinedView = item => {
        setSelectedItem({label: item, value: item});
        selectUserDefinedTableView(item);
    };

    const filterRemovalHandler = (e, item) => {
        e.stopPropagation();
        if (selectedItem.value === item) {
            setSelectedItem(tableOptions[0]);
            selectPredefinedTableView(tableOptions[0].value);
        }
        removeUserDefinedGridState(item);
    };

    const saveButtonHandler = () => {
        saveUserDefinedGridState(userInput);
        setSelectedItem({label: userInput, value: userInput});
        setUserInput('');
    };

    const saveUserDefinedGridState = viewId => {
        if (!isEmpty(gridApi) && !isEmpty(columnApi) && username && viewId) {
            const filterModel = gridApi.getFilterModel();
            const sortModel = getSortModel(columnApi);
            const columnState = columnApi.getColumnState();
            const model = {id: viewId, filterModel, sortModel, columnState};
            const newUserData = insertNewGridModel(viewId, userDefinedGridStates, model);
            setUserDefinedGridState({[username]: newUserData});
        }
    };

    const removeUserDefinedGridState = id => {
        const filteredGridStates = userDefinedGridStates.filter(item => item.id !== id);
        setUserDefinedGridState({[username]: filteredGridStates});
    };

    const selectPredefinedTableView = filter => {
        applyPredefinedTableView(gridApi, filter, columnApi);
    };

    const selectUserDefinedTableView = id => {
        if (!isEmpty(gridApi) && !isEmpty(columnApi) && id) {
            const selectedModel = userDefinedGridStates.filter(item => item.id === id);
            const {columnState, filterModel, sortModel} = selectedModel[0] || {};
            gridApi.setFilterModel(filterModel);
            setSorting(sortModel, columnApi);
            columnApi.setColumnState(columnState);
        }
    };

    return (
        <div className="nexus-c-dop-tasks-dropdown">
            <div className="nexus-c-dop-tasks-dropdown__label">{tableLabels.savedDropdownLabel}</div>
            <div className="nexus-c-dop-tasks-dropdown__elements">
                <DropdownMenu shouldFitContainer appearance="tall" trigger={selectedItem.label} triggerType="button">
                    <DropdownItemGroup title={tableLabels.savedViewslabel}>
                        <div className="nexus-c-dop-tasks-dropdown__textfield">
                            <FieldTextStateless
                                shouldFitContainer
                                placeholder="New View..."
                                value={userInput}
                                onFocus={() => setShowTextFieldsActions(true)}
                                onBlur={() => setShowTextFieldsActions(false)}
                                onChange={e => setUserInput(e.target.value)}
                            />
                        </div>
                        {showTextFieldActions && (
                            <div className="nexus-c-dop-tasks-dropdown__textfield-actions">
                                <IconButton
                                    icon={() => <CheckIcon size="small" />}
                                    onClick={saveButtonHandler}
                                    label="Save"
                                    isDisabled={!userInput}
                                />
                                <IconButton
                                    icon={() => <CrossIcon size="small" />}
                                    onClick={() => setUserInput('')}
                                    label="Cancel"
                                />
                            </div>
                        )}
                        {userDefinedGridStates.map(item => (
                            <DropdownItem
                                key={item.id}
                                onClick={() => setUserDefinedView(item.id)}
                                elemAfter={
                                    <div onClick={e => filterRemovalHandler(e, item.id)}>
                                        <CrossIcon size="small" />
                                    </div>
                                }
                            >
                                {item.id}
                            </DropdownItem>
                        ))}
                    </DropdownItemGroup>
                    {hasPredefined && (
                        <DropdownItemGroup title={tableLabels.predifinedViewsLabel}>
                            {tableOptions.map(item => (
                                <DropdownItem key={item.value} onClick={() => setPredefinedView(item)}>
                                    {item.label}
                                </DropdownItem>
                            ))}
                        </DropdownItemGroup>
                    )}
                </DropdownMenu>
            </div>
        </div>
    );
};

NexusSavedTableDropdown.propTypes = {
    userDefinedGridStates: PropTypes.array,
    gridApi: PropTypes.object,
    columnApi: PropTypes.object,
    username: PropTypes.string,
    setUserDefinedGridState: PropTypes.func,
    applyPredefinedTableView: PropTypes.func,
    tableLabels: PropTypes.object,
    tableOptions: PropTypes.array,
    hasPredefined: PropTypes.bool,
};

NexusSavedTableDropdown.defaultProps = {
    userDefinedGridStates: [],
    gridApi: {},
    columnApi: {},
    username: '',
    setUserDefinedGridState: () => null,
    applyPredefinedTableView: () => null,
    tableLabels: {},
    tableOptions: [],
    hasPredefined: false,
};

export default NexusSavedTableDropdown;
