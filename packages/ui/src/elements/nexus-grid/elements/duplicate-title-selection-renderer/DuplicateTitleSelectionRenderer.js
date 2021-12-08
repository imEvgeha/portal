import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {isNexusTitle} from '@vubiquity-nexus/portal-utils/lib/utils';
import './DuplicateTitleSelectionRenderer.scss';
import {MatchAndDuplicateListContext} from '../../hoc/withMatchAndDuplicateList';

const DuplicateTitleSelectionRenderer = ({
    // value,
    column,
    node,
    isNexusDisabled,
    selectionType,
    restrictedIds,
}) => {
    const columnId = node?.data?.id;
    const {duplicateList} = useContext(MatchAndDuplicateListContext);
    const isSelectedDuplicateList = duplicateList.find(elem => elem.id === columnId);

    const checkedHandler = event => {
        node.setDataValue(column.colId, event.target.checked);
    };

    return (isNexusDisabled && isNexusTitle(node.id)) || restrictedIds.includes(node.id) ? (
        ''
    ) : (
        <input
            type={selectionType}
            className={`title-selection-${selectionType}__${isSelectedDuplicateList ? 'selected' : 'unselected'}`}
            onChange={checkedHandler}
            checked={isSelectedDuplicateList}
        />
    );
};

DuplicateTitleSelectionRenderer.propTypes = {
    value: PropTypes.bool,
    column: PropTypes.object,
    node: PropTypes.object,
    isNexusDisabled: PropTypes.bool,
    selectionType: PropTypes.string,
    restrictedIds: PropTypes.array,
};

DuplicateTitleSelectionRenderer.defaultProps = {
    value: false,
    column: {},
    node: {},
    isNexusDisabled: false,
    selectionType: 'checkbox',
    restrictedIds: [],
};

export default DuplicateTitleSelectionRenderer;
