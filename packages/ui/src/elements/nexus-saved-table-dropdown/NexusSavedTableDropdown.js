import React, {useState} from 'react';
import PropTypes from 'prop-types';
import DropdownMenu, {DropdownItem, DropdownItemGroup} from '@atlaskit/dropdown-menu';
import {FieldTextStateless} from '@atlaskit/field-text';
import CheckIcon from '@atlaskit/icon/glyph/check';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import IconButton from '@vubiquity-nexus/portal-ui/lib/atlaskit/icon-button/IconButton';
import {
    MY_SAVED_VIEWS_LABEL,
    MY_PREDEFINED_VIEWS_LABEL,
    SAVED_TABLE_DROPDOWN_LABEL,
    SAVED_TABLE_SELECT_OPTIONS,
} from '../../../../../src/pages/dop-tasks/constants';
import './NexusSavedTableDropdown.scss';

const NexusSavedTableDropdown = ({
    selectPredefinedTableView,
    saveUserDefinedGridState,
    removeUserDefinedGridState,
    selectUserDefinedTableView,
    userDefinedGridStates,
    dopPage,
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
                    {dopPage && (
                        <DropdownItemGroup title={MY_PREDEFINED_VIEWS_LABEL}>
                            {SAVED_TABLE_SELECT_OPTIONS.map(item => (
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
    selectPredefinedTableView: PropTypes.func,
    saveUserDefinedGridState: PropTypes.func,
    removeUserDefinedGridState: PropTypes.func,
    selectUserDefinedTableView: PropTypes.func,
    userDefinedGridStates: PropTypes.array,
    dopPage: PropTypes.bool,
};

NexusSavedTableDropdown.defaultProps = {
    selectPredefinedTableView: () => null,
    saveUserDefinedGridState: () => null,
    removeUserDefinedGridState: () => null,
    selectUserDefinedTableView: () => null,
    userDefinedGridStates: [],
    dopPage: false,
};

export default NexusSavedTableDropdown;
