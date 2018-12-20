import React, {Component} from 'react';
import t from 'prop-types';
import {Button} from 'reactstrap';
import Select from 'react-select';
import RangeDatapicker from './RangeDatapicker';

export default class SelectableInput extends Component {

    static propTypes = {
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
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleDateInvalid = this.handleDateInvalid.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.refInput = React.createRef();
        this.refDatePicker = React.createRef();
    }

    _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
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

    render() {
        const renderTextField = (name, displayName) => {
            return (<div key={name} style={{maxWidth: '300px', minWidth: '300px', flex: '1 1 300px', margin: '0 10px'}}>
                <input type="text" className="form-control"
                    id={this.props.id + '-text'}
                    placeholder={'Enter ' + displayName}
                    name={name}
                    ref={this.refInput}
                    value={this.props.value && this.props.value.value}
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
                    value={this.props.value ? this.props.value : {from: null, to: null}}
                    onFromDateChange={(value) => this.handleDateChange('from', value)}
                    onToDateChange={(value) => this.handleDateChange('to', value)}
                    onInvalid={this.handleDateInvalid}
                    handleKeyPress={this._handleKeyPress}
            />);
        };

        const renderSelectedInput = () => {
            const selected = this.props.selected;
            const displayName = this.props.displayName;
            if (this.props.dataType === 'date') {
                return renderRangeDatepicker(selected, displayName);
            } else {
                return renderTextField(selected, displayName);
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
                            disabled={this.state.invalid}
                            style={{width: '80px'}}>{this.props.saveText || 'add' }</Button>
                </div>
                }
            </div>
        );
    }
}
