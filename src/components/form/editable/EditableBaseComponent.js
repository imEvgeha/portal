import React, { Component } from 'react';
import { Button } from 'reactstrap';
import t from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';

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
            this.setState({
                showStateValue: false,
                value: cloneDeep(this.props.value) ? this.props.value : null,
            });
        }

    }

    handleShowHelperComponent(e) {
        e.preventDefault();
        if (!this.props.disabled) {
            this.setState({
                editable: true,
                value: this.state.value ? this.state.value : null,
            });
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
        const displayFunc = (value) => {
            return (<span
                onClick={this.handleShowHelperComponent}
                style={{ width: '100%', textOverflow: 'ellipsis', overflow: 'hidden', padding: '5px', minHeight: '26px' }}
                className={this.props.disabled ? 'disabled' : ''}>
                {Array.isArray(value) ? value.length > 0 ? this.props.isArrayOfObject ? value.map((e, i) => (
                    <Popup
                        key={i}
                        trigger={
                            <TerritoryTag isCreate>{e.country}</TerritoryTag>
                        }
                        position="top center"
                        on="hover"
                    >
                        {TerritoryTooltip(e)}
                    </Popup>
                )) : value.join(',') : '' : value}
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
