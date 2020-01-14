import {momentToISO} from '../../util/Common';
import moment from 'moment';

const getProperTerritoryFormValues = (data, isEdit, existingTerritoryList, territoryIndex) => {
    if (data.country && data.rightContractStatus) {
        let newObject = {
            country: data.country['value'] ? data.country['value'] !== '' && data.country['value'] : existingTerritoryList[territoryIndex]['country'] ? existingTerritoryList[territoryIndex]['country'] : '',
            dateSelected: data.dateSelected ? momentToISO(moment(data.dateSelected).utcOffset(0, true)) :isEdit ?existingTerritoryList[territoryIndex]['dateSelected'] : '',
            selected: data.selected['label'] === 'True' ? data.selected['label'] ? data.selected['value'] : existingTerritoryList[territoryIndex]['selected'] : false,
            rightContractStatus: data.rightContractStatus['value'] ? data.rightContractStatus['value'] : isEdit ? existingTerritoryList[territoryIndex]['rightContractStatus'] : '',
            vuContractId: data.vuContractId ? data.vuContractId.map(e => e.value) : isEdit ? existingTerritoryList[territoryIndex]['vuContractId'] : ''
        };
        let updatedObject = {};
        for (let objectField in newObject) {
            if (newObject[objectField]) {
                updatedObject[objectField] = newObject[objectField];
            } else {
                if (objectField === 'selected') {
                    updatedObject[objectField] = false;
                } else {
                    updatedObject[objectField] = null;
                }
            }
        }
        return updatedObject;
    }
};

export {getProperTerritoryFormValues};