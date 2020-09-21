import React from 'react';
import DropdownMenu, {DropdownItem, DropdownItemGroup} from '@atlaskit/dropdown-menu';
import TextField from '@atlaskit/textfield';
import {MY_SAVED_VIEWS_LABEL, MY_PREDEFINED_VIEWS_LABEL, SAVED_TABLE_DROPDOWN_LABEL} from '../../constants';
import './SavedTableDropdown.scss';

const SavedTableDropdown = () => (
    <div className="nexus-c-dop-tasks-dropdown">
        <div className="nexus-c-dop-tasks-dropdown__label">{SAVED_TABLE_DROPDOWN_LABEL}</div>
        <div className="nexus-c-dop-tasks-dropdown__elements">
            <DropdownMenu shouldFitContainer trigger="All" triggerType="button">
                <DropdownItemGroup title={MY_SAVED_VIEWS_LABEL}>
                    <div className="nexus-c-dop-tasks-dropdown__textfield">
                        <TextField placeholder="New View..." />
                    </div>
                    <DropdownItem>Vancouver</DropdownItem>
                </DropdownItemGroup>
                <br />
                <DropdownItemGroup title={MY_PREDEFINED_VIEWS_LABEL}>
                    <DropdownItem>Toronto</DropdownItem>
                    <DropdownItem>Vancouver</DropdownItem>
                </DropdownItemGroup>
            </DropdownMenu>
        </div>
    </div>
);

export default SavedTableDropdown;
