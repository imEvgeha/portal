import React, {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {Field, FormFooter} from '@atlaskit/form';
import {default as AKForm} from '@atlaskit/form/Form';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import Select from '@atlaskit/select';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import {cloneDeep} from 'lodash';
import {withRouter} from 'react-router-dom';
import {sortOptions} from '../../../../utils';
import './MsvIds.scss';

const MsvIds = ({selectValues, data, isEdit, onChange, match, generateMsvIds}) => {
    const {openModal, closeModal} = useContext(NexusModalContext);
    const [msvIds, setMsvIds] = useState([]);
    const [licensorOptions, setLicensorOptions] = useState([]);
    const [licenseeOptions, setLicenseeOptions] = useState([]);

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

    const removeMsvId = index => {
        const updatedMsvIds = [...msvIds];
        updatedMsvIds.splice(index, 1);
        setMsvIds(updatedMsvIds);
        onChange([...updatedMsvIds]);
    };

    const openAddMsvIdModal = () => {
        openModal(modalContent(), {
            title: <div>Generate MSV Association ID</div>,
            width: 'medium',
        });
    };

    const handleAddMsvId = async values => {
        const {params} = match || {};
        const {id} = params;
        if (id && typeof generateMsvIds === 'function') {
            const generatedIds = await generateMsvIds(id, values.licensor.value, values.licensee.value);
            const updatedMsvIds = [...msvIds, ...generatedIds];
            setMsvIds(updatedMsvIds);
            onChange([...updatedMsvIds]);
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
            {data.map((msvId, index) => {
                return (
                    <span key={index} className="nexus-c-msv-ids-tag">
                        <span>{msvId}</span>
                        {isEdit && (
                            <span className="nexus-c-msv-ids-tag__button" onClick={() => removeMsvId(index)}>
                                <EditorCloseIcon size="small" label="" />
                            </span>
                        )}
                    </span>
                );
            })}
            {isEdit && (
                <div>
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
    match: PropTypes.object,
    generateMsvIds: PropTypes.func,
};

MsvIds.defaultProps = {
    data: [],
    isEdit: false,
    selectValues: {},
    onChange: () => null,
    match: {},
    generateMsvIds: undefined,
};

export default withRouter(MsvIds);
