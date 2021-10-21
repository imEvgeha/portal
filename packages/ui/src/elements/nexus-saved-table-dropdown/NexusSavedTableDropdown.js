import React, {useState} from 'react';
import PropTypes from 'prop-types';
import DropdownMenu, {DropdownItem, DropdownItemGroup} from '@atlaskit/dropdown-menu';
import {FieldTextStateless} from '@atlaskit/field-text';
import CheckIcon from '@atlaskit/icon/glyph/check';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import IconButton from '@vubiquity-nexus/portal-ui/lib/atlaskit/icon-button/IconButton';
import {getSortModel, setSorting} from '@vubiquity-nexus/portal-utils/lib/utils';
import {isEmpty} from 'lodash';
import {
    MY_SAVED_VIEWS_LABEL,
    MY_PREDEFINED_VIEWS_LABEL,
    SAVED_TABLE_DROPDOWN_LABEL,
    SAVED_TABLE_SELECT_OPTIONS,
} from '../../../../../src/pages/dop-tasks/constants';
// import {
//     GROUPED_OPTIONS,
//     SAVED_TABLE_DROPDOWN_LABEL,
//     SAVED_TABLE_SELECT_OPTIONS,
//     READY_PENDING_VIEW,
//     ERROR_VIEW,
//     WITHDRAWN_VIEW,
//     REMOVED_FROM_CATALOG_VIEW,
// } from '../../../saved-table-dropdown/constants';
import './NexusSavedTableDropdown.scss';
import {insertNewGridModel} from '../../../../../src/pages/dop-tasks/utils';

const NexusSavedTableDropdown = ({
    userDefinedGridStates,

    dopPage,
    gridApi,
    columnApi,
    username,
    setUserDefinedGridState,

    applyPredefinedTableView,
}) => {
    const [selectedItem, setSelectedItem] = useState(SAVED_TABLE_SELECT_OPTIONS[0]);
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
            setSelectedItem(SAVED_TABLE_SELECT_OPTIONS[0]);
            selectPredefinedTableView(SAVED_TABLE_SELECT_OPTIONS[0].value);
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
            <div className="nexus-c-dop-tasks-dropdown__label">{SAVED_TABLE_DROPDOWN_LABEL}</div>
            <div className="nexus-c-dop-tasks-dropdown__elements">
                <DropdownMenu shouldFitContainer appearance="tall" trigger={selectedItem.label} triggerType="button">
                    <DropdownItemGroup title={MY_SAVED_VIEWS_LABEL}>
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
                    {/* {dopPage && ( */}
                    <DropdownItemGroup title={MY_PREDEFINED_VIEWS_LABEL}>
                        {SAVED_TABLE_SELECT_OPTIONS.map(item => (
                            <DropdownItem key={item.value} onClick={() => setPredefinedView(item)}>
                                {item.label}
                            </DropdownItem>
                        ))}
                    </DropdownItemGroup>
                    ){/* } */}
                </DropdownMenu>
            </div>
        </div>
    );
};

NexusSavedTableDropdown.propTypes = {
    selectPredefinedTableView: PropTypes.func,
    saveUserDefinedGridState: PropTypes.func,
    removeUserDefinedGridState: PropTypes.func,
    selectUserDefinedTableView: PropTypes.func,
    userDefinedGridStates: PropTypes.array,
    dopPage: PropTypes.bool,
    gridApi: PropTypes.object,
    columnApi: PropTypes.object,
    username: PropTypes.string,
    setUserDefinedGridState: PropTypes.func,
    applyPredefinedTableView: PropTypes.func,
};

NexusSavedTableDropdown.defaultProps = {
    selectPredefinedTableView: () => null,
    saveUserDefinedGridState: () => null,
    removeUserDefinedGridState: () => null,
    selectUserDefinedTableView: () => null,
    userDefinedGridStates: [],
    dopPage: false,
    gridApi: {},
    columnApi: {},
    username: '',
    setUserDefinedGridState: () => null,
    applyPredefinedTableView: () => null,
};

export default NexusSavedTableDropdown;
