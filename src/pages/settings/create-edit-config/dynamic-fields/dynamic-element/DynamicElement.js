import React, {useCallback, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {debounce, isEmpty} from 'lodash';
import {InputText} from 'primereact/inputtext';
import {Panel} from 'primereact/panel';
import {arrayElementButtons} from '../ArrayButtons';
import {constructFieldPerType} from '../FieldsPerType';

const DynamicElement = ({elementsSchema, form, values, onKeysChanged}) => {
    const initializeSections = () => {
        const sectionKeys = isEmpty(values) ? ['unset'] : Object.keys(values);

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

    const constructSectionElement = sectionSchema => {
        const hasKey = !!sectionSchema.name?.split('.')?.[1];
        return hasKey && constructFieldPerType(sectionSchema, form, sectionSchema.values || '', 'mb-2', undefined);
    };

    useEffect(() => {
        onKeysChanged(
            elementsSchema.name,
            sections.map(s => s.key)
        );
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

    const panelHeaderTemplate = (options, header) => {
        const toggleIcon = options.collapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up';
        return (
            <div className="nexus-c-panel-header p-panel-header" onClick={options.onTogglerClick}>
                <div className="row">
                    <div className="col-12">
                        <i onClick={options.onTogglerClick} className={`${toggleIcon} nexus-c-panel__icon`} />
                        <span className="mx-2">{header}</span>
                    </div>
                </div>
            </div>
        );
    };

    const section = () => {
        return sections.map((section, index) => {
            return (
                <div className="row align-items-center my-2" key={`nexus-c-field-group${index}`}>
                    <div className="col-10">
                        <Panel
                            headerTemplate={options => panelHeaderTemplate(options, labels[section.elementId])}
                            toggleable
                            collapsed={true}
                        >
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
                            {constructSectionElement(section)}
                        </Panel>
                    </div>
                    {arrayElementButtons(index, sections.length, addSection, () => removeSection(index), false)}
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
        delete formValue[sections[index].key];
        form.setValue(elementsSchema.name, {...formValue}, {shouldDirty: true});

        const lbls = {...labels};
        delete lbls[sections[index].elementId];
        labelsRef.current = lbls;
        setLabels({...lbls});
        setSections(tmpSections);
    };

    return section();
};

DynamicElement.propTypes = {
    elementsSchema: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    values: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]),
    onKeysChanged: PropTypes.func,
};

DynamicElement.defaultProps = {
    values: undefined,
};

export default DynamicElement;
