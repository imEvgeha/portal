import React, { Component } from 'react';
import { Button } from 'reactstrap';
import t from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import {isObject} from '../../../util/Common';
import Popup from 'reactjs-popup';
import { TerritoryTooltip, TerritoryTag } from '../../../containers/avail/custom-form-components/CustomFormComponents';

class EditableBaseComponent extends Component {

    static propTypes = {
        helperComponent: t.object,
        validate: t.func,
        value: t.oneOfType([t.string, t.array, t.number]),
        displayName: t.string,
        disabled: t.bool,
        onChange: t.func,
        priorityDisplay: t.any,
        showError: t.bool,
        isArrayOfObject: t.bool,
        onCancel: t.func,
    };

    static defaultProps = {
        value: null,
        showError: true,
        isArrayOfObject: false,
        onCancel: null,
    }

    constructor(props) {
        super(props);

        this.state = {
            value: cloneDeep(props.value),
            showStateValue: false,
            editable: false,
            errorMessage: '',
            submitStatus: false,
            arrayOfValue: []
        };

        this.handleShowHelperComponent = this.handleShowHelperComponent.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCancelHelperComponent = this.handleCancelHelperComponent.bind(this);
        this.handleInvalid = this.handleInvalid.bind(this);
        this.submit = this.submit.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value != this.props.value) {
            // dirty fix for territory field
            if (this.props.displayName === 'Territory' && Array.isArray(this.props.value) && this.props.value.length > 0 && this.props.value[0].country) {
                return;
            }
            this.setState({
                showStateValue: false,
                value: cloneDeep(this.props.value) ? this.props.value : null,
            });
        }

    }

    handleShowHelperComponent(e) {
        e.preventDefault();
        if (!this.props.disabled) {
            this.setState(state => ({
                editable: true,
                value: state.value,
            }));
        }
    }
    handleCancelHelperComponent(e) {
        e.preventDefault();
        this.cancel();
    }

    cancel() {
        this.setState({
            value: cloneDeep(this.props.value),
            showStateValue: false,
            editable: false,
            errorMessage: ''
        });
        if(this.props.onCancel){
            this.props.onCancel();
        }
    }

    handleChange(val) {
        this.setState({ value: cloneDeep(val), submitStatus: false, errorMessage: '' });
    }

    handleInvalid(val, error) {
        if (error) {
            this.setState({ value: cloneDeep(val), errorMessage: error, submitStatus: true });
        }
    }

    submit(val) {
        const validationError = this.props.validate(val);
        if (validationError !== undefined) {
            this.setState({
                errorMessage: validationError
            });
        } else {
            this.setState({
                editable: false,
                showStateValue: true
            });
            this.props.onChange(cloneDeep(val), this.cancel);
        }
    }

    setEditable(val) {
        this.setState({
            editable: cloneDeep(val),
        });
    }

    render() {
        const {displayName} = this.props;
        const displayFunc = (value) => {
            const getComplexFieldValue = (name, element) => {
                switch (name) {
                    case 'Territory':
                        return element.country;
                    case 'CastCrew':
                        return `${element.displayName || ''}(${element.personType}`;
                     default:
                    return element.value || element[Object.keys(element)[0]];
                }
            };
            const setSimpleArrayWithError = arr => {
                const updatedArr = arr.map((el, index, array) => {
                    const value = isObject(el) ? getComplexFieldValue(displayName, el) : el;
                    const style = isObject(el) && el.hasOwnProperty('isValid') && !el.isValid ? {color: 'rgb(169, 68, 66)', paddingRight: '4px'} : {color: '#1a1a1a', paddingRight: '4px'};
                    return (
                        <span key={index} style={style}>{`${value}${index < array.length - 1 ? ', ' : ''}`}</span>
                    );
                });
                return updatedArr;
            };

            return (<span
                onClick={this.handleShowHelperComponent}
                style={{ width: '100%', textOverflow: 'ellipsis', overflow: 'hidden', padding: '5px', minHeight: '26px', display: 'flex', flexWrap: 'wrap' }}
                className={this.props.disabled ? 'disabled' : ''}>
                {Array.isArray(value) ? value.length > 0 ? this.props.isArrayOfObject ? value.map((e, i) => (
                    <Popup
                        key={i}
                        trigger={
                            <TerritoryTag isValid={e.isValid} isCreate>{e.country || e.name}</TerritoryTag>
                        }
                        position="top center"
                        on="hover"
                    >
                        {TerritoryTooltip(e)}
                    </Popup>
                )) : setSimpleArrayWithError(value) : '' : value}
            </span>);
        };

        const unfocusedRender = () => {
            if (this.props.priorityDisplay) {
                return displayFunc(this.props.priorityDisplay);
            } else {
                if (this.state.showStateValue) {
                    return displayFunc(this.state.value);
                } else {
                    if (this.props.value && (!Array.isArray(this.props.value) || (Array.isArray(this.props.value) && this.props.value.length > 0))) {
                        return displayFunc(this.props.value);
                    } else {
                        return (
                            <span
                                className="displayDate"
                                style={{ color: '#808080', cursor: 'pointer', width: '100%' }}
                                onClick={this.handleShowHelperComponent}>
                                {this.props.disabled ? '' : 'Enter ' + this.props.displayName}
                            </span>
                        );
                    }
                }
            }
        };

        return (
            <div className="editable-container">
                {
                    this.state.editable ?
                        <div style={{ width: '100%' }}>
                            <div className="dPicker" style={{ marginBottom: '5px', minWidth: '500px', width: '90%' }}>
                                {this.props.helperComponent}
                            </div>
                            <div style={{ float: 'left', paddingLeft: '10px' }}>
                                <Button
                                    className="dPButton"
                                    disabled={this.state.submitStatus}
                                    onClick={() => this.submit(this.state.value)}
                                    color="success"><i className="fa fa-check"></i>
                                </Button>
                                <Button
                                    className="dPButton"
                                    onClick={this.handleCancelHelperComponent}
                                    color="danger"><i className="fa fa-times"></i>
                                </Button>
                            </div>
                            {
                                this.props.showError && this.state.errorMessage &&
                                <small className={'text-danger m-2'} style={{ float: 'left', width: '100%' }}>
                                    {this.state.errorMessage}
                                </small>
                            }
                        </div>
                        :
                        unfocusedRender()
                }
            </div>
        );
    }
}

export default EditableBaseComponent;
