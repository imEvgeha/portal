import React, {useContext, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {Field as AKField} from '@atlaskit/form';
import {default as AKForm} from '@atlaskit/form/Form';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import {get} from 'lodash';
import {NexusModalContext} from '../../nexus-modal/NexusModal';
import {CANCEL, DELETE, REMOVE_TITLE} from '../../nexus-tag/constants';
import {
    buildSection,
    checkFieldDependencies,
    getFieldConfig,
    getValidationFunction,
    renderNexusField,
    renderError,
    renderLabel,
} from '../utils';
import {VIEWS, DELETE_POPUP} from '../constants';
import './NexusArray.scss';

const NexusArray = ({
    name,
    view,
    data,
    fields,
    getValues,
    setFieldValue,
    confirmationContent,
    isRequired,
    isReadOnly,
    tooltip,
    dependencies,
    path,
    validationError,
    validation,
    selectValues,
    isUpdate,
    config,
    isEditable,
}) => {
    const {openModal, closeModal} = useContext(NexusModalContext);
    // allData includes initialData and rows added/removed
    const [allData, setAllData] = useState(data);

    useEffect(() => {
        isUpdate && setFieldValue(path, data);
        setAllData(data);
    }, [data, isUpdate]);

    const renderAddButton = () => {
        return (
            <Button onClick={openEditModal} className="nexus-c-dynamic-form__add-button">
                {`+ Add ${name}`}
            </Button>
        );
    };

    const onRemove = index => {
        const editedData = allData.filter((obj, i) => i !== index);
        setAllData(editedData);
        setFieldValue(path, editedData);
        closeModal && closeModal();
    };

    const handleRemove = index => {
        if (confirmationContent) {
            const actions = [
                {
                    text: CANCEL,
                    onClick: closeModal,
                    appearance: 'default',
                },
                {
                    text: DELETE,
                    onClick: () => {
                        onRemove(index);
                        closeModal();
                    },
                    appearance: 'danger',
                },
            ];
            openModal(`${DELETE_POPUP} ${confirmationContent}`, {title: REMOVE_TITLE, width: 'medium', actions});
        } else {
            onRemove(index);
        }
    };

    const renderObject = (object, index) => {
        return (
            <div key={index} className="nexus-c-array__object">
                {view !== VIEWS.VIEW && (
                    <div className="nexus-c-array__remove-button" onClick={() => handleRemove(index)}>
                        <EditorCloseIcon size="medium" />
                    </div>
                )}
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
                                {renderNexusField(`${path}[${index}].${key}`, view, getValues, {
                                    initialData,
                                    field: fields[key],
                                    selectValues,
                                    setFieldValue,
                                    config,
                                })}
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
        const createFormData = getValues();
        const arrayData = get(createFormData, path) ? get(createFormData, path) : [];
        // including the new row
        const editedArray = [...arrayData, values];
        setAllData(editedArray);
        setFieldValue(path, editedArray);
        closeModal();
    };

    const modalContent = () => {
        return (
            <div className="nexus-c-array__modal">
                <AKForm onSubmit={values => handleOnSubmit(values)}>
                    {({formProps, dirty, submitting, reset, getValues}) => (
                        <form {...formProps}>
                            {buildSection(fields, getValues, VIEWS.CREATE, {selectValues, setFieldValue})}
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

    const required = !!(
        checkFieldDependencies('required', view, dependencies, {formData: getValues(), config, isEditable}) ||
        isRequired
    );
    const readOnly = !!(
        checkFieldDependencies('readOnly', view, dependencies, {formData: getValues(), config, isEditable}) ||
        isReadOnly
    );
    return (
        <div className={`nexus-c-array ${validationError ? 'nexus-c-array--error' : ''}`}>
            <AKField
                name={path}
                isRequired={required}
                validate={value => getValidationFunction(value, validation, {type: 'array', isRequired: required})}
            >
                {({fieldProps, error}) => (
                    <>
                        {renderLabel(name, required, tooltip)}
                        {renderError(error)}
                        {validationError && <div>{validationError}</div>}
                    </>
                )}
            </AKField>
            {!readOnly && <div className="nexus-c-array__add">{view !== VIEWS.VIEW && renderAddButton()}</div>}
            <div className="nexus-c-array__objects">{allData.map((o, index) => renderObject(o, index))}</div>
        </div>
    );
};

NexusArray.propTypes = {
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    view: PropTypes.string,
    tooltip: PropTypes.string,
    data: PropTypes.array,
    fields: PropTypes.object,
    getValues: PropTypes.func,
    setFieldValue: PropTypes.func,
    confirmationContent: PropTypes.string,
    isRequired: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    validationError: PropTypes.string,
    validation: PropTypes.array,
    dependencies: PropTypes.array,
    selectValues: PropTypes.object,
    isUpdate: PropTypes.bool,
    config: PropTypes.array,
    isEditable: PropTypes.bool,
};

NexusArray.defaultProps = {
    view: VIEWS.VIEW,
    tooltip: null,
    data: [],
    fields: {},
    getValues: undefined,
    setFieldValue: undefined,
    confirmationContent: null,
    isRequired: false,
    isReadOnly: false,
    validationError: null,
    validation: [],
    dependencies: [],
    selectValues: {},
    isUpdate: false,
    config: [],
    isEditable: false,
};

export default NexusArray;
