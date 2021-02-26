import React from 'react';
import PropTypes from "prop-types";
import CustomActionsCellRenderer
    from "@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer";
import {get} from "lodash";
import './CheckBoxRenderer.scss';

const CheckBoxRenderer = ({rowIndex, toggleCheck, node}) => {
    return (
        <CustomActionsCellRenderer id={rowIndex.toString()}>
            <input className="nexus-c-table-checkbox" type="checkbox" onClick={toggleCheck} checked={get(node,'data.watermark', false)} />
        </CustomActionsCellRenderer>
    );
};

CheckBoxRenderer.propTypes = {
    rowIndex: PropTypes.number.isRequired,
    node: PropTypes.object.isRequired,
    toggleCheck: PropTypes.func.isRequired,
};


export default CheckBoxRenderer;
