import React from 'react';
import PropTypes from 'prop-types';
import {isObject, isObjectEmpty} from '@vubiquity-nexus/portal-utils/lib/Common';
import './CustomReadOnlyFilter.scss';

class CustomReadOnlyFloatingFilter extends React.Component {
    constructor(props) {
        super(props);
        const {readOnlyValue} = this.props;

        this.state = {
            value: readOnlyValue,
        };
    }

    render() {
        const {value} = this.state;
        const content = isObject(value) && isObjectEmpty(value) ? '' : value;

        return (
            <div className="nexus-c-custom-read-only-floating-filter">
                <span title={content}>{content}</span>
            </div>
        );
    }
}

CustomReadOnlyFloatingFilter.propTypes = {
    readOnlyValue: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

CustomReadOnlyFloatingFilter.defaultProps = {
    readOnlyValue: {},
};

export default CustomReadOnlyFloatingFilter;
