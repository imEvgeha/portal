import React from 'react';
import PropTypes from 'prop-types';
import {isNexusTitle} from '@vubiquity-nexus/portal-utils/lib/utils';
import './TitleSelectionRenderer.scss';

const TitleSelectionRenderer = ({value, column, node, isNexusDisabled, selectionType}) => {
    const checkedHandler = event => {
        node.setDataValue(column.colId, event.target.checked);
    };

    return isNexusDisabled && node.id && isNexusTitle(node.id) ? (
        ''
    ) : (
        <input type={selectionType} onClick={checkedHandler} checked={value} />
    );
};

TitleSelectionRenderer.propTypes = {
    value: PropTypes.bool,
    column: PropTypes.object,
    node: PropTypes.object,
    isNexusDisabled: PropTypes.bool,
    selectionType: PropTypes.string,
};

TitleSelectionRenderer.defaultProps = {
    value: false,
    column: {},
    node: {},
    isNexusDisabled: false,
    selectionType: 'checkbox',
};

export default TitleSelectionRenderer;
