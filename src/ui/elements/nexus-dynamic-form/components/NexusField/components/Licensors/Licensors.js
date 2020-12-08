import React, {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {Field, FormFooter} from '@atlaskit/form';
import {default as AKForm} from '@atlaskit/form/Form';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import Select from '@atlaskit/select';
import TextField from '@atlaskit/textfield';
import {cloneDeep} from 'lodash';
import {NexusModalContext} from '../../../../../nexus-modal/NexusModal';
import {sortOptions} from '../../../../utils';
import './Licensors.scss';

const Licensors = ({selectValues, data, isEdit, onChange}) => {
    const {openModal, closeModal} = useContext(NexusModalContext);
    const [licensors, setLicensors] = useState([]);
    const [licensorOptions, setLicensorOptions] = useState([]);

    useEffect(() => {
        setLicensors(data);
    }, [data]);

    useEffect(() => {
        if (Object.keys(selectValues).length) {
            const options = cloneDeep(selectValues.licensor);
            let formattedOptions = options.map(opt => {
                return {
                    label: opt.value,
                    value: opt.value,
                    id: opt.id,
                };
            });
            formattedOptions = sortOptions(formattedOptions);
            setLicensorOptions(formattedOptions);
        }
    }, [selectValues]);

    const handleAddLicensor = async values => {
        const updatedLicensors = [...licensors];
        const newLicensor = {
            id: values.licensor.id,
            licensor: values.licensor.value,
            licensorTitleId: values.licensorTitleId,
        };
        updatedLicensors.push(newLicensor);
        setLicensors(updatedLicensors);
        onChange([...updatedLicensors]);
        closeModal();
    };

    const removeLicensor = index => {
        const updatedLicensors = [...licensors];
        updatedLicensors.splice(index, 1);
        setLicensors(updatedLicensors);
        onChange([...updatedLicensors]);
    };

    const openAddLicensorModal = () => {
        openModal(modalContent(), {
            title: <div>Add Licensor</div>,
            width: 'medium',
        });
    };

    const modalContent = () => {
        return (
            <div>
                <AKForm onSubmit={values => handleAddLicensor(values)}>
                    {({formProps, reset}) => (
                        <form {...formProps}>
                            <Field name="licensor" label="Licensor" isRequired>
                                {({fieldProps}) => (
                                    <Select
                                        options={licensorOptions}
                                        {...fieldProps}
                                        className="nexus-c-modal__select-container"
                                        classNamePrefix="nexus-c-modal__select"
                                    />
                                )}
                            </Field>
                            <Field name="licensorTitleId" label="Licensor Title ID" isRequired>
                                {({fieldProps}) => <TextField {...fieldProps} />}
                            </Field>
                            <FormFooter>
                                <Button type="submit" appearance="primary">
                                    Submit
                                </Button>
                                <Button
                                    className="nexus-c-modal__cancel-button"
                                    appearance="danger"
                                    onClick={() => {
                                        reset();
                                        closeModal();
                                    }}
                                >
                                    Cancel
                                </Button>
                            </FormFooter>
                        </form>
                    )}
                </AKForm>
            </div>
        );
    };

    return (
        <div>
            {licensors.map((licensor, index) => {
                return (
                    <div key={index} className="nexus-c-licensors">
                        <div className="nexus-c-licensors__licensor">
                            <span>Licensor:</span>
                            <span>{licensor.licensor}</span>
                        </div>
                        <div className="nexus-c-licensors__id">
                            <span>Licensor Title ID:</span>
                            <span>{licensor.licensorTitleId}</span>
                        </div>
                        {isEdit && (
                            <div className="nexus-c-licensors__buttons" onClick={() => removeLicensor(index)}>
                                <EditorCloseIcon size="medium" label="" />
                            </div>
                        )}
                    </div>
                );
            })}
            {isEdit && (
                <div>
                    <Button onClick={openAddLicensorModal}>+ Add Licensor</Button>
                </div>
            )}
        </div>
    );
};

Licensors.propTypes = {
    selectValues: PropTypes.object,
    data: PropTypes.array,
    isEdit: PropTypes.bool,
    onChange: PropTypes.func,
};

Licensors.defaultProps = {
    selectValues: {},
    data: [],
    isEdit: false,
    onChange: () => null,
};

export default Licensors;
