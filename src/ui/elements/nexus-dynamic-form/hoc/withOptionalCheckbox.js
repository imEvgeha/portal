import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from '@atlaskit/checkbox';
import {connect} from 'react-redux';
import {VIEWS} from '../constants';

const withOptionalCheckbox = () => WrappedComponent => {
    const ComposedComponent = props => {
        const {isOptional, useCurrentDate, setFieldValue, path, name, view, ...fieldProps} = props;
        const {value, ...restFieldProps} = fieldProps;
        const [visible, setVisible] = useState(!!(view !== VIEWS.CREATE && value && value !== ''));

        const changeCheckboxValue = () => {
            const newVisible = !visible;
            setVisible(newVisible);
            if (!newVisible) {
                setFieldValue(name, '');
            }
        };

        const getDateValue = value => {
            const val = useCurrentDate ? new Date() : value;
            return val;
        };

        return isOptional ? (
            <div className="nexuc-c-with-optional">
                <Checkbox onChange={changeCheckboxValue} defaultChecked={visible} />
                {visible && <WrappedComponent {...restFieldProps} value={getDateValue(value)} />}
            </div>
        ) : (
            <WrappedComponent {...fieldProps} />
        );
    };

    ComposedComponent.propTypes = {
        ...WrappedComponent.propTypes,
        isOptional: PropTypes.bool,
        value: PropTypes.any,
    };

    ComposedComponent.defaultProps = {
        ...WrappedComponent.defaultProps,
        isOptional: false,
        value: '',
    };

    return connect()(ComposedComponent);
};

export default withOptionalCheckbox;
