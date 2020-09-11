import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {default as AKForm} from '@atlaskit/form';
import _ from 'lodash';
import NexusField from './NexusField';

const NexusForm = ({fields, data, onSubmit}) => (
    <AKForm onSubmit={onSubmit}>
        {({formProps, dirty, submitting}) => (
            <form {...formProps}>
                {Object.keys(fields).map(key => (
                    <NexusField
                        key={key}
                        name={key}
                        defaultValue={_.get(data, fields[key].path) || fields[key].defaultValue}
                        {...fields[key]}
                    />
                ))}
                <Button type="submit" appearance="primary" isDisabled={!dirty || submitting}>
                    Submit
                </Button>
            </form>
        )}
    </AKForm>
);

NexusForm.propTypes = {
    fields: PropTypes.object.isRequired,
    data: PropTypes.object,
    onSubmit: PropTypes.func,
};

NexusForm.defaultProps = {
    data: {},
    onSubmit: undefined,
};

export default NexusForm;
