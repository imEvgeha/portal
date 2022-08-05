import React from 'react';
import PropTypes from 'prop-types';
import {InputText, Dropdown, Button} from '@portal/portal-components';
import ActionCrossCircle from '@vubiquity-nexus/portal-assets/action-cross-circle.svg';
import IconActionAdd from '@vubiquity-nexus/portal-assets/icon-action-add.svg';
import NexusEntity from '@vubiquity-nexus/portal-ui/lib/elements/nexus-entity/NexusEntity';
import {
    EXTERNAL_SYSTEM_ID_EXAMPLE,
    NEXUS_ENTITY_TYPES,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-entity/constants';
import {Action} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-entity/entity-actions/Actions.class';
import {isEmpty} from 'lodash';
import {useFieldArray} from 'react-hook-form';
import './ExternalIDsSection.scss';

const ExternalIDsSection = ({control, externalDropdownOptions, header}) => {
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
                <div className="row align-items-center" key={field.id}>
                    <div className="col-6">
                        <Dropdown
                            labelProps={{label: 'External ID type', stacked: true, isRequired: true}}
                            placeholder="Select External ID type"
                            id="externalIdType"
                            name={`externalSystemIds.${index}.externalSystem`}
                            className="nexus-c-title-create_input without-margin-bottom"
                            options={
                                !isEmpty(externalDropdownOptions)
                                    ? externalDropdownOptions?.values.map(e => e.displayName)
                                    : []
                            }
                            formControlOptions={{
                                formControlName: `externalSystemIds.${index}.externalSystem`,
                                rules: {
                                    required: {value: true, message: 'Field cannot be empty!'},
                                },
                            }}
                        />
                    </div>

                    <div className="col-5">
                        <InputText
                            formControlOptions={{
                                formControlName: `externalSystemIds.${index}.titleId`,
                                rules: {
                                    required: {value: true, message: 'Field cannot be empty!'},
                                },
                            }}
                            labelProps={{label: 'External ID', stacked: true, isRequired: true}}
                            placeholder="Enter External ID"
                            id="externalId"
                            name={`externalSystemIds.${index}.titleId`}
                            className="nexus-c-title-create_input without-margin-bottom"
                        />
                    </div>

                    <div className="col-1  px-2 text-md-start text-lg-start text-xl-center">
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
            position: 4,
            disabled: false,
            buttonId: 'btnAddSection',
        }),
    ];

    return (
        <div className="external-ids-section">
            <div className="row">
                <div className="col-12">
                    <NexusEntity type={NEXUS_ENTITY_TYPES.subsection} actions={groupActions()} heading={header} />
                    {renderGroups()}
                </div>
            </div>
        </div>
    );
};

ExternalIDsSection.propTypes = {
    control: PropTypes.any.isRequired,
    externalDropdownOptions: PropTypes.object,
    header: PropTypes.string,
};

ExternalIDsSection.defaultProps = {
    externalDropdownOptions: {},
    header: 'EXTERNAL IDs',
};

export default ExternalIDsSection;
