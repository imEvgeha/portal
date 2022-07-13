import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {FormFooter} from '@atlaskit/form';
import NexusDynamicForm from '../../../../NexusDynamicForm';

const AddRowDataItem = ({schema, selectValues, onAddRowDataItem, closeModal}) => {
    const formFooter = () => (
        <FormFooter>
            <Button className="className='mx-2'" appearance="danger" onClick={() => closeModal()}>
                Cancel
            </Button>

            <Button type="submit" appearance="primary" className="mx-2">
                Submit
            </Button>
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
