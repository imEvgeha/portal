import React from 'react';
import './CustomReadOnlyFilter.scss';
import PropTypes from 'prop-types';

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
            filter: this.state.value
        });
    };

    isFilterActive = () => {
        return true;
    };

    doesFilterPass = () => {
        return true;
    };

    render () {
        return (
            <div className='nexus-c-custom-read-only-filter'>
                <span>Read Only value: {' ' + this.state.value || ''}</span>
            </div>
        );
    }
}

CustomReadOnlyFilter.propTypes = {
    readOnlyValue: PropTypes.string,
};

CustomReadOnlyFilter.defaultProps = {
    readOnlyValue: ''
};
