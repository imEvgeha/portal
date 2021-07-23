import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {FormFooter} from '@atlaskit/form';
import {default as AKForm} from '@atlaskit/form/Form';
import {get} from 'lodash';
import {renderNexusField} from '../utils';
import {VIEWS} from '../constants';

const NexusArrayCreateModal = ({
    fields,
    handleModalSubmit,
    selectValues,
    data,
    setFieldValue,
    generateMsvIds,
    searchPerson,
    castCrewConfig,
    initialData,
    closeModal,
}) => {
    const [updatedValues, setUpdatedValues] = useState(null);

    const getVisibleFields = allFields => {
        const updateFields = {...allFields};
        Object.keys(allFields).filter(key => {
            const hide = get(allFields[key], 'hideInCreate');
            if (hide && updateFields[key]) {
                delete updateFields[key];
            }
        });
        return updateFields;
    };

    return (
        <div>
            <AKForm onSubmit={values => handleModalSubmit(values)}>
                {({formProps, reset, getValues}) => (
                    <form {...formProps}>
                        <div>
                            {Object.keys(getVisibleFields(fields)).map((key, index) => {
                                return (
                                    <div key={`${data.id}_${key}`} className="nexus-c-nexus-array-with-tabs__field">
                                        {renderNexusField(key, VIEWS.CREATE, getValues, generateMsvIds, {
                                            field: fields[key],
                                            selectValues,
                                            setFieldValue,
                                            searchPerson,
                                            castCrewConfig,
                                            initialData: {contentType: initialData.contentType},
                                            setUpdatedValues,
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                        <FormFooter>
                            <Button type="submit" appearance="primary">
                                Submit
                            </Button>
                            <Button
                                className="nexus-c-modal__cancel-button"
                                appearance="danger"
                                onClick={() => {
                                    reset();
                                    closeModal();
                                }}
                            >
                                Cancel
                            </Button>
                        </FormFooter>
                    </form>
                )}
            </AKForm>
        </div>
    );
};

NexusArrayCreateModal.propTypes = {
    fields: PropTypes.object,
    data: PropTypes.array,
    getValues: PropTypes.func,
    setFieldValue: PropTypes.func,
    selectValues: PropTypes.object,
    name: PropTypes.string.isRequired,
    generateMsvIds: PropTypes.func,
    searchPerson: PropTypes.func,
    regenerateAutoDecoratedMetadata: PropTypes.func,
    castCrewConfig: PropTypes.object,
    setRefresh: PropTypes.func,
    initialData: PropTypes.object,
    closeModal: PropTypes.func,
    handleModalSubmit: PropTypes.func,
};

NexusArrayCreateModal.defaultProps = {
    fields: {},
    data: [],
    getValues: undefined,
    setFieldValue: undefined,
    selectValues: {},
    generateMsvIds: undefined,
    searchPerson: undefined,
    regenerateAutoDecoratedMetadata: undefined,
    castCrewConfig: {},
    setRefresh: undefined,
    initialData: {},
    closeModal: undefined,
    handleModalSubmit: undefined,
};

export default NexusArrayCreateModal;
