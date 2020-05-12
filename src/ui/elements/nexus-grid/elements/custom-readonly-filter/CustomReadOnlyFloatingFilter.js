import React from 'react';
import './CustomReadOnlyFilter.scss';

class CustomReadOnlyFloatingFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.readOnlyValue
        };

    }

    onParentModelChanged = ({filter = {}}) => {
        this.setState({value: filter});
    };

    render() {

        return (
            <div className='nexus-c-custom-read-only-floating-filter'>
                {this.props.readOnlyValue}
            </div>
        );
    }
}

export default CustomReadOnlyFloatingFilter;
