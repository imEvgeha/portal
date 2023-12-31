import {getDefaultValue, getValidationError, checkFieldDependencies, getProperValue} from './utils';
import {VIEWS} from './constants';

describe('Utils', () => {
    const field = {
        name: 'Right ID',
        type: 'string',
        path: 'id',
        viewConfig: [
            {
                view: 'CREATE',
                defaultValue: '1234',
            },
        ],
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

    describe('checkFieldDependencies', () => {
        const formData = {
            'Core TitleId': 'titl_TxodB',
        };
        const dependencies = [
            {
                view: 'EDIT',
                type: 'required',
                fields: [
                    {
                        name: 'Core TitleId',
                        value: 'any',
                    },
                ],
            },
        ];
        it('should return true when the dependencies include a field that has value', () => {
            expect(checkFieldDependencies('required', VIEWS.EDIT, dependencies, {formData})).toEqual(true);
        });

        it('should return false when the dependencies include a field that does not have value', () => {
            expect(checkFieldDependencies('required', VIEWS.EDIT, dependencies, {})).toEqual(false);
        });
    });

    describe('getProperValue', () => {
        it('should return number when the field type is number', () => {
            expect(getProperValue('number', '123', 'count')).toEqual({count: 123});
        });
        it('should return values when the field type is dateRange', () => {
            expect(
                getProperValue(
                    'dateRange',
                    {
                        startDate: '123',
                        endDate: '345',
                    },
                    ['date1', 'date2']
                )
            ).toEqual({date1: '123', date2: '345'});
        });
    });
});
