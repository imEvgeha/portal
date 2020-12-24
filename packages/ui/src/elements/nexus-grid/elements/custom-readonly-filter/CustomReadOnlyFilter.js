import React from 'react';
import PropTypes from 'prop-types';
import './CustomReadOnlyFilter.scss';

export default class CustomReadOnlyFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.readOnlyValue,
        };
    }

    setModel = model => {
        const {readOnlyValue} = this.props;
        this.setState({value: model ? model.filter : readOnlyValue});
    };

    getModel = () => {
        const {value} = this.state;
        return {
            type: 'equals',
            filter: value,
        };
    };

    isFilterActive = () => {
        return true;
    };

    doesFilterPass = () => {
        return true;
    };

    render() {
        const {value} = this.state;
        return (
            <div className="nexus-c-custom-read-only-filter">
                <span>Read Only value: {` ${value}` || ''}</span>
            </div>
        );
    }
}

CustomReadOnlyFilter.propTypes = {
    readOnlyValue: PropTypes.string,
};

CustomReadOnlyFilter.defaultProps = {
    readOnlyValue: '',
};
