import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {default as AKForm} from '@atlaskit/form';
import _ from 'lodash';
import Field from './Field';

const Form = ({fields, data, onSubmit}) => (
    <AKForm onSubmit={onSubmit}>
        {({formProps, dirty, submitting}) => (
            <form {...formProps}>
                {Object.keys(fields).map(key => (
                    <Field key={key} name={key} defaultValue={_.get(data, fields[key].path)} {...fields[key]} />
                ))}
                <Button type="submit" appearance="primary" isDisabled={!dirty || submitting}>
                    Submit
                </Button>
            </form>
        )}
    </AKForm>
);

Form.propTypes = {
    fields: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    onSubmit: PropTypes.func,
};

Form.defaultProps = {
    onSubmit: undefined,
};

export default Field;
