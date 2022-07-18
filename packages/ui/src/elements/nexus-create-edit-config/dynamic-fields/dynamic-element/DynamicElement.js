import React, {useCallback, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import ActionCrossCircle from '@vubiquity-nexus/portal-assets/action-cross-circle.svg';
import IconActionAdd from '@vubiquity-nexus/portal-assets/icon-action-add.svg';
import {debounce, isEmpty, toUpper} from 'lodash';
import {InputText} from 'primereact/inputtext';
import NexusEntity from '../../../nexus-entity/NexusEntity';
import {NEXUS_ENTITY_TYPES} from '../../../nexus-entity/constants';
import {Action} from '../../../nexus-entity/entity-actions/Actions.class';
import {constructFieldPerType} from '../FieldsPerType';
import './DynamicElement.scss';

const DynamicElement = ({elementsSchema, form, values, onKeysChanged, cache, dataApi}) => {
    const initializeSections = () => {
        const sectionKeys = isEmpty(values) ? ['unset'] : Object.keys(values);

        if (isEmpty(values)) {
            return [];
        }

        return sectionKeys.map((key, index) => ({
            ...elementsSchema,
            key,
            name: `${elementsSchema.name}.${key}`,
            id: `${elementsSchema.name}.${key}`,
            elementId: `element_${index}`,
            fields: elementsSchema.misc.fields,
            idAttribute: elementsSchema.misc.idAttribute,
            values: values[key] || [],
            dynamic: false,
        }));
    };

    const [sections, setSections] = useState(initializeSections());

    const initLabels = () => {
        let tmpLabels = {};
        sections.forEach(s => (tmpLabels = {...tmpLabels, [s.elementId]: s.key}));
        return tmpLabels;
    };

    const [labels, setLabels] = useState(initLabels());
    const labelsRef = useRef({...labels});

    const reInitSections = useCallback(
        debounce(() => {
            const newSections = sections.map(s => {
                const value = labelsRef.current?.[s.elementId];
                return {
                    ...s,
                    key: value,
                    name: `${elementsSchema.name}.${value}`,
                    id: `${elementsSchema.name}.${value}`,
                };
            });
            setSections(newSections);
        }, 300),
        [sections]
    );

    const constructSectionElement = (sectionSchema, index) => {
        const hasKey = !!sectionSchema.name?.split('.')?.[1];
        return (
            hasKey &&
            constructFieldPerType({
                elementSchema: sectionSchema,
                form,
                value: sectionSchema.values || '',
                className: 'mb-2',
                customOnChange: undefined,
                cb: undefined,
                cache,
                dataApi,
                index,
            })
        );
    };

    useEffect(() => {
        if (onKeysChanged) {
            onKeysChanged(
                elementsSchema.name,
                sections.map(s => s.key)
            );
        }
    }, [sections]);

    const onLabelChange = (e, section) => {
        const lbls = {...labels, [section.elementId]: e.target.value};
        reInitSections();

        const formValue = form.getValues(elementsSchema.name);
        delete formValue[section.key];
        form.setValue(elementsSchema.name, {...formValue}, {shouldDirty: true});
        form.unregister(`${elementsSchema.name}.${section.key}`);

        labelsRef.current = lbls;
        setLabels(lbls);
    };

    const panelActions = index => [
        new Action({
            icon: ActionCrossCircle,
            action: e => {
                e.preventDefault();
                e.stopPropagation();
                removeSection(index);
            },
            position: 3,
            disabled: false,
            buttonId: 'btnDeleteSection',
        }),
    ];

    const panelBody = (section, index) => (
        <div className="row">
            <div className="col-12">
                <InputText
                    key={`${section.elementId}_inp_key`}
                    id={`${section.elementId}_inp_id`}
                    name={`${section.name}_inp_name`}
                    onKeyPress={e => {
                        e.key === 'Enter' && e.preventDefault();
                    }}
                    value={labels[section.elementId]}
                    tooltip="Section Key Name"
                    onChange={e => onLabelChange(e, section)}
                    placeholder="Section Key Name"
                />
            </div>

            {constructSectionElement(section, index)}
        </div>
    );

    const section = () => {
        return sections.map((section, index) => {
            return (
                <div
                    className="row align-items-center nexus-c-dynamic-element-entry my-2"
                    key={`nexus-c-field-group${index}`}
                >
                    <div className="col-12">
                        <NexusEntity
                            type={NEXUS_ENTITY_TYPES.default}
                            body={panelBody(section, index)}
                            heading={labels[section.elementId]}
                            actions={panelActions(index)}
                        />
                    </div>
                </div>
            );
        });
    };

    const addSection = () => {
        const newSections = [...sections];
        const elementId = `element_${sections.length}`;
        const key = 'unset';

        newSections.push({
            ...elementsSchema,
            key,
            elementId,
            name: `${elementsSchema.name}.unset`,
            id: `${elementsSchema.name}.unset`,
            fields: elementsSchema.misc.fields,
            idAttribute: elementsSchema.misc.idAttribute,
            values: [],
            dynamic: false,
        });

        const lbls = {...labels, [elementId]: key};
        labelsRef.current = lbls;
        setLabels({...lbls});
        setSections(newSections);
    };

    const removeSection = index => {
        const tmpSections = [...sections];
        tmpSections.splice(index, 1);

        const formValue = form.getValues(elementsSchema.name);
        delete formValue?.[sections[index].key];
        form.setValue(elementsSchema.name, {...formValue}, {shouldDirty: true});

        const lbls = {...labels};
        delete lbls[sections[index].elementId];
        labelsRef.current = lbls;
        setLabels({...lbls});
        setSections(tmpSections);
    };

    const headerActions = () => [
        new Action({
            icon: IconActionAdd,
            action: e => {
                e.preventDefault();
                e.stopPropagation();
                addSection();
            },
            position: 4,
            disabled: false,
            buttonId: 'btnEditConfig',
        }),
    ];

    return (
        <div className="nexus-c-dynamic-element-wrapper">
            {elementsSchema.label && (
                <NexusEntity
                    type={NEXUS_ENTITY_TYPES.subsection}
                    heading={toUpper(elementsSchema.label)}
                    actions={headerActions()}
                />
            )}
            {section()}
        </div>
    );
};

DynamicElement.propTypes = {
    elementsSchema: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    values: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]),
    onKeysChanged: PropTypes.func,
    cache: PropTypes.object,
    dataApi: PropTypes.func,
};

DynamicElement.defaultProps = {
    values: undefined,
    onKeysChanged: undefined,
    cache: {},
    dataApi: () => null,
};

export default DynamicElement;
