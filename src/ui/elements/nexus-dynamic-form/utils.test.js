import {getDefaultValue, getValidationError} from './utils';
import {VIEWS} from './constants';

describe('Utils', () => {
    const field = {
        name: 'Right ID',
        type: 'string',
        path: 'id',
        defaultValueCreate: '1234',
    };
    describe('getDefaultValue', () => {
        it('should return the defaultValueCreate when the view is create', () => {
            expect(getDefaultValue(field, VIEWS.CREATE, {})).toEqual('1234');
        });

        it('should return the value from data when the view is edit', () => {
            expect(getDefaultValue(field, VIEWS.EDIT, {id: 'rght_zrp8g'})).toEqual('rght_zrp8g');
        });
    });

    describe('getValidationError', () => {
        const validationErrors = [
            {
                fieldName: 'id',
                message: "field 'id' required if 'contentType == 'Season''",
                sourceDetails: {
                    originalFieldName: 'id',
                },
                severityType: 'Warning',
            },
        ];
        it('should return the defaultValueCreate when the view is create', () => {
            expect(getValidationError(validationErrors, field)).toEqual(
                "field 'id' required if 'contentType == 'Season''"
            );
        });

        it('should return the value from data when the view is edit', () => {
            const fieldTitle = {
                name: 'Title',
                type: 'string',
                path: 'title',
            };
            expect(getValidationError(validationErrors, fieldTitle)).toEqual(null);
        });
    });
});
