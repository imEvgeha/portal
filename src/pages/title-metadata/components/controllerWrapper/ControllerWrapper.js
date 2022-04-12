import React from 'react';
import PropTypes from 'prop-types';
import {Controller} from 'react-hook-form';
import {Label} from 'reactstrap';

const ControllerWrapper = ({
    title,
    inputName,
    control,
    required,
    handleChange,
    register,
    renderErrorMsg,
    errors,
    additionalValidation,
    controllerClassName,
    isItCheckbox,
    labelClassName,
    children,
}) => {
    return (
        <>
            <Label for={inputName} className={labelClassName}>
                {title}
                {required ? <span style={{color: 'red'}}>*</span> : null}
            </Label>
            <div className={`nexus-c-title-create_input-container ${controllerClassName}`}>
                <Controller
                    name={inputName}
                    control={control}
                    {...register(inputName, {
                        required: {
                            value: required,
                            message: 'Field cannot be empty!',
                        },
                        ...additionalValidation,
                    })}
                    render={({field}) =>
                        React.Children.map(children, child => {
                            if (React.isValidElement(child)) {
                                if (isItCheckbox) {
                                    return React.cloneElement(child, {
                                        ...field,
                                        checked: field.value,
                                        onChange: e => {
                                            handleChange(e);
                                            field.onChange(e.checked);
                                        },
                                    });
                                }

                                return React.cloneElement(child, {
                                    ...field,
                                    onChange: e => {
                                        handleChange(e);
                                        field.onChange(e);
                                    },
                                });
                            }
                            return child;
                        })
                    }
                />
                {errors ? renderErrorMsg(errors) : null}
            </div>
        </>
    );
};

ControllerWrapper.propTypes = {
    title: PropTypes.string.isRequired,
    inputName: PropTypes.string.isRequired,
    control: PropTypes.any.isRequired,
    register: PropTypes.func.isRequired,
    renderErrorMsg: PropTypes.func.isRequired,
    errors: PropTypes.any,
    handleChange: PropTypes.func,
    additionalValidation: PropTypes.object,
    controllerClassName: PropTypes.string,
    isItCheckbox: PropTypes.bool,
    labelClassName: PropTypes.string,
    required: PropTypes.bool,
};

ControllerWrapper.defaultProps = {
    errors: undefined,
    handleChange: () => null,
    additionalValidation: {},
    controllerClassName: '',
    isItCheckbox: false,
    labelClassName: '',
    required: false,
};

export default ControllerWrapper;
