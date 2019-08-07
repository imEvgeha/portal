import React from 'react';
import PropTypes from 'prop-types';

import Modal, { ModalTransition, ModalFooter } from '@atlaskit/modal-dialog';
import Form,{ Field } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import Button from '@atlaskit/button';
import Select from '@atlaskit/select';
import { DatePicker } from '@atlaskit/datetime-picker';


class RightTerritoryForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            territory: []
        };
    }
    returnProperValues = (data) => {
        let newObject = {
            country: data.country['value'],
            dateSelected: data.dateSelected,
            selected: data.selected['value'],
            rightContractStatus: data.rightContractStatus['value'],
            vuContractID: data.vuContractID
        };
        this.setState({
            territory: [newObject, ...this.state.territory]
        });
    }

    handleChange = (data) => {
        this.returnProperValues(data);
        this.props.handleChange(this.state.territory);
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
                  <Form onSubmit={data => this.handleChange(data)}>
                    {({ formProps }) => (
                      <form {...formProps} className={className}>
                        {children}
                      </form>
                    )}
                  </Form>
                )
              }}
            >
              <Field label="COUNTRY" name="country">
                {({ fieldProps: {id, ...rest} }) => (
                <Select
                    id={`select-${id}`}
                    {...rest}
                    isSearchable={true}
                    placeholder="Choose Country"
                    options={this.props.options}
                />
                )}
              </Field>
              <Field label="SELECTED" name="selected">
                {({ fieldProps: { id, ...rest} }) => (
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

              <Field label="DATE SELECTED" name="dateSelected" defaultValue="">
                {({ fieldProps }) => (
                  <DatePicker id={'datepicker'} placeholder="DD/MM/YYYY" {...fieldProps} dateFormat={'DD/MM/YYYY'}/>
                )}
              </Field>

              <Field label="RIGHTS CONTRACT STATUS" name="rightContractStatus">
                {({ fieldProps: { id, ...rest } }) => (
                    <Select
                        id={`select-${id}`}
                        {...rest}
                        isSearchable={false}
                        placeholder="Choose Status"
                        options={[
                            { label: 'PENDING', value: 'PENDING' },]}
                    />
                )}
              </Field>
              <Field label="VU CONTRACT ID" name="vuContractID" defaultValue="">
                {({ fieldProps: {id, ...rest} }) => (
                   <Textfield id={`input-${id}`} {...rest} placeholder="Add contract ID" />
                )}
              </Field>
              <ModalFooter>
                <Button appearance="default" onClick={this.props.onClose}>
                    Cancel
                </Button>
                <Button appearance="primary" type="submit">
                    Save
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
    isOpen: PropTypes.bool
};

export default RightTerritoryForm;