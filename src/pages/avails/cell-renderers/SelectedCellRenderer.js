import React from 'react';
import loadingGif from '@vubiquity-nexus/portal-assets/img/loading.gif';

const SelectedCellRenderer = params => {
    const {data} = params;
    if (!data) {
        return <img src={loadingGif} alt="loadingSpinner" />;
    }
    if (data && Array.isArray(data['territory'])) {
        const items = data['territory']
            .filter(item => item.selected)
            .map(item => item.country)
            .join(', ');
        return [items];
    }
    return '';
};
export default SelectedCellRenderer;
