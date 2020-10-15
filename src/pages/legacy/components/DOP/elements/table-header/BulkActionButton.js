import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';
import React, {useState} from 'react';
import PropTypes from 'prop-types';

export const BulkActionButton = props => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle color="light">
                <b>...</b>
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem onClick={props.onBulkPromote}>Select</DropdownItem>
                <DropdownItem onClick={props.onBulkUnPromote}>Unselect</DropdownItem>
                <DropdownItem onClick={props.onBulkIgnore}>Ignore</DropdownItem>
                <DropdownItem onClick={props.onBulkUnIgnore}>Unignore</DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={props.onClearSelection}>Clear Selection</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};

BulkActionButton.propTypes = {
    onBulkPromote: PropTypes.func,
    onBulkUnPromote: PropTypes.func,
    onBulkIgnore: PropTypes.func,
    onBulkUnIgnore: PropTypes.func,
    onClearSelection: PropTypes.func,
};
