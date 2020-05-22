import React from 'react';
import ReactDOM from 'react-dom'; // we should remove thiss, replace use of findDomNode with ref
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import moment from 'moment';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes'; // replace by new NexusSelectCheckbox
import Select from 'react-select';
import Editable from 'react-x-editable'; // there is inside atlaskit componetn for editable
import config from 'react-global-configuration';
import {Button, Label} from 'reactstrap';
import {cloneDeep} from 'lodash';
import './RightDetails.scss';
import {store} from '../../../../../index';
import {blockUI} from '../../../stores/actions/index';
import {rightsService} from '../service/RightsService';
import EditableBaseComponent from '../../../components/form/editable/EditableBaseComponent';
import {oneOfValidation, rangeValidation} from '../../../../../util/Validation';
import {profileService} from '../service/ProfileService';
import {cannot} from '../../../../../ability';
import {AvField, AvForm} from 'availity-reactstrap-validation';
import {equalOrIncluded, getDeepValue, isObject, safeTrim, URL} from '../../../../../util/Common';
import BlockUi from 'react-block-ui';
import {confirmModal} from '../../../components/modal/ConfirmModal';
import RightTerritoryForm from '../../../components/form/RightTerritoryForm';
import RightAudioLanguageForm from '../../../components/form/RightAudioLanguageForm';
import NexusDateTimePicker from '../../../../../ui/elements/nexus-date-and-time-elements/nexus-date-time-picker/NexusDateTimePicker';
import ManualRightsEntryDOPConnector from '../create/ManualRightsEntry/components/ManualRightsEntryDOPConnector';
import NexusDatePicker from '../../../../../ui/elements/nexus-date-and-time-elements/nexus-date-picker/NexusDatePicker';
import TerritoryField from '../components/TerritoryField';
import AudioLanguageField from '../components/AudioLanguageField';
import {AddButton} from '../custom-form-components/CustomFormComponents';
import RightsClashingModal from '../clashing-modal/RightsClashingModal';
import {DATETIME_FIELDS, dateToISO} from '../../../../../util/DateTimeUtils';
import BackNavigationByUrl from '../../../../../ui/elements/nexus-navigation/navigate-back-by-url/BackNavigationByUrl';
import {AVAILS_PATH} from '../../../../avails/availsRoutes';

const mapStateToProps = state => {
    return {
        availsMapping: state.root.availsMapping,
        selectValues: state.root.selectValues,
        blocking: state.root.blocking,
    };
};

class RightDetails extends React.Component {
    refresh = null;

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.getRightData = this.getRightData.bind(this);

        this.emptyValueText = 'Enter';
        this.fields = {};

        this.state = {
            errorMessage: '',
            isRightTerritoryFormOpen: false,
            isRightAudioLanguageFormOpen: false,
            territoryIndex: null,
            audioLanguageIndex: null,
            isEdit: false,
            editedRight: {},
        };
    }

    componentDidMount() {
        profileService.initAvailsMapping();
        this.getRightData();
        if (this.refresh === null) {
            this.refresh = setInterval(this.getRightData, config.get('avails.edit.refresh.interval'));
        }
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

        setTimeout(function(){
            if (window.location.href == prevPage) {
                window.location.href = URL.keepEmbedded(AVAILS_PATH);
            }
        }, 500);
    }

    getRightData() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            rightsService.get(this.props.match.params.id)
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
                            languageAudioTypes =  [],
                        } = res || {};
                        // temporary solution for territory - all should be refactor
                        const territoryErrors = (Array.isArray(validationErrors) && validationErrors.filter(el => el.fieldName && el.fieldName.includes('territory') && !el.fieldName.includes('territoryExcluded') )
                            .map(error => {
                                const matchObj = error.fieldName.match(regForEror);
                                if (matchObj) {
                                    const matchSubField = error.fieldName.match(regForSubField);
                                    error.index = Number(matchObj[1]);
                                    error.subField = matchSubField[1];
                                }
                                return error;
                            })) || [];

                            const territories = (Array.isArray(territory) && territory.filter(Boolean).map((el, index) => {
                            const error = territoryErrors.find(error => error.index === index);
                            if (error) {
                                el.value = `${error.message} ${error.sourceDetails && error.sourceDetails.originalValue}`;
                                el.isValid = false;
                                el.errors = territoryErrors.filter(error => error.index === index);
                            } else {
                                el.isValid = true;
                                el.value = el.country;
                            }
                            el.id = index;
                            return el;
                        })) || [];
                        // temporary solution for audioLanguage - all should be refactor
                        const audioLanguageErrors = (Array.isArray(validationErrors) && validationErrors.filter(el => el.fieldName && el.fieldName.includes('languageAudioTypes') )
                            .map(error => {
                                const matchObj = error.fieldName.match(regForEror);
                                if (matchObj) {
                                    const matchSubField = error.fieldName.match(regForSubField);
                                    error.index = Number(matchObj[1]);
                                    error.subField = matchSubField[1];
                                }
                                return error;
                            })) || [];

                        const audioLanguages = (Array.isArray(languageAudioTypes) && languageAudioTypes.filter(Boolean).map((el, index) => {
                            const error = audioLanguageErrors.find(error => error.index === index);
                            if (error) {
                                el.value = `${error.message} ${error.sourceDetails && error.sourceDetails.originalValue}`;
                                el.isValid = false;
                                el.errors = audioLanguageErrors.filter(error => error.index === index);
                            } else {
                                el.isValid = true;
                                el.value = el.language;
                            }
                            el.id = index;
                            return el;
                        })) || [];
                        // temporary solution for affiliate and affilateExclude
                        const affiliateErrors = (Array.isArray(validationErrors) && validationErrors.filter(el => el.fieldName && el.fieldName.includes('affiliate') && !el.fieldName.includes('affiliateExclude'))
                        .map(error => {
                            const matchObj = error.fieldName.match(regForEror);
                            if (matchObj) {
                                error.index = Number(matchObj[1]);
                            }
                            return error;
                        })) || [];

                        const affiliateList = (Array.isArray(affiliate) && affiliate.filter(Boolean).map((el, i) => {
                            return {
                                isValid:true,
                                value: el,
                                id: i,
                            };
                        })) || [];

                        const affiliates = [
                            ...affiliateList,
                            ...affiliateErrors.map((el, index) => {
                                const obj = {};
                                obj.value = `${el.message} ${el.sourceDetails && el.sourceDetails.originalValue}`;
                                obj.isValid = false;
                                obj.errors = affiliateErrors[index];
                                obj.id = el.index;
                                return obj;
                            })
                        ];

                        const affiliateExcludeErrors = (Array.isArray(validationErrors) && validationErrors.filter(el => el.fieldName && el.fieldName.includes('affiliateExclude'))
                        .map(error => {
                            const matchObj = error.fieldName.match(regForEror);
                            if (matchObj) {
                                error.index = Number(matchObj[1]);
                            }
                            return error;
                        })) || [];

                        const affiliateiExcludeList = (Array.isArray(affiliateExclude) && affiliateExclude.filter(Boolean).map((el, i) => {
                            return {
                                isValid:true,
                                value: el,
                                id: i,
                            };
                        })) || [];

                        const affiliatesExclude = [
                            ...affiliateiExcludeList,
                            ...affiliateExcludeErrors.map((error, index) => {
                                const obj = {};
                                obj.value = `${error.message} ${error.sourceDetails && error.sourceDetails.originalValue}`;
                                obj.isValid = false;
                                obj.errors = affiliateExcludeErrors[index];
                                obj.id = error.index;
                                return obj;
                        })];

                        this.setState({
                            right: res,
                            flatRight: this.flattenRight(res),
                            territory: territories,
                            audioLanguage: audioLanguages,
                            affiliates,
                            affiliatesExclude,
                        });
                    }
                })
                .catch(() => {
                    this.setState({
                        errorMessage: 'Sorry, we could not find a right with id ' + this.props.match.params.id + ' !'
                    });
                });
        }
    }

    handleSubmit(editable) {
        const name = editable.props.title;
        let value = safeTrim(editable.value);
        if (value === '') {
            value = null;
        }

        this.update(name, value, () => {
            editable.setState({ rightLastEditSucceed: false });
            editable.value = this.state.right[name];
            editable.newValue = this.state.right[name];
        });
    }

    handleEditableSubmit(name, value, cancel) {
        if (value === ''){
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
                if (Array.isArray(val) && map.dataType === 'string') {
                    rightCopy[map.javaVariableName] = val.join(',');
                } else {
                    rightCopy[map.javaVariableName] = val;
                }
            }

        });
        return rightCopy;
    }

    update(name, value, onError) {
        if (this.state.flatRight[name] === value) {
            onError();
            return;
        }
        const updatedRight = { [name]: value };
        store.dispatch(blockUI(true));
        rightsService.update(updatedRight, this.state.right.id)
            .then((editedRight = {})=> {
                this.setState({
                    right: editedRight,
                    flatRight: this.flattenRight(editedRight),
                    errorMessage: ''
                });
                store.dispatch(blockUI(false));

                // Clear the state for editedRight, since the change was already applied
                this.setState((prevState) => {
                    const {editedRight = {}} = prevState;
                    delete editedRight[name];
                    return {editedRight};
                });
            })
            .catch(() => {
                this.setState({
                    errorMessage: 'Editing right failed'
                });
                store.dispatch(blockUI(false));
                onError();
            });
    }

    validateNotEmpty(data) {
        return data.trim() ? '' : <small>Field can not be empty</small>;
    }

    validateTextField(target, field) {
        const value = target.newValue ? target.newValue.trim() : '';

        for (let i = 0; i < this.props.availsMapping.mappings.length; i++) {
            const mapping = this.props.availsMapping.mappings[i];
            if (mapping.javaVariableName === field) {
                const isOriginRightIdRequired = field === 'originalRightId' && this.state.right.temporaryPriceReduction === true && this.state.right.status === 'Ready';
                if (mapping.required || isOriginRightIdRequired) return this.validateNotEmpty(value);
            }
        }
        return '';
    }

    getPairFieldName(name) {
        switch (name) {
            case 'start': return 'availStart';
            case 'availStart': return 'start';
            default: return '';
        }
    }

    extraValidation(name, displayName, date, right) {
        const pairFieldName = this.getPairFieldName(name);
        if (pairFieldName) {
            const mappingPair = this.props.availsMapping.mappings.find(({ javaVariableName }) => javaVariableName === pairFieldName);
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
                    confirmModal.open('Confirm edit',
                        () => {
                        },
                        () => {
                            component.setEditable(false);
                        },
                        { description: 'Are you sure you want to edit this field?' });
                }
            }
        }
    }

    toggleRightTerritoryForm = (index) => {
        this.setState(state => ({
            isEdit: true,
            territoryIndex: index,
            isRightTerritoryFormOpen: !state.isRightTerritoryFormOpen
        }));
    }

    toggleRightAudioLanguageForm = (index) => {
        this.setState(state => ({
            isEdit: true,
            audioLanguageIndex: index,
            isRightAudioLanguageFormOpen: !state.isRightAudioLanguageFormOpen
        }));
    }

    toggleAddRightTerritoryForm = () => {
        this.setState(state => ({
            isRightTerritoryFormOpen: !state.isRightTerritoryFormOpen,
            isEdit: false,
        }));
    }

    toggleAddRightAudioLanguageForm = () => {
        this.setState(state => ({
            isRightAudioLanguageFormOpen: !state.isRightAudioLanguageFormOpen,
            isEdit: false,
        }));
    }

    render() {
        const renderFieldTemplate = (name, displayName, value, error, readOnly, required, highlighted, tooltip, ref, content) => {
            const hasValidationError = Array.isArray(error) ? error.length > 0 : error;
            return (
                <div
                    key={name}
                    className={(readOnly ? ' disabled' : '') + (highlighted ? ' font-weight-bold' : '')}
                    style={{
                        backgroundColor: hasValidationError ? '#f2dede' : '',
                        color: hasValidationError ? '#a94442' : null,
                        border: 'none',
                        position: 'relative', display: 'block', padding: '0.75rem 1.25rem', marginBottom: '-1px',
                    }}
                >
                    <div className="row">
                        <div className="col-4">{displayName}
                            {required ? <span className="text-danger">*</span> : ''}
                            :
                            {highlighted ? <span title="* fields in bold are original values provided by the studios" style={{ color: 'grey' }}>&nbsp;&nbsp;<i className="far fa-question-circle" /></span> : ''}
                            {tooltip ? <span title={tooltip} style={{ color: 'grey' }}>&nbsp;&nbsp;<i className="far fa-question-circle" /></span> : ''}
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
                            <span className="edit-icon" style={{ color: 'gray' }}><i className="fas fa-pen" /></span>
                        </div>
                    </div>
                </div>
            );
        };
        const renderTextField = (name, displayName, value, error, readOnly, required, highlighted) => {
            const ref = React.createRef();
            const displayFunc = (val) => {
                if (error) {
                    return (
                        <div
                            title={error}
                            style={{
                                textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap',
                                color: error ? '#a94442' : null
                            }}
                        >
                            {error}
                        </div>
                    );
                }
                return val;
            };

            return renderFieldTemplate(name, displayName, value, error, readOnly, required, highlighted, null, ref, (
                <Editable
                    ref={ref}
                    title={name}
                    value={value}
                    disabled={readOnly}
                    dataType="text"
                    mode="inline"
                    placeholder={this.emptyValueText + ' ' + displayName}
                    handleSubmit={this.handleSubmit}
                    emptyValueText={displayFunc(readOnly ? '' : this.emptyValueText + ' ' + displayName)}
                    validate={() => this.validateTextField(ref.current, name)}
                    display={displayFunc}
                />
            ));
        };

        const renderAvField = (name, displayName, value, error, readOnly, required, highlighted, tooltip, validation) => {
            const ref = React.createRef();
            let priorityError = null;
            if (error) {
                priorityError = (
                    <div
                        title={error}
                        style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: '#a94442' }}
                    >
                        {error}
                    </div>
);
            }

            const handleValueChange = (newVal) => {
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

            const validate = (val) => {
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

            const convert = (val) => {
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

            const modifiedValidation = { ...validation };
            delete modifiedValidation.number;

            return renderFieldTemplate(name, displayName, value, error, readOnly, required, highlighted, tooltip, ref, (
                <EditableBaseComponent
                    ref={ref}
                    value={value}
                    priorityDisplay={priorityError}
                    name={name}
                    disabled={readOnly}
                    displayName={displayName}
                    validate={validate}
                    onChange={(value, cancel) => this.handleEditableSubmit(name, convert(value), cancel)}
                    showError={false}
                    helperComponent={(
                        <AvForm>
                            <AvField
                                value={value}
                                name={name}
                                placeholder={'Enter ' + displayName}
                                onChange={(e) => { handleValueChange(e.target.value); }}
                                type="text"
                                validate={{ ...modifiedValidation, async: innerValidate }}
                                errorMessage={errorMessage}
                            />
                        </AvForm>
)}
                />
            ));
        };

        const renderIntegerField = (name, displayName, value, error, readOnly, required, highlighted) => {
            return renderAvField(name, displayName, value, error, readOnly, required, highlighted, null, { number: true, pattern: { value: /^\d+$/, errorMessage: 'Please enter a valid integer' } });
        };

        const renderYearField = (name, displayName, value, error, readOnly, required, highlighted) => {
            return renderAvField(name, displayName, value, error, readOnly, required, highlighted, null, { pattern: { value: /^\d{4}$/, errorMessage: 'Please enter a valid year (4 digits)' } });
        };

        const renderDoubleField = (name, displayName, value, error, readOnly, required, highlighted) => {
            return renderAvField(name, displayName, value, error, readOnly, required, highlighted, null, { number: true, pattern: { value: /^\d*(\d[.,]|[.,]\d)?\d*$/, errorMessage: 'Please enter a valid number' } });
        };

        const renderTimeField = (name, displayName, value, error, readOnly, required, highlighted) => {
            return renderAvField(name, displayName, value, error, readOnly, required, highlighted, null, { pattern: { value: /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, errorMessage: 'Please enter a valid time! (00:00:00 - 23:59:59)' } });
        };

        const renderDurationField = (name, displayName, value, error, readOnly, required, highlighted) => {
            return renderAvField(name, displayName, value, error, readOnly, required, highlighted,
                'format: PnYnMnDTnHnMnS. \neg. P3Y6M4DT12H30M5S (three years, six months, four days, twelve hours, thirty minutes, and five seconds)'
            );
        };

        const renderBooleanField = (name, displayName, value, error, readOnly, required, highlighted) => {
            let priorityError = null;
            if (error) {
                priorityError = (
                    <div
                        title={error}
                        style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: '#a94442' }}
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

            const options = [{ server: null, value: 1, label: 'Select...', display: null },
            { server: false, value: 2, label: 'false', display: 'false' },
            { server: true, value: 3, label: 'true', display: 'true' }];
            const val = ref.current ? options.find((opt) => opt.display === ref.current.state.value) : options.find((opt) => opt.server === value);

            const handleOptionsChange = (option) => {
                ref.current.handleChange(option.display);
                setTimeout(() => {
                    this.setState({});
                }, 1);
            };

            return renderFieldTemplate(name, displayName, val.display, error, readOnly, required, highlighted, null, ref, (
                <EditableBaseComponent
                    ref={ref}
                    value={options.find((opt) => opt.server === value).display}
                    priorityDisplay={priorityError}
                    name={name}
                    disabled={readOnly}
                    displayName={displayName}
                    validate={() => { }}
                    onChange={(value, cancel) => this.handleEditableSubmit(name, options.find(({ display }) => display == value).server, cancel)}
                    helperComponent={(
                        <Select
                            name={name}
                            placeholderButtonLabel={'Select ' + displayName + ' ...'}
                            options={options}
                            value={val}
                            onChange={handleOptionsChange}
                        />
)}
                />
            ));
        };

        const renderSelectField = (name, displayName, value, error, readOnly, required, highlighted) => {
            let priorityError = null;
            if (error) {
                priorityError = (
                    <div
                        title={error}
                        style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: '#a94442' }}
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

            options = options.filter((rec) => (rec.value)).map(rec => {
                return {
                    ...rec,
                    label: rec.label || rec.value,
                    aliasValue: (rec.aliasId ? (options.filter((pair) => (rec.aliasId === pair.id)).length === 1 ? options.filter((pair) => (rec.aliasId === pair.id))[0].value : null) : null)
                };
            });

            if (options.length > 0 && selectedVal) {
                val = options.find((opt) => opt.value === selectedVal);
                if (!required) {
                    options.unshift({ value: '', label: value ? 'Select...' : '' });
                }
            }

            const handleOptionsChange = (option) => {
                ref.current.handleChange(option.value ? option.value : null);
                setTimeout(() => {
                    this.setState({});
                }, 1);
            };

            return renderFieldTemplate(name, displayName, value, error, readOnly, required, highlighted, null, ref, (
                <EditableBaseComponent
                    ref={ref}
                    value={value}
                    priorityDisplay={priorityError}
                    name={name}
                    disabled={readOnly}
                    displayName={displayName}
                    validate={() => { }}
                    onChange={(value, cancel) => this.handleEditableSubmit(name, value, cancel)}
                    onCancel={onCancel}
                    helperComponent={(
                        <Select
                            name={name}
                            isSearchable
                            placeholderButtonLabel={'Select ' + displayName + ' ...'}
                            options={options}
                            value={val}
                            onChange={handleOptionsChange}
                        />
)}
                />
            ));
        };

        const renderMultiSelectField = (name, displayName, value, error, readOnly, required, highlighted) => {
            let priorityError = null;
            if (error && !name.includes('affiliate')) {
                priorityError = (
                    <div
                        title={error}
                        style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: '#a94442' }}
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
            const filterKeys = Object.keys(this.state.flatRight).filter((key) => this.props.availsMapping.mappings.find((x) => x.javaVariableName === key).configEndpoint);
            const filters = filterKeys.map((key) => {
                if (this.state.flatRight[key] && this.props.selectValues[key]) {
                    const filt = (Array.isArray(this.state.flatRight[key]) ? this.state.flatRight[key] : [this.state.flatRight[key]]).map(val => {
                        const candidates = this.props.selectValues[key].filter(opt => opt.value === val);
                        return candidates.length ? candidates : null;
                    }).filter(x => x).flat();
                    return filt.length ? filt : null;
                }
            }).filter(x => x);//.filter(x => (Array.isArray(x) ? x.length : x));

            let filteredOptions = options;
            filters.map(filter => {
                const fieldName = filter[0].type + 'Id';
                const allowedOptions = filter.map(({ id }) => id);
                filteredOptions = filteredOptions.filter((option) => option[fieldName] ? (allowedOptions.indexOf(option[fieldName]) > -1) : true);
            });

            const allOptions = [
                {
                    label: 'Select All',
                    options: filteredOptions.filter((rec) => (rec.value)).map(rec => {
                        return {
                            ...rec,
                            label: rec.label || rec.value,
                            aliasValue: (rec.aliasId ? (options.filter((pair) => (rec.aliasId === pair.id)).length === 1 ? options.filter((pair) => (rec.aliasId === pair.id))[0].value : null) : null)
                        };
                    })
                }
            ];

            if (allOptions[0].options && allOptions[0].options.length > 0 && selectedVal && Array.isArray(selectedVal)) {
                val = selectedVal.map(v => allOptions[0].options.filter(opt => opt.value === v)).flat();
            }

            const onCancel = () => {
                selectedVal = cloneDeep(value);
                setTimeout(() => {
                    this.setState({});
                }, 1);
            };

            const handleOptionsChange = (selectedOptions) => {
                const selVal = selectedOptions.map(({ value }) => value);
                ref.current.handleChange(selVal ? selVal : null);
                setTimeout(() => {
                    this.setState({});
                }, 1);
            };

            return renderFieldTemplate(name, displayName, value, error, readOnly, required, highlighted, null, ref, (
                <EditableBaseComponent
                    ref={ref}
                    value={value}
                    priorityDisplay={priorityError}
                    name={name}
                    disabled={readOnly}
                    displayName={displayName}
                    validate={() => { }}
                    onChange={(value, cancel) => this.handleEditableSubmit(name, value, cancel)}
                    onCancel={onCancel}
                    helperComponent={(
                        <ReactMultiSelectCheckboxes
                            placeholderButtonLabel={'Select ' + displayName + ' ...'}
                            getDropdownButtonLabel={({ placeholderButtonLabel, value }) => {
                            if (value && value.length > 0) {
                                return (
                                    <div
                                        style={{ width: '100%' }}
                                    >
                                        <div
                                            style={{ maxWidth: '90%', float: 'left', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                                        >
                                            {value.map(({ value }) => value).join(', ')}
                                        </div>
                                        <div
                                            style={{ width: '10%', float: 'left', paddingLeft: '5px' }}
                                        >
                                            {' (' + value.length + ' selected)'}
                                        </div>
                                    </div>
                                );
                            }
                            return placeholderButtonLabel;
                        }}
                            options={allOptions}
                            value={val}
                            onChange={handleOptionsChange}
                        />
)}
                />
            ));
        };

        const renderTerritoryField = (name, displayName, value, errors, readOnly, required, highlighted) => {
            {/*let priorityError = null;
            if (error) {
                priorityError = <div title={error}
                    style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: '#a94442' }}>
                    {error}
                </div>;
                }*/}
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

            options = options.filter((rec) => (rec.value)).map(rec => {
                return {
                    ...rec,
                    label: rec.label || rec.value,
                    aliasValue: (rec.aliasId ? (options.filter((pair) => (rec.aliasId === pair.id)).length === 1 ? options.filter((pair) => (rec.aliasId === pair.id))[0].value : null) : null)
                };
            });

            const onCancel = () => {
                selectedVal = cloneDeep(value);
                setTimeout(() => {
                    this.setState({});
                }, 1);
            };

            const addTerritory = (option) => {
                const {territoryIndex, isEdit} = this.state;
                const item = {
                    ...option,
                    isValid: true,
                    id: isEdit ? territoryIndex : selectedVal.length,
                };
                 if(this.state.isEdit) {
                     selectedVal.splice(this.state.territoryIndex, 1, item);
                 } else {
                     selectedVal = selectedVal ? [...selectedVal, item] : [item];
                 }

                 ref.current.handleChange(option ? selectedVal: null);
                 // ??? - call set state that clean state inside timeout
                 setTimeout(() => {
                     this.setState({});
                 }, 1);

             };

            const deleteTerritory = (territory) => {
                const newArray = selectedVal && selectedVal.filter(e => e.id !== territory.id && e.country !== territory.country);
                ref.current.handleChange(newArray);
                setTimeout(() => {
                    this.setState({});
                }, 1);
            };

            const removeTerritoryNotOriginalFields = (list = []) => {
                const {mappings} = this.props.availsMapping || [];
                const originalFieldNames = mappings.filter(el => el.javaVariableName.startsWith('territory.'))
                    .map(mapping => mapping.javaVariableName.split('.')[1]);

                const formattedList = [];
                list.forEach(el => {
                    const territory = Object.assign({}, el);
                    Object.keys(territory).forEach(key => {
                        if(originalFieldNames.findIndex(name => name === key) < 0) {
                            delete territory[key];
                        }
                    });
                    formattedList.push(territory);
                });
                return formattedList;
            };

            const territories = removeTerritoryNotOriginalFields(selectedVal)
                .map(territory => {
                    const {vuContractId} = territory;
                    const mappedTerritory = Object.assign({}, territory);
                    if(Array.isArray(vuContractId) && vuContractId.length > 0) {
                        mappedTerritory.vuContractId = vuContractId.join(', ');
                    }
                    return mappedTerritory;
                });

            return renderFieldTemplate(name, displayName, value, errors, readOnly, required, highlighted, null, ref, (
                <EditableBaseComponent
                    ref={ref}
                    value={value}
                    originalFieldList={territories}
                    name={name}
                    disabled={readOnly}
                    isArrayOfObject={true}
                    validate={() => { }}
                    displayName={displayName}
                    onChange={(value, cancel) => this.handleEditableSubmit(name, value, cancel)}
                    onCancel={onCancel}
                    showError={false}
                    helperComponent={(
                        <TerritoryField
                            territory={territories}
                            name={name}
                            onRemoveClick={(territory) => deleteTerritory(territory)}
                            onAddClick={this.toggleAddRightTerritoryForm}
                            onTagClick={(i) => this.toggleRightTerritoryForm(i)}
                            renderChildren={() => (
                                <>
                                    <div style={{position: 'absolute', right: '10px'}}>
                                        <AddButton onClick={this.toggleAddRightTerritoryForm}>+</AddButton>
                                    </div>
                                    <RightTerritoryForm
                                        onSubmit={(e) => addTerritory(e)}
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
                      )}
                />

            ));
        };

        const renderAudioLanguageField = (name, displayName, value, errors, readOnly, required, highlighted) => {
            let ref;
            if (this.fields[name]) {
                ref = this.fields[name];

            } else {
                this.fields[name] = ref = React.createRef();
            }

            let options = [], audioTypeOptions = [];
            let selectedVal = ref.current ? ref.current.state.value : value;
            if (this.props.selectValues && this.props.selectValues['languageAudioTypes.language']) {
                options = this.props.selectValues['languageAudioTypes.language'];
            }
            if (this.props.selectValues && this.props.selectValues['languageAudioTypes.audioType']) {
                audioTypeOptions = this.props.selectValues['languageAudioTypes.audioType'];
            }

            options = options.filter((rec) => (rec.value)).map(rec => {
                return {
                    ...rec,
                    label: rec.label || rec.value,
                    aliasValue: (rec.aliasId ? (options.filter((pair) => (rec.aliasId === pair.id)).length === 1 ? options.filter((pair) => (rec.aliasId === pair.id))[0].value : null) : null)
                };
            });
            const onCancel = () => {
                selectedVal = cloneDeep(value);
                setTimeout(() => {
                    this.setState({});
                }, 1);
            };

            const addAudioLanguage = (option) => {
                const {audioLanguageIndex, isEdit} = this.state;
                const item = {
                    ...option,
                    isValid: true,
                    id: isEdit ? audioLanguageIndex : selectedVal.length,
                };
                if(this.state.isEdit) {
                    selectedVal.splice(this.state.audioLanguageIndex, 1, item);
                } else {
                    selectedVal = selectedVal ? [...selectedVal, item] : [item];
                }
                ref.current.handleChange(option ? selectedVal: null);
                // ??? - call set state that clean state inside timeout
                setTimeout(() => {
                    this.setState({});
                }, 1);

            };

            const deleteAudioLanguage = (audioLanguage) => {
                const newArray = selectedVal && selectedVal.filter(e => e.id !== audioLanguage.id && e.language !== audioLanguage.language);
                ref.current.handleChange(newArray);
                setTimeout(() => {
                    this.setState({});
                }, 1);
            };

            const removeAudioLanguageNotOriginalFields = (list = []) => {
                const {mappings} = this.props.availsMapping || [];
                const originalFieldNames = mappings.filter(el => el.javaVariableName.startsWith('languageAudioTypes.'))
                    .map(mapping => mapping.javaVariableName.split('.')[1]);

                const formattedList = [];
                list.forEach(el => {
                    const language = Object.assign({}, el);
                    Object.keys(language).forEach(key => {
                        if(originalFieldNames.findIndex(name => name === key) < 0) {
                            delete language[key];
                        }
                    });
                    formattedList.push(language);
                });
                return formattedList;
            };
            const languages = removeAudioLanguageNotOriginalFields(selectedVal)
                .map(language => {
                    return Object.assign({}, language);
                });
            const languagesWithLabel = options.reduce((acc, obj) => {
                let result = {};
                languages.forEach(lang => {
                    if(lang.language === obj.value) {
                        result.language = lang.language;
                        result.label = obj.label;
                        result.audioType = lang.audioType;
                        acc.push(result);
                    }
                });
                return acc;
            }, []);

            return renderFieldTemplate(name, displayName, value, errors, readOnly, required, highlighted, null, ref, (
                <EditableBaseComponent
                    ref={ref}
                    value={value}
                    originalFieldList={languagesWithLabel}
                    name={name}
                    disabled={readOnly}
                    isArrayOfObject={true}
                    validate={() => { }}
                    displayName={displayName}
                    onChange={(value, cancel) => this.handleEditableSubmit(name, value, cancel)}
                    onCancel={onCancel}
                    showError={false}
                    helperComponent={(
                        <AudioLanguageField
                            audioLanguages={languagesWithLabel}
                            name={name}
                            onRemoveClick={(language) => deleteAudioLanguage(language)}
                            onAddClick={this.toggleAddRightAudioLanguageForm}
                            //onTagClick={(i) => this.toggleRightAudioLanguageForm(i)} disabled since it causes issues with audio language list edit
                            renderChildren={() => (
                                <>
                                    <div style={{position: 'absolute', right: '10px'}}>
                                        <AddButton onClick={this.toggleAddRightAudioLanguageForm}>+</AddButton>
                                    </div>
                                    <RightAudioLanguageForm
                                        onSubmit={(e) => addAudioLanguage(e)}
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
                    )}
                />

            ));
        };

        const renderDatepickerField = (showTime, name, displayName, value, priorityError, isReadOnly, required, highlighted, isTimestamp) => {
            let ref;

            const {flatRight = {}, editedRight = {}} = this.state;
            const validate = (date) => {
                if (!date && required) {
                    return 'Mandatory Field. Date cannot be empty';
                }
                const rangeError = rangeValidation(name, displayName, date, flatRight);
                if (rangeError) return rangeError;
                return this.extraValidation(name, displayName, date, flatRight);
            };

            // Revert back to valid value in case of an error
            const revertChanges = () => {
                this.setState((prevState) => (
                    {
                        editedRight: {
                            ...prevState.editedRight,
                            [name]: prevState.flatRight[name],
                        },
                    })
                );
            };

            const valError = validate(value);
            const error = priorityError || valError;

            const props = {
                id: displayName,
                label: displayName,
                hideLabel: true, // TODO: Remove after RightDetails gets refactored/redesigned
                onChange: (date) => {
                    // Keep a separate state for edited values
                    this.setState((prevState) => ({
                        editedRight: {...prevState.editedRight, [name]: date}
                    }));
                },
                onConfirm: (date) => (
                    !valError && this.handleEditableSubmit(name, date, revertChanges) || revertChanges()
                ),
                defaultValue: value,
                value:  (
                    editedRight[name] !== undefined
                        ?  editedRight[name]
                        : value
                ),
                error,
                required,
                isReadOnly,
                isTimestamp,
                isWithInlineEdit: true,
                allowClear: !required
            };

            const component = showTime
                ? <NexusDateTimePicker {...props} />
                : <NexusDatePicker {...props} />;

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
                component,
            );
        };

        const renderFields = [];

        if (this.state.flatRight && this.props.availsMapping) {
            this.props.availsMapping.mappings.filter(({dataType}) => dataType).map((mapping) => {
                if (mapping.enableEdit) {
                    let error = null;
                    // TODO: write this from scratch
                    if (this.state.right && this.state.right.validationErrors) {
                        this.state.right.validationErrors.forEach(e => {
                            if (equalOrIncluded(mapping.javaVariableName, e.fieldName)) {
                                error = e.message;
                                if (e.sourceDetails) {
                                    if (e.sourceDetails.originalValue) error += ', original value:  \'' + e.sourceDetails.originalValue + '\'';
                                    if (e.sourceDetails.fileName) {
                                        error += ', in file ' + e.sourceDetails.fileName
                                            + ', row number ' + e.sourceDetails.rowId
                                            + ', column ' + e.sourceDetails.originalFieldName;
                                    }
                                }
                            }
                        });
                    }
                    const cannotUpdate = cannot('update', 'Avail', mapping.javaVariableName);
                    const readOnly = cannotUpdate || mapping.readOnly;

                    const {editedRight = {}, flatRight} = this.state;
                    const value = flatRight ? flatRight[mapping.javaVariableName] : '';
                    const valueV2 = editedRight[mapping.javaVariableName] || flatRight[mapping.javaVariableName];

                    const required = mapping.required;
                    let highlighted = false;
                    if (this.state.right && this.state.right.highlightedFields) {
                        highlighted = this.state.right.highlightedFields.indexOf(mapping.javaVariableName) > -1;
                    }

                    const {right = {}} = this.state;
                    const {validationErrors} = right || {};

                    switch (mapping.dataType) {
                        case 'string':
                            renderFields.push(renderTextField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required, highlighted));
                            break;
                        case 'integer': renderFields.push(renderIntegerField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required, highlighted));
                            break;
                        case 'year': renderFields.push(renderYearField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required, highlighted));
                            break;
                        case 'double': renderFields.push(renderDoubleField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required, highlighted));
                            break;
                        case 'select': renderFields.push(renderSelectField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required, highlighted));
                            break;
                        case 'multiselect':
                            if (mapping.javaVariableName === 'affiliate') {
                                renderFields.push(renderMultiSelectField(
                                    mapping.javaVariableName,
                                    mapping.displayName,
                                    this.state.affiliates,
                                    Array.isArray(validationErrors) && validationErrors.filter(el => el.fieldName && el.fieldName.includes('affiliate') && !el.fieldName.includes('affiliateExclude')),
                                    readOnly,
                                    required,
                                    highlighted
                                ));
                                break;
                            } else if (mapping.javaVariableName === 'affiliateExclude') {
                                renderFields.push(renderMultiSelectField(
                                    mapping.javaVariableName,
                                    mapping.displayName,
                                    this.state.affiliatesExclude,
                                    Array.isArray(validationErrors) && validationErrors.filter(el => el.fieldName && el.fieldName.includes('affiliateExclude')),
                                    readOnly,
                                    required,
                                    highlighted
                                ));
                                break;
                            }
                            renderFields.push(renderMultiSelectField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required, highlighted));
                            break;
                        case 'duration': renderFields.push(renderDurationField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required, highlighted));
                            break;
                        case 'time': renderFields.push(renderTimeField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required, highlighted));
                             break;
                        case DATETIME_FIELDS.REGIONAL_MIDNIGHT: renderFields.push(renderDatepickerField(false, mapping.javaVariableName, mapping.displayName, valueV2, error, readOnly, required, highlighted, false));
                             break;
                        case DATETIME_FIELDS.TIMESTAMP: renderFields.push(renderDatepickerField(true, mapping.javaVariableName, mapping.displayName, valueV2, error, readOnly, required, highlighted, true));
                            break;
                        case DATETIME_FIELDS.BUSINESS_DATETIME: renderFields.push(renderDatepickerField(true, mapping.javaVariableName, mapping.displayName, valueV2, error, readOnly, required, highlighted, false));
                            break;
                        case 'boolean': renderFields.push(renderBooleanField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required, highlighted));
                            break;
                        case 'territoryType': renderFields.push(
                             renderTerritoryField(
                                 mapping.javaVariableName,
                                 mapping.displayName,
                                 this.state.territory,
                                 Array.isArray(validationErrors) && validationErrors.filter(el => el.fieldName && el.fieldName.includes('territory')),
                                 readOnly,
                                 required,
                                 highlighted
                            ));
                            break;
                        case 'audioLanguageType': renderFields.push(
                            renderAudioLanguageField(
                                mapping.javaVariableName,
                                mapping.displayName,
                                this.state.audioLanguage,
                                Array.isArray(validationErrors) && validationErrors.filter(el => el.fieldName && el.fieldName.includes('languageAudioTypes')),
                                readOnly,
                                required,
                                highlighted
                            ));
                            break;
                        default:
                            console.warn('Unsupported DataType: ' + mapping.dataType + ' for field name: ' + mapping.displayName); // eslint-disable-line
                    }
                }
            });
        }

        return (
            <div style={{ position: 'relative' }}>
                <ManualRightsEntryDOPConnector />
                <BlockUi tag="div" blocking={this.props.blocking}>
                    {
                        this.state.errorMessage && (
                        <div id='right-edit-error' className='d-inline-flex justify-content-center w-100 position-absolute alert-danger' style={{ top: '-20px', zIndex: '1000', height: '25px' }}>
                            <Label id='right-edit-error-message'>
                                {this.state.errorMessage}
                            </Label>
                        </div>
                      )
}
                    <div className="nx-stylish row my-3 mx-5">
                        <div className="nx-stylish list-group col-12">
                            <BackNavigationByUrl
                                title="Right Details"
                                onNavigationClick={this.navigateToPreviousPreview}
                            />
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
};

RightDetails.defaultProps = {
    selectValues: null,
    availsMapping: null,
    match: {},
    location: {},
    blocking: null,
    history: null,
};

RightDetails.contextTypes = {
    router: PropTypes.object,
};

export default connect(mapStateToProps)(RightDetails);
