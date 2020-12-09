import React from 'react';
import PropTypes from 'prop-types';
import {renderNexusField} from '../utils';
import {VIEWS} from '../constants';
import './NexusArrayWithTabs.scss';

const NexusArrayWithTabs = ({fields, getValues, view, selectValues, data, setFieldValue, config, isUpdate}) => {
    return (
        <div className="nexus-c-nexus-array-with-tabs">
            <div className="nexus-c-nexus-array-with-tabs__tabs">SIDEBAR</div>
            <div className="nexus-c-nexus-array-with-tabs__fields">
                {Object.keys(fields).map((key, index) => {
                    return (
                        <div key={index} className="nexus-c-nexus-array-with-tabs__field">
                            {renderNexusField(key, view, getValues, {
                                initialData: data[0],
                                field: fields[key],
                                selectValues,
                                setFieldValue,
                                config,
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

NexusArrayWithTabs.propTypes = {
    fields: PropTypes.object,
    view: PropTypes.string,
    data: PropTypes.array,
    getValues: PropTypes.func,
    setFieldValue: PropTypes.func,
    selectValues: PropTypes.object,
    config: PropTypes.array,
    isUpdate: PropTypes.bool,
};

NexusArrayWithTabs.defaultProps = {
    fields: {},
    view: VIEWS.VIEW,
    data: [],
    getValues: undefined,
    setFieldValue: undefined,
    selectValues: {},
    config: [],
    isUpdate: false,
};

export default NexusArrayWithTabs;
