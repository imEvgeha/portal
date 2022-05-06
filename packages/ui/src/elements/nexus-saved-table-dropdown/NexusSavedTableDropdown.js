import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import DropdownMenu, {DropdownItem, DropdownItemGroup} from '@atlaskit/dropdown-menu';
import {FieldTextStateless} from '@atlaskit/field-text';
import CheckIcon from '@atlaskit/icon/glyph/check';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import Tooltip from '@atlaskit/tooltip';
import {getSortModel, setSorting} from '@vubiquity-nexus/portal-utils/lib/utils';
import {isEmpty} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import './NexusSavedTableDropdown.scss';
import {setColumnTableDefinition} from '../../../../../src/pages/avails/rights-repository/rightsActions';
import {getLastUserColumnState} from '../../../../../src/pages/avails/rights-repository/rightsSelectors';
import IconButton from '../../atlaskit/icon-button/IconButton';

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
}) => {
    const dispatch = useDispatch();
    const previousGridState = useSelector(getLastUserColumnState(username));
    const [selectedItem, setSelectedItem] = useState(currentUserView?.label ? currentUserView : tableOptions[0]);

    const [showTextFieldActions, setShowTextFieldsActions] = useState(false);
    const [userInput, setUserInput] = useState('');

    useEffect(() => {
        setCurrentUserView(selectedItem);
    }, [selectedItem]);

    useEffect(() => {
        // will create the predefined user views in the dropdown
        if (username && isEmpty(previousGridState)) {
            const predefinedTableViews = tableOptions.map(({label, value}) => ({
                id: value,
                label,
                value,
                isPredefinedView: true,
            }));

            dispatch(setColumnTableDefinition({[username]: predefinedTableViews}));
        }
    }, [username]);

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
        // Line below used to block applying stored filter for titleMetadata page
        setBlockLastFilter(false);
        saveUserDefinedGridState(userInput);
        setSelectedItem({label: userInput, value: userInput});
        setUserInput('');
    };

    const saveUserDefinedGridState = viewId => {
        if (!isEmpty(gridApi) && !isEmpty(columnApi) && username && viewId) {
            const filterModel = gridApi.getFilterModel();
            const sortModel = getSortModel(columnApi);
            const columnState = columnApi.getColumnState();
            const model = {id: viewId, filterModel, sortModel, columnState, externalFilter};
            const newUserData = insertNewGridModel(viewId, userDefinedGridStates, model);
            // merge the existing views of the user with new views
            dispatch(setColumnTableDefinition({[username]: [...newUserData, ...previousGridState]}));
        }
    };

    const removeUserDefinedGridState = id => {
        const filteredGridStates = userDefinedGridStates.filter(item => item.id !== id);
        dispatch(setColumnTableDefinition({[username]: filteredGridStates}));
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
            columnApi?.applyColumnState({state: columnState});
            onUserDefinedViewSelected(selectedModel[0]);
        }
    };

    return (
        <div className="nexus-c-dop-tasks-dropdown">
            <div className="nexus-c-dop-tasks-dropdown__elements">
                <DropdownMenu
                    shouldFitContainer
                    appearance="tall"
                    triggerButtonProps={{isDisabled}}
                    trigger={selectedItem?.label}
                    triggerType="button"
                >
                    <DropdownItemGroup title={tableLabels?.savedViewslabel}>
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
                    <DropdownItemGroup title={tableLabels.predifinedViewsLabel}>
                        {tableOptions.map(item => (
                            <Tooltip key={item.value} content={item.label}>
                                <DropdownItem onClick={() => setPredefinedView(item)}>{item.label}</DropdownItem>
                            </Tooltip>
                        ))}
                    </DropdownItemGroup>
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
    externalFilter: PropTypes.object,
    applyPredefinedTableView: PropTypes.func,
    onUserDefinedViewSelected: PropTypes.func,
    tableLabels: PropTypes.object,
    tableOptions: PropTypes.array,
    setBlockLastFilter: PropTypes.func,
    isDisabled: PropTypes.bool,
    setCurrentUserView: PropTypes.func,
    currentUserView: PropTypes.object,
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
};

export default NexusSavedTableDropdown;
