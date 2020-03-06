import React, {Component} from 'react';
import t from 'prop-types';
import {connect} from 'react-redux';
import {Button} from 'reactstrap';
import Select from 'react-select';
import RangeDuration from './RangeDuration';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import {AvField, AvForm} from 'availity-reactstrap-validation';
import moment from 'moment';
import NexusDateTimeWindowPicker from '../../ui-elements/nexus-date-and-time-elements/nexus-date-time-window-picker/NexusDateTimeWindowPicker';


const mapStateToProps = state => {
    return {
        selectValues: state.root.selectValues
    };
};

class SelectableInput extends Component {

    static propTypes = {
        selectValues: t.object,
        currentCriteria: t.object,

        id: t.string,
        saveText: t.string,
        placeholder: t.string,

        displayName: t.string,
        dataType: t.string,
        value: t.object,
        selected: t.object,
        disabled: t.bool,

        options: t.array,

        onSelect: t.func,
        onChange: t.func,
        onSave: t.func,

    };

    constructor(props) {
        super(props);
        this.state = {
            invalid: false,
            selectableInput: ''
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleOptionsChange = this.handleOptionsChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleInvalid = this.handleInvalid.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.isAnyValueSpecified = this.isAnyValueSpecified.bind(this);
        this.refInput = React.createRef();
        this.refDatePicker = React.createRef();
        this.refDuration = React.createRef();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.displayName !== this.props.displayName) {
            this.setState({invalid: false});
        }
    }

    _handleKeyPress = (e) => {
        if (e.key === 'Enter' && ! this.state.invalid) {
            this.props.onSave();
        }
    };

    handleInputChange(event, val) {
        const target = event.target;
        const value = val ? val : target.type === 'checkbox' ? target.checked : target.value;
        this.props.onChange({...this.props.value, value: value});
    }

    handleChange(key, value) {
        if(value) {
            if (this.props.dataType === 'date') {
                value = moment(value).startOf('day').format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
            if (this.props.dataType === 'localdate') {
                value = moment(value).startOf('day').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
            }
        }
        this.props.onChange({...this.props.value, [key]: value});
    }

    handleOptionsChange(selectedOptions) {
        const {options = []} = this.props.value || {};
        const {selectableInput} = this.state;
        let filteredOptions = selectedOptions.filter(option => this.filterOption(option, selectableInput, options));
        this.props.onChange({...this.props.value, options: filteredOptions});
    }

    filterOption = (option, inputValue, previousOptions) => {
        const { label } = option;
        let presentInPreviousSelection = false;
        if(previousOptions) {
            presentInPreviousSelection = previousOptions.some(e => e.label === label);
        }

        return label.toLowerCase().includes(inputValue.toLowerCase()) || presentInPreviousSelection;
    };

    handleInvalid(value) {
        this.setState({invalid: value});
    }

    handleSelect(option) {
        this.props.onSelect(option);
        this.autoFocus();
    }

    autoFocus() {
        setTimeout(() => {
            if (this.refInput.current) {
                this.refInput.current.focus();
            } else if (this.refDatePicker.current) {
                this.refDatePicker.current.focus();
            } else if (this.refDuration.current) {
                this.refDuration.current.focus();
            }
        }, 10);
    }

    isAnyValueSpecified = () => {
        const {value = {}} = this.props;
        const {from = '', to = '', options} = value || {};

        if (moment(from).isAfter(to)) return false;

        return from || to || (value.value  && value.value.trim() || (options && options.length));
    };

    render() {
        const renderTextField = (name, displayName) => {
            return (
                <div key={name} style={{maxWidth: '300px', minWidth: '300px', flex: '1 1 300px', margin: '0 10px'}}>
                    <input
                        type="text"
                        className="form-control"
                        id={this.props.id + '-text'}
                        placeholder={'Enter ' + displayName}
                        name={name.value}
                        ref={this.refInput}
                        value={this.props.value && this.props.value.value ? this.props.value.value : ''}
                        onChange={this.handleInputChange}
                        onKeyPress={this._handleKeyPress}
                    />
                </div>
);
        };

        const innerValidate = (val, ctx, input, cb) => {
            const isValid = input.props.validate.pattern.value.test(val);
            if(this.state.invalid === isValid) {
                this.setState({invalid: !isValid});
            }
            cb(isValid);
        };

        const renderIntegerField = (name, displayName) => {
            return (
                <div key={name.value} style={{maxWidth: '300px', minWidth: '300px', flex: '1 1 300px', margin: '0 10px'}}>
                    <AvForm>
                        <AvField
                            id={this.props.id + '-text'}
                            placeholder={'Enter ' + displayName}
                            name={name.value}
                            value={this.props.value && this.props.value.value ? this.props.value.value : ''}
                            onChange={this.handleInputChange}
                            onKeyPress={this._handleKeyPress}
                            type="text"
                            validate={{async: innerValidate, pattern:{value: /^\d+$/, errorMessage: 'Please enter a valid integer'}}}
                        />
                    </AvForm>
                </div>
);
        };

        const renderYearField = (name, displayName) => {
            return (
                <div key={name.value} style={{maxWidth: '300px', minWidth: '300px', flex: '1 1 300px', margin: '0 10px'}}>
                    <AvForm>
                        <AvField
                            id={this.props.id + '-text'}
                            placeholder={'Enter ' + displayName}
                            name={name.value}
                            value={this.props.value && this.props.value.value ? this.props.value.value : ''}
                            onChange={this.handleInputChange}
                            onKeyPress={this._handleKeyPress}
                            type="text"
                            validate={{async: innerValidate, pattern:{value: /^\d{4}$/, errorMessage: 'Please enter a valid year (4 digits)'}}}
                        />
                    </AvForm>
                </div>
);
        };

        const renderDoubleField = (name, displayName) => {
            return (
                <div key={name.value} style={{maxWidth: '300px', minWidth: '300px', flex: '1 1 300px', margin: '0 10px'}}>
                    <AvForm>
                        <AvField
                            id={this.props.id + '-text'}
                            placeholder={'Enter ' + displayName}
                            name={name.value}
                            value={this.props.value && this.props.value.value ? this.props.value.value : ''}
                            onChange={(e, val) => this.handleInputChange(e, val.replace(',','.'))}
                            onKeyPress={this._handleKeyPress}
                            type="text"
                            validate={{async: innerValidate, pattern:{value: /^\d*(\d[.,]|[.,]\d)?\d*$/, errorMessage: 'Please enter a valid number'}}}
                        />
                    </AvForm>
                </div>
);
        };

        const renderTimeField = (name, displayName) => {
            return (
                <div key={name.value} style={{maxWidth: '300px', minWidth: '300px', flex: '1 1 300px', margin: '0 10px'}}>
                    <AvForm>
                        <AvField
                            id={this.props.id + '-text'}
                            placeholder={'Enter ' + displayName}
                            name={name.value}
                            value={this.props.value && this.props.value.value ? this.props.value.value : ''}
                            onChange={this.handleInputChange}
                            onKeyPress={this._handleKeyPress}
                            type="text"
                            validate={{async: innerValidate, pattern: {value: /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/}}}
                            errorMessage="Please enter a valid time! (00:00:00 - 23:59:59)"
                        />
                    </AvForm>
                </div>
);
        };

        const renderBooleanField = (name, displayName) => {
            return (
                <div key={name.value} style={{maxWidth: '300px', minWidth: '300px', flex: '1 1 300px', margin: '0 10px'}}>
                    <select
                        className="form-control"
                        id={this.props.id + '-boolean'}
                        name={name.value}
                        placeholder={'Enter ' + displayName}
                        value={this.props.value && this.props.value.value ? this.props.value.value : ''}
                        onChange={this.handleInputChange}
                    >
                        <option value="">None selected</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>
);
        };

        const renderRangeDurationField = (name, displayName) => {
            return (
                <RangeDuration
                    key={name.value}
                    id={this.props.id + '-duration'}
                    ref={this.refDuration}
                    hideLabel={true}
                    displayName={displayName}
                    value={{from: this.props.value.from !== undefined ? this.props.value.from : '', to: this.props.value.to !== undefined ? this.props.value.to : ''}}
                    onFromDurationChange={(value) => this.handleChange('from', value)}
                    onToDurationChange={(value) => this.handleChange('to', value)}
                    onInvalid={this.handleInvalid}
                    handleKeyPress={this._handleKeyPress}
                />
);
        };

        const renderRangeDatepicker = (selected, displayName, showTime) => {
            const {value, id, dataType, onChange} = this.props;
            let {
                from = '',
                to = ''
            } = value || {};

            from = dataType === 'localdate' ? from.slice(0, -1) : from;
            to = dataType === 'localdate' ? to.slice(0, -1) : to;

            return (
                <NexusDateTimeWindowPicker
                    name={displayName}
                    onChange={(timeWindow) => {
                        const {
                            startDate: from = '',
                            endDate: to = ''
                        } = timeWindow || {};
                        onChange({...value, from, to});
                    }}
                    isUsingTime={showTime}
                    isTimestamp={true}
                    startDateTimePickerProps={{
                        id: `${id}-datepicker-start`,
                        defaultValue: from,
                        label: 'From',
                    }}
                    endDateTimePickerProps={{
                        id: `${id}-datepicker-end`,
                        defaultValue: to,
                        label: 'To'
                    }}
                />
            );
        };

        const renderSelect = (name, displayName) => {
            let options = [];
            if(this.props.selected && this.props.selectValues && this.props.selectValues[this.props.selected.field]){
                options  = this.props.selectValues[this.props.selected.field];
            }

            let filters = Object.keys(this.props.currentCriteria).map((key) => this.props.currentCriteria[key]).filter((filter) => filter && filter.options);
            let filteredOptions = options;

            filters.forEach(filter => {
                const fieldName = filter.name + 'Id';
                const allowedOptions = filter.options.map(({id}) => id);
                filteredOptions = filteredOptions.filter((option) => option[fieldName] ? (allowedOptions.indexOf(option[fieldName]) > -1) : true);
            });

            const allOptions = [
                {
                    label: 'Select All',
                    options: filteredOptions.filter((rec) => (rec.value)).map(rec => { return {...rec,
                        label: rec.label || rec.value,
                        aliasValue:(rec.aliasId ? options.filter((pair) => (rec.aliasId === pair.id))[0].value : null)};})
                }
            ];

            return (
                <div
                    id={this.props.id + '-select'}
                    key={name.value}
                    style={{maxWidth: '300px', minWidth: '300px', flex: '1 1 300px', margin: '0 10px'}}
                    className="react-select-container"
                >
                    <ReactMultiSelectCheckboxes
                        placeholderButtonLabel={'Select ' + displayName + ' ...'}
                        getDropdownButtonLabel={({placeholderButtonLabel, value}) => {
                            if(value && value.length > 0){
                                return (
                                    <div
                                        style={{width:'90%'}}
                                    >
                                        <div
                                            style={{maxWidth:'calc(100% - 90px)', float:'left', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace:'nowrap'}}
                                        >
                                            {value.map(({value}) => value).join(', ')}
                                        </div>
                                        <div
                                            style={{width:'90px', float:'left', paddingLeft:'5px'}}
                                        >
                                            {' (' + value.length + ' selected)'}
                                        </div>
                                    </div>
                                );
                            }
                            return placeholderButtonLabel;
                        }}
                        options={allOptions}
                        value={this.props.value.options || []}
                        onChange={this.handleOptionsChange}
                        onInputChange={(selectableInput, event) => {
                            //The 'set-value' action, set selectableInput to empty when user click on SelectAll checkbox
                            if (event.action !== 'set-value') {
                                this.setState({selectableInput});
                            }
                        }}
                        filterOption={this.filterOption}
                    />
                </div>
            );
        };

        const renderSelectedInput = () => {
            const selected = this.props.selected;
            const displayName = this.props.displayName;

            switch (this.props.dataType) {
                case 'string' : return renderTextField(selected, displayName);
                case 'integer' : return renderIntegerField(selected, displayName);
                case 'year' : return renderYearField(selected, displayName);
                case 'double' : return renderDoubleField(selected, displayName);
                case 'multiselect' : return renderSelect(selected, displayName);
                case 'duration' : return renderRangeDurationField(selected, displayName);
                case 'time' : return renderTimeField(selected, displayName);
                case 'date' : return renderRangeDatepicker(selected, displayName, false);
                case 'datetime' : return renderRangeDatepicker(selected, displayName, true);
                case 'localdate' : return renderRangeDatepicker(selected, displayName, true);
                case 'boolean' : return renderBooleanField(selected, displayName);
                default:
                    console.warn('Unsupported DataType: ' + this.props.dataType + ' for field name: ' + displayName);
            }

        };

        return (
            <div style={{display: 'grid', gridTemplateColumns: '1fr 3fr 2fr', gridGap: '5px', alignItems: 'center'}}>
                <div style={{margin: '0 0 16px'}}>
                    <Select
                        id={this.props.id + '-select'}
                        onChange={this.handleSelect}
                        value={this.props.selected}
                        placeholder={this.props.placeholder}
                        options={this.props.options}
                    > 
                    </Select>
                </div>
                { this.props.selected && (
                <div style={{margin: '0 2px 16px'}}>
                    {renderSelectedInput()}
                </div>
              )}
                { this.props.selected && (
                <div style={{margin: '0 0 16px'}}>
                    <Button
                        outline
                        color="secondary"
                        id={this.props.id + '-add-btn'}
                        onClick={this.props.onSave}
                        disabled={this.state.invalid || !this.isAnyValueSpecified()}
                        style={{width: '80px'}}
                    >{this.props.saveText || 'add' }
                    </Button>
                </div>
              )}
                {   this.props.dataType === 'duration' && (
                    <span
                        title={'* format: PnYnMnDTnHnMnS. \neg. P3Y6M4DT12H30M5S (three years, six months, four days, twelve hours, thirty minutes, and five seconds)'}
                        style={{color: 'grey'}}
                    >&nbsp;&nbsp;<i className="far fa-question-circle"></i>
                    </span>
                  )}
            </div>
        );
    }
}

export default connect(mapStateToProps, null)(SelectableInput);
