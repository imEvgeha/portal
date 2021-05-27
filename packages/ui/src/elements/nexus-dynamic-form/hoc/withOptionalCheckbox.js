import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from '@atlaskit/checkbox';
import {connect} from 'react-redux';
import {VIEWS} from '../constants';

const withOptionalCheckbox = () => WrappedComponent => {
    const ComposedComponent = props => {
        const {isOptional, maxLength, useCurrentDate, setFieldValue, path, name, view, ...fieldProps} = props;
        const {value, isDisabled, ...restFieldProps} = fieldProps;
        const [visible, setVisible] = useState(!!(view !== VIEWS.CREATE && value && value !== ''));

        // remove dispatch when isOptional = false and check for value - fix react warnings
        const {dispatch, value: val, ...propsWithoutDispatch} = fieldProps;

        const changeCheckboxValue = () => {
            const newVisible = !visible;
            setVisible(newVisible);
            if (!newVisible) {
                setFieldValue(name, '');
            }
        };

        const getDateValue = value => {
            return useCurrentDate ? new Date() : value || '';
        };

        return isOptional ? (
            <div className="nexuc-c-with-optional">
                <Checkbox isDisabled={isDisabled} onChange={changeCheckboxValue} defaultChecked={visible} />
                {visible && <WrappedComponent {...restFieldProps} value={getDateValue(value)} />}
            </div>
        ) : maxLength ? (
            <div className="nexuc-c-with-chars">
                <WrappedComponent {...propsWithoutDispatch} maxLength={maxLength} value={val || ''} />
                <div>{` ${val.length}/${maxLength}`}</div>
            </div>
        ) : (
            <WrappedComponent {...propsWithoutDispatch} value={val || ''} />
        );
    };

    ComposedComponent.propTypes = {
        ...WrappedComponent.propTypes,
        isOptional: PropTypes.bool,
        maxLength: PropTypes.bool,
        value: PropTypes.any,
    };

    ComposedComponent.defaultProps = {
        ...WrappedComponent.defaultProps,
        isOptional: false,
        maxLength: undefined,
        value: '',
    };

    return connect()(ComposedComponent);
};

export default withOptionalCheckbox;
