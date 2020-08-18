import {momentToISO} from '../../../../util/Common';
import moment from 'moment';
import {get} from 'lodash';

const getProperTerritoryFormValues = (data, isEdit, existingTerritoryList, territoryIndex) => {
    if (data.country && data.rightContractStatus) {
        const newObject = {
            country: data.country['value']
                ? data.country['value'] !== '' && data.country['value']
                : existingTerritoryList[territoryIndex]['country']
                ? existingTerritoryList[territoryIndex]['country']
                : '',
            dateSelected: data.dateSelected
                ? momentToISO(moment(data.dateSelected).utcOffset(0, true))
                : isEdit
                ? existingTerritoryList[territoryIndex]['dateSelected']
                : '',
            selected:
                data.selected['label'] === 'true'
                    ? data.selected['label']
                        ? data.selected['value']
                        : existingTerritoryList[territoryIndex]['selected']
                    : false,
            rightContractStatus: data.rightContractStatus['value']
                ? data.rightContractStatus['value']
                : isEdit
                ? existingTerritoryList[territoryIndex]['rightContractStatus']
                : '',
            vuContractId: data.vuContractId
                ? data.vuContractId.split(', ')
                : isEdit
                ? existingTerritoryList[territoryIndex]['vuContractId']
                : '',
            comment: data.comment || '',
        };
        const updatedObject = {};
        for (const objectField in newObject) {
            if (newObject[objectField] || newObject['comment'] === '') {
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
            language: get(data, 'language.value', get(existingAudioLanguageList, [audioLanguageIndex, 'language'], '')),
            audioType: get(
                data,
                'audioType.value',
                get(existingAudioLanguageList, [audioLanguageIndex, 'audioType'], '')
            ),
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

const getProperPriceFormValues = (data, isEdit, existingPriceList, priceIndex) => {
    if (data.priceType) {
        const newObject = {
            priceType: get(data, 'priceType.value', get(existingPriceList, [priceIndex, 'priceType'], '')),
            priceValue: get(data, 'priceValue', get(existingPriceList, [priceIndex, 'priceValue'], '')),
            priceCurrency: get(data, 'priceCurrency.value', get(existingPriceList, [priceIndex, 'priceCurrency'], '')),
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

export {getProperTerritoryFormValues, getProperAudioLanguageFormValues, getProperPriceFormValues};
