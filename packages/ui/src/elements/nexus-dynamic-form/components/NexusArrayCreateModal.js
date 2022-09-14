import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {FormFooter} from '@atlaskit/form';
import {default as AKForm} from '@atlaskit/form/Form';
import {get, isEmpty, uniqBy} from 'lodash';
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
    prefix,
    allData,
}) => {
    const [updatedValues, setUpdatedValues] = useState(null);

    const getVisibleFields = allFields => {
        const updateFields = {...allFields};
        Object.keys(allFields).forEach(key => {
            const hide = get(allFields[key], 'hideInCreate');
            if (hide && updateFields[key]) {
                delete updateFields[key];
            }
        });

        return updateFields;
    };

    const onSubmit = values => {
        const newTenantDataValues = [];
        if (!isEmpty(values?.editorial)) {
            for (const [key, value] of Object.entries(values?.editorial)) {
                if ((key === 'sasktelInventoryId' || key === 'sasktelLineupId') && value) {
                    newTenantDataValues.push({
                        name: key,
                        value,
                    });
                }
            }
            values.editorial.tenantData = {
                simpleProperties:
                    newTenantDataValues && newTenantDataValues?.length ? uniqBy(newTenantDataValues, 'name') : [],
            };
        }

        handleModalSubmit(
            values?.editorial?.castCrew
                ? values
                : {...values, editorial: {...values.editorial, castCrew: initialData?.castCrew || []}}
        );
    };

    return (
        <div>
            <AKForm onSubmit={values => onSubmit(values)}>
                {({formProps, reset, getValues}) => (
                    <form {...formProps}>
                        <div>
                            {Object.keys(getVisibleFields(fields)).map(key => {
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
                                            updatedValues: {...updatedValues, contentType: initialData.contentType},
                                            prefix,
                                            allData,
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
                                className="mx-4"
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
    generateMsvIds: PropTypes.func,
    searchPerson: PropTypes.func,
    regenerateAutoDecoratedMetadata: PropTypes.func,
    castCrewConfig: PropTypes.object,
    setRefresh: PropTypes.func,
    initialData: PropTypes.object,
    closeModal: PropTypes.func,
    handleModalSubmit: PropTypes.func,
    prefix: PropTypes.string,
    allData: PropTypes.object,
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
    prefix: undefined,
    allData: {},
};

export default NexusArrayCreateModal;
