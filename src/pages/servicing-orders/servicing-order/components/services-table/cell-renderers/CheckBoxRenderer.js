import React from 'react';
import PropTypes from 'prop-types';
import CustomActionsCellRenderer from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {get} from 'lodash';
import Constants from './constants';
import './CheckBoxRenderer.scss';

const CheckBoxRenderer = ({tableData, rowIndex, toggleCheck, node, isDisabled}) => {
    return tableData[rowIndex]?.assetType === 'Video' ? (
        <CustomActionsCellRenderer id={rowIndex.toString()}>
            <input
                className="nexus-c-table-checkbox"
                type="checkbox"
                disabled={isDisabled}
                onClick={toggleCheck}
                checked={get(node, 'data.watermark', false)}
            />
        </CustomActionsCellRenderer>
    ) : (
        <span title={Constants.WATERMARKNA}>N/A</span>
    );
};

CheckBoxRenderer.propTypes = {
    tableData: PropTypes.array.isRequired,
    rowIndex: PropTypes.number.isRequired,
    node: PropTypes.object.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    toggleCheck: PropTypes.func.isRequired,
};

export default CheckBoxRenderer;
