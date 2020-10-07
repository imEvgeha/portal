import React, {useContext, useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {default as AKForm} from '@atlaskit/form/Form';
import {get} from 'lodash';
import {NexusModalContext} from '../../nexus-modal/NexusModal';
import {buildSection, getFieldConfig, renderNexusField, getProperValues} from '../utils';
import {VIEWS} from '../constants';
import './NexusArray.scss';

const NexusArray = ({name, view, data, fields, getValues, setFieldValue, schema, setDisableSubmit}) => {
    const {openModal, closeModal} = useContext(NexusModalContext);
    // allData includes initialData and rows added
    const [allData, setAllData] = useState(data);

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
                {buildObject(fields, allData[index] || {}, index)}
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
                                key={`nexus-c-array__field ${key}`}
                                className={`nexus-c-array__field ${fields[key].className ? fields[key].className : ''}`}
                            >
                                {renderNexusField(
                                    `${name}[${index}].${key}`,
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
                    Confirm
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
        const formData = getValues();
        const arrayData = get(formData, name) ? get(formData, name) : [];
        // including the new row
        const editedArray = [...arrayData, values];

        const properValues = editedArray.map(v => getProperValues(schema, v));

        setAllData(editedArray);
        setFieldValue(name, properValues);
        setDisableSubmit(false);
        closeModal();
    };

    const modalContent = () => {
        return (
            <div className="nexus-c-array__modal">
                <AKForm onSubmit={values => handleOnSubmit(values)}>
                    {({formProps, dirty, submitting, reset, getValues}) => (
                        <form {...formProps}>
                            {buildSection(fields, getValues, VIEWS.CREATE, {})}
                            {buildButtons(dirty, submitting, reset)}
                        </form>
                    )}
                </AKForm>
            </div>
        );
    };

    const openEditModal = () => {
        openModal(modalContent(), {
            title: <div className="nexus-c-array__modal-title">{`Add ${name} Data`}</div>,
            width: 'medium',
        });
    };

    return (
        <div className="nexus-c-array">
            <div className="nexus-c-array__add">{view === VIEWS.EDIT && renderAddButton()}</div>
            <div className="nexus-c-array__objects">{allData.map((o, index) => renderObject(o, index))}</div>
        </div>
    );
};

NexusArray.propTypes = {
    schema: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    view: PropTypes.string,
    data: PropTypes.array,
    fields: PropTypes.object,
    getValues: PropTypes.func,
    setFieldValue: PropTypes.func,
    setDisableSubmit: PropTypes.func,
};

NexusArray.defaultProps = {
    view: VIEWS.VIEW,
    data: [],
    fields: {},
    getValues: undefined,
    setFieldValue: undefined,
    setDisableSubmit: undefined,
};

export default NexusArray;
