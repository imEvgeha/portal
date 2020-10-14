import React, {useState} from 'react';
import PropTypes from "prop-types";
import {Checkbox} from "@atlaskit/checkbox";
import {connect} from "react-redux";


const withOptional = () => WrappedComponent => {

    const ComposedComponent = props => {
        const {isOptional, value, name, setFieldValue} = props;
        const [visible, setVisible] = useState(!!(value && value !== ""));

        const changeCheckboxValue = () => {
            const newVisible = !visible;
            setVisible(newVisible);
            if(!newVisible){
                setFieldValue(name, "");
            }
        };

        return (
            isOptional?
                <div className='nexuc-c-with-optional'>
                    <Checkbox onChange={changeCheckboxValue} defaultChecked={visible} />
                    {visible &&
                        <WrappedComponent
                            {...props}
                        />
                    }
                </div>
                :
                <WrappedComponent
                    {...props}
                />
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
        value: "",
    };

    return connect()(ComposedComponent);
};

export default withOptional;
