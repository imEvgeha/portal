import React from 'react';
import PropTypes from 'prop-types';
import {Dialog} from 'primereact/dialog';
import {useForm} from 'react-hook-form';
import {constructFieldPerType} from './FieldsPerType';

const CreateEditConfig = ({value, visible, onHide, onRemoveItem, onCancel, schema, onSubmit, displayName, label}) => {
    const form = useForm({});

    const constructFields = (schema, form, value) => {
        return schema?.map(elementSchema => {
            return constructFieldPerType(elementSchema, form, value[elementSchema.name]);
        });
    };

    return (
        <Dialog
            key="dlgCreateEditConfig"
            visible={visible}
            onHide={onHide}
            breakpoints={{'960px': '75vw', '640px': '100vw'}}
            style={{width: '50vw'}}
        >
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="row">{constructFields(schema, form, value)}</div>
            </form>
        </Dialog>
    );
};

CreateEditConfig.propTypes = {
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]).isRequired,
    visible: PropTypes.bool,
    onRemoveItem: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
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
