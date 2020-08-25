import InlineEdit from '@atlaskit/inline-edit';
import TextField from '@atlaskit/textfield';
import SectionMessage from '@atlaskit/section-message';
import {AvField, AvForm} from 'availity-reactstrap-validation';
import {cloneDeep, get} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import BlockUi from 'react-block-ui';
import ReactDOM from 'react-dom'; // we should remove this, replace use of findDomNode with ref
import config from 'react-global-configuration';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes'; // replace by new NexusSelectCheckbox
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import Select from 'react-select';
import Editable from 'react-x-editable'; // there is an atlaskit component for editable
import {Label} from 'reactstrap';
import {cannot} from '../../../../../ability';
import {store} from '../../../../../index';
import NexusDatePicker from '../../../../../ui/elements/nexus-date-and-time-elements/nexus-date-picker/NexusDatePicker';
import NexusDateTimePicker from '../../../../../ui/elements/nexus-date-and-time-elements/nexus-date-time-picker/NexusDateTimePicker';
import BackNavigationByUrl from '../../../../../ui/elements/nexus-navigation/navigate-back-by-url/BackNavigationByUrl';
import {equalOrIncluded, getDeepValue, safeTrim, URL} from '../../../../../util/Common';
import {DATETIME_FIELDS} from '../../../../../util/date-time/constants';
import {oneOfValidation, rangeValidation} from '../../../../../util/Validation';
import {AVAILS_PATH} from '../../../../avails/availsRoutes';
import EditableBaseComponent from '../../../components/form/editable/EditableBaseComponent';
import RightAudioLanguageForm from '../../../components/form/RightAudioLanguageForm';
import RightPriceForm from '../../../components/form/RightPriceForm';
import RightTerritoryForm from '../../../components/form/RightTerritoryForm';
import {confirmModal} from '../../../components/modal/ConfirmModal';
import {blockUI} from '../../../stores/actions/index';
import RightsClashingModal from '../clashing-modal/RightsClashingModal';
import AudioLanguageField from '../components/AudioLanguageField';
import PriceField from '../components/PriceField';
import TerritoryField from '../components/TerritoryField';
import ManualRightsEntryDOPConnector from '../create/ManualRightsEntry/components/ManualRightsEntryDOPConnector';
import {AddButton} from '../custom-form-components/CustomFormComponents';
import {profileService} from '../service/ProfileService';
import {rightsService} from '../service/RightsService';
import {NoteError, NoteMerged, NotePending, PLATFORM_INFORM_MSG, CUSTOM_ERROR_HANDLING_FIELDS} from './RightConstants';
import {getConfigApiValues} from '../../../common/CommonConfigService';
import withToasts from '../../../../../ui/toast/hoc/withToasts';
import {handleMatchingRightsAction} from '../availActions';
import './RightDetails.scss';

const mapStateToProps = state => {
    return {
        availsMapping: state.root.availsMapping,
        selectValues: state.root.selectValues,
        blocking: state.root.blocking,
    };
};

const mapDispatchToProps = dispatch => ({
    handleMatchingRights: payload => dispatch(handleMatchingRightsAction(payload)),
});

class RightDetails extends React.Component {
    refresh = null;

    constructor(props) {
        super(props);

        this.getRightData = this.getRightData.bind(this);

        this.emptyValueText = 'Enter';
        this.fields = {};

        this.state = {
            errorMessage: '',
            isRightTerritoryFormOpen: false,
            isRightAudioLanguageFormOpen: false,
            isRightPriceFormOpen: false,
            territoryIndex: null,
            audioLanguageIndex: null,
            priceIndex: null,
            isEdit: false,
            editedRight: {},
            configLicensees: [],
        };
    }

    componentDidMount() {
        profileService.initAvailsMapping();
        this.getRightData();
        if (this.refresh === null) {
            this.refresh = setInterval(this.getRightData, config.get('avails.edit.refresh.interval'));
        }
        getConfigApiValues('licensees', 0, 100).then(({data}) => this.setState({configLicensees: data}));
    }

    componentWillUnmount() {
        if (this.refresh !== null) {
            clearInterval(this.refresh);
            this.refresh = null;
        }
    }

    navigateToPreviousPreview = () => {
        const prevPage = window.location.href;
        history.back();

        setTimeout(function () {
            if (window.location.href === prevPage) {
                window.location.href = URL.keepEmbedded(AVAILS_PATH);
            }
        }, 500);
    };

    getRightData() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            rightsService
                .get(this.props.match.params.id)
                .then(res => {
                    if (res) {
                        const regForEror = /\[(.*?)\]/i;
                        const regForSubField = /.([A-Za-z]+)$/;
                        const {
                            validationErrors = [],
                            territory = [],
                            affiliate = [],
                            affiliateExclude = [],
                            castCrew = [],
                            languageAudioTypes = [],
                            pricing = [],
                        } = res || {};
                        // temporary solution for price - all should be refactor
                        const priceErrors =
                            (Array.isArray(validationErrors) &&
                                validationErrors
                                    .filter(el => el.fieldName && el.fieldName.includes('pricing'))
                                    .map(error => {
                                        const matchObj = error.fieldName.match(regForEror);
                                        if (matchObj) {
                                            const matchSubField = error.fieldName.match(regForSubField);
                                            error.index = Number(matchObj[1]);
                                            error.subField = matchSubField[1];
                                        }
                                        return error;
                                    })) ||
                            [];

                        const prices =
                            (Array.isArray(pricing) &&
                                pricing.filter(Boolean).map((el, index) => {
                                    const error = priceErrors.find(error => error.index === index);
                                    if (error) {
                                        el.value = `${error.message} ${
                                            error.sourceDetails && error.sourceDetails.originalValue
                                        }`;
                                        el.isValid = false;
                                        el.errors = priceErrors.filter(error => error.index === index);
                                    } else {
                                        el.isValid = true;
                                        el.value = el.priceType;
                                    }
                                    el.id = index;
                                    return el;
                                })) ||
                            [];
                        // temporary solution for territory - all should be refactor
                        const territoryErrors =
                            (Array.isArray(validationErrors) &&
                                validationErrors
                                    .filter(
                                        el =>
                                            el.fieldName &&
                                            el.fieldName.includes('territory') &&
                                            !el.fieldName.includes('territoryExcluded')
                                    )
                                    .map(error => {
                                        const matchObj = error.fieldName.match(regForEror);
                                        if (matchObj) {
                                            const matchSubField = error.fieldName.match(regForSubField);
                                            error.index = Number(matchObj[1]);
                                            error.subField = matchSubField[1];
                                        }
                                        return error;
                                    })) ||
                            [];

                        const territories =
                            (Array.isArray(territory) &&
                                territory.filter(Boolean).map((el, index) => {
                                    const error = territoryErrors.find(error => error.index === index);
                                    if (error) {
                                        el.value = `${error.message} ${
                                            error.sourceDetails && error.sourceDetails.originalValue
                                        }`;
                                        el.isValid = false;
                                        el.errors = territoryErrors.filter(error => error.index === index);
                                    } else {
                                        el.isValid = true;
                                        el.value = el.country;
                                    }
                                    el.id = index;
                                    return el;
                                })) ||
                            [];
                        // temporary solution for audioLanguage - all should be refactor
                        const audioLanguageErrors =
                            (Array.isArray(validationErrors) &&
                                validationErrors
                                    .filter(el => el.fieldName && el.fieldName.includes('languageAudioTypes'))
                                    .map(error => {
                                        const matchObj = error.fieldName.match(regForEror);
                                        if (matchObj) {
                                            const matchSubField = error.fieldName.match(regForSubField);
                                            error.index = Number(matchObj[1]);
                                            error.subField = matchSubField[1];
                                        }
                                        return error;
                                    })) ||
                            [];

                        const audioLanguages =
                            (Array.isArray(languageAudioTypes) &&
                                languageAudioTypes.filter(Boolean).map((el, index) => {
                                    const error = audioLanguageErrors.find(error => error.index === index);
                                    if (error) {
                                        el.value = `${error.message} ${
                                            error.sourceDetails && error.sourceDetails.originalValue
                                        }`;
                                        el.isValid = false;
                                        el.errors = audioLanguageErrors.filter(error => error.index === index);
                                    } else {
                                        el.isValid = true;
                                        el.value = el.language;
                                    }
                                    el.id = index;
                                    return el;
                                })) ||
                            [];

                        // temporary solution for affiliate and affilateExclude
                        const affiliateErrors =
                            (Array.isArray(validationErrors) &&
                                validationErrors
                                    .filter(
                                        el =>
                                            el.fieldName &&
                                            el.fieldName.includes('affiliate') &&
                                            !el.fieldName.includes('affiliateExclude')
                                    )
                                    .map(error => {
                                        const matchObj = error.fieldName.match(regForEror);
                                        if (matchObj) {
                                            error.index = Number(matchObj[1]);
                                        }
                                        return error;
                                    })) ||
                            [];

                        const affiliateList =
                            (Array.isArray(affiliate) &&
                                affiliate.filter(Boolean).map((el, i) => {
                                    return {
                                        isValid: true,
                                        value: el,
                                        id: i,
                                    };
                                })) ||
                            [];

                        const affiliates = [
                            ...affiliateList,
                            ...affiliateErrors.map((el, index) => {
                                const obj = {};
                                obj.value = `${el.message} ${el.sourceDetails && el.sourceDetails.originalValue}`;
                                obj.isValid = false;
                                obj.errors = affiliateErrors[index];
                                obj.id = el.index;
                                return obj;
                            }),
                        ];

                        const affiliateExcludeErrors =
                            (Array.isArray(validationErrors) &&
                                validationErrors
                                    .filter(el => el.fieldName && el.fieldName.includes('affiliateExclude'))
                                    .map(error => {
                                        const matchObj = error.fieldName.match(regForEror);
                                        if (matchObj) {
                                            error.index = Number(matchObj[1]);
                                        }
                                        return error;
                                    })) ||
                            [];

                        const affiliateiExcludeList =
                            (Array.isArray(affiliateExclude) &&
                                affiliateExclude.filter(Boolean).map((el, i) => {
                                    return {
                                        isValid: true,
                                        value: el,
                                        id: i,
                                    };
                                })) ||
                            [];

                        const affiliatesExclude = [
                            ...affiliateiExcludeList,
                            ...affiliateExcludeErrors.map((error, index) => {
                                const obj = {};
                                obj.value = `${error.message} ${
                                    error.sourceDetails && error.sourceDetails.originalValue
                                }`;
                                obj.isValid = false;
                                obj.errors = affiliateExcludeErrors[index];
                                obj.id = error.index;
                                return obj;
                            }),
                        ];

                        this.setState({
                            right: res,
                            flatRight: this.flattenRight(res),
                            pricing: prices,
                            territory: territories,
                            audioLanguage: audioLanguages,
                            affiliates,
                            affiliatesExclude,
                        });
                    }
                })
                .catch(() => {
                    this.setState({
                        errorMessage: 'Sorry, we could not find a right with id ' + this.props.match.params.id + ' !',
                    });
                });
        }
    }

    handleEditableSubmit(name, value, cancel) {
        if (value === '') {
            value = null;
        }
        if (Array.isArray(value)) {
            value = value.map(el => {
                if (el.hasOwnProperty('name')) {
                    delete el.name;
                }
                if (el.hasOwnProperty('isValid')) {
                    delete el.isValid;
                }
                if (el.hasOwnProperty('errors')) {
                    delete el.errors;
                }
                if (el.hasOwnProperty('value')) {
                    delete el.value;
                }
                if (el.hasOwnProperty('id')) {
                    delete el.id;
                }
                return el;
            });
        }

        this.update(name, value, cancel);
        return true;
    }

    flattenRight(right) {
        const rightCopy = {};
        this.props.availsMapping.mappings.forEach(map => {
            const val = getDeepValue(right, map.javaVariableName);
            if (val || val === false || val === null) {
                if (Array.isArray(val) && map.dataType === 'string' && map.javaVariableName !== 'keywords') {
                    rightCopy[map.javaVariableName] = val.join(',');
                } else {
                    rightCopy[map.javaVariableName] = val;
                }
            }
        });
        return rightCopy;
    }

    update(name, value, onError = () => {}) {
        if (this.state.flatRight[name] === value) {
            onError();
            return;
        }

        const {flatRight} = this.state;
        const {
            availHistoryId,
            availHistoryIds,
            ingestHistoryAttachmentId,
            ingestHistoryAttachmentIds,
        } = this.state.right;
        const updatedRight = {
            ...flatRight,
            availHistoryId,
            availHistoryIds,
            ingestHistoryAttachmentId,
            ingestHistoryAttachmentIds,
            [name]: value,
            ...(name === 'updatedCatalogReceivedAt' && value === null && {updatedCatalogReceived: false}),
        };

        store.dispatch(blockUI(true));
        rightsService
            .updateRightWithFullData(updatedRight, flatRight.id)
            .then((editedRight = {}) => {
                this.setState({
                    right: editedRight,
                    flatRight: this.flattenRight(editedRight),
                    errorMessage: '',
                });
                store.dispatch(blockUI(false));

                // Clear the state for editedRight, since the change was already applied
                this.setState(prevState => {
                    const {editedRight = {}} = prevState;
                    delete editedRight[name];
                    return {editedRight};
                });
            })
            .catch(error => {
                this.setState({
                    errorMessage: 'Editing right failed',
                });
                onError();
                this.props.handleMatchingRights({
                    error,
                    right: updatedRight,
                    isEdit: true,
                    push: this.context.router.history.push,
                });
            });
    }

    /**
     * Runs empty string validation on the given value
     * @param {string} data - the string to check if empty
     */
    validateNotEmpty(data) {
        return data.trim() ? '' : <small>Field cannot be empty</small>;
    }

    /**
     * Runs string validation in text fields
     * @param {string} name - the name of the field
     * @param {string} value - the value currently in the text field
     */
    validateTextField(name, value) {
        const newValue = !!value ? safeTrim(value) : '';
        const mapping = this.props.availsMapping.mappings.find(mapping => mapping.javaVariableName === name);
        if (!!mapping) {
            const isOriginRightIdRequired =
                name === 'originalRightId' &&
                this.state.right.temporaryPriceReduction === true &&
                this.state.right.status === 'Ready';

            if (mapping.required || isOriginRightIdRequired) {
                return this.validateNotEmpty(newValue);
            }
        }

        return '';
    }

    getPairFieldName(name) {
        switch (name) {
            case 'start':
                return 'availStart';
            case 'availStart':
                return 'start';
            default:
                return '';
        }
    }

    extraValidation(name, displayName, date, right) {
        const pairFieldName = this.getPairFieldName(name);
        if (pairFieldName) {
            const mappingPair = this.props.availsMapping.mappings.find(
                ({javaVariableName}) => javaVariableName === pairFieldName
            );
            return oneOfValidation(name, displayName, date, pairFieldName, mappingPair.displayName, right);
        }
    }

    onFieldClicked(e) {
        const node = ReactDOM.findDOMNode(e.currentTarget);
        if (e.target.tagName === 'A' || e.target.tagName === 'SPAN') {
            node.classList.add('no-border');
        }
        if (e.target.tagName === 'I' || e.target.tagName === 'BUTTON') {
            node.classList.remove('no-border');
        }
    }

    onEditableClick(ref) {
        if (ref && ref.current) {
            const component = ref.current;
            if (component instanceof Editable || component instanceof EditableBaseComponent) {
                if (component.state && !component.state.editable) {
                    confirmModal.open(
                        'Confirm edit',
                        () => {},
                        () => {
                            component.setEditable(false);
                        },
                        {description: 'Are you sure you want to edit this field?'}
                    );
                }
            }
        }
    }

    toggleRightPriceForm = index => {
        this.setState(state => ({
            isEdit: true,
            priceIndex: index,
            isRightPriceFormOpen: !state.isRightPriceFormOpen,
        }));
    };

    toggleRightTerritoryForm = index => {
        this.setState(state => ({
            isEdit: true,
            territoryIndex: index,
            isRightTerritoryFormOpen: !state.isRightTerritoryFormOpen,
        }));
    };

    toggleRightAudioLanguageForm = index => {
        this.setState(state => ({
            isEdit: true,
            audioLanguageIndex: index,
            isRightAudioLanguageFormOpen: !state.isRightAudioLanguageFormOpen,
        }));
    };

    toggleAddRightPriceForm = () => {
        this.setState(state => ({
            isRightPriceFormOpen: !state.isRightPriceFormOpen,
            isEdit: false,
        }));
    };

    toggleAddRightTerritoryForm = () => {
        this.setState(state => ({
            isRightTerritoryFormOpen: !state.isRightTerritoryFormOpen,
            isEdit: false,
        }));
    };

    toggleAddRightAudioLanguageForm = () => {
        this.setState(state => ({
            isRightAudioLanguageFormOpen: !state.isRightAudioLanguageFormOpen,
            isEdit: false,
        }));
    };

    checkFieldValue = (mapping, field, fieldValue = null) => {
        if (field.includes('.')) {
            const baseField = field.substring(0, field.indexOf('.'));
            const subField = field.substring(field.indexOf('.') + 1);
            return this.state.right[baseField].some(x =>
                fieldValue !== null ? x[subField] === fieldValue : !!x[subField]
            );
        } else {
            return fieldValue !== null ? this.state.right[field] === fieldValue : !!this.state.right[field];
        }
    };

    getStatusNote = () => {
        if (this.state.right) {
            let note = {};
            let status = this.state.right.status;
            if (status === 'Error') {
                note = NoteError;
            } else if (status === 'Merged') {
                note = NoteMerged;
            } else if (status === 'Pending') {
                note = NotePending;
            }

            return status === 'Error' || status === 'Merged' || status === 'Pending' ? (
                <SectionMessage appearance={note.noteStyle}>
                    {status === 'Pending' ? (
                        <Link
                            to={URL.keepEmbedded(
                                `/avails/history/${this.state.right.availHistoryId}/right-matching/${this.state.right.id}`
                            )}
                        >
                            {note.note}
                        </Link>
                    ) : (
                        <p>{note.note}</p>
                    )}
                </SectionMessage>
            ) : null;
        }
    };

    render() {
        const {sourceRightId} = this.state.right || {};
        const renderFieldTemplate = (
            name,
            displayName,
            value,
            error,
            readOnly,
            required,
            highlighted,
            tooltip,
            ref,
            content
        ) => {
            const hasValidationError =
                !CUSTOM_ERROR_HANDLING_FIELDS.includes(name) && (Array.isArray(error) ? error.length > 0 : error);
            return (
                <div
                    key={name}
                    className={(readOnly ? ' disabled' : '') + (highlighted ? ' font-weight-bold' : '')}
                    style={{
                        backgroundColor: hasValidationError ? '#f2dede' : '',
                        color: hasValidationError ? '#a94442' : null,
                        position: 'relative',
                        display: 'block',
                        padding: '0.75rem 1.25rem',
                        marginBottom: '5px',
                    }}
                >
                    <div className="row">
                        <div className="col-4">
                            {displayName}
                            {required ? <span className="text-danger">*</span> : ''}:
                            {highlighted ? (
                                <span
                                    title="Fields in bold are original values provided by the studios"
                                    style={{color: 'grey'}}
                                >
                                    &nbsp;&nbsp;
                                    <i className="far fa-question-circle" />
                                </span>
                            ) : (
                                ''
                            )}
                            {tooltip ? (
                                <span title={tooltip} style={{color: 'grey'}}>
                                    &nbsp;&nbsp;
                                    <i className="far fa-question-circle" />
                                </span>
                            ) : (
                                ''
                            )}
                        </div>
                        <div
                            onClick={this.onFieldClicked}
                            className={'editable-field col-8' + (value ? '' : ' empty') + (readOnly ? ' disabled' : '')}
                            id={'right-detail-' + name + '-field'}
                        >
                            <div
                                className="editable-field-content"
                                onClick={highlighted ? () => this.onEditableClick(ref) : null}
                            >
                                {content}
                            </div>
                            <span className="edit-icon" style={{color: 'gray'}}>
                                <i className="fas fa-pen" />
                            </span>
                        </div>
                    </div>
                </div>
            );
        };

        /**
         * Renders a text field using the @atlaskit/inline-edit component, which also allows us to pass in extra props like `autoComplete="off"`
         */
        const renderTextField = (name, displayName, value, error, readOnly, required, highlighted) => {
            const ref = React.createRef();

            const onSubmit = (name, value) => {
                let newValue = safeTrim(value);

                if (newValue === '') {
                    newValue = null;
                }

                this.update(name, newValue);
            };

            return renderFieldTemplate(
                name,
                displayName,
                value,
                error,
                readOnly,
                required,
                highlighted,
                null,
                ref,
                readOnly ? (
                    value
                ) : (
                    <InlineEdit
                        placeholder={`${this.emptyValueText} ${displayName}`}
                        defaultValue={value}
                        hideActionButtons={!!sourceRightId || readOnly}
                        readView={() => <p>{value || `${this.emptyValueText} ${displayName}`}</p>}
                        editView={fieldProps => (
                            <TextField
                                {...fieldProps}
                                name={name}
                                isReadOnly={!!sourceRightId || readOnly}
                                style={{...fieldProps.style, border: 'none', borderRadius: 0}}
                                autoFocus
                                autoComplete={`new-${displayName.replace(' ', '-').toLowerCase()}`}
                                theme={(theme, props) => ({
                                    ...theme(props),
                                    input: {
                                        height: '32px',
                                        width: '100%',
                                    },
                                })}
                            />
                        )}
                        validate={value => this.validateTextField(name, value)}
                        onConfirm={value => onSubmit(name, value)}
                    />
                )
            );
        };

        const renderAvField = (
            name,
            displayName,
            value,
            error,
            readOnly,
            required,
            highlighted,
            tooltip,
            validation
        ) => {
            const ref = React.createRef();
            let priorityError = null;
            if (error) {
                priorityError = (
                    <div
                        title={error}
                        style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: '#a94442'}}
                    >
                        {error}
                    </div>
                );
            }

            const handleValueChange = newVal => {
                const error = validate(newVal);
                if (error) {
                    ref.current.handleInvalid(newVal, error);
                } else {
                    ref.current.handleChange(newVal);
                }
                setTimeout(() => {
                    this.setState({});
                }, 1);
            };

            const validate = val => {
                if (validation && validation.pattern) {
                    const isValid = val ? validation.pattern.value.test(val) : !required;
                    if (!isValid) {
                        return validation.pattern.errorMessage;
                    }
                } else if (validation && validation.number) {
                    const isNumber = !isNaN(val.replace(',', '.'));
                    if (!isNumber) {
                        return 'Please enter a valid number!';
                    }
                }
            };

            const innerValidate = (val, ctx, input, cb) => {
                if (validation && validation.pattern) {
                    cb(val ? validation.pattern.value.test(val) : !required);
                } else if (validation && validation.number) {
                    const isNumber = !isNaN(val.replace(',', '.'));
                    cb(isNumber);
                }

                if (!validation) {
                    cb(true);
                }
            };

            const convert = val => {
                if (val && validation && validation.number) {
                    return Number(val.replace(',', '.'));
                }
                return val ? val : null;
            };

            let errorMessage = '';
            if (validation) {
                if (validation.pattern && validation.pattern.errorMessage) {
                    errorMessage = validation.pattern.errorMessage;
                } else if (validation.number) {
                    errorMessage = 'Please enter a valid number!';
                }
            }

            const modifiedValidation = {...validation};
            delete modifiedValidation.number;

            return renderFieldTemplate(
                name,
                displayName,
                value,
                error,
                readOnly,
                required,
                highlighted,
                tooltip,
                ref,
                <EditableBaseComponent
                    ref={ref}
                    value={value}
                    priorityDisplay={priorityError}
                    name={name}
                    disabled={!!sourceRightId || readOnly}
                    displayName={displayName}
                    validate={validate}
                    onChange={(value, cancel) => this.handleEditableSubmit(name, convert(value), cancel)}
                    showError={false}
                    helperComponent={
                        <AvForm>
                            <AvField
                                value={value}
                                name={name}
                                isReadOnly={!!sourceRightId}
                                placeholder={'Enter ' + displayName}
                                onChange={e => {
                                    handleValueChange(e.target.value);
                                }}
                                type="text"
                                validate={{...modifiedValidation, async: innerValidate}}
                                errorMessage={errorMessage}
                            />
                        </AvForm>
                    }
                />
            );
        };

        const renderIntegerField = (name, displayName, value, error, readOnly, required, highlighted) => {
            return renderAvField(name, displayName, value, error, readOnly, required, highlighted, null, {
                number: true,
                pattern: {value: /^\d+$/, errorMessage: 'Please enter a valid integer'},
            });
        };

        const renderYearField = (name, displayName, value, error, readOnly, required, highlighted) => {
            return renderAvField(name, displayName, value, error, readOnly, required, highlighted, null, {
                pattern: {value: /^\d{4}$/, errorMessage: 'Please enter a valid year (4 digits)'},
            });
        };

        const renderDoubleField = (name, displayName, value, error, readOnly, required, highlighted) => {
            return renderAvField(name, displayName, value, error, readOnly, required, highlighted, null, {
                number: true,
                pattern: {value: /^\d*(\d[.,]|[.,]\d)?\d*$/, errorMessage: 'Please enter a valid number'},
            });
        };

        const renderTimeField = (name, displayName, value, error, readOnly, required, highlighted) => {
            return renderAvField(name, displayName, value, error, readOnly, required, highlighted, null, {
                pattern: {
                    value: /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/,
                    errorMessage: 'Please enter a valid time! (00:00:00 - 23:59:59)',
                },
            });
        };

        const renderDurationField = (name, displayName, value, error, readOnly, required, highlighted) => {
            return renderAvField(
                name,
                displayName,
                value,
                error,
                readOnly,
                required,
                highlighted,
                'format: PnYnMnDTnHnMnS. \neg. P3Y6M4DT12H30M5S (three years, six months, four days, twelve hours, thirty minutes, and five seconds)'
            );
        };

        const renderBooleanField = (
            name,
            displayName,
            value,
            error,
            readOnly,
            required,
            highlighted,
            useYesNo = false
        ) => {
            let priorityError = null;
            if (error) {
                priorityError = (
                    <div
                        title={error}
                        style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: '#a94442'}}
                    >
                        {error}
                    </div>
                );
            }

            let ref;
            if (this.fields[name]) {
                ref = this.fields[name];
            } else {
                this.fields[name] = ref = React.createRef();
            }

            let options = useYesNo
                ? [
                      {server: null, value: 1, label: 'Select...', display: null},
                      {server: false, value: 2, label: 'No', display: 'No'},
                      {server: true, value: 3, label: 'Yes', display: 'Yes'},
                  ]
                : [
                      {server: null, value: 1, label: 'Select...', display: null},
                      {server: false, value: 2, label: 'false', display: 'false'},
                      {server: true, value: 3, label: 'true', display: 'true'},
                  ];

            const val = ref.current
                ? options.find(opt => opt.display === ref.current.state.value)
                : options.find(opt => opt.server === value);

            const handleOptionsChange = option => {
                ref.current.handleChange(option.display);
                setTimeout(() => {
                    this.setState({});
                }, 1);
            };

            if (name === 'temporaryPriceReduction') {
                readOnly = value || this.state.right.status !== 'Pending';
            }

            return renderFieldTemplate(
                name,
                displayName,
                val.display,
                error,
                readOnly,
                required,
                highlighted,
                null,
                ref,
                <EditableBaseComponent
                    ref={ref}
                    value={options.find(opt => opt.server === value).display}
                    priorityDisplay={priorityError}
                    name={name}
                    disabled={!!sourceRightId || readOnly}
                    displayName={displayName}
                    validate={() => {}}
                    onChange={(value, cancel) =>
                        this.handleEditableSubmit(name, options.find(({display}) => display == value).server, cancel)
                    }
                    helperComponent={
                        <Select
                            name={name}
                            placeholderButtonLabel={'Select ' + displayName + ' ...'}
                            options={options}
                            disabled={!!sourceRightId}
                            value={val}
                            onChange={handleOptionsChange}
                        />
                    }
                />
            );
        };

        const renderSelectField = (name, displayName, value, error, readOnly, required, highlighted) => {
            let priorityError = null;
            if (error) {
                priorityError = (
                    <div
                        title={error}
                        style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: '#a94442'}}
                    >
                        {error}
                    </div>
                );
            }

            let ref;
            if (this.fields[name]) {
                ref = this.fields[name];
            } else {
                this.fields[name] = ref = React.createRef();
            }

            let options = [];
            let selectedVal = ref.current ? ref.current.state.value : value;
            let val;
            if (this.props.selectValues && this.props.selectValues[name]) {
                options = this.props.selectValues[name];
            }

            const onCancel = () => {
                selectedVal = cloneDeep(value);
                setTimeout(() => {
                    this.setState({});
                }, 1);
            };

            options = options
                .filter(rec => rec.value)
                .map(rec => {
                    return {
                        ...rec,
                        label: rec.label || rec.value,
                        aliasValue: rec.aliasId
                            ? options.filter(pair => rec.aliasId === pair.id).length === 1
                                ? options.filter(pair => rec.aliasId === pair.id)[0].value
                                : null
                            : null,
                    };
                });

            if (options.length > 0 && selectedVal) {
                val = options.find(opt => opt.value === selectedVal);
                if (!required) {
                    options.unshift({value: '', label: value ? 'Select...' : ''});
                }
            }

            const handleOptionsChange = option => {
                ref.current.handleChange(option.value ? option.value : null);
                setTimeout(() => {
                    this.setState({});
                }, 1);
            };

            return renderFieldTemplate(
                name,
                displayName,
                value,
                error,
                (readOnly = name === 'status' ? true : readOnly),
                required,
                highlighted,
                null,
                ref,
                <EditableBaseComponent
                    ref={ref}
                    value={value}
                    priorityDisplay={priorityError}
                    name={name}
                    disabled={!!sourceRightId || readOnly}
                    displayName={displayName}
                    validate={() => {}}
                    onChange={(value, cancel) => this.handleEditableSubmit(name, value, cancel)}
                    onCancel={onCancel}
                    helperComponent={
                        <Select
                            name={name}
                            isSearchable
                            disabled={!!sourceRightId}
                            placeholderButtonLabel={'Select ' + displayName + ' ...'}
                            options={options}
                            value={val}
                            onChange={handleOptionsChange}
                        />
                    }
                />
            );
        };

        const renderMultiSelectField = (name, displayName, value, error, readOnly, required, highlighted) => {
            let priorityError = null;
            if (error && !name.includes('affiliate')) {
                priorityError = (
                    <div
                        title={error}
                        style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: '#a94442'}}
                    >
                        {error}
                    </div>
                );
            }

            let ref;
            if (this.fields[name]) {
                ref = this.fields[name];
            } else {
                this.fields[name] = ref = React.createRef();
            }

            let options = [];
            let selectedVal = ref.current ? ref.current.state.value : value;
            let val;
            if (this.props.selectValues && this.props.selectValues[name]) {
                options = this.props.selectValues[name];
            }

            //fields with enpoints (these have ids)
            const filterKeys = Object.keys(this.state.flatRight).filter(
                key => this.props.availsMapping.mappings.find(x => x.javaVariableName === key).configEndpoint
            );
            const filters = filterKeys
                .map(key => {
                    if (this.state.flatRight[key] && this.props.selectValues[key]) {
                        const filt = (Array.isArray(this.state.flatRight[key])
                            ? this.state.flatRight[key]
                            : [this.state.flatRight[key]]
                        )
                            .map(val => {
                                const candidates = this.props.selectValues[key].filter(opt => opt.value === val);
                                return candidates.length ? candidates : null;
                            })
                            .filter(x => x)
                            .flat();
                        return filt.length ? filt : null;
                    }
                })
                .filter(x => x); //.filter(x => (Array.isArray(x) ? x.length : x));

            let filteredOptions = options;
            filters.map(filter => {
                const fieldName = filter[0].type + 'Id';
                const allowedOptions = filter.map(({id}) => id);
                filteredOptions = filteredOptions.filter(option =>
                    option[fieldName] ? allowedOptions.indexOf(option[fieldName]) > -1 : true
                );
            });

            const allOptions = [
                {
                    label: 'Select All',
                    options: filteredOptions
                        .filter(rec => rec.value)
                        .map(rec => {
                            return {
                                ...rec,
                                label: rec.label || rec.value,
                                aliasValue: rec.aliasId
                                    ? options.filter(pair => rec.aliasId === pair.id).length === 1
                                        ? options.filter(pair => rec.aliasId === pair.id)[0].value
                                        : null
                                    : null,
                            };
                        }),
                },
            ];

            if (
                allOptions[0].options &&
                allOptions[0].options.length > 0 &&
                selectedVal &&
                Array.isArray(selectedVal)
            ) {
                val = selectedVal.map(v => allOptions[0].options.filter(opt => opt.value === v)).flat();
            }

            const onCancel = () => {
                selectedVal = cloneDeep(value);
                setTimeout(() => {
                    this.setState({});
                }, 1);
            };

            const handleOptionsChange = selectedOptions => {
                const selVal = selectedOptions.map(({value}) => value);
                ref.current.handleChange(selVal ? selVal : null);
                setTimeout(() => {
                    this.setState({});
                }, 1);
            };

            const {right: {licensee = {}} = {}, configLicensees} = this.state;

            const configLicensee = Array.isArray(configLicensees)
                ? configLicensees.find(({licenseeName}) => licenseeName === licensee)
                : '';

            const {servicingRegion = ''} = configLicensee || {};

            const isRequired =
                required ||
                (name === 'platformCategory' && servicingRegion === 'US') ||
                name === 'licenseRightsDescription';
            const tooltip = name === 'platformCategory' ? PLATFORM_INFORM_MSG : null;

            return renderFieldTemplate(
                name,
                displayName,
                value,
                error,
                readOnly,
                isRequired,
                highlighted,
                tooltip,
                ref,
                <EditableBaseComponent
                    ref={ref}
                    value={value}
                    priorityDisplay={priorityError}
                    name={name}
                    disabled={!!sourceRightId || readOnly}
                    displayName={displayName}
                    validate={() => {}}
                    onChange={(value, cancel) => this.handleEditableSubmit(name, value, cancel)}
                    onCancel={onCancel}
                    helperComponent={
                        <ReactMultiSelectCheckboxes
                            placeholderButtonLabel={'Select ' + displayName + ' ...'}
                            getDropdownButtonLabel={({placeholderButtonLabel, value}) => {
                                if (value && value.length > 0) {
                                    return (
                                        <div style={{width: '100%'}}>
                                            <div
                                                style={{
                                                    maxWidth: '90%',
                                                    float: 'left',
                                                    textOverflow: 'ellipsis',
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {value.map(({value}) => value).join(', ')}
                                            </div>
                                            <div style={{width: '10%', float: 'left', paddingLeft: '5px'}}>
                                                {' (' + value.length + ' selected)'}
                                            </div>
                                        </div>
                                    );
                                }
                                return placeholderButtonLabel;
                            }}
                            options={allOptions}
                            value={val}
                            disabled={!!sourceRightId}
                            onChange={handleOptionsChange}
                        />
                    }
                />
            );
        };

        const renderPriceField = (name, displayName, value, errors, readOnly, required, highlighted) => {
            let ref;
            if (this.fields[name]) {
                ref = this.fields[name];
            } else {
                this.fields[name] = ref = React.createRef();
            }

            let options = [],
                currencyOptions = [];
            let selectedVal = ref.current ? ref.current.state.value : value;
            if (this.props.selectValues && this.props.selectValues['pricing.priceType']) {
                options = this.props.selectValues['pricing.priceType'];
            }
            if (this.props.selectValues && this.props.selectValues['pricing.priceCurrency']) {
                currencyOptions = this.props.selectValues['pricing.priceCurrency'];
            }

            options = options
                .filter(rec => rec.value)
                .map(rec => {
                    return {
                        ...rec,
                        label: rec.label || rec.value,
                        aliasValue: rec.aliasId
                            ? options.filter(pair => rec.aliasId === pair.id).length === 1
                                ? options.filter(pair => rec.aliasId === pair.id)[0].value
                                : null
                            : null,
                    };
                });
            const onCancel = () => {
                selectedVal = cloneDeep(value);
                setTimeout(() => {
                    this.setState({});
                }, 1);
            };

            const addPrice = option => {
                const {priceIndex, isEdit} = this.state;
                const item = {
                    ...option,
                    isValid: true,
                    id: isEdit ? priceIndex : selectedVal.length,
                };
                if (this.state.isEdit) {
                    selectedVal.splice(this.state.priceIndex, 1, item);
                } else {
                    selectedVal = selectedVal ? [...selectedVal, item] : [item];
                }
                ref.current.handleChange(option ? selectedVal : null);
                // ??? - call set state that clean state inside timeout
                setTimeout(() => {
                    this.setState({});
                }, 1);
            };

            const deletePrice = id => {
                const newArray = selectedVal && selectedVal.filter(e => id !== e.id);
                ref.current.handleChange(newArray);
                setTimeout(() => {
                    this.setState({});
                }, 1);
            };

            const removePriceNotOriginalFields = (list = []) => {
                const {mappings} = this.props.availsMapping || [];
                let originalFieldNames = mappings
                    .filter(el => el.javaVariableName.startsWith('pricing.'))
                    .map(mapping => mapping.javaVariableName.split('.')[1]);
                originalFieldNames = originalFieldNames.concat('errors');

                const formattedList = [];
                list.forEach(el => {
                    const price = Object.assign({}, el);
                    Object.keys(price).forEach(key => {
                        if (originalFieldNames.findIndex(name => name === key) < 0) {
                            delete price[key];
                        }
                    });
                    formattedList.push(price);
                });
                return formattedList;
            };
            const prices = removePriceNotOriginalFields(selectedVal).map(price => {
                return Object.assign({}, price);
            });
            let pricesWithLabel = [];
            if (options.length) {
                pricesWithLabel = prices.map(({priceType, priceValue, priceCurrency, errors = []}) => {
                    const error = errors.length
                        ? errors
                              .map(error => {
                                  const {severityType = '', fieldName = '', message = ''} = error || {};
                                  return `${fieldName.split('.').pop()} ${message} (${severityType})`;
                              })
                              .join('\n')
                        : '';
                    return {
                        priceType: priceType,
                        priceValue: priceValue,
                        priceCurrency: priceCurrency,
                        label: get(
                            options.find(o => o.value === priceType),
                            'label',
                            ''
                        ),
                        error,
                    };
                });
            }

            return renderFieldTemplate(
                name,
                displayName,
                value,
                errors,
                readOnly,
                required,
                highlighted,
                null,
                ref,
                <EditableBaseComponent
                    ref={ref}
                    value={value}
                    originalFieldList={pricesWithLabel}
                    name={name}
                    disabled={!!sourceRightId || readOnly}
                    isArrayOfObject={true}
                    validate={() => {}}
                    displayName={displayName}
                    onChange={(value, cancel) => this.handleEditableSubmit(name, value, cancel)}
                    onCancel={onCancel}
                    showError={false}
                    helperComponent={
                        <PriceField
                            prices={pricesWithLabel}
                            name={name}
                            disabled={!!sourceRightId}
                            onRemoveClick={deletePrice}
                            onTagClick={this.toggleRightPriceForm}
                            onAddClick={this.toggleAddRightPriceForm}
                            renderChildren={() => (
                                <>
                                    <div style={{position: 'absolute', right: '10px'}}>
                                        <AddButton onClick={this.toggleAddRightPriceForm}>+</AddButton>
                                    </div>
                                    <RightPriceForm
                                        onSubmit={addPrice}
                                        isOpen={this.state.isRightPriceFormOpen}
                                        onClose={() => this.toggleRightPriceForm(null)}
                                        existingPriceList={pricesWithLabel}
                                        priceIndex={this.state.priceIndex}
                                        isEdit={this.state.isEdit}
                                        priceTypeOptions={options}
                                        priceCurrencyOptions={currencyOptions}
                                    />
                                </>
                            )}
                        />
                    }
                />
            );
        };

        const renderTerritoryField = (name, displayName, value, errors, readOnly, required, highlighted) => {
            {
                /*let priorityError = null;
            if (error) {
                priorityError = <div title={error}
                    style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: '#a94442' }}>
                    {error}
                </div>;
                }*/
            }
            let ref;
            if (this.fields[name]) {
                ref = this.fields[name];
            } else {
                this.fields[name] = ref = React.createRef();
            }

            let options = [];
            // deepClone(value) returns null for country
            let selectedVal = ref.current ? ref.current.state.value : value;
            if (this.props.selectValues && this.props.selectValues[name]) {
                options = this.props.selectValues[name];
            }

            options = options
                .filter(rec => rec.value)
                .map(rec => {
                    return {
                        ...rec,
                        label: rec.label || rec.value,
                        aliasValue: rec.aliasId
                            ? options.filter(pair => rec.aliasId === pair.id).length === 1
                                ? options.filter(pair => rec.aliasId === pair.id)[0].value
                                : null
                            : null,
                    };
                });

            const onCancel = () => {
                selectedVal = cloneDeep(value);
                setTimeout(() => {
                    this.setState({});
                }, 1);
            };

            const addTerritory = option => {
                const {territoryIndex, isEdit} = this.state;
                const item = {
                    ...option,
                    isValid: true,
                    id: isEdit ? territoryIndex : selectedVal.length,
                };
                if (this.state.isEdit) {
                    selectedVal.splice(this.state.territoryIndex, 1, item);
                } else {
                    selectedVal = selectedVal ? [...selectedVal, item] : [item];
                }

                ref.current.handleChange(option ? selectedVal : null);
                // ??? - call set state that clean state inside timeout
                setTimeout(() => {
                    this.setState({});
                }, 1);
            };

            const deleteTerritory = territory => {
                const newArray =
                    selectedVal && selectedVal.filter(e => e.id !== territory.id && e.country !== territory.country);
                ref.current.handleChange(newArray);
                setTimeout(() => {
                    this.setState({});
                }, 1);
            };

            const removeTerritoryNotOriginalFields = (list = []) => {
                const {mappings} = this.props.availsMapping || [];
                let originalFieldNames = mappings
                    .filter(el => el.javaVariableName.startsWith('territory.'))
                    .map(mapping => mapping.javaVariableName.split('.')[1])
                    .concat('errors'); // Remove the `errors` field that was used for custom error handling

                const formattedList = [];
                list.forEach(el => {
                    const territory = Object.assign({}, el);
                    Object.keys(territory).forEach(key => {
                        if (originalFieldNames.findIndex(name => name === key) < 0) {
                            delete territory[key];
                        }
                    });
                    formattedList.push(territory);
                });
                return formattedList;
            };

            const territories = removeTerritoryNotOriginalFields(selectedVal).map(territory => {
                const {vuContractId} = territory;
                const mappedTerritory = Object.assign({}, territory);
                if (Array.isArray(vuContractId) && vuContractId.length > 0) {
                    mappedTerritory.vuContractId = vuContractId.join(', ');
                }
                return mappedTerritory;
            });

            let territoriesWithError = [];
            if (options.length) {
                // If there are validation errors, pack them inside the territory object to be displayed in tooltip
                territoriesWithError = territories.map(({errors, ...restProps}) => {
                    const error =
                        errors && errors.length
                            ? errors
                                  .map(error => {
                                      const {severityType = '', fieldName = '', message = ''} = error || {};
                                      return `${fieldName.split('.').pop()} ${message} (${severityType})`;
                                  })
                                  .join(' ; ')
                            : '';

                    return {
                        ...restProps,
                        error,
                    };
                });
            }

            return renderFieldTemplate(
                name,
                displayName,
                value,
                errors,
                readOnly,
                required,
                highlighted,
                null,
                ref,
                <EditableBaseComponent
                    ref={ref}
                    value={value}
                    originalFieldList={territoriesWithError}
                    name={name}
                    disabled={readOnly}
                    isArrayOfObject={true}
                    validate={() => {}}
                    displayName={displayName}
                    onChange={(value, cancel) => this.handleEditableSubmit(name, value, cancel)}
                    onCancel={onCancel}
                    showError={false}
                    helperComponent={
                        <TerritoryField
                            territory={territoriesWithError}
                            name={name}
                            onRemoveClick={territory => (!sourceRightId ? deleteTerritory(territory) : null)}
                            onAddClick={this.toggleAddRightTerritoryForm}
                            onTagClick={i => this.toggleRightTerritoryForm(i)}
                            renderChildren={() => (
                                <>
                                    {!sourceRightId && (
                                        <div style={{position: 'absolute', right: '10px'}}>
                                            <AddButton onClick={this.toggleAddRightTerritoryForm}>+</AddButton>
                                        </div>
                                    )}
                                    <RightTerritoryForm
                                        onSubmit={e => addTerritory(e)}
                                        isOpen={this.state.isRightTerritoryFormOpen}
                                        onClose={this.toggleRightTerritoryForm}
                                        existingTerritoryList={selectedVal}
                                        territoryIndex={this.state.territoryIndex}
                                        isEdit={this.state.isEdit}
                                        options={options}
                                    />
                                </>
                            )}
                        />
                    }
                />
            );
        };

        const renderAudioLanguageField = (name, displayName, value, errors, readOnly, required, highlighted) => {
            let ref;
            if (this.fields[name]) {
                ref = this.fields[name];
            } else {
                this.fields[name] = ref = React.createRef();
            }

            let options = [],
                audioTypeOptions = [];
            let selectedVal = ref.current ? ref.current.state.value : value;
            if (this.props.selectValues && this.props.selectValues['languageAudioTypes.language']) {
                options = this.props.selectValues['languageAudioTypes.language'];
            }
            if (this.props.selectValues && this.props.selectValues['languageAudioTypes.audioType']) {
                audioTypeOptions = this.props.selectValues['languageAudioTypes.audioType'];
            }

            options = options
                .filter(rec => rec.value)
                .map(rec => {
                    return {
                        ...rec,
                        label: rec.label || rec.value,
                        aliasValue: rec.aliasId
                            ? options.filter(pair => rec.aliasId === pair.id).length === 1
                                ? options.filter(pair => rec.aliasId === pair.id)[0].value
                                : null
                            : null,
                    };
                });
            const onCancel = () => {
                selectedVal = cloneDeep(value);
                setTimeout(() => {
                    this.setState({});
                }, 1);
            };

            const addAudioLanguage = option => {
                const {audioLanguageIndex, isEdit} = this.state;
                const item = {
                    ...option,
                    isValid: true,
                    id: isEdit ? audioLanguageIndex : selectedVal.length,
                };
                if (this.state.isEdit) {
                    selectedVal.splice(this.state.audioLanguageIndex, 1, item);
                } else {
                    selectedVal = selectedVal ? [...selectedVal, item] : [item];
                }
                ref.current.handleChange(option ? selectedVal : null);
                // ??? - call set state that clean state inside timeout
                setTimeout(() => {
                    this.setState({});
                }, 1);
            };

            const deleteAudioLanguage = audioLanguage => {
                const newArray =
                    selectedVal &&
                    selectedVal.filter(e => e.id !== audioLanguage.id && e.language !== audioLanguage.language);
                ref.current.handleChange(newArray);
                setTimeout(() => {
                    this.setState({});
                }, 1);
            };

            const removeAudioLanguageNotOriginalFields = (list = []) => {
                const {mappings} = this.props.availsMapping || [];
                const originalFieldNames = mappings
                    .filter(el => el.javaVariableName.startsWith('languageAudioTypes.'))
                    .map(mapping => mapping.javaVariableName.split('.')[1])
                    .concat('errors'); // Remove the `errors` field that was used for custom error handling

                const formattedList = [];
                list.forEach(el => {
                    const language = Object.assign({}, el);
                    Object.keys(language).forEach(key => {
                        if (originalFieldNames.findIndex(name => name === key) < 0) {
                            delete language[key];
                        }
                    });
                    formattedList.push(language);
                });
                return formattedList;
            };
            const languages = removeAudioLanguageNotOriginalFields(selectedVal).map(language => {
                return Object.assign({}, language);
            });
            let languagesWithLabel = [];
            if (options.length) {
                languagesWithLabel = languages.map(({language, audioType, errors}) => {
                    // If there are validation errors, pack them inside the language object to be displayed in tooltip
                    const error =
                        errors && errors.length
                            ? errors
                                  .map(error => {
                                      const {severityType = '', fieldName = '', message = ''} = error || {};
                                      return `${fieldName.split('.').pop()} ${message} (${severityType})`;
                                  })
                                  .join(' ; ')
                            : '';

                    return {
                        language: language,
                        audioType: audioType,
                        label: get(
                            options.find(o => o.value === language),
                            'label',
                            ''
                        ),
                        error,
                    };
                });
            }

            return renderFieldTemplate(
                name,
                displayName,
                value,
                errors,
                readOnly,
                required,
                highlighted,
                null,
                ref,
                <EditableBaseComponent
                    ref={ref}
                    value={value}
                    originalFieldList={languagesWithLabel}
                    name={name}
                    disabled={!!sourceRightId || readOnly}
                    isArrayOfObject={true}
                    validate={() => {}}
                    displayName={displayName}
                    onChange={(value, cancel) => this.handleEditableSubmit(name, value, cancel)}
                    onCancel={onCancel}
                    showError={false}
                    helperComponent={
                        <AudioLanguageField
                            audioLanguages={languagesWithLabel}
                            name={name}
                            disabled={!!sourceRightId}
                            onRemoveClick={language => deleteAudioLanguage(language)}
                            onAddClick={this.toggleAddRightAudioLanguageForm}
                            renderChildren={() => (
                                <>
                                    <div style={{position: 'absolute', right: '10px'}}>
                                        <AddButton onClick={this.toggleAddRightAudioLanguageForm}>+</AddButton>
                                    </div>
                                    <RightAudioLanguageForm
                                        onSubmit={e => addAudioLanguage(e)}
                                        isOpen={this.state.isRightAudioLanguageFormOpen}
                                        onClose={this.toggleRightAudioLanguageForm}
                                        existingAudioLanguageList={languagesWithLabel}
                                        audioLanguageIndex={this.state.audioLanguageIndex}
                                        isEdit={this.state.isEdit}
                                        languageOptions={options}
                                        audioTypesOptions={audioTypeOptions}
                                    />
                                </>
                            )}
                        />
                    }
                />
            );
        };

        const renderDatepickerField = (
            showTime,
            name,
            displayName,
            value,
            priorityError,
            isReadOnly,
            required,
            highlighted,
            isTimestamp
        ) => {
            let ref;

            const {flatRight = {}, editedRight = {}} = this.state;
            const validate = date => {
                if (!date && required) {
                    return 'Mandatory Field. Date cannot be empty';
                }
                const rangeError = rangeValidation(name, displayName, date, flatRight);
                if (rangeError) return rangeError;
                return this.extraValidation(name, displayName, date, flatRight);
            };

            // Revert back to valid value in case of an error
            const revertChanges = () => {
                this.setState(prevState => ({
                    editedRight: {
                        ...prevState.editedRight,
                        [name]: prevState.flatRight[name],
                    },
                }));
            };
            const valError = validate(value);
            const error = priorityError || valError;
            const props = {
                id: displayName,
                label: displayName,

                isLabelHidden: true, // TODO: Remove after RightDetails gets refactored/redesigned
                onChange: date => {
                    // Keep a separate state for edited values
                    this.setState(prevState => ({
                        editedRight: {...prevState.editedRight, [name]: date},
                    }));
                },
                onConfirm: date =>
                    (!valError && this.handleEditableSubmit(name, date, revertChanges)) || revertChanges(),
                defaultValue: value,
                value: editedRight[name] !== undefined ? editedRight[name] : value,
                error,
                isRequired: required,
                isReadOnly: name === 'updatedCatalogReceivedAt' ? false : !!sourceRightId || isReadOnly,
                isTimestamp,
                isWithInlineEdit: true,
                isClearable: !required,
                isClearableOnly: name === 'updatedCatalogReceivedAt',
            };

            const component = showTime ? <NexusDateTimePicker {...props} /> : <NexusDatePicker {...props} />;

            return renderFieldTemplate(
                name,
                displayName,
                value,
                error,
                isReadOnly,
                required,
                highlighted,
                null,
                ref,
                component
            );
        };

        const renderFields = [];

        if (this.state.flatRight && this.props.availsMapping) {
            this.props.availsMapping.mappings
                .filter(({dataType}) => dataType)
                .map(mapping => {
                    if (mapping.enableEdit) {
                        let error = null;
                        // TODO: write this from scratch
                        if (this.state.right && this.state.right.validationErrors) {
                            this.state.right.validationErrors.forEach(e => {
                                if (equalOrIncluded(mapping.javaVariableName, e.fieldName)) {
                                    error = e.message;
                                    if (e.sourceDetails) {
                                        if (e.sourceDetails.originalValue)
                                            error += ", original value:  '" + e.sourceDetails.originalValue + "'";
                                        if (e.sourceDetails.fileName) {
                                            error +=
                                                ', in file ' +
                                                e.sourceDetails.fileName +
                                                ', row number ' +
                                                e.sourceDetails.rowId +
                                                ', column ' +
                                                e.sourceDetails.originalFieldName;
                                        }
                                    }
                                }
                            });
                        }
                        const cannotUpdate = cannot('update', 'Avail', mapping.javaVariableName);
                        let readOnly =
                            cannotUpdate ||
                            mapping.readOnly ||
                            mapping.readOnlyInDetails ||
                            this.state.right.status === 'Merged';

                        if (
                            mapping.readOnlyInDetailsBasedField &&
                            Array.isArray(mapping.readOnlyInDetailsBasedField) &&
                            mapping.readOnlyInDetailsBasedField.some(x =>
                                this.checkFieldValue(mapping.readOnlyInDetailsBasedField, x.field, x.fieldValue)
                            )
                        ) {
                            readOnly = true;
                        }
                        const {editedRight = {}, flatRight} = this.state;
                        const value = flatRight ? flatRight[mapping.javaVariableName] : '';
                        const valueV2 = editedRight[mapping.javaVariableName] || flatRight[mapping.javaVariableName];

                        let required = mapping.required && !mapping.requiredBasedField;
                        if (mapping.requiredBasedField && Array.isArray(mapping.requiredBasedField)) {
                            if (mapping.requiredBasedField.some(x => this.state.right[x.field] === x.fieldValue)) {
                                required = true;
                            }
                        }
                        if (mapping.readOnlyBasedField && Array.isArray(mapping.readOnlyBasedField)) {
                            if (mapping.readOnlyBasedField.some(x => this.state.right[x.field] === x.fieldValue)) {
                                readOnly = true;
                            }
                        }
                        let highlighted = false;
                        if (this.state.right && this.state.right.highlightedFields) {
                            highlighted = this.state.right.highlightedFields.indexOf(mapping.javaVariableName) > -1;
                        }

                        const {right = {}} = this.state;
                        const {validationErrors} = right || {};

                        switch (mapping.dataType) {
                            case 'string':
                                renderFields.push(
                                    renderTextField(
                                        mapping.javaVariableName,
                                        mapping.displayName,
                                        value,
                                        error,
                                        readOnly,
                                        required,
                                        highlighted
                                    )
                                );
                                break;
                            case 'integer':
                                renderFields.push(
                                    renderIntegerField(
                                        mapping.javaVariableName,
                                        mapping.displayName,
                                        value,
                                        error,
                                        readOnly,
                                        required,
                                        highlighted
                                    )
                                );
                                break;
                            case 'year':
                                renderFields.push(
                                    renderYearField(
                                        mapping.javaVariableName,
                                        mapping.displayName,
                                        value,
                                        error,
                                        readOnly,
                                        required,
                                        highlighted
                                    )
                                );
                                break;
                            case 'double':
                                renderFields.push(
                                    renderDoubleField(
                                        mapping.javaVariableName,
                                        mapping.displayName,
                                        value,
                                        error,
                                        readOnly,
                                        required,
                                        highlighted
                                    )
                                );
                                break;
                            case 'select':
                                renderFields.push(
                                    renderSelectField(
                                        mapping.javaVariableName,
                                        mapping.displayName,
                                        value,
                                        error,
                                        readOnly,
                                        required,
                                        highlighted
                                    )
                                );
                                break;
                            case 'multiselect':
                                if (mapping.javaVariableName === 'affiliate') {
                                    renderFields.push(
                                        renderMultiSelectField(
                                            mapping.javaVariableName,
                                            mapping.displayName,
                                            this.state.affiliates,
                                            Array.isArray(validationErrors) &&
                                                validationErrors.filter(
                                                    el =>
                                                        el.fieldName &&
                                                        el.fieldName.includes('affiliate') &&
                                                        !el.fieldName.includes('affiliateExclude')
                                                ),
                                            readOnly,
                                            required,
                                            highlighted
                                        )
                                    );
                                    break;
                                } else if (mapping.javaVariableName === 'affiliateExclude') {
                                    renderFields.push(
                                        renderMultiSelectField(
                                            mapping.javaVariableName,
                                            mapping.displayName,
                                            this.state.affiliatesExclude,
                                            Array.isArray(validationErrors) &&
                                                validationErrors.filter(
                                                    el => el.fieldName && el.fieldName.includes('affiliateExclude')
                                                ),
                                            readOnly,
                                            required,
                                            highlighted
                                        )
                                    );
                                    break;
                                }
                                renderFields.push(
                                    renderMultiSelectField(
                                        mapping.javaVariableName,
                                        mapping.displayName,
                                        value,
                                        error,
                                        readOnly,
                                        required,
                                        highlighted
                                    )
                                );
                                break;
                            case 'duration':
                                renderFields.push(
                                    renderDurationField(
                                        mapping.javaVariableName,
                                        mapping.displayName,
                                        value,
                                        error,
                                        readOnly,
                                        required,
                                        highlighted
                                    )
                                );
                                break;
                            case 'time':
                                renderFields.push(
                                    renderTimeField(
                                        mapping.javaVariableName,
                                        mapping.displayName,
                                        value,
                                        error,
                                        readOnly,
                                        required,
                                        highlighted
                                    )
                                );
                                break;
                            case DATETIME_FIELDS.REGIONAL_MIDNIGHT:
                                renderFields.push(
                                    renderDatepickerField(
                                        false,
                                        mapping.javaVariableName,
                                        mapping.displayName,
                                        valueV2,
                                        error,
                                        readOnly,
                                        required,
                                        highlighted,
                                        false
                                    )
                                );
                                break;
                            case DATETIME_FIELDS.TIMESTAMP:
                                renderFields.push(
                                    renderDatepickerField(
                                        true,
                                        mapping.javaVariableName,
                                        mapping.displayName,
                                        valueV2,
                                        error,
                                        readOnly,
                                        required,
                                        highlighted,
                                        true
                                    )
                                );
                                break;
                            case DATETIME_FIELDS.BUSINESS_DATETIME:
                                renderFields.push(
                                    renderDatepickerField(
                                        true,
                                        mapping.javaVariableName,
                                        mapping.displayName,
                                        valueV2,
                                        error,
                                        readOnly,
                                        required,
                                        highlighted,
                                        false
                                    )
                                );
                                break;
                            case 'boolean':
                                renderFields.push(
                                    renderBooleanField(
                                        mapping.javaVariableName,
                                        mapping.displayName,
                                        value,
                                        error,
                                        readOnly,
                                        required,
                                        highlighted,
                                        mapping.javaVariableName === 'updatedCatalogReceived'
                                    )
                                );
                                break;
                            case 'yesOrNo':
                                // Special case
                                renderFields.push(
                                    renderBooleanField(
                                        mapping.javaVariableName,
                                        mapping.displayName,
                                        value,
                                        error,
                                        readOnly,
                                        required,
                                        highlighted,
                                        true
                                    )
                                );
                                break;
                            case 'priceType':
                                renderFields.push(
                                    renderPriceField(
                                        mapping.javaVariableName,
                                        mapping.displayName,
                                        this.state.pricing,
                                        Array.isArray(validationErrors) &&
                                            validationErrors.filter(
                                                el => el.fieldName && el.fieldName.includes('pricing')
                                            ),
                                        readOnly,
                                        required,
                                        highlighted
                                    )
                                );
                                break;
                            case 'territoryType':
                                renderFields.push(
                                    renderTerritoryField(
                                        mapping.javaVariableName,
                                        mapping.displayName,
                                        this.state.territory,
                                        Array.isArray(validationErrors) &&
                                            validationErrors.filter(
                                                el => el.fieldName && el.fieldName.includes('territory')
                                            ),
                                        readOnly,
                                        required,
                                        highlighted
                                    )
                                );
                                break;

                            case 'audioLanguageType':
                                renderFields.push(
                                    renderAudioLanguageField(
                                        mapping.javaVariableName,
                                        mapping.displayName,
                                        this.state.audioLanguage,
                                        Array.isArray(validationErrors) &&
                                            validationErrors.filter(
                                                el => el.fieldName && el.fieldName.includes('languageAudioTypes')
                                            ),
                                        readOnly,
                                        required,
                                        highlighted
                                    )
                                );
                                break;
                            default:
                                console.warn(
                                    'Unsupported DataType: ' +
                                        mapping.dataType +
                                        ' for field name: ' +
                                        mapping.displayName
                                    // eslint-disable-next-line
                                );
                        }
                    }
                });
        }

        return (
            <div
                style={{
                    position: 'relative',
                }}
            >
                <ManualRightsEntryDOPConnector />
                <BlockUi tag="div" blocking={this.props.blocking}>
                    {this.state.errorMessage && (
                        <div
                            id="right-edit-error"
                            className="d-inline-flex justify-content-center w-100 position-absolute alert-danger"
                            style={{top: '-20px', zIndex: '1000', height: '25px'}}
                        >
                            <Label id="right-edit-error-message">{this.state.errorMessage}</Label>
                        </div>
                    )}
                    <div className="nx-stylish row my-3 mx-5">
                        <div className="nx-stylish list-group col-12">
                            <BackNavigationByUrl
                                title="Right Details"
                                onNavigationClick={this.navigateToPreviousPreview}
                            />
                            {this.getStatusNote()}
                            {renderFields}
                        </div>
                    </div>
                </BlockUi>
                {/* Provide clashingRights for modal open*/}
                <RightsClashingModal />
            </div>
        );
    }
}

RightDetails.propTypes = {
    selectValues: PropTypes.object,
    availsMapping: PropTypes.any,
    match: PropTypes.any,
    location: PropTypes.any,
    blocking: PropTypes.bool,
    history: PropTypes.object,
    handleMatchingRights: PropTypes.func,
};

RightDetails.defaultProps = {
    selectValues: null,
    availsMapping: null,
    match: {},
    location: {},
    blocking: null,
    history: null,
    handleMatchingRights: () => null,
};

RightDetails.contextTypes = {
    router: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(withToasts(RightDetails));
