import React, { Component } from 'react';
import { Button } from 'reactstrap';
import t from 'prop-types';

class EditableBaseComponent extends Component {

    static propTypes = {
        helperComponent: t.object,
        validate: t.func,
        value: t.oneOfType([t.string, t.array]),
        displayName: t.string,
        disabled: t.bool,
        onChange: t.func,
        priorityDisplay: t.any
    };

    static defaultProps = {
        value: null
    }

    constructor(props) {
        super(props);

        this.state = {
            value:props.value,
            showStateValue: false,
            helperComponentStatus: false,
            errorMessage: '',
            submitStatus: false
        };

        this.handleShowHelperComponent = this.handleShowHelperComponent.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCancelHelperComponent = this.handleCancelHelperComponent.bind(this);
        this.handleInvalid = this.handleInvalid.bind(this);
        this.submit = this.submit.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    componentDidUpdate(prevProps) {
        if(prevProps.value != this.props.value){
            this.setState({
                showStateValue: false,
                value: this.props.value ? this.props.value : null,
            });
        }

    }

    handleShowHelperComponent(e) {
        e.preventDefault();
        if (!this.props.disabled) {
            this.setState({
                helperComponentStatus: true,
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
            value: this.props.value,
            showStateValue: false,
            helperComponentStatus: false,
            errorMessage: ''
        });
    }

    handleChange(val) {
        this.setState({ value: val, submitStatus: false, errorMessage: '' });
    }

    handleInvalid(invalid) {
        if (invalid) {
            this.setState({ errorMessage: 'Invalid', submitStatus: true });
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
                helperComponentStatus: false,
                showStateValue: true
            });
            this.props.onChange(val, this.cancel);
        }
    }

    render() {
        const displayFunc = (value)=>{
            return (<span
                onClick={this.handleShowHelperComponent}
                style={{width:'100%'}}
                className={this.props.disabled ? 'disabled' : ''}>
                       {Array.isArray(value) ? value.join(',') : value}
                   </span>);
        };

        const unfocusedRender = ()=>{
            if(this.props.priorityDisplay) {
                return displayFunc(this.props.priorityDisplay);
            } else {
                if(this.state.showStateValue){
                    return displayFunc(this.state.value);
                } else {
                    if(this.props.value){
                        return displayFunc(this.props.value);
                    }else {
                        return (
                            <span
                                className="displayDate"
                                style={{color: '#808080', cursor: 'pointer', width:'100%'}}
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
                    this.state.helperComponentStatus ?
                        <div>
                            <div className="dPicker" style={{ marginBottom: '5px', minWidth:'500px' }}>
                                {this.props.helperComponent}
                            </div>
                            <div style={{ float: 'left' }}>
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
                                this.state.errorMessage &&
                                <small className = {'text-danger m-2'} style={{ float: 'left', width: '100%' }}>
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
