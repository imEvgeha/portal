import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {isEmpty, pickBy, without} from 'lodash';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import {useForm} from 'react-hook-form';
import {constructFieldPerType} from './dynamic-fields/FieldsPerType';

const CreateEditConfig = ({values, visible, onHide, schema, onSubmit, displayName, label}) => {
    const [isVisible, setIsVisible] = useState(visible);
    const form = useForm({mode: 'all', reValidateMode: 'onChange'});

    const constructFields = (schema, form, values) => {
        return schema?.map(elementSchema => {
            return constructFieldPerType(
                elementSchema,
                form,
                values?.[elementSchema?.name] || '',
                undefined,
                undefined
            );
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
                    const arr = without(tmp[key], null, undefined);
                    formValues = {...formValues, [key]: arr};
                } else {
                    formValues = {...formValues, [key]: tmp[key]};
                }
            });
            onSubmit(formValues);
            onHideDialog();
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
            style={{width: '50vw'}}
            footer={footer}
            closeOnEscape={false}
            header={displayName}
            closable={false}
        >
            <form>
                <div className="row">{constructFields(schema, form, values)}</div>
            </form>
        </Dialog>
    );
};

CreateEditConfig.propTypes = {
    values: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]).isRequired,
    visible: PropTypes.bool,
    schema: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    onSubmit: PropTypes.func.isRequired,
    displayName: PropTypes.string,
    label: PropTypes.string,
    onHide: PropTypes.func.isRequired,
};

CreateEditConfig.defaultProps = {
    visible: false,
    displayName: '',
    label: '',
};

export default CreateEditConfig;
