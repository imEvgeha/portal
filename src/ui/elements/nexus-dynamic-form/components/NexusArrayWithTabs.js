import React, {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {Field as AKField, FormFooter} from '@atlaskit/form';
import {default as AKForm} from '@atlaskit/form/Form';
import {get} from 'lodash';
import {NexusModalContext} from '../../nexus-modal/NexusModal';
import {renderNexusField} from '../utils';
import SideTabs from './SideTabs/SideTabs';
import {
    VIEWS,
    NEXUS_ARRAY_WITH_TABS_ADD_BTN_LABELS,
    NEXUS_ARRAY_WITH_TABS_NO_RECORDS,
    NEXUS_ARRAY_WITH_TABS_FORM_MAPPINGS,
} from '../constants';
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
    path,
    name,
}) => {
    const {openModal, closeModal} = useContext(NexusModalContext);
    const [groupedData, setGroupedData] = useState({});
    const [currentData, setCurrentData] = useState(null);
    const [isRemoved, setIsRemoved] = useState(false);

    useEffect(() => {
        const groupedObj = groupBy(data);
        setGroupedData(groupedObj);
    }, [data]);

    const clearIsRemoved = () => {
        setIsRemoved(false);
    };

    const groupBy = values => {
        const keys = tabs;
        if (keys.length === 0) return {};
        return values.reduce((acc, obj) => {
            const prop = keys.length === 1 ? obj[keys[0]] : `${obj[keys[0]]} ${obj[keys[1]]}`;
            acc[prop] = acc[prop] || [];
            acc[prop].push(obj);
            return acc;
        }, {});
    };

    const getCurrentFormData = () => {
        const formData = getValues();
        return formData[NEXUS_ARRAY_WITH_TABS_FORM_MAPPINGS[path]];
    };

    const changeTabData = (oldSubTab, key, index) => {
        if (view === VIEWS.EDIT) {
            const currentFormData = getCurrentFormData();
            const current = currentData || data[0];
            replaceRecordInGroupedData(currentFormData, current, oldSubTab);
            const newData = replaceRecordInData(currentFormData, current);
            setFieldValue(path, newData);
        }
        const newCurrentData = groupedData[key][index];
        setCurrentData(newCurrentData);
    };

    const replaceRecordInGroupedData = (currentFormData, current, subTabIndex) => {
        if (subTabs.length) {
            let key = '';
            tabs.forEach(property => {
                key += key.length > 1 ? ` ${current[property]}` : current[property];
            });
            const updatedArray = [...groupedData[key]];
            updatedArray[subTabIndex] = {
                ...updatedArray[subTabIndex],
                ...currentFormData,
            };
            setGroupedData(prevState => {
                return {
                    ...prevState,
                    [key]: updatedArray,
                };
            });
        } else {
            const [property] = tabs;
            const key = current[property];
            setGroupedData(prevGroupedData => {
                return {
                    ...prevGroupedData,
                    [key]: [
                        {
                            ...prevGroupedData[key][0],
                            ...currentFormData,
                        },
                    ],
                };
            });
        }
    };

    const replaceRecordInData = (currentFormData, current) => {
        const newData = [...getValues()[path]];
        if (subTabs.length) {
            const keys = [...tabs, ...subTabs];
            const index = newData.findIndex(obj => {
                let isEqual = true;
                keys.forEach(key => {
                    if (obj[key] !== current[key]) isEqual = false;
                });
                return isEqual;
            });
            if (index >= 0) {
                newData[index] = {
                    ...newData[index],
                    ...currentFormData,
                };
            }
        } else {
            const [key] = tabs;
            const value = current[key];
            const index = newData.findIndex(obj => {
                return obj[key] === value;
            });
            if (index >= 0) {
                newData[index] = {
                    ...newData[index],
                    ...currentFormData,
                };
            }
        }
        return newData;
    };

    const removeCurrentRecord = (dataArr, current) => {
        if (subTabs.length) {
            return dataArr.filter(obj => {
                let isEqual = false;
                subTabs.forEach(field => {
                    if (obj[field] !== current[field]) isEqual = true;
                });
                return isEqual;
            });
        }
        return [];
    };

    const handleDeleteRecord = () => {
        const current = currentData || data[0];
        const groupedCurrent = groupBy([current]);
        const [key] = Object.keys(groupedCurrent);
        const updatedGroupedData = {...groupedData};
        updatedGroupedData[key] = removeCurrentRecord(updatedGroupedData[key], current);
        if (updatedGroupedData[key].length === 0) {
            delete updatedGroupedData[key];
        }
        setGroupedData(updatedGroupedData);
        const keys = Object.keys(updatedGroupedData);
        const newCurrentData = keys.length ? updatedGroupedData[keys[0]][0] : null;
        setCurrentData(newCurrentData);
        setIsRemoved(true);

        const newData = [...getValues()[path]];
        const keyProps = [...tabs, ...subTabs];
        const index = newData.findIndex(obj => {
            let isEqual = true;
            keyProps.forEach(keyProp => {
                if (obj[keyProp] !== current[keyProp]) isEqual = false;
            });
            return isEqual;
        });
        newData.splice(index, 1);
        setFieldValue(path, newData);
    };

    const openEditModal = () => {
        openModal(modalContent(), {
            title: <div className="nexus-c-array__modal-title">{`Add ${name} Data`}</div>,
            width: 'medium',
        });
    };

    const handleValuesFormat = values => {
        Object.keys(values).forEach(key => {
            const obj = values[key];
            if (
                obj &&
                typeof obj === 'object' &&
                !Array.isArray(obj) &&
                obj.hasOwnProperty('label') &&
                obj.hasOwnProperty('value')
            ) {
                values[key] = obj.value;
            }
        });
        return values;
    };

    const handleModalSubmit = values => {
        const properValues =
            path === 'ratings'
                ? handleValuesFormat(values)
                : handleValuesFormat(values[NEXUS_ARRAY_WITH_TABS_FORM_MAPPINGS[path]]);
        const groupedValues = groupBy([properValues]);
        const [key] = Object.keys(groupedValues);
        const updatedGroupedData = {...groupedData};
        updatedGroupedData[key] = updatedGroupedData[key] ? updatedGroupedData[key] : [];
        updatedGroupedData[key].push(properValues);
        setGroupedData(updatedGroupedData);

        const newData = [...getValues()[path]];
        newData.push(properValues);
        setFieldValue(path, newData);
        closeModal();
    };

    const modalContent = () => {
        return (
            <div>
                <AKForm onSubmit={values => handleModalSubmit(values)}>
                    {({formProps, reset, getValues}) => (
                        <form {...formProps}>
                            <div>
                                {Object.keys(fields).map((key, index) => {
                                    return (
                                        <div key={index} className="nexus-c-nexus-array-with-tabs__field">
                                            {renderNexusField(key, VIEWS.CREATE, getValues, {
                                                field: fields[key],
                                                selectValues,
                                                setFieldValue,
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                            <FormFooter>
                                <Button type="submit" appearance="primary">
                                    Submit
                                </Button>
                                <Button
                                    className="nexus-c-modal__cancel-button"
                                    appearance="danger"
                                    onClick={() => {
                                        reset();
                                        closeModal();
                                    }}
                                >
                                    Cancel
                                </Button>
                            </FormFooter>
                        </form>
                    )}
                </AKForm>
            </div>
        );
    };

    const setValueForEachField = () => {
        const current = currentData || data[0];
        Object.keys(fields).forEach(key => {
            const fieldPath = fields[key].path;
            let value = get(current, fieldPath);
            if (value === null) value = '';
            if (path === 'ratings') setFieldValue(fieldPath, value);
            else setFieldValue(`${NEXUS_ARRAY_WITH_TABS_FORM_MAPPINGS[path]}.${fieldPath}`, value);
        });
    };

    const renderFields = () => {
        const renderedFields = Object.keys(fields).map((key, index) => {
            return (
                <div key={index} className="nexus-c-nexus-array-with-tabs__field">
                    {renderNexusField(key, view, getValues, {
                        initialData: currentData || data[0],
                        field: fields[key],
                        selectValues,
                        setFieldValue,
                        config,
                        inTabs: true,
                        path,
                    })}
                </div>
            );
        });
        view === VIEWS.EDIT && setValueForEachField();
        return renderedFields;
    };

    return (
        <div className="nexus-c-nexus-array-with-tabs">
            <div className="nexus-c-nexus-array-with-tabs__tabs">
                <SideTabs
                    onChange={changeTabData}
                    data={groupedData}
                    subTabs={subTabs}
                    isRemoved={isRemoved}
                    clearIsRemoved={clearIsRemoved}
                />
            </div>
            <div className="nexus-c-nexus-array-with-tabs__fields">
                <div className="nexus-c-nexus-array-with-tabs__heading">
                    <div>
                        {view === VIEWS.EDIT && (
                            <Button
                                appearance="danger"
                                onClick={handleDeleteRecord}
                                isDisabled={!Object.keys(groupedData).length}
                            >
                                Delete Record
                            </Button>
                        )}
                    </div>
                    {view === VIEWS.EDIT && (
                        <Button onClick={openEditModal}>{NEXUS_ARRAY_WITH_TABS_ADD_BTN_LABELS[path]}</Button>
                    )}
                </div>
                <AKField name={path} defaultValue={data}>
                    {({fieldProps, error}) => <></>}
                </AKField>
                {Object.keys(groupedData).length ? renderFields() : <div>{NEXUS_ARRAY_WITH_TABS_NO_RECORDS[path]}</div>}
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
    path: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
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
