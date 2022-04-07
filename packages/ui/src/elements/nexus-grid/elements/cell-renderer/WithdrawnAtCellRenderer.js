import React from 'react';
import loadingGif from '@vubiquity-nexus/portal-assets/img/loading.gif';

const WithdrawnAtCellRenderer = params => {
    const {data} = params;
    if (!data) {
        return <img src={loadingGif} alt="loadingSpinner" />;
    }

    if (data && Array.isArray(data['withdrawnFlatten'])) {
        const items = data['withdrawnFlatten'].filter(item => item.includes('true')).join(', ');
        return [items.replaceAll('true', '')];
    }
    return '';
};
export default WithdrawnAtCellRenderer;
