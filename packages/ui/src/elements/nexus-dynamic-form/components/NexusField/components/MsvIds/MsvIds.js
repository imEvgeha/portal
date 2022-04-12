import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {Field, FormFooter} from '@atlaskit/form';
import {default as AKForm} from '@atlaskit/form/Form';
import Select from '@atlaskit/select';
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

    const openAddMsvIdModal = () => {
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
                                    <Select
                                        options={licensorOptions}
                                        {...fieldProps}
                                        className="nexus-c-modal__select-container"
                                        classNamePrefix="nexus-c-modal__select"
                                    />
                                )}
                            </Field>
                            <Field name="licensee" label="Licensee" isRequired>
                                {({fieldProps}) => (
                                    <Select
                                        options={licenseeOptions}
                                        {...fieldProps}
                                        className="nexus-c-modal__select-container-bottom"
                                        classNamePrefix="nexus-c-modal__select-bottom"
                                    />
                                )}
                            </Field>
                            <FormFooter>
                                <div className="nexus-c-modal__form-footer">
                                    <Button type="submit" appearance="primary">
                                        Generate ID
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
                    <Button onClick={openAddMsvIdModal}>+ Add MSV Association ID</Button>
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
