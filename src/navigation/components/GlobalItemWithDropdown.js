import React, {useState} from 'react';
import {DropdownMenuStateless} from '@atlaskit/dropdown-menu';
import PropTypes from 'prop-types';

let GlobalItemWithDropdown = ({items, trigger: Trigger}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <DropdownMenuStateless
            boundariesElement="window"
            isOpen={isOpen}
            onOpenChange={({isOpen}) => setIsOpen(isOpen)}
            position="right bottom"
            trigger={<Trigger isOpen={isOpen} />}
        >
            {items}
        </DropdownMenuStateless>
    );
};

GlobalItemWithDropdown.propTypes = {
    items: PropTypes.object,
    trigger: PropTypes.any,
};

GlobalItemWithDropdown.defaultProps = {
    items: {},
    trigger: () => null,
};

export default GlobalItemWithDropdown;

