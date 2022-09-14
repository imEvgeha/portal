import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Field, FormFooter} from '@atlaskit/form';
import {default as AKForm} from '@atlaskit/form/Form';
import {Dropdown, Button} from '@portal/portal-components';
import {cloneDeep} from 'lodash';
import {useParams} from 'react-router-dom';
import './MsvIds.scss';
import {NexusModalContext} from '../../../../../nexus-modal/NexusModal';
import NexusTagsContainer from '../../../../../nexus-tags-container/NexusTagsContainer';
import {sortOptions} from '../../../../utils';

const MsvIds = ({selectValues, data, isEdit, onChange, generateMsvIds}) => {
    const {openModal, closeModal} = useContext(NexusModalContext);
    const [msvIds, setMsvIds] = useState([]);
    const [licensorOptions, setLicensorOptions] = useState([]);
    const [licenseeOptions, setLicenseeOptions] = useState([]);
    const routeParams = useParams();

    useEffect(() => {
        setMsvIds(data);
    }, [data]);

    useEffect(() => {
        if (Object.keys(selectValues).length) {
            const formattedLicensorOptions = getAndFormatOptions('licensor');
            const formattedLicenseeOptions = getAndFormatOptions('licensee');
            setLicensorOptions(formattedLicensorOptions);
            setLicenseeOptions(formattedLicenseeOptions);
        }
    }, [selectValues]);

    const getAndFormatOptions = field => {
        const options = cloneDeep(selectValues[field]);
        const formattedOptions = options.map(opt => {
            return {
                label: opt.value,
                value: opt.value,
            };
        });
        return sortOptions(formattedOptions);
    };

    const saveIdsData = ids => {
        setMsvIds(ids);
        onChange(ids);
    };

    const openAddMsvIdModal = e => {
        e.preventDefault();
        openModal(modalContent(), {
            title: <div>Generate MSV Association ID</div>,
            width: 'medium',
        });
    };

    const handleAddMsvId = async values => {
        const {id} = routeParams;
        if (id && typeof generateMsvIds === 'function') {
            const generatedIds = await generateMsvIds(id, values.licensor.value, values.licensee.value, data);
            if (Array.isArray(generatedIds) && generatedIds.length > 0) {
                const updatedMsvIds = [...msvIds, ...generatedIds];
                setMsvIds(updatedMsvIds);
                onChange([...updatedMsvIds]);
            }
        }
        closeModal();
    };

    const modalContent = () => {
        return (
            <div>
                <AKForm onSubmit={values => handleAddMsvId(values)}>
                    {({formProps, reset}) => (
                        <form {...formProps}>
                            <Field name="licensor" label="Licensor" isRequired>
                                {({fieldProps}) => (
                                    <Dropdown
                                        {...fieldProps}
                                        value={fieldProps.value?.value}
                                        placeholder="Select"
                                        className="nexus-c-modal__select-container"
                                        options={licensorOptions}
                                        columnClass="col-12"
                                        filter={true}
                                        onChange={e => {
                                            const value = licensorOptions.find(x => x.value === e.value);
                                            fieldProps.onChange(value);
                                        }}
                                    />
                                )}
                            </Field>
                            <Field name="licensee" label="Licensee" isRequired>
                                {({fieldProps}) => (
                                    <Dropdown
                                        {...fieldProps}
                                        value={fieldProps.value?.value}
                                        placeholder="Select"
                                        className="nexus-c-modal__select-container-bottom"
                                        options={licenseeOptions}
                                        columnClass="col-12"
                                        filter={true}
                                        onChange={e => {
                                            const value = licenseeOptions.find(x => x.value === e.value);
                                            fieldProps.onChange(value);
                                        }}
                                    />
                                )}
                            </Field>
                            <FormFooter>
                                <div className="nexus-c-modal__form-footer">
                                    <Button label="Generate ID" type="submit" className="p-button-outlined" />
                                    <Button
                                        label="Cancel"
                                        className="p-button-outlined p-button-secondary nexus-c-modal__cancel-button"
                                        onClick={() => {
                                            reset();
                                            closeModal();
                                        }}
                                    />
                                </div>
                            </FormFooter>
                        </form>
                    )}
                </AKForm>
            </div>
        );
    };

    return (
        <div>
            <NexusTagsContainer data={data} saveData={saveIdsData} isEdit={isEdit} />
            {isEdit && (
                <div className="nexus-c-msv-ids-add-button">
                    <Button
                        label="+ Add MSV Association ID"
                        onClick={openAddMsvIdModal}
                        className="p-button-outlined p-button-secondary"
                    />
                </div>
            )}
        </div>
    );
};

MsvIds.propTypes = {
    data: PropTypes.array,
    isEdit: PropTypes.bool,
    selectValues: PropTypes.object,
    onChange: PropTypes.func,
    generateMsvIds: PropTypes.func,
};

MsvIds.defaultProps = {
    data: [],
    isEdit: false,
    selectValues: {},
    onChange: () => null,
    generateMsvIds: undefined,
};

export default MsvIds;
