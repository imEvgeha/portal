import React, {useState, useEffect, forwardRef, useImperativeHandle} from 'react';
import PropTypes from 'prop-types';
import {isArray, isEmpty, isObject} from 'lodash';
import {Button} from 'primereact/button';
import './CustomComplexFilter.scss';
import ModuleRenderer from '../module-renderer-for-complex-filter/ModuleRenderer';

const CustomComplexFilter = forwardRef((props, ref) => {
    const [selectedData, setSelectedData] = useState({});

    useEffect(() => {
        if (!isEmpty(selectedData)) {
            props.filterChangedCallback();
        }
    }, [selectedData]);

    const onChangeSelectedData = e => {
        setSelectedData(e);
    };

    // expose AG Grid Filter Lifecycle callbacks
    useImperativeHandle(ref, () => {
        return {
            doesFilterPass() {
                return true;
            },

            isFilterActive() {
                return !!selectedData;
            },

            getModel() {
                if (selectedData) {
                    return {
                        type: 'equals',
                        filter: selectedData?.filter || selectedData,
                    };
                }
            },

            setModel(val) {
                onChangeSelectedData(val);
            },
        };
    });

    const clearObjFunction = async () => {
        const emptySelectedData = {};

        const returnEmptyVal = (key, obj) => {
            if (isArray(obj[key])) {
                return [];
            }
            if (isObject(obj[key])) {
                return {};
            }
            return undefined;
        };

        for (const key in selectedData) {
            emptySelectedData[key] = returnEmptyVal(key, selectedData);
        }

        onChangeSelectedData(emptySelectedData);
    };

    return (
        <div className="nexus-c-custom-complex-filter">
            <div>
                {props.schema.map((item, index) => (
                    <ModuleRenderer
                        item={item}
                        selectedData={selectedData}
                        onChangeSelectedData={onChangeSelectedData}
                        key={index}
                    />
                ))}
            </div>
            <Button
                className="p-button-text nexus-c-custom-complex-filter--clear"
                label="Clear"
                onClick={clearObjFunction}
            />
        </div>
    );
});

CustomComplexFilter.propTypes = {
    schema: PropTypes.array,
    filterChangedCallback: PropTypes.func,
};

CustomComplexFilter.defaultProps = {
    schema: [],
    filterChangedCallback: () => null,
};

export default CustomComplexFilter;
