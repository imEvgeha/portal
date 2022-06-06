import React from 'react';
import PropTypes from 'prop-types';
import {InputText, Button} from '@portal/portal-components';
import ActionCrossCircle from '@vubiquity-nexus/portal-assets/action-cross-circle.svg';
import IconActionAdd from '@vubiquity-nexus/portal-assets/icon-action-add.svg';
import NexusEntity from '@vubiquity-nexus/portal-ui/lib/elements/nexus-entity/NexusEntity';
import {
    EXTERNAL_SYSTEM_ID_EXAMPLE,
    NEXUS_ENTITY_TYPES,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-entity/constants';
import {Action} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-entity/entity-actions/Actions.class';
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
                <div className="row d-flex align-items-start justify-content-between nexus-c-array-item" key={field.id}>
                    <div className="col-5 nexus-c-array-input-wrapper">
                        <InputText
                            formControlOptions={{
                                formControlName: `externalSystemIds.${index}.externalSystem`,
                                rules: {
                                    required: {value: true, message: 'Field cannot be empty!'},
                                },
                            }}
                            labelProps={{label: 'Enter External ID type', stacked: true, isRequired: true}}
                            placeholder="Enter External ID type"
                            id="externalIdType"
                            name={`externalSystemIds.${index}.externalSystem`}
                            className="nexus-c-title-create_input without-margin-bottom"
                        />
                    </div>

                    <div className="col-5 nexus-c-array-input-wrapper">
                        <InputText
                            formControlOptions={{
                                formControlName: `externalSystemIds.${index}.titleId`,
                                rules: {
                                    required: {value: true, message: 'Field cannot be empty!'},
                                },
                            }}
                            labelProps={{label: 'Enter External ID', stacked: true, isRequired: true}}
                            placeholder="Enter External ID"
                            id="externalId"
                            name={`externalSystemIds.${index}.titleId`}
                            className="nexus-c-title-create_input without-margin-bottom"
                        />
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

    const groupActions = () => [
        new Action({
            icon: IconActionAdd,
            action: e => onAddField(e),
            position: 5,
            disabled: false,
            buttonId: 'btnAddSection',
        }),
    ];

    return (
        <div className="nexus-c-array-element-wrapper">
            <NexusEntity type={NEXUS_ENTITY_TYPES.subsection} actions={groupActions()} heading="EXTERNAL IDs" />
            {renderGroups()}
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
