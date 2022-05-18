import React from 'react';
import loadingGif from '@vubiquity-nexus/portal-assets/img/loading.gif';
import {get} from 'lodash';
import {filterBy} from '../../utils';

const SelectedAtCellRenderer = params => {
    const {data, api, applyFilter} = params;
    if (!data) {
        return <img src={loadingGif} alt="loadingSpinner" />;
    }

    // new column 'selected at' has type date in filter but should show 'selected' column values
    if (api) {
        // selectedAt col - filter and display territories that are in date range
        const filters = filterBy(api.getFilterModel());
        if (
            applyFilter &&
            (get(filters, 'territoryDateSelected.territoryDateSelectedFrom') ||
                get(filters, 'territoryDateSelected.territoryDateSelectedTo'))
        ) {
            let selectedAt = '';
            data?.territory?.forEach(t => {
                const fromOnlyCheck =
                    filters &&
                    filters.territoryDateSelected &&
                    filters.territoryDateSelected.territoryDateSelectedFrom &&
                    !filters.territoryDateSelected.territoryDateSelectedTo &&
                    t.dateSelected >= filters.territoryDateSelected?.territoryDateSelectedFrom;
                const toOnlyCheck =
                    filters &&
                    filters.territoryDateSelected &&
                    filters.territoryDateSelected.territoryDateSelectedTo &&
                    !filters.territoryDateSelected.territoryDateSelectedFrom &&
                    t.dateSelected <= filters.territoryDateSelected?.territoryDateSelectedTo;
                const fromToCheck =
                    filters &&
                    filters.territoryDateSelected &&
                    filters.territoryDateSelected.territoryDateSelectedFrom &&
                    filters.territoryDateSelected.territoryDateSelectedTo &&
                    t.dateSelected >= filters.territoryDateSelected?.territoryDateSelectedFrom &&
                    t.dateSelected <= filters.territoryDateSelected?.territoryDateSelectedTo;

                if (fromToCheck || toOnlyCheck || fromOnlyCheck) {
                    selectedAt = `${selectedAt + t.country}, `;
                }
            });
            return selectedAt ? selectedAt.slice(0, -2) : ''; // remove last comma
        }
        if (api && data && Array.isArray(data['territorySelected'])) {
            const items = data['territorySelected'].join(', ');
            return [items];
        } else if (data && Array.isArray(data['territory'])) {
            const items = data['territory']
                .filter(item => item.selected)
                .map(item => item.country)
                .join(', ');
            return [items];
        }
    }
    return '';
};
export default SelectedAtCellRenderer;
