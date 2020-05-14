import React from 'react';
import './CustomReadOnlyFilter.scss';

export default class CustomReadOnlyFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.readOnlyValue,
        };
    }

    setModel = (model) => {
        this.setState({value : model ? model.value : this.props.readOnlyValue});
    };

    getModel = () => {
        return ({
            type: 'equals',
            filter: this.props.readOnlyValue
        });
    };

    isFilterActive = () => {
        return false;
    };

    doesFilterPass = () => {
        return true;
    };
    render () {
        return (
            <div className='nexus-c-custom-read-only-filter'>
                <span>Read Only value: {' ' + this.state.value}</span>
            </div>
        );
    }
}
