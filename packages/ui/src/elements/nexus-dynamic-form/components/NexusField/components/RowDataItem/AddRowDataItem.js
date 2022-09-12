import React from 'react';
import PropTypes from 'prop-types';
import {FormFooter} from '@atlaskit/form';
import {Button} from '@portal/portal-components';
import NexusDynamicForm from '../../../../NexusDynamicForm';

const AddRowDataItem = ({schema, selectValues, onAddRowDataItem, closeModal}) => {
    const formFooter = () => (
        <FormFooter>
            <Button label="Cancel" className="p-button-outlined p-button-secondary mx-2" onClick={() => closeModal()} />
            <Button label="Submit" className="p-button-outlined p-button-secondary mx-2" type="submit" />
        </FormFooter>
    );

    return (
        <NexusDynamicForm
            isFullScreen={true}
            schema={schema}
            selectValues={selectValues}
            hasButtons={false}
            canEdit={true}
            formFooter={formFooter()}
            onSubmit={onAddRowDataItem}
        />
    );
};

AddRowDataItem.propTypes = {
    onAddRowDataItem: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    schema: PropTypes.object.isRequired,
    selectValues: PropTypes.object,
};

AddRowDataItem.defaultProps = {
    selectValues: {},
};

export default AddRowDataItem;
