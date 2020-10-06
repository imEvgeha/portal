import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {Field as AKField, Field} from '@atlaskit/form';
import {default as AKForm} from '@atlaskit/form/Form';
import TextField from '@atlaskit/textfield';
import {NexusModalContext} from '../../nexus-modal/NexusModal';
import {buildSection, getDefaultValue, getFieldConfig, renderFieldViewMode, renderNexusField} from '../utils';
import {VIEWS} from '../constants';
import './NexusArray.scss';

const NexusArray = ({name, view, data, fields, getValues, ...props}) => {
    const {openModal, closeModal} = useContext(NexusModalContext);

    const renderAddButton = () => {
        return (
            <Button onClick={openEditModal} className="nexus-c-dynamic-form__add-button">
                {`+ Add ${name}`}
            </Button>
        );
    };

    const renderObject = (object, index) => {
        return (
            <div key={index} className="nexus-c-array__object">
                {buildObject(fields, data[index] || {}, index)}
            </div>
        );
    };

    const buildObject = (fields = {}, initialData, index) => {
        return (
            <>
                {Object.keys(fields).map(key => {
                    return (
                        !getFieldConfig(fields[key], 'hidden', view) && (
                            <div
                                className={`nexus-c-array__field ${fields[key].className ? fields[key].className : ''}`}
                            >
                                {renderNexusField(
                                    `territory[${index}].${fields[key].name}`,
                                    view,
                                    getValues,
                                    initialData,
                                    fields[key]
                                )}
                            </div>
                        )
                    );
                })}
            </>
        );
    };

    const buildButtons = (dirty, submitting, reset) => {
        return (
            <div className="nexus-c-array__modal-buttons">
                <Button
                    type="submit"
                    className="nexus-c-array__submit-button"
                    appearance="primary"
                    isDisabled={!dirty || submitting}
                >
                    Save changes
                </Button>
                <Button
                    className="nexus-c-array__cancel-button"
                    onClick={() => {
                        reset();
                        closeModal();
                    }}
                >
                    Cancel
                </Button>
            </div>
        );
    };

    const handleOnSubmit = values => {
        console.log(values);
        // setView(VIEWS.VIEW);
        // // make keys same as path
        // const properValues = [];
        // const allFields = getAllFields(schema);
        // Object.keys(values).map(key => {
        //     const field = getFieldByName(allFields, key);
        //     const {path} = field;
        //     properValues[path] = getProperValue(field.type, values[key]);
        // });
        // onSubmit(properValues);
    };

    const modalContent = () => {
        return (
            <div className="nexus-c-array__modal">
                <AKForm onSubmit={values => handleOnSubmit(values)}>
                    {({formProps, dirty, submitting, reset, getValues}) => (
                        <form {...formProps}>
                            {buildSection(fields, getValues, view, {})}
                            {buildButtons(dirty, submitting, reset)}
                        </form>
                    )}
                </AKForm>
            </div>
        );
    };

    const openEditModal = () => {
        openModal(modalContent(), {title: 'Territory Data', width: 'small'});
    };

    return (
        <div className="nexus-c-array">
            <div className="nexus-c-array__add">{view === VIEWS.EDIT && renderAddButton()}</div>
            <div className="nexus-c-array__objects">
                {/* <Field */}
                {/*    name={name} */}
                {/*    id={name} */}
                {/* > */}
                {/*    {({fieldProps, error}) => */}
                {data.map((o, index) => renderObject(o, index))}
                {/* </Field> */}
            </div>
        </div>
    );
};

NexusArray.propTypes = {
    name: PropTypes.string.isRequired,
    view: PropTypes.string,
    data: PropTypes.array,
    fields: PropTypes.object,
    getValues: PropTypes.func,
};

NexusArray.defaultProps = {
    view: VIEWS.VIEW,
    data: [],
    fields: {},
    getValues: undefined,
};

export default NexusArray;
