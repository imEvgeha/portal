import React, {useState} from 'react';
import PropTypes from 'prop-types';
import CheckboxIcon from '@atlaskit/icon/glyph/checkbox';
import CheckboxIconIndeterminate from '@atlaskit/icon/glyph/checkbox-indeterminate';
import * as colors from '@atlaskit/theme/colors';
import {themed} from '@atlaskit/theme/components';
import {gridSize} from '@atlaskit/theme/constants';
import classnames from 'classnames';
import './NexusCheckboxSelectOption.scss';

// CheckboxSelect atlaskit package as components prop has {...components, Option: CheckboxOption}
// https://bitbucket.org/atlassian/atlaskit-mk-2/src/master/packages/core/select/src/CheckboxSelect.js
// It is blocker for custom option component
// We are using Select package that import Custom Option
// Custom option has all funcionality of atalskit checkbox select options
// https://bitbucket.org/atlassian/atlaskit-mk-2/src/master/packages/core/select/src/components/input-options.js
// It is imported inside this component and updated to our need
// If @atlaskit enables custom Option inside CheckboxSelect npm we will replace Select with this package
const getPrimitiveStyles = props => {
    const {cx, className, getStyles, isDisabled, isFocused, isSelected} = props;

    const styles = {
        alignItems: 'center',
        backgroundColor: isFocused ? colors.N30 : 'transparent',
        color: 'inherit',
        display: 'flex',
        flexDirection: 'row',
        paddingBottom: 4,
        // eslint-disable-next-line no-magic-numbers
        paddingLeft: `${gridSize() * 2}px`,
        paddingTop: 4,

        ':active': {
            backgroundColor: colors.B50,
        },
    };

    const augmentedStyles = {...getStyles('option', props), ...styles};
    const bemClasses = {
        option: true,
        'option--is-disabled': isDisabled,
        'option--is-focused': isFocused,
        'option--is-selected': isSelected,
    };

    // maintain react-select API
    return [augmentedStyles, cx(null, bemClasses, className)];
};

// maintains function shape
const backgroundColor = themed({light: colors.N40A, dark: colors.DN10});
const transparent = themed({light: 'transparent', dark: 'transparent'});

// the primary color represents the outer or background element
const getPrimaryColor = ({isActive, isDisabled, isFocused, isSelected, ...rest}) => {
    let color = backgroundColor;
    if (isDisabled && isSelected) {
        color = themed({light: colors.B75, dark: colors.DN200});
    } else if (isDisabled) {
        color = themed({light: colors.N20A, dark: colors.DN10});
    } else if (isActive) {
        color = themed({light: colors.B75, dark: colors.B200});
    } else if (isFocused && isSelected) {
        color = themed({light: colors.B300, dark: colors.B75});
    } else if (isFocused) {
        color = themed({light: colors.N50A, dark: colors.DN30});
    } else if (isSelected) {
        color = colors.blue;
    }
    return color(rest);
};

// the secondary color represents the radio dot or checkmark
const getSecondaryColor = ({isActive, isDisabled, isSelected, ...rest}) => {
    let color = themed({light: colors.N0, dark2gt: colors.DN10});

    if ((isDisabled && isSelected) || (isDisabled && rest.data.isChecked)) {
        color = themed({light: colors.N70, dark: colors.DN10});
    } else if (isActive && isSelected && !isDisabled) {
        color = themed({light: colors.B400, dark: colors.DN10});
    } else if (!isSelected) {
        color = transparent;
    }
    // $FlowFixMe - theme is not found in props
    return color(rest);
};

const NexusCheckboxSelectOption = props => {
    const [isActive, setIsActive] = useState(false);
    const {getStyles, children, innerProps, innerRef, isDisabled, ...rest} = props;
    const onMouseDown = () => setIsActive(true);
    const onMouseUp = () => setIsActive(false);
    const onMouseLeave = () => setIsActive(false);

    // prop assignment
    const updatedProps = {
        ...innerProps,
        onMouseDown,
        onMouseUp,
        onMouseLeave,
    };
    const [styles, classes] = getPrimitiveStyles({getStyles, ...rest});
    const {selectProps, value, options} = rest;

    return (
        <div style={styles} className={`nexus-c-checkbox-select ${classes}`} ref={innerRef} {...updatedProps}>
            <div className="nexus-c-checkbox-select__checkbox">
                {value === '*' &&
                selectProps &&
                Array.isArray(selectProps.value) &&
                selectProps.value.length > 0 &&
                selectProps.value.length < options.filter(el => !el.isDisabled).length ? (
                    <CheckboxIconIndeterminate
                        primaryColor={getPrimaryColor({...props, isActive})}
                        secondaryColor={getSecondaryColor({...props, isSelected: true, isActive})}
                    />
                ) : (
                    <CheckboxIcon
                        primaryColor={getPrimaryColor({...props, isActive})}
                        secondaryColor={getSecondaryColor({...props, isActive})}
                    />
                )}
            </div>
            <div
                className={classnames(
                    'nexus-c-checkbox-select__text',
                    isDisabled && 'nexus-c-checkbox-select__text--disabled'
                )}
            >
                {children}
            </div>
        </div>
    );
};

NexusCheckboxSelectOption.propTypes = {
    getStyles: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    innerProps: PropTypes.object.isRequired,
    innerRef: PropTypes.node.isRequired,
    isDisabled: PropTypes.bool,
};

NexusCheckboxSelectOption.defaultProps = {
    children: null,
    isDisabled: false,
};

export default NexusCheckboxSelectOption;
