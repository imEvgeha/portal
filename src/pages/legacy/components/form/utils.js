import {momentToISO} from '../../../../util/Common';
import moment from 'moment';

const getProperTerritoryFormValues = (data, isEdit, existingTerritoryList, territoryIndex) => {
    if (data.country && data.rightContractStatus) {
        const newObject = {
            country: data.country['value'] ? data.country['value'] !== '' && data.country['value'] : existingTerritoryList[territoryIndex]['country'] ? existingTerritoryList[territoryIndex]['country'] : '',
            dateSelected: data.dateSelected ? momentToISO(moment(data.dateSelected).utcOffset(0, true)) :isEdit ?existingTerritoryList[territoryIndex]['dateSelected'] : '',
            selected: data.selected['label'] === 'true' ? data.selected['label'] ? data.selected['value'] : existingTerritoryList[territoryIndex]['selected'] : false,
            rightContractStatus: data.rightContractStatus['value'] ? data.rightContractStatus['value'] : isEdit ? existingTerritoryList[territoryIndex]['rightContractStatus'] : '',
            vuContractId: data.vuContractId ? data.vuContractId.map(e => e.value) : isEdit ? existingTerritoryList[territoryIndex]['vuContractId'] : ''
        };
        const updatedObject = {};
        for (const objectField in newObject) {
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

const getProperAudioLanguageFormValues = (data, isEdit, existingAudioLanguageList, audioLanguageIndex) => {
    if (data.language) {
        const newObject = {
            language: data.language['value'] ? data.language['value'] !== '' && data.language['value'] : existingAudioLanguageList[audioLanguageIndex]['language'] ? existingAudioLanguageList[audioLanguageIndex]['language'] : '',
            audioType: data.audioType['value'] ? data.audioType['value'] !== '' && data.audioType['value'] : existingAudioLanguageList[audioLanguageIndex]['audioType'] ? existingAudioLanguageList[audioLanguageIndex]['audioType'] : '',
        };
        const updatedObject = {};
        for (const objectField in newObject) {
            if (newObject[objectField]) {
                updatedObject[objectField] = newObject[objectField];
            } else {
                updatedObject[objectField] = null;
            }
        }
        return updatedObject;
    }
};

export {getProperTerritoryFormValues, getProperAudioLanguageFormValues};
