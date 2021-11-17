import React from 'react';
import NexusTooltip from '@vubiquity-nexus/portal-ui/lib/elements/nexus-tooltip/NexusTooltip';
import {getDeepValue} from '@vubiquity-nexus/portal-utils/lib/Common';

const WordsCellRenderer = params => {
    const {
        data,
        colDef: {field},
        valueToDisplay = null,
        tooltip = '',
    } = params;

    if (data) {
        const value = getDeepValue(data, field);
        return (!valueToDisplay && value) || (valueToDisplay && value === valueToDisplay) ? (
            <NexusTooltip content={tooltip}>
                <span className="nexus-c-repository-icon">{value.map(item => item).join(', ')}</span>
            </NexusTooltip>
        ) : (
            ' '
        );
    }
    return '';
};
export default WordsCellRenderer;
