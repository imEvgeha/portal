import React from 'react';
import PropTypes from 'prop-types';
import {isNexusTitle} from '@vubiquity-nexus/portal-utils/lib/utils';
import './TitleSelectionRenderer.scss';

const TitleSelectionRenderer = ({
    value,
    column,
    node,
    isNexusDisabled,
    selectionType,
    restrictedIds,
    selectedItems,
}) => {
    const columnId = node?.data?.id;
    const isSelected = selectedItems.find(elem => elem.id === columnId);

    const checkedHandler = event => {
        node.setDataValue(column.colId, event.target.checked);
    };

    return (isNexusDisabled && isNexusTitle(node.id)) || restrictedIds.includes(node.id) ? (
        ''
    ) : (
        <input
            type={selectionType}
            className={`title-selection-${selectionType}__${value ? 'selected' : 'unselected'}`}
            onChange={checkedHandler}
            checked={isSelected ? true : value}
        />
    );
};

TitleSelectionRenderer.propTypes = {
    value: PropTypes.bool,
    column: PropTypes.object,
    node: PropTypes.object,
    isNexusDisabled: PropTypes.bool,
    selectionType: PropTypes.string,
    restrictedIds: PropTypes.array,
    selectedItems: PropTypes.array,
};

TitleSelectionRenderer.defaultProps = {
    value: false,
    column: {},
    node: {},
    isNexusDisabled: false,
    selectionType: 'checkbox',
    restrictedIds: [],
    selectedItems: [],
};

export default TitleSelectionRenderer;
