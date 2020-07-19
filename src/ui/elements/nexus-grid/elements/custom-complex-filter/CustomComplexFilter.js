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
            value: props.initialFilters
        };
    }

    onChange = (val) => {
        if (!val) return; // Filter doesn't persist when switching ingest without this check

        this.setState({value: val}, this.props.filterChangedCallback);
    };

    setModel = (val) => {
        this.onChange(val);
    };

    getModel = () => {
        return ({
            type: 'equals',
            filter: this.state.value
        });
    };

    isFilterActive = () => {
        return this.state.value && !isEmpty(this.state.value);
    };

    doesFilterPass = () => {
        return true;
    };
    render () {
        return (
            <div className='nexus-c-custom-complex-filter'>
                <Form
                    renderer={renderer}
                    defaultFields={this.props.schema}
                    value={this.state.value}
                    onChange={this.onChange}
                />
            </div>
        );
    }
}

CustomComplexFilter.propTypes = {
    initialFilters: PropTypes.object,
    schema: PropTypes.arrayOf(PropTypes.object).isRequired,
    filterChangedCallback: PropTypes.func.isRequired
};

CustomComplexFilter.defaultProps = {
    initialFilters: {}
};

export default CustomComplexFilter;


