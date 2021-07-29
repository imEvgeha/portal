import React from 'react';
import loadingGif from '@vubiquity-nexus/portal-assets/img/loading.gif';
import {filterBy} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/utils';
import {getDeepValue} from '@vubiquity-nexus/portal-utils/lib/Common';

const SelectedAtCellRenderer = params => {
    const {
        data,
        colDef: {field},
        api,
    } = params;
    if (!data) {
        return <img src={loadingGif} alt="loadingSpinner" />;
    }

    // new column 'selected at' has type date in filter but should show 'selected' column values
    if (api) {
        // selectedAt col - filter and display territories that are in date range
        const filters = filterBy(api.getFilterModel());
        if (
            filters.territoryDateSelected.territoryDateSelectedFrom ||
            filters.territoryDateSelected.territoryDateSelectedTo
        ) {
            let selectedAt = '';
            data?.territory?.forEach(t => {
                const fromOnlyCheck =
                    filters.territoryDateSelected.territoryDateSelectedFrom &&
                    !filters.territoryDateSelected.territoryDateSelectedTo &&
                    t.dateSelected >= filters.territoryDateSelected?.territoryDateSelectedFrom;
                const toOnlyCheck =
                    filters.territoryDateSelected.territoryDateSelectedTo &&
                    !filters.territoryDateSelected.territoryDateSelectedFrom &&
                    t.dateSelected <= filters.territoryDateSelected?.territoryDateSelectedTo;
                const fromToCheck =
                    filters.territoryDateSelected.territoryDateSelectedFrom &&
                    filters.territoryDateSelected.territoryDateSelectedTo &&
                    t.dateSelected >= filters.territoryDateSelected?.territoryDateSelectedFrom &&
                    t.dateSelected <= filters.territoryDateSelected?.territoryDateSelectedTo;

                if (fromToCheck || toOnlyCheck || fromOnlyCheck) {
                    selectedAt = `${selectedAt + t.country  }, `;
                }
            });
            return selectedAt.slice(0, -2); // remove last comma
        }
    }
    return '';
};
export default SelectedAtCellRenderer;
