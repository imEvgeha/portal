import React, {Component} from 'react';
import t from 'prop-types';
import {connect} from 'react-redux';
import {Button} from 'reactstrap';
import Select from 'react-select';
import RangeDatapicker from './RangeDatapicker';
import RangeDuration from './RangeDuration';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import ISO6391 from 'iso-639-1';
import {AvField, AvForm} from 'availity-reactstrap-validation';


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

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.props.onChange({...this.props.value, value: value});
    }

    handleChange(key, value) {
        if(value) {
            if (this.props.dataType === 'date') {
                value = value.startOf('day').format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
            if (this.props.dataType === 'localdate') {
                value = value.format('YYYY-MM-DD[T]HH:mm:ss.SSS');
            }
        }

        this.props.onChange({...this.props.value, [key]: value});
    }

    handleOptionsChange(selectedOptions) {
        this.props.onChange({...this.props.value, options: selectedOptions});
    }

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
        const value = this.props.value;
        return value.from || value.to || (value.value  && value.value.trim() || (value.options && value.options.length > 0));
    };

    render() {
        const renderTextField = (name, displayName) => {
            return (<div key={name} style={{maxWidth: '300px', minWidth: '300px', flex: '1 1 300px', margin: '0 10px'}}>
                <input type="text" className="form-control"
                    id={this.props.id + '-text'}
                    placeholder={'Enter ' + displayName}
                    name={name.value}
                    ref={this.refInput}
                    value={this.props.value && this.props.value.value ? this.props.value.value : '' }
                    onChange={this.handleInputChange}
                    onKeyPress={this._handleKeyPress}/>
            </div>);
        };

        const renderNumberField = (name, displayName) => {
            return (<div key={name.value} style={{maxWidth: '300px', minWidth: '300px', flex: '1 1 300px', margin: '0 10px'}}>
                <AvForm>
                    <AvField
                        id={this.props.id + '-text'}
                        placeholder={'Enter ' + displayName}
                        name={name.value}
                        value={this.props.value && this.props.value.value ? this.props.value.value : '' }
                        onChange={this.handleInputChange}
                        onKeyPress={this._handleKeyPress}
                        type="text"
                        validate={{number: true}}
                        errorMessage="Please enter a valid number!"
                    />
                </AvForm>
            </div>);
        };

        const renderTimeField = (name, displayName) => {
            return (<div key={name.value} style={{maxWidth: '300px', minWidth: '300px', flex: '1 1 300px', margin: '0 10px'}}>
                <AvForm>
                    <AvField
                        id={this.props.id + '-text'}
                        placeholder={'Enter ' + displayName}
                        name={name.value}
                        value={this.props.value && this.props.value.value ? this.props.value.value : '' }
                        onChange={this.handleInputChange}
                        onKeyPress={this._handleKeyPress}
                        type="text"
                        validate={{pattern: {value: /^\d{2,3}:[0-5]\d:[0-5]\d$/}}}
                        errorMessage="Please enter a valid number!"
                    />
                </AvForm>
            </div>);
        };

        const renderBooleanField = (name, displayName) => {
            return (<div key={name.value} style={{maxWidth: '300px', minWidth: '300px', flex: '1 1 300px', margin: '0 10px'}}>
                <select className="form-control"
                        id={this.props.id + '-boolean'}
                        name={name.value}
                        placeholder={'Enter ' + displayName}
                        value={this.props.value && this.props.value.value ? this.props.value.value : '' }
                        onChange={this.handleInputChange}>
                    <option value="">None selected</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            </div>);
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
                />);
        };

        const renderRangeDatepicker = (name, displayName) => {
            return (
                <RangeDatapicker
                    key={name.value}
                    id={this.props.id + '-datepicker'}
                    ref={this.refDatePicker}
                    hideLabel={true}
                    displayName={displayName}
                    value={{from: this.props.value.from !== undefined ? this.props.value.from : '', to: this.props.value.to !== undefined ? this.props.value.to : ''}}
                    onFromDateChange={(value) => this.handleChange('from', value)}
                    onToDateChange={(value) => this.handleChange('to', value)}
                    onInvalid={this.handleInvalid}
                    handleKeyPress={this._handleKeyPress}
            />);
        };

        const renderSelect = (name, displayName, type) => {
            let options = [];
            if(this.props.selected && this.props.selectValues && this.props.selectValues[this.props.selected.value]){
                options  = this.props.selectValues[this.props.selected.value];
            }

            if(type === 'multilanguage'){
                options = ISO6391.getAllCodes().map(code => {return {value:code, label:ISO6391.getName(code)};});
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
                    className="react-select-container">
                    <ReactMultiSelectCheckboxes
                        placeholderButtonLabel={'Select ' + displayName + ' ...'}
                        options={allOptions}
                        value = {this.props.value.options || []}
                        onChange={this.handleOptionsChange}
                    />
                </div>
            );
        };

        const renderSelectedInput = () => {
            const selected = this.props.selected;
            const displayName = this.props.displayName;

            switch (this.props.dataType) {
                case 'string' : return renderTextField(selected, displayName);
                case 'integer' : return renderNumberField(selected, displayName);
                case 'double' : return renderNumberField(selected, displayName);
                case 'multiselect' : return renderSelect(selected, displayName, this.props.dataType);
                case 'multilanguage' : return renderSelect(selected, displayName, this.props.dataType);
                case 'duration' : return renderRangeDurationField(selected, displayName);
                case 'time' : return renderTimeField(selected, displayName);
                case 'date' : return renderRangeDatepicker(selected, displayName);
                case 'localdate' : return renderRangeDatepicker(selected, displayName);
                case 'boolean' : return renderBooleanField(selected, displayName);
                default:
                    console.warn('Unsupported DataType: ' + this.props.dataType + ' for field name: ' + displayName);
            }

        };

        return (
            <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                <div style={{width: '250px', margin: '0 0 16px'}}>
                    <Select
                        id={this.props.id + '-select'}
                        onChange={this.handleSelect}
                        value={this.props.selected}
                        placeholder={this.props.placeholder}
                        options={this.props.options}
                    > </Select>
                </div>
                { this.props.selected &&
                <div style={{margin: '0 2px 16px'}}>
                    {renderSelectedInput()}
                </div>
                }
                { this.props.selected &&
                <div style={{margin: '0 0 16px'}}>
                    <Button outline color="secondary"
                            id={this.props.id + '-add-btn'}
                            onClick={this.props.onSave}
                            disabled={this.state.invalid || !this.isAnyValueSpecified()}
                            style={{width: '80px'}}>{this.props.saveText || 'add' }</Button>
                </div>
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, null)(SelectableInput);
