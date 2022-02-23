import React from 'react';
import Error from '@atlaskit/icon/glyph/error';
import Warning from '@atlaskit/icon/glyph/warning';
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

        const msg = [];
        let severityType = '';
        params.data.validationErrors.forEach(function (validation) {
            const fieldName = validation.fieldName.includes('[')
                ? validation.fieldName.split('[')[0]
                : validation.fieldName;

            if (field === fieldName) {
                msg.push(validation.message);

                if (severityType === '' || (validation.severityType === 'Error' && severityType === 'Warning')) {
                    // eslint-disable-next-line prefer-destructuring
                    severityType = validation.severityType;
                }
            }
        });

        if (severityType === 'Error') {
            return (
                <div style={{background: '#FF8F73'}}>
                    {value.map(item => item).join(', ')}
                    <span style={{float: 'right'}} title={msg.join(', ')}>
                        <Error />
                    </span>
                </div>
            );
        } else if (severityType === 'Warning') {
            return (
                <div style={{background: '#FFE380'}}>
                    {value.map(item => item).join(', ')}
                    <span style={{float: 'right'}} title={msg.join(', ')}>
                        <Warning />
                    </span>
                </div>
            );
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
