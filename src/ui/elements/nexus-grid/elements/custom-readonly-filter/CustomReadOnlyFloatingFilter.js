import React from 'react';
import './CustomReadOnlyFilter.scss';
import {isObject, isObjectEmpty} from '../../../../../util/Common';

class CustomReadOnlyFloatingFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.readOnlyValue
        };
    }

    onParentModelChanged = () => {
    }

    render() {
        const {value} = this.state;
        const content = (isObject(value) && isObjectEmpty(value)) ? '' : value;

        return (
            <div className='nexus-c-custom-read-only-floating-filter'>
                <span title={content}>{content}</span>
            </div>
        );
    }
}

export default CustomReadOnlyFloatingFilter;
