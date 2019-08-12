import React from 'react';
import PropTypes from 'prop-types';

import Modal, { ModalTransition, ModalFooter } from '@atlaskit/modal-dialog';
import Form, { Field } from '@atlaskit/form';
import Button from '@atlaskit/button';
import Select, { CreatableSelect } from '@atlaskit/select';
import { DatePicker } from '@atlaskit/datetime-picker';
import moment from 'moment';
import { momentToISO } from '../../util/Common';


class RightTerritoryForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            territory: {},
        };
    }
    static propTypes = {
        isEdit: false
    };
    setProperValues = (data) => {
        if (data.country !== '' && data.dateSelected !== '' && data.rightContractStatus !== '' && data.vuContractId !== '') {
            let newObject = {
                country: data.country['value'] ? data.country['value'] !== '' && data.country['value'] : this.props.rightData[this.props.rightIndex]['country'] ? this.props.rightData[this.props.rightIndex]['country'] : '',
                dateSelected: data.dateSelected ? momentToISO(moment(data.dateSelected).utcOffset(0, true)) : this.props.rightData[this.props.rightIndex]['dateSelected'],
                selected: data.selected['label'] === 'Yes' ? data.selected['label'] ? data.selected['value'] : this.props.rightData[this.props.rightIndex]['selected'] : false,
                rightContractStatus: data.rightContractStatus['value'] ? data.rightContractStatus['value'] : this.props.rightData[this.props.rightIndex]['rightContractStatus'],
                vuContractId: data.vuContractId ? data.vuContractId.map(e => e.value) : this.props.rightData[this.props.rightIndex]['vuContractId']
            };
            return newObject;
        }
    }

    onSubmit = data => {
        let properValues = this.setProperValues(data);
        if (properValues) {
            this.props.onSubmit(properValues);
            this.props.onClose();
        }
    }

    convertBooleanToString = e => {
        if (e === true) {
            return 'Yes';
        } else if (e === false) {
            return 'No';
        } else {
            return '';
        }
    }

    returnValidData = data => {
        return this.props.rightData && this.props.rightData[this.props.rightIndex] && this.props.rightData[this.props.rightIndex][data] && this.props.rightData[this.props.rightIndex][data] !== null;
    }

    removeExistingOptions = () => {
        return this.props.rightData ? this.props.options.filter(x => !this.props.rightData.filter(y => y.country === x.label).length) : this.props.options;
    }

    render() {
        return (
            <ModalTransition>
                {this.props.isOpen && (
                    <Modal
                        heading="Territory Data"
                        onClose={this.props.onClose}
                        components={{
                            Container: ({ children, className }) => (
                                <Form onSubmit={data => this.onSubmit(data)} >
                                    {({ formProps }) => (
                                        <form {...formProps} className={className}>
                                            {children}
                                        </form>
                                    )}
                                </Form>
                            )
                        }}
                    >
                        <Field label="COUNTRY" name="country" defaultValue={this.props.isEdit ? { label: this.returnValidData('country') && this.props.rightData[this.props.rightIndex]['country'], value: this.returnValidData('country') && this.props.rightData[this.props.rightIndex]['country'] } : ''}>
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
                        <Field label="SELECTED" name="selected" defaultValue={this.props.isEdit ? { label: this.returnValidData('selected') ? this.convertBooleanToString(this.props.rightData[this.props.rightIndex]['selected']) : 'No', value: this.returnValidData('selected') ? this.props.rightData[this.props.rightIndex]['selected'] : false } : ''}>
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

                        <Field label="DATE SELECTED" name="dateSelected" defaultValue={this.props.isEdit ? this.returnValidData('dateSelected') && this.props.rightData[this.props.rightIndex]['dateSelected'] : ''}>
                            {({ fieldProps }) => (
                                <DatePicker id={'datepicker'} placeholder="DD/MM/YYYY" {...fieldProps} dateFormat={'DD/MM/YYYY'} />
                            )}
                        </Field>

                        <Field label="RIGHTS CONTRACT STATUS" name="rightContractStatus" defaultValue={this.props.isEdit ? { label: this.returnValidData('rightContractStatus') && this.props.rightData[this.props.rightIndex]['rightContractStatus'], value: this.returnValidData('rightContractStatus') && this.props.rightData[this.props.rightIndex]['rightContractStatus'] } : ''}>
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
                        <Field label="VU CONTRACT ID" name="vuContractId" defaultValue={this.props.isEdit ? this.returnValidData('vuContractId') && this.props.rightData[this.props.rightIndex]['vuContractId'].length > 0 && this.props.rightData[this.props.rightIndex]['vuContractId'].map(e => { return { value: e, label: e }; }) : ''}>
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
                                Add
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
    onSubmit: PropTypes.func
};

export default RightTerritoryForm;