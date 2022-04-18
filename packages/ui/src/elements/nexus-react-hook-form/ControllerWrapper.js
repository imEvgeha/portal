import React from 'react';
import PropTypes from 'prop-types';
import FieldError from '@vubiquity-nexus/portal-ui/lib/elements/nexus-field-error/FieldError';
import FieldLabel from '@vubiquity-nexus/portal-ui/lib/elements/nexus-field-label/FieldLabel';
import {isEmpty} from 'lodash';
import {Controller} from 'react-hook-form';

const ControllerWrapper = ({
    title,
    inputName,
    control,
    required,
    handleChange,
    register,
    errors,
    additionalValidation,
    controllerClassName,
    isItCheckbox,
    labelClassName,
    children,
}) => {
    const FieldTitle = () => (
        <FieldLabel
            htmlFor={inputName}
            label={title}
            additionalLabel={undefined}
            isRequired={required}
            className={isItCheckbox ? 'checkbox-label' : labelClassName}
            shouldUpper={false}
        />
    );

    return (
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
                render={({field}) => (
                    <div>
                        {!isItCheckbox && <FieldTitle />}
                        <div className={!isEmpty(errors) ? 'p-field p-field-error' : 'p-field'}>
                            {React.Children.map(children, child => {
                                if (React.isValidElement(child)) {
                                    return React.cloneElement(child, {
                                        ...field,
                                        checked: isItCheckbox ? field.value : undefined,
                                        onChange: e => {
                                            handleChange(e);
                                            field.onChange(e);
                                        },
                                    });
                                }
                                return child;
                            })}
                            {isItCheckbox && <FieldTitle />}
                            <FieldError error={errors} />
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

ControllerWrapper.propTypes = {
    title: PropTypes.string.isRequired,
    inputName: PropTypes.string.isRequired,
    control: PropTypes.any.isRequired,
    register: PropTypes.func.isRequired,
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
