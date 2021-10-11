import React from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from '@atlaskit/checkbox';
import {Field as AKField, CheckboxField} from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import NexusTextArea from '@vubiquity-nexus/portal-ui/lib/elements/nexus-textarea/NexusTextArea';
import {isObject} from '@vubiquity-nexus/portal-utils/lib/Common';
import {get} from 'lodash';
import {compose} from 'redux';
import ErrorBoundary from '../../../nexus-error-boundary/ErrorBoundary';
import NexusSelect from '../../../nexus-select/NexusSelect';
import {VIEWS, FIELDS_WITHOUT_LABEL, LOCALIZED_VALUE_NOT_DEFINED} from '../../constants';
import withOptionalCheckbox from '../../hoc/withOptionalCheckbox';
import {
    checkFieldDependencies,
    getFieldValue,
    getValidationFunction,
    renderLabel,
    renderError,
    createUrl,
} from '../../utils';
import CastCrew from './components/CastCrew/CastCrew';
import DateTime from './components/DateTime/DateTime';
import Licensors from './components/Licensors/Licensors';
import MsvIds from './components/MsvIds/MsvIds';
import './NexusField.scss';

const DateTimeWithOptional = compose(withOptionalCheckbox())(DateTime);

const NexusTextAreaWithOptional = compose(withOptionalCheckbox())(NexusTextArea);

const CheckboxWithOptional = compose(withOptionalCheckbox())(Checkbox);

const TextFieldWithOptional = compose(withOptionalCheckbox())(TextField);

const NexusField = ({
    isHighlighted,
    selectValues,
    path,
    type,
    view,
    tooltip,
    isRequiredVZ,
    oneIsRequiredVZ,
    formData,
    getValues,
    isReadOnly,
    isReadOnlyInEdit,
    isRequired,
    dependencies,
    validationError,
    validation,
    dateType,
    labels,
    optionsConfig,
    label,
    isOptional,
    maxLength,
    setFieldValue,
    useCurrentDate,
    getCurrentValues,
    isReturningTime,
    config,
    isEditable,
    isGridLayout,
    isVerticalLayout,
    searchPerson,
    castCrewConfig,
    generateMsvIds,
    setDisableSubmit,
    initialData,
    linkConfig,
    showLocalized,
    localizationConfig,
    setUpdatedValues,
    isClearable,
    isTitlePage,
    ...props
}) => {
    const checkDependencies = type => {
        return checkFieldDependencies(type, view, dependencies, {formData, config, isEditable, getCurrentValues});
    };

    const addedProps = {
        isOptional,
        setFieldValue,
        path,
        view,
        maxLength,
    };

    const emetLanguage = get(formData, 'editorial.language');
    const newShowLocalized = emetLanguage?.value === 'en' ? false : showLocalized;

    const getLanguage = () => {
        const language = get(formData, 'editorial.language', 'en');
        return get(language, 'value') ? get(language, 'value') : language;
    };
    const getIsReadOnly = () => {
        return (isReadOnlyInEdit && view === VIEWS.EDIT) || isReadOnly;
    };

    const dateProps = {
        isDisabled: checkDependencies('readOnly'),
        labels,
        type,
        dateType,
        isReadOnly: getIsReadOnly() || checkDependencies('readOnly'),
        useCurrentDate,
        isReturningTime,
        isClearable,
        ...addedProps,
    };

    const disableSaveButton = () => {
        typeof setDisableSubmit === 'function' && setDisableSubmit(false);
    };

    const [dir, setDir] = React.useState('ltr');
    const [textFieldVal, setTextFieldVal] = React.useState(undefined);
    const hebrew = /[\u0590-\u05FF]/;
    const punctuation = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
    const LEFT_TO_RIGHT = 'ltr';
    const RIGHT_TO_LEFT = 'rtl';

    const handleOnChange = (e, cb) => {
        const {value} = e.target;
        if (hebrew.test(value) || (dir === RIGHT_TO_LEFT && punctuation.test(value))) {
            setDir(RIGHT_TO_LEFT);
        } else {
            setDir(LEFT_TO_RIGHT);
        }

        setTextFieldVal(value);
        setUpdatedValues(getCurrentValues());
        cb(e);
    };

    const renderFieldEditMode = fieldProps => {
        const selectFieldProps = {...fieldProps};
        const fieldOnChange = selectFieldProps.onChange;
        const multiselectFieldProps = {...fieldProps};
        let selectLocalizedValues = null;
        let newOptionsConfig = null;
        setTextFieldVal(fieldProps.value);

        switch (type) {
            case 'string':
            case 'stringInArray':
            case 'link':
                return (
                    <TextFieldWithOptional
                        {...fieldProps}
                        {...addedProps}
                        onChange={e => handleOnChange(e, fieldOnChange)}
                        placeholder={`Enter ${label}`}
                        value={textFieldVal || fieldProps.value}
                        dir={dir}
                    />
                );
            case 'textarea':
                return (
                    <NexusTextAreaWithOptional
                        {...fieldProps}
                        {...addedProps}
                        onChange={e => handleOnChange(e, fieldOnChange)}
                        placeholder={`Enter ${label}`}
                        dir={dir}
                    />
                );
            case 'number':
                return (
                    <TextFieldWithOptional
                        {...fieldProps}
                        {...addedProps}
                        onChange={e => handleOnChange(e, fieldOnChange)}
                        type="Number"
                        placeholder={`Enter ${label}`}
                        dir={dir}
                    />
                );
            case 'boolean':
                return (
                    <CheckboxField
                        isDisabled={getIsReadOnly() || checkDependencies('readOnly')}
                        name={fieldProps.name}
                        label={fieldProps.label}
                        defaultIsChecked={fieldProps.value}
                    >
                        {({fieldProps}) => (
                            <CheckboxWithOptional
                                onChange={setUpdatedValues(getCurrentValues())}
                                isDisabled={getIsReadOnly() || checkDependencies('readOnly')}
                                {...addedProps}
                                {...fieldProps}
                                onFocus={disableSaveButton}
                            />
                        )}
                    </CheckboxField>
                );
            case 'select':
                if (get(fieldProps, 'value.value', undefined) === undefined) {
                    selectFieldProps.value = {
                        label: fieldProps.value,
                        value: fieldProps.value,
                    };
                }
                // set label to full text string (not code). label is used in select as display text
                if (/locale/i.test(fieldProps.name)) {
                    const selectVal = getValueFromSelectValues('country', fieldProps.value);
                    selectFieldProps.value =
                        typeof selectVal === 'string'
                            ? {
                                  label: selectVal,
                                  value: fieldProps.value,
                              }
                            : selectVal;
                } else if (/language/i.test(fieldProps.name)) {
                    const selectVal = getValueFromSelectValues('language', fieldProps.value);
                    selectFieldProps.value =
                        typeof selectVal === 'string'
                            ? {
                                  label: selectVal,
                                  value: fieldProps.value,
                              }
                            : selectVal;
                }

                return (
                    <NexusSelect
                        onChange={setUpdatedValues(getCurrentValues())}
                        fieldProps={selectFieldProps}
                        type={type}
                        optionsConfig={optionsConfig}
                        selectValues={selectValues}
                        path={path}
                        isRequired={isRequired}
                        isMultiselect={false}
                        addedProps={addedProps}
                        defaultValue={fieldProps.value ? {value: fieldProps.value, label: fieldProps.value} : undefined}
                        optionsFilterParameter={checkDependencies('values')}
                        isCreateMode={view === VIEWS.CREATE}
                        showLocalized={newShowLocalized}
                        language={getLanguage()}
                    />
                );
            case 'multiselect':
                if (
                    fieldProps.value &&
                    fieldProps.value.length &&
                    fieldProps.value[fieldProps.value.length - 1].value === undefined
                ) {
                    multiselectFieldProps.value = fieldProps?.value?.map(val => ({label: val, value: val}));
                }

                if (newShowLocalized === true) {
                    multiselectFieldProps.value = fieldProps?.value?.map(val => {
                        const item = selectValues?.[path]?.find(g => g.id === val.value);
                        // show english genre version for localized
                        if (emetLanguage !== 'en' && !(val?.label.split(')')[1] === '*' || val?.label.includes('('))) {
                            return {label: `${val.label} (${item.name})`, value: val.value};
                        }
                        return {label: val.label, value: val.value};
                    });

                    selectLocalizedValues = Object.assign({}, selectValues);
                    const newValues = selectLocalizedValues[path]?.map(item => {
                        const localLang = item.localizations.find(local => {
                            const isEmetLanguageObject = isObject(emetLanguage) && path === 'genres';
                            const initialEmetLanguage = isEmetLanguageObject ? emetLanguage.value : emetLanguage;
                            // path === "genres" - so that there are no errors on other similar selections

                            return local?.language === initialEmetLanguage;
                        });

                        const enName = item?.name;
                        if (localLang) {
                            item.displayName = `${localLang?.name}(${enName})`;
                        } else if (emetLanguage) item.displayName = `(${enName})*`;
                        else item.displayName = enName;
                        return item;
                    });
                    selectLocalizedValues[path] = newValues;
                    // displayName is used in dropdown for display purpose only. to send to api, use "name"
                    newOptionsConfig = {...optionsConfig, defaultLabelPath: 'displayName'};
                }

                return (
                    <NexusSelect
                        onChange={setUpdatedValues(getCurrentValues())}
                        fieldProps={multiselectFieldProps}
                        type={type}
                        optionsConfig={
                            newShowLocalized === true && emetLanguage !== 'en' ? newOptionsConfig : optionsConfig
                        }
                        selectValues={
                            newShowLocalized === true && emetLanguage !== 'en' ? selectLocalizedValues : selectValues
                        }
                        path={path}
                        isRequired={isRequired}
                        isMultiselect={true}
                        addedProps={addedProps}
                        showLocalized={newShowLocalized}
                        language={getLanguage()}
                        defaultValue={
                            fieldProps.value
                                ? fieldProps?.value?.map(val => {
                                      return {label: val, value: val};
                                  })
                                : undefined
                        }
                        optionsFilterParameter={checkDependencies('values')}
                    />
                );
            case 'dateRange':
                return (
                    <DateTimeWithOptional
                        onChange={setUpdatedValues(getCurrentValues())}
                        {...fieldProps}
                        {...dateProps}
                    />
                );
            case 'datetime': {
                // withdrawn date is readOnly when populated (when empty, user can populate it using checkbox)
                const hasWithDrawnDate = fieldProps?.name.includes('dateWithdrawn');
                const isWithDrawnReadOnly = hasWithDrawnDate && fieldProps?.value ? true : dateProps?.isReadOnly;

                return fieldProps.value || !dateProps.isReadOnly ? (
                    <DateTimeWithOptional
                        onChange={setUpdatedValues(getCurrentValues())}
                        {...fieldProps}
                        {...dateProps}
                        isReadOnly={isWithDrawnReadOnly}
                        territoryLenght={hasWithDrawnDate && formData?.territory?.length}
                    />
                ) : (
                    ''
                );
            }
            case 'castCrew':
                return (
                    <CastCrew
                        onChange={setUpdatedValues(getCurrentValues())}
                        {...fieldProps}
                        persons={fieldProps.value ? fieldProps.value : []}
                        isEdit={true}
                        getValues={getValues}
                        setFieldValue={setFieldValue}
                        isVerticalLayout={isVerticalLayout}
                        isTitlePage={isTitlePage}
                        searchPerson={searchPerson}
                        castCrewConfig={castCrewConfig}
                        // isVerticalLayout is used in EMET section, hence used to distinguish b/w core and emet section
                        language={isVerticalLayout ? getLanguage() : 'en'}
                        {...fieldProps}
                    />
                );
            case 'licensors':
                return (
                    <Licensors
                        {...fieldProps}
                        selectValues={selectValues}
                        data={fieldProps.value ? fieldProps.value : []}
                        isEdit={true}
                    />
                );
            case 'msvIds':
                return (
                    <MsvIds
                        {...fieldProps}
                        selectValues={selectValues}
                        data={fieldProps.value ? fieldProps.value : []}
                        isEdit={true}
                        generateMsvIds={generateMsvIds}
                    />
                );
            default:
                return;
        }
    };

    const getValueFromSelectValues = (field, value) => {
        const values = selectValues?.[field] || [];
        const option = values.find(o => o[`${field}Code`] === value);
        return option?.[`${field}Name`] || value;
    };

    const hasLocalizedValue = value => {
        if (typeof value === 'string' && value.includes('(') && value.includes(')*')) return false;
        return true;
    };

    const getLabel = item => {
        if (typeof item === 'object' && localizationConfig) {
            if (newShowLocalized) {
                const obj = selectValues?.[path]?.find(g => g.id === item.value);
                const local = obj?.localizations?.find(g => g?.language === emetLanguage);
                if (local && emetLanguage !== 'en') {
                    return `${item.label} (${obj.name})`;
                }
            }
            return item?.label
                ? item.label
                : !emetLanguage || emetLanguage === 'en'
                ? item[localizationConfig.default]
                : item[localizationConfig.localized];
        }
        return typeof item === 'object' ? item.label : item;
    };

    const getValue = fieldProps => {
        if (Array.isArray(fieldProps.value)) {
            if (fieldProps.value.length) {
                const arrayValues = fieldProps?.value?.map(item => getLabel(item));
                if (newShowLocalized) {
                    return (
                        <div>
                            {arrayValues?.map((item, index) => {
                                if (!hasLocalizedValue(item)) {
                                    return (
                                        <span key={index} title={LOCALIZED_VALUE_NOT_DEFINED} className="italic">
                                            {item}
                                            {index !== arrayValues.length - 1 && ', '}
                                        </span>
                                    );
                                }
                                return (
                                    <span key={index}>
                                        {item}
                                        {index !== arrayValues.length - 1 && ', '}{' '}
                                    </span>
                                );
                            })}
                        </div>
                    );
                }
                return fieldProps?.value?.map(x => x && getFieldValue(x)).join(', ');
            }
            return <div className="nexus-c-field__placeholder">{`Enter ${label}...`}</div>;
        }
        if (/country/i.test(fieldProps.name) || /locale/i.test(fieldProps.name)) {
            // the section doesn't get refreshed (rights detail) when save, hence the below check
            const val = typeof fieldProps.value === 'object' ? fieldProps.value.value : fieldProps.value;
            return getValueFromSelectValues('country', val);
        }
        if (/language/i.test(fieldProps.name)) {
            const val = typeof fieldProps.value === 'object' ? fieldProps.value.value : fieldProps.value;
            return getValueFromSelectValues('language', val);
        }
        return getFieldValue(fieldProps.value);
    };

    const renderFieldViewMode = fieldProps => {
        if (validationError) {
            return <div>{validationError}</div>;
        }
        switch (type) {
            case 'boolean':
                return <Checkbox isDisabled isChecked={fieldProps.value} />;
            case 'dateRange':
            case 'datetime':
                if (fieldProps.value) {
                    return <DateTime {...dateProps} {...fieldProps} isReadOnly />;
                }
                return <div className="nexus-c-field__placeholder">{`Enter ${label}...`}</div>;
            case 'castCrew':
                return (
                    <CastCrew
                        persons={fieldProps.value ? fieldProps.value : []}
                        isEdit={false}
                        getValues={getValues}
                        setFieldValue={setFieldValue}
                        isVerticalLayout={isVerticalLayout}
                        isTitlePage={isTitlePage}
                        searchPerson={searchPerson}
                        castCrewConfig={castCrewConfig}
                        // isVerticalLayout is used in EMET section, hence used to distinguish b/w core and emet section
                        language={isVerticalLayout ? get(formData, 'editorial.language', 'en') : 'en'}
                    />
                );
            case 'licensors':
                return (
                    <Licensors
                        selectValues={selectValues}
                        data={fieldProps.value ? fieldProps.value : []}
                        isEdit={false}
                    />
                );
            case 'msvIds':
                return (
                    <MsvIds
                        selectValues={selectValues}
                        data={fieldProps.value ? fieldProps.value : []}
                        isEdit={false}
                    />
                );
            case 'link':
                return (
                    <>
                        <a href={createUrl(linkConfig, initialData)}>
                            {fieldProps.value ? (
                                getValue(fieldProps)
                            ) : (
                                <div className="nexus-c-field__placeholder">{`Enter ${label}...`}</div>
                            )}
                        </a>
                    </>
                );
            default:
                return fieldProps.value ? (
                    <div><span dir={hebrew.test(getValue(fieldProps)) ? 'rtl' : 'ltr'}>{getValue(fieldProps)}</span></div>
                ) : (
                    <div className="nexus-c-field__placeholder">{`Enter ${label}...`}</div>
                );
        }
    };

    const required = !!(checkDependencies('required') || isRequired);

    return (
        <ErrorBoundary>
            <div
                className={`nexus-c-field${validationError ? ' nexus-c-field--error' : ''}${
                    isHighlighted ? ' nexus-c-field--highlighted' : ''
                }`}
            >
                <AKField
                    isDisabled={getIsReadOnly() || checkDependencies('readOnly')}
                    isRequired={checkDependencies('required') || isRequired}
                    validate={value =>
                        getValidationFunction(value, validation, {type, isRequired: required, getCurrentValues})
                    }
                    {...props}
                >
                    {({fieldProps, error}) => (
                        <>
                            {!FIELDS_WITHOUT_LABEL.includes(type) &&
                                renderLabel(
                                    label,
                                    !!(checkDependencies('required') || isRequired),
                                    tooltip,
                                    isGridLayout,
                                    isRequiredVZ,
                                    oneIsRequiredVZ
                                )}
                            <div className="nexus-c-field__value-section">
                                <div className="nexus-c-field__value">
                                    {!getIsReadOnly() && (view === VIEWS.EDIT || view === VIEWS.CREATE)
                                        ? renderFieldEditMode(fieldProps)
                                        : renderFieldViewMode(fieldProps)}
                                </div>
                                {error && renderError({...fieldProps}, error)}
                            </div>
                        </>
                    )}
                </AKField>
            </div>
        </ErrorBoundary>
    );
};

NexusField.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    view: PropTypes.string,
    tooltip: PropTypes.string,
    formData: PropTypes.object,
    dependencies: PropTypes.array,
    isReadOnly: PropTypes.bool,
    isReadOnlyInEdit: PropTypes.bool,
    isRequired: PropTypes.bool,
    isClearable: PropTypes.bool,
    validationError: PropTypes.string,
    validation: PropTypes.array,
    optionsConfig: PropTypes.object,
    selectValues: PropTypes.object,
    path: PropTypes.any,
    dateType: PropTypes.string,
    labels: PropTypes.array,
    label: PropTypes.string,
    isOptional: PropTypes.bool,
    setFieldValue: PropTypes.func,
    // eslint-disable-next-line react/boolean-prop-naming
    useCurrentDate: PropTypes.bool,
    isHighlighted: PropTypes.bool,
    isTitlePage: PropTypes.bool,
    getCurrentValues: PropTypes.func.isRequired,
    isReturningTime: PropTypes.bool,
    config: PropTypes.array,
    isEditable: PropTypes.bool,
    isGridLayout: PropTypes.bool,
    isVerticalLayout: PropTypes.bool,
    searchPerson: PropTypes.func,
    generateMsvIds: PropTypes.func,
    setDisableSubmit: PropTypes.func,
    initialData: PropTypes.object,
    linkConfig: PropTypes.object,
    maxLength: PropTypes.number,
    castCrewConfig: PropTypes.object,
    isRequiredVZ: PropTypes.bool,
    oneIsRequiredVZ: PropTypes.bool,
    showLocalized: PropTypes.bool,
    localizationConfig: PropTypes.object,
    getValues: PropTypes.func,
    setUpdatedValues: PropTypes.func,
};

NexusField.defaultProps = {
    isEditable: false,
    view: VIEWS.VIEW,
    tooltip: null,
    formData: {},
    dependencies: [],
    isReadOnly: false,
    isClearable: false,
    isReadOnlyInEdit: false,
    isRequired: false,
    validationError: null,
    validation: [],
    optionsConfig: {},
    selectValues: {},
    path: null,
    dateType: '',
    labels: [],
    label: '',
    isOptional: false,
    setFieldValue: null,
    useCurrentDate: false,
    isHighlighted: false,
    isReturningTime: true,
    isTitlePage: false,
    config: [],
    isGridLayout: false,
    isVerticalLayout: false,
    searchPerson: undefined,
    generateMsvIds: undefined,
    setDisableSubmit: undefined,
    initialData: {},
    linkConfig: {},
    castCrewConfig: {},
    maxLength: undefined,
    isRequiredVZ: false,
    oneIsRequiredVZ: false,
    showLocalized: false,
    localizationConfig: undefined,
    getValues: () => null,
    setUpdatedValues: () => {},
};

export default NexusField;
