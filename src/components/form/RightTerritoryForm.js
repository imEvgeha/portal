import React from 'react';
import PropTypes from 'prop-types';

import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import Form, { Field } from '@atlaskit/form';
import Button from '@atlaskit/button';
import Select, { CreatableSelect } from '@atlaskit/select';
import { DatePicker } from '@atlaskit/datetime-picker';
import moment from 'moment';
import { momentToISO } from '../../util/Common';
import { convertBooleanToString } from '../../containers/avail/util/format';
import { RIGHTS_CREATE, RIGHTS_EDIT } from '../../constants/constant-variables';
import { ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


class RightTerritoryForm extends React.Component {
    constructor(props) {
        super(props);
    }
    static propTypes = {
        isEdit: false
    };
    setProperValues = (data) => {
        if (data.country && data.rightContractStatus) {
            let newObject = {
                country: data.country['value'] ? data.country['value'] !== '' && data.country['value'] : this.props.existingTerritoryList[this.props.territoryIndex]['country'] ? this.props.existingTerritoryList[this.props.territoryIndex]['country'] : '',
                dateSelected: data.dateSelected ? momentToISO(moment(data.dateSelected).utcOffset(0, true)) : this.props.isEdit ? this.props.existingTerritoryList[this.props.territoryIndex]['dateSelected'] : '',
                selected: data.selected['label'] === 'Yes' ? data.selected['label'] ? data.selected['value'] : this.props.existingTerritoryList[this.props.territoryIndex]['selected'] : false,
                rightContractStatus: data.rightContractStatus['value'] ? data.rightContractStatus['value'] : this.props.isEdit ? this.props.existingTerritoryList[this.props.territoryIndex]['rightContractStatus'] : '',
                vuContractId: data.vuContractId ? data.vuContractId.map(e => e.value) : this.props.isEdit ? this.props.existingTerritoryList[this.props.territoryIndex]['vuContractId'] : ''
            };
            let updatedObject = {};
            for (let objectField in newObject) {
                if (newObject[objectField]) {
                    updatedObject[objectField] = newObject[objectField];
                } else {                
                    if(objectField === 'selected') {
                        updatedObject[objectField] = false;
                    } else {
                        updatedObject[objectField] = null;
                    }
                }
            }
            return updatedObject;
        }
    }

    onSubmit = data => {
        let properValues = this.setProperValues(data);
        if (properValues) {
            this.props.onSubmit(properValues);
            this.props.onClose();
        }
    }


    returnValidData = data => {
        return this.props.existingTerritoryList && this.props.existingTerritoryList[this.props.territoryIndex] && this.props.existingTerritoryList[this.props.territoryIndex][data] && this.props.existingTerritoryList[this.props.territoryIndex][data] !== null;
    }

    removeExistingOptions = () => {
        return this.props.existingTerritoryList ? this.props.options.filter(x => !this.props.existingTerritoryList.find(y => y.country === x.label)) : this.props.options;
    }

    render() {
        return (
            <ModalTransition>
                {this.props.isOpen && (
                    <Modal
                        width="medium"
                        onClose={this.props.onClose}
                        components={{
                            Container: ({ children, className }) => (
                                <Form onSubmit={data => this.onSubmit(data)} >
                                    {({ formProps }) => (
                                        <ModalBody>
                                            <form {...formProps} className={className}>
                                                {children}
                                            </form>
                                        </ModalBody>
                                    )}
                                </Form>
                            )
                        }}
                    >
                        <ModalHeader><p style={{ color: '#999', fontWeight: 'bold', fontSize: '11px' }}>{this.props.isEdit ? RIGHTS_EDIT : RIGHTS_CREATE}</p>Territory Data</ModalHeader>
                        <Field label="COUNTRY" isRequired name="country" defaultValue={this.props.isEdit ? { label: this.returnValidData('country') && this.props.existingTerritoryList[this.props.territoryIndex]['country'], value: this.returnValidData('country') && this.props.existingTerritoryList[this.props.territoryIndex]['country'] } : ''}>
                            {({ fieldProps: { id, ...rest } }) => (
                                <Select
                                    id={`select-${id}`}
                                    {...rest}
                                    isSearchable={true}
                                    placeholder="Choose Country"
                                    options={this.removeExistingOptions()}
                                />
                            )}

                        </Field>
                        <Field label="SELECTED" name="selected" defaultValue={this.props.isEdit ? { label: this.returnValidData('selected') ? convertBooleanToString(this.props.existingTerritoryList[this.props.territoryIndex]['selected']) : 'No', value: this.returnValidData('selected') ? this.props.existingTerritoryList[this.props.territoryIndex]['selected'] : false } : {label: 'No', value: false}}>
                            {({ fieldProps: { id, ...rest } }) => (
                                <Select
                                    id={`select-${id}`}
                                    {...rest}
                                    isSearchable={false}
                                    placeholder="Add selected"
                                    options={[
                                        { label: 'Yes', value: true },
                                        { label: 'No', value: false },]}
                                />
                            )}
                        </Field>

                        <Field label="DATE SELECTED" name="dateSelected" defaultValue={this.props.isEdit ? this.returnValidData('dateSelected') && this.props.existingTerritoryList[this.props.territoryIndex]['dateSelected'] ? this.props.existingTerritoryList[this.props.territoryIndex]['dateSelected'] : '' : ''}>
                            {({ fieldProps }) => (
                                <DatePicker id={'datepicker'} placeholder="DD/MM/YYYY" {...fieldProps} dateFormat={'DD/MM/YYYY'} />
                            )}
                        </Field>

                        <Field label="RIGHTS CONTRACT STATUS" isRequired name="rightContractStatus" defaultValue={this.props.isEdit ? { label: this.returnValidData('rightContractStatus') && this.props.existingTerritoryList[this.props.territoryIndex]['rightContractStatus'], value: this.returnValidData('rightContractStatus') && this.props.existingTerritoryList[this.props.territoryIndex]['rightContractStatus'] } : ''}>
                            {({ fieldProps: { id, ...rest } }) => (
                                <Select
                                    id={`select-${id}`}
                                    {...rest}
                                    isSearchable={false}
                                    styles={{
                                        control: (base) => ({ ...base, fontSize: '15px' })
                                    }}
                                    placeholder="Choose Status"
                                    options={[
                                        { label: 'Pending', value: 'Pending' }
                                    ]}
                                />
                            )}
                        </Field>
                        <Field label="VU CONTRACT ID" name="vuContractId" defaultValue={this.props.isEdit ? this.returnValidData('vuContractId') && this.props.existingTerritoryList[this.props.territoryIndex]['vuContractId'].length > 0 && this.props.existingTerritoryList[this.props.territoryIndex]['vuContractId'].map(e => { return { value: e, label: e }; }) : ''}>
                            {({ fieldProps: { id, ...rest } }) => (
                                <CreatableSelect
                                    id={`creatable-select-${id}`}
                                    isClearable
                                    isMulti={true}
                                    placeholder="Add Contract ID"
                                    {...rest}
                                />
                            )}

                        </Field>
                        <ModalFooter>
                            <Button appearance="default" onClick={this.props.onClose}>
                                Cancel
                            </Button>
                            <Button appearance="primary" type="submit">
                                {this.props.isEdit ? 'Update' : 'Create'}
                            </Button>
                        </ModalFooter>
                    </Modal>
                )}
            </ModalTransition>
        );
    }
}

RightTerritoryForm.propTypes = {
    onClose: PropTypes.func,
    isOpen: PropTypes.bool,
    options: PropTypes.array,
    onSubmit: PropTypes.func,
    isEdit: PropTypes.bool,
    existingTerritoryList: PropTypes.array
};

export default RightTerritoryForm;