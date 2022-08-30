import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {isEmpty, omitBy, pickBy, without} from 'lodash';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import {useForm} from 'react-hook-form';
import './CreateEditConfig.scss';
import NexusEntity from '../nexus-entity/NexusEntity';
import {NEXUS_ENTITY_TYPES} from '../nexus-entity/constants';
import {constructFieldPerType} from './dynamic-fields/FieldsPerType';

const CreateEditConfig = ({
    values,
    visible,
    onHide,
    schema,
    onSubmit,
    displayName,
    label,
    submitLoading,
    cache,
    dataApi,
}) => {
    const [isVisible, setIsVisible] = useState(visible);
    const form = useForm({mode: 'all', reValidateMode: 'onChange'});
    const activeDynamicKeys = useRef({});

    const getActiveDynamicKeys = (schemaKey, keys) =>
        (activeDynamicKeys.current = {...activeDynamicKeys.current, [schemaKey]: keys});

    const constructFields = (schema, form, values) => {
        return schema?.map((elementSchema, index) => {
            return constructFieldPerType({
                elementSchema,
                form,
                value: values?.[elementSchema?.name] || '',
                className: undefined,
                customOnChange: undefined,
                cb: elementSchema.dynamic ? getActiveDynamicKeys : undefined,
                cache,
                dataApi,
                index,
                values,
            });
        });
    };

    useEffect(() => {
        !isVisible &&
            setTimeout(() => {
                onHide();
            }, 50);
    }, [isVisible]);

    const onHideDialog = () => {
        setIsVisible(false);
    };

    const submit = () => {
        if (isEmpty(form.formState.errors)) {
            const tmp = pickBy(form.getValues());
            let formValues = {};
            Object.keys(tmp).forEach(key => {
                if (Array.isArray(tmp[key])) {
                    const arr = without(tmp[key], null, undefined, '');
                    formValues = {...formValues, [key]: arr};
                } else if (typeof tmp[key] === 'object' && activeDynamicKeys.current?.[key]) {
                    let obj = pickBy(tmp[key], (value, childKey) => activeDynamicKeys.current[key].includes(childKey));
                    obj = omitBy(obj, (value, childKey) => childKey === 'unset');
                    formValues = {...formValues, [key]: obj};
                } else {
                    formValues = {...formValues, [key]: tmp[key]};
                }
            });

            onSubmit(formValues);
        }
    };

    const footer = (
        <div className="row">
            <div className="col-sm-12 text-end">
                <Button className="p-button-outlined p-button-secondary" label="Cancel" onClick={onHideDialog} />
                <Button
                    className="p-button-outlined"
                    label="OK"
                    disabled={!form.formState.isValid || isEmpty(form.formState.dirtyFields)}
                    onClick={submit}
                    loading={submitLoading}
                />
            </div>
        </div>
    );

    return (
        <Dialog
            key="dlgCreateEditConfig"
            visible={isVisible}
            onHide={onHideDialog}
            breakpoints={{'960px': '75vw', '640px': '100vw'}}
            style={{width: '70vw'}}
            footer={footer}
            closeOnEscape={false}
            header={label || `Create ${displayName}`}
            closable={false}
        >
            <form>
                <div className="row nexus-c-create-edit-config-summary-header">
                    <div className="col-12">
                        <NexusEntity type={NEXUS_ENTITY_TYPES.subsection} heading="SUMMARY" />
                    </div>
                </div>
                <div className="row">{constructFields(schema, form, values)}</div>
            </form>
        </Dialog>
    );
};

CreateEditConfig.propTypes = {
    values: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]),
    visible: PropTypes.bool,
    schema: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    onSubmit: PropTypes.func.isRequired,
    displayName: PropTypes.string,
    label: PropTypes.string,
    onHide: PropTypes.func.isRequired,
    submitLoading: PropTypes.bool,
    cache: PropTypes.object,
    dataApi: PropTypes.func,
};

CreateEditConfig.defaultProps = {
    values: undefined,
    visible: false,
    displayName: '',
    label: '',
    submitLoading: false,
    cache: {},
    dataApi: () => null,
};

export default CreateEditConfig;
