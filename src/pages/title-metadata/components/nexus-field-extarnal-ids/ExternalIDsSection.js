import React from 'react';
import PropTypes from 'prop-types';
import ActionCrossCircle from '@vubiquity-nexus/portal-assets/action-cross-circle.svg';
import IconActionAdd from '@vubiquity-nexus/portal-assets/icon-action-add.svg';
import NexusEntity from '@vubiquity-nexus/portal-ui/lib/elements/nexus-entity/NexusEntity';
import ControllerWrapper from '@vubiquity-nexus/portal-ui/lib/elements/nexus-react-hook-form/ControllerWrapper';
import {
    EXTERNAL_SYSTEM_ID_EXAMPLE,
    NEXUS_ENTITY_TYPES,
} from '@vubiquity-nexus/portal-ui/src/elements/nexus-entity/constants';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {useFieldArray} from 'react-hook-form';
import './ExternalIDsSection.scss';

const ExternalIDsSection = ({control, register, errors}) => {
    const {fields, append, remove} = useFieldArray({
        control,
        name: 'externalSystemIds',
    });

    const onRemoveField = (e, index) => {
        e.preventDefault();
        e.stopPropagation();
        remove(index);
    };

    const onAddField = e => {
        e.preventDefault();
        e.stopPropagation();
        append(EXTERNAL_SYSTEM_ID_EXAMPLE);
    };

    const renderGroups = () => {
        return fields.map((field, index) => {
            return (
                <div
                    className="row d-flex align-items-center justify-content-between nexus-c-array-item"
                    key={field.id}
                >
                    <div className="col-5 nexus-c-array-input-wrapper">
                        <ControllerWrapper
                            title="EXTERNAL ID TYPE"
                            inputName={`externalSystemIds.${index}.externalSystem`}
                            errors={errors?.externalSystemIds?.[index]?.externalSystem}
                            labelClassName="nexus-c-array-label"
                            required={true}
                            control={control}
                            register={register}
                        >
                            <InputText
                                placeholder="Enter External ID type"
                                id="externalIdType"
                                name={`externalSystemIds.${index}.externalSystem`}
                                className="nexus-c-title-create_input"
                            />
                        </ControllerWrapper>
                    </div>

                    <div className="col-5 nexus-c-array-input-wrapper">
                        <ControllerWrapper
                            title="EXTERNAL ID"
                            inputName={`externalSystemIds.${index}.titleId`}
                            errors={errors?.externalSystemIds?.[index]?.titleId}
                            labelClassName="nexus-c-array-label"
                            required={true}
                            control={control}
                            register={register}
                        >
                            <InputText
                                placeholder="Enter External ID"
                                id="externalId"
                                name={`externalSystemIds.${index}.titleId`}
                                className="nexus-c-title-create_input"
                            />
                        </ControllerWrapper>
                    </div>

                    <div className="col-1 d-flex justify-content-end nexus-c-array-delete-button">
                        <Button
                            className="p-button-text"
                            icon={ActionCrossCircle}
                            onClick={e => onRemoveField(e, index)}
                        />
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="nexus-c-array-element-wrapper">
            <NexusEntity type={NEXUS_ENTITY_TYPES.subsection} heading="EXTERNAL IDs" />
            {renderGroups()}
            <div className="d-flex align-items-center justify-content-end">
                <Button
                    className="p-button-text nexus-c-array-add-button"
                    icon={IconActionAdd}
                    onClick={e => onAddField(e)}
                />
            </div>
        </div>
    );
};

ExternalIDsSection.propTypes = {
    control: PropTypes.any.isRequired,
    register: PropTypes.func.isRequired,
    errors: PropTypes.any,
};

ExternalIDsSection.defaultProps = {
    errors: undefined,
};

export default ExternalIDsSection;
