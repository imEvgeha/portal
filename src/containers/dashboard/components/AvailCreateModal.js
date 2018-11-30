import React from 'react';
import {Component} from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {ModalFooter, ModalHeader, Modal, Button, Label, Input, Progress} from 'reactstrap';
import t from 'prop-types';
import DatePicker from 'react-datepicker/es';
import {dashboardService} from '../DashboardService';
import moment from 'moment';
import {validateDate} from '../../../util/Validation';
import config from 'react-global-configuration';

class AvailCreate extends React.Component {
    static propTypes = {
        className: t.string,
        abortLabel: t.string,
        confirmLabel: t.string,
        reject: t.func,
        resolve: t.func,
        availsMapping: t.any,
    };

    static defaultProps = {
        ...Component.defaultProps,
        confirmLabel: 'Submit',
        abortLabel: 'Cancel',
    };

    constructor(props) {
        super(props);
        this.state = {
            resolutionValidation: config.get('extraValidation.resolution'),
            modal: true,
            disableCreateBtn: true,
            showCreatedMessage: false,
            loading: false,
            errorMessage: {
                other: ''
            },
            mappingErrorMessage: {},
            avail: {
                title: null,
                studio: null,
                territory: null,
                genre: null,
                vodStart: null,
                vodEnd: null
            }
        };

        this.toggle = this.toggle.bind(this);
        this.abort = this.abort.bind(this);
        this.confirm = this.confirm.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDatepickerChange = this.handleDatepickerChange.bind(this);
        this.handleDatepickerRawChange = this.handleDatepickerRawChange.bind(this);
    }

    componentDidMount() {
        this.addMappingToState(this.props.availsMapping.mappings);
    }

    handleChange({target}) {
        if(this.state.resolutionValidation.fields.indexOf(target.name) > -1 && target.type !== 'checkbox' && target.value !== ''){
            target.value = target.value.toUpperCase();
        }
        const value = target.type === 'checkbox' ? target.checked : target.value.trim();
        const name = target.name;

        let newAvail = {...this.state.avail, [name]: value};
        this.setState({
            avail: newAvail
        });

        this.setDisableCreate(newAvail, this.state.mappingErrorMessage, this.state.errorMessage);
    }

    handleDatepickerChange(name, displayName, date) {
        let newAvail = {...this.state.avail};
        newAvail[name] = date;
        let errorMessage = {range: '', date: ''};

        let startDate, endDate, rangeError;

        if (name.endsWith('Start') && this.state.avail[name.replace('Start', 'End')]) {
            startDate = date;
            endDate = this.state.avail[name.replace('Start', 'End')];
            rangeError = displayName + ' must be before corresponding end date';
        } else if (name.endsWith('End') && this.state.avail[name.replace('End', 'Start')]) {
            startDate = this.state.avail[name.replace('End', 'Start')];
            endDate = date;
            rangeError = displayName + ' must be after corresponding end date';
        }

        if (startDate && endDate && endDate < startDate) {
            errorMessage.range = rangeError;
        }

        let mappingErrorMessage = Object.assign({}, this.state.mappingErrorMessage);
        mappingErrorMessage[name] = errorMessage;

        let groupedMappingName = this.getGroupedMappingName(name);
        if(mappingErrorMessage[groupedMappingName]) {
            mappingErrorMessage[groupedMappingName].range = errorMessage.range;
        }

        this.setState({
            avail: newAvail,
            mappingErrorMessage: mappingErrorMessage
        });

        this.setDisableCreate(newAvail, mappingErrorMessage, this.state.errorMessage);
    }

    getGroupedMappingName(name) {
        if (name.endsWith('Start')) {
            return name.replace('Start', 'End');
        } else {
            return name.replace('End', 'Start');
        }
    }

    handleDatepickerRawChange(name, displayName, date) {
        if (validateDate(date) || !date) {
            this.handleDatepickerChange(name, displayName, date ? moment(date) : null);
        } else {
            let mappingErrorMessage = Object.assign({}, this.state.mappingErrorMessage);
            mappingErrorMessage[name].date = 'Invalid date: ' + displayName;
            mappingErrorMessage[name].range = '';

            let groupedMappingName = this.getGroupedMappingName(name);
            if(mappingErrorMessage[groupedMappingName]) {
                mappingErrorMessage[groupedMappingName].range = '';
            }

            this.setState({mappingErrorMessage: mappingErrorMessage});
            this.setDisableCreate(this.state.avail, mappingErrorMessage, this.state.errorMessage);
        }
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    abort() {
        return this.props.reject();
    }

    setDisableCreate(avail, mappingErrorMessage, errorMessage) {
        if (this.isAnyErrors(mappingErrorMessage, errorMessage)) {
            this.setState({disableCreateBtn: true});
        } else if (this.areMandatoryFieldsEmpty(avail)) {
            this.setState({disableCreateBtn: true});
        } else {
            this.setState({disableCreateBtn: false});
        }
    }

    isAnyErrors(mappingErrorMessage, errorMessage) {
        if(errorMessage.other) {
            return true;
        }
        for (const [, value] of Object.entries(mappingErrorMessage)) {
            if(value.date) {
                return true;
            }
            if(value.range) {
                return true;
            }
        }
        return false;
    }

    areMandatoryFieldsEmpty(avail) {
        //only one extra validation for now, can be extended to multiple validation later if necessary
        switch (this.state.resolutionValidation.type) {
            case 'oneOf' : {
                for(let i=0; i < this.props.availsMapping.mappings.length; i++){
                    let mapping = this.props.availsMapping.mappings[i];
                    //check fields not belonging to 'oneOf' validations
                    //return true and get out as soon as one mandatory field is found not valid
                    if(mapping.required && this.state.resolutionValidation.fields.indexOf(mapping.javaVariableName) === -1 && !avail[mapping.javaVariableName]) return true;
                }
            }
        }

        //check fields belonging to 'oneOf'
        if(this.state.resolutionValidation.type === 'oneOf'){
            let stillInvalid = true; //is presumed invalid until one valid value is found
            for(let i=0; i < this.state.resolutionValidation.fields.length && stillInvalid; i++){
                //check each value to corresponding accepted values (or not empty) and get out when found one valid value
                if(this.state.resolutionValidation.values == null || i >=  this.state.resolutionValidation.values.length || this.state.resolutionValidation.values[i] == null){
                    //if no required value just check against empty
                    if(avail[this.state.resolutionValidation.fields[i]]) stillInvalid = false;
                }else{
                    //if accepted values exists check if current value is among them
                    if(this.state.resolutionValidation.values[i].indexOf(avail[this.state.resolutionValidation.fields[i]]) > -1) stillInvalid = false;
                }
            }

            if(stillInvalid) return true;
        }

        return false;
    }

    confirm() {
        this.setState({loading: true, showCreatedMessage: false});
        dashboardService.createAvail(this.state.avail).then(() => {
            this.setState({loading: false, showCreatedMessage: true});
            let thatAbort = this.abort;
            setTimeout(function () {
                thatAbort();
            }, 1000);
        })
            .catch(() => this.setState({loading: false, errorMessage: {...this.state.errorMessage, other: 'Avail creation Failed'}}));
        return this.props.resolve();
    }

    addMappingToState = (mappings) => {
        let mappingErrorMessage = {};
        mappings.map((mapping) => {
            mappingErrorMessage[mapping.javaVariableName] =  {
                date: '',
                range: ''
            };
        });

        this.setState({mappingErrorMessage: mappingErrorMessage});
    };

    render() {
        const rowsOnLeft = this.props.availsMapping.mappings.length/2;

        const renderFieldTemplate = (name, displayName, content) => {
            return (
                <a href="#" key={name}
                   className="list-group-item list-group-item-action flex-column align-items-start">
                    <div className="row">
                        <div className="col-4">{displayName}:</div>
                        <div className="col">
                            {content}
                        </div>
                    </div>
                </a>
            );
        };

        const renderTextField = (name, displayName) => {
            return renderFieldTemplate(name, displayName, (
                <Input type="text" name={name} id={'dashboard-avails-create-modal-' + name + '-text'} placeholder={'Enter ' + displayName}
                       onChange={this.handleChange}/>
            ));
        };

        const renderBooleanField = (name, displayName) => {
            return renderFieldTemplate(name, displayName, (
                <select className="form-control"
                        name={name}
                        id={'dashboard-avails-create-modal-' + name + '-select'}
                        placeholder={'Enter ' + displayName}
                        value={this.state.avail[name]}
                        onChange={this.handleChange}>
                    <option value="">None selected</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            ));
        };

        const renderDatepickerField = (name, displayName) => {
            return renderFieldTemplate(name, displayName, (
                <div>
                <DatePicker
                    className={this.state.mappingErrorMessage[name] ? this.state.mappingErrorMessage[name].date ? 'text-danger' : '' : ''}
                    id={'dashboard-avails-create-modal-' + name + '-text'}
                    name={name}
                    selected={this.state.avail[name]}
                    showYearDropdown
                    showMonthDropdown
                    autoComplete={'off'}
                    onChange={(date) => this.handleDatepickerChange(name, displayName, date)}
                    onChangeRaw={(event) => this.handleDatepickerRawChange(name, displayName, event.target.value)}
                    todayButton={'Today'}
                />
                    {this.state.mappingErrorMessage[name] && this.state.mappingErrorMessage[name].date &&
                        <small className="text-danger m-2">
                            {this.state.mappingErrorMessage[name] ? this.state.mappingErrorMessage[name].date ? this.state.mappingErrorMessage[name].date : '' : ''}
                        </small>
                    }
                    {this.state.mappingErrorMessage[name] && this.state.mappingErrorMessage[name].range &&
                        <small className="text-danger m-2">
                            {this.state.mappingErrorMessage[name] ? this.state.mappingErrorMessage[name].range ? this.state.mappingErrorMessage[name].range : '' : ''}
                        </small>
                    }
                </div>
            ));
        };

        const renderFields = (mappings) => {
            return mappings.map((mapping)=> {
                if(mapping.javaVariableName!='availId'){//we shouldn't be able to set the id
                    switch (mapping.dataType) {
                        case 'text' : return renderTextField(mapping.javaVariableName, mapping.displayName);
                        case 'number' : return renderTextField(mapping.javaVariableName, mapping.displayName);
                        case 'year' : return renderTextField(mapping.javaVariableName, mapping.displayName);
                        case 'date' : return renderDatepickerField(mapping.javaVariableName, mapping.displayName);
                        case 'boolean' : return renderBooleanField(mapping.javaVariableName, mapping.displayName);
                        default:
                            console.warn('Unsupported DataType: ' + mapping.dataType + ' for field name: ' + mapping.displayName);
                    }
                }
            });
        };

        return (
            <Modal isOpen={this.state.modal} toggle={this.toggle} className = { this.props.className + ' lgModalBox' } fade={false} backdrop={false} size={'lg'}>
                <ModalHeader toggle={this.toggle}>Create Avail</ModalHeader>
                <div className={'row'}>
                    <div className={'col-6'}>
                        <div className="nx-stylish list-group">
                            {renderFields(this.props.availsMapping.mappings.slice(0, rowsOnLeft))}
                        </div>
                    </div>
                    <div className={'col-6'}>
                        <div className="nx-stylish list-group">
                            {renderFields(this.props.availsMapping.mappings.slice(rowsOnLeft))}
                        </div>
                    </div>
                </div>
                {this.state.loading && <Progress className={'custom-progress'} animated value={100}/>}
                <ModalFooter>
                    {this.state.showCreatedMessage && <Label id="dashboard-avails-create-modal-error-message"
                           className="text-success w-100">Avails created</Label>}
                    <Label id="dashboard-avails-create-modal-error-message" className="text-danger w-100">
                        {this.state.errorMessage.other}
                    </Label>
                    <Button id="dashboard-avails-create-modal-create-btn" color="primary" disabled={this.state.disableCreateBtn}
                            onClick={this.confirm}>{this.props.confirmLabel}</Button>
                    <Button id="dashboard-avails-create-modal-cancel-btn" color="primary" onClick={this.abort}>{this.props.abortLabel}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export const availCreateModal = {
    open: (onApprove, onCancel, options) => {
        if (options == null) {
            options = {};
        }
        const props = {
            ...options,
            resolve: () => {
                onApprove();
            },
            reject: () => {
                cleanup();
                onCancel();
            }
        };
        const wrapper = document.body.appendChild(document.createElement('div'));
        render(<AvailCreate {...props}/>, wrapper);
        const cleanup = function () {
            unmountComponentAtNode(wrapper);
            return setTimeout(function () {
                return wrapper.remove();
            });
        };
    }
};