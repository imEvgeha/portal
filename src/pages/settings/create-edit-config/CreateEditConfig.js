import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import {useForm} from 'react-hook-form';
import {constructFieldPerType} from './dynamic-fields/FieldsPerType';

const CreateEditConfig = ({value, visible, onHide, onRemoveItem, schema, onSubmit, displayName, label}) => {
    const [isVisible, setIsVisible] = useState(visible);
    const form = useForm({mode: 'all', reValidateMode: 'onChange'});

    const constructFields = (schema, form, value) => {
        // console.log(schema);
        console.log(value);
        return schema?.map(elementSchema => {
            return constructFieldPerType(elementSchema, form, value?.[elementSchema?.name] || '', undefined, undefined);
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
        console.log(form.getValues());
        console.log(form.formState.errors);
        // form.handleSubmit(onSubmit(form.getValues()))
    };

    const footer = (
        <div className="row">
            <div className="col-sm-12 text-end">
                <Button className="p-button-outlined p-button-secondary" label="Cancel" onClick={onHideDialog} />
                <Button
                    className="p-button-outlined"
                    label="OK"
                    disabled={!form.formState.isValid || !form.formState.isDirty}
                    // disabled={!isEmpty(form.formState.errors)}
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
        >
            <form>
                <div className="row">{constructFields(schema, form, value)}</div>
            </form>
        </Dialog>
    );
};

CreateEditConfig.propTypes = {
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]).isRequired,
    visible: PropTypes.bool,
    onRemoveItem: PropTypes.func.isRequired,
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
