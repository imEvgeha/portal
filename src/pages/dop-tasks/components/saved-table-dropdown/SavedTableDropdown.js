import React, {useState} from 'react';
import PropTypes from 'prop-types';
import DropdownMenu, {DropdownItem, DropdownItemGroup} from '@atlaskit/dropdown-menu';
import TextField from '@atlaskit/textfield';
import {
    MY_SAVED_VIEWS_LABEL,
    MY_PREDEFINED_VIEWS_LABEL,
    SAVED_TABLE_DROPDOWN_LABEL,
    SAVED_TABLE_SELECT_OPTIONS,
} from '../../constants';
import './SavedTableDropdown.scss';

const SavedTableDropdown = ({applySavedTableDropDownFilter}) => {
    const [selectedItem, setSelectedItem] = useState(SAVED_TABLE_SELECT_OPTIONS[0]);

    const setSelectedValue = item => {
        setSelectedItem(item);
        applySavedTableDropDownFilter(item.value);
    };

    return (
        <div className="nexus-c-dop-tasks-dropdown">
            <div className="nexus-c-dop-tasks-dropdown__label">{SAVED_TABLE_DROPDOWN_LABEL}</div>
            <div className="nexus-c-dop-tasks-dropdown__elements">
                <DropdownMenu shouldFitContainer appearance="tall" trigger={selectedItem.label} triggerType="button">
                    <DropdownItemGroup title={MY_SAVED_VIEWS_LABEL}>
                        <div className="nexus-c-dop-tasks-dropdown__textfield">
                            <TextField placeholder="New View..." />
                        </div>
                    </DropdownItemGroup>
                    <DropdownItemGroup title={MY_PREDEFINED_VIEWS_LABEL}>
                        {SAVED_TABLE_SELECT_OPTIONS.map(item => (
                            <DropdownItem key={item.value} onClick={() => setSelectedValue(item)}>
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
    applySavedTableDropDownFilter: PropTypes.func,
};

SavedTableDropdown.defaultProps = {
    applySavedTableDropDownFilter: () => null,
};

export default SavedTableDropdown;
