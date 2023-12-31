import React from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from '@atlaskit/checkbox';
import {CheckboxField, Field as AKField} from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import {InputNumber} from '@portal/portal-components';
import {isObject} from '@vubiquity-nexus/portal-utils/lib/Common';
import {get, toLower, toString} from 'lodash';
import {Link} from 'react-router-dom';
import {compose} from 'redux';
import ErrorBoundary from '../../../nexus-error-boundary/ErrorBoundary';
import NexusSelect from '../../../nexus-select/NexusSelect';
import NexusTextArea from '../../../nexus-textarea/NexusTextArea';
import {
    FIELD_REQUIRED,
    FIELDS_WITHOUT_LABEL,
    LOCALIZED_VALUE_NOT_DEFINED,
    RIGHT_STATUS_CANCELED,
    VIEWS,
} from '../../constants';
import withOptionalCheckbox from '../../hoc/withOptionalCheckbox';
import {
    checkFieldDependencies,
    createUrl,
    getDir,
    getFieldValue,
    getValidationFunction,
    hebrew,
    renderError,
    renderLabel,
} from '../../utils';
import CastCrew from './components/CastCrew/CastCrew';
import DateTime from './components/DateTime/DateTime';
import MsvIds from './components/MsvIds/MsvIds';
import './NexusField.scss';
import RowDataItem from './components/RowDataItem/RowDataItem';

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
    setUpdate,
    allData,
    forMetadata,
    shouldUpperCase,
    pathName,
    sectionID,
    shouldStackLabel,
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
        pathName,
    };

    const emetLanguage = get(formData, 'editorial.language');
    const sasktelArray = formData.editorial?.tenantData?.simpleProperties || [];
    const shortTitleTemplate =
        formData.editorial?.tenantData?.complexProperties?.find(e => e.simpleProperties)?.simpleProperties || [];
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

    const onChange = data => setUpdatedValues(data);

    const persons = fieldProps => {
        return fieldProps.value ? fieldProps.value : allData?.castCrew?.length ? [...allData?.castCrew] : [];
    };

    const generateElementIds = (fieldProps, addedProps) => {
        if (fieldProps) {
            const elementView = toLower(addedProps.view);
            const constructionArray = [sectionID, elementView, fieldProps.id];
            return constructionArray.join('.');
        }
        return '';
    };

    /**
     * looks for pathName flag in schema.json and if its present, will find the value from an array.
     * @param fieldProps props from schema.json
     * @param addedProps extra props added statically from the schema.json; the flags
     * @returns {string} return value of type string
     */
    const findValue = (fieldProps, addedProps) => {
        if (
            addedProps?.path === 'tenantData.simpleProperties' &&
            typeof fieldProps?.value === 'object' &&
            fieldProps?.value !== null
        ) {
            const newFieldValue = fieldProps?.value.find(x => x.name === addedProps.pathName);
            return newFieldValue?.value;
        }

        if (addedProps.path === 'tenantData.complexProperties') {
            if (Array.isArray(fieldProps?.value)) {
                return fieldProps?.value
                    .find(e => e.simpleProperties)
                    ?.simpleProperties.find(e => e.name === 'shortTitleTemplate')?.value;
            } else if (typeof fieldProps?.value === 'string') {
                shortTitleTemplate?.map(e =>
                    e.name === 'shortTitleTemplate' ? (e.value = fieldProps.value) : e.value
                );
            }
        }

        if (addedProps?.pathName && typeof fieldProps?.value === 'string') {
            sasktelArray.forEach(e => {
                if (e.name === addedProps.pathName) {
                    e.value = fieldProps.value;
                    formData.editorial.tenantData.simpleProperties = sasktelArray;
                }
            });
        }
        return fieldProps?.value;
    };

    const renderFieldEditMode = fieldProps => {
        const selectFieldProps = {...fieldProps};
        const multiselectFieldProps = {...fieldProps};
        let selectLocalizedValues = null;
        let newOptionsConfig = null;

        switch (type) {
            case 'string':
            case 'stringInArray':
            case 'link':
                return (
                    <TextFieldWithOptional
                        {...fieldProps}
                        {...addedProps}
                        id={generateElementIds(fieldProps, addedProps)}
                        placeholder={`Enter ${label}`}
                        dir={getDir(fieldProps.value)}
                        value={findValue(fieldProps, addedProps)}
                    />
                );
            case 'textarea':
                return (
                    <NexusTextAreaWithOptional
                        {...fieldProps}
                        {...addedProps}
                        id={generateElementIds(fieldProps, addedProps)}
                        placeholder={`Enter ${label}`}
                        dir={getDir(fieldProps.value)}
                    />
                );
            case 'number':
                return (
                    <InputNumber
                        {...props}
                        {...fieldProps}
                        id={generateElementIds(fieldProps, addedProps)}
                        columnClass="col-12"
                        showButtons={true}
                        value={fieldProps?.value?.value || fieldProps?.value}
                        onChange={e => {
                            fieldProps.onChange(e?.value);
                        }}
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
                                id={generateElementIds(fieldProps, addedProps)}
                                onChange={onChange(getCurrentValues())}
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
                if (/locale/i.test(fieldProps.name) || /countryOfOrigin/i.test(fieldProps.name)) {
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
                        onChange={onChange(getCurrentValues())}
                        fieldProps={selectFieldProps}
                        id={generateElementIds(fieldProps, addedProps)}
                        type={type}
                        optionsConfig={optionsConfig}
                        selectValues={selectValues}
                        path={path}
                        isRequired={isRequired}
                        isMultiselect={false}
                        addedProps={{...addedProps, inModal: props.inModal}}
                        defaultValue={fieldProps.value ? {value: fieldProps.value, label: fieldProps.value} : undefined}
                        optionsFilterParameter={checkDependencies('values')}
                        isCreateMode={view === VIEWS.CREATE}
                        showLocalized={newShowLocalized}
                        language={getLanguage()}
                    />
                );
            case 'multiselect':
                if (fieldProps?.value?.length && fieldProps?.value[fieldProps.value.length - 1]?.value === undefined) {
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
                    selectLocalizedValues[path] = selectLocalizedValues[path]?.map(item => {
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
                    // displayName is used in dropdown for display purpose only. to send to api, use "name"
                    newOptionsConfig = {...optionsConfig, defaultLabelPath: 'displayName'};
                }

                return (
                    <NexusSelect
                        id={generateElementIds(fieldProps, addedProps)}
                        onChange={onChange(getCurrentValues())}
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
                        onChange={onChange(getCurrentValues())}
                        {...fieldProps}
                        {...dateProps}
                        id={generateElementIds(fieldProps, addedProps)}
                    />
                );
            case 'datetime': {
                // withdrawn date is readOnly when populated (when empty, user can populate it using checkbox)
                const hasWithDrawnDate = fieldProps?.name.includes('dateWithdrawn');
                const isWithDrawnReadOnly = hasWithDrawnDate && fieldProps?.value ? true : dateProps?.isReadOnly;

                return fieldProps.value || !dateProps.isReadOnly ? (
                    <DateTimeWithOptional
                        onChange={onChange(getCurrentValues())}
                        {...fieldProps}
                        {...dateProps}
                        elementId={generateElementIds(fieldProps, addedProps)}
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
                        sectionId={generateElementIds(fieldProps, addedProps)}
                        isEditable={isEditable}
                        onChange={onChange(getCurrentValues())}
                        {...fieldProps}
                        persons={persons(fieldProps)}
                        isEdit={true}
                        getValues={getValues}
                        setFieldValue={setFieldValue}
                        isVerticalLayout={isVerticalLayout}
                        isTitlePage={isTitlePage}
                        searchPerson={searchPerson}
                        castCrewConfig={castCrewConfig}
                        // isVerticalLayout is used in EMET section, hence used to distinguish b/w core and emet section
                        language={isVerticalLayout ? getLanguage() : 'en'}
                        setUpdate={setUpdate}
                        allData={allData}
                        forMetadata={forMetadata}
                        path={path}
                        {...fieldProps}
                    />
                );
            case 'rowDataItem':
                return (
                    <RowDataItem
                        {...props}
                        {...fieldProps}
                        id={generateElementIds(fieldProps, addedProps)}
                        selectValues={selectValues}
                        data={fieldProps.value || []}
                    />
                );
            case 'msvIds':
                return (
                    <MsvIds
                        {...fieldProps}
                        id={generateElementIds(fieldProps, addedProps)}
                        selectValues={selectValues}
                        data={fieldProps.value ? fieldProps.value : []}
                        isEdit={true}
                        generateMsvIds={generateMsvIds}
                    />
                );
            case 'tenantData': {
                return (
                    <TextFieldWithOptional
                        {...fieldProps}
                        {...addedProps}
                        id={generateElementIds(fieldProps, addedProps)}
                        placeholder={`Enter ${label}`}
                        value={get(props, 'value')}
                    />
                );
            }
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
        return !(typeof value === 'string' && value.includes('(') && value.includes(')*'));
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
                return (
                    <Checkbox isDisabled isChecked={fieldProps.value} id={generateElementIds(fieldProps, addedProps)} />
                );
            case 'dateRange':
            case 'datetime':
                if (fieldProps.value) {
                    return (
                        <DateTime
                            {...dateProps}
                            {...fieldProps}
                            elementId={generateElementIds(fieldProps, addedProps)}
                            isReadOnly
                        />
                    );
                }
                return (
                    <div className="nexus-c-field__placeholder" id={generateElementIds(fieldProps, addedProps)}>
                        {`Enter ${label}...`}
                    </div>
                );
            case 'castCrew':
                return (
                    <CastCrew
                        persons={persons(fieldProps)}
                        isEdit={false}
                        getValues={getValues}
                        setFieldValue={setFieldValue}
                        isVerticalLayout={isVerticalLayout}
                        forMetadata={forMetadata}
                        isTitlePage={isTitlePage}
                        searchPerson={searchPerson}
                        castCrewConfig={castCrewConfig}
                        path={path}
                        // isVerticalLayout is used in EMET section, hence used to distinguish b/w core and emet section
                        language={isVerticalLayout ? get(formData, 'editorial.language', 'en') : 'en'}
                        sectionId={generateElementIds(fieldProps, addedProps)}
                    />
                );
            case 'rowDataItem':
                return (
                    <RowDataItem
                        {...props}
                        {...fieldProps}
                        selectValues={selectValues}
                        data={fieldProps.value || []}
                        canDelete={false}
                        canAdd={false}
                        id={generateElementIds(fieldProps, addedProps)}
                    />
                );
            case 'msvIds':
                return (
                    <MsvIds
                        selectValues={selectValues}
                        data={fieldProps.value ? fieldProps.value : []}
                        isEdit={false}
                        id={generateElementIds(fieldProps, addedProps)}
                    />
                );
            case 'link': {
                const url = createUrl(linkConfig, initialData);
                const body = fieldProps.value ? (
                    <div>
                        <span id={generateElementIds(fieldProps, addedProps)}>{getValue(fieldProps)}</span>
                    </div>
                ) : (
                    <div id={generateElementIds(fieldProps, addedProps)} className="nexus-c-field__placeholder">
                        {`Enter ${label}...`}
                    </div>
                );

                return url.includes('http') ? <a href={url}>{body}</a> : <Link to={`./../${url}`}>{body}</Link>;
            }
            case 'tenantData': {
                return get(props, 'value') ? (
                    <div>{get(props, 'value')}</div>
                ) : (
                    <div className="nexus-c-field__placeholder" id={generateElementIds(fieldProps, addedProps)}>
                        {`Enter ${label}...`}
                    </div>
                );
            }
            default:
                return fieldProps.value ? (
                    <div>
                        <span
                            dir={hebrew.test(getValue(fieldProps)) ? 'rtl' : 'ltr'}
                            id={generateElementIds(fieldProps, addedProps)}
                        >
                            {getValue(fieldProps)}
                        </span>
                    </div>
                ) : (
                    <div className="nexus-c-field__placeholder" id={generateElementIds(fieldProps, addedProps)}>
                        {`Enter ${label}...`}
                    </div>
                );
        }
    };

    const validationName = type => {
        return validation[0]?.name === type;
    };

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
                        getValidationFunction(value, validation, {
                            type,
                            isRequired: checkDependencies('required') || isRequired,
                            getCurrentValues,
                        })
                    }
                    {...props}
                >
                    {({fieldProps, error}) => {
                        return (
                            <div className={props.stackLabel ? 'stack-label w-100' : 'display-contents'}>
                                <div className="row w-100 align-items-center">
                                    {!FIELDS_WITHOUT_LABEL.includes(type) && (
                                        <div
                                            className={`${
                                                shouldStackLabel ? 'col-12' : isGridLayout ? 'col-4' : 'col-2'
                                            }`}
                                        >
                                            {renderLabel(
                                                label,
                                                checkDependencies('required') || isRequired,
                                                tooltip,
                                                isGridLayout,
                                                isRequiredVZ,
                                                oneIsRequiredVZ
                                            )}
                                        </div>
                                    )}
                                    <div
                                        className={
                                            FIELDS_WITHOUT_LABEL.includes(type)
                                                ? 'col-12'
                                                : `${shouldStackLabel ? 'col-12' : isGridLayout ? 'col-8' : 'col-10'}`
                                        }
                                    >
                                        <div className="nexus-c-field__value-section">
                                            <div
                                                className={`nexus-c-field__value ${
                                                    shouldUpperCase ? 'text-uppercase' : ''
                                                }`}
                                            >
                                                {!getIsReadOnly() && (view === VIEWS.EDIT || view === VIEWS.CREATE)
                                                    ? renderFieldEditMode(fieldProps)
                                                    : renderFieldViewMode(fieldProps)}
                                            </div>
                                            {error && validationName('areAllWithdrawn')
                                                ? renderError(RIGHT_STATUS_CANCELED)
                                                : error && isRequired
                                                ? renderError(FIELD_REQUIRED)
                                                : error && renderError(toString(error))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }}
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
    getCurrentValues: PropTypes.func,
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
    setUpdate: PropTypes.func,
    allData: PropTypes.object,
    forMetadata: PropTypes.bool,
    shouldUpperCase: PropTypes.bool,
    stackLabel: PropTypes.bool,
    inModal: PropTypes.bool,
    sectionID: PropTypes.string,
    shouldStackLabel: PropTypes.bool,
    pathName: PropTypes.string,
};

NexusField.defaultProps = {
    isEditable: true,
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
    getCurrentValues: () => null,
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
    setUpdatedValues: () => null,
    setUpdate: () => null,
    allData: {},
    forMetadata: false,
    shouldUpperCase: false,
    stackLabel: false,
    inModal: false,
    sectionID: '',
    shouldStackLabel: false,
    pathName: '',
};

export default NexusField;
