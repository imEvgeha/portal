import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {renderNexusField} from '../utils';
import SideTabs from './SideTabs/SideTabs';
import {VIEWS} from '../constants';
import './NexusArrayWithTabs.scss';

const NexusArrayWithTabs = ({
    fields,
    getValues,
    view,
    selectValues,
    data,
    setFieldValue,
    config,
    isUpdate,
    tabs,
    subTabs,
}) => {
    const [groupedData, setGroupedData] = useState({});
    const [currentData, setCurrentData] = useState(null);

    useEffect(() => {
        const groupedObj = groupBy();
        setGroupedData(groupedObj);
    }, [data]);

    const groupBy = () => {
        const keys = tabs;
        if (keys.length === 0) return {};
        return data.reduce((acc, obj) => {
            const prop = keys.length === 1 ? obj[keys[0]] : `${obj[keys[0]]} ${obj[keys[1]]}`;
            acc[prop] = acc[prop] || [];
            acc[prop].push(obj);
            return acc;
        }, {});
    };

    const changeTabData = (key, index) => {
        const newCurrentData = groupedData[key][index];
        setCurrentData(newCurrentData);
    };

    return (
        <div className="nexus-c-nexus-array-with-tabs">
            <div className="nexus-c-nexus-array-with-tabs__tabs">
                <SideTabs onChange={changeTabData} data={groupedData} subTabs={subTabs} />
            </div>
            <div className="nexus-c-nexus-array-with-tabs__fields">
                {Object.keys(fields).map((key, index) => {
                    return (
                        <div key={index} className="nexus-c-nexus-array-with-tabs__field">
                            {renderNexusField(key, view, getValues, {
                                initialData: currentData || data[0],
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
    tabs: PropTypes.array,
    subTabs: PropTypes.array,
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
    tabs: [],
    subTabs: [],
};

export default NexusArrayWithTabs;
