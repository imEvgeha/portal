/* eslint-disable max-params */
import {cloneDeep} from 'lodash';
import moment from 'moment';
import {ELIGIBLE_RIGHT_STATUS, ELIGIBLE_STATUS} from '../pre-plan-actions/constants';

export const isEndDateExpired = (endDate = '') => {
    const currentDate = moment();
    return moment(endDate).isBefore(currentDate);
};

export const prePlanEligible = (
    status,
    rightStatus,
    licensed,
    territory,
    updatedCatalogReceived,
    temporaryPriceReduction,
    end
) => {
    return !!(
        ELIGIBLE_STATUS.includes(status) &&
        ELIGIBLE_RIGHT_STATUS.includes(rightStatus) &&
        licensed &&
        !updatedCatalogReceived &&
        !temporaryPriceReduction &&
        hasAtLeastOneUnselectedTerritory(territory) &&
        !isEndDateExpired(end)
    );
};

export const getEligibleRights = selectedRights => {
    let eligibleRights = [];
    let nonEligibleRights = [];
    selectedRights.forEach(right => {
        const {status, rightStatus, licensed, territory, updatedCatalogReceived, temporaryPriceReduction, end} =
            right || {};
        if (
            prePlanEligible(
                status,
                rightStatus,
                licensed,
                territory,
                updatedCatalogReceived,
                temporaryPriceReduction,
                end
            )
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
    return cloneDeep(rights).map(right => {
        return {
            ...right,
            territorySelected: right.territory.filter(item => item.selected).map(t => t.country),
            territory: right.territory.filter(item => !item.selected),
            territoryAll: right.territory.map(item => item.country).join(', '),
        };
    });
};
