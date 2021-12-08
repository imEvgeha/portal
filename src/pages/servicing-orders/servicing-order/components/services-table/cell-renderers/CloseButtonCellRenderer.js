import React from 'react';
import PropTypes from 'prop-types';
import EditorRemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import CustomActionsCellRenderer from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';

const CloseButtonCellRenderer = ({rowIndex, isDisabled, handleServiceRemoval}) => {
    return (
        <CustomActionsCellRenderer id={rowIndex.toString()} classname="nexus-c-services__close-icon">
            {!isDisabled && rowIndex !== 0 && (
                <span onClick={() => handleServiceRemoval(rowIndex)}>
                    <EditorRemoveIcon size="medium" primaryColor="grey" />
                </span>
            )}
        </CustomActionsCellRenderer>
    );
};

CloseButtonCellRenderer.propTypes = {
    rowIndex: PropTypes.number.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    handleServiceRemoval: PropTypes.func.isRequired,
};

export default CloseButtonCellRenderer;
