import React, {Component} from 'react';
import t from 'prop-types';
import {connect} from 'react-redux';
import {Button} from 'reactstrap';
import Select from 'react-select';
import RangeDatapicker from './RangeDatapicker';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';


const mapStateToProps = state => {
    return {
        selectValues: state.root.selectValues
    };
};

class SelectableInput extends Component {

    static propTypes = {
        selectValues: t.object,

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
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleDateInvalid = this.handleDateInvalid.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.isAnyValueSpecified = this.isAnyValueSpecified.bind(this);
        this.refInput = React.createRef();
        this.refDatePicker = React.createRef();
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

    handleDateChange(key, value) {
        this.props.onChange({...this.props.value, [key]: value});
    }

    handleOptionsChange(selectedOptions) {
        this.props.onChange({...this.props.value, options: selectedOptions});
    }

    handleDateInvalid(value) {
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
                    name={name}
                    ref={this.refInput}
                    value={this.props.value && this.props.value.value ? this.props.value.value : '' }
                    onChange={this.handleInputChange}
                    onKeyPress={this._handleKeyPress}/>
            </div>);
        };

        const renderRangeDatepicker = (name, displayName) => {
            return (
                <RangeDatapicker
                    key={name}
                    id={this.props.id + '-datepicker'}
                    ref={this.refDatePicker}
                    hideLabel={true}
                    displayName={displayName}
                    value={{from: this.props.value.from !== undefined ? this.props.value.from : '', to: this.props.value.to !== undefined ? this.props.value.to : ''}}
                    onFromDateChange={(value) => this.handleDateChange('from', value)}
                    onToDateChange={(value) => this.handleDateChange('to', value)}
                    onInvalid={this.handleDateInvalid}
                    handleKeyPress={this._handleKeyPress}
            />);
        };

        const renderSelect = (name, displayName) => {
            let options = [];
            if(this.props.selected && this .props.selectValues && this.props.selectValues[this.props.selected.value]){
                options  = this.props.selectValues[this.props.selected.value];
            }

            const allOptions = [
                {
                    label: 'Select All',
                    options: options.filter((rec) => (rec.value)).map(rec => { return {...rec, label: rec.value};})
                }
            ];

            return (
                <div
                    id={this.props.id + '-select'}
                    key={name}
                    style={{maxWidth: '300px', minWidth: '300px', flex: '1 1 300px', margin: '0 10px'}}
                    className="react-select-container">
                    <ReactMultiSelectCheckboxes
                        placeholderButtonLabel={'Select ' + displayName + ' ...'}
                        options={allOptions}
                        value = {this.props.value.options}
                        onChange={this.handleOptionsChange}
                    />
                </div>
            );
        };

        const renderSelectedInput = () => {
            const selected = this.props.selected;
            const displayName = this.props.displayName;

            switch (this.props.dataType) {
                case 'text' :
                    return renderTextField(selected, displayName);
                case 'number' :
                    return renderTextField(selected, displayName);
                case 'year' :
                    return renderTextField(selected, displayName);
                case 'date' :
                    return renderRangeDatepicker(selected, displayName);
                case 'boolean' :
                    return renderTextField(selected, displayName);
                case 'select' :
                    return renderSelect(selected, displayName);
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
