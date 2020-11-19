import {cloneDeep} from 'lodash';
import {ELIGIBLE_RIGHT_STATUS, ELIGIBLE_STATUS} from '../pre-plan-actions/constants';

export const prePlanEligible = (
    status,
    rightStatus,
    licensed,
    territory,
    updatedCatalogReceived,
    temporaryPriceReduction
) => {
    return !!(
        ELIGIBLE_STATUS.includes(status) &&
        ELIGIBLE_RIGHT_STATUS.includes(rightStatus) &&
        licensed &&
        !updatedCatalogReceived &&
        !temporaryPriceReduction &&
        hasAtLeastOneUnselectedTerritory(territory)
    );
};

export const getEligibleRights = selectedRights => {
    let eligibleRights = [];
    let nonEligibleRights = [];
    selectedRights.forEach(right => {
        const {status, rightStatus, licensed, territory, updatedCatalogReceived, temporaryPriceReduction} = right || {};
        if (
            prePlanEligible(status, rightStatus, licensed, territory, updatedCatalogReceived, temporaryPriceReduction)
        ) {
            eligibleRights = [...eligibleRights, right];
        } else {
            nonEligibleRights = [...nonEligibleRights, right];
        }
    });
    return [eligibleRights, nonEligibleRights];
};

export const hasAtLeastOneUnselectedTerritory = territory => {
    return territory.filter(item => !item.selected).length > 0;
};

export const filterOutUnselectedTerritories = rights => {
    const filteredSelectedRights = cloneDeep(rights).map(right => {
        const territoriesUnselected = right.territory.filter(item => !item.selected);
        return {
            ...right,
            territory: territoriesUnselected,
            territoryAll: right.territory.map(item => item.country).join(', '),
        };
    });
    return filteredSelectedRights;
};
