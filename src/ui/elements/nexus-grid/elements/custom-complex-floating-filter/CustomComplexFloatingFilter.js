import React from 'react';
import PropTypes from 'prop-types';
import {isObject} from 'lodash';
import './CustomComplexFloatingFilter.scss';

class CustomComplexFloatingFilter extends React.Component {
    constructor(props) {
        super(props);
        const {currentParentModel} = props;
        const {filter = {}} = currentParentModel() || {};
        this.state = {
            value: filter,
        };
    }

    onParentModelChanged = model => {
        const {filter = {}} = model || {};
        this.setState({value: filter});
    };

    render() {
        const {value = {}} = this.state;
        const arrayContent = [];
        let keyContent = '';
        isObject(value) &&
            Object.keys(value).forEach(key => {
                keyContent = '';
                if (value[key]) {
                    if (Array.isArray(value[key])) {
                        if (value[key].length > 0) {
                            keyContent = value[key].join(', ');
                        }
                    } else {
                        keyContent = value[key];
                    }

                    if (keyContent) {
                        arrayContent.push(`${key}: ${keyContent}`);
                    }
                }
            });

        const content = arrayContent.join(' ');

        return (
            <div className="nexus-c-complex-floating-filter">
                <span title={content}>{content}</span>
            </div>
        );
    }
}

CustomComplexFloatingFilter.propTypes = {
    currentParentModel: PropTypes.func,
};

CustomComplexFloatingFilter.defaultProps = {
    currentParentModel: () => ({}),
};

export default CustomComplexFloatingFilter;
