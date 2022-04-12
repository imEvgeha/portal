import React from 'react';
import Error from '@atlaskit/icon/glyph/error';
import Warning from '@atlaskit/icon/glyph/warning';
import {getDeepValue} from "@vubiquity-nexus/portal-utils/lib/Common";
import NexusTooltip from "../../../nexus-tooltip/NexusTooltip";

const WordsCellRenderer = params => {
    const {
        data,
        colDef: {field},
        valueToDisplay = null,
        tooltip = '',
    } = params;

    if (data) {
        const value = getDeepValue(data, field);

        const msg = [];
        let severityType = '';

        const columnDefinitionSeverity = (backgroundColor, children) => {
            return (
                <div style={{background: backgroundColor}}>
                    {value.map(item => item).join(', ')}
                    <span style={{float: 'right'}} title={msg.join(', ')}>
                        {children}
                    </span>
                </div>
            );
        };

        params.data.validationErrors.forEach(validation => {
            const fieldName = validation.fieldName.includes('[')
                ? validation.fieldName.split('[')[0]
                : validation.fieldName;

            if (field === fieldName) {
                msg.push(validation.message);

                if (severityType === '' || (validation.severityType === 'Error' && severityType === 'Warning')) {
                    severityType = validation.severityType;
                }
            }
        });

        if (severityType === 'Error') {
            return columnDefinitionSeverity('#FF8F73', <Error />);
        } else if (severityType === 'Warning') {
            return columnDefinitionSeverity('#FFE380', <Warning />);
        } else if ((severityType === '' && !valueToDisplay && value) || (valueToDisplay && value === valueToDisplay)) {
            return (
                <NexusTooltip content={tooltip}>
                    <span className="nexus-c-repository-icon">{value.map(item => item).join(', ')}</span>
                </NexusTooltip>
            );
        }
    }

    return '';
};
export default WordsCellRenderer;
