import React from 'react';
import PropTypes from 'prop-types';
import {isEmpty} from 'lodash';
import {Form} from 'react-forms-processor';
import {renderer} from 'react-forms-processor-atlaskit';
import './CustomComplexFilter.scss';

export class CustomComplexFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.initialFilters,
        };
    }

    onChange = value => {
        if (!value) {
            return;
        } // Filter doesn't persist when switching ingest without this check
        const {filterChangedCallback} = this.props;

        this.setState({value}, filterChangedCallback);
    };

    setModel = val => {
        this.onChange(val);
    };

    getModel = () => {
        const {value} = this.state;
        return {
            type: 'equals',
            filter: value,
        };
    };

    isFilterActive = () => {
        const {value} = this.state;
        return value && !isEmpty(value);
    };

    doesFilterPass = () => {
        return true;
    };

    render() {
        const {schema} = this.props;
        const {value} = this.state;

        return (
            <div className="nexus-c-custom-complex-filter">
                <Form renderer={renderer} defaultFields={schema} value={value} onChange={this.onChange} />
            </div>
        );
    }
}

CustomComplexFilter.propTypes = {
    initialFilters: PropTypes.object,
    schema: PropTypes.arrayOf(PropTypes.object).isRequired,
    filterChangedCallback: PropTypes.func.isRequired,
};

CustomComplexFilter.defaultProps = {
    initialFilters: {},
};

export default CustomComplexFilter;
