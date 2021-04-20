import React from 'react';
import loadingGif from '@vubiquity-nexus/portal-assets/img/loading.gif';
import NexusTooltip from '@vubiquity-nexus/portal-ui/lib/elements/nexus-tooltip/NexusTooltip';
import {getDeepValue} from '@vubiquity-nexus/portal-utils/lib/Common';
import {getIcon} from '../value-formatter/createValueFormatter';

const IconCellRenderer = params => {
    const {
        data,
        colDef: {field},
        valueToDisplay = null,
        icon = '',
        tooltip = '',
    } = params;
    if (!data) {
        return <img src={loadingGif} alt="loadingSpinner" />;
    }

    const value = getDeepValue(data, field);

    return (!valueToDisplay && value) || (valueToDisplay && value === valueToDisplay) ? (
        <NexusTooltip content={tooltip}>
            <span className="nexus-c-repository-icon">{getIcon(icon, false)}</span>
        </NexusTooltip>
    ) : (
        ' '
    );
};
export default IconCellRenderer;
