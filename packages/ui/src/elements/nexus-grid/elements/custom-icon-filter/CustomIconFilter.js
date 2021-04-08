import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import WarningIcon from '@atlaskit/icon/glyph/editor/warning';
import {isEmpty} from 'lodash';
import './CustomIconFilter.scss';

export class CustomIconFilter extends React.Component {
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
            filter: {updatedCatalogReceived: true},
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
        const {value} = this.state;

        return (
            <div className="nexus-c-custom-complex-filter">
                <Button onClick={this.onChange}>
                    <WarningIcon primaryColor="#a5adba" width="30px" />
                </Button>
            </div>
        );
    }
}

CustomIconFilter.propTypes = {
    initialFilters: PropTypes.object,
    filterChangedCallback: PropTypes.func.isRequired,
};

CustomIconFilter.defaultProps = {
    initialFilters: {},
};

export default CustomIconFilter;
