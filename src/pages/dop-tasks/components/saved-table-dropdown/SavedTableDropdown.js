import React, {useState} from 'react';
import DropdownMenu, {DropdownItem, DropdownItemGroup} from '@atlaskit/dropdown-menu';
import TextField from '@atlaskit/textfield';
import {
    MY_SAVED_VIEWS_LABEL,
    MY_PREDEFINED_VIEWS_LABEL,
    SAVED_TABLE_DROPDOWN_LABEL,
    SAVED_TABLE_SELECT_OPTIONS,
} from '../../constants';
import './SavedTableDropdown.scss';

const SavedTableDropdown = () => {
    const [selectedItem, setSelectedItem] = useState(SAVED_TABLE_SELECT_OPTIONS[0].label);
    return (
        <div className="nexus-c-dop-tasks-dropdown">
            <div className="nexus-c-dop-tasks-dropdown__label">{SAVED_TABLE_DROPDOWN_LABEL}</div>
            <div className="nexus-c-dop-tasks-dropdown__elements">
                <DropdownMenu shouldFitContainer appearance="tall" trigger={selectedItem} triggerType="button">
                    <DropdownItemGroup title={MY_SAVED_VIEWS_LABEL}>
                        <div className="nexus-c-dop-tasks-dropdown__textfield">
                            <TextField placeholder="New View..." />
                        </div>
                    </DropdownItemGroup>
                    <DropdownItemGroup title={MY_PREDEFINED_VIEWS_LABEL}>
                        {SAVED_TABLE_SELECT_OPTIONS.map(item => (
                            <DropdownItem key={item.value} onClick={() => setSelectedItem(item.label)}>
                                {item.label}
                            </DropdownItem>
                        ))}
                    </DropdownItemGroup>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default SavedTableDropdown;
