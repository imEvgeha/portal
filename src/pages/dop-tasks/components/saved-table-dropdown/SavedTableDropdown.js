import React, {useState} from 'react';
import PropTypes from 'prop-types';
import DropdownMenu, {DropdownItem, DropdownItemGroup} from '@atlaskit/dropdown-menu';
import {FieldTextStateless} from '@atlaskit/field-text';
import CheckIcon from '@atlaskit/icon/glyph/check';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import IconButton from '../../../../ui/atlaskit/icon-button/IconButton';
import {
    MY_SAVED_VIEWS_LABEL,
    MY_PREDEFINED_VIEWS_LABEL,
    SAVED_TABLE_DROPDOWN_LABEL,
    SAVED_TABLE_SELECT_OPTIONS,
} from '../../constants';
import './SavedTableDropdown.scss';

const SavedTableDropdown = ({
    selectPredefinedTableView,
    saveUserDefinedGridState,
    removeUserDefinedGridState,
    selectUserDefinedTableView,
    userDefinedGridStates,
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
        removeUserDefinedGridState(item);
    };

    const saveButtonHandler = () => {
        saveUserDefinedGridState(userInput);
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
                                    onClick={() => setShowTextFieldsActions(false)}
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
                    <DropdownItemGroup title={MY_PREDEFINED_VIEWS_LABEL}>
                        {SAVED_TABLE_SELECT_OPTIONS.map(item => (
                            <DropdownItem key={item.value} onClick={() => setPredefinedView(item)}>
                                {item.label}
                            </DropdownItem>
                        ))}
                    </DropdownItemGroup>
                </DropdownMenu>
            </div>
        </div>
    );
};

SavedTableDropdown.propTypes = {
    selectPredefinedTableView: PropTypes.func,
    saveUserDefinedGridState: PropTypes.func,
    removeUserDefinedGridState: PropTypes.func,
    selectUserDefinedTableView: PropTypes.func,
    userDefinedGridStates: PropTypes.array,
};

SavedTableDropdown.defaultProps = {
    selectPredefinedTableView: () => null,
    saveUserDefinedGridState: () => null,
    removeUserDefinedGridState: () => null,
    selectUserDefinedTableView: () => null,
    userDefinedGridStates: [],
};

export default SavedTableDropdown;
