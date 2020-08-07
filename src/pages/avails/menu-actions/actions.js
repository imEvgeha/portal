import {cloneDeep} from "lodash";

export const prePlanEligible = (status, rightStatus, licensed, territory) => {
    if (
        ['ReadyNew', 'Ready'].includes(status) &&
        ['Pending', 'Confirmed', 'Tentative'].includes(rightStatus) &&
        licensed &&
        hasAtLeastOneUnselectedTerritory(territory)
    ) {
        return true;
    }
    return false;
};

export const getEligibleRights = selectedRights => {
    let eligibleRights = [];
    let nonEligibleRights = [];
    selectedRights.forEach(right => {
        const {status, rightStatus, licensed, territory} = right || {};
        if (prePlanEligible(status, rightStatus, licensed, territory)) {
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
        };
    });
    return filteredSelectedRights;
};
